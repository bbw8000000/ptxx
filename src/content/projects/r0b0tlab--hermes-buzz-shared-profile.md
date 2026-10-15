---
title: "r0b0tlab/hermes-buzz-shared-profile"
owner: "r0b0tlab"
name: "hermes-buzz-shared-profile"
fullName: "r0b0tlab/hermes-buzz-shared-profile"
description: "macOS Hermes skill for sharing one canonical writable profile across Buzz and ACP surfaces"
sourceUrl: "https://github.com/r0b0tlab/hermes-buzz-shared-profile"
stars: 30
forks: 1
language: "Python"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-07-31"
pushedAt: "2026-07-30T16:55:04Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Hermes Buzz Shared Profile

Add a Hermes profile to Buzz Desktop as a native managed agent. The agent appears alongside builtins like Bumble and Fizz in the Buzz agents panel.

## Why

Buzz agents run an ACP child process. Hermes already speaks ACP via `hermes -p  acp`. This skill writes the agent entry directly into Buzz's `managed-agents.json`, so no custom harness JSON or manual configuration is needed.

## Compatibility

- macOS, Linux, and Windows 10/11.
- Python 3.11 or newer; runtime code uses only the standard library.
- Buzz Desktop installed and launched at least once.

## Install

```bash
hermes skills inspect amanning3390/hermes-buzz-shared-profile/hermes-buzz-shared-profile
hermes skills install amanning3390/hermes-buzz-shared-profile/hermes-buzz-shared-profile
```

## Quick start

```bash
# Create a profile (if you don't have one)
hermes profile create hermes-buzz --description "Shared profile for Buzz"

# Add it to Buzz Desktop
python3 hermes-buzz-shared-profile/scripts/shared_profile.py buzz-add --profile hermes-buzz

# Restart Buzz Desktop — the agent appears in the agents panel
```

## Commands

| Goal | Command |
|---|---|
| Add or update a Hermes agent | `buzz-add --profile ` |
| Add with custom name | `buzz-add --profile  --name "My Agent"` |
| Remove from Buzz | `buzz-remove --profile ` |
| List Hermes agents in Buzz | `buzz-list` |

## Verification

```bash
python3 -m pytest tests/skills/test_hermes_buzz_shared_profile_skill.py -q
python3 -m py_compile hermes-buzz-shared-profile/scripts/shared_profile.py
```

## Security

Do not open public issues containing credentials, profile archives, or `state.db`. Use GitHub private Security Advisories as described in `SECURITY.md`.

## License

MIT
