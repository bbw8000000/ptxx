---
title: "realfishsam/agent-notch"
owner: "realfishsam"
name: "agent-notch"
fullName: "realfishsam/agent-notch"
description: "The open-source alternative to vibe-island"
sourceUrl: "https://github.com/realfishsam/agent-notch"
stars: 226
forks: 28
language: "Swift"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-07-22"
pushedAt: "2026-07-21T14:42:45Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Agent Notch

Your AI agents, living next to the MacBook notch.

While **Claude Code** or **Codex** is working, its mascot walks beside the notch — the Claude Code banner critter for Claude, the official Codex pet for Codex. Each agent has its own slot: the moment one finishes, its mascot becomes a green blob (even while the other keeps working). The green is a "finished since you last looked" notification — focusing your terminal clears it. Click to open a panel of your sessions, grouped by prompt, with every subagent tucked under a dropdown.


## The panel

One row per session, titled by the tool, led by **your** latest prompt — not the agents' chatter. Subagents (Codex's philosopher swarm, Claude's Task agents) fold under a `▸ N subagents` dropdown. Running rows show their mascot walking in place; finished rows get a green pixel checkmark. The tag on the right is the actual model that session runs.


## How it works

No hooks, no APIs, no accounts. Liveness detection follows open-vibe-island's model — *a session is a running agent process in a terminal* — polled every 3 s:

- `ps` finds `claude`/`codex` processes attached to a TTY (headless/background sessions are ignored)
- `lsof` maps each process to the transcript it holds open (Codex), or to its working directory (Claude Code, which doesn't keep the transcript fd open)
- transcripts provide the metadata: prompts, snippets, models, subagents
  - Claude Code: `~/.claude/projects/*/*.jsonl` (+ `/subagents/agent-*.jsonl`)
  - Codex: `~/.codex/sessions/**/*.jsonl`, grouped by `parent_thread_id`

Within a live session, *busy vs idle* is a hybrid: process alive + transcript written in the last 30 s = busy (mascot walks); alive but quiet = idle (nothing in the notch, dimmed row in the panel); process gone for 2 polls = done (green blob). Sessions idle over 6 h drop off the panel. Activating a terminal app (Ghostty, Terminal, iTerm2, kitty, Warp, Alacritty) acknowledges finished agents and clears their green indicator.

### Known limitation: the ~30 s afterglow

Busy/idle is inferred from transcript write times, and transcript writes are bursty — so the mascot keeps walking for up to ~33 s (30 s window + 3 s poll) after a turn actually ends, and conversely a turn's quiet stretches are smoothed over. No process-level proxy (network, CPU, child processes) can fully fix this: only the agent knows when its turn ends. The precise fix would be agent hooks (`UserPromptSubmit`/`Stop` writing a state file, as open-vibe-island does), deliberately skipped here to keep the zero-config, no-hooks design. If the afterglow bothers you, that's the upgrade path.

The collapsed window is transparent and fully click-through except the tiny indicator zone, so it never blocks menu items or apps underneath. In fullscreen spaces the bar spans the whole top edge.

## Codex pet

The Codex animation uses the official Codex Pets spritesheets (in `pets/`). Switch pets with:

```sh
echo dewey > ~/.config/agent-notch/pet
```

Options: `codex`, `dewey`, `fireball`, `rocky`, `seedy`, `stacky`, `bsod`, `null-signal`. Takes effect within a couple of seconds, no restart needed. (Spritesheets © OpenAI, from their public pets CDN.)

## Build & run

```sh
swiftc -O main.swift -o AgentNotch
./AgentNotch &
```

- **Click** the indicator → open the panel. Click anywhere → close.
- To start at login: System Settings → General → Login Items → add `AgentNotch`.
- Requires macOS 12+ (built and tested on a notched MacBook; on notchless displays it centers on a virtual notch).
