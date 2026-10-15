---
title: "Kritt-ai/open-kritt"
owner: "Kritt-ai"
name: "open-kritt"
fullName: "Kritt-ai/open-kritt"
description: "Orchestrate AI agents to find real vulnerabilities in code."
sourceUrl: "https://github.com/Kritt-ai/open-kritt"
stars: 63
forks: 17
language: "JavaScript"
topics: ["agent", "agents", "ai", "bug-bounty", "bugbounty", "bugbounty-tools", "security", "security-research"]
license: "AGPL-3.0"
homepage: "https://kritt.ai/"
defaultBranch: "main"
snapshotDate: "2026-07-21"
pushedAt: "2026-07-20T20:53:15Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# open·kritt

**Orchestrate AI agents to find real vulnerabilities in code.**

An open-source, self-hosted security research platform that turns focused AI analysis
into de-duplicated, ranked findings with configurable validation and enrichment.

*图片：License: AGPL-3.0*
*图片：Release*

[Website](https://kritt.ai) ·
[Documentation](https://docs.kritt.ai) ·
[Getting started](https://docs.kritt.ai/getting-started/installation-and-setup) ·
Contributing ·
[Research paper](https://kritt.ai/open-kritt-launch) ·
[Discord community](https://t.co/WzXMUKWxcR) ·
[Twitter](https://x.com/Kritt_AI)


*图片：open·kritt workflow builder*

## What is open·kritt?

Pointing a model at an entire repository and asking it to find vulnerabilities rarely
works well. open·kritt takes a focused approach: break the research into small,
well-defined tasks, run them across AI agents in parallel, and combine their output into
findings you can validate and prioritize.

It is built for security researchers and security-minded developers who want control
over their prompts, workflows, model providers, and infrastructure.

### What it does

- **Build workflows** — chain focused prompts into reusable security research playbooks.
- **Run scans** — analyze remote or local repositories and their dependencies with Codex
  or Claude Code.
- **Verify findings** — use post-scripts to validate issues, build proofs of concept, and
  produce reports.
- **Prioritize results** — apply custom severity rankers, a consistent finding schema,
  and automatic de-duplication.
- **Bring your own model access** — use a Codex login or connect through OpenAI,
  Anthropic, or OpenRouter.

> **Built from real security research.** The Kritt team has earned over **$1,500,000 in
> bug-bounty payouts** under the researcher name **Blockian**
> ([Immunefi](https://immunefi.com/profile/Blockian/) ·
> [HackenProof](https://hackenproof.com/hackers/Blockian) ·
> [blockian.xyz](https://blockian.xyz) · [@ControlZ_1337](https://x.com/ControlZ_1337)).
> open·kritt is the open-source distillation of the internal project behind that work.

## Getting started

You need Git, Docker with Docker Compose, and Node.js 20 or newer. The repository-local
CLI has no install step.

```bash
git clone https://github.com/Kritt-ai/open-kritt
cd open-kritt
./kritt setup
./kritt start
```

Open http://localhost:5173 once the stack is running. You only
need one model-access option; `./kritt setup` guides you through the available logins and
API keys. A `GITHUB_TOKEN` is optional and only needed for private GitHub repositories.

The default ports bind to `127.0.0.1`, and the backend does not include application
authentication. Keep the stack private.

Tool-enabled agents run as root inside disposable job containers, with writable repository
copies and direct internet access so they can install tools, compile targets, run tests,
and build proofs of concept. Run open·kritt on a dedicated Docker host or VM; see the
threat model before scanning untrusted code.

For prerequisites, manual Docker setup, and provider-specific instructions, read the
installation guide and
AI provider setup.

## Documentation

Preview the documentation locally with Mint:

```bash
npm install -g mint
cd docs-site
npm run dev
```

Open http://localhost:3001 to view the site.

- Product overview
- Run your first scan
- Workflows and prompt steps
- Security and threat model

## Community and contributing

Questions and ideas belong in GitHub Discussions.
Use GitHub Issues for bugs and feature
requests.

Contributions are welcome. Read CONTRIBUTING.md for the development
setup, test commands, Conventional Commits, and DCO sign-off requirements.

Please report security vulnerabilities privately by following SECURITY.md, not through a public issue.

## License

open·kritt is licensed under the GNU Affero General Public License v3.0.
