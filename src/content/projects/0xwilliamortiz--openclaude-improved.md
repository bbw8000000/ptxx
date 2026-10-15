---
title: "0xwilliamortiz/openclaude-improved"
owner: "0xwilliamortiz"
name: "openclaude-improved"
fullName: "0xwilliamortiz/openclaude-improved"
description: "runs anywhere. uses anything"
sourceUrl: "https://github.com/0xwilliamortiz/openclaude-improved"
stars: 572
forks: 84
language: "TypeScript"
topics: ["agentic-ai", "ai", "ai-agent", "ai-coding", "ai-coding-agent", "ai-coding-agents", "ai-coding-assistant", "anthropic"]
license: "NOASSERTION"
defaultBranch: "main"
snapshotDate: "2026-07-28"
pushedAt: "2026-07-26T22:22:56Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

### OpenClaude — Improved Version

**runs anywhere. uses anything.**

An open-source coding agent for the CLI. Cloud APIs, gateways, and local models —
same tools, same agents, same workflow.


*图片：node*
*图片：bun*
*图片：platform*
*图片：license*

**Install** · **Quick start** · **Providers** · **Sessions** · **Config** · **Docs**


---

## Install

Built from source. Windows examples below; macOS and Linux are identical minus the
shell syntax.

**Prerequisites** — Node `>=22` (enforced by `engines.node`) and Bun.

```powershell
node --version
bun --version
```

