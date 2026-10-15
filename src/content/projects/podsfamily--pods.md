---
title: "podsfamily/pods"
owner: "podsfamily"
name: "pods"
fullName: "podsfamily/pods"
description: "Rent out your idle GPU, get paid in tokenized NVDA on Robinhood Chain."
sourceUrl: "https://github.com/podsfamily/pods"
stars: 74
forks: 9
language: "TypeScript"
topics: ["depin", "distributed-computing", "ethereum", "gpu", "tokenized-equity"]
license: "MIT"
homepage: "https://pods.family"
defaultBranch: "main"
snapshotDate: "2026-09-04"
pushedAt: "2026-09-03T22:30:45Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# pods

Rent out your idle GPU. Get paid in tokenized NVDA.

*图片：ci*
*图片：license*
[*图片：chain*](https://robinhoodchain.blockscout.com)
*图片：node*

> **Nothing pays out yet.** The coordinator isn't deployed anywhere, so there's
> no network to join. Everything here runs locally against a coordinator you
> start yourself. LAUNCH.md lists what's missing before this can
> hold anyone's money. If you're going to run it on your own machine, skim
> SAFETY.md first.

Install the binary and run it. That's the whole setup.

```sh
curl -fsSL https://pods.family/install.sh | sh
pods
```

Or through a package manager:

```sh
brew install podsfamily/tap/pods    # macOS, Linux
scoop install pods                  # Windows
```

(Those 404 until there's a release. Build your own with
`pnpm --filter @pods/node build:all`.)

First launch creates a node key, checks Docker, opens your browser for
MetaMask, benchmarks the card, and goes online. You don't have to do any of it
by hand.

```
▛▀▜ pods · sell your gpu time                                        pods.family
▙▄▟ setting up — this takes about a minute

╭─ getting started ────────────────────────────────────────────────────────────╮
│                                                                              │
│  ✓ Node identity                                            0x7560adDF…C624  │
│  ✓ Docker                                                             ready  │
│  ⠹ Connect your wallet                    approve the signature in MetaMask  │
│       └ a browser tab is open at http://localhost:8899                       │
│  ○ Measure your hardware                   works out what your GPU is worth  │
│  ○ Start earning                           joins the network and takes jobs  │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯
```

Open it again later and it just starts earning. You need Docker installed,
because jobs run in containers. That's the only prerequisite.

## The dashboard

Four tabs, all keyboard driven. Utilisation, temperature, power draw and VRAM
come from `nvidia-smi` twice a second, and every card gets its own trace.

```
╭─ earnings · USD ──────────────────────╮ ╭─ node ─────────────────────────────╮
│                                       │ │                                    │
│    ╷    ╭─╮ ╭─╮ ╷ ╷ ╭─╮ ╭─╮ ╭─╮       │ │  compute score                2.41 │
│    │    ╭─╯ ├─┤ ╰─┤ ╰─┤  ─┤ │ │       │ │  reliability          ■■■■■■■■ 94% │
│    ╵ ▄  ╰── ╰─╯   ╵ ╰─╯ ╰─╯ ╰─╯       │ │  jobs completed                218 │
│                                       │ │  wallet                0x9E1a…8a1C │
│  this session                  8 jobs │ │  docker                      ready │
│  pending                    $0.184220 │ │                                    │
│  claimable              0.013058 NVDA │ │  coordinator api.pods.family       │
╰───────────────────────────────────────╯ ╰────────────────────────────────────╯

╭─ devices · 2 ────────────────────────────────────────────────────────────────╮
│  GPU 0 NVIDIA GeForce RTX 4090             ■■■■■■■■■■■■■■■■■■■■■■■■■■□□  94% │
│       71°C · 412 W · 19.3/24.0 GB                   ▅▆▆▇▇████▇▇▆▆▅▅▄▄▄▅▅▆▆▇▇ │
│  GPU 1 NVIDIA GeForce RTX 4090             ■■■■■■■■■■■■■■■■■□□□□□□□□□□□  62% │
│       58°C · 244 W · 9.0/24.0 GB                    ▆▆▆▅▅▅▄▄▃▃▃▂▂▂▂▂▂▂▃▃▃▄▄▅ │
╰──────────────────────────────────────────────────────────────────────────────╯
```

**Earn** has your session total, compute score, reliability and live telemetry.
**Wallet** separates your node key from your payout address and shows pending,
claimable and claimed. **Jobs** is a table of what ran, how long it took and
what it paid. **Settings** covers the coordinator, benchmark results and the
sandbox policy.

Keys: `1`–`4` or arrows switch tabs, `s` toggles online, `l` links a wallet, `b`
benchmarks (`d` for the slow real one), `r` re-checks hardware, `q` quits.

If you'd rather not have a UI at all, `pods start` runs the same agent and
prints log lines. `init`, `link`, `bench`, `earnings` and `status` all work as
one-shot commands.

## How it works

```
┌───────────────┐        lease job         ┌─────────────────┐
│   pods node   │ ───────────────────────▶ │   coordinator   │
│  (your GPU)   │ ◀─────────────────────── │  match + price  │
└───────┬───────┘      signed receipt      └────────┬────────┘
        │                                           │ once per epoch:
        │ docker run --gpus                         │ merkle root of
        ▼                                           ▼ cumulative balances
   ┌─────────┐                              ┌───────────────────┐
   │ the job │                              │ RewardDistributor │
   └─────────┘                              │    (on-chain)     │
                                            └─────────┬─────────┘
                                                      │ claim(proof)
                                                      ▼
                                             your MetaMask wallet
```

Your node has its own signing key, generated locally. It signs job receipts,
never holds funds, and is the only thing the coordinator ever knows you by.

You don't tell anyone your wallet. Earnings are committed to the merkle tree
against the node key, and you name a payout address at claim time by signing an
authorisation locally. The coordinator can't correlate a wallet with an IP or a
hardware fingerprint because it never had one. Anyone can submit the claim
transaction, so you don't need an address with ETH in it either.

The coordinator hands out one job at a time. Your agent runs it in Docker and
returns a receipt signed by the node key. Some of the jobs it hands out are
canaries: work where the coordinator already knows the right answer. They look
identical to paid work on the wire, so a node that fakes execution loses
reliability and money.

Earnings accrue off-chain in micro-USD. At the end of each epoch the coordinator
reads the Chainlink NVDA/USD feed, converts everyone's balance into NVDA share
units, and publishes one merkle root. You claim whenever gas is worth it. The
committed amount is cumulative, so skipping epochs costs you nothing.

## What you earn

```
payout = rate_per_gpu_hour × gpu_hours × compute_score × reliability
```

A reference card (roughly 150 fp16 TFLOP/s, 900 GB/s) scores 1.0. Faster silicon
earns proportionally more for the same hour. Reliability is a rolling average of
your job outcomes, so a node that keeps dropping work is worth less than one
that doesn't.

## Rewards are actual NVDA

Robinhood Chain is a permissionless Arbitrum Orbit L2, chain id `4663`. The
tokenized stocks on it are plain ERC-20s. No allowlist on transfers, no KYC gate,
no pause switch. A contract can hold them and pay them out, which is exactly
what this does.

| | |
| --- | --- |
| NVIDIA • Robinhood Token (`NVDA`, 18 dp) | `0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC` |
| Chainlink `NVDA/USD` (8 dp) | `0x379EC4f7C378F34a1B47E4F3cbeBCbAC3E8E9F15` |
| RPC | `https://rpc.mainnet.chain.robinhood.com` |

Once an epoch closes you're holding stock, not a dollar balance. Settlement
refuses to run against a stale price and refuses to publish a root the pool
can't cover.

`contracts/test/RewardDistributorFork.t.sol` runs against real mainnet state:
the distributor holds NVDA, pays fresh wallets, and those wallets can move what
they got.

## What you give up by running a node

Your OS family, your GPU models and VRAM, a benchmark number, and your IP
address. Not your wallet, not your kernel version, not your driver version, not
your job output. SAFETY.md has the details and the parts that
aren't solved.

## Layout

Deeper detail in ARCHITECTURE.md.

| path | what |
| --- | --- |
| `apps/node` | the `pods` CLI and dashboard (`src/tui`) |
| `apps/coordinator` | matching, pricing, receipts, budgets, settlement |
| `apps/e2e` | full-loop test plus adversarial sandbox checks |
| `packages/protocol` | wire types, pricing, signing, merkle |
| `contracts` | `RewardDistributor` and its Foundry tests |

The agent loop never prints anything. It emits events
(`apps/node/src/events.ts`), which is how the dashboard and the headless CLI
share one implementation instead of drifting apart.

## Building from source

You only need this if you're working on pods itself.

```sh
pnpm install
cp .env.example .env

# terminal 1
pnpm dev:coordinator

# terminal 2
pnpm --filter @pods/node dev

# binaries for every platform, with checksums, into dist/
pnpm --filter @pods/node build:all
```

Submitting work needs an API key, because every job reserves its worst-case
payout from a funded account. Without that, anyone could point jobs at their own
node and drain the pool for free.

```sh
curl -X POST https://api.pods.family/v1/admin/requesters \
  -H "authorization: Bearer $PODS_ADMIN_TOKEN" -H 'content-type: application/json' \
  -d '{"label":"me","budgetUusd":50000000}'

curl -X POST https://api.pods.family/v1/jobs \
  -H "authorization: Bearer $PODS_API_KEY" -H 'content-type: application/json' \
  -d '{"image":"alpine:3.20","cmd":["sh","-c","echo hello from pods"]}'
```

Then settle and check what you're owed:

```sh
pnpm --filter @pods/coordinator settle
pnpm --filter @pods/node dev earnings
```

## Tests

```sh
pnpm -r typecheck
pnpm --filter @pods/e2e test       # link → run → pay → settle → claim
pnpm --filter @pods/e2e sandbox    # hostile containers trying to escape

cd contracts && forge install foundry-rs/forge-std --no-git
forge test                         # fork suite reports as skipped
forge test --fork-url robinhood    # + real NVDA on mainnet state
```

The sandbox suite launches containers that try to reach the network, write to
the host, escalate privileges and fork-bomb the machine, then checks each one
failed. See SAFETY.md.

The Solidity tests verify proofs built by the TypeScript merkle code
(`contracts/test/fixtures/claim.json`, regenerate with
`pnpm --filter @pods/e2e fixture`). If the two ever disagree, the tests fail
instead of the payouts.

## Where this actually is

Working: the dashboard, wallet linking, registration with signature checks, job
dispatch, sandboxed execution, signed receipts, canary verification, reliability
scoring, live telemetry, budgets, Chainlink-priced conversion to NVDA, merkle
settlement, on-chain claims.

Not working yet, and this list matters more than the one above:

- The coordinator keeps everything in one JSON file. No transactions, no
  locking, no backups.
- Nothing stops one person registering a thousand fake nodes.
- Benchmarks are self-reported. Claim an H100, get paid like an H100.
- Requesters are funded by hand, so the pool only ever drains.
- Canaries catch a node that fakes execution. They don't catch one that ran your
  job on worse hardware than it claimed.
- One coordinator holds the ledger and the publishing key.
- Job payloads run in the open on someone else's machine.
- One job per node at a time.
- Binaries aren't signed. It doesn't bite on the install script or Homebrew,
  because macOS only quarantines browser downloads — but grabbing a binary off
  the Releases page in a browser gives you a file macOS refuses to run.

LAUNCH.md goes through these in the order I'd fix them.

## Contributing

CONTRIBUTING.md covers setup and what review looks for.
Security issues go through SECURITY.md, not public issues.

## License

MIT
