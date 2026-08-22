# jiminu.github.io

개인 프로젝트와 기술 기록을 위한 Astro 기반 정적 사이트입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

전체 빌드는 다음 명령으로 확인합니다.

```bash
npm run build
```

## 프로젝트 추가

`src/content/projects/`에 Markdown 파일을 추가합니다.

```md
---
title: 프로젝트 이름
description: 한 줄 설명
date: 2026-01-01
thumbnail: /images/example.png
---

본문
```

`thumbnail`은 선택 항목입니다.

## 노트 추가

`src/content/notes/`에 Markdown 파일을 추가합니다.

```md
---
title: 노트 제목
description: 한 줄 설명
date: 2026-01-01
---

본문
```

공개하지 않을 글은 frontmatter에 `draft: true`를 추가합니다.

## 배포

GitHub Pages의 Source를 **GitHub Actions**로 설정합니다.

`main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 자동으로 빌드하고 배포합니다.
