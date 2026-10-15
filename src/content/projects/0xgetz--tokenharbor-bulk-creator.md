---
title: "0xgetz/tokenharbor-bulk-creator"
owner: "0xgetz"
name: "tokenharbor-bulk-creator"
fullName: "0xgetz/tokenharbor-bulk-creator"
description: "Bulk, end-to-end provisioning of Token Harbor (tokenharbor.ai) accounts and API keys through temp-email.dev disposable inboxes. Playwright-driven, MIT, no CI."
sourceUrl: "https://github.com/0xgetz/tokenharbor-bulk-creator"
stars: 32
forks: 4
language: "JavaScript"
topics: ["account-creator", "ai-gateway", "api-key", "automation", "bulk", "cli", "llm", "nodejs"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-10-07"
pushedAt: "2026-10-06T00:42:22Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Token Harbor Bulk Account Creator

> Bulk-provision Token Harbor accounts with disposable inboxes and auto-generate API keys that carry random names.

English · Indonesia · 简体中文 · 日本語 · 한국어 · Español

---

`tokenharbor-bulk-creator` ties three things together in one reproducible pipeline: a
disposable mailbox provider ([temp-email.dev](https://www.temp-email.dev)), a real browser that
runs Token Harbor's signup and email verification exactly as a person would, and the
Token Harbor dashboard API-key flow. Feed it a count, and it returns a JSON table of
ready-to-use `thk_live_…` keys.

> This tool is intended for legitimate automation, internal testing and
> research on accounts you own. You are responsible for complying with
> Token Harbor's terms of service and any applicable law.

---

## Why a browser?

Token Harbor ([tokenharbor.ai](https://tokenharbor.ai)) is a Next.js application whose
signup runs against its own HTTPS API (`/api/auth/signup-precheck`) and then sets a
session cookie. Email verification is a **click-through link** mailed to the account
address, and API keys are created from the authenticated dashboard. There is no
documented public REST endpoint to register or to mint keys, so the reliable,
honest approach is to drive the real UI with [Playwright](https://playwright.dev):
the page does the work, and the results are scraped from the rendered dashboard.

## Features

- **Disposable mailboxes** – creates a unique temp-email.dev inbox per account.
- **Full onboarding** – signup → email verification → API key, end to end.
- **Random identity** – emails, passwords (12+ chars) and key labels are unpredictable.
- **Auto API keys** – named like `prod-token-7421`, prefix `thk_live_`.
- **Rate-limit aware** – detects Token Harbor's "take a breath" throttle and backs off.
- **Incremental output** – the JSON file is flushed after every account, so a
  crash never loses completed work.
- **Concurrency** – optional parallel workers.
- **Retries** – per-account attempts with fresh identities on failure.
- **Pluggable inbox** – `temp-email-dev` (browser) or any classic `custom` temp-mail REST API.
- **Structured logging** – colourised, timestamped console output.

## Architecture

```
src/
├── index.mjs             # CLI entry point (flags, browser boot, worker pool)
├── core/
│   └── provision.mjs     # end-to-end flow, retries, result record
├── tokenharbor/
│   └── client.mjs        # signup, verification, API-key creation (Playwright)
├── inbox/
│   └── index.mjs         # temp-email.dev reader + REST reader + link parsing
└── utils/
    ├── config.mjs        # flags > .env > defaults, proxy parsing
    ├── random.mjs        # random emails, passwords, key labels
    └── logger.mjs        # shared logger
```

## Requirements

- **Node.js 18+**
- A Chromium/Firefox/WebKit browser installed for Playwright
- A network that can reach `tokenharbor.ai` and `www.temp-email.dev`

## Installation

```bash
git clone https://github.com/0xgetz/tokenharbor-bulk-creator.git
cd tokenharbor-bulk-creator
npm install
npx playwright install --with-deps chromium
```

## Quick start

```bash
# One account, watch the browser work
node src/index.mjs --headful

# Five accounts, JSON in ./output
node src/index.mjs -n 5 -o output/accounts.json

# Headless batch of ten with two workers
node src/index.mjs -n 10 -c 2

# Check the environment first
node src/index.mjs --doctor
```

### CLI reference

| Flag | Default | Description |
| --- | --- | --- |
| `-n, --count` | `1` | Number of accounts to create |
| `-c, --concurrency` | `1` | Parallel workers |
| `-o, --out` | `tokenharbor-accounts-.json` | JSON result path |
| `-t, --timeout` | `180000` | Max ms to wait for the verification email |
| `--turnstile-timeout` | `150000` | Max ms to wait for Cloudflare (no-op; kept for parity) |
| `--retries` | `3` | Attempts per account |
| `--inbox-provider` | `temp-email-dev` | `temp-email-dev` \| `custom` |
| `--mail-base-url` | – | Base URL for the `custom` inbox provider |
| `--mailbox-domain` | auto | Pin a mail domain for the `custom` provider |
| `--password` | random | Fixed password (>= 12 characters) for all accounts |
| `--key-name` | random | Fixed API-key label |
| `--proxy` | – | Proxy URL for the browser |
| `--headful` | off | Show the browser |
| `--keep-browser` | off | Leave the browser open at the end (debugging) |
| `-q, --quiet` | off | Print only the final summary |
| `--doctor` | – | Check the environment and exit |
| `-v, --version` | – | Print the version |

Environment variables mirror every flag (`TH_COUNT`, `TH_PROXY`, …). See
`.env.example`.

## Inbox providers

| Provider | Flag value | How it works |
| --- | --- | --- |
| temp-email.dev *(default)* | `temp-email-dev` | Drives the site's UI in a browser; the site generates the address, which the script reads back. |
| Custom REST | `custom` | Any classic temp-mail JSON API (`GET /domains`, `POST /accounts`, `GET /messages`), e.g. mail.tm / mail.gw. Set `--mail-base-url`. |

With `temp-email-dev` a fresh browser context is used per account, so each run gets
its own inbox even though the site persists the address in `localStorage`.

## Rate limits

Token Harbor applies a soft anti-abuse throttle. When signup answers with
*"You're doing that a bit fast — take a breath and try again."* the run backs off
for 45 seconds and retries once; if it persists, the account is marked failed with
kind `rate-limit` and is **not** retried further. For large batches keep
`--concurrency` low (1–2) and expect a few seconds between accounts.

## Output

`accounts.json`:

```json
{
  "generated_at": "2026-01-01T12:00:00+00:00",
  "total": 1,
  "succeeded": 1,
  "failed": 0,
  "accounts": [
    {
      "ok": true,
      "email": "swiftfox482913@swiftemail.dev",
      "password": "…",
      "api_key": "thk_live_…",
      "key_name": "prod-token-7421",
      "api_base": "https://api.tokenharbor.ai/v1",
      "email_provider": "temp-email.dev",
      "elapsed_ms": 41230,
      "created_at": "2026-01-01T12:00:00+00:00"
    }
  ]
}
```

The file is rewritten after every account, so an interrupted batch still contains
everything finished up to that point.

## Using a generated key

Token Harbor is OpenAI-compatible with base URL `https://api.tokenharbor.ai/v1`
(with a fallback of `https://tokenharbor.ai/v1`; verify the exact host in your
dashboard's **Connect** page):

```bash
curl https://api.tokenharbor.ai/v1/chat/completions \
  -H "Authorization: Bearer thk_live_..." \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hello"}]}'
```

## Programmatic use

```js
import { chromium } from "playwright";
import { provisionOne } from "./src/core/provision.mjs";

const browser = await chromium.launch({ headless: true });
const platform = await browser.newContext();
const inbox = await browser.newContext();

const result = await provisionOne(platform, inbox, { timeout: 180000, retries: 2 });
console.log(result.email, result.api_key);
await browser.close();
```

## Development

```bash
node tests/smoke.mjs
```

## License

Released under the MIT License.
