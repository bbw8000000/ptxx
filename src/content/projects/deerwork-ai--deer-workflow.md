---
title: "deerwork-ai/deer-workflow"
owner: "deerwork-ai"
name: "deer-workflow"
fullName: "deerwork-ai/deer-workflow"
description: "An open-source graph engineering runtime that keeps orchestration in TypeScript and delegates semantic work to replaceable Agent runtimes."
sourceUrl: "https://github.com/deerwork-ai/deer-workflow"
stars: 261
forks: 20
language: "TypeScript"
topics: ["agent", "ai", "ai-agent", "ai-agents", "ai-coding", "bun", "dynamic-workflow", "dynamic-workflows"]
license: "MIT"
homepage: "https://deerwork-ai.github.io/deer-workflow/"
defaultBranch: "main"
snapshotDate: "2026-07-28"
pushedAt: "2026-07-27T15:34:26Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

English | 简体中文

# deer-workflow

*图片：License: MIT*
[*图片：npm*](https://www.npmjs.com/package/@deerwork-ai/deer-workflow)
[*图片：Bun*](https://bun.sh)
[*图片：TypeScript*](https://www.typescriptlang.org)
*图片：Codex CLI*
*图片：DeerFlow Stars*
*图片：GitHub Stars*

An open-source Dynamic Workflow runtime for building observable, reusable Agent
graphs.

`deer-workflow` is a pilot project for **DeerFlow 3.0**, also known as **DeerWork**.

## Index

- Why Deer Workflow
- How to use
  - Quick Start
  - Examples
  - Documentation
- How to develop
  - Set up
  - Validate changes
  - Contribute
  - License

# Why Deer Workflow

Deer Workflow is a code-first implementation of **[Graph Engineering](https://www.aibuilderclub.com/blog/graph-engineering-guide-2026)**: TypeScript defines the valid execution paths, while Coding Agents perform the semantic work inside each node.

- **Code is the plan.** Control flow, phases, inputs, and failure handling live
  in reviewable TypeScript rather than an opaque Agent conversation.
- **Agents are replaceable.** Codex is the default runtime, Claude Code is
  built in, and the public Agent interface remains vendor-neutral.
- **Execution is observable.** Interactive runs provide a phase-aware TUI;
  automation can consume a stable JSONL event stream.

# How to use

## Quick Start

Install [Bun](https://bun.sh) and sign in to
Codex CLI, then install the released CLI:

```bash
bun install --global @deerwork-ai/deer-workflow
```

Describe the orchestration you want. Deer Workflow asks Codex to apply the
bundled `workflow-creator` Skill and writes a
runnable TypeScript module:

```bash
deer-workflow create \
  "Create a Workflow that accepts a topics string array, researches each topic in parallel, and synthesizes a report" \
  > workflow.ts
```

Run the generated Workflow with its example input:

```bash
deer-workflow run ./workflow.ts \
  --input '{"topics":["Agent Skills","Dynamic Workflows"]}'
```

Interactive terminals show phases and Markdown logs in a live TUI. For
servers, CI, and process pipelines, add `--print` or `-p` to stream one JSON
event per stdout line.

Want to understand or edit the generated module? Continue with the
Getting Started guide.

## Examples

- Deep Research discovers research
  angles, investigates them in parallel, verifies claims, and produces an
  interactive HTML report.
- Blog Writer plans an article, drafts its
  sections through a pipeline, reviews them, and returns structured output.

These examples live in the repository. Clone or download it before running
their documented commands.

## Documentation

- Getting Started — learn the execution model and build a
  Workflow step by step.
- API Reference — inspect exact functions, types, events, and
  runtime behavior.
- Workflow Creator Skill — see the
  instructions used to generate Workflow modules.
- 简体中文文档

# How to develop

## Set up

Clone the repository and install local dependencies and Git hooks:

```bash
git clone https://github.com/deerwork-ai/deer-workflow.git
cd deer-workflow
bun install
```

Run the CLI directly from source:

```bash
bun run dev -- --help
```

## Validate changes

Run the complete quality gate before submitting changes:

```bash
bun run check
```

## Contribute

Codex CLI is the default Agent runtime, not an architectural dependency.
`ClaudeAgent` ships as another built-in harness; integrations for other Coding
Agents are welcome.

See the Getting Started guide for the
full command reference.

## License

This project is licensed under the MIT License.
