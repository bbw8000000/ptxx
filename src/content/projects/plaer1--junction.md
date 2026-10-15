---
title: "Plaer1/junction"
owner: "Plaer1"
name: "junction"
fullName: "Plaer1/junction"
description: "VS Code chat sidebar for local AI coding agents"
sourceUrl: "https://github.com/Plaer1/junction"
stars: 582
forks: 9
language: "TypeScript"
topics: []
license: "MIT"
defaultBranch: "krug-model-picker-modular"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-29T03:47:59Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Junction

A VS Code chat sidebar that connects your editor to local AI coding agents.

`7 backends` · `Chat sidebar` · `Workspace context` · `Animated splash` · `MIT License`

*图片：Two familiar themes*

Junction is a chat panel for VS Code that connects to local AI coding agents running on your machine.
It speaks to multiple agent backends through one unified interface — switch between them without changing your workflow.

## Supported Backends

Junction connects to any of these local agent runtimes:

- **OpenClaw** — WebSocket gateway integration with session and model management
- **Hermes** — native dashboard WebSocket and REST API support
- **Souveraine** — HTTP server integration with managed runtime spawning
- **MiMoCode** — auto-spawned or pre-configured MiMo server connection
- **Goose** — data directory and secret key configuration
- **OpenCode** — binary path and config home settings
- **OpenHands** — server launcher and home directory configuration

## Features

### Chat Sidebar
Talk to your active agent from VS Code's secondary sidebar. Open via Command Palette: `Junction: Open Sidebar`.

### Workspace Context
Drag and drop files into the chat input, or right-click a file or selection to add it to the current thread.

### Model & Reasoning Picker
Select a model and set reasoning effort per session from the sidebar header.

### Markdown Rendering
Assistant responses, tool call cards, reasoning blocks, and diffs render inline with syntax highlighting.

### Chat Layouts
Switch between compact mode (activity folded into accordions) and timeline mode (chronological reasoning flow with sticky user prompts).

### Follow-Up Modes
Queue messages for when the agent finishes, steer mid-turn, or interrupt and redirect. Configurable globally or per-bridge.

### Auto-Reconnection
Junction reconnects to the runtime automatically if the connection drops. No manual restart needed.

## Themes

Junction includes two built-in layouts. **Compact** mode folds activity into summary accordions for a dense view.
**Timeline** mode shows a chronological activity rail with dot indicators, reasoning disclosure, and an orange accent theme.
Both layouts adapt to your VS Code color theme.

## Splash Screen & Animations

Junction opens with an animated splash screen featuring a matrix-style rain effect behind the wordmark.
The splash screen is fully customizable through the in-editor animation settings panel.

### Character Sets
The rain effect supports 10 character sets: Katakana, Matrix Latin, Latin, Hiragana, CJK, Hangul, Emoji, Binary, Symbols, and Custom.
Mix in emoji drops at configurable rarity, or supply your own character set.

### Rain Controls
- **Direction** — toggle rain falling up or down
- **Reverse chance** — set a percentage for drops to go the opposite direction
- **Bounce sides** — rain bounces off left/right edges instead of falling off screen
- **Gravity, bounce, collision, speed** — adjust how the drops move and interact with the wordmark
- **Quantity, size variance, color variance, opacity range** — control the density and look of the rain
- **Custom color** — pick a color and alpha for the rain and wordmark
- **Emoji mixing** — toggle on and set rarity as 1/N (1 = all emoji, 1000000 = one in a million)

### Exit Animations
When the splash dismisses, the wordmark exits through one of 9 animation modes.
Each mode has its own set of control sliders that swap in when you select it from the dropdown.

- **Spiral out** — letters spiral outward from the center
- **Spiral in** — letters converge into a tightening spiral with configurable radius and length
- **Explode** — letters burst outward with gravity
- **Explode 2** — physics-based explosion with bouncing off edges, configurable force, chaos, and per-axis momentum
- **Float away** — letters drift upward with direction-based tilt
- **Horizontal flatten** — letters spread horizontally and crush to a 1px line with configurable hold time
- **Explode weak** — a softer explosion with less force
- **Starwars crawl** — letters converge to a vanishing point with configurable target Y position
- **Explode 3** — the wordmark shatters into individual pixels with per-axis momentum control
- **Rain push** — letters detach and the rain physically pushes them off screen
- **Random** — picks a different mode each time

### Animation Settings Panel
Open the animation settings from the chat header gear icon. It has three tabs — Chat, Bobber, and Splash.
The Splash tab contains two collapsible accordions (Appearance and Motion), the exit mode dropdown with per-mode sliders, and a live preview canvas you can click to test animations.
The panel is fully draggable and resizable with no height limit.

## Installation

### From source
```bash
npm install
./compile-and-install.sh
# Then: Ctrl+Shift+P → Developer: Reload Window
```

### Requirements
- VS Code 1.120.0 or higher
- A local agent runtime running (e.g. OpenClaw Gateway, Hermes dashboard, Souveraine server)

---

## Credits

Based on openclaw_vscode by Owen-Liuyuxuan (MIT).
The WebSocket/gateway plumbing traces back to that project.
The multi-bridge architecture, modular webview UI, animation engine, and model/session managers are original to Junction.

---

MIT License. © Owen-Liuyuxuan (original openclaw_vscode), © Plaer1 (Junction).
github.com/Plaer1/junction
