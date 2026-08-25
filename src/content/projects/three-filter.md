---
title: "대규모 위성 충돌 방지를 위한 Three-filter 궤도 근접 탐색 최적화"
description: "SGP4 궤도 전파와 kd-tree 기하 해싱을 결합해 24,000+개 우주물체의 All-vs-All 충돌 위험 탐색을 96% 사전 차단"
date: 2023-12-14
draft: false
thumbnail: "/images/three-filter/overview.png"
---

스타링크(Starlink)와 같은 메가 컨스텔레이션(Mega-constellation) 프로젝트로 저궤도(LEO) 우주물체 수가 급증하면서, 위성 간 초고속 충돌(초속 7~10km/s)을 방지하기 위한 **근접 위험 평가**(Conjunction Assessment)의 연산 비용이 심각한 병목으로 떠올랐다.

우주물체가 $N$개일 때 전체 쌍(All-vs-All) 충돌 검사는 $\binom{N}{2} \approx \frac{N^2}{2}$개의 연산 조합을 필요로 한다. 2만 개 이상의 물체만 존재해도 2억 회가 넘는 궤도 추적 계산이 발생하며, 향후 100만 개 시대에는 단순 전수 조사가 불가능하다.

이 연구에서는 고전적인 **Three-filter 알고리즘**(Perigee-Apogee, Orbit Path, Time Filter)에 **kd-tree 기반 다차원 기하 해싱**(Geometric Hashing)과 **Bisection 수치 탐색**을 결합하여, 불필요한 계산의 96% 이상을 빠르게 걸러내고 근접 탐색 연산 속도를 대폭 최적화한 시뮬레이션 파이프라인을 구축했다.

![Three-filter 및 기하 해싱 기반 근접 위험 평가 파이프라인 개요](/images/three-filter/overview.png)

## 1. 3단계 계층형 기하 필터링(Three-filter) 파이프라인

Three-filter 알고리즘은 전체 시뮬레이션 시간 동안 모든 물체의 정밀 위치를 매초 계산하는 대신, 궤도의 기하학적 특성을 이용해 비충돌 쌍을 단계별로 소거한다.

1. **근지점-원지점 필터**(Perigee-Apogee Filter): 두 타원 궤도의 최단 거리($q$)와 최장 거리($Q$)만을 비교한다. 두 궤도의 고도 차이가 임계 거리($D$)보다 크면($q - Q > D$), 시간 계산 없이 즉시 충돌 대상에서 제외한다.
2. **궤도 경로 교차 필터**(Orbit Path Filter): 두 궤도 평면이 3차원 공간에서 만나는 가상의 교차선(Intersection Line) 부근의 최근접 기하 거리($r_{rel}$)를 계산한다. 공간상 최소 거리가 $D$보다 멀면 영구히 만날 수 없으므로 제외한다.
3. **시간 동기화 필터**(Time Filter): 궤도상 최근접 위치를 두 물체가 통과하는 시간 구간 $[t_0, t_1]$이 일치하는지 판별한다. 공간 교차점을 지나더라도 도달 시간대가 다르면 충돌하지 않는다.

![Three-filter 3단계 기하 및 시간 필터 다이어그램](/images/three-filter/filter-perigee-apogee.png)

## 2. kd-tree 다차원 기하 해싱을 통한 동적 근접 탐색

시간 필터 단계에서 전파된 3차원 좌표 집합을 효율적으로 검색하기 위해 **기하 해싱**(Geometric Hashing) 기법을 적용했다.

물체의 최대 이동 속도($v_{max} \approx 10\text{km/s}$)와 샘플링 시간 간격($\Delta t$)을 고려해 탐색 반경 임계치 $D_F$를 설정한다.

$$D_F = (2 \times v_{max} \times \Delta t) + D_{critical}$$

- **kd-tree 공간 분할**: 3차원 위치 데이터를 $X, Y, Z$ 축 기준으로 재귀적 분할하여 $O(\log N)$ 탐색 트리를 구성했다.
- **반경 탐색 및 Bisection 최적화**: $D_F$ 반경 내에 진입한 후보 쌍에 대해서만 이분법(Bisection Method)을 적용해 오차 0.001초 이하로 최근접 접근 시점(TCA, Time of Closest Approach)과 최단 거리($d_{min}$)를 정밀 수렴했다.

![3차원 kd-tree 공간 분할 및 반경 탐색 구조](/images/three-filter/kdtree.png)

## 3. 20,800개 LEO 데이터셋 실측 벤치마크

Space-Track의 실제 Two-Line Element(TLE) 데이터 20,800개(LEO 궤도)와 SGP4 궤도 전파기를 활용해 24시간 시뮬레이션 벤치마크를 수행했다. (AMD Ryzen Threadripper PRO 3995WX 환경)

- **One-vs-All (아리랑 5호 기준)**: 단일 위성 대비 전체 20,800개 물체에 대한 충돌 검사를 **370ms** 만에 완료했다.
- **All-vs-All (전체 20,800개 상호 검사)**:
  - 3단계 필터 미적용 시: 약 8,617초(≈ 143분)
  - 3단계 필터 + kd-tree 적용 시: **3,620초(≈ 60분)** 로 58% 단축
  - 전체 $20,800 \times 20,799 / 2 \approx 2.16 \times 10^8$(약 2.16억)개 조합 중 **96% 이상의 비충돌 쌍을 사전 소거**

![시간 간격 및 물체 수 변화에 따른 벤치마크 종합 비교](/images/three-filter/timestep.png)

## 4. 시간 간격(Δt) 및 대규모 스케일링 특성 분석

샘플링 주기($\Delta t$)를 5초부터 60초까지 변화시키며 런타임과 메모리 사용량의 상관관계를 도출했다.

- **최적 런타임 주기**: $\Delta t = 5\text{s} \sim 10\text{s}$ 구간에서 쿼리 타임이 가장 안정적으로 단축되었다.
- **100만 개($10^6$) 우주물체 예측**: 다항식 피팅(Polynomial Fitting) 모델을 적용했을 때, 100만 개 환경에서는 약 550GB의 메모리와 71시간의 All-vs-All 연산 시간이 소요될 것으로 예측되었다. 이를 통해 향후 대규모 우주 감시 시스템에서 분산 메모리 최적화의 필수성을 입증했다.
