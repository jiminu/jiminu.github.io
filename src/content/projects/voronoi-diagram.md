---
title: "Winged-Edge 자료구조 기반 보로노이 다이어그램 구현"
description: "위상 기하학적 인접 관계를 O(1)에 탐색하는 자료구조와 2D 평면 보로노이 분할"
date: 2022-02-11
draft: false
thumbnail: "/images/voronoi-diagram/overview.png"
---

보로노이 다이어그램(Voronoi Diagram)은 2차원 평면 위의 시드 점(Generator Points) 집합이 주어졌을 때, 각 점에서 가장 가까운 영역들로 평면을 분할하는 기하학적 구조다. 들로네 삼각분할, 최소 신장 트리(MST), 볼록 껍질(Convex Hull), 최근접 점 쌍 탐색 등 다양한 기하 문제를 해결하는 핵심 기반으로 활용된다.

이 프로젝트에서는 점, 간선, 면의 위상학적 인접 관계를 상수 시간 O(1)에 탐색할 수 있는 **Winged-Edge 자료구조**를 설계하고, C++로 2차원 보로노이 다이어그램 생성 및 Bounding Edge 순회 알고리즘을 구현했다.

![1000개 점에 대한 2차원 보로노이 다이어그램 생성 결과](/images/voronoi-diagram/overview.png)

## 위상 관계를 다루기 위한 Winged-Edge 자료구조 설계

보로노이 다이어그램은 n개의 시드 점에 대해 n + 1개의 면(Face), 최대 2n - 2개의 정점(Vertex), 최대 3n - 3개의 간선(Edge)을 갖는다.

평면 분할 알고리즘에서는 "어떤 면을 둘러싸고 있는 간선들을 순서대로 찾기", "특정 정점에 인접한 면들을 시계 방향으로 탐색하기" 같은 작업이 끊임없이 발생한다. 단순 배열이나 인접 행렬로는 이러한 기하 위상 순회에 많은 비용이 든다.

간선(Edge) 중심의 Winged-Edge 자료구조를 구성해 이를 해결했다.

- **Vertex**: 좌표값과 해당 정점을 시작점으로 갖는 첫 번째 Edge 포인터
- **Face**: 면을 구성하는 첫 번째 Edge 포인터
- **Edge**: 시작 및 끝 정점, 좌측 및 우측 Face, 그리고 양쪽 면에서 이어지는 4개의 날개 간선(`Left/Right Hand`, `Left/Right Leg`) 포인터

## 경계 간선(Bounding Edges) 추적과 Unbounded Edge 처리

자료구조의 포인터를 따라가면 임의의 Face를 둘러싼 Bounding Edges를 간선 개수 k에 비례하는 O(k) 시간에 한 바퀴 순회할 수 있다.

![임의 Face의 Bounding Edges 순회 및 경계 폴리곤 탐색](/images/voronoi-diagram/bounding-edges.png)

평면의 외곽에 위치한 영역들은 무한히 뻗어나가는 Unbounded Edge를 갖는다. 가상 바운더리 박스(Boundary Polygon)와의 교점을 계산하여 외곽 간선들을 유한한 영역으로 클리핑하고, 전체 평면의 위상적 무결성을 유지하도록 처리했다.

## 기하 연산과 위상 구조의 분리

기하학적 좌표(Geometry) 계산과 면, 간선 간의 연결 관계(Topology)를 명확히 분리함으로써 복잡한 2D 평면 분할 구조를 안정적으로 유지할 수 있었다. 이 프로젝트에서 구축한 Winged-Edge 기반 기하 다이어그램 구조는 이후 외판원 문제(TSP) 근사 최적화 프로젝트의 핵심 기반으로 이어졌다.
