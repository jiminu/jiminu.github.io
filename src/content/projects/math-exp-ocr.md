---
title: "손글씨 수학 수식 기호 인식을 위한 딥러닝 OCR 파이프라인"
description: "OpenCV 모폴로지 전처리와 CNN 분류기를 결합해 필기체 수식 기호를 98.44% 정확도로 인식"
date: 2023-06-15
draft: false
thumbnail: "/images/math-exp-ocr/overview.png"
---

[GitHub에서 보기](https://github.com/jiminu/math-exp-ocr)

손글씨 수식은 획 굵기가 불규칙하고, 등호($=$)나 분수선처럼 여러 획으로 떨어진 기호가 많아 단순 Connected Component 검출만으로는 기호 분리가 깨지기 쉽다.

이 프로젝트에서는 OpenCV 영상 처리 파이프라인(Gaussian Blur, Adaptive Thresholding, Morphology Erosion/Dilation)으로 기호를 세그멘테이션하고, CNN 분류기로 37만여 장의 데이터셋에서 98.44%의 인식 정확도를 달성했다.

![수학 수식 기호 OCR 인식 파이프라인 개요](/images/math-exp-ocr/overview.png)

## Multi-stroke 기호 분리 오류 해결

등호($=$)나 '$z$'의 가로지름 획, 나눗셈($\div$) 기호는 획이 물리적으로 분리되어 있어, 일반 Connected Component 검출 시 2개 이상의 별도 기호로 쪼개지는 문제가 발생한다.

이를 해결하기 위해 Morphology 전처리 과정을 구성했다.

1. **Gaussian Blur**: 고주파 노이즈 완화
2. **Adaptive Thresholding**: 조명 불균형 환경에서 배경과 획 분리
3. **Erosion / Dilation**: 획을 팽창시켜 근접한 Multi-stroke(등호의 상하 선 등)을 단일 영역으로 병합
4. **Bounding Box 검출 및 마스킹**: 병합된 영역 기준으로 Bounding Box를 잡고, 원본 이진화 영상에서 해당 영역을 추출

![다중 획 기호의 분리 오류와 침식 변환 전처리 비교](/images/math-exp-ocr/erosion-preprocessing.png)

## CNN 기호 분류 모델

추출한 기호 이미지를 $28 \times 28$ 크기로 정규화한 뒤 CNN으로 분류했다.

- **데이터셋**: Kaggle Handwritten Mathematical Symbols (총 375,974장)
  - Train: 338,376장
  - Test: 37,598장
- **모델 구조**: Convolution Layer(ReLU) + MaxPooling + Dropout(0.25) + Dense(Softmax)
- **학습 파라미터**: Adam Optimizer, Categorical Cross-Entropy, 25 Epochs, Batch size 256
- **결과**: Test 데이터셋 기준 **98.44% 정확도** 달성

## 2D 공간 배치와 계층 구조 분석

분수($\frac{a}{b}$)나 위/아래 첨자($x^2, a_i$)처럼 2차원 계층 구조를 갖는 수식에 대해서도 위치 추적을 실험했다.

![분수 수식 기호 분할 및 위치 검출 결과](/images/math-exp-ocr/segmentation-fraction.png)

Bounding Box의 중심 좌표와 크기 비율을 계산해 수평 선형 수식과 수직 분수 구조를 구분했다. 단, 기호가 심하게 기울어지거나 회전된 경우 단일 기호 분류만으로는 문맥 파악에 한계가 있어, 후속 파이프라인으로 Seq2Seq 기반의 LaTeX 문법 생성 모델이 필요함을 확인했다.
