---
title: "Spring Cloud Gateway와 Eureka를 활용한 마이크로서비스 라우팅"
description: "동적 서비스 디스커버리와 API 게이트웨이 필터 체인을 통한 마이크로서비스 중앙 제어"
date: 2025-10-13
draft: false
---

- [관련 코드: sc-gateway](https://github.com/jiminu/sc-gateway)
- [관련 코드: eureka-serv](https://github.com/jiminu/eureka-serv)

MSA 환경에서 클라이언트가 개별 서비스 인스턴스의 IP/Port를 직접 호출하면 인스턴스 스케일링에 대응하기 어렵고, 인증/로깅 같은 공통 처리가 각 서비스마다 중복된다.

이를 해결하기 위해 Eureka Server로 인스턴스를 동적 등록하고, Spring Cloud Gateway로 단일 진입점을 제공하는 라우팅 인프라를 구성했다.

## Eureka를 통한 인스턴스 등록과 디스커버리

Eureka는 분산 환경에서 Service Registry 역할을 한다.

1. **자동 등록**: 마이크로서비스 부팅 시 `spring.application.name`, IP, Port를 Eureka Server에 등록한다.
2. **Heartbeat**: 클라이언트는 30초 주기로 상태 신호를 전송해 생존 상태를 갱신한다.
3. **장애 격리**: 일정 시간 동안 신호가 오지 않는 인스턴스는 레지스트리에서 자동 제외된다.

```yaml
# eureka-client 설정 예시
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true
```

## Spring Cloud Gateway 라우팅과 로드밸런싱

Spring Cloud Gateway는 Spring WebFlux 및 Netty 기반의 비동기 논블로킹 방식으로 동작한다.

Eureka에 등록된 서비스 이름을 기반으로 `lb://` 프로토콜을 설정하면 Client-side Load Balancing이 동작한다.

```yaml
# sc-gateway 라우팅 설정 예시
spring:
  cloud:
    gateway:
      routes:
        - id: user-service-route
          uri: lb://USER-SERVICE
          predicates:
            - Path=/api/v1/users/**
        - id: order-service-route
          uri: lb://ORDER-SERVICE
          predicates:
            - Path=/api/v1/orders/**
```

클라이언트는 게이트웨이 엔드포인트로만 요청을 보내고, 게이트웨이가 Eureka 레지스트리를 조회해 살아있는 인스턴스로 요청을 프록시한다.

## Filter Chain을 통한 공통 처리

Spring Cloud Gateway의 Filter Chain으로 공통 관심사를 중앙화했다.

- **Pre Filter**: JWT 토큰 검증, 공통 인증 헤더(`X-User-Id`) 주입, 분산 추적용 Trace ID 발급
- **Post Filter**: 응답 코드 및 요청 지연 시간 로깅, 보안 HTTP 헤더 추가
