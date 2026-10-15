---
title: "evascasino/Capivara_casino"
owner: "evascasino"
name: "Capivara_casino"
fullName: "evascasino/Capivara_casino"
description: "Capivara Bet — casino & sportsbook operator platform (Laravel/VanguardLTE, Script.Casino). Player lobby, admin, sports module. Self-host with Docker. Game HTML5 clients & licences not included ."
sourceUrl: "https://github.com/evascasino/Capivara_casino"
stars: 62
forks: 0
language: "PHP"
topics: ["casino", "casino-game", "casino-script", "casino-sitesi", "casino-slots-slot-machines", "casino-technology", "casinoapi", "script-casino"]
license: "NOASSERTION"
homepage: "https://evascasino.com/"
defaultBranch: "main"
snapshotDate: "2026-10-15"
pushedAt: "2026-10-14T10:18:32Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Capivara Bet

*图片：Capivara Bet — casino lobby (screenshot)*

**Capivara Bet** is a white-label **casino and sportsbook platform** built on the [Script.Casino](https://script.casino) / VanguardLTE stack: player lobby, wallet, admin back office, bonuses, reporting, and game catalogue integration.

This repository contains the **application source**, Docker setup, and operator documentation for self-hosted deployments.

| | |
|---|---|
| **Product** | Capivara Bet |
| **Platform** | [Script.Casino](https://script.casino) |
| **Stack** | Laravel 8 · PHP 7.4 · MariaDB · React player shell · optional Node sports ingestion |
| **Try it** | Self-host with Docker → http://127.0.0.1:8080 |

---

## Overview

Use this repo to **evaluate, brand, and deploy** your own Capivara Bet instance. The lobby, sports views, and admin tools ship here; **you** provide hosting, compliance, payment configuration, and **licensed game client assets** where required.

**This repository does not operate a casino.** It does not accept wagers, process real-money payments, or grant gambling licences. Running it locally is a **software demo** on your machine only.

---

## Key features

- **Player front office** — casino grid, categories, providers, sports navigation, wallet UI (gateways configured in admin).
- **Back office** — shops, users, roles, games, bonuses, tournaments, statistics.
- **Sports** — Laravel sports API + optional **Node ingestion** (port `1213`) when `SPORTS_API_TOKEN` is set.
- **Docker** — MariaDB seed schema, web container, optional sports service.
- **Branding** — Capivara Bet theme (logo, copy, footer); adaptable for your operator brand.

---

## What is in this repo vs what you add

| Included in GitHub | Not included (by design) |
|--------------------|---------------------------|
| Laravel / VanguardLTE application code | Third-party **slot HTML5 client packs** (`public/games/…`) |
| Database seed / schema for local dev | Studio trademarks & artwork you are not licensed to redistribute |
| Compiled front-end (`public/js`, themes) | Production secrets (`.env`, keys, payment credentials) |
| GeoIP path docs under `storage/app/GeoIP2-City_20201006/` | **MaxMind `GeoIP2-City.mmdb`** (~127 MB — download locally) |
| Server-side game logic under `app/Games/` | Guarantee of playable slots without your licensed asset mount |

**Playable slots** need client files on disk or `GAME_ASSETS_PATH` pointing at your licensed bundle — the same class of requirement as templates that sell a separate “games API” or asset pack. The lobby lists games from the database; the browser loads the client from `public/games/{GameName}/`.

---

## Quick start (self-hosted)

**Requirements:** Docker Engine 24+ and Docker Compose v2.

```bash
git clone https://github.com/evascasino/Capivara_casino.git
cd Capivara_casino
cp .env.example .env
docker compose up --build -d
```

| Service | URL |
|---------|-----|
| Web | http://127.0.0.1:8080 |
| Sports ingestion (optional) | http://127.0.0.1:1213/health |

First boot waits for MariaDB, syncs Compose env into `.env`, and generates `APP_KEY` if missing.

**Reset database:**

```bash
docker compose down -v && docker compose up --build -d
```

**Optional — mount licensed game clients:**

```bash
# .env
GAME_ASSETS_PATH=/absolute/path/to/your/games
# or copy bundles into public/games/
```

---

## Configuration

| Variable | Purpose |
|----------|---------|
| `APP_URL` | Public URL of your deployment |
| `DB_*` | MariaDB connection (`DB_PREFIX` default `w_`) |
| `JWT_SECRET` | API tokens — long random value in production |
| `GAME_ASSETS_PATH` | Optional path to licensed slot client packs |
| `SPORTS_API_TOKEN` | External odds feed (empty = sports UI without ingestion) |

Payment, SMS, and crypto modules: **Admin → Settings** and `.env.example`.

---

## Development without Docker

```bash
composer install
cp .env.example .env
php artisan key:generate
# Import docker/01-schema.sql, then:
php artisan serve
```

---

## Repository layout

```
app/                 Laravel application (VanguardLTE namespace)
docker/              DB seed, sports Dockerfile
public/              Web root (themes, compiled JS; games/ when you add assets)
resources/views/     Blade templates (Default theme)
sports/              Node sports ingestion service
routes/              Web + API routes
```

---

## Support

- **Issues:** GitHub Issues for bugs and integration questions.
- **Platform:** [Script.Casino](https://script.casino)

Operators are responsible for compliance with applicable laws and licences in their jurisdictions.

---

## Licence

See LICENSE. Third-party game names and logos are trademarks of their respective owners.
