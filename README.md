# jiminu.github.io

개인 프로젝트와 기술 기록을 위한 Astro 정적 사이트입니다.

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

`src/content/projects/` 아래에 Markdown 파일을 만듭니다.

```markdown
---
title: "프로젝트 제목"
description: "프로젝트를 한 문장으로 설명합니다."
date: 2026-08-21
draft: false
---

## 배경

내용을 작성합니다.
```

## 글 추가

`src/content/notes/` 아래에 Markdown 파일을 만듭니다.

```markdown
---
title: "글 제목"
description: "글을 한 문장으로 설명합니다."
date: 2026-08-21
draft: false
project: selfishell # (선택) 연관된 프로젝트 ID
---

내용을 작성합니다.
```

`draft: true`인 항목은 목록과 상세 페이지에 공개되지 않습니다. `project` 필드에 프로젝트 ID(파일명)를 지정하면 해당 프로젝트와 글이 양방향으로 자동 연결됩니다.

## 배포

GitHub의 `jiminu/jiminu.github.io` 저장소에 푸시한 뒤, 저장소의 **Settings → Pages → Source**를 **GitHub Actions**로 설정합니다. 이후 `main` 브랜치에 푸시할 때마다 사이트가 자동으로 배포됩니다.
