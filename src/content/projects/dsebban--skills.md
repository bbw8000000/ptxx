---
title: "dsebban/skills"
owner: "dsebban"
name: "skills"
fullName: "dsebban/skills"
description: "OMP-native pstack and orchestration skills for multi-agent coding workflows"
sourceUrl: "https://github.com/dsebban/skills"
stars: 31
forks: 1
language: "TypeScript"
topics: ["agent-skills", "multi-agent", "omp", "pstack"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-08-19"
pushedAt: "2026-08-18T08:56:03Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# OMP skills

OMP-native orchestration and pstack adapters for the [`omp`](https://omp.sh/) coding agent.

## Included skills

| Skill | Purpose |
|---|---|
| `poteto-mode` | Routes substantial work to the matching pstack playbook. This OMP port uses stable `skill://poteto-mode/...` links. |
| `pstack-omp` | Maps pstack roles and lifecycle protocols to OMP task agents, batches, IRC, and result resources. |
| `orchestrate-omp` | Coordinates parallel scouts, scoped workers, specialist reviews, and root-owned verification. |

The repository also includes optional `poteto-agent` and `comment-sicko` definitions under `agents/`.

## Requirements

- OMP 17.3.5 or newer.
- OMP skill discovery from `~/.agents/skills` enabled.
- The pstack workflow and principle skills referenced by the selected `poteto-mode` playbook. This repository contains the OMP router and adapter, not the complete upstream pstack catalog.

## Install the skills

Install all three skills globally with the [`skills`](https://skills.sh/) CLI:

```bash
npx skills add dsebban/skills \
  --skill poteto-mode pstack-omp orchestrate-omp \
  --global --yes
```

Allow OMP to discover shared agent skills in `~/.omp/agent/config.yml`:

```yaml
skills:
  enableAgentsUser: true
  includeSkills:
    - poteto-mode
    - pstack-omp
    - orchestrate-omp
```

Start a new OMP process after changing the allowlist. Existing sessions retain their previous skill inventory.

## Install the optional agents

Clone this repository, then place the agent definitions in OMP's user agent directory:

```bash
git clone https://github.com/dsebban/skills.git
cd skills
mkdir -p ~/.omp/agent/agents
cp agents/poteto-agent.md ~/.omp/agent/agents/
cp agents/comment-sicko.md ~/.omp/agent/agents/
```

The standard `pstack-omp` role map does not require these agents. They support imported workflows that call the compatibility names directly.

## Use the skills

OMP resolves the skills by these exact names:

```text
skill://poteto-mode
skill://pstack-omp
skill://orchestrate-omp
```

Nested pstack files use the owning skill URI:

```text
skill://poteto-mode/playbooks/babysit.md
skill://poteto-mode/references/plan.md
```

Do not use `skill://playbooks/...` or the display label `Poteto Mode`. OMP resolves skill names exactly and case-sensitively.

## OMP task behavior

- Use the exact agent names in the live `task` inventory.
- Omit `agent` to select OMP's default worker.
- Use `tasks[]`, `context`, `effort`, and `isolated` only when the live task schema exposes them.
- Treat child sessions as fresh context. Put the goal, constraints, ownership, acceptance criteria, and leaf-agent boundary in every assignment.
- Read complete results from `agent://` and transcripts from `history://` when needed.
- Keep user interaction, approvals, integration, and final verification with the root coordinator.

## Provenance

- `poteto-mode` is adapted from Lauren Tan's `pstack`, version 0.14.1.
- `orchestrate-omp` is adapted from Eric Provencher's `orchestrate` skill.
- `pstack-omp` and the OMP-specific integration are maintained in this repository.

See `THIRD_PARTY_NOTICES.md` for upstream copyright notices.

## License

MIT. See `LICENSE`.
