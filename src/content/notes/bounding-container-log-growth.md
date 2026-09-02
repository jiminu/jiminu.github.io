---
title: "Docker 운영 로그가 디스크를 채우기 전에 막는 세 겹의 보존 정책"
description: "애플리케이션 파일 로그, Docker JSON 로그, systemd journal을 함께 제한해야 하는 이유"
date: 2026-08-23
draft: true
---

운영 서버의 디스크 사용률이 빠르게 오를 때 애플리케이션 로그만 확인하면 원인을 놓치기 쉽다. 컨테이너 기반 서비스에서는 적어도 세 경로가 독립적으로 디스크를 사용한다.

- 애플리케이션이 파일로 남기는 로그
- Docker가 stdout과 stderr를 저장하는 JSON 로그
- 운영체제가 남기는 systemd journal

한 경로에 보존 정책을 넣었다고 나머지 경로가 멈추는 것은 아니다. 이 글은 로그가 디스크를 채운 상황에서 저장 경로를 분리해 진단하고, 각각에 맞는 상한을 두는 방법을 정리한다.

## 먼저 어느 로그가 쓰고 있는지 확인한다

디스크가 가득 찼다고 Docker의 데이터 디렉터리를 넓게 지우면 안 된다. `overlay2`에는 실행 중인 컨테이너의 쓰기 레이어가 있으므로, 무심코 지우면 애플리케이션 파일 시스템이나 Docker 메타데이터를 망가뜨릴 수 있다.

먼저 상위 디렉터리별 사용량을 본다.

```bash
df -h /
sudo du -xhd1 /var | sort -h
sudo du -xhd1 /var/lib/docker | sort -h
sudo du -xhd1 /var/log | sort -h
```

컨테이너 stdout 로그는 실행 중인 컨테이너에서 정확한 파일을 얻는다.

```bash
docker inspect --format '{{.LogPath}}' my-api
```

이 경로를 확인한 뒤에만 파일 크기나 보존 정책을 다룬다. 컨테이너 ID를 추측하거나 `overlay2`의 오래된 디렉터리처럼 보이는 항목을 직접 지우는 방식은 피한다.

## 긴급 복구는 로그 경로별로 한다

운영 중에는 공간을 먼저 회복해야 할 때가 있다. 이때도 서비스 데이터가 아니라 이미 확인한 로그 파일만 대상으로 삼는다.

Docker JSON 로그는 파일 경로를 확인한 뒤 비울 수 있다. 이 방법은 컨테이너를 재시작하지 않지만, 기존 stdout/stderr 기록은 사라진다. 따라서 장애 원인에 필요한 내용은 먼저 별도 보관하거나, 로그가 정말 공간을 차지하는지 확인한 뒤 사용해야 한다.

systemd journal은 회전 뒤 용량 상한까지 정리할 수 있다.

```bash
sudo journalctl --rotate
sudo journalctl --vacuum-size=300M
```

이 역시 과거 journal을 삭제한다. 목적은 “모든 로그를 보관”하는 것이 아니라, 서비스 복구에 필요한 최근 로그와 서버가 계속 동작할 공간을 함께 남기는 것이다.

## 애플리케이션 파일 로그는 애플리케이션이 관리한다

애플리케이션이 날짜별 파일 로그를 만들면 로그 프레임워크의 롤링 정책에 다음 세 가지를 둔다.

- 파일 하나의 최대 크기
- 날짜별 보존 기간
- 전체 로그 디렉터리의 최대 크기

중요한 것은 로그가 컨테이너의 임시 쓰기 레이어가 아니라 호스트의 명시적인 경로에 남도록 하는 것이다. Docker bind mount를 사용하면 컨테이너를 새로 만들더라도 로그의 위치와 보존 책임을 예측할 수 있다.

임시로 날짜 형식 디렉터리를 지우는 cron을 둘 수는 있다. 다만 이는 배포 설정이 정리되기 전의 안전망이다. 경로, 이름 패턴, 보존 기간을 모두 제한하고 현재 로그 파일은 제외해야 한다.

