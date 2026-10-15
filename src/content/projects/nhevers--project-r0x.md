---
title: "nhevers/project-r0x"
owner: "nhevers"
name: "project-r0x"
fullName: "nhevers/project-r0x"
description: "Official SDK, Claude Code plugin and facilitator docs for r0x, the x402 facilitator for Robinhood Chain."
sourceUrl: "https://github.com/nhevers/project-r0x"
stars: 58
forks: 1
language: "TypeScript"
topics: ["ai-agents", "claude-code", "facilitator", "mcp", "payments", "robinhood-chain", "sdk", "stablecoin"]
license: "MIT"
homepage: "https://projectr0x.dev"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-07-11T22:40:03Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# r0x-os

The official SDK, Claude Code / MCP plugin, and facilitator docs for **r0x**,
the USDG-native operating system for AI agents, built on Robinhood Chain.

r0x runs the official x402 facilitator for Robinhood Chain. AI agents can use
it right now: discover a priced capability, authorize a USDG payment, and
invoke it, all in one uninterrupted call. No API keys, no subscriptions, no
human approving anything in between.

Live site: [projectr0x.dev](https://projectr0x.dev) · Facilitator docs: docs/facilitator.md · Skill reference: docs/skills.md

## What's in this repo

- **SDK** (`src/client`): a TypeScript client (`R0xClient`) that handles the
  x402 challenge/sign/retry cycle automatically. Published as `r0x-os` on npm.
- **Claude Code / MCP plugin** (`src/plugin`): exposes the full skill catalog
  as MCP tools, plus local wallet setup and a spend-limit guard.
- **Virtuals GAME integration** (`integrations/virtuals-game`): a GAME SDK
  worker that gives any Virtuals agent the same skill catalog as fifteen
  callable functions, with optional auto-broadcast of trades and transfers.
- **Docs** (`docs/`): how the facilitator works and the full skill reference.
- **Examples** (`examples/`): a minimal, dependency-light reference client.

## Install

```bash
npm install r0x-os
```

```ts
import { R0xClient } from 'r0x-os';

const client = new R0xClient({ privateKey: process.env.R0X_PRIVATE_KEY });

// $0.01 USDG per call, settled automatically
const { data } = await client.price('ETH');
console.log(data.priceUSD);

const balance = await client.balance('0x...');
console.log(balance.data.balances);
```

See docs/skills.md for every method the client exposes.

## Claude Code plugin

```
/plugin marketplace add nhevers/project-r0x
/plugin install r0x-os
```

Or add it directly as an MCP server:

```bash
claude mcp add r0x -- npx r0x-os
```

No private key is needed upfront, the agent calls `r0x_setup` on first use to
either import an existing wallet or generate a fresh one. After that, eighteen
tools are available: `r0x_setup`, `balance`, `tx`, `price`, `wallet`, `chat`,
`send`, `fund`, `broadcast`, `spend_limit`, `trade`, `quote`, `pool`,
`liquidity_add`, `liquidity_remove`, `liquidity_positions`, `yield`, and
`bridge`. `trade`, `quote`, `pool`, and `liquidity_*` all accept any ERC20
token on Robinhood Chain, not just ETH and USDG — there's no allowlist.

## Virtuals GAME agents

Any agent built on the Virtuals GAME SDK can
plug straight into r0x. See integrations/virtuals-game for a
worker exposing the full skill catalog as GAME functions, with optional auto-broadcast of
trades, transfers, and liquidity transactions.

## Building from source

```bash
git clone https://github.com/nhevers/project-r0x.git
cd project-r0x
npm install
npm run build      # compiles src/ -> dist/
npm run example:tx # runs the reference test-transaction script
```

## How the facilitator works

Read docs/facilitator.md for the full protocol walk-through,
or jump straight to `examples/test-transaction.js`
for a working ~80-line client.

## License

MIT, see LICENSE.
