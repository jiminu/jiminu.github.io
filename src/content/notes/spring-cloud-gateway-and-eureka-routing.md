---
title: "Spring Cloud Gateway와 Eureka를 활용한 마이크로서비스 라우팅"
description: "동적 서비스 디스커버리와 API 게이트웨이 필터 체인을 통한 마이크로서비스 중앙 제어"
date: 2025-10-13
draft: false
---

- [관련 코드: sc-gateway](https://github.com/jiminu/sc-gateway)
- [관련 코드: eureka-serv](https://github.com/jiminu/eureka-serv)

**마이크로서비스 아키텍처**(Microservice Architecture, MSA)에서는 비즈니스 도메인별로 수많은 독립 서비스들이 분산 실행된다. 

클라이언트가 개별 서비스의 IP와 포트를 직접 알고 통신하면 다음과 같은 문제가 생긴다.

- 서비스 인스턴스가 오토스케일링이나 배포로 동적으로 변경될 때마다 클라이언트 설정이 수정되어야 한다.
- 인증, 인가, 로깅, CORS, 레이트 리밋과 같은 공통 관심사(Cross-Cutting Concerns)를 각 서비스마다 중복 구현해야 한다.

이 문제를 해결하기 위해 **서비스 디스커버리**(Service Discovery) 서버인 **Eureka**와 **API 게이트웨이**(API Gateway)인 **Spring Cloud Gateway**를 결합한 분산 라우팅 인프라를 구축했다.

## 1. Eureka Server를 통한 동적 서비스 등록과 디스커버리

**유레카**(Eureka)는 분산 환경에서 가용성이 높은 서비스 레지스트리(Service Registry) 역할을 수행한다.

1. **서비스 자동 등록**: 개별 마이크로서비스가 구동될 때, 자신의 서비스 이름(`spring.application.name`)과 IP, 포트 정보를 Eureka Server에 등록한다.
2. **주기적 하트비트**(Heartbeat): 클라이언트는 30초 주기로 상태 신호를 전송하여 생존 여부를 알린다.
3. **비정상 인스턴스 자동 제거**: 일정 시간 동안 하트비트가 수신되지 않는 인스턴스는 레지스트리에서 자동으로 제외하여 트래픽이 유입되지 않도록 격리한다.

```yaml
# eureka-client 설정 예시
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true
```

## 2. Spring Cloud Gateway의 논블로킹 라우팅과 로드밸런싱

Spring Cloud Gateway는 Spring WebFlux 및 Netty 기반의 **비동기 논블로킹**(Asynchronous Non-blocking) 아키텍처로 동작하여, 적은 리소스로도 높은 처리량의 트래픽을 처리한다.

Eureka에 등록된 서비스 이름을 기반으로 `lb://` 프로토콜을 사용하면 클라이언트 측 로드밸런싱(Client-side Load Balancing)이 자동으로 이루어진다.

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

클라이언트는 게이트웨이의 단일 도메인(`https://api.example.com/api/v1/users/...`)으로만 요청을 보내면 되고, 게이트웨이가 Eureka 레지스트리를 조회해 현재 살아있는 인스턴스로 요청을 투명하게 포워딩한다.

## 3. 게이트웨이 필터 체인(Filter Chain)을 통한 공통 관심사 중앙화

Spring Cloud Gateway의 가장 큰 장점은 요청 처리 파이프라인 전후에 **필터 체인**(Filter Chain)을 유연하게 삽입할 수 있다는 점이다.

- **사전 필터**(Pre Filter): 요청이 마이크로서비스에 도달하기 전 JWT 토큰 유효성 검증, 공통 인증 헤더(`X-User-Id` 등) 주입, 트래픽 추적용 고유 Trace ID 발급
- **사후 필터**(Post Filter): 다운스트림 서비스로부터 전달받은 응답 코드 로깅, 전송 시간 측정, 보안 관련 HTTP 헤더 일괄 추가

개별 비즈니스 서비스는 인증이나 네트워크 라우팅에 신경 쓰지 않고 순수 비즈니스 로직에만 집중할 수 있게 된다.
