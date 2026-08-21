---
title: "Redis Streams에서 Pub/Sub으로 바꾼 이유"
description: "WebSocket 실시간 전달 경로에 필요한 보장 수준을 다시 정리한 기록"
date: 2026-01-06
draft: false
---

[관련 코드](https://github.com/factorytycoon/factory-tycoon-backend-websocket)

Factory Tycoon에서는 센서 데이터와 설비 알림을 접속 중인 브라우저에 WebSocket으로 전달해야 했다. 처음에는 Redis Streams를 사용했지만, 구현을 진행하면서 이 경로가 실제로 필요로 하는 기능과 맞지 않는 부분이 보였다.

## 처음에는 Streams를 사용했다

초기 서버는 Consumer Group을 만들고 `XREADGROUP`으로 메시지를 읽은 뒤 처리한 항목을 `XACK`으로 확인했다.

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

Streams는 소비자가 잠시 중단돼도 남은 메시지를 다시 처리할 수 있고, ACK 여부도 추적할 수 있다. 작업 큐나 반드시 처리해야 하는 이벤트에는 필요한 성질이다.

하지만 이 WebSocket 서버는 메시지를 저장하거나 가공하는 주체가 아니었다. 현재 접속한 클라이언트에 최신 센서 상태를 전달하는 것이 주된 역할이었고, 이력 저장과 검색은 MongoDB와 OpenSearch 경로에서 따로 처리했다.

## 전달 경로의 책임을 줄였다

요구사항을 다시 나누니 WebSocket 경로에서 필요한 것은 메시지 재처리가 아니라 채널 구독과 fan-out이었다. Consumer Group과 ACK를 제거하고 Redis Pub/Sub 채널을 구독하도록 바꿨다.

```python
pubsub.subscribe(sensor_channel, alert_channel)

message = pubsub.get_message(
    ignore_subscribe_messages=True,
    timeout=0.1,
)

if message:
    await manager.broadcast(message["data"])
```

센서 데이터와 알림은 채널을 나누고 각각 별도의 WebSocket 연결 관리자에 전달했다. 서버는 구독 이후 도착한 데이터를 접속 중인 클라이언트에 그대로 보낸다.

## 단순해진 만큼 포기한 것도 있다

Pub/Sub은 구독자가 없거나 서버가 중단된 동안의 메시지를 보관하지 않는다. ACK와 재처리도 없다. 따라서 유실되면 안 되는 작업이나 과거 이벤트를 다시 읽어야 하는 기능에는 이 구조를 그대로 사용할 수 없다.

이 프로젝트에서는 실시간 화면 전달과 데이터 보관의 책임을 분리했다. 현재 상태 전달은 Pub/Sub과 WebSocket이 맡고, 이력과 분석은 별도 저장소가 맡는다. 실시간 전달 서버에 영속성까지 넣지 않아도 된 이유다.

선택 기준은 결국 전달 보장 수준이다. 현재 접속자에게 최신 상태를 알리는 경로라면 Pub/Sub이 간단하다. 소비자별 처리 상태와 재시도가 필요하면 Streams가 맞다. 처리량이 커지고 여러 서비스가 같은 이벤트를 독립적으로 재생해야 한다면 Kafka 같은 로그 기반 시스템을 검토할 수 있다.
