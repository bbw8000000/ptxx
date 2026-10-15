---
title: "Matchameleon/moneyclaw"
owner: "Matchameleon"
name: "moneyclaw"
fullName: "Matchameleon/moneyclaw"
description: "openclaw agents for prepaid wallet, virtual card, OTP inbox, public docs, and skill"
sourceUrl: "https://github.com/Matchameleon/moneyclaw"
stars: 137
forks: 937
language: "JavaScript"
topics: ["agent", "card-agent", "moneyclaw", "otp-agent", "wallet-agent"]
license: "MIT"
homepage: "https://elvismusli.github.io/moneyclaw/"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-14T07:58:54Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

MoneyClaw


  Intent-based payments for OpenClaw agents.


  Prepaid wallet. Payment tasks. One hidden execution card. Account inbox.


  Website
  ·
  Docs Site
  ·
  OpenClaw Quickstart
  ·
  Docs
  ·
  Skill


  
  
  


## What This Repo Is

This is the public MoneyClaw repository.

It is the place for:

- public product docs
- the MoneyClaw OpenClaw skill
- examples and starter prompts
- high-level architecture and safety model

It is not the full internal product monorepo.

Internal infrastructure, production runbooks, incidents, security hardening notes, deployment details, and provider-specific operational playbooks are intentionally not published here.

## What MoneyClaw Does

MoneyClaw gives OpenClaw agents a prepaid wallet and an auditable payment-execution layer for online purchases and recurring subscriptions.

With MoneyClaw, an agent can:

- check wallet and inbox readiness
- create payment tasks
- start recurring payment setups
- prepare or reuse one hidden execution card under the account when execution needs it
- complete browser checkout
- inspect account inbox messages when needed
- verify the final transaction result

Execution note:

- cards are internal execution artifacts, not the main public product object
- public integrations should lead with wallet, payment tasks, subscriptions, inbox, and merchant flows

Secondary workflows include:

- hosted invoices
- merchant checkout links
- merchant and acquiring flows when explicitly requested

## Quick Start

Install the skill:

```bash
clawhub install moneyclaw
```

Then:

1. Create a MoneyClaw API key.
2. Store it in OpenClaw as `MONEYCLAW_API_KEY`.
3. Start a fresh OpenClaw session.
4. Ask the agent to inspect the account before its first purchase.

Starter prompt:

```text
Check my MoneyClaw account and tell me if the wallet, inbox, and payment tasks are ready.
```

## Safety Model

MoneyClaw is built around bounded, inspectable agent payments.

- prepaid balances keep risk capped
- payment tasks and subscriptions hold approval and audit state
- one hidden execution card stays under the account and is reused across payment tasks and subscriptions
- receipts and account messages stay visible in a dedicated inbox
- the user can keep dashboard approval on or deliberately enable account-level agent auto-approval

Important boundary:

MoneyClaw is for user-authorized payments. It is not designed to bypass issuer, merchant, fraud, KYC, sanctions, geography, or verification controls.

Read the full model in [docs/security-model.md](https://elvismusli.github.io/moneyclaw/security-model).

## Reading Order

Start here:

1. [docs/getting-started.md](https://elvismusli.github.io/moneyclaw/getting-started)
2. [docs/openclaw-quickstart.md](https://elvismusli.github.io/moneyclaw/openclaw-quickstart)
3. [docs/api-overview.md](https://elvismusli.github.io/moneyclaw/api-overview)
4. moneyclaw-skill/SKILL.md

## Repo Map

```text
assets/            branding and repo visuals
docs/              public documentation
examples/          prompts and curl examples
moneyclaw-skill/   public OpenClaw skill files
```

## Scope Of This Public Repo

Published here:

- what MoneyClaw is
- how to use it
- how the public skill is structured
- how the public API is meant to be understood
- how the safety and trust model works

Not published here:

- production IPs and infra
- internal incidents and postmortems
- operational security notes
- private merchant-specific tactics
- internal team process and private agent instructions

## Local development

```bash
pnpm install
cp .env.example .env
docker compose up -d
export REDIS_URL=redis://localhost:6379
```

```javascript
import { getOrSetJson, buildCacheKey } from "moneyclaw-public/redis/cache";

const task = await getOrSetJson(
  buildCacheKey("payment-task", ["task-123"]),
  300,
  async () => fetchFromApi(),
);
```

Helpers in `src/redis/` support caching, webhook dedup, and distributed locks for local tooling. When `REDIS_URL` is unset, they fail open.

The public OpenClaw skill talks to the MoneyClaw API directly — Redis is optional for skill authors.

## Support

- Product site: [moneyclaw.ai](https://moneyclaw.ai)
- Docs hub: [elvismusli.github.io/moneyclaw](https://elvismusli.github.io/moneyclaw/)
- Security contact: SECURITY.md

## License

Code and docs in this repository are available under the MIT License, unless noted otherwise.
