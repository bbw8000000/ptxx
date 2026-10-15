---
title: "CrepitusAgent/Crepitus"
owner: "CrepitusAgent"
name: "Crepitus"
fullName: "CrepitusAgent/Crepitus"
description: "$CREP is collateral. Lock it into route reserves, mint synthetic equity positions backed by live oracle feeds, and trade on-chain stock exposure with no brokerage, no custodian, and no T+2 settlement."
sourceUrl: "https://github.com/CrepitusAgent/Crepitus"
stars: 61
forks: 0
language: "TypeScript"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-07-22"
pushedAt: "2026-07-21T14:26:03Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Crepitus Protocol

> **Status: unaudited testnet research. Do not use with real funds.**

Crepitus is an experimental EVM protocol project exploring collateralized synthetic assets. The repository is being built in verifiable milestones; features are documented as available only after their source code and tests are committed.

## What exists now

- `CREPToken.sol`: capped ERC-20 prototype with permit support and role-based minting.
- `MockOracle.sol`: mutable local/testnet oracle with 8-decimal prices.
- Hardhat 3 contract compilation, TypeScript tests, and Ignition deployment.
- React status page.
- GitHub Actions checks.

## What does not exist yet

Collateral custody, debt accounting, liquidation, synthetic-equity issuance, production oracle integrations, route reserves, governance, audits, and mainnet deployments are not implemented.

## Requirements

- Node.js 22.13.0 or newer
- npm 10 or newer

## Install

```bash
npm install
```

Commit the generated `package-lock.json`. After that, CI and fresh clones should use:

```bash
npm ci
```

## Verify the repository

```bash
npm run check
npm run audit:runtime
```

The first command runs linting, Solidity compilation, TypeScript checking, contract tests, and the frontend production build. The second checks production/runtime dependencies for high-severity advisories.

## Local frontend

```bash
npm run dev
```

## Local simulated deployment

```bash
npm run contracts:deploy:local
```

## Sepolia deployment

Copy `.env.example` to `.env`, enter test-only credentials, and run:

```bash
npm run contracts:deploy:sepolia
```

Never use a wallet that controls real funds. Values prefixed with `VITE_` are public browser configuration and must never contain secrets.

## Repository layout

```text
contracts/          Solidity source
contracts/interfaces/ Shared contract interfaces
contracts/mocks/    Local and testnet-only contracts
test/               TypeScript smart-contract tests
ignition/modules/   Declarative deployments
src/                React frontend
docs/               Architecture and security documentation
.github/workflows/  Continuous integration
```

## Security

Read SECURITY.md and docs/THREAT_MODEL.md. There is no audit or bug bounty yet.

## License

MIT
