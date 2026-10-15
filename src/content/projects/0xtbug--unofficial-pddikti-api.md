---
title: "0xtbug/unofficial-pddikti-api"
owner: "0xtbug"
name: "unofficial-pddikti-api"
fullName: "0xtbug/unofficial-pddikti-api"
description: "Reverse-engineered API for PDDIKTI — Indonesian Higher Education Database.  Provides access to universities, study programs, lecturers, and students data."
sourceUrl: "https://github.com/0xtbug/unofficial-pddikti-api"
stars: 72
forks: 23
language: "Go"
topics: ["pddikti-api"]
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-07-19T09:08:23Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# PDDIKTI Unofficial API
Reverse-engineered API for [PDDIKTI](https://pddikti.kemdiktisaintek.go.id/) — Indonesian Higher Education Database.

Provides access to universities, study programs, lecturers, and students data.

## Quick Start
### Manual Setup

```bash
# 1. Clone repository
git clone https://github.com/0xtbug/unofficial-pddikti-api
cd unofficial-pddikti-api

# 2. Start FlareSolverr (required)
docker run -d --name flaresolverr -p 8191:8191 --restart unless-stopped \
  ghcr.io/flaresolverr/flaresolverr:latest

# 3. Run
# Option A: Run directly with Go
go mod tidy
go run ./cmd/main.go

# Option B: Build & run binary
go build -o pddikti-api.exe ./cmd/main.go
./pddikti-api.exe

# 4. Test
curl http://localhost:8080/api/stats
```

### Docker Compose (Recommended)

```bash
# Production mode
docker-compose up -d

# Development mode (hot-reload with Air)
docker-compose up

# Stop all services
docker-compose down
```


### Makefile Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make run` | Start production (Docker) |
| `make dev` | Start development with hot-reload |
| `make stop` | Stop all containers |
| `make logs` | View container logs |
| `make build` | Build Docker images |
| `make swagger` | Regenerate Swagger docs |
| `make build-local` | Build binary locally |
| `make test` | Run tests |

## Config

| Env | Default | Description |
|-----|---------|-------------|
| `PORT` | `8080` | Server port |
| `FLARESOLVERR_URL` | `http://localhost:8191` | FlareSolverr URL (`http://flaresolverr:8191` in Docker) |
| `UPSTREAM_BASE_URL` | `https://pddikti.kemdiktisaintek.go.id/api` | PDDIKTI upstream |
| `AUTH_ENABLED` | `false` | Enable Bearer token authentication (`true`/`false`) |
| `API_TOKEN` | `""` | Valid Bearer token when auth is enabled |

## Authentication

The API supports optional token authentication. When enabled, all `/api` endpoints require a valid token via the `Authorization` header. Both `Authorization: Bearer ` and `Authorization: ` (raw token) formats are accepted.

In Swagger UI, just enter the token value directly in the authorization dialog — no `Bearer ` prefix needed.

| Env | Default | Description |
|-----|---------|-------------|
| `AUTH_ENABLED` | `false` | Enable/disable authentication (`true`/`false`) |
| `API_TOKEN` | `""` | The valid Bearer token |

**Example usage:**

```bash
# Start server with auth enabled
AUTH_ENABLED=true API_TOKEN=my-secret-token go run ./cmd/main.go

# Make authenticated requests
curl -H "Authorization: Bearer my-secret-token" http://localhost:8080/api/stats

# Without auth (default)
go run ./cmd/main.go
curl http://localhost:8080/api/stats
```

When auth is disabled (`AUTH_ENABLED=false`), all requests pass through without a token.

## Endpoints

Swagger UI: http://localhost:8080/swagger/index.html

## Testing

```bash
# Run all tests with coverage
go test ./internal/... -cover -count=1 -timeout 120s

# Run specific package tests
go test ./internal/api/... -v
go test ./internal/middleware/... -v
go test ./internal/config/... -v
```

## Docs

- Swagger JSON — OpenAPI 3.0 spec

## Stars History
