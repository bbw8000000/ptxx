---
title: "Nanako0129/sepia"
owner: "Nanako0129"
name: "sepia"
fullName: "Nanako0129/sepia"
description: "De-AI writing skill for Claude Code, Codex, Grok Build, and Antigravity — narrative-architecture repair for fiction, venue-matched rules for professional prose. Based on StoryScope (arXiv:2604.03136)."
sourceUrl: "https://github.com/Nanako0129/sepia"
stars: 701
forks: 39
language: "未知"
topics: ["agent-skills", "ai-writing", "antigravity", "claude-code", "codex", "developer-tools", "fiction", "grok"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-08-30"
pushedAt: "2026-08-29T23:19:30Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# sepia

**English** | 繁體中文

> De-AI writing at the layer that actually gives AI away. Fiction gets its narrative architecture repaired before anyone touches word choice; professional documents (release notes, PR replies, postmortems, tickets, technical articles) each get rules matched to their venue.

A portable [Agent Skill](https://agentskills.io/specification) for Claude Code, Codex, Grok Build, and Antigravity. One canonical `SKILL.md`, no per-platform forks. Four operations: **write**, **review** (diagnose only), **refactor** (minimal edits), **recreate** (full rewrite).

## Why another humanizer

Every popular humanizer edits word choice and syntax. [StoryScope](https://arxiv.org/abs/2604.03136) (Russell et al., 2026: 61,608 stories, human + 5 frontier LLMs) showed that a classifier using **narrative-structure features alone** detects AI fiction at 93.2% macro-F1, and that editing the surface style away barely moves it (95.5% → 93.9%). The tells that survive are architectural: themes explained by the narrator, single-track causally-tidy plots, emotions rendered only as bodily sensation, no real-world references, no reader, linear time, endings resolved by protagonist growth and acceptance.

sepia turns those measured gaps, together with the eleven related studies digested in `research/`, into a three-pass writing and revision protocol for fiction:

| Pass | Layer | Examples |
|---|---|---|
| 1 | Narrative architecture (fiction) | stop explaining the theme, loosen the causal chain, back-load revelations, mix emotion modes, sparse character networks, name real things |
| 2 | Discourse flow | de-template the paragraph-question sequence, fix the mid-story sag, vary rhythm and positions |
| 3 | Surface style | the classic layer: clichés, syntax templates, vocabulary, register |

Plus a 30-feature diagnosis rubric and per-model fingerprint corrections (Claude, GPT, Gemini, DeepSeek, Kimi).

Professional prose fails differently. The studies point at filler that carries no information, hedging where a judgment was needed, chatbot leftovers, register that ignores the venue, and formatting that looks stamped out. Each document type gets a thin rule file on top of one shared checklist:

| Domain | The gist |
|---|---|
| Release notes / announcements | user impact first, artifacts per claim, no marketing inflation |
| PR / issue replies | answer first, cite `file:line`, no reflex praise, length ∝ stakes |
| Postmortems | blameless toward people, merciless toward mechanisms; timestamps, dead ends, owned action items |
| Tickets / work orders | title = outcome, testable acceptance criteria, link don't repeat |
| Technical articles | open at the problem, one real dead end, one committed opinion, numbers with conditions |

The governing principle throughout: **calibrate to the human distribution, don't invert the AI one.** Humans sit at moderate values; a story with every rule applied is a new fingerprint. The skill selects 3–5 moves per story and leaves slack.

## Install

Claude Code, Codex, and Grok Build use their native plugin installers. Antigravity uses the manual path below. Every install defaults to **user scope** — install once, use it in every project.

### Claude Code

```bash
# install
claude plugin marketplace add Nanako0129/sepia
claude plugin install sepia@sepia --scope user

# update
claude plugin marketplace update sepia
claude plugin update sepia
```

The in-session `/plugin install` dialog asks you to pick a scope — choose **User** there.

### Codex

```bash
# install
codex plugin marketplace add Nanako0129/sepia
codex plugin add sepia@sepia

# update — refresh the marketplace snapshot, then re-add to pick up the new version
codex plugin marketplace upgrade sepia
codex plugin add sepia@sepia
```

### Grok Build

```bash
# install
grok plugin install Nanako0129/sepia --trust

# update
grok plugin update
```

Grok also auto-discovers a Claude Code install of sepia if you have one; either route works.

### Antigravity

Antigravity has no marketplace. This fresh install is pinned to the current release, `v0.2.0`, and aborts if either destination already exists:

```bash
(
  set -e

  skill="$HOME/.gemini/config/skills/sepia"
  workflow="$HOME/.gemini/antigravity/global_workflows/sepia.md"

  if [ -e "$skill" ] || [ -L "$skill" ] || [ -e "$workflow" ] || [ -L "$workflow" ]; then
    echo "Antigravity install aborted: move the existing skill and workflow aside first." >&2
    exit 1
  fi

  git clone --branch v0.2.0 --depth 1 https://github.com/Nanako0129/sepia.git "$HOME/.sepia"
  mkdir -p "$HOME/.gemini/config/skills" "$HOME/.gemini/antigravity/global_workflows"
  cp -R "$HOME/.sepia/skills/sepia" "$skill"
  cp "$HOME/.sepia/.agents/workflows/sepia.md" "$workflow"
)
```

Antigravity has no automated updater. To update or roll back, inspect the release you want, move the current clone, skill, and workflow aside under backup names you choose, then repeat this fresh install with that release tag.

### Skills CLI (alternative, 77+ agents)

```bash
npx skills add Nanako0129/sepia -g     # -g = user scope; the default is project
npx skills update -g                   # update
```

### Project scope (alternative)

When one repo should pin its own copy, commit `skills/sepia/` into that repo as `.agents/skills/sepia` (Codex + Antigravity) or `.claude/skills/sepia` (Claude Code).

## Uninstall

Claude Code, Codex, and Grok Build each use their native command:

```bash
# Claude Code
claude plugin uninstall sepia@sepia --scope user

# Codex
codex plugin remove sepia@sepia

# Grok Build
grok plugin uninstall sepia
```

For Antigravity, disable both entries by renaming them. The preflight stops before either move if a source is missing or a `.disabled` target already exists:

```bash
(
  set -e

  skill="$HOME/.gemini/config/skills/sepia"
  workflow="$HOME/.gemini/antigravity/global_workflows/sepia.md"

  if [ ! -e "$skill" ] && [ ! -L "$skill" ]; then
    echo "Antigravity disable aborted: skill not found." >&2
    exit 1
  fi
  if [ ! -e "$workflow" ] && [ ! -L "$workflow" ]; then
    echo "Antigravity disable aborted: workflow not found." >&2
    exit 1
  fi
  if [ -e "$skill.disabled" ] || [ -L "$skill.disabled" ] || [ -e "$workflow.disabled" ] || [ -L "$workflow.disabled" ]; then
    echo "Antigravity disable aborted: a .disabled target already exists." >&2
    exit 1
  fi

  mv "$skill" "$skill.disabled"
  mv "$workflow" "$workflow.disabled"
)
```

This leaves `~/.sepia` in place for inspection. Deleting it is a separate manual decision.

## Layout

```text
sepia/
├── skills/sepia/            # canonical skill (Agent Skills standard)
│   ├── SKILL.md             # routing, operations, calibration rules, guardrails
│   └── references/
│       ├── narrative-pass.md      # fiction pass 1: architecture (the differentiator)
│       ├── discourse-pass.md      # pass 2: paragraph-level flow
│       ├── style-pass.md          # pass 3: surface style
│       ├── rubric.md              # fiction 30-feature diagnosis
│       ├── model-fingerprints.md  # per-model corrections
│       ├── professional-pass.md   # shared non-fiction layer (slop checklist, venue matching)
│       └── domains/               # release-notes, dev-replies, postmortems, tickets, tech-articles
├── .claude-plugin/          # Claude Code packaging (plugin.json, marketplace.json)
├── .codex-plugin/           # Codex packaging
├── .agents/                 # Codex/Antigravity workspace-mode discovery + Antigravity workflow
└── research/                # digested evidence base with sources
```

## Sources

Full digests with links in `research/`. Primary: StoryScope ([arXiv:2604.03136](https://arxiv.org/abs/2604.03136)); LAMP ([CHI 2025](https://arxiv.org/abs/2409.14509)); Measuring AI Slop ([arXiv:2509.19163](https://arxiv.org/abs/2509.19163)); Reinhart et al. ([PNAS 2025](https://arxiv.org/abs/2410.16107)); Russell et al. ([ACL 2025](https://arxiv.org/abs/2501.15654)); NarraBench ([arXiv:2510.09869](https://arxiv.org/abs/2510.09869)); Echoes in AI ([PNAS 2025](https://arxiv.org/abs/2501.00273)); QUDsim ([COLM 2025](https://arxiv.org/abs/2504.09373)); Beguš ([2024](https://arxiv.org/abs/2310.12902)); Beyond Checkmate ([EMNLP 2025](https://arxiv.org/abs/2501.19301)); Nonaka & Perry ([2025](https://arxiv.org/abs/2510.18932)); Chakrabarty et al. ([2026](https://arxiv.org/abs/2510.13939)).

## License

MIT
