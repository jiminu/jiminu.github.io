---
title: "Winged-Edge 자료구조로 기하 다이어그램의 위상 관계를 다루는 방법"
description: "면, 간선, 정점 간의 인접 관계를 포인터 8개로 O(1)에 탐색하는 위상 자료구조"
date: 2022-02-11
draft: false
project: voronoi-diagram
---

보로노이 다이어그램이나 3D 메쉬를 다룰 때 가장 빈번하게 필요한 작업은 인접한 요소들을 탐색하는 것이다. 예를 들어 "한 면(Face)을 둘러싸고 있는 간선들을 시계 방향으로 나열하라"거나 "한 정점(Vertex)을 공유하는 모든 면을 찾아라" 같은 질의다.

정점이나 면 중심의 단순 리스트 구조를 사용하면 이러한 위상 질의를 수행할 때마다 전체 요소를 검색해야 해 O(N)의 비용이 든다. 이 문제를 해결하기 위해 도입한 것이 **Winged-Edge 자료구조**다.

## 간선(Edge)을 중심에 두고 날개를 단다

Winged-Edge 구조의 핵심은 **간선(Edge)**이 다이어그램의 모든 연결 고리를 쥐고 있다는 점이다.

간선 하나는 다음과 같은 정보를 담는다.

```cpp
struct Edge {
    Vertex* startVertex;
    Vertex* endVertex;
    Face* leftFace;
    Face* rightFace;

    // 네 개의 날개(Wing) 포인터
    Edge* leftHand;   // leftFace에서 startVertex 방향으로 이어지는 간선
    Edge* leftLeg;    // leftFace에서 endVertex 방향으로 이어지는 간선
    Edge* rightHand;  // rightFace에서 startVertex 방향으로 이어지는 간선
    Edge* rightLeg;   // rightFace에서 endVertex 방향으로 이어지는 간선
};
```

반면 정점(Vertex)과 면(Face)은 자신과 연결된 **임의의 간선 단 하나(First Edge)**에 대한 포인터만 갖는다.

```cpp
struct Vertex {
    double x, y;
    Edge* firstEdge;
};

struct Face {
    Edge* firstEdge;
};
```

## 면을 둘러싼 간선들을 O(k)만에 순회하기

특정 Face의 경계 간선(Bounding Edges)들을 순서대로 탐색하는 과정은 다음과 같이 진행된다.

1. 해당 Face의 `firstEdge`에서 출발한다.
2. 현재 간선에서 탐색 중인 Face가 `leftFace`인지 `rightFace`인지 확인한다.
3. `leftFace`라면 다음 간선으로 `leftLeg`(또는 `leftHand`)를 따라가고, `rightFace`라면 `rightLeg`(또는 `rightHand`)를 따라간다.
4. 다시 `firstEdge`로 돌아올 때까지 반복한다.

모든 단계가 포인터 참조 하나(O(1))로 이루어지므로, k개의 간선으로 둘러싸인 면의 경계를 순회하는 데 걸리는 시간은 정확히 O(k)다.

## 기하학적 좌표와 위상 연결성의 분리

기하 알고리즘을 구현할 때 좌표 계산(수학적 기하)과 연결 관계(위상 구조)가 한데 뒤섞이면 코드가 급격히 복잡해지고 버그를 잡기 어려워진다.

Winged-Edge를 사용하면 점의 위치 이동이나 기하 연산은 Vertex 좌표만 수정하면 되고, 다이어그램의 분할과 병합은 Edge의 8개 포인터만 재연결하면 된다. 기하와 위상의 책임을 깔끔하게 나눌 수 있다는 점에서 대규모 기하 다이어그램 처리에 큰 장점을 가진 구조다.
