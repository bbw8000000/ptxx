---
title: "NuvexNetwork/nuvex-web"
owner: "NuvexNetwork"
name: "nuvex-web"
fullName: "NuvexNetwork/nuvex-web"
description: "The Nuvex website. It does not read chain state and it does not submit transactions.  The protocol, the documentation site, and the off-chain services are separate repositories."
sourceUrl: "https://github.com/NuvexNetwork/nuvex-web"
stars: 151
forks: 41
language: "TypeScript"
topics: []
license: "Apache-2.0"
defaultBranch: "main"
snapshotDate: "2026-10-04"
pushedAt: "2026-10-02T22:28:26Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Nuvex web

The Nuvex website. It does not read chain state and it does not submit transactions.

The protocol, the documentation site, and the off-chain services are separate repositories.

```bash
pnpm install
pnpm dev
```

The development server listens on port 3000. Optional public URLs are listed in `.env.example`.

## Layout

- `src/app/` — routes (App Router)
- `src/components/` — `layout/` (navbar, footer), `navigation/`, `buttons/`, `cards/`, `ui/`, `animations/`, and folders for page sections
- `src/data/` — navigation and content, kept apart from components
- `src/styles/globals.css` — design tokens and typography classes
- `docs/` — reference analysis and information architecture
