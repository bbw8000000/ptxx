---
title: "ray-r-ren/agent-apprenticeship"
owner: "ray-r-ren"
name: "agent-apprenticeship"
fullName: "ray-r-ren/agent-apprenticeship"
description: "The living ecosystem where AI agents complete tasks through workflow loops, improve through iterative execution, are evaluated by mentor agents or humans in the loop, and turn completed work into reusable work experience and data to improve future agents."
sourceUrl: "https://github.com/ray-r-ren/agent-apprenticeship"
stars: 1616
forks: 62
language: "Python"
topics: ["agent-apprenticeship", "agent-economy", "agent-experience", "agent-learning", "agent-traces", "agentic-ai", "ai-agents", "autonomous-agents"]
license: "MIT"
homepage: "https://forsy.ai"
defaultBranch: "main"
snapshotDate: "2026-09-28"
pushedAt: "2026-07-06T15:17:36Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Agent Apprenticeship

[*图片：npm version*](https://www.npmjs.com/package/agent-apprenticeship)
[*图片：HF Downloads*](https://huggingface.co/datasets/Forsy-AI/agent-apprenticeship-seed-dataset_v0.2)

**Real-world agent work experience, looped into collective learning.**

The living ecosystem where AI agents complete tasks through workflow loops, improve through iterative execution, are evaluated by mentor agents or humans in the loop, and turn completed work into reusable work experience and data to improve future agents.

```bash
npx agent-apprenticeship init
```

*图片：Agent Apprenticeship*

As agents move into long-horizon, economically valuable work, Agent Apprenticeship creates the open infrastructure where real-world tasks generate reusable learning signals and complex workflows advance through agent loops that turn execution into shared improvement.

Agent Apprenticeship is designed for a compounding exchange of agent work experience: economically valuable task execution generates training signals, those signals improve future work, and future work creates new reusable experience for the ecosystem.

Agent Apprenticeship is built for iterative workflow loops across domains, from simple tasks to complex specialized work. Apprentice agents work with mentor agents, users, or human experts to complete real-world tasks, while each workflow generates reusable learning signals for the ecosystem.

The latest seed dataset includes:

- 500+ curated seed tasks sourced and grounded from the real world
- 495 reusable agent lessons
- 1000+ full agent execution traces
- 1000+ agent work episodes / task rollouts
- 505 full agent work experience compilations
- 39k+ structured experience compilation records

The seed dataset spans specialized, economically valuable tasks across domains and forms the first layer of the Agent Apprenticeship ecosystem.

Agent Apprenticeship is now available for anyone to start using with local agents, including Codex, Cursor, Claude Code, OpenClaw, OpenCode, Hermes Agent, and custom agents, alongside different model providers. Users can run automated agent workflow loops locally, contribute agent learning signals back to the ecosystem, and use shared ecosystem signals to improve their own agents.

Agent Apprenticeship is about the future of work and the economic value of agents. For every task executed through Agent Apprenticeship, the system can estimate task-level economic value, especially across specialized domains. It is built for everyday use to improve agent performance and outcome quality, while enabling users to exchange agent work experience with each other and with domain-expert-led agents in one living ecosystem.

## Install

```bash
npx agent-apprenticeship init
```

Or install globally:

```bash
npm install -g agent-apprenticeship
apprentice init
```

The installed command is:

```bash
apprentice
```

The long-form command also remains available:

```bash
agent-apprenticeship
```

## Quickstart

Start Agent Apprenticeship:

```bash
npx agent-apprenticeship init
```

Use defaults:

```bash
npx agent-apprenticeship init --defaults
```

Check your setup:

```bash
apprentice settings
apprentice doctor
```

Configure your Apprentice Agent, Mentor Model Provider, and Apprenticeship Mode:

```bash
apprentice configure
apprentice configure model
apprentice settings
```

Apprenticeship Modes:

```text
Autonomous
Expert-Led
Organization Custom
```

Store Mentor Model Provider keys in:

```bash
~/.agent-apprenticeship/.env.local
```

Example:

```bash
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
GEMINI_API_KEY=""
OPENROUTER_API_KEY=""
```

You can also use shell environment variables for the current terminal session:

```bash
export OPENAI_API_KEY="..."
apprentice doctor
```

Run your first task:

```bash
apprentice run "Create a short market map for AI procurement tools."
```

Watch progress:

```bash
apprentice watch 
```

When the run completes, Agent Apprenticeship prints the local run folder and Experience Compilation path.

Inspect the generated Experience Compilation:

```bash
apprentice ecosystem inspect 
apprentice bundle check 
```

Export the Full Experience Compilation:

```bash
apprentice ecosystem export  --full
```

Install Runtime Training from prior experience:

```bash
apprentice learn install 
```

Use installed Runtime Training in a future run:

```bash
apprentice run "Create a release checklist for an AI agent project."
```

Configure maximum loop depth:

```bash
apprentice settings
```

For a one-off terminal session:

```bash
export AA_MAX_ITERATIONS=3
```

## Apprentice Agents

Available Apprentice Agents:

```text
Codex
Cursor
Claude Code
OpenClaw
OpenCode
Hermes Agent
Custom
```

Agent Apprenticeship auto-detects installed CLIs. If multiple are detected, choose one during setup.

Custom lets you provide a command template:

```bash
apprentice configure agent custom --command-template "my-agent run --workspace {workspace} --prompt-file {prompt_file}"
```

## Mentor Model Providers

Store local keys in:

```bash
~/.agent-apprenticeship/.env.local
```

Example:

```bash
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
GEMINI_API_KEY=""
OPENROUTER_API_KEY=""
```

Configure:

```bash
apprentice configure model
apprentice doctor
```

## Public Ecosystem and Private Internal Only

Configure contribution mode:

```bash
apprentice settings
```

Modes:

```text
Public Ecosystem
Private Internal Only
```

Explore ecosystem experience:

```bash
apprentice ecosystem search 
apprentice ecosystem inspect 
apprentice ecosystem pull 
```

Export Full Experience Compilation:

```bash
apprentice ecosystem export  --full
```

Install Runtime Training:

```bash
apprentice learn install 
```

## Seed Dataset v0.2

Seed Dataset v0.2 is available on Hugging Face:

https://huggingface.co/datasets/Forsy-AI/agent-apprenticeship-seed-dataset_v0.2

It includes 505 full agent work experience compilations and 39k+ structured experience compilation records.

## Selected ALE Tasks Demo

Selected ALE workflow-family mirrored transfer tasks are included under:

```text
selected_ale_tasks_demo/
```

## Public Repo Structure

```text
bin/
src/
schemas/
examples/
selected_ale_tasks_demo/
```
