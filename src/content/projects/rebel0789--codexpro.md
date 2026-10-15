---
title: "rebel0789/codexpro"
owner: "rebel0789"
name: "codexpro"
fullName: "rebel0789/codexpro"
description: "Use ChatGPT Developer Mode as a local coding agent for your repo through MCP."
sourceUrl: "https://github.com/rebel0789/codexpro"
stars: 2056
forks: 214
language: "JavaScript"
topics: ["apps-sdk", "chatgpt", "cloudflare-tunnel", "codex", "local-development", "mcp", "ngrok"]
license: "MIT"
homepage: "https://rebel0789.github.io/codexpro/"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-20T15:05:30Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

CodexPro


  Give ChatGPT local coding tools for repos you explicitly allow.


  
  
  
  


## What it is

CodexPro is a local MCP server. It connects **your ChatGPT session** to **your machine** and **repos you allow**.

ChatGPT can read, search, edit, review, verify, import attachments, and write handoff plans. It stays inside those roots.

It is not a hosted SaaS product, model proxy, quota bypass, account pool, or remote shell service.

## Install

Needs:

- Node.js 20+
- A ChatGPT account that can create custom MCP plugins
- An HTTPS URL to your machine for ChatGPT web (tunnel or Tailscale Funnel)

```bash
npm install -g codexpro
cd /path/to/your/repo
codexpro setup
```

## Connect in ChatGPT

1. `Settings -> Security and login` → turn **Developer mode** on (keep CSP enforcement on).
2. `Settings -> Plugins` → Plugins tab → **+** beside Search plugins.
3. Create a plugin named `CodexPro`.
4. Connection: **Server URL** → paste the URL CodexPro copied.
5. Authentication: **No Authentication / None** (change this if the form defaults to OAuth).

CodexPro auth is the token already in that URL. Do not share the URL.

| Open Plugins and click `+` | Complete the New Plugin form |
| --- | --- |
| *图片：Open Plugins and click the plus button* | *图片：Complete the New Plugin form* |

Daily use from the same repo:

```bash
codexpro start
```

If plugin creation fails, run `codexpro connection-test` and check whether ChatGPT requests reach the local server.

## What ChatGPT can do

With workspace write mode (the normal agent setup):

- read, search, and inspect the repo with bounded code intelligence
- edit with `write`, `edit`, or guarded `apply_patch`
- import ChatGPT attachments with `import_file`
- run allowlisted checks with `bash`
- review diffs and likely impact with `show_changes`
- write plans under `.ai-bridge`
- export a context bundle for chats that cannot call tools

### Built-in repository intelligence

CodexPro does more than raw file search:

- `inspect_workspace` maps languages, project types, entrypoints, areas, symbols, and internal relationships.
- `search` supports targeted `symbol`, `references`, and `impact` intents as well as ordinary text and regex search.
- `show_changes` identifies affected areas, likely dependents, related tests, risk signals, and relevant verification commands.
- TypeScript/JavaScript, Python, Go, Rust, Swift, Java, C#, C, and C++ declarations are recognized. Other languages retain safe inventory and lexical search.

Analysis is local, bounded, and cached by a workspace fingerprint. It needs no model API key, language-server daemon, embedding service, or vector database. Coverage and inference strength are reported instead of presented as certainty.

### Product focus

CodexPro is optimized for a narrow loop: connect ChatGPT to explicitly allowed local repositories, make a reviewable change, verify it, and preserve a handoff record. The project prioritizes:

- explicit workspace boundaries and separate controls for reads, writes, commands, sessions, and handoffs
- useful code navigation without sending a repository to a separate indexing service
- cross-platform installation and release checks on supported Node.js versions
- compact, bounded tool results that remain usable in long ChatGPT sessions

See the roadmap for the next reliability, code-navigation, and workflow improvements.

## Multiple projects

One CodexPro process can allow more than one repo:

```bash
codexpro settings set --project ~/code/web --project ~/code/api
codexpro settings show
codexpro start
```

Ask ChatGPT to `open_workspace` on an allowed project. `open_current_workspace` returns to the launch repo.

For two ChatGPT accounts or hard isolation, run two CodexPro processes on different ports and Server URLs.

## Commands

```bash
codexpro setup
codexpro start
codexpro start --root /path/to/repo
codexpro doctor
codexpro connection-test
codexpro settings
codexpro inspect
codexpro review
```

Useful modes:

```bash
codexpro start --no-bash
codexpro start --tool-mode minimal
codexpro start --tool-mode full
codexpro start --mode handoff
codexpro start --mode pro
codexpro start --headless
```

Opt-in tool cards:

```bash
CODEXPRO_TOOL_CARDS=1 codexpro start
```

## Public HTTPS options

ChatGPT web needs HTTPS:

```bash
codexpro start --tunnel cloudflare          # quick demo URL (changes)
codexpro ngrok --hostname your.ngrok-free.dev
codexpro stable --hostname codexpro.example.com --tunnel-name codexpro
codexpro tailscale --hostname your-device.your-tailnet.ts.net
codexpro start --tunnel none                # local only
```

Keep a stable token for stable hostnames:

```bash
mkdir -p ~/.codexpro
openssl rand -hex 32 > ~/.codexpro/http-token
chmod 600 ~/.codexpro/http-token
```

Prefer `Authorization: Bearer ` when the client supports headers. The `?codexpro_token=` query form is a personal compatibility fallback.

## Safety defaults

- Public tunnels require a CodexPro HTTP token (min 24 bytes)
- Writes stay hidden unless write mode is `workspace`
- Safe bash is the default
- Blocked paths cover `.env`, keys, `.git`, build caches, and similar
- Attachment import only accepts ChatGPT Apps SDK file objects from approved HTTPS hosts

Read SECURITY.md before exposing a tunnel.

## Update

```bash
npm install -g codexpro@latest
codexpro --version
```

Restart `codexpro start` after updating. Saved profiles under `~/.codexpro` stay in place.

## Development

```bash
npm install
npm run build
npm run smoke
npm run stress
npm run package:smoke
npm run release:check
```

Publish only from the CodexPro root:

```bash
cd /path/to/codexpro
npm run release:publish
```

## Docs

- [Website](https://rebel0789.github.io/codexpro/)
- FAQ
- Security
- Roadmap
- Stable URL guide
- Changelog
- Contributors
