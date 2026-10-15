---
title: "RongleCat/grok-app"
owner: "RongleCat"
name: "grok-app"
fullName: "RongleCat/grok-app"
description: "Desktop workbench for Grok Build CLI — sessions, projects, media, automations (Tauri 2 · unofficial)"
sourceUrl: "https://github.com/RongleCat/grok-app"
stars: 262
forks: 26
language: "TypeScript"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-07-26"
pushedAt: "2026-07-25T16:05:06Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

Grok App

Desktop workbench for local Grok Build
Sessions, projects, media, automations — for the real grok CLI


  English ·
  中文


  
  
  
  
  


  
  


  Follow the author
  X / Twitter → 铁柱AGI @cgnot996
  WeChat Official Account: search 「铁柱AGI」 (scan or WeChat Search below)


  


  Repo ·
  RongleCat/grok-app


---

> [!NOTE]
> ## Note
>
> **Grok App is not an official xAI product.** It wraps the local [Grok Build](https://x.ai) CLI (`grok agent stdio`) into a desktop workbench: sessions, projects, permissions, media previews, and scheduled tasks.
>
> Real agent power needs a working **Grok Build CLI** installed and signed in. Without CLI you can install from the first-run wizard, or use `GROK_APP_ACP=mock` for UI-only development.

---

## Contents

1. Overview
2. Features
3. Screenshots
4. Install & first run
5. macOS “damaged” / Gatekeeper
6. Config paths
7. Develop & build
8. Docs & contributing
9. Contributors
10. Follow the author

---

## Overview

The `grok` CLI is powerful in a terminal. Day-to-day work still needs multi-project sessions, a permission bar, rich previews, scheduled jobs, and bilingual UI.

**Grok App** is that workbench:

1. Install the app and prepare Grok Build CLI  
2. Add a project / new session  
3. Connect the agent; chat under Ask or YOLO  
4. Preview artifacts, schedule automations, manage account & relays in Settings  

**Stack:** Tauri 2 + Rust · React + TypeScript + Vite · Tailwind CSS

---

## Features

| Area | What you get |
|------|----------------|
| **Real Build sessions** | Default `grok agent stdio` (ACP); host-owned session FSM; optional remote ACP |
| **Projects & sessions** | Trusted dirs, virtualized sidebar, archive / orphan, fork & rewind; **import CLI sessions** in shared mode |
| **Multi-session stream** | Keep busy turns streaming after switching chats; process limits & idle recycle |
| **Git worktrees** | Project chip lists linked worktrees; switch cwd in one click (hidden for non-git) |
| **Permissions** | Default Ask; allow once / session / deny; YOLO; **per-project** permission tier |
| **Plan / Goal** | Sticky execution progress; resource-pane Markdown review + steps; Goal entry |
| **Slash · Extensions** | Slash palette, Skills; Settings → Extensions for MCP / Plugins |
| **Composer** | Follow-up send queue while busy; paste screenshots; context usage chip |
| **Media & files** | Image / video / PDF / Office / code preview; **edit & save** text in Resources; Changes (session diffs + workspace git) |
| **Agent runtime** | Stall cancel; structured error deck; **diagnostic zip** export; no early “ready” while tools/permissions open |
| **Automations** | Scheduled list; natural-language create-from-chat (silent fence, no JSON in UI) |
| **Account & quota** | Multi-account switcher, official login, SuperGrok quota + heatmap, custom-provider local usage |
| **Custom relays** | Independent `GROK_HOME` agent profile (keeps `~/.grok` clean when desired) |
| **Security** | Optional OS keychain for API keys (default `secrets.json` 0600); store write locks; in-app confirms only |
| **i18n** | Simplified Chinese / Traditional Chinese / English + tray |
| **Packaging** | macOS ARM / Intel · Windows x64 (setup + portable) · Linux x64 (AppImage / deb / rpm) |

---

## Screenshots

> From the current macOS development build.

| Workbench · SuperGrok | Account & quota |
|:---:|:---:|
| *图片：Workbench* | *图片：Account* |

| Light theme | Session & media |
|:---:|:---:|
| *图片：Light* | *图片：Chat* |

---

## Install & first run

### 1. Download

Get installers from Releases:

| Platform | Artifact |
|----------|----------|
| macOS Apple Silicon | `Grok_*_aarch64.dmg` |
| macOS Intel | `Grok_*_x64.dmg` |
| Windows x64 | `*-setup.exe` installer + `*-portable.zip` |
| Linux x64 | AppImage / `.deb` / `.rpm` |

The bundle product name is **Grok** (matches the window title).

**Arch / Manjaro / EndeavourOS:** prefer the **AppImage** (`chmod +x` then run). Official CI does not publish a separate AUR package; AppImage is distro-agnostic.

### 2. First run

1. Launch → **Setup wizard** ensures CLI is installed (multi-mirror install supported)  
2. (Optional) Official login / API key / custom relay — skippable  
3. **Add project** → trust a folder  
4. **Connect agent** → chat when Ready  
5. Permission bar defaults to **Ask**; use YOLO only when you want unattended runs  

### 3. Requirements

- Local **Grok Build CLI** (`grok`), often `~/.grok/bin/grok` or on `PATH`  
- Windows: `%USERPROFILE%\.grok\bin\grok.exe` or `PATH`  

---

## macOS “damaged” / Gatekeeper

Release builds are **not Apple-notarized** (paid Developer ID required). Gatekeeper may block downloads — that is expected.

**Recommended:**

```bash
xattr -cr /Applications/Grok.app
open /Applications/Grok.app
```

**Also works:**

- Finder: **right-click** → **Open** → confirm  
- **System Settings → Privacy & Security** → **Open Anyway**  

Only download from this repo’s official Releases.

---

## Config paths

Default data root (override with **`GROK_APP_HOME`**):

| Platform | Typical path |
|----------|----------------|
| macOS | `~/Library/Application Support/com.grokapp.grok-app/` |
| Windows | `%APPDATA%\grokapp\grok-app\` |
| Fallback | `~/.grok-app/` |

```text
/
  projects.json
  sessions_index.json
  settings.json
  secrets.json          # metadata (+ API-key fallback); keys prefer OS keychain
  automations.json
  projects/
  sessions/
  logs/
  agent-home/           # independent-mode GROK_HOME
```

API keys prefer the OS secret store (macOS Keychain / Windows Credential Manager /
Linux Secret Service) with a `secrets.json` (mode `0600`) fallback when the OS store
is unavailable. Do not commit secrets.

Grok Build’s own config remains under **`~/.grok`** (CLI login, `auth.json`, …).  
**shared** session mode can use `~/.grok`; **independent** mode uses `agent-home/`.

---

## Develop & build

```bash
# Needs: Node 22+, pnpm 9, Rust stable, Xcode CLT (macOS)
pnpm install

pnpm dev                 # full app (real CLI by default)
pnpm dev:ui              # frontend only
GROK_APP_ACP=mock pnpm dev

pnpm typecheck && pnpm test
cd src-tauri && cargo test

pnpm build
```

Cross-compile and release notes: docs/BUILD.md.

Release (write the matching `CHANGELOG.md` section first):

```bash
./scripts/release-tag.sh 0.1.1
./scripts/release-tag.sh 0.1.1 --push
```

---

## Docs & contributing

| Audience | Link |
|----------|------|
| AI agents / product rules | `docs/llm-wiki/` |
| Build & release | docs/BUILD.md |
| Changelog | CHANGELOG.md |
| Contributing | CONTRIBUTING.md |
| Code of conduct | CODE_OF_CONDUCT.md |
| Security | SECURITY.md |

Issues and PRs are welcome.

## Contributors

Thanks to everyone who has contributed to Grok App. Data from the GitHub Contributors API (fetched 2026-07-24).


  
  &nbsp;&nbsp;
  
  &nbsp;&nbsp;
  
  &nbsp;&nbsp;
  
  &nbsp;&nbsp;
  
  &nbsp;&nbsp;
  
  &nbsp;&nbsp;
  


| | Contributor | Commits | Highlights (selected) |
|:---:|:---|:---:|:---|
|  | **RongleCat** · maintainer | 59 | Product architecture, releases, community integration |
|  | **sonnemusk** | 21 | Changes / fork & rewind, MCP·Plugins, permission tiers, worktrees, resource edit, paste screenshots, error deck, multi-session stream, CLI session import, turn-complete, store locks, and more |
|  | **Sdefendre**Steve Defendre | 2 | Session titles follow locale; Grok Build permission optionIds |
|  | **jason920612** | 2 | Remote ACP (API mode); Traditional Chinese locale |
|  | **shiaho777**shiaho | 2 | Cancelable login; stop re-streaming history on session switch |
|  | **2530185073**Yun | 1 | Custom provider account + local usage UI |
|  | **tisrop**wanghang | — | Composer follow-up send queue while agent is busy |

Full contributors graph →

*图片：Contributors*

## License

MIT © RongleCat

---

## Follow the author

Updates, walkthroughs, and AI practice content land first on:

| Channel | Link |
|---------|------|
| **X / Twitter** | [铁柱AGI @cgnot996](https://x.com/cgnot996) ← highly recommended |
| **WeChat Official Account** | Search **「铁柱AGI」**, or scan / use the card below |


  


  If Grok App helps you, please star the repo and follow
  @cgnot996 on X
  and the WeChat account 铁柱AGI 🙏
