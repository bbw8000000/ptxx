---
title: "xt4d/GameBlocks"
owner: "xt4d"
name: "GameBlocks"
fullName: "xt4d/GameBlocks"
description: "Concise, self-explanatory building blocks for AI coding agents to prototype browser-based 3D games."
sourceUrl: "https://github.com/xt4d/GameBlocks"
stars: 420
forks: 35
language: "JavaScript"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-07-10T14:17:24Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

*图片：GameBlocks preview*

## 📖 Introduction

### What Is GameBlocks

GameBlocks helps coding agents build browser-based 3D game prototypes.

GameBlocks provides **building-block code**: concise and self-explanatory modules designed for agents to compose, adapt, and generalize from while implementing fragile 3D game systems such as coordinate frames, actor motion, and world structure.

### Why GameBlocks

Natural language is a weak interface for precise 3D behavior. Prompts and agent reasoning must compress spatial transformations into language tokens. Small ambiguities can cause inverted directions, unstable motion, or gameplay state that no longer matches what appears on screen.

GameBlocks reduces that difficulty by turning fragile 3D and gameplay patterns into inspectable implementations with clear semantics. Instead of deriving 3D behavior from scratch, agents can generalize from GameBlocks to build spatially accurate 3D games.

### For Stateful Generative Worlds

GameBlocks focuses on the stateful layer of a world rather than visual aesthetics. The vision is that [world-rendering models](https://www.worldlabs.ai/blog/taxonomy-of-world-models) will increasingly lift the burden of visual generation.

In that future, GameBlocks provides the structured interactive state that those models can render from, update, and keep consistent as agents and players act inside the world.

References: [Moonlake](https://moonlakeai.com/blog/why-world-models-need-structure-not-just-scale), [Game Cartridges](https://x.com/AlbyHojel/status/2057193508822536459), [Project Eden](https://www.tripo3d.ai/research/project-eden).


## 🤖 Use in Agents

GameBlocks can be used as a local skill so a coding agent can discover it when a task involves browser-based 3D game development.

### Codex

1. Clone the repository locally.

2. Run this command from the repository root (to copy `gameblocks` to the skills folder):
```bash
mkdir -p ~/.codex/skills/gameblocks && cp -R gameblocks/. ~/.codex/skills/gameblocks/
```
3. Restart the Codex app (optional).

4. In the Codex chatbox, invoke the skill by typing `/gameblocks` or `$gameblocks`, or let it load automatically when the task matches the skill description.

### Claude Code

1. Clone the repository locally.

2. Run this command from the repository root (to copy `gameblocks` to the skills folder):
```bash
mkdir -p ~/.claude/skills/gameblocks && cp -R gameblocks/. ~/.claude/skills/gameblocks/
```
3. Restart the Claude app (optional).

4. In the Claude Code chatbox, invoke the skill by typing `/gameblocks`, or let it load automatically when the task matches the skill description.

## 🎬 Demo

### Playable Games

| Preview | Title | Link |
| --- | --- | --- |
|  | **Archery Hunting** | [https://gb-archery-hunting.vercel.app/](https://gb-archery-hunting.vercel.app/) |
|  | **Jet Dogfight** | [https://gb-jet-dogfight.vercel.app/](https://gb-jet-dogfight.vercel.app/) |
|  | **Desert Shooter** | [https://gb-desert-shooter.vercel.app/](https://gb-desert-shooter.vercel.app/) |
|  | **Marble Puzzle** | [https://gb-marble-puzzle.vercel.app/](https://gb-marble-puzzle.vercel.app/) |
|  | **Pirate Seas** | [https://gb-pirate-seas.vercel.app/](https://gb-pirate-seas.vercel.app/) |
|  | **Snake Clash** | [https://gb-snake-clash.vercel.app/](https://gb-snake-clash.vercel.app/) |
|  | **Space Shooter** | [https://gb-space-shooter.vercel.app/](https://gb-space-shooter.vercel.app/) |
|  | **Submarine Exploration** | [https://gb-submarine-exploration.vercel.app/](https://gb-submarine-exploration.vercel.app/) |
|  | **Endless Runner** | [https://gb-endless-runner.vercel.app/](https://gb-endless-runner.vercel.app/) |
|  | **Voxel Survival** | [https://gb-voxel-survival.vercel.app/](https://gb-voxel-survival.vercel.app/) |
|  | **Robotic Arm** | [https://gb-robotic-arm.vercel.app/](https://gb-robotic-arm.vercel.app/) |
|  | **Castle Defense** | [https://gb-castle-defense.vercel.app/](https://gb-castle-defense.vercel.app/) |
|  | **Tower Defense** | [https://gb-tower-defense.vercel.app/](https://gb-tower-defense.vercel.app/) |
|  | **Mech Arena** | [https://gb-mech-arena.vercel.app/](https://gb-mech-arena.vercel.app/) |
|  | **Drone Delivery** | [https://gb-drone-delivery.vercel.app/](https://gb-drone-delivery.vercel.app/) |
|  | **Moon Racing** | [https://gb-moon-racing.vercel.app/](https://gb-moon-racing.vercel.app/) |

### Gameplay Video

https://github.com/user-attachments/assets/98d22d80-06b6-49ac-8b33-2215ccb42222


## 📜 License

GameBlocks is released under the MIT License.
