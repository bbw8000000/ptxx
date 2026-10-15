---
title: "Nanako0129/pilotfish"
owner: "Nanako0129"
name: "pilotfish"
fullName: "Nanako0129/pilotfish"
description: "Multi-model orchestration layer for Claude Code — the frontier model plans, cheaper models execute, verification guards quality. One-prompt install."
sourceUrl: "https://github.com/Nanako0129/pilotfish"
stars: 697
forks: 46
language: "Python"
topics: ["ai-agents", "anthropic", "claude", "claude-code", "multi-agent", "orchestration"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-25T20:43:27Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# pilotfish 🐟

> Small, fast role agents handle volume work while the frontier main session
> keeps planning, approval, integration, and final judgment.

**pilotfish** is a multi-model orchestration policy for
[Claude Code](https://code.claude.com). The macOS and Linux Plugin beta
adds hook-based ambient activation; the global configuration install remains a
legacy alternative. The policy uses the `opus` family for the main session,
Sonnet for bounded execution and reconnaissance (Haiku only for the legacy
install's `Explore`), and fresh Opus contexts for risk-triggered review.

繁體中文

## Contents

- Why
- How it works
- Install
- Operate
- Documentation
- Project

## Why

Most coding-session tokens are spent on search, repetitive edits, tests, and
documentation rather than frontier judgment. pilotfish routes those bounded
paths to cheaper roles while keeping the main session accountable and using
fresh-context reviewers at material acceptance boundaries.

New installs default to the `opus` alias; Fable remains an explicit
`/model fable` choice. This is a cost-aware default, not a claim that one model
wins every task. The rationale and measurements live in
research, the design notes, and
#23.

| Host or use case | Project |
|---|---|
| Claude Code global policy | This repository |
| Claude Code with session-scoped GPT routing | remora |
| Grok Build | pilotfish-grok |
| Codex CLI | pilotfish-codex |

## How it works

The Plugin beta packages the policy and namespaced roles under Claude Code's
native Plugin lifecycle. The legacy global install uses these direct targets:

| Layer | Installed target | Responsibility |
|---|---|---|
| Machine | `~/.claude/settings.json` | Main-model alias and fallback chain |
| Roles | `~/.claude/agents/*.md` | Model, effort, and capability boundary for each role |
| Policy | `~/.claude/CLAUDE.md` | Dispatch, approval, verification, and long-run behavior |

If `CLAUDE_CONFIG_DIR` is set, all `~/.claude/` paths above move under that
configuration root.

```mermaid
flowchart TD
    U["You"] --> I
    subgraph MAIN["main session — opus family alias"]
        I["Interaction shape
execute / explore_then_plan / co_discover"]
        I --> O
        O["Orchestrator
plan / decide / spec / review"]
    end
    O -->|recon| S["scout
sonnet · effort low"]
    O -.->|recon, legacy only| X["Explore
haiku · effort low"]
    O -->|Plan challenge| PV["plan-verifier
opus · read-only"]
    PV -->|READY / REVISE| O
    O -->|mechanical spec| M["mech-executor
sonnet · effort low"]
    O -->|judgment work| E["executor
sonnet · effort medium"]
    O -->|security evidence| SR["security-reviewer
opus · read-only"]
    SR --> O
    O -->|approved security work| SEC["security-executor
opus · effort medium"]
    M --> V["verifier
opus · fresh context"]
    E --> V
    SEC --> V
    V -->|CONFIRMED / REFUTED / INCONCLUSIVE| O
```

| Role | Model | Effort | Purpose |
|---|---|---|---|
| `scout` | sonnet | low | Read-only repository reconnaissance |
| `Explore` | haiku | low | Broad read-only search without inheriting the main model — legacy global install only (why) |
| `plan-verifier` | opus | medium | Pre-approval Plan challenge: `READY` or structured `REVISE` |
| `security-reviewer` | opus | high | Read-only security evidence before approval |
| `mech-executor` | sonnet | low | Fully specified mechanical repetition |
| `executor` | sonnet | medium | Approved implementation requiring local judgment |
| `verifier` | opus | medium | Fresh-context outcome falsification after implementation |
| `security-executor` | opus | medium | Approved security-sensitive implementation |

Before Baton or direct/delegated routing, pilotfish chooses the first matching
interaction shape: `co_discover` while the outcome or acceptance is unclear;
otherwise `explore_then_plan` when a clear direction is broad or high-impact;
otherwise `execute` for a clear bounded outcome. This changes how the main
session collaborates; it does not bypass risk or approval gates. The design is
adapted from
pilotfish-codex's adaptive intent routing
by @miyago9267. See the
design details.

Small, stable work stays in the main session. Larger work is split only when a
bounded role has a stable contract and delegation has positive net benefit.
Risk, not file count, triggers independent review. The exact lifecycle is
defined in the policy template and
explained in the design rationale.

> ⚠️ **Automatic delegation is not guaranteed.** Higher-priority Claude Code
> instructions can suppress Agent dispatch, and user-level `CLAUDE.md` cannot
> override them. When the lifecycle matters, include the following request.

```text
Use pilotfish. Follow its dispatch brake: keep direct work in the main session
and call the named agents only when the policy selects delegation.
```

The bounded results and claim limits are recorded in the
spontaneous-dispatch benchmark
and `cue-free-tui.json`.
They are behavioral observations, not a dispatch rate or proof of the active
system-prompt bytes.

## Install

### Plugin beta for macOS and Linux

Use the Plugin beta install guide for native
user-scope marketplace commands, migration from global v1, update,
disable/enable, uninstall, and rollback. The experimental beta targets macOS
and Linux. Linux requires Ubuntu 20.04+, Debian 10+, or Alpine Linux 3.19+ and
an otherwise-working officially supported Claude Code installation, per the
[official system requirements](https://code.claude.com/docs/en/setup#system-requirements)
(checked 2026-08-22). macOS with Claude Code 2.1.239 is live-observed. Linux is
contract-qualified only; it has not been tested, verified, or live-observed.
Windows is excluded. SessionStart hooks are required, the Plugin must not
coexist with the legacy global install, and this beta does not claim stable
reliability, cross-version compatibility, or runtime namespace-collision proof.

### Legacy global install

Clone the reviewed release, start Claude Code from that checkout, and ask it to
follow the local runbook:

```bash
git clone --branch v1.4.2 --depth 1 https://github.com/Nanako0129/pilotfish.git
cd pilotfish
claude
```

```text
Read the local file install/AGENT-INSTALL.md in the current checkout and follow
it to install pilotfish into my global Claude Code configuration. Show me the
full plan of changes and get my approval before writing anything.
```

> **Runtime requirement:** Claude Code **2.1.219 or newer**. Restart Claude Code
> after installation so the agent directory and model setting are reloaded.

> ⚠️ **Trust boundary:** the policy loads into every future session. Review the
> pinned checkout, the agent templates, the
> policy template, and the
> install runbook before approving writes. Do not
> bypass WebFetch prompt-injection protection to install from a mutable raw URL.

| Target | Installed change | Reversible |
|---|---|---|
| `settings.json` | Adds missing `model` and `fallbackModel`; conditionally extends an existing `availableModels` allowlist | Restores or removes `model`; `fallbackModel` is removable, while allowlist additions remain unless requested |
| `agents/` | Eight role-agent files | Yes |
| `CLAUDE.md` | One versioned `pilotfish:begin/end` policy block | Yes |

The installer is idempotent and shows a merge plan before writing. Human-readable
steps, backups, collision handling, verification, updates, and uninstall are all
in install/AGENT-INSTALL.md.

## Operate

| Task | Where to go |
|---|---|
| Install, update, disable, or remove the macOS and Linux Plugin beta | Plugin beta guide |
| Tune models, effort, delegation, or managed settings | Usage guide |
| Activate pilotfish for a task or session | Install `/pilotfish` or the CLI wrapper |
| Update an existing install | Runbook: Updating an existing install |
| Review release changes | CHANGELOG.md |
| Disable pilotfish for one project | Use a separate `CLAUDE_CONFIG_DIR`; details are in the usage guide |
| Uninstall safely | Runbook: Uninstall |

To delegate uninstall to Claude Code:

```text
Read the local install/AGENT-INSTALL.md, resolve the Claude Code configuration
root exactly as Step 0 specifies, and follow its Uninstall section. In that
configuration root, remove the eight pilotfish agent files and policy block.
Show me the full removal and settings-restoration plan and get my approval
before writing.
```

## Documentation

| Topic | Document |
|---|---|
| Daily use and troubleshooting | docs/usage.md · 繁體中文 |
| Architecture and policy decisions | docs/design.md |
| Model economics and source research | docs/research.md · 繁體中文 |
| Real long-session field report | docs/field-report-tokscale-2026-07.zh-TW.md |
| Behavioral evidence and claim limits | dispatch brake · spontaneous dispatch · Baton activation · prompt compression · verifier boundary |
| Contribution and evidence contracts | CONTRIBUTING.md |

## Project

pilotfish is MIT licensed. Behavioral compatibility claims require paid model
runs, fresh verification, and maintained evidence; sponsorship helps fund those
gates.

[*图片：Support pilotfish on Patreon*](https://www.patreon.com/cw/Nanako0129/membership)

License · Contributing
