---
title: "cellebrite-labs/ghidra-rpc"
owner: "cellebrite-labs"
name: "ghidra-rpc"
fullName: "cellebrite-labs/ghidra-rpc"
description: "A Ghidra agentic reverse engineering skill."
sourceUrl: "https://github.com/cellebrite-labs/ghidra-rpc"
stars: 351
forks: 31
language: "Python"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-17T06:17:17Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# ghidra-rpc

An agentic skill that gives an LLM access to [Ghidra](https://ghidra-sre.org/) so
it can perform reverse engineering tasks autonomously: decompile functions, trace
call graphs, rename and annotate symbols, define data structures, diff binary
versions, and more — all without human intervention.

`ghidra-rpc` runs Ghidra as a persistent background daemon and exposes its
capabilities through a CLI that returns structured JSON. Any AI coding assistant
that can run shell commands (pi, Claude Code, Cursor, etc.) can drive a full RE
session by issuing commands and reasoning over the results.

Developed at **Cellebrite Labs**.

## What the AI Can Do

| Area | Capabilities |
|------|-------------|
| **Understand code** | Decompile functions to pseudo-C, disassemble, inspect CFG and P-code |
| **Navigate** | Trace callers/callees, search strings and byte patterns, find cross-references |
| **Annotate** | Rename functions and symbols, add comments, set bookmarks and tags |
| **Type recovery** | Define structs/unions/enums, retype variables, set function signatures |
| **Patch** | Assemble instructions (SLEIGH), write raw bytes, override flow types |
| **Diff binaries** | Version-track two builds, diff changed functions, match functions via BSim |

## Quick Start

```bash
# Prerequisites: Ghidra 11+, Python 3.11+, Java 17+, uv
export GHIDRA_INSTALL_DIR=/opt/ghidra_12.0
uv tool install /path/to/ghidra-rpc
```

Once installed, tell your AI assistant to start a session:

> *"Load /usr/bin/ls into Ghidra and find any unsafe string operations."*

For manual use or debugging:

```bash
# Start the daemon (use --detach for background)
ghidra-rpc start --project /tmp/work.gpr --headless

export GHIDRA_RPC_PROJECT=/tmp/work.gpr
ghidra-rpc load /usr/bin/ls
ghidra-rpc decompile ls main
ghidra-rpc xrefs-to ls strcmp
ghidra-rpc rename-function ls FUN_00401234 parse_args
```

To see all running daemon instances and attach to an existing one:

```bash
ghidra-rpc list-instances
# {"ok": true, "result": {"instances": [{"project": "/tmp/work.gpr", "mode": "headless", "pid": 84712, ...}], "count": 1}}

export GHIDRA_RPC_PROJECT=/tmp/work.gpr
ghidra-rpc list-binaries   # attach to the existing session
```

See docs/install.md for prerequisites and
docs/quickstart.md for a full walkthrough.

## How It Works

```
┌─────────────┐    Local Transport     ┌──────────────────────────┐
│  LLM agent  │  ──── JSON/newline ──→ │  ghidra-rpc daemon       │
│  (via CLI)  │  ←── JSON/newline ───  │  (PyGhidra + Ghidra JVM) │
└─────────────┘                        └──────────────────────────┘
```

The daemon runs Ghidra in-process via
PyGhidra.
Ghidra loads the binary once and stays warm between commands — no re-analysis on
every invocation. All changes (renames, comments, type definitions, patches) are
saved to the Ghidra project after every command and remain visible when you open the
project in the Ghidra GUI.

## Runtime Paths

All paths use an 8-character hash derived from the absolute `.gpr` project path,
so each project gets its own deterministic endpoint and session file with no
collisions.

| Path | Purpose |
|------|---------|
| `/tmp/ghidra-rpc-.sock` | Unix socket for a running daemon (Linux/macOS) |
| `%LOCALAPPDATA%\ghidra-rpc\ghidra-rpc-.sock` | Authenticated loopback TCP endpoint metadata (Windows) |
| `/tmp/ghidra-rpc-.log` or `%LOCALAPPDATA%\ghidra-rpc\ghidra-rpc-.log` | Background daemon log (`--detach` mode) |
| `/.ghidra-rpc-.json` | Per-project session file (default, alongside `.gpr`) |
| `$GHIDRA_RPC_STATE_DIR/.json` | Per-project session file when override is set |
| `~/Library/Application Support/ghidra-rpc/sessions.json` | Global session registry (macOS) |
| `~/.local/state/ghidra-rpc/sessions.json` | Global session registry (Linux) |
| `$XDG_STATE_HOME/ghidra-rpc/sessions.json` | Global session registry (Linux, if `$XDG_STATE_HOME` set) |
| `%LOCALAPPDATA%\ghidra-rpc\sessions.json` | Global session registry (Windows) |
| `$GHIDRA_RPC_STATE_DIR/sessions.json` | Global session registry when override is set |

`$GHIDRA_RPC_STATE_DIR` is a single knob that redirects **both** per-project
session files and the global registry to a custom directory — useful in
sandboxed or CI environments.

The global session registry is maintained automatically: `start` adds an entry,
`stop` removes it, and `list-instances` prunes any entries whose endpoint file has
disappeared (e.g. after a crash).

## Documentation

- Installation
- Quick Start
- Troubleshooting
- Internals — session/socket design, Ghidra API notes

### Workflow Guides

- Binary Audit
- Vulnerability Research
- Patch Analysis

## License

MIT
