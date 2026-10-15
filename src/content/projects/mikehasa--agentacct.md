---
title: "mikehasa/agentacct"
owner: "mikehasa"
name: "agentacct"
fullName: "mikehasa/agentacct"
description: "Local-first Agent Work Intelligence for coding agents: usage truth, recorded work, and honest joins. Read-only over coding-agent logs; zero-JavaScript localhost dashboard."
sourceUrl: "https://github.com/mikehasa/agentacct"
stars: 328
forks: 2
language: "Python"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-07-26"
pushedAt: "2026-07-25T15:09:28Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# agentacct

*图片：tests*
[*图片：PyPI*](https://pypi.org/project/agentacct/)
[*图片：Python*](https://pypi.org/project/agentacct/)
*图片：License: MIT*

**See what your coding agents actually did — and what it cost — on a dashboard that never leaves your machine.**

agentacct is local-first Agent Work Intelligence for coding agents. It reads the session logs that Claude Code and Codex already write on your machine, joins them with the work each session records as it goes, and shows the result — tokens, estimated cost, tasks, and evidence — on a local dashboard.

**Private by design.** Everything stays on your machine: state is plain local files, the dashboard binds to `127.0.0.1`, and there is no phone-home telemetry, no account, no cloud sync. agentacct never stores or requests a provider API key.

*图片：agentacct dashboard: token usage, estimated cost, and per-agent breakdown charts*

Screenshots show a synthetic demo workspace; your dashboard renders your machine's real local data.

## What you get

- **Honest usage and cost.** Tokens per agent, model, and day — read from the clients' own local session files and labeled `client_reported`; costs are clearly marked pricing-table estimates, never invoices.
- **The work, not just the tokens.** Sessions roll up into Tasks with recorded work steps and machine checks: a passing test is `Verified` evidence, an agent's own claim stays labeled `Agent reported`.
- **Attribution you can trust.** Every join between usage and recorded work carries a confidence label (`exact`/`high`/`medium`/`low`). Missing attribution beats wrong attribution: when agentacct cannot prove a link, it shows the gap instead of a guess.

*图片：agentacct dashboard: recent tasks with work steps, checks, and per-task token totals*

## Install

Requires Python >= 3.11 on macOS or Linux; Windows is supported only via WSL.

```bash
pipx install agentacct
agentacct onboard   # from your repo root
```

No `pipx` yet? Install it first with `brew install pipx` (macOS) or `python3 -m pip install --user pipx` — or skip pipx entirely and use `uv tool install agentacct`. See INSTALL.md for a plain-`venv` fallback.

`onboard` detects your local coding-agent logs, sets up the project-local store, runs a first usage sync, and starts the dashboard at `http://127.0.0.1:8765`. Then open a **new** agent session in the project — MCP servers and hooks bind at session start, so the session that ran onboarding cannot become the first recorded Task.

Prefer to let the agent do it? Paste this into the coding agent working in your target repo:

```text
Install and set up agentacct in this repo — a local-first dashboard that reads my
coding-agent logs read-only and shows honest token usage and cost.

Run `pipx install agentacct`
(or `pipx install git+https://github.com/mikehasa/agentacct`),
then `agentacct onboard` from this repo root, then tell me the dashboard URL.

Observe-only: never store, request, or echo any API key; all state stays local
under `.agent-sentinel/`. Don't modify my global client config without showing
the exact command first.
```

The agent then follows INSTALL.md, the canonical runbook: manual per-client setup, a machine-wide global install, and the full per-client capability matrix. `agentacct setup prompt --agent ` prints the same prompt.

Want to look around before touching your real data? `agentacct demo` runs a safe local walkthrough in a throwaway temporary store — no provider keys, no paid API calls.

The managed runtime is controlled with `agentacct start` / `status` / `stop` / `repair`; all state lives in the project-local `.agent-sentinel/` directory (gitignored; the directory keeps its pre-rename spelling for data compatibility).

### Uninstall

```bash
agentacct stop                 # stop the managed sync + dashboard (owned processes only)
agentacct uninstall-autostart  # only if you installed autostart
pipx uninstall agentacct
```

Then, per onboarded project: delete the `.agent-sentinel/` directory (that project's local ledger — keep it if you want the history) and remove the agentacct entries onboarding added to the client config (`.mcp.json` / `.claude/settings.local.json`, or `~/.codex/config.toml`). If you installed the standing instruction block, remove it first with `agentacct setup instructions --agent  --user --remove`.

## What it is honest about

agentacct is early alpha, and it would rather show you a gap than a guess:

- **No hosted anything.** No hosted dashboard, no phone-home telemetry, no automatic cloud account sync. agentacct can *receive* telemetry locally when you explicitly point an OTLP exporter at it.
- **Estimates are labeled as estimates.** There is no exact Claude Code/Codex subscription invoice access; costs come from a local pricing table and are labeled accordingly. See docs/usage-truth-table.md for what each path can and cannot prove.
- **No silent monitoring.** agentacct only reads the local session files of detected clients and never watches unrelated processes started outside agentacct/integrations. Hard stops apply only to runs agentacct itself launched or the opt-in proxy path.
- **Support is per-capability, not per-logo.** Claude Code and Codex have live-observed usage paths today; other clients (Hermes, OpenCode, OpenClaw, Cursor) have narrower, explicitly-scoped paths. The per-client claims are pinned in the capability matrix in INSTALL.md and docs/reference.md, and `agentacct capabilities agents` prints the same truth for your machine.

Interfaces may change while agentacct is alpha.

## How it works

agentacct keeps two evidence streams separate and joins them on real client ids instead of guessing:

- **Usage truth** comes from the client's own local session files: imported tokens are labeled `client_reported`, and costs are pricing-table estimates — never provider invoices.
- **Work meaning** comes from the sections and events the agent records over MCP while it works (`sentinel_record_section`, `sentinel_record_machine_check`), plus machine checks like test runs.
- **The join** links the two through session/transcript ids and labels every attribution `exact`, `high`, `medium`, or `low`. For Claude Code, an installed hook bridge captures real session/transcript ids at session start and on every tool call; for Codex, the link is evidenced from the client's own session logs at import time.

The per-client join mechanics, confidence-label glossary, daily workflow, MCP tool list, and optional enforcement extras are in docs/reference.md.

## Documentation

- Reference — daily workflow, confidence labels, MCP tools, per-client capability matrix, verification evidence, enforcement extras, migration notes
- Install runbook — per-client setup, global install, capability matrix
- Usage and cost truth table
- Coding agent integrations
- Architecture
- Task Intelligence and the local control plane
- Multi-source Evidence v2 architecture
- Multi-source privacy threat model
- Safety boundaries
- Full flow demo
- Live smoke evidence
- Public alpha checklist

## Development

See `CONTRIBUTING.md` for contribution scope, safety principles, and PR expectations.

Run tests from a clone (the pipx install above ships no test tooling):

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -e .
.venv/bin/python -m pip install pytest
.venv/bin/python -m pytest tests/ -q --tb=short
```

## Feedback

agentacct is early alpha. Useful feedback:

- Which agent or tool do you use?
- What runaway, cost, or observability issue did you hit?
- Which join/attribution result looked wrong or missing?
- What report would help you trust a run?
- Which integration should be supported next?

Open an issue with a bug report, feature request, or integration request. Please scrub any provider API keys or private paths from logs before sharing them.
