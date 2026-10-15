---
title: "NuvexNetwork/nuvex-services"
owner: "NuvexNetwork"
name: "nuvex-services"
fullName: "NuvexNetwork/nuvex-services"
description: "Off-chain services for Nuvex. This repository does not deploy programs and it is not a source of protocol truth."
sourceUrl: "https://github.com/NuvexNetwork/nuvex-services"
stars: 148
forks: 313
language: "TypeScript"
topics: ["ai", "api", "indexer", "infra", "off-chai", "postgresql", "solana"]
license: "Apache-2.0"
defaultBranch: "main"
snapshotDate: "2026-10-03"
pushedAt: "2026-10-02T16:12:56Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Nuvex services

Off-chain services for Nuvex. This repository does not deploy programs and it is not a source of protocol truth.

- `api/` — HTTP API. It does not sign or authorize chain state.
- `indexer/` — PostgreSQL schema. Chain indexing is not implemented.
- `data/` — price-provider adapters. Every call is rejected.
- `ai/` — a directory and a README. There is no model.
- `infra/` — local compose file and monitoring config.

The website, the documentation site, and the on-chain protocol are separate repositories. Build the oracle node image in the protocol repository and tag it `nuvex-oracle-node:local` before using the `node` compose profile.

## Develop

```bash
pnpm install
make check
cp env/.env.local.example .env.local
```

`make check` formats, lints, tests, and validates the Prisma schema. It does not start a database.
