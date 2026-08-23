---
title: "실시간 WebSocket 전달에 Redis Streams 대신 Pub/Sub을 선택한 이유"
description: "센서 데이터의 실시간 브로드캐스트와 이벤트 보증의 책임을 분리한 기록"
date: 2026-01-06
draft: false
project: factory-tycoon
---

[관련 코드](https://github.com/factorytycoon/factory-tycoon-backend-websocket)

Factory Tycoon에서는 센서 데이터 수집, 이상 감지, 브라우저 화면 갱신 등 다양한 데이터 전달 경로가 존재했다. 메시지 처리 추적과 유실 방지가 필요한 백엔드 처리 파이프라인에는 Redis Streams를 활용했지만, 접속 중인 사용자에게 실시간 상태를 브로드캐스트하는 WebSocket 경로에는 다른 접근이 필요했다.

## WebSocket 전달에도 처음에는 Streams를 고려했다

초기에는 일관성을 위해 WebSocket 서버도 Streams의 Consumer Group에 붙여 `XREADGROUP`으로 메시지를 읽고 `XACK`으로 처리하도록 구성했다.

```python
messages = redis_client.xreadgroup(
    groupname=group,
    consumername=consumer,
    streams={stream_key: ">"},
    count=100,
    block=100,
)

for message_id, message in messages:
    await manager.broadcast(json.dumps(message))
    redis_client.xack(stream_key, group, message_id)
```

Streams는 소비자가 잠시 중단돼도 미처리 메시지를 다시 읽을 수 있고 ACK 여부도 추적할 수 있다. 작업 큐나 반드시 완료해야 하는 이벤트 처리에는 필수적인 성질이다.

하지만 실시간 화면 갱신을 담당하는 WebSocket 서버는 메시지를 영속적으로 보관하거나 가공하는 주체가 아니었다. 현재 접속해 있는 브라우저에 최신 상태를 즉시 뿌려주는 것이 유일한 역할이었고, 이력 저장과 분석은 별도 저장소와 파이프라인에서 처리하고 있었다.

이 경로에서 Streams를 유지하면 접속자가 없을 때도 메시지 상태를 추적해야 하고, 재접속 시 과거의 찰나 데이터까지 불필요하게 쏟아져 들어오는 문제가 있었다.

## 화면 전달 경로에는 단순한 Fan-out이 맞았다

WebSocket 경로에 필요한 것은 메시지 재처리가 아니라 가벼운 채널 구독과 fan-out이었다. 따라서 화면 전달 경로에서는 Consumer Group과 ACK 오버헤드를 제거하고 Redis Pub/Sub을 사용하도록 역할을 분리했다.

```python
pubsub.subscribe(sensor_channel, alert_channel)

message = pubsub.get_message(
    ignore_subscribe_messages=True,
    timeout=0.1,
)

if message:
    await manager.broadcast(message["data"])
```

센서 데이터와 설비 알림은 채널을 나누어 각각의 WebSocket 연결 관리자에 전달했다. 서버는 구독 이후 도착한 실시간 데이터만 접속 중인 클라이언트에 즉시 전달한다.

## 전달 보장 수준에 따른 책임 분리

Pub/Sub은 구독자가 없거나 연결이 끊긴 동안의 메시지를 보관하지 않는다. ACK와 재처리도 없다. 따라서 유실되면 안 되는 핵심 데이터 파이프라인에는 적합하지 않다.

이 프로젝트에서는 시스템 전체를 하나의 메시징 방식으로 통일하지 않고, 경로의 성격에 맞춰 책임을 나눴다.

- **이벤트 추적 및 백엔드 처리 파이프라인**: 메시지 유실 방지와 소비자 관리가 가능한 Redis Streams 활용
- **실시간 웹 화면 브로드캐스트**: 가볍고 지연이 없는 Redis Pub/Sub 활용
- **이력 분석과 장기 조회**: MongoDB 및 OpenSearch 활용

선택의 핵심은 각 경로가 요구하는 전달 보장 수준을 정확히 파악하고, 불필요한 보증 기능을 덜어내어 서버를 단순하게 유지하는 것이었다.
