---
title: "KORAYTEACHER/fintech-advisor"
owner: "KORAYTEACHER"
name: "fintech-advisor"
fullName: "KORAYTEACHER/fintech-advisor"
description: "ai fintech financial advisor for your portfolio"
sourceUrl: "https://github.com/KORAYTEACHER/fintech-advisor"
stars: 171
forks: 1124
language: "TypeScript"
topics: ["ai", "ai-advisor", "ai-financial", "ai-fintech", "fintech", "fintech-advisor", "fintech-financial"]
license: "MIT"
homepage: "https://www.foliofox.com/"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-14T07:57:52Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

﻿# FinTech Financial Advisor

A net worth tracking app with an AI-powered financial advisor that helps you make smarter decisions about your portfolio. **Foliofox is not a budgeting or an expense tracking app.**

*图片：hero*

## Features

- **Interactive portfolio visualization** - See your wealth grow with engaging charts and tables, not boring spreadsheets
- **AI-powered financial insights** - Get personalized advice, not generic market data
- **Multi-currency support** - Automatic exchange rates for global portfolios
- **Smart portfolio import** - One-click import from any broker or spreadsheet with AI
- **Daily market data** - Powered by Yahoo Finance
- **Secure, private and open source** - Your data stays yours

## Built with

- Next.js 16 (App Router, Turbopack, Cache Components)
- TypeScript (Strict Mode)
- Supabase (Postgres, Auth, Storage)
- Tailwind CSS

## Vision

If youâ€™re curious about why Foliofox exists and where itâ€™s going, read the full vision here: VISION.md

## Quick Start (Docker)

**Prerequisites:** Docker Desktop and your own Supabase project (see CONTRIBUTING.md for details).

1. Clone and configure:

   ```bash
   git clone https://github.com/KORAYTEACHER/fintech-advisor.git
   cd fintech-advisor
   ```

2. Copy the example environment file and fill in your own values:

   ```bash
   cp .env.example .env.local
   ```

   Then update `.env.local` with your [Supabase](https://supabase.com/) credentials and any optional integrations you want to enable.

3. Apply database migrations:

   ```bash
   supabase login
   supabase link --project-ref 
   supabase db push --linked
   ```

4. Start with Docker using latest pre-built image:

   ```bash
   docker compose -f docker-compose.ghcr.yml up
   ```

   Or build locally:

   ```bash
   docker compose up --build
   ```

Visit 

### Redis (optional)

Foliofox uses **`oscar-redis`** for distributed rate limiting on AI routes. Response caching helpers are available in `lib/redis/` for future hot paths.

```bash
docker compose up -d redis
cp .env.example .env.local   # set REDIS_URL=redis://localhost:6379
```

When `REDIS_URL` is set:

- **AI chat & extract** â€” shared rate limits across instances (`/api/ai/chat`, `/api/ai/extract-positions`)
- **Docker Compose** â€” `REDIS_URL=redis://redis:6379` is wired automatically for the app service
- **Health check** â€” `GET /api/health` reports Redis configuration

Without Redis, rate limits fall back to in-process counters per server instance.

For local Node.js setup without Docker, see the contributing guide.

## Contributing

Please read the contributing guide.

Join our Discord server.

## Roadmap

> Foliofox started as personal project with me as a single maintainer, so the roadmap lived here in the README. Now that itâ€™s public, the roadmap has been migrated to GitHub Issues for better tracking and collaboration.

## License

MIT Â© 2026

See LICENSE for details.