## Docker JSON 로그는 별도로 회전한다

애플리케이션이 파일 로그를 잘 회전해도 `docker logs`로 보는 stdout/stderr는 별도의 파일로 계속 커진다. 컨테이너 실행 옵션에서 상한을 주는 방법이 가장 명확하다.

```bash
docker run \
  --log-driver json-file \
  --log-opt max-size=20m \
  --log-opt max-file=5 \
  my-api
```

Docker의 JSON 파일은 Docker daemon이 관리하는 파일이다. 외부 도구로 파일을 회전하거나
`copytruncate`하는 방식은 daemon의 로그 처리와 충돌하거나 일부 로그를 잃을 수 있으므로, 상시
정책으로 사용하지 않는다. 새 컨테이너부터 `--log-opt` 또는 Docker daemon 설정으로 회전을
고정하는 편이 안전하다.

`max-size=20m`, `max-file=5`라면 컨테이너 하나의 Docker JSON 로그 상한은 대략 100MiB다.
이 값은 애플리케이션 파일 로그와 journal을 포함하지 않으므로, 디스크 여유 공간을 계산할 때
세 경로의 상한을 합산해야 한다.

daemon의 기본 logging driver를 바꿔도 기존 컨테이너에는 자동 적용되지 않는다. 배포 때 새
컨테이너를 만든 뒤 아래처럼 실제 설정을 확인한다.

```bash
docker inspect my-api --format '{{json .HostConfig.LogConfig}}'
docker inspect my-api --format '{{json .Mounts}}'
```

## journal도 영구 상한을 둔다

한 번의 `vacuum`은 응급 조치일 뿐이다. journal의 최대 사용량을 설정하지 않으면 시간이 지나 다시 커진다.

```ini
# /etc/systemd/journald.conf.d/size.conf
[Journal]
SystemMaxUse=300M
RuntimeMaxUse=100M
```

설정을 적용한 뒤에는 journal 서비스를 다시 시작하고 현재 사용량을 확인한다.

```bash
sudo systemctl restart systemd-journald
journalctl --disk-usage
```

## 세 정책은 서로 대체하지 않는다

정리하면 책임이 다르다.

| 저장 경로 | 주된 책임 | 권장 제어 방식 |
| --- | --- | --- |
| 애플리케이션 파일 로그 | 요청·도메인 오류·진단 | 롤링 정책, 보존 기간, 총량, bind mount |
| Docker JSON 로그 | stdout/stderr | `max-size`, `max-file` 또는 logrotate |
| systemd journal | OS·서비스 관리자 로그 | `SystemMaxUse`, `RuntimeMaxUse` |

여기에 디스크 사용률 알림을 더해야 한다. 로그 정책은 정상 경로의 증가량을 제한하고, 알림은 예상보다 빠르게 증가하는 새로운 경로를 발견하게 해 준다.

운영 로그 관리의 목표는 로그를 최소화하는 것이 아니다. 필요한 최근 진단 정보는 남기되, 어떤 경로도 서비스가 사용할 디스크 전체를 독점하지 못하게 만드는 것이다.

## 적용 뒤에는 정책과 실제 사용량을 함께 확인한다

설정 파일만 존재한다고 상한이 적용된 것은 아니다. 새 컨테이너의 log driver와 bind mount,
journal의 현재 사용량, 루트 디스크 여유 공간을 같은 배포 점검에서 확인한다.

```bash
docker inspect my-api --format '{{json .HostConfig.LogConfig}}'
docker inspect my-api --format '{{json .Mounts}}'
journalctl --disk-usage
df -h /
```

긴급 정리 명령은 과거 로그를 삭제하는 복구 수단이고, 회전·보존 설정은 재발 방지 수단이다.
둘을 구분해 runbook에 기록하면 장애 중에도 삭제 범위와 복구 후 확인 항목을 빠뜨리지 않는다.

## 참고 자료

- [Docker JSON File logging driver](https://docs.docker.com/engine/logging/drivers/json-file/)
