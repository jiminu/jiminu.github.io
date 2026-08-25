---
title: "대규모 위성 충돌 방지를 위한 Three-filter 궤도 근접 탐색 최적화"
description: "SGP4 궤도 전파와 kd-tree 기하 해싱을 결합해 24,000+개 우주물체의 All-vs-All 충돌 위험 탐색을 96% 사전 차단"
date: 2023-12-14
draft: false
thumbnail: "/images/three-filter/overview.png"
---

저궤도(LEO) 우주물체 수가 증가하면서, 위성 간 충돌 위험 평가의 연산 비용이 병목이 된다.

우주물체가 $N$개일 때 전체 쌍(All-vs-All) 충돌 검사는 $\binom{N}{2} \approx \frac{N^2}{2}$개의 조합을 계산해야 한다. 2만 개만 있어도 약 2.16억 회의 궤도 교차 계산이 발생한다.

이 프로젝트에서는 Three-filter 알고리즘(Perigee-Apogee, Orbit Path, Time Filter)에 kd-tree 공간 분할과 Bisection 수치 탐색을 결합해, 비충돌 쌍의 96% 이상을 사전 필터링하고 연산 시간을 58% 단축했다.

![Three-filter 및 기하 해싱 기반 근접 위험 평가 파이프라인 개요](/images/three-filter/overview.png)

## Three-filter 파이프라인

모든 물체의 정밀 위치를 매초 전수 계산하는 대신, 궤도 기하 특성을 이용해 비충돌 쌍을 단계별로 소거한다.

1. **Perigee-Apogee Filter**: 두 타원 궤도의 근지점($q$)과 원지점($Q$) 고도 차이가 임계 거리 $D$보다 크면($q - Q > D$), 시간 계산 없이 제외한다.
2. **Orbit Path Filter**: 3차원 공간에서 두 궤도 평면의 교차선 부근 최단 기하 거리($r_{rel}$)를 계산한다. 최소 거리가 $D$보다 멀면 영구히 만나지 않으므로 제외한다.
3. **Time Filter**: 궤도상 최근접 위치를 두 물체가 통과하는 시간 구간 $[t_0, t_1]$이 일치하는지 판별한다. 공간 교차점을 지나더라도 도달 시간대가 다르면 제외한다.

![Three-filter 3단계 기하 및 시간 필터 다이어그램](/images/three-filter/filter-perigee-apogee.png)

## kd-tree 공간 분할과 Bisection 탐색

Time Filter 단계에서 전파된 3차원 위치 데이터를 빠르게 검색하기 위해 kd-tree를 적용했다.

물체의 최대 이동 속도($v_{max} \approx 10\text{km/s}$)와 샘플링 시간 간격($\Delta t$)을 고려해 탐색 반경 $D_F$를 설정한다.

$$D_F = (2 \times v_{max} \times \Delta t) + D_{critical}$$

- **kd-tree 공간 분할**: 3차원 좌표 데이터를 $X, Y, Z$ 축 기준으로 재귀 분할해 $O(\log N)$ 반경 탐색 트리를 구성했다.
- **Bisection 최근접 시점 수렴**: $D_F$ 반경 내에 진입한 후보 쌍에 대해서만 이분법을 적용해 오차 0.001초 이하로 최근접 접근 시점(TCA)과 최단 거리($d_{min}$)를 정밀 계산했다.

![3차원 kd-tree 공간 분할 및 반경 탐색 구조](/images/three-filter/kdtree.png)

## 20,800개 LEO 데이터셋 벤치마크

Space-Track의 TLE 궤도 데이터 20,800개(LEO)와 SGP4 궤도 전파기를 사용해 24시간 시뮬레이션을 수행했다. (AMD Ryzen Threadripper PRO 3995WX 환경)

- **One-vs-All (아리랑 5호 기준)**: 단일 위성 대비 20,800개 물체 검사를 **370ms** 만에 완료했다.
- **All-vs-All (20,800개 상호 검사)**:
  - 필터 미적용 시: 약 8,617초(≈ 143분)
  - Three-filter + kd-tree 적용 시: **3,620초(≈ 60분)** 로 58% 단축
  - 전체 $20,800 \times 20,799 / 2 \approx 2.16 \times 10^8$(약 2.16억)개 조합 중 **96% 이상의 비충돌 쌍을 사전 소거**

![시간 간격 및 물체 수 변화에 따른 벤치마크 종합 비교](/images/three-filter/timestep.png)

## 샘플링 시간 간격(Δt)과 스케일링 특성

샘플링 주기($\Delta t$)를 5초부터 60초까지 변화시키며 런타임과 메모리 사용량을 측정했다.

- **최적 런타임 주기**: $\Delta t = 5\text{s} \sim 10\text{s}$ 구간에서 쿼리 타임이 가장 안정적이었다.
- **100만 개($10^6$) 우주물체 예측**: 다항식 피팅(Polynomial Fitting) 모델 적용 시, 100만 개 환경에서는 약 550GB 메모리와 71시간의 All-vs-All 연산 시간이 소요될 것으로 추정된다.
