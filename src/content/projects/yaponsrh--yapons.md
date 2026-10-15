---
title: "YaponsRH/yapons"
owner: "YaponsRH"
name: "yapons"
fullName: "YaponsRH/yapons"
description: "yap to earn $YAP on Robinhood Chain"
sourceUrl: "https://github.com/YaponsRH/yapons"
stars: 34
forks: 0
language: "Solidity"
topics: []
license: "MIT"
homepage: "https://x.com/YaponsRH"
defaultBranch: "main"
snapshotDate: "2026-07-30"
pushedAt: "2026-07-29T08:22:58Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# YAPONS

### The attention layer for Robinhood Chain, yap, get scored, earn `$YAP`

     

*图片：test*
*图片：license*
*图片：solidity*
*图片：chain*
[*图片：x*](https://x.com/YaponsRH)
[*图片：telegram*](https://t.me/YaponsRH)

Twitter · Telegram · Docs · Tokenomics


---

## Overview

Every day, the people who actually carry a chain, the ones writing threads, making memes, and calling plays, do it **for free**. The platforms, funds and insiders capture the value; the voices creating the attention get nothing.

**YAPONS fixes that.** It turns attention into a measurable, on-chain asset. Link your X handle to your wallet to instantly unlock a **genesis `$YAP`** grant, then post about YAPONS and the Robinhood Chain ecosystem on X to earn on **mindshare** across the seasons that follow. The loudest, realest, most substantive voices earn `$YAP`; bots, farmers, and low-effort spam earn nothing.

Think of it as **Kaito for Robinhood Chain**: an off-chain intelligence engine that scores real attention, settled by an on-chain token anyone can verify.

## Table of Contents
- Features
- How it works
- The mindshare score
- Architecture
- Smart contracts
- Tokenomics
- Seasons
- Security
- Getting started
- Repository structure
- Roadmap
- Documentation
- Team
- Disclaimer

## Features

- 🎁 **Genesis grant on link**, link your X to your wallet and instantly unlock a one-time `$YAP` grant, sized by who you are. No yapping required. One handle, one wallet, one claim.
- 🗣️ **Yap-to-earn**, during the seasons, real attention on X converts into real `$YAP`.
- ⚡ **Instant rewards**, the genesis grant is claimable the moment you link; each season yap earns the moment it scores, claim any time.
- 🧠 **Multi-factor mindshare**, many independent signals per yap, so no single lever (bought likes, fresh accounts) can farm it.
- ⛓️ **On-chain sybil resistance**, the genesis grant boosts wallets with real Robinhood Chain activity; a fresh bot wallet (0 tx) gets no boost.
- 🚫 **Bots get zero**, authenticity, account age, and audience quality are weighted, not raw likes.
- 👀 **No wallet to check**, preview what any tweet would earn before you connect.
- 🔗 **Verifiable payouts**, signature-based, on-chain claims via an audited-style `RewardPool`.
- 🏆 **Live leaderboard, badges & profiles**, mindshare is a competitive, public sport.
- 🌊 **Genesis + 4 seasons**, link to grab genesis first; each season refills the pool.

## How it works


1 · Link your X & grab genesisProve ownership by posting a tweet containing your wallet. Linking instantly unlocks a one-time genesis $YAP grant, sized by your account. One X account maps to one wallet, one claim.


2 · Yap (seasons)Once the genesis pool drains and Season 1 opens, post substantive takes with #YAP #PONS #RH. Original yaps, quote-RTs and replies all count.


3 · Get scoredEvery season yap is weighted on mindshare (see below). Substance and real reach win; spam and bots score near zero.


4 · Earn & claimPoints convert to $YAP at a fixed rate, instantly. Claim your genesis grant and season earnings to your wallet whenever you want.


## The mindshare score

Mindshare is the **per-yap scoring** used during the seasons that run after genesis. A yap's weight is the **product** of many signals, so it can't be gamed by any one of them:

```
score = BASE(engagement) × quality × authenticity × recency × action
                        × follower × account_age × rh_affinity × streak
```

| Signal | Measures | Anti-farm property |
| --- | --- | --- |
| `engagement` | `log10(likes + 3·replies)` | log-scaled; replies weighted 3× (harder to buy) |
| `quality` | content substance (0.5–1.5) | "gm" spam → 0.5, real takes → 1.5 |
| `authenticity` | blue + reply-ratio | real discussion beats bought likes |
| `recency` | freshness | rewards timely yaps |
| `action` | yap / quote / reply | originals valued most |
| `follower` | audience quality | crypto-native reach beats bot followers |
| `account_age` | snowflake-derived age | accounts < 6 months → 0.55× |
| `rh_affinity` | genuine RH keyword context | rewards ecosystem natives |
| `streak` | consecutive days | up to +21% |

The **genesis grant** (a one-time reward at link time) is computed separately from account-level signals, `base × account_age × follower × blue_bonus × rh_chain × early`, where `blue_bonus` is ×1.5 for blue-verified, `rh_chain` boosts wallets with real on-chain Robinhood Chain activity, and `early` is up to ×3 for the first 500 to register. See `docs/scoring.md`.

Every score is fully **transparent**, the app returns the complete factor breakdown. See `docs/scoring.md`.

## Architecture

YAPONS is a **hybrid**: off-chain intelligence, on-chain settlement.

```
          X (Twitter)                         Robinhood Chain · 4663
              │                                        │
   ┌──────────▼───────────┐      voucher     ┌─────────▼──────────┐
   │  off-chain service   │──────(sign)─────►│  RewardPool.claim()│
   │  fetch · score · rank│                  │  YAP  (ERC20)      │
   └──────────┬───────────┘                  └────────────────────┘
              │  points × rate = $YAP
   ┌──────────▼───────────┐
   │  web app             │   connect wallet · claim anytime
   └──────────────────────┘
```

- **Off-chain service** (private), fetches submitted tweets for free via X's public syndication endpoint, verifies the X↔wallet link, runs the mindshare model, tracks the leaderboard, and signs claim vouchers.
- **On-chain** (this repo), the `$YAP` token and a signature-gated `RewardPool` that pays out instantly and verifiably.

Details in `docs/architecture.md`.

## Smart contracts

| Contract | Purpose |
| --- | --- |
| `YAP.sol` | ERC-20, 1,000,000,000 fixed supply, no mint after deploy |
| `RewardPool.sol` | Signature-based **instant** claims. Backend signs a wallet's cumulative earnings; users claim the delta anytime. `recoverSeed` lets the owner reclaim the remaining pool. Vouchers bind `(wallet, cumulative, pool, chainId)`, replay-safe across wallets, amounts and contracts. |
| `YapCampaigns.sol` | **Campaign escrow.** Projects escrow a `$YAP` budget for a chosen duration (1 to 90 days); a 10% platform fee is skimmed and the rest is the reward pool. Yappers claim their scored reward via signed vouchers; the creator reclaims any unspent budget after end plus a 7 day grace. See `docs/campaigns.md`. |

Tested with Foundry (unit + fuzz). Run `cd contracts && forge test`.

## Tokenomics

| | |
| --- | --- |
| **Token** | `$YAP` |
| **Supply** | 1,000,000,000 (fixed) |
| **Taxes** | none, 0% buy, 0% sell |
| **Liquidity** | locked |
| **Ownership** | renounced |
| **Launch** | fair launch on Robinhood Chain (4663) |
| **Genesis pool** | 20,000,000 `$YAP`, one-time grant at link, instant claim |
| **Yapper allocation** | 40,000,000+ `$YAP` overall |
| **Model** | fixed-rate, instant, claim anytime; genesis pool drains first-come |

The reward pool is continuously re-injected, mostly from **real revenue, not emissions**: project campaign budgets, platform fees, buybacks, and Robinhood Chain / pons fee share. Full breakdown in `docs/tokenomics.md`.

## Seasons

| Phase | Pool | Duration |
| --- | --- | --- |
| **Genesis** | 20M `$YAP`, one-time grant at link (instant) | until claimed out |
| **Season 1** | refilled, per-yap mindshare | ~2 months |
| **Season 2–4** | refilled, per-yap mindshare | ~2 months each |

Genesis is the join/onboarding reward, granted once when you link. When the genesis pool is claimed out, Season 1 begins automatically and per-yap mindshare scoring kicks in. See `docs/seasons.md`.

## Security

- **Signature-gated claims**, the `RewardPool` only pays what the backend signer authorizes; vouchers are bound to `(wallet, cumulative, pool, chainId)` and can't be replayed.
- **No user-fund drain**, `recoverSeed` moves only the pool's own balance.
- **EIP-1559-safe claim path**, raw `eth_sendTransaction`, `gasPrice = max(eth_gasPrice, baseFee×2, 0.2 gwei)`, retries, and auto chain-switch to 4663.
- **Secrets never ship**, `.env`, `.signer_key`, `.deploy_key` are gitignored.

Report issues to [@YaponsRH](https://x.com/YaponsRH). Policy: `SECURITY.md`.

## Getting started

```bash
git clone https://github.com/YaponsRH/yapons
cd yapons/contracts

forge install foundry-rs/forge-std
forge test -vvv          # unit + fuzz
forge build

# deploy (needs a funded deployer + a signer address)
DEPLOY_PK=0x... SIGNER_ADDR=0x... ./deploy.sh 
```

## Repository structure

```
contracts/            Foundry project
  src/YAP.sol           1B fixed-supply ERC-20
  src/RewardPool.sol    signature-based instant claim + recoverSeed
  src/MockERC20.sol     test helper
  test/                 unit + fuzz
  script/Deploy.s.sol   deploy script
  deploy.sh             one-command deploy
brand/                logo, hand gestures, glossy icon set
docs/                 architecture · scoring · tokenomics · seasons · api · brand · faq
```

> The off-chain scoring engine and web app run as a separate service and are not open-sourced.

## Roadmap

- [x] `$YAP` token + `RewardPool` (instant, signature-based claims)
- [x] Multi-factor mindshare scoring + anti-bot quality
- [x] Verified X↔wallet linking, leaderboard, badges, profiles
- [x] Genesis campaign design (20M, first-500 early multiplier)
- [x] Glossy web app, litepaper, admin
- [ ] Mainnet deployment on Robinhood Chain
- [ ] Project campaigns (any project funds a yap-reward budget)
- [ ] Auto-discovery (score yaps without manual submission)
- [ ] Seasons 1–4

## Documentation

| Doc | |
| --- | --- |
| Architecture | how the off-chain and on-chain layers fit together |
| The mindshare score | every factor, and why it resists farming |
| Tokenomics | supply, instant rewards, pool sustainability |
| Seasons | genesis → 4 seasons |
| API | public + admin endpoints |
| Brand | colors, type, asset kit |
| FAQ | common questions |

## Team

| | Role | |
| --- | --- | --- |
| **Jayden** | Founder | [@0xJaydenAng](https://x.com/0xJaydenAng) |
| **Charlie** | Co-Founder | [@thecharlietan](https://x.com/thecharlietan) |
| **anon** | CTO | building in silence 🥷 |

## Disclaimer

This software is provided "as is" under the MIT license, without warranty of any kind. `$YAP` has no intrinsic value or guaranteed return; nothing here is financial advice. Participate only with what you can afford to lose.


Built by @0xJaydenAng & @thecharlietan
rewarding real yappers on Robinhood Chain 🗣️