No Bun? `winget install Oven-sh.Bun` or [bun.sh](https://bun.sh).

**Build and link**

```powershell
cd openclaude-main
bun install
bun run build
npm install -g .
openclaude
```

That's it — `openclaude` is now on your PATH.

---

## Quick start

Run `/provider` inside OpenClaude for guided setup with saved profiles — this is the
recommended path. Credentials land in `.openclaude-profile.json`.

Prefer env vars? Pick one:


OpenAI

```powershell
$env:CLAUDE_CODE_USE_OPENAI="1"
$env:OPENAI_API_KEY="sk-..."
$env:OPENAI_MODEL="gpt-4o"
openclaude
```


Ollama — local, no key

```powershell
$env:CLAUDE_CODE_USE_OPENAI="1"
$env:OPENAI_BASE_URL="http://localhost:11434/v1"
$env:OPENAI_MODEL="qwen2.5-coder:7b"
openclaude
```

OpenClaude talks to Ollama's native chat API and requests a 32768-token window per
request, so same-session history isn't silently trimmed by the OpenAI-compat shim.
Override with `OPENCLAUDE_OLLAMA_NUM_CTX` or `OLLAMA_CONTEXT_LENGTH`.


GitHub Models

Run `/onboard-github` inside OpenClaude. Interactive, credentials saved.


macOS / Linux syntax

```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=sk-...
export OPENAI_MODEL=gpt-4o
openclaude
```


> Project `.env` files are **not** auto-loaded. Use `--provider-env-file .env` for
> provider vars, or export runtime knobs from your shell.

---

## Providers

| Provider | Setup | Key detail |
|---|---|---|
| **OpenAI-compatible** | `/provider` · env | Any `/v1` server — OpenRouter, DeepSeek, Groq, Mistral, LM Studio |
| **Ollama** | `/provider` · env | Local, no API key |
| **Gemini** | `/provider` · env | API key only |
| **GitHub Models** | `/onboard-github` | Saved credentials |
| **Codex / Codex OAuth** | `/provider` | Browser sign-in or existing Codex CLI auth |
| **Gitlawb Opengateway** | default · `/provider` | Startup default on fresh installs; [get a key](https://gitlawb.com/opengateway/keys) |
| **Bedrock · Vertex · Foundry** | env | Anthropic-family routes |


Full provider list (12 more)

| Provider | Endpoint / key | Default model |
|---|---|---|
| Z.AI GLM Coding Plan | `api.z.ai/api/coding/paas/v4` · `OPENAI_API_KEY` | `glm-5.2` |
| AI/ML API | `api.aimlapi.com/v1` · `AIMLAPI_API_KEY` | `gpt-4o` |
| Hicap | `api-key` auth, Responses mode for `gpt-*` | — |
| Fireworks AI | `FIREWORKS_API_KEY` | 276 curated models |
| LongCat | `api.longcat.chat/openai/v1` · `LONGCAT_API_KEY` | `LongCat-2.0` |
| ClinePass | `api.cline.bot/api/v1` · `CLINE_API_KEY` | 5h / weekly / monthly caps |
| OpenCode Zen | `opencode.ai/zen/v1` · `OPENCODE_API_KEY` | 48 models, PAYG |
| OpenCode Go | `opencode.ai/zen/go/v1` · `OPENCODE_API_KEY` | 13 models, $10/mo |
| Xiaomi MiMo | `mimo.mi.com` · `MIMO_API_KEY` | `mimo-v2.5-pro` |
| NEAR AI | `cloud-api.near.ai/v1` · `NEARAI_API_KEY` | Claude / GPT / Gemini + TEE |
| Cloudflare Workers AI | `api.cloudflare.com/.../ai/v1` · `CLOUDFLARE_API_TOKEN` | — |
| Atomic Chat | `/provider` · `bun run dev:atomic-chat` | Auto-detects loaded models |

**Gotchas worth knowing**

- Anthropic-only features don't exist on every backend. Tool quality tracks model quality — small local models struggle with long multi-step tool loops.
- Some providers cap output below CLI defaults; OpenClaude adapts where it can.
- Opengateway uses one base URL — switch models with `/model`, don't pin the URL to `/v1/xiaomi-mimo`.
- GLM reasoning: `glm-5.2?reasoning=high`, `?reasoning=xhigh`, or `?thinking=disabled`.
- MiMo uses `api-key` header auth and has no `/usage` reporting yet.
- GitHub Copilot serializes sub-agents by default to save Premium Requests — see agent routing.


---

## What you get

| | |
|---|---|
| **Tools** | Bash, read/write/edit, grep, glob, agents, tasks, MCP, slash commands |
| **Streaming** | Live tokens and tool progress |
| **Tool loops** | Multi-step: model call → execution → follow-up |
| **Vision** | URL and base64 images where the provider supports it |
| **Repo map** | PageRank-ranked structural map, auto-injected behind the `REPO_MAP` flag. Inspect with `/repomap` (docs) |
| **Agent routing** | Per-agent provider/model overrides, `maxSteps` caps, routable built-ins (`Explore`, `Plan`, `verification`) (docs) |
| **Web** | `WebSearch` via DuckDuckGo free by default; drop in `FIRECRAWL_API_KEY` for JS-rendered pages |
| **gRPC** | Headless bidirectional-streaming server for CI and custom UIs (`npm run dev:grpc`) (docs) |
| **VS Code** | Bundled extension: launch integration, Control Center, in-editor chat, Foundry/Azure config |

---

## Sessions

```bash
openclaude --continue                             # most recent, this directory
openclaude --resume 
openclaude --resume  --fork-session   # branch history, new ID
```

Forking branches conversation history only — no worktree, no filesystem isolation.


Background sessions

```bash
openclaude --bg "fix failing tests"
openclaude --bg --name auth-refactor "refactor auth middleware"

openclaude ps
openclaude logs auth-refactor -f
openclaude kill auth-refactor
```

Plain local child processes — no daemon, no network service. Metadata and logs live
in `~/.openclaude/bg-sessions/`. Names are reusable once a session is terminal; use
the ID to reach older logs sharing a name. `attach` currently just points you at
`logs  -f`.


---

## Config

OpenClaude owns `~/.openclaude/` and `~/.openclaude.json`. It does **not** read
`~/.claude`, project `.claude/` directories, or `CLAUDE_CONFIG_DIR`. Fresh installs
start empty and don't need Claude Code present.

Migrating from a `.claude`-era setup? Copy only files *you* wrote — settings,
commands, agents, skills, scheduled tasks — into the matching `.openclaude` path.
Don't blanket-copy, and don't move credentials; re-run provider setup instead.

`OPENCLAUDE_CONFIG_DIR` relocates everything.

---

## Buddy

`/buddy` hatches a truecolor pixel-art companion that stands beside your prompt and
fires its signature move on every Enter.

```
/buddy set robinhood    green archer — arrow shot
/buddy set kaio         full-width energy wave
/buddy set strawhat     stretchy snap-back punch
/buddy set merlin       sparkle stream
/buddy set kage         spinning shuriken
/buddy set ember        dragon fire, real heat gradient
/buddy set corsair      cannonball with smoke trail
```

Respects `prefersReducedMotion`, degrades to line art on low-color terminals,
`/buddy mute` silences it. Needs ~100 columns for the full sprite.

---

## Development

```bash
bun run dev        # build and launch from source
bun test           # full suite
```

Before opening a PR:

```bash
bun run build
bun run smoke
bun test path/to/changed.test.ts
bun run test:coverage          # if you touched shared runtime or provider logic
```


Other commands and layout

```bash
bun run test:coverage:ui                        # rebuild HTML report only
bun run test:provider
bun run test:provider-recommendation
bun run doctor:runtime
bun run verify:privacy
bun run security:pr-scan -- --base origin/main
```

```
src/                                   core CLI and runtime
scripts/                               build, verify, maintenance
docs/                                  setup and contributor docs
bin/                                   launcher entrypoints
vscode-extension/openclaude-vscode/    VS Code extension
```

Coverage lands at `coverage/lcov.info` plus a browsable report at `coverage/index.html`.

If startup reports `ripgrep not found`, install ripgrep system-wide and confirm
`rg --version` resolves in the same shell.


---

## Docs

**Getting started** — Non-technical · Windows · macOS / Linux · Android

**Going deeper** — Advanced setup · Smart auto-routing · Agent routing · Repo map · gRPC server

---

## Contributing

Open an issue first for anything large, so scope is settled before code. Bugs and
actionable feature work go to
Issues; questions
and ideas to
Discussions.
Security reports: SECURITY.md.

---


MIT for contributor modifications; derived Claude Code code remains Anthropic's — see LICENSE.

An independent community project. Not affiliated with, endorsed by, or sponsored by Anthropic.
"Claude" and "Claude Code" are trademarks of Anthropic PBC.
