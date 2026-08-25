---
title: "외판원 문제를 위한 보로노이 기반 발견적 해법"
description: "Voronoi Diagram과 Delaunay 삼각분할을 활용한 대규모 TSP 근사 최적화"
date: 2022-06-27
draft: false
thumbnail: "/images/tsp-with-vd/overview.png"
---

외판원 문제(TSP)는 모든 노드를 한 번씩 방문하고 시작점으로 돌아오는 최단 순회 경로를 찾는 NP-hard 문제다.

이 프로젝트에서는 Voronoi Diagram의 쌍대 그래프인 Delaunay Triangulation의 기하학적 성질을 활용해 탐색 간선 수를 줄이고, 2-Approximation 및 Christofides(1.5-Approximation) 알고리즘으로 생성한 경로를 유전 알고리즘(GA)의 초기해로 활용하는 파이프라인을 구현했다.

![TSPLIB 벤치마크 데이터셋의 순회 경로 시각화](/images/tsp-with-vd/overview.png)

## Delaunay 삼각분할을 통한 간선 수 축소

2D 평면의 $n$개 점 사이의 모든 연결을 고려하면 완전 그래프의 간선 수는 $\frac{n(n-1)}{2}$개로 $O(n^2)$다. 노드가 수만 개로 커지면 메모리와 연산량 부담이 커진다.

Delaunay 삼각분할 그래프는 유클리드 평면의 최소 신장 트리(MST)를 항상 포함한다. Delaunay 삼각분할을 사용하면 간선 수를 $3n - 3 - k$개($k$는 Convex Hull 점 개수)로 줄여 $O(n)$ 수준으로 유지하면서도, 최적 순회 경로에 필요한 주요 간선을 보존할 수 있다.

![보로노이 다이어그램과 들로네 삼각분할](/images/tsp-with-vd/delaunay.png)

## 근사 알고리즘 파이프라인

Delaunay 그래프를 기반으로 두 가지 근사 알고리즘을 적용했다.

### 1. 2-Approximation
1. Delaunay 삼각분할에서 MST를 구한다.
2. 트리의 간선을 두 번 순회해 오일러 회로를 만든다.
3. 방문한 정점을 건너뛰며 해밀턴 회로로 변환한다.
- 삼각 부등식을 만족하는 평면에서 최적해의 2배 이내 경로 길이를 보장한다.

### 2. Christofides (1.5-Approximation)
1. Delaunay 기반 MST에서 홀수 차수 정점을 추출한다.
2. 해당 정점들 사이의 최소 가중치 완전 매칭을 구한다.
3. MST와 매칭 간선을 결합해 오일러 회로를 만든 뒤 해밀턴 회로로 변환한다.
- 이론상 최적해의 1.5배 이내 경로 길이를 보장한다.

![근사 알고리즘으로 생성된 해밀턴 순회 경로](/images/tsp-with-vd/circuit.png)

## 유전 알고리즘(GA) 결합

무작위 초기해에서 시작하는 GA는 수렴까지 많은 세대가 필요하다. 근사 알고리즘으로 생성한 준최적해를 GA의 초기 모집단으로 넣어 수렴 속도와 최종 경로 품질을 개선했다.

## TSPLIB 벤치마크 결과

TSPLIB 데이터셋(144개 노드의 `pr144`부터 33,810개 노드의 `pla33810`까지)에서 성능을 측정했다.

- **1.5-Approximation**: 33,810개 노드 기준 약 23초에 최적해 대비 평균 1.12배(12% 오차) 경로를 생성했다.
- **2-Approximation**: 평균 1.42배 수준의 경로를 생성했으며, 수만 개 노드에서도 1초 내외로 동작했다.
