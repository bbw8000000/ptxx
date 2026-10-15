---
title: "robinhood-ape/robinhood-noxa-bundler"
owner: "robinhood-ape"
name: "robinhood-noxa-bundler"
fullName: "robinhood-ape/robinhood-noxa-bundler"
description: "NOXA Fun multi-wallet launch bundler for Robinhood Chain - launch via NOXA factory then buy from many wallets on Uniswap V3 before public snipers"
sourceUrl: "https://github.com/robinhood-ape/robinhood-noxa-bundler"
stars: 250
forks: 184
language: "TypeScript"
topics: ["bot", "bundler", "noxa", "noxa-fun", "robinhood-chain", "token-launch", "typescript", "uniswap-v3"]
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-07-20"
pushedAt: "2026-07-17T20:13:58Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# NOXA Token Bundler

Multi-wallet launch bundler for [NOXA Fun](https://fun.noxa.eth.limo/) on **Robinhood Chain** (chain ID `4663`).

Launches a token via the NOXA Launch Factory, then buys from multiple wallets as fast as possible so you hold supply before public snipers.

## Setup

```bash
cd bundler
npm install
cp .env.example .env
# set PRIVATE_KEY and token fields
```

## Commands

```bash
# Generate bundle wallets (prints keys — store securely)
npm run wallets

# Launch only (creator initial buy in the launch tx)
npm run launch

# Full bundle: fund wallets → launch → multi-wallet buys
npm run bundle
```

Keep `DRY_RUN=true` until you are ready to spend real ETH.

## How it works

1. **Launch** — calls `launchToken` on the NOXA factory with metadata + salt  
   - `msg.value = INITIAL_BUY_ETH + 0.0005 ETH` (flat launch fee)  
   - Creator buy is included in the same launch transaction
2. **Fund** — master wallet sends each bundle wallet `BUY_AMOUNT_ETH + GAS_RESERVE_ETH`
3. **Bundle buys** — each wallet wraps ETH → approves SwapRouter02 → `exactInputSingle` into the new Uniswap V3 pool

Same-block external buys may be restricted by NOXA (`LaunchBlockBuyBlocked`). This bundler fires buys immediately after the launch receipt; on Orbit L2 that is typically the next sequencer batch.

## Notes

- UI: [https://fun.noxa.eth.limo/](https://fun.noxa.eth.limo/) — new launches may still be disabled on NOXA Lite; on-chain `launchToken` will revert if paused.
- Never commit `.env` or generated private keys.
- Memecoins are high risk.

## Contracts

| Contract | Address |
|----------|---------|
| Launch Factory | `0xD9eC2db5f3D1b236843925949fe5bd8a3836FCcB` |
| WETH | `0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73` |
| SwapRouter02 | `0xCaf681a66D020601342297493863E78C959E5cb2` |
| QuoterV2 | `0x33e885ed0ec9bf04ecfb19341582aadcb4c8a9e7` |
