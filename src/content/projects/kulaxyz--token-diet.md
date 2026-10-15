---
title: "Kulaxyz/token-diet"
owner: "Kulaxyz"
name: "token-diet"
fullName: "Kulaxyz/token-diet"
description: "Always-on token-efficiency skill for coding agents (Claude Code, Codex, Cursor, Windsurf, Cline). ~31% lower bill on average, no loss of correctness."
sourceUrl: "https://github.com/Kulaxyz/token-diet"
stars: 472
forks: 4
language: "Shell"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-07-04T18:32:05Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# token-diet

Always-on token-efficiency skill for coding agents — **Claude Code, Codex, Cursor,
Windsurf, Cline**. Trims tokens across the whole session (replies, docs, tests,
code, context, tool use) without losing correctness. **≈31% lower bill on average**
(−17% to −54% by session type) and **−30% to −81% output** on real Sonnet 5 runs.

*trim the fat, keep the muscle.*

## Install

```bash
# one-liner — auto-detects Claude Code, Codex, etc.:
curl -fsSL https://raw.githubusercontent.com/Kulaxyz/token-diet/main/install.sh | bash

# pass options through `bash -s --`, e.g. the telegraphic level:
curl -fsSL https://raw.githubusercontent.com/Kulaxyz/token-diet/main/install.sh | bash -s -- --ultra
```

Or clone and run `./install.sh` (`--ultra` telegraphic chat · `--uninstall` remove).
Target one agent with `-a claude|codex|cursor|windsurf|cline|all|print`, or add
`--project` to install into the current repo instead of globally. It runs
always-on — no per-message command — but `/token-diet [on|lite|ultra|off]` also
works on demand.

## What it does

- **Replies** — lead with the answer; no preamble ("Sure! Here's…") or postamble
  ("Let me know…"); report deltas, not narration.
- **Docs / memory / hand-offs / plans / comments** — minimum words that still say
  everything; comment the non-obvious *why*, not the code.
- **Tests** — only key + critical/edge paths, grouped; ≤10 per session; never skip
  money/auth/data-loss.
- **Code** — build only what's asked (YAGNI); concise but idiomatic; no dead code;
  never cryptic.
- **Context** — grep before you read; read only the lines you need, never whole
  files; batch reads; fewer turns; never re-read a just-edited file.
- **Tools** — batch independent calls; **stop the moment you have enough to act**;
  targeted test runs while iterating.
- **Sub-agents** — delegate broad *bounded* search to a cheaper model; keep
  correctness-sensitive verification yourself; tight, complete instructions.
- **Guardrails** — concision applies to output, never to reasoning: correctness,
  critical test coverage, and verbatim code/commands/errors are off-limits.

## Levels

`on` (default — everything above) · `lite` (communication + artifacts only) ·
`ultra` (telegraphic chat/progress; code, tests, docs stay precise) · `off`.

## Before / After — `ultra` chat reply (token counts measured, `o200k_base`)

**Normal — 102 tokens:** "Great question! The reason your Stripe webhook signature
verification is failing is that you're passing the already-parsed JSON body into
`constructEvent`. Stripe computes the signature over the exact raw bytes of the
request, so once your framework has parsed the body into JSON the bytes no longer
match and verification fails. What you want to do is read the raw request body
instead — for example with `req.text()` in a Next.js route handler — and pass that
string to `constructEvent`. Let me know if you'd like a code snippet!"

**token-diet `ultra` — 34 tokens (−66%):** "`constructEvent` verifies over raw
bytes → parsed JSON fails. Read raw body (`req.text()` / Buffer), pass that to
`constructEvent`. Fix at `webhook/route.ts`."

Same fix, same identifiers, same path — only filler gone.

## Numbers (real Sonnet 5 runs)

Output savings are consistent; the bill win depends on how much of the session is
output vs. unavoidable file-reading:

| Session type | Output | Bill |
|---|--:|--:|
| Output-heavy (advice, planning, explanation) | −81% | −54% |
| Code change + tests (`nestjs/nest`, 1673 files) | −49% | −22% |
| Read-heavy comprehension | −30% | −17% |
| **Average** | **−53%** | **−31%** |

Average is unweighted across the three scenarios; the 54% is best-case, not
typical. Correctness held in every run. Method + full tables: `bench/RESULTS.md`;
reproduce with `ANTHROPIC_API_KEY=… node bench/bench.mjs`.

## How always-on works

A skill body loads on-demand, so to make it *always* apply the installer injects
the directive through a channel that fires every session: a `SessionStart` hook
(Claude Code), or an always-loaded context file (Codex `AGENTS.md`,
Cursor/Windsurf/Cline rule files). Same trick caveman uses.
