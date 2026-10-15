---
title: "odysseus-dev/odysseus"
owner: "odysseus-dev"
name: "odysseus"
fullName: "odysseus-dev/odysseus"
description: "Self-hosted AI workspace. "
sourceUrl: "https://github.com/odysseus-dev/odysseus"
stars: 87647
forks: 994
language: "Python"
topics: []
license: "AGPL-3.0"
homepage: "https://odysseus-dev.github.io/odysseus"
defaultBranch: "dev"
snapshotDate: "2026-09-28"
pushedAt: "2026-09-24T17:38:36Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

A self-hosted AI workspace for chat, agents, research, documents, email, notes, calendar, and local model workflows.


  Quick Start ·
  Setup Guide ·
  Contributing ·
  Roadmap


  


  


---

## Quick Start

> `dev` is the default branch and gets the newest changes first. Use `main` if you want the more curated branch.

```bash
git clone https://github.com/odysseus-dev/odysseus.git
cd odysseus
cp .env.example .env
docker compose up -d --build
```

Open `http://localhost:7000` when the containers are healthy. The first admin password is printed in `docker compose logs odysseus`.

Native installs, GPU notes, Windows/macOS instructions, HTTPS, and configuration live in the setup guide.

## Features

- **Chat + Agents** — local/API models, tools, MCP, files, shell, skills, and memory.
- **Cookbook** — hardware-aware model recommendations, downloads, and serving.
- **Deep Research** — multi-step web research with source reading and report generation.
- **Compare** — blind side-by-side model testing and synthesis.
- **Documents** — writing-first editor with AI edits, suggestions, Markdown, HTML, CSV, and syntax highlighting.
- **Email** — IMAP/SMTP inbox with triage, tags, summaries, reminders, and reply drafts.
- **Notes, Tasks + Calendar** — reminders, todos, scheduled agent tasks, and CalDAV sync.
- **Extras** — gallery/image editor, themes, uploads, web search, presets, sessions, and 2FA.

## Demo

A full hover-to-play tour lives on the [Odysseus landing page](https://odysseus-dev.github.io/odysseus/). Its source lives under `website/`.

## Contributing

Help is welcome. The best entry points are fresh-install testing, provider setup bugs, mobile/editor polish, docs, and small focused refactors. See CONTRIBUTING.md and ROADMAP.md.

## Security

Odysseus is a self-hosted workspace with powerful local tools. Keep auth enabled, keep private data out of Git, and do not expose raw model/service ports publicly.

- Keep `AUTH_ENABLED=true` for any network-accessible deployment.
- Keep `LOCALHOST_BYPASS=false` outside local development.

Deployment details are in the setup guide.

## Star History


 
   
   
   
 


## License

AGPL-3.0-or-later -- see LICENSE and ACKNOWLEDGMENTS.md.
