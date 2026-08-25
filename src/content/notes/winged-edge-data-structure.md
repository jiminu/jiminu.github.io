---
title: "Winged-Edge 자료구조로 기하 다이어그램의 위상 관계를 다루는 방법"
description: "Face, Edge, Vertex 간의 인접 관계를 포인터 8개로 O(1)에 탐색하는 위상 자료구조"
date: 2022-02-11
draft: false
project: voronoi-diagram
---

Voronoi Diagram이나 3D 메쉬를 다룰 때 가장 빈번하게 필요한 작업은 인접 요소 탐색이다. 예를 들어 "한 Face를 둘러싼 Edge들을 시계 방향으로 나열"하거나 "한 Vertex를 공유하는 모든 Face를 찾는" 작업이다.

Vertex나 Face 중심의 단순 리스트 구조를 사용하면 이러한 위상 질의마다 전체 요소를 검색해야 해 $O(N)$의 비용이 든다. 이를 $O(1)$ 포인터 탐색으로 해결하기 위해 Winged-Edge 자료구조를 사용했다.

## Edge 중심 구조 정의

Winged-Edge 구조의 핵심은 Edge가 Vertex, Face, 인접 Edge의 연결 정보를 모두 들고 있다는 점이다.

Edge 하나는 다음 정보를 갖는다.

```cpp
struct Edge {
    Vertex* startVertex;
    Vertex* endVertex;
    Face* leftFace;
    Face* rightFace;

    // 4개의 Wing 포인터
    Edge* leftHand;   // leftFace에서 startVertex 방향으로 이어지는 Edge
    Edge* leftLeg;    // leftFace에서 endVertex 방향으로 이어지는 Edge
    Edge* rightHand;  // rightFace에서 startVertex 방향으로 이어지는 Edge
    Edge* rightLeg;   // rightFace에서 endVertex 방향으로 이어지는 Edge
};
```

Vertex와 Face는 자신과 연결된 시작 Edge(`firstEdge`) 포인터 하나만 유지한다.

```cpp
struct Vertex {
    double x, y;
    Edge* firstEdge;
};

struct Face {
    Edge* firstEdge;
};
```

## Face의 Bounding Edges 순회

특정 Face의 경계 Edge들을 순서대로 탐색하는 과정은 다음과 같다.

1. 해당 Face의 `firstEdge`에서 출발한다.
2. 현재 Edge에서 탐색 중인 Face가 `leftFace`인지 `rightFace`인지 확인한다.
3. `leftFace`라면 다음 Edge로 `leftLeg`(또는 `leftHand`)를 따라가고, `rightFace`라면 `rightLeg`(또는 `rightHand`)를 따라간다.
4. 다시 `firstEdge`로 돌아올 때까지 반복한다.

모든 단계가 포인터 참조($O(1)$)로 이루어지므로, $k$개의 Edge로 둘러싸인 Face의 경계를 순회하는 데 걸리는 시간은 $O(k)$다.

## Geometry와 Topology 분리

기하 알고리즘에서 Geometry와 Topology가 섞이면 코드가 복잡해진다.

Winged-Edge를 사용하면 점의 위치 이동은 Vertex 좌표만 수정하면 되고, 다이어그램의 분할과 병합은 Edge의 포인터만 재연결하면 된다. Geometry 연산과 Topology 탐색의 책임을 분리할 수 있다.
