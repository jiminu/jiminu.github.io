---
title: "Selfishell"
description: "macOS, Ubuntu, WSL에서 같은 개발 환경을 유지하기 위한 관리형 Zsh 도구"
date: 2026-08-19
draft: false
thumbnail: "/images/selfishell/shell.png"
notes:
  - keeping-zshrc-user-owned
---

[GitHub에서 보기](https://github.com/jiminu/selfishell)

Selfishell은 macOS, Ubuntu, WSL에서 일관된 터미널 환경을 설치하고 관리하는 도구다. Zsh 설정부터 프롬프트, 편집기와 개발 도구까지 두 가지 프로필로 제공한다.

![Selfishell 셸 화면](/images/selfishell/shell.png)

## 만든 이유

여러 머신을 사용할 때마다 셸과 개발 도구를 다시 구성하지 않고, 같은 환경을 반복해서 설치하고 업데이트할 수 있게 만드는 것이 목표였다. 지원 범위를 macOS와 Ubuntu 계열로 한정하고 각 플랫폼의 패키지 관리자와 CPU 아키텍처 차이를 설치 과정에서 처리한다.

## 관리 범위와 사용자 설정

Selfishell이 관리하는 설정과 사용자가 직접 작성하는 설정을 분리했다. 설치 파일은 XDG 경로 아래에 두고, 사용자의 `.zshrc`에는 관리 설정을 불러오는 진입점만 추가한다. 기존 alias, function, export와 프로젝트별 도구 설정은 그대로 함께 사용할 수 있다.

프로필은 용도에 따라 나뉜다.

- `minimal`: Zsh, Git, Vim, Starship 등 기본 셸 환경
- `developer`: Neovim, mise, Node.js, Python, uv, FZF, Ripgrep 등 개발 도구 포함

![Selfishell의 Neovim 환경](/images/selfishell/nvim.png)

## 업데이트와 롤백

업데이트 중 문제가 생겨도 기존 환경을 복구할 수 있도록 릴리스 단위로 설치한다. 내려받은 파일의 SHA-256 체크섬과 Sigstore attestation을 확인한 뒤 활성 버전을 전환하고, 직전 릴리스는 오프라인 롤백을 위해 남겨 둔다.

셸 시작 시에는 네트워크를 사용하거나 업데이트를 자동 설치하지 않는다. 상태 확인과 진단은 `selfishell status`, `selfishell doctor` 명령으로 분리했다.

## 검증

플랫폼 판별, 설치, 프로필, 업데이트와 릴리스 과정을 스크립트 테스트로 확인한다. 실제 설치 흐름은 컨테이너 기반 테스트로 별도 검증하고, 셸 시작 성능 측정은 임시 HOME에서 실행해 사용자의 현재 환경과 분리한다.

현재 v1.2.5를 공개했으며 macOS의 Apple Silicon과 Intel, Ubuntu/WSL의 AMD64와 ARM64를 지원한다.
