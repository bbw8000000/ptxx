---
title: "Cosmicchibattle/zeroclaw-ui"
owner: "Cosmicchibattle"
name: "zeroclaw-ui"
fullName: "Cosmicchibattle/zeroclaw-ui"
description: "UI for Zeroclaw setup"
sourceUrl: "https://github.com/Cosmicchibattle/zeroclaw-ui"
stars: 201
forks: 20
language: "TypeScript"
topics: ["agentic-ai", "agentic-workflow", "agentic-workflows", "agentic-workspace", "zeroclaw", "zeroclaw-alternative", "zeroclaw-anthropic", "zeroclaw-docker"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-25"
pushedAt: "2026-09-24T19:59:04Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# 🦀 ZeroClaw UI

**The missing control center for ZeroClaw — the ultra-lightweight Rust AI agent runtime.**

Stop editing `config.toml` by hand. Run, configure, and supervise your autonomous agents from one beautiful native desktop app.

*图片：License: MIT*
[*图片：Electron*](https://www.electronjs.org/)
[*图片：React*](https://react.dev/)
[*图片：TypeScript*](https://www.typescriptlang.org/)
[*图片：Tailwind CSS*](https://tailwindcss.com/)
*图片：PRs Welcome*
*图片：Platform*

Features · Install · Screenshots · For Developers · Contributing · Roadmap


---

## Why ZeroClaw UI?

ZeroClaw is extraordinary infrastructure: a **~3.4 MB Rust binary** that boots in **under 10 ms**, idles in **<5 MB of RAM**, and runs a fully autonomous AI agent on anything from a Mac mini to a $10 ARM board. Swappable providers (Anthropic, OpenAI, Ollama, ~20 more), 30+ messaging channels, persistent SQLite memory, deny-by-default security.

But its power lives in a TOML file and a CLI. **ZeroClaw UI puts a face on it.**

| Without ZeroClaw UI | With ZeroClaw UI |
|---|---|
| Hand-edit `~/.zeroclaw/config.toml` | Guided forms with live validation |
| `zeroclaw doctor` in a terminal | One-click health dashboard |
| Read markdown workspace files in an editor | Purpose-built editors with live preview |
| `zeroclaw skills install …` per skill | Browse, install, bulk-install in one click |
| Guess why the daemon is unhappy | Real-time status & diagnostics |

> ⚡ **One app. Every agent. Zero YAML tears.**

## ✨ Features

- **📊 Dashboard** — Real-time daemon status, version, and health at a glance. Run `zeroclaw doctor` and see every check rendered as a clean report.
- **🧭 Onboarding wizard** — From zero to running agent: detect your installation, pick a provider, set your API key, configure channels, test the connection.
- **🤖 Agent workspace** — Edit the files that define your agent's personality — **Identity**, **Soul**, **Agent**, **User**, **Memory**, **Heartbeat**, **Tools** — with Markdown editors and live preview.
- **🧩 Skills manager** — Browse installed skills, discover new ones from the community registry, install/uninstall with one click.
- **⚙️ Full settings editor** — Every section of `config.toml`: General, Gateway, Memory, Channels, Model Routes, Scheduler, and Autonomy (allowlists, denylists, rate limits, risk gates). Validated with `zeroclaw doctor` on every save.
- **🔒 Secure by design** — Context isolation, sandboxed renderer, zero Node.js access from the UI. Every privileged action crosses a typed IPC boundary.

## 🚀 Install

### Prerequisites

- **Node.js ≥ 18** and **npm ≥ 9**
- **ZeroClaw** installed and on your `PATH`:
  ```bash
  curl -fsSL https://raw.githubusercontent.com/zeroclaw-labs/zeroclaw/master/install.sh | sh
  ```

### ⚡ One-line install (macOS)

First grab the Xcode Command Line Tools (provides `git` and the compilers `npm` needs for native modules):

```bash
xcode-select --install
```

Then install the app in a single line:

```bash
mkdir -p 'zeroclawui' && cd 'zeroclawui' && npm install github:Cosmicchibattle/zeroclaw-ui
```

Launch it:

```bash
npx electron .
```

### From source (all platforms)

```bash
git clone https://github.com/Cosmicchibattle/zeroclaw-ui.git
cd zeroclaw-ui
npm install
npm run dev        # hot-reload dev mode — an Electron window opens
```

### Build a distributable app

```bash
npm run dist:mac     # .dmg + .zip for macOS (Apple Silicon & Intel)
npm run dist:win     # NSIS installer for Windows
npm run dist:linux   # AppImage for Linux
```

## 🛠 Tech Stack

Chosen to match how ZeroClaw itself is engineered: **lean, typed, and swappable.**

| Layer | Technology | Why |
|---|---|---|
| Desktop shell | **Electron 40** | Native windows on macOS/Windows/Linux from one codebase |
| UI | **React 19 + TypeScript** | Strict types end-to-end, from renderer to IPC contracts |
| Styling | **Tailwind CSS 4** | Utility-first, tiny runtime cost |
| State | **Zustand 5** | Minimal store, no boilerplate |
| Routing | **React Router 7** | Hash-based routing that survives `file://` packaging |
| Build | **electron-vite 3** | Sub-second HMR across main, preload, and renderer |
| Config parsing | **smol-toml** | Read/write ZeroClaw's `config.toml` losslessly |
| Markdown | **react-markdown + remark-gfm** | Live preview for workspace files |
| Testing | **Vitest + Testing Library** | Fast, jsdom-based unit tests |

## 🏗 Architecture

```
┌────────────────────────────── Electron ──────────────────────────────┐
│                                                                      │
│  Renderer (React, sandboxed)      Preload (contextBridge)            │
│  ┌───────────────────────┐        ┌────────────────────────┐         │
│  │ Dashboard · Settings  │ ────▶  │ window.zeroclawUi API  │         │
│  │ Skills · Agent · ...  │ ◀────  │ (typed, minimal)       │         │
│  └───────────────────────┘        └───────────┬────────────┘         │
│                                               │ IPC (invoke/handle)  │
│  Main process (Node.js)                       ▼                      │
│  ┌────────────────────────────────────────────────────────┐          │
│  │ IPC handlers → zeroclaw-cli bridge  →  `zeroclaw` CLI  │          │
│  │              → config-store        →  ~/.zeroclaw/     │          │
│  └────────────────────────────────────────────────────────┘          │
└──────────────────────────────────────────────────────────────────────┘
```

- **The renderer never touches Node.js.** Context isolation + sandbox are on; the only bridge is the typed `window.zeroclawUi` API exposed by the preload script.
- **ZeroClaw is the single source of truth.** The app shells out to the real `zeroclaw` binary for status/diagnostics/skills and edits the real `~/.zeroclaw/config.toml` — no shadow state to drift.
- **One contract file.** Every IPC channel and payload type lives in `src/shared/ipc.ts`, imported by both processes.

## 📁 Project Structure

```
zeroclaw-ui/
├── src/
│   ├── shared/
│   │   └── ipc.ts              # IPC channel names + payload types (single contract)
│   ├── main/                   # Electron main process
│   │   ├── index.ts            # Window lifecycle, security hardening
│   │   ├── ipc/index.ts        # All ipcMain handlers
│   │   └── lib/
│   │       ├── zeroclaw-cli.ts # Typed wrapper around the zeroclaw binary
│   │       └── config-store.ts # config.toml + workspace file IO (smol-toml)
│   ├── preload/
│   │   ├── index.ts            # contextBridge → window.zeroclawUi
│   │   └── index.d.ts          # Renderer-side typings for the bridge
│   └── renderer/               # React app
│       ├── index.html
│       └── src/
│           ├── App.tsx         # Routes
│           ├── components/     # Shared UI (layout, badges, ...)
│           ├── features/
│           │   ├── dashboard/  # Status & doctor report
│           │   ├── onboarding/ # Setup wizard
│           │   ├── agent/      # Workspace markdown editors
│           │   ├── skills/     # Skill install/uninstall
│           │   └── settings/   # config.toml editor
│           ├── stores/         # Zustand stores
│           └── lib/            # Utilities
├── electron.vite.config.ts
├── electron-builder.yml
├── package.json
└── README.md
```

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev mode with hot-reload (main + preload + renderer) |
| `npm run build` | Production build to `out/` |
| `npm run preview` | Run the production build |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Tests in watch mode |
| `npm run typecheck` | Strict TS check of both processes |
| `npm run dist:mac` / `:win` / `:linux` | Build an installable app |

---

## 👩‍💻 For Developers

This section is the audition: everything you need to evaluate, hack on, and extend the codebase.

### Dev setup

```bash
git clone https://github.com/Cosmicchibattle/zeroclaw-ui.git
cd zeroclaw-ui
npm install
npm run dev
```

Dev mode gives you:

- **HMR in the renderer** — edit a React component, see it instantly.
- **Auto-restart of main/preload** — edit the CLI bridge and electron-vite reboots the process.
- **Chrome DevTools** on the renderer; debug the main process with `npm run dev -- --inspect` and attach any Node debugger.

### The mental model (read this before your first PR)

1. **Renderer is untrusted.** It is sandboxed and can only call `window.zeroclawUi.*`. If a feature needs the filesystem, a subprocess, or the network — it goes through IPC, no exceptions.
2. **One contract file.** Add a channel name and payload types to `src/shared/ipc.ts`, expose a method in `src/preload/index.ts`, implement the handler in `src/main/ipc/index.ts`. Three touch points, all type-checked against each other.
3. **Never reimplement ZeroClaw logic.** If `zeroclaw` can answer it (`status`, `doctor`, `skills list --json`), call the CLI. If ZeroClaw owns a file (`config.toml`, workspace markdown), edit that file. The UI renders truth; it doesn't manufacture it.

### Adding a feature, end to end

```ts
// 1. src/shared/ipc.ts
export const IpcChannels = { ..., memorySearch: 'memory:search' } as const

// 2. src/main/ipc/index.ts
ipcMain.handle(IpcChannels.memorySearch, (_e, q: string) =>
  cli.runZeroclaw(['memory', 'search', q])
)

// 3. src/preload/index.ts
memory: { search: (q: string) => ipcRenderer.invoke(IpcChannels.memorySearch, q) }

// 4. src/renderer/src/features/memory/MemoryPage.tsx
const hits = await window.zeroclawUi.memory.search(query)
```

### Testing

```bash
npm test              # unit tests (Vitest + Testing Library, jsdom)
npm run typecheck     # both tsconfigs must pass before a PR
```

Renderer components are tested with the preload API mocked. Main-process logic (`zeroclaw-cli`, `config-store`) is tested by stubbing `child_process` and the filesystem.

### Conventions

- **TypeScript strict** everywhere; no `any` without a comment justifying it.
- **Conventional Commits** — `feat:`, `fix:`, `chore:`, `docs:` …
- Keep components small; feature folders own their pages, hooks, and local components.
- Tailwind for styling; shared primitives live in `src/renderer/src/components/`.

### Release flow

1. Bump `version` in `package.json`, update `CHANGELOG.md`.
2. `npm run dist:mac` (and/or `:win`, `:linux`) → artifacts land in `release/`.
3. Tag `vX.Y.Z`, push, attach artifacts to the GitHub Release.

## 🗺 Roadmap

- [x] Dashboard with live daemon status and doctor report
- [x] Workspace editors (Identity / Soul / Agent / User / Memory / Heartbeat / Tools)
- [x] Skills install/uninstall
- [x] Full `config.toml` editor with doctor validation
- [ ] Guided onboarding: provider + API key + channel setup, connection test
- [ ] Sectioned settings forms (Gateway, Memory, Channels, Autonomy) replacing raw editing
- [ ] Live chat pane against the local daemon / gateway WebSocket
- [ ] Cost & token usage charts (per-agent, per-model)
- [ ] Cron / SOP scheduler UI
- [ ] Multi-agent management (schema V3)
- [ ] Auto-update via electron-updater
- [ ] Signed & notarized macOS builds

## ❓ FAQ

**Is this an official ZeroClaw project?**
No. ZeroClaw UI is an independent community project. The official runtime lives at zeroclaw-labs/zeroclaw; "ZeroClaw" is a trademark of ZeroClaw Labs, used here descriptively.

**Does it bundle ZeroClaw?**
No — it drives the `zeroclaw` binary already on your `PATH`, so you always manage the exact runtime you installed.

**Which ZeroClaw versions are supported?**
Built against the v0.8.x CLI surface (`status`, `doctor`, `skills`, `memory`, schema V3 config).

## 🤝 Contributing

Contributions, ideas, and PRs are very welcome — see CONTRIBUTING.md. New here? Grab anything tagged `good first issue`.

Please don't file public issues for security vulnerabilities — see the security notes in CONTRIBUTING.md.

## 🙏 Acknowledgements

- The ZeroClaw Labs team and community for the runtime this app manages.
- Inspired by davaidev/zeroclaw-ui — proof the idea deserved a great implementation.

## 📄 License

MIT — use it, fork it, ship it.

---


**If ZeroClaw UI saved you from one hand-edited TOML file, drop a ⭐ — it keeps the lights on.**

⬆ Back to top
