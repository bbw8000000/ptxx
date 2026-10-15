---
title: "cozyblaze/portal-agent"
owner: "cozyblaze"
name: "portal-agent"
fullName: "cozyblaze/portal-agent"
description: "The setup I used for my GPT-6 Astra Portal run: controller, SourcePauseTool patch, setup guide, and sanitized session log."
sourceUrl: "https://github.com/cozyblaze/portal-agent"
stars: 43
forks: 3
language: "JavaScript"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-08"
pushedAt: "2026-09-07T05:05:11Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Portal agent

This is the setup I used for my **GPT-6 Astra Portal run**, which reached the end credits on September 5, 2026 (San Francisco time, PDT / UTC−7).

**Portal pauses while the agent thinks.** The agent sees screenshots, player position, and camera angles, chooses its next inputs, then lets the game advance and checks the result.

```mermaid
flowchart LR
    A[Codex / GPT-6 Astra] -->|JavaScript plan| B[Local MCP server]
    B -->|TCP on 127.0.0.1:27182| C[Custom SourcePauseTool]
    C -->|Play N ticks, then pause| D[Portal]
    D -->|Screenshot + position + facing| C
    C --> B
    B --> A
```

The run used `gpt-6-astra` with `max` reasoning effort and took about **23 hours 43 minutes**, including capacity interruptions and waiting. I resumed it after capacity errors and switched to Fast mode. The agent handled gameplay throughout; after the initial goal, my only additional instruction was to leave the credits rolling.

## Explore or try it

- **How it works** — what the agent saw and controlled.
- **Run it yourself** — the tested Windows setup.
- **Read the session log** — the agent's messages, actions, and results.

The controller and SourcePauseTool changes here are the versions used during the run. Game files are not included; you'll need your own copy of Portal.


Source files and technical reference

| Folder | Contents |
| --- | --- |
| `controller/` | Game controller, API reference, and tests |
| `run/` | Agent instructions and configuration template |
| `game-config/` | Game settings and the SPT loader file |
| `spt/` | SourcePauseTool changes and version details |
| `evidence/` | Sanitized session log and summary |
| `tools/` | Setup and export helpers |


## Credits and privacy

Controller code uses MIT; SourcePauseTool retains its upstream license and credits. Portal belongs to Valve. Documentation and session evidence have no additional license grant.

Personal information and embedded screenshots were removed from the shared log. See privacy notes.
