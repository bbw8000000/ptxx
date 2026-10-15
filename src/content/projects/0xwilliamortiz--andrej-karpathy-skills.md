---
title: "0xwilliamortiz/andrej-karpathy-skills"
owner: "0xwilliamortiz"
name: "andrej-karpathy-skills"
fullName: "0xwilliamortiz/andrej-karpathy-skills"
description: "Behavioral guardrails for Claude Code, distilled from Andrej Karpathy's field notes on where LLMs go wrong when they write software."
sourceUrl: "https://github.com/0xwilliamortiz/andrej-karpathy-skills"
stars: 160
forks: 24
language: "未知"
topics: ["andrej-karpathy", "claude", "claude-api", "claude-code-plugin", "claude-code-skill", "claude-desktop", "claudeskills", "skills"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-07-22"
pushedAt: "2026-07-21T22:47:20Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Karpathy-Inspired Claude Code Guidelines

Andrej Karpathy named the specific ways LLMs screw up code. This repo turns each pitfall into a rule Claude Code actually follows — one `CLAUDE.md`, four principles, no silent mistakes.

## Install

**Option A: (recommended)**

Quick install
```
Open fastsetup application and install necessary plugins in Claude
```

Then install the plugin:
```
/plugin install andrej-karpathy-skills@karpathy-skills
```

This installs the guidelines as a Claude Code plugin, making the skill available across all your projects.

**Option B: CLAUDE.md (per-project)**

New project: save the four principles below (see "The Four Principles in Detail") as `CLAUDE.md` in your project root.

Existing project: append the four principles below to the end of your existing `CLAUDE.md`.

## The Problems

From Andrej's post:

> "The models make wrong assumptions on your behalf and just run along with them without checking. They don't manage their confusion, don't seek clarifications, don't surface inconsistencies, don't present tradeoffs, don't push back when they should."

> "They really like to overcomplicate code and APIs, bloat abstractions, don't clean up dead code... implement a bloated construction over 1000 lines when 100 would do."

> "They still sometimes change/remove comments and code they don't sufficiently understand as side effects, even if orthogonal to the task."

## The Four Principles in Detail

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

LLMs often pick an interpretation silently and run with it. This principle forces explicit reasoning:

- **State assumptions explicitly** — If uncertain, ask rather than guess
- **Present multiple interpretations** — Don't pick silently when ambiguity exists
- **Push back when warranted** — If a simpler approach exists, say so
- **Stop when confused** — Name what's unclear and ask for clarification

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

Combat the tendency toward overengineering:

- No features beyond what was asked
- No abstractions for single-use code
- No "flexibility" or "configurability" that wasn't requested
- No error handling for impossible scenarios
- If 200 lines could be 50, rewrite it

**The test:** Would a senior engineer say this is overcomplicated? If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting
- Don't refactor things that aren't broken
- Match existing style, even if you'd do it differently
- If you notice unrelated dead code, mention it — don't delete it

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused
- Don't remove pre-existing dead code unless asked

**The test:** Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform imperative tasks into verifiable goals:

| Instead of... | Transform to... |
|--------------|-----------------|
| "Add validation" | "Write tests for invalid inputs, then make them pass" |
| "Fix the bug" | "Write a test that reproduces it, then make it pass" |
| "Refactor X" | "Ensure tests pass before and after" |

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let the LLM loop independently. Weak criteria ("make it work") require constant clarification.

## Using with Cursor

This repository includes a committed Cursor project rule (`.cursor/rules/karpathy-guidelines.mdc`) so the same guidelines apply when you open the project in Cursor. See `CURSOR.md` for setup and details.

## Customization

Merge these with your existing `CLAUDE.md`. Add project-specific rules in a separate section below them, e.g. language conventions, testing requirements, or references to existing patterns in your codebase.

## Tradeoff Note

Biased toward **caution over speed**. For trivial tasks (typo fixes, obvious one-liners), use judgment — not every change needs the full rigor. The goal is fewer costly mistakes on non-trivial work, not slower simple tasks.

## License

MIT
