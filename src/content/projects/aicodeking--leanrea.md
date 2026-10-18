---
title: "aicodeking/leanrea"
owner: "aicodeking"
name: "leanrea"
fullName: "aicodeking/leanrea"
description: "One 8 KB skill that replaces REA (Reverse Engineer Anything): plain CLI tools, no MCP. Benchmarked: 38% faster, 35% cheaper."
sourceUrl: "https://github.com/aicodeking/leanrea"
stars: 462
forks: 90
language: "Python"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-10-18"
pushedAt: "2026-10-17T03:25:53Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# leanrea

**One 8 KB skill file that does what REA does: no MCP server, no 207 tools, no setup.**

REA (Reverse Engineer Anything) puts an MCP layer between your agent and tools it can already use: asar, otool, nm, `go version -m`, jadx, apktool, Ghidra, tshark, binwalk, sqlite3. leanrea drops that layer. It tells the agent which command is fastest for each kind of target, gives it ready-to-paste recon commands, and lists the traps that REA's code handles for you. The agent then runs the real tools itself.

|  | REA 6.5.0 | leanrea |
|---|---|---|
| What gets installed | 25 MB npm package + MCP server | one `SKILL.md` |
| Instructions | 23.5 KB skill + 48.8 KB references | 8 KB |
| Tools added to the agent | 207 (3.35 MB of definitions) | 0 (uses Bash) |
| Context for "Reply OK", all tools loaded | 400.7k tokens, $1.60 | 34.5k tokens, $0.09 |

## Benchmark

Claude Code headless (`claude -p`), Sonnet 5.5, macOS arm64. 4 reverse-engineering tasks × 3 reps × 3 arms, with the arms run side by side. Answers are graded against hand-made keys.

| arm | total wall time | cost | turns | tokens | score |
|---|---|---|---|---|---|
| **leanrea** | **388 s** | **$2.17** | **55** | **2.40 M** | 74/75 |
| no skill | 479 s | $2.21 | 81 | 3.11 M | 67/75 (one refusal) |
| REA (MCP + its skill) | 627 s | $3.36 | 124 | 5.93 M | 75/75 |

Against REA, leanrea had **38% less wall time, 35% lower cost, 56% fewer turns and 60% fewer tokens, at the same accuracy**. Its one partial miss named an older IPC channel instead of the v2 one (both channels exist).

The tasks:
- **electron**: trace a feature through a real Electron app's app.asar (native function → main-process class → IPC channels).
- **native**: inventory the exports, a TCC permission check and the single-instance lock of that app's native addon (`.node`).
- **go**: toolchain and dependency versions of a stripped `gh` binary.
- **deep**: from disassembly alone, the exact socket path format, wire protocol and peer authentication of that lock.

The same operation run through REA's CLI vs the raw command:

| operation | REA | raw |
|---|---|---|
| Go build info | 0.56 s | `go version -m`: 0.06 s |
| Mach-O overview | 3.32 s | otool + dyld_info + nm: 0.04 s |
| Electron app analysis (real desktop app) | fails on asar integrity until you pass a flag, then **47.9 s and 140 MB of JSON** | asar extract + `rg -uu`: 4.8 s, 24 KB |

Full tables, the context-overhead runs and caveats: bench/BENCHMARK.md. Raw per-run metrics: bench/results/final.jsonl.

**Caveats:**
- Only 3 reps per cell, one model, one machine.
- REA was tested in its best case: Claude Code's deferred tool search loads MCP tools on demand. Agents that load every tool pay the 400k-token row.
- Ghidra, Hopper and jadx weren't installed, so the native tasks ran on Xcode tools for both arms.
- The plain model is already good at this. leanrea's gain over no skill (about 19% faster, 32% fewer turns) is smaller than its gain over REA.

## Install

```sh
npx skills add aicodeking/leanrea
```

This uses the [skills CLI](https://skills.sh). It finds the `leanrea` skill and asks which agents to install it for: Claude Code, Codex, Cursor, Gemini CLI, OpenCode and the others it supports.

Common variants:
```sh
npx skills add aicodeking/leanrea -g                    # install for your user, in every project
npx skills add aicodeking/leanrea -a claude-code -y     # Claude Code only, no prompts
npx skills add aicodeking/leanrea -g -a '*' -y          # every supported agent, user level
npx skills update leanrea                               # pull the latest version later
```

Manual install, if you prefer:
```sh
git clone https://github.com/aicodeking/leanrea
mkdir -p ~/.claude/skills && cp -R leanrea/leanrea ~/.claude/skills/
```
If an agent has no skills support, paste `leanrea/SKILL.md` into its rules or system prompt; it is plain text.

Use it:
```
/leanrea How does the search feature in Foo.app work? Show the evidence.
```

## What's in the skill

- **Rules:**
  - Work on a copy.
  - Route by `file` and magic bytes first.
  - Slice minified files instead of reading them.
  - Batch probes into one shell call.
  - Search extracted trees with `rg -uu`, because bundlers hide code in dot-folders like `.webpack/`.
  - Mark each claim as seen, inferred or unknown.
- **Router:** the fastest command for each target type:
  - Electron/asar (IPC, preload, `contextBridge`, fuses)
  - minified web bundles and source maps
  - Hermes/bytenode
  - Mach-O (exports, imports, entitlements, ObjC/Swift)
  - native disassembly, ELF/PE
  - Go buildinfo, Rust cargo-auditable, .NET, Android APKs, the Flutter snapshot hash
  - WASM, SQLite, plists, pcap/HAR, firmware
  - websites and runtime tracing
- **First moves:** one paste-and-run command each for native binaries and Electron apps. Each gets the whole inventory in a single tool call.
- **Speed patterns:** start from strings and imports, find a string's function through the otool literal-pool comments, read call sequences rather than every instruction, and diff inventories before diffing code.

## Reproduce the benchmark

Needs macOS with the target Electron app installed (see `bench/setup.sh`), `gh` from Homebrew, Node, and Claude Code logged in.
```sh
cd bench
./setup.sh        # installs rea-agents@6.5.0, copies the targets into bench/work (gitignored)
./run_all.sh      # 36 runs, about $8 on Sonnet
./ctx.sh          # context-overhead probe
python3 mcp_list.py node work/rea-install/node_modules/rea-agents/scripts/rea.mjs --mcp   # REA tool count + size
```
The answer keys in `tasks.json` match the app versions used here and a `gh` built with go1.27.1. Other versions need new keys.

## Credit

REA is an impressive, well-documented project by the morluto team. Most of the gotchas in this skill came from reading their code and docs. leanrea isn't affiliated with REA. It is just a test of whether a model with plain tools and a short note can do the same work faster.

MIT licensed.
