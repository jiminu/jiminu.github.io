---
title: "손글씨 수학 수식 기호 인식을 위한 딥러닝 OCR 파이프라인"
description: "OpenCV 모폴로지 전처리와 CNN 분류기를 결합해 필기체 수식 기호를 98.44% 정확도로 인식"
date: 2023-06-15
draft: false
thumbnail: "/images/math-exp-ocr/overview.png"
---

[GitHub에서 보기](https://github.com/jiminu/math-exp-ocr)

일반적인 인쇄체 문서 OCR과 달리, **손글씨 수학 수식**(Handwritten Mathematical Expressions)은 필기체 특유의 불규칙한 획 굵기, 번짐과 끊김 노이즈, 그리고 등호($=$)나 분수선처럼 여러 획으로 이루어진 복합 기호로 인해 개별 기호를 분리하고 인식하기 어렵다.

이 프로젝트에서는 OpenCV 기반의 영상 처리 파이프라인(가우시안 블러, 적응형 임계처리, 침식 모폴로지 연산)과 **합성곱 신경망**(Convolutional Neural Network, CNN) 분류기를 결합하여, 카메라로 촬영한 손글씨 수식 이미지에서 기호들을 안정적으로 분리하고 98.44%의 정확도로 분류하는 종단간(End-to-End) OCR 파이프라인을 구축했다.

![수학 수식 기호 OCR 인식 파이프라인 개요](/images/math-exp-ocr/overview.png)

## 1. 모폴로지 연산을 활용한 다중 획 분리 오류 해결

손글씨 수식 인식에서 가장 빈번하게 발생하는 실패 요인은 **다중 획 기호의 분리 오류**(Separation Error)다.

예를 들어 등호($=$)나 알파벳 '$z$'의 가로 가로지름 획, 나눗셈 기호($\div$)는 획이 물리적으로 떨어져 있어 단순 연결 요소(Connected Components) 검출 시 2개 이상의 독립된 기호로 쪼개져 인식되는 문제가 발생한다.

이 문제를 해결하기 위해 다음과 같은 전처리 파이프라인을 설계했다.

1. **그레이스케일 변환 및 가우시안 블러**(Gaussian Blur): 고주파 노이즈를 부드럽게 완화
2. **적응형 이진화**(Adaptive Thresholding): 조명 불균형 환경에서도 배경과 획을 선명하게 분리
3. **침식**(Erosion) 및 **팽창**(Dilation) 모폴로지 변환: 획의 두께를 의도적으로 팽창시켜 근접한 다중 획(등호의 위아래 선)을 단일 덩어리로 병합
4. **바운딩 박스 검출 및 원본 투영**: 병합된 덩어리 기준으로 바운딩 박스를 추출한 뒤, 원본 이진화 영상에 투영하여 개별 기호의 무결성을 복원

![다중 획 기호의 분리 오류와 침식 변환 전처리 비교](/images/math-exp-ocr/erosion-preprocessing.png)

## 2. 대규모 수식 기호 데이터셋 기반 CNN 모델 학습

추출된 개별 기호 이미지를 고정 크기($28 \times 28$)로 정규화한 뒤, 필기체 특징 추출에 최적화된 CNN 분류기를 학습시켰다.

- **데이터셋**: Kaggle Handwritten Mathematical Symbols 대규모 데이터셋 (37만 5천여 장)
  - 학습 데이터(Train): 338,376장
  - 검증 및 테스트 데이터(Test): 37,598장
- **모델 아키텍처**:
  - 복수의 Convolution Layer(ReLU) + MaxPooling Layer로 회전과 미세 이동에 불변하는 특징 맵 추출
  - Dropout(0.25)을 적용해 과적합 방지
  - Dense Layer 및 Softmax를 통한 다중 클래스 확률 추론
- **학습 파라미터**:
  - Optimizer: Adam (Adaptive Moment Estimation)
  - Loss Function: Categorical Cross-Entropy
  - Epochs: 25, Batch Size: 256
- **최종 결과**: 테스트 데이터셋 기준 **98.44%의 분류 정확도**(Accuracy) 달성

## 3. 2차원 공간 배치와 계층적 수식 구조 분석

단순한 1차원 나열 수식뿐 아니라 분수($\frac{a}{b}$), 위 첨자($x^2$), 아래 첨자($a_i$)와 같은 2차원 계층 구조 수식에 대해서도 분할 및 위치 추적 실험을 진행했다.

![분수 수식 기호 분할 및 위치 검출 결과](/images/math-exp-ocr/segmentation-fraction.png)

- **바운딩 박스 중심 좌표 추적**: 검출된 기호들의 중심 좌표($x, y$)와 너비/높이를 기반으로 수평 방향 선형 수식과 수직 방향 분수/첨자 구조를 판별
- **한계점 및 개선 방향**: 기호 간의 회전(Rotation)이나 심한 기울임(Shear), 글씨체 스타일에 따른 기호 겹침 현상은 단일 기호 분류기만으로는 문맥을 파악하기 어려웠다. 이를 해결하기 위해 이미지 전체에서 인코더-디코더(Attention 기반 Seq2Seq)를 통해 LaTeX 수식 문법을 직접 생성하는 모델 구조의 필요성을 확인했다.

전처리 단계의 세심한 기하 모폴로지 튜닝이 딥러닝 모델의 실제 추론 안정성에 결정적인 영향을 미침을 실증한 프로젝트다.
