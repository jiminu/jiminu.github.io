---
title: "Factory Tycoon"
description: "IoT 센서와 AWS 데이터 파이프라인으로 구현한 스마트 팩토리 운영 시뮬레이션"
date: 2026-01-23
draft: false
thumbnail: "/images/factory-tycoon/overview.png"
---

[GitHub 조직에서 보기](https://github.com/factorytycoon)

Factory Tycoon은 공장 설비와 센서 데이터를 실시간으로 확인하고, 이상 감지와 AI 분석을 통해 운영 판단을 돕는 스마트 팩토리 시뮬레이션이다. 7인 팀으로 웹 애플리케이션부터 IoT 데이터 수집, 클라우드 인프라와 배포 환경까지 구성했다.

![Factory Tycoon 메인 화면](/images/factory-tycoon/overview.png)

## 서비스 구성

프론트엔드는 React와 Three.js로 공장과 설비를 시각화한다. Spring Boot 서비스가 공장, 설비, 작업 데이터를 관리하고, FastAPI WebSocket 서버가 Redis Pub/Sub의 센서 데이터를 브라우저에 전달한다.

![Factory Tycoon 클라우드 아키텍처](/images/factory-tycoon/architecture.png)

센서 데이터는 MQTT로 AWS IoT Core에 들어온다. Lambda는 최신값과 시계열 데이터를 ElastiCache에 저장하고, 분석과 장기 조회를 위해 MongoDB와 OpenSearch로 분리해 전달한다. 프론트엔드는 S3와 CloudFront로 제공하고 백엔드 서비스는 EKS에 배포했다.

## 담당한 부분

클라우드 인프라와 백엔드를 중심으로 참여했다.

- Terraform으로 VPC, EKS, ElastiCache, IoT Core, Lambda, OpenSearch, S3와 CloudFront 구성
- Helm과 ArgoCD를 이용한 서비스별 배포 및 GitHub Actions 기반 CI/CD 구성
- Redis Pub/Sub와 WebSocket을 이용한 실시간 센서 및 알림 전달 경로 구현
- Spring Boot 백엔드와 OpenSearch, Bedrock 연동, 인증과 데이터 처리 기능 개발
- 팀의 로컬 개발 및 배포 환경 정리

## 실시간 처리와 분석 경로 분리

하나의 저장 방식으로 실시간 화면 갱신과 분석 조회를 모두 처리하지 않았다. 현재 상태와 WebSocket 전달에는 Redis를 사용하고, 이력 조회와 이상 감지에는 MongoDB와 OpenSearch를 사용했다. 이를 통해 실시간 모니터링 경로와 배치 처리, 검색 작업이 서로의 처리 방식을 강제하지 않도록 구성했다.

![Factory Tycoon 이상 감지 화면](/images/factory-tycoon/anomaly-detection.png)

OpenSearch의 이상 감지와 알림 결과는 설비별 이벤트로 제공한다. Bedrock 기반 AI 컨설턴트는 공장, 설비, 재고, 알림 데이터를 함께 조회해 현재 상태를 설명하고 확인할 작업을 제안한다.

![Factory Tycoon AI 컨설턴트 화면](/images/factory-tycoon/ai-assistant.png)

## 결과와 회고

실제 센서에서 시작한 데이터를 클라우드로 수집하고 웹 화면에서 실시간으로 확인하는 전체 흐름을 연결했다. 인프라를 Terraform으로 관리하고 애플리케이션 배포를 Helm과 ArgoCD로 분리해 서비스 구성을 반복해서 재현할 수 있게 했다.

프로젝트 이후 과제로는 더 많은 장치와 이벤트를 고려한 메시지 처리 구조, 이상 감지 기준의 정교화, 배포와 운영 자동화 확대를 남겼다.
