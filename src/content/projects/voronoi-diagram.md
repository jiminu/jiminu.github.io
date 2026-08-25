---
title: "Winged-Edge 자료구조 기반 보로노이 다이어그램 구현"
description: "위상 기하학적 인접 관계를 O(1)에 탐색하는 자료구조와 2D 평면 보로노이 분할"
date: 2022-02-11
draft: false
thumbnail: "/images/voronoi-diagram/overview.png"
---

Voronoi Diagram은 2D 평면의 시드 점 집합에서 각 점에 가장 가까운 영역들로 평면을 분할하는 구조다. Delaunay 삼각분할, 최소 신장 트리(MST), Convex Hull 계산 등에 쓰인다.

이 프로젝트에서는 Face, Edge, Vertex의 인접 관계를 $O(1)$에 탐색할 수 있는 Winged-Edge 자료구조를 설계하고, C++로 2D Voronoi Diagram 생성과 Bounding Edge 순회 알고리즘을 구현했다.

![1000개 점에 대한 2차원 보로노이 다이어그램 생성 결과](/images/voronoi-diagram/overview.png)

## Winged-Edge 자료구조

$n$개의 시드 점이 있을 때 Voronoi Diagram은 $n + 1$개의 Face, 최대 $2n - 2$개의 Vertex, 최대 $3n - 3$개의 Edge를 갖는다.

특정 Face를 둘러싼 Edge 목록을 순서대로 찾거나, 특정 Vertex에 인접한 Face들을 순회하려면 인접 요소 간의 포인터 연결이 필요하다. Edge가 연결 정보를 관리하는 Winged-Edge 구조로 이를 처리했다.

- **Vertex**: 좌표값과 해당 정점에서 나가는 첫 번째 Edge(`firstEdge`) 포인터
- **Face**: 영역을 구성하는 시작 Edge(`firstEdge`) 포인터
- **Edge**: 시작 및 끝 Vertex, 좌우 Face, 좌우 Face의 양쪽 날개 Edge 포인터 4개(`leftHand`, `leftLeg`, `rightHand`, `rightLeg`)

## Bounding Edge 순회와 Unbounded Edge 처리

Face의 `firstEdge`에서 시작해 Wing 포인터를 따라가면, Face를 둘러싼 $k$개의 경계 Edge를 $O(k)$에 순회할 수 있다.

![임의 Face의 Bounding Edges 순회 및 경계 폴리곤 탐색](/images/voronoi-diagram/bounding-edges.png)

평면 외곽 영역은 무한히 뻗어나가는 Unbounded Edge를 갖는다. 가상 바운더리 박스(Boundary Polygon)와의 교점을 계산해 외곽 Edge를 유한한 영역으로 클리핑했다.
