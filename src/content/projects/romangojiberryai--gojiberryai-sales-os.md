---
title: "romangojiberryAI/gojiberryai-sales-os"
owner: "romangojiberryAI"
name: "gojiberryai-sales-os"
fullName: "romangojiberryAI/gojiberryai-sales-os"
description: "GojiberryAI Sales OS: a full AI outbound team for Grok Bot, powered by the GojiberryAI MCP."
sourceUrl: "https://github.com/romangojiberryAI/gojiberryai-sales-os"
stars: 39
forks: 15
language: "未知"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-02"
pushedAt: "2026-09-01T09:11:08Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# GojiberryAI Sales OS

We open-sourced our entire outbound team.

**A full AI sales department for Grok Bot.**

Each agent gets a job.
Each gets access to the GojiberryAI MCP.
And they work together to find, research, contact, and qualify prospects while you sleep.

## The team

| Agent | Job |
|---|---|
| 🖤 **Head of Sales** | Decides who to target and why |
| 🟢 **Signal Hunter** | Finds prospects showing real buying intent |
| 🟪 **ICP Analyst** | Filters out bad fits before outreach starts |
| 🔷 **Account Researcher** | Researches every company + prospect |
| ⚪️ **Lead Enricher** | Finds emails, phone numbers, and missing data |
| 🔺 **Intent Scorer** | Ranks prospects by likelihood to buy |
| 🔵 **LinkedIn Copywriter** | Writes personalised messages for every lead |
| 🟡 **Outreach Operator** | Launches and manages LinkedIn campaigns |
| 🟥 **Reply Agent** | Reads replies and identifies interested prospects |
| 🟤 **Follow-up Agent** | Makes sure warm opportunities don't disappear |
| 🟩 **Meeting Qualifier** | Qualifies prospects before they reach your calendar |
| 🟣 **Pipeline Analyst** | Tells you which ICPs, signals, and messages actually convert |
| 🔶 **Sales Manager** | Coordinates everything and keeps the pipeline moving |

## How they hand work to each other

```
Signal Hunter finds someone who engaged with a competitor
        ↓
ICP Analyst checks if they're a fit
        ↓
Account Researcher finds the angle
        ↓
Lead Enricher gets their contact data
        ↓
Copywriter creates the message
        ↓
Outreach Operator contacts them
        ↓
Reply Agent handles the response
        ↓
Meeting Qualifier moves them toward a demo
```

All powered by the **GojiberryAI MCP**.

One link. Install it in Grok Bot. Turn Grok into your outbound team.

## Install

**Grok Bot (one command):**

```
/plugin marketplace add romangojiberryAI/gojiberryai-sales-os
/plugin install sales-os@gojiberryai-sales-os
```

Or from the terminal:

```
grok plugin marketplace add romangojiberryAI/gojiberryai-sales-os
grok plugin install sales-os --trust
```

**Claude Code:**

```
/plugin marketplace add romangojiberryAI/gojiberryai-sales-os
/plugin install sales-os@gojiberryai-sales-os
```

**Manual / Cursor / other agents:** copy `skills/sales-os/` into your agent's skills directory and point MCP at `https://mcp.gojiberry.ai/mcp`.

## Connect the GojiberryAI MCP

The plugin ships with the hosted MCP already declared (`.mcp.json`). On first use, Grok (or Claude) will ask you to authenticate.

1. Create a [GojiberryAI](https://gojiberry.ai) account if you don't have one.
2. Add your website so it learns your ICP.
3. Connect the LinkedIn account you want to use for outreach.
4. Approve the MCP connection when Grok prompts you.

If your workspace gives you a **unique MCP URL** (Settings → Connect MCP), paste that instead of the default `https://mcp.gojiberry.ai/mcp`.

No MCP, no live pipeline. The agents will still research and draft, but they cannot read lists, enrich contacts, launch campaigns, or handle replies.

## First five minutes

1. Copy `skills/sales-os/icp-context.template.md` → `icp-context.md` in your project root (or `.grok/` / `.claude/`). Fill it in.
2. Ask: *"Show me my Gojiberry workspace — campaigns, lists, and intent breakdown. Don't change anything."*
3. Then: *"Find 25 people who match my ICP and showed buying intent this week. Show me the list before anyone is contacted."*

Default mode is **propose, don't send**. Nothing goes out on LinkedIn until you say so. Say `autonomous` (and set the score threshold) if you want the team to run while you sleep.

## Slash commands

| Command | What it does |
|---|---|
| `/sales-os:outbound` | Run the full find → score → draft pipeline |
| `/sales-os:find-leads` | Hunt buying-intent prospects |
| `/sales-os:research` | Deep-research a company or list |
| `/sales-os:replies` | Triage Unibox and flag interested prospects |
| `/sales-os:pipeline` | Report what actually converts |

## Design principles

- **Progressive disclosure.** The router loads first. Each task loads only the module it needs.
- **Agent-native.** Multi-step outbound fans out across the 13 specialists when the host supports subagents.
- **MCP is the source of truth.** Contacts, campaigns, lists, intent, and replies come from Gojiberry — never invented.
- **No executable code.** Pure markdown + a hosted MCP URL. Nothing to review before trusting it.
- **Honesty spine.** No fake emails, no fake proof, no silent sends. Gaps are labeled `[NEED: x]`.

MIT.
