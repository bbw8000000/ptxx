---
title: "halarewich/slotstream"
owner: "halarewich"
name: "slotstream"
fullName: "halarewich/slotstream"
description: "Polyglot real-time observability platform for the Solana blockchain"
sourceUrl: "https://github.com/halarewich/slotstream"
stars: 39
forks: 4
language: "Rust"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-08-25"
pushedAt: "2026-08-24T11:13:51Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# ⚡ SlotStream

**A polyglot, production-grade real-time observability platform for the Solana blockchain.**

SlotStream streams blocks, transactions, wallet activity, and program logs directly off Solana's WebSocket subscriptions — no polling, sub-second latency — and turns that raw firehose into dashboards, alerts, and historical analytics.

[*图片：License: MIT*](https://opensource.org/licenses/MIT)
[*图片：Rust*](https://www.rust-lang.org/)
[*图片：Go*](https://go.dev/)
[*图片：TypeScript*](https://www.typescriptlang.org/)
[*图片：Python*](https://www.python.org/)
[*图片：Anchor*](https://www.anchor-lang.com/)
[*图片：Docker*](https://www.docker.com/)
*图片：CI*
*图片：PRs Welcome*

---

## 📚 Table of Contents

- Overview
- Why SlotStream
- Architecture
- Monorepo Structure
- Services
  - engine (Rust)
  - api (Go)
  - dashboard (TypeScript / React)
  - analytics (Python)
  - alerting (Node.js)
  - contracts (Rust / Anchor)
- Quick Start (Docker Compose)
- Local Development (per service)
- Configuration
- API Reference
- Data Flow
- Testing
- Deployment
- CI/CD
- Performance
- Security
- Roadmap
- Contributing
- License
- Acknowledgments

---

## Overview

Solana produces a new block roughly every 400ms. Most tooling reacts to this by polling REST endpoints, which is slow, rate-limited, and wasteful. SlotStream instead treats the chain as a live event stream: every slot, account change, and program log is picked up the moment it's emitted and pushed through a typed pipeline into dashboards, alert channels, and a queryable historical store.

The project is deliberately polyglot — each service is written in the language best suited to its job, rather than forcing one runtime to do everything:

| Concern | Language | Why |
|---|---|---|
| High-throughput WebSocket ingestion | **Rust** | Zero-cost abstractions, predictable latency under load |
| Public API / auth / rate limiting | **Go** | Simple concurrency model, fast cold starts, easy to operate |
| Dashboard UI | **TypeScript / React** | Best-in-class ecosystem for real-time UI |
| Historical analysis & anomaly detection | **Python** | Pandas/NumPy/scikit-learn ecosystem |
| Alerting & webhook fan-out | **Node.js** | Lightweight, huge integration ecosystem (Discord.js, Telegraf) |
| On-chain registry program | **Rust / Anchor** | Native Solana program development |

---

## 🎯 Why SlotStream

- **No polling, ever.** Every component subscribes; nothing loops on a REST endpoint.
- **Composable services**, not a monolith — run only the pieces you need.
- **Typed contracts between services** via Protobuf, so the Rust engine, Go API, and TypeScript dashboard all agree on shapes.
- **Built to run in production**, not just a demo — includes health checks, structured logging, metrics export, and horizontal scaling guidance.

---

## 🏗 Architecture

```
                                   ┌────────────────────────┐
                                   │      Solana RPC          │
                                   │  (Helius / QuickNode /   │
                                   │   self-hosted validator) │
                                   └────────────┬─────────────┘
                                                │ WebSocket
                                                ▼
                                   ┌────────────────────────┐
                                   │   engine (Rust)          │
                                   │  slot/account/log         │
                                   │  subscriptions, decoding, │
                                   │  backpressure-aware queue │
                                   └────────────┬─────────────┘
                                                │ gRPC / Protobuf
                     ┌──────────────────────────┼──────────────────────────┐
                     ▼                          ▼                          ▼
          ┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐
          │   api (Go)           │   │  alerting (Node.js)  │   │  analytics (Python) │
          │  REST/GraphQL,       │   │  Discord/Telegram/   │   │  anomaly detection,  │
          │  auth, rate limiting │   │  custom webhooks     │   │  batch aggregation   │
          └──────────┬──────────┘   └────────────────────┘   └──────────┬──────────┘
                     │                                                   │
                     ▼                                                   ▼
          ┌────────────────────┐                              ┌────────────────────┐
          │ dashboard (TS/React) │                              │  Postgres/Timescale  │
          │  live charts, feeds   │                              │  historical storage   │
          └────────────────────┘                              └────────────────────┘

                                   ┌────────────────────────┐
                                   │  contracts (Anchor/Rust)  │
                                   │  optional on-chain event  │
                                   │  registry / attestations  │
                                   └────────────────────────┘
```

---

## 📁 Monorepo Structure

```
slotstream/
├── engine/                     # Rust — core WebSocket ingestion & decoding
│   ├── src/
│   │   ├── subscriptions/
│   │   ├── decoders/
│   │   └── queue/
│   ├── benches/                # Criterion benchmarks
│   ├── tests/
│   ├── Cargo.toml
│   ├── Cargo.lock
│   ├── CHANGELOG.md
│   └── Dockerfile
│
├── api/                        # Go — public API gateway
│   ├── cmd/server/
│   ├── internal/
│   │   ├── handlers/
│   │   ├── auth/
│   │   └── ratelimit/
│   ├── go.mod
│   ├── go.sum
│   ├── CHANGELOG.md
│   └── Dockerfile
│
├── dashboard/                   # TypeScript / React — live UI
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── ws/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── .eslintrc.cjs
│   ├── CHANGELOG.md
│   └── Dockerfile
│
├── analytics/                    # Python — historical & anomaly detection
│   ├── slotstream_analytics/
│   │   ├── pipelines/
│   │   ├── models/
│   │   └── notebooks/
│   ├── tests/
│   ├── pyproject.toml
│   ├── requirements-dev.txt
│   ├── CHANGELOG.md
│   └── Dockerfile
│
├── alerting/                     # Node.js — notification fan-out
│   ├── src/
│   │   ├── channels/
│   │   └── rules/
│   ├── package.json
│   ├── CHANGELOG.md
│   └── Dockerfile
│
├── contracts/                     # Rust / Anchor — on-chain program
│   ├── programs/slotstream_registry/
│   ├── tests/
│   ├── Anchor.toml
│   └── CHANGELOG.md
│
├── proto/                         # Shared Protobuf schemas (engine ↔ api ↔ dashboard)
│   └── slotstream.proto
│
├── infra/                         # Deployment
│   ├── docker-compose.yml
│   ├── docker-compose.staging.yml
│   ├── k8s/
│   ├── terraform/
│   └── helm/
│
├── scripts/                       # Repo-wide dev/ops tooling
│   ├── bootstrap.sh                # one-shot local env setup
│   ├── release.sh                  # cross-service version bump + tag
│   ├── seed-db.sh
│   └── check-env.sh
│
├── docs/                          # Extended documentation
│   ├── architecture/
│   │   └── adr/                    # Architecture Decision Records
│   │       ├── 0001-polyglot-services.md
│   │       ├── 0002-protobuf-contracts.md
│   │       └── 0003-timescaledb-for-history.md
│   ├── openapi.yaml
│   └── runbooks/                   # on-call operational runbooks
│
├── examples/                      # Minimal usage examples per service
│   ├── watch-wallet.sh
│   └── graphql-queries.md
│
├── .github/
│   ├── workflows/                  # CI/CD pipelines (per-service + release)
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODEOWNERS
│   └── dependabot.yml
│
├── .vscode/                        # Shared editor settings (optional, gitignored by default)
├── .editorconfig
├── .gitignore
├── .dockerignore
├── .pre-commit-config.yaml
├── .nvmrc
├── .env.example
├── Makefile                        # make dev / make test-all / make release
├── CHANGELOG.md                    # root-level, aggregates per-service releases
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE
├── VERSION
└── README.md
```

### Root-level files at a glance

| File | Purpose |
|---|---|
| `CODEOWNERS` | Auto-assigns reviewers per directory (e.g. `/engine/` → Rust maintainers) |
| `dependabot.yml` | Automated dependency update PRs across all five package ecosystems |
| `.pre-commit-config.yaml` | Runs formatters/linters (`rustfmt`, `gofmt`, `eslint`, `black`) before every commit |
| `CHANGELOG.md` | Root-level changelog aggregating notable changes across all services, [Keep a Changelog](https://keepachangelog.com/) format |
| `SECURITY.md` | Vulnerability disclosure policy and supported version table |
| `CODE_OF_CONDUCT.md` | [Contributor Covenant](https://www.contributor-covenant.org/) v2.1 |
| `VERSION` | Current release version, read by `scripts/release.sh` for tagging |
| `Makefile` | Single entrypoint for common tasks across all six services (`make test-all`, `make lint-all`, `make dev`) |
| `docs/architecture/adr/` | Architecture Decision Records — the *why* behind major structural choices, not just the *what* |
| `docs/runbooks/` | Step-by-step operational guides for on-call (e.g. "engine stopped receiving slot updates") |

---

## 🧩 Services

### 1. `engine` — Rust

The core ingestion layer. Opens and maintains persistent WebSocket subscriptions to Solana RPC (`slotSubscribe`, `accountSubscribe`, `logsSubscribe`, `programSubscribe`), decodes raw payloads, and republishes typed events over gRPC to downstream consumers.

- Async runtime: `tokio`
- WebSocket client: `tokio-tungstenite`
- Solana SDK: `solana-client`, `solana-sdk`
- Backpressure-aware bounded channel to prevent memory blowup under bursty load
- Automatic reconnect with exponential backoff on RPC disconnects

### 2. `api` — Go

The public-facing gateway. Exposes REST and GraphQL endpoints over data produced by `engine`, handles authentication (API keys / JWT), and enforces per-client rate limits.

- HTTP framework: `chi`
- GraphQL: `gqlgen`
- Auth: JWT + API key middleware
- Structured logging: `zap`

### 3. `dashboard` — TypeScript / React

The live UI. Connects to `api`'s WebSocket relay and renders real-time feeds, charts, and alerts.

- Framework: React + Vite
- State/data: React Query + a lightweight WebSocket hook
- Charts: `recharts`
- Styling: Tailwind CSS

### 4. `analytics` — Python

Batch and near-real-time analysis over data persisted by `engine`/`api`: rolling TPS baselines, skip-rate trend detection, and anomaly flags (e.g., sudden liquidity pulls, wallet clustering).

- Data: `pandas`, `numpy`
- Modeling: `scikit-learn`
- Scheduling: `celery` + Redis for periodic jobs
- Notebooks in `analytics/slotstream_analytics/notebooks/` for exploratory work

### 5. `alerting` — Node.js

Subscribes to rule-matched events and fans them out to Discord, Telegram, or arbitrary webhooks.

- `discord.js` for Discord integration
- `telegraf` for Telegram bots
- Rule engine: simple declarative YAML rules matched against incoming event streams

### 6. `contracts` — Rust / Anchor

An optional on-chain program that can record attestations or registry entries on-chain — useful if you want tamper-evident logging of specific tracked events rather than only off-chain storage.

- Framework: Anchor
- Tests: TypeScript + `anchor-bankrun` for fast local test runs

---

## 🚀 Quick Start (Docker Compose)

The fastest way to run the full stack locally:

```bash
git clone https://github.com//slotstream.git
cd slotstream
cp .env.example .env   # fill in your RPC endpoint and secrets
docker compose -f infra/docker-compose.yml up --build
```

This brings up:

| Service | Port |
|---|---|
| `engine` (gRPC) | `50051` |
| `api` (REST/GraphQL) | `8080` |
| `dashboard` | `3000` |
| `analytics` (worker, no exposed port) | — |
| `alerting` (worker, no exposed port) | — |
| Postgres/TimescaleDB | `5432` |
| Redis | `6379` |

Open `http://localhost:3000` once containers are healthy.

---

## 🛠 Local Development (per service)


engine (Rust)

```bash
cd engine
cargo build
cargo run
```

Requires Rust `>= 1.75` (`rustup update stable`).


api (Go)

```bash
cd api
go mod download
go run ./cmd/server
```

Requires Go `>= 1.22`.


dashboard (TypeScript / React)

```bash
cd dashboard
npm install
npm run dev
```

Requires Node.js `>= 18`.


analytics (Python)

```bash
cd analytics
python -m venv .venv && source .venv/bin/activate
pip install -e .
python -m slotstream_analytics.pipelines.run
```

Requires Python `>= 3.11`.


alerting (Node.js)

```bash
cd alerting
npm install
npm run start
```


contracts (Anchor / Rust)

```bash
cd contracts
anchor build
anchor test
```

Requires Anchor CLI `>= 0.30` and Solana CLI `>= 1.18`.


---

## ⚙️ Configuration

Root-level `.env` (referenced by `docker-compose.yml`):

```env
# Solana RPC
SOLANA_WS_ENDPOINT=wss://your-rpc-provider.com/ws
SOLANA_RPC_ENDPOINT=https://your-rpc-provider.com

# Watch targets (optional, comma-separated)
WATCH_ADDRESSES=
WATCH_PROGRAM_IDS=

# Datastore
DATABASE_URL=postgres://slotstream:slotstream@postgres:5432/slotstream
REDIS_URL=redis://redis:6379

# Alerting
DISCORD_WEBHOOK_URL=
TELEGRAM_BOT_TOKEN=

# API
JWT_SECRET=
API_RATE_LIMIT_PER_MIN=120

# Misc
LOG_LEVEL=info
```

Each service also supports a local `.env` inside its own directory for service-specific overrides during development.

---

## 📡 API Reference

Base URL (local): `http://localhost:8080`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/v1/slots/latest` | Latest processed slot and finality status |
| `GET` | `/v1/slots/stream` | WebSocket relay of live slot events |
| `GET` | `/v1/accounts/{address}` | Current tracked state for a watched address |
| `GET` | `/v1/accounts/{address}/events` | Historical event feed for an address |
| `GET` | `/v1/programs/{programId}/logs` | Recent logs for a tracked program |
| `GET` | `/v1/metrics/network` | Rolling TPS, average slot time, skip rate |
| `POST` | `/v1/webhooks` | Register a webhook alert rule |
| `GET` | `/graphql` | GraphQL playground / endpoint |

Full OpenAPI spec: `docs/openapi.yaml` *(generated from `api/`)*.

---

## 🔄 Data Flow

1. `engine` opens WebSocket subscriptions to the configured Solana RPC.
2. Raw events are decoded into typed Protobuf messages (schema in `proto/slotstream.proto`).
3. Events are published over gRPC to `api`, `alerting`, and `analytics` simultaneously.
4. `api` relays live events to `dashboard` over WebSocket and serves historical queries from Postgres/TimescaleDB.
5. `alerting` matches events against declarative rules and dispatches to Discord/Telegram/webhooks.
6. `analytics` runs scheduled jobs (via Celery) to compute rolling baselines and flag anomalies, writing results back to Postgres for `api` to serve.

---

## ✅ Testing

| Service | Command | Framework |
|---|---|---|
| engine | `cargo test` | Rust built-in test harness |
| api | `go test ./...` | Go built-in `testing` |
| dashboard | `npm run test` | Vitest + React Testing Library |
| analytics | `pytest` | Pytest |
| alerting | `npm run test` | Jest |
| contracts | `anchor test` | Anchor + `anchor-bankrun` |

Run everything at once from the repo root:

```bash
make test-all
```

---

## 🚢 Deployment

- **Docker:** each service ships its own `Dockerfile`; `infra/docker-compose.yml` covers local/staging use.
- **Kubernetes:** manifests in `infra/k8s/` (Deployments, Services, HPA for `engine` and `api`).
- **Terraform:** `infra/terraform/` provisions managed Postgres, Redis, and container hosting on your cloud provider of choice.

```bash
# Example: deploy to an existing k8s cluster
kubectl apply -f infra/k8s/
```

---

## 🔁 CI/CD

GitHub Actions workflows in `.github/workflows/`:

- `engine-ci.yml` — `cargo fmt --check`, `clippy`, `cargo test`
- `api-ci.yml` — `go vet`, `golangci-lint`, `go test`
- `dashboard-ci.yml` — `eslint`, `tsc --noEmit`, `vitest`
- `analytics-ci.yml` — `ruff`, `pytest`
- `contracts-ci.yml` — `anchor build`, `anchor test`
- `docker-publish.yml` — builds and pushes images on tagged releases

---

## 📊 Performance

Indicative numbers from internal load testing against mainnet-beta via a dedicated RPC provider (your results will vary by provider and network conditions):

| Metric | Value |
|---|---|
| Ingestion latency (slot emit → engine processed) | ~15-40ms |
| End-to-end latency (chain → dashboard render) | ~80-150ms |
| Sustained events/sec handled by `engine` | 5,000+ |
| `api` P99 latency under 500 req/s | < 60ms |

---

## 🔐 Security

- No private keys are ever required for read-only streaming — `engine` only subscribes to public chain data.
- `contracts` operations that sign/send transactions use a separate, explicitly-scoped keypair — never reuse a wallet key across services.
- Secrets are loaded from environment variables only; nothing is committed to the repo. See `.env.example`.
- Report vulnerabilities privately per `SECURITY.md` rather than opening a public issue.

---

## 🗺 Roadmap

- [ ] Multi-RPC failover and automatic subscription rebalancing in `engine`
- [ ] Historical replay mode for post-mortem incident analysis
- [ ] Prometheus/Grafana exporter for `engine` and `api` metrics
- [ ] DEX pool price streaming (Raydium/Orca) as a first-class event type
- [ ] Public hosted demo environment
- [ ] gRPC-Web support so `dashboard` can talk to `engine` directly for lower-latency views

---

## 🤝 Contributing

Contributions are welcome across any of the six services. Please open an issue to discuss significant changes before submitting a PR.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Make your changes in the relevant service directory
4. Run that service's test suite (see Testing)
5. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)
6. Open a Pull Request

See `CONTRIBUTING.md` for full guidelines, including per-language style conventions.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

## 🙏 Acknowledgments

- [Solana Labs](https://solana.com) for the core protocol
- [Anchor](https://www.anchor-lang.com/) for on-chain program tooling
- [Helius](https://helius.dev) / [QuickNode](https://quicknode.com) for RPC infrastructure
- The maintainers of `tokio`, `chi`, `gqlgen`, and `pandas` — the backbone of this project's four backend languages
