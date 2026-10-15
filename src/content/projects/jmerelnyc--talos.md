---
title: "jmerelnyc/Talos"
owner: "jmerelnyc"
name: "Talos"
fullName: "jmerelnyc/Talos"
description: "GPU worker client for the Talos network. Pairs with your Talos account, serves open-model inference jobs over a WebSocket, and reports uptime for payouts."
sourceUrl: "https://github.com/jmerelnyc/Talos"
stars: 686
forks: 19
language: "Python"
topics: ["ai", "distributed-computing", "gpu", "llm", "ollama", "python", "websocket", "worker"]
license: "MIT"
homepage: "https://usetalos.xyz"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-07-08T09:18:17Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Talos worker

Share your GPU with the Talos network and earn. This is the downloadable
client (intended to live in its own public GitHub repo, `talos-worker`). It
pairs with your Talos account using a code, then serves open-model inference
jobs from the network via your local [Ollama](https://ollama.com), reporting
uptime and earning a share of real usage revenue.

The Talos web app never imports this repo. The two only talk over the network:
a device code to pair, then jobs and heartbeats over a WebSocket.

## Requirements

- Python 3.9+
- [Ollama](https://ollama.com) running locally with at least one model pulled,
  e.g. `ollama pull llama3.1:8b`
- NVIDIA GPU recommended (detected automatically; CPU also works)

## Install

```bash
pip install -e .
```

## Pair

Get a code from your dashboard (Pair a device), then:

```bash
talos-worker pair            # prompts for the code
# or non-interactively:
talos-worker pair --code TALOS-XXXX-XXXX --server https://api.usetalos.xyz
```

## Run

```bash
talos-worker run --allocation 0.5
```

- Opens a local dashboard at http://127.0.0.1:8674 with live status and a power
  (allocation) slider.
- `--allocation 0..1` sets how much of the machine you offer. It maps to
  concurrency/duty-cycle, not a literal power percentage.
- Uptime accrues while connected; earnings are credited per served job and
  visible on your Talos dashboard.

## Commands

| Command | Description |
| --- | --- |
| `talos-worker pair` | Pair this machine with a code |
| `talos-worker run` | Connect and serve inference jobs |
| `talos-worker status` | Show config, GPU and available models and jobs |

## Using talos-auto in your editor

This repo is for two different audiences:

- **Sharing a GPU?** That's `talos-worker`, above: pair it, run it, earn.
- **Just want talos-auto in your editor?** You do not need to run anything;
  point your tool at the hosted gateway. Two ways to do that:

  - Automatic: install `sdk/` and run `talos setup ` — it
    writes the real config file for you and backs up the original.
  - Manual: each tool has its own folder with a guide, a config snippet, a
    `verify.sh` quickstart script and a bundled SDK example:
    `cursor/`, `vscode/` (Continue / Cline),
    `claude-code/`, `jetbrains/`,
    `zed/`, `aider/`.

See `docs/` for the shared overview, or `examples/`
for more example stacks (Go, Node.js, Vercel AI SDK, LiteLLM).

## Contributing

See CONTRIBUTING.md.
