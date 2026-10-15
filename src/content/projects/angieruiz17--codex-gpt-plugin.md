---
title: "angieruiz17/codex-gpt-plugin"
owner: "angieruiz17"
name: "codex-gpt-plugin"
fullName: "angieruiz17/codex-gpt-plugin"
description: "codex gpt plugin that gives agent a direct line to logged-in chatgpt pro session"
sourceUrl: "https://github.com/angieruiz17/codex-gpt-plugin"
stars: 142
forks: 1048
language: "JavaScript"
topics: ["agent-assistant", "chatgpt-session", "codex", "codex-gpt-plugin", "codex-plugin", "gpt", "gpt-plugin", "plugin"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-14T07:55:03Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Codex Gpt Plugin

**A Codex plugin that gives your agent a direct line to a logged-in ChatGPT Pro session.**

Codex is great at execution. For the hard parts — architecture, system design,
research synthesis, tradeoff calls, gnarly debugging strategy — you sometimes
want a second, stronger brain. Codex Gpt Plugin lets a Codex agent phone that
brain: it drives a real, logged-in **ChatGPT Pro** browser session, attaches
your repo as context, sends a message, reads the answer, and writes a receipt —
**no API key, no password handling, no scraped cookies.**

It's a phone line, not a scraper.

## Demo

Codex Gpt Plugin call:

*图片：Codex Gpt Plugin demo*

Repo monofile attachment:

*图片：Repo monofile attach demo*

## Why

The strongest ChatGPT Pro reasoning isn't exposed on the API — it lives in the
website. So this bridges to the website, deliberately and safely. The human
stays logged in; the automation is text-only and deterministic; and every call
is recorded to disk. You get Pro-level collaboration inside your Codex loop
without handing an agent your credentials.

Use it for high-leverage work — architecture, specs, feature design, research
synthesis, tradeoff review, cross-repo planning, and hard debugging strategy.
Don't spend the line on trivial syntax checks.

## Major features

- **Repo-scoped rooms.** ChatGPT conversations are bound to your git repo as
  named rooms (`main`, `debug`, `critic`, `scratch`). Linked worktrees share a
  repo's rooms; separate repos stay isolated. `main` means *this* repo's main —
  never some other tab.
- **Repo-as-context, in one file.** Generates a repomix-style `repo-context.md`
  monofile (source tree, LOC, file bodies, line-range source map, hashes), blocks
  secret-like paths/content before writing it, and uploads it only after explicit
  confirmation.
- **One persistent, logged-in profile.** A dedicated Chrome profile keeps you
  logged in across calls and exposes CDP on `127.0.0.1:9222` for deterministic
  control.
- **Multi-agent safe.** A global browser-profile lock serializes every call, so
  concurrent Codex agents never collide in the same ChatGPT window.
- **Receipts + verbatim thread-echo.** Every call records the exact prompt and
  response (with SHA-256 hashes), selected model/intelligence, lock timing,
  conversation URL, a screenshot, and network/console logs.
- **Visible history export.** Pull a bound room's visible ChatGPT history to
  disk and reread it later without touching the browser — handy for picking up a
  human-started thread.

## Install

As a Codex plugin, from a local checkout:

```bash
npm install
npm run plugin:sync
codex --enable plugins plugin marketplace add "$PWD"
codex --enable plugins plugin add codex-chatgpt-pro-plugin@codex-chatgpt-pro-plugin
```

For source development, run the CLI directly:

```bash
./bin/chatgpt-pro init
./bin/chatgpt-pro doctor --warm    # open the dedicated ChatGPT browser
# complete the visible login if prompted
./bin/chatgpt-pro doctor --live    # verify login, composer, and model state
```

If `doctor --live` reports `auth.login_required` (exit code `20`), finish login
in the visible window and rerun `chatgpt-pro doctor --live`.

## Quick start

```bash
# First call into this repo's main room
chatgpt-pro call --alias=main --confirm-repo-context-upload --prompt="Review this repo's architecture and name the biggest risk."

# Inspect repo room / lock / cache state without touching the browser
chatgpt-pro status --alias=main

# Open a clean, independent critic room and review a file
chatgpt-pro rooms new --alias=critic
chatgpt-pro call --alias=critic --prompt-file=review.md

# Bind a ChatGPT thread you started by hand, then pull its history
chatgpt-pro rooms rebind --alias=spec --conversation-url=https://chatgpt.com/c/...
chatgpt-pro history export --alias=spec --last=20

# Re-point or fix a room's target after drift
chatgpt-pro rooms repair --alias=main
```

Room lifecycle commands (`rooms new`, `rooms rebind`, `rooms repair`, and
`rooms list/show`) are repo-scoped, so the same alias can exist safely in
different repositories.

By default, `call` selects the live **Pro** intelligence level and detects when a
generated `repo-context.md` would help. Generated repo context is secret-scanned
and requires `--confirm-repo-context-upload` or
`CHATGPT_CONFIRM_REPO_CONTEXT_UPLOAD=1` before it can be uploaded or inlined.
Use `--repo-context=off` / `--no-repo-context` or pass explicit scrubbed
`--upload-file` artifacts for narrower calls.

## How it works

```text
Codex agent
   │  chatgpt-pro call --alias=main --prompt="…"
   ▼
chatgpt-pro CLI ──acquire──►  global browser lock        (one agent at a time)
   │
   ▼
dedicated Chrome profile ──CDP──►  chatgpt.com           (you are logged in)
   │  • attach repo-context.md            │  Pro thinks + answers
   │  • type prompt (Input.insertText)    ▼
   └────────────────────────►  read the newest assistant turn (anchored)
                                          │
                                          ▼
                  .devspace/runs//   receipt.json · transcript.md · final.png
```

The canonical message path is text-only: DOM focus for the composer, CDP
`Input.insertText` for the text, and a DOM button click to send. No OS-level
mouse/keyboard automation, no voice or dictation.

## Safety posture

- **You own the login.** Automation never types a password, OTP, or solves a
  CAPTCHA, and never reads cookies or session storage. If login is needed, it
  stops and asks you.
- **Text-only, no OS automation.** No synthetic OS mouse/keyboard, no voice. A
  `test:non-interference` gate enforces the boundary.
- **One profile, one lock.** A global browser-profile lock means concurrent
  agents serialize cleanly instead of fighting over the window.
- **Fails closed.** Ambiguous provenance produces a stable error code
  (`auth.login_required`, `lock.busy`, `response.possibly_stale`, …) — never a
  guessed answer.
- **On the record.** The verbatim prompt and response, hashes, a screenshot, and
  network/console logs land in `.devspace/runs//` for every call.

## Thread echo

Interactive Codex use keeps the exchange in the Codex session log. `call` prints
this block by default — paste it verbatim, don't summarize:

```md
## Message Sent To ChatGPT Pro

...

## Message Received From ChatGPT Pro

...
```

## Command surface

The installed plugin exposes the `chatgpt-pro-line` skill and the `chatgpt-pro`
CLI. Inside this source repo the same behavior is available via `npm run`:

| Command | What it does |
| --- | --- |
| `npm run chrome` / `chrome:headless` / `chrome:debug` | Launch the dedicated ChatGPT browser (visible / headless / verbose) |
| `npm run cdp:smoke` | Verify `/json/version` and `/json/list` |
| `npm run levels:list` / `levels:set -- --level=Pro` | Read or select the live intelligence level |
| `npm run choices:set -- --model=5.4` | Select the live model |
| `npm run rooms:list` | List repo-owned rooms (no CDP) |
| `npm run context:bundle -- --name=focused` | Build the repo-context monofile |
| `npm run chatgpt:call -- --alias=main --message-file=prompt.md` | Source-repo alias for `chatgpt-pro call` |
| `npm run history:export -- --alias=spec --last=20` | Export visible history |
| `npm run plugin:sync` | Refresh the materialized install bundle |

Common runtime switches: `BROWSER_POSTURE=headed|headless`,
`CHATGPT_DEFAULT_LEVEL` (default `Pro`), `CHATGPT_RESPONSE_TIMEOUT_MS`
(default `240000`), `CHATGPT_REPO_CONTEXT_MODE=auto|upload|inline|off`,
`CHATGPT_CONFIRM_REPO_CONTEXT_UPLOAD=1`, `CHATGPT_LOCK_TIMEOUT_MS` (default
`600000`), `CHATGPT_PRO_REDIS_URL` (optional Redis for shared model-state cache
and cross-host browser lock coordination), `BROWSER_OBSERVER=1` (print a run-inspector URL). See the contract
docs for the full list.

### Redis (optional)

When `CHATGPT_PRO_REDIS_URL` is set (for example `redis://127.0.0.1:6379`):

- **Model-state cache** — `doctor --live` writes model/intelligence choices to the local file and Redis; `status` reads Redis when the local cache is missing or stale.
- **Browser lock coordination** — acquires a Redis mutex before the existing filesystem profile lock, so two hosts sharing one ChatGPT browser profile do not collide.

If Redis is unset or unreachable, behaviour is unchanged from the filesystem-only path.

```bash
cp .env.example .env   # set CHATGPT_PRO_REDIS_URL when you want Redis enabled
docker compose up -d redis
export CHATGPT_PRO_REDIS_URL=redis://127.0.0.1:6379
```

Or run Redis standalone:

```bash
docker run -d --name chatgpt-pro-redis -p 6379:6379 redis:7-alpine
export CHATGPT_PRO_REDIS_URL=redis://127.0.0.1:6379
```

## Tests

```bash
npm run test:v1     # deterministic package gate (no browser, no login)
npm run test:live   # live browser proof suite (needs a logged-in ChatGPT)
```

- `npm test`: runs deterministic tests only — it does not require Chrome or a
  logged-in ChatGPT website session.
- `npm run test:v1` adds the v1 readiness gate on top of the deterministic
  suite.
- `npm run test:plugin-install` proves the materialized plugin installs into a
  fresh Codex home from the local marketplace entry.
- `npm run test:live` drives the real website: doctor, history export, room
  rebind/repair, and the repo/thread isolation matrix.
- Live proof scripts are `live:doctor`, `live:history-export`,
  `live:rooms-rebind`, `live:rooms-repair`, and `live:repo-thread-matrix`.

## Reference

- docs/chatgpt-call-contract.md — the full call
  contract: rooms, context tiers, concurrency, receipts, and the complete
  failure-code list.
- docs/subagent-browser-contract.md — the
  lower-level browser, login-boundary, and CDP details.

## Repo layout

- `bin/chatgpt-pro`, `src/`, `scripts/` — the CLI, runtime, and self-tests.
- `skills/`, `.codex-plugin/`, `.agents/plugins/marketplace.json` — the Codex
  plugin surface.
- `plugins/codex-chatgpt-pro-plugin/` — the materialized install bundle, kept in
  sync from the root by `npm run plugin:sync` (don't edit it by hand).

## License

MIT © Haptica.
