---
title: "MatinSenPai/Aether-GUI"
owner: "MatinSenPai"
name: "Aether-GUI"
fullName: "MatinSenPai/Aether-GUI"
description: "One-click desktop GUI for the Aether censorship-circumvention tunnel — Tauri v2, React 19, Rust"
sourceUrl: "https://github.com/MatinSenPai/Aether-GUI"
stars: 938
forks: 50
language: "TypeScript"
topics: ["anti-censorship", "censorship-circumvention", "desktop-app", "proxy", "react", "rust", "tauri", "typescript"]
license: "AGPL-3.0"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-08-21T07:41:10Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Aether-GUI

*图片：Release*
*图片：License: AGPL v3*
*图片：Platform*
*图片：Tauri*
*图片：React*
*图片：Rust*

**English** · فارسی

A one-click desktop GUI for **Aether**, a censorship-circumvention tunnel built for heavily restricted networks. Aether itself is a terminal tool: it discovers a working route out, establishes an encrypted tunnel, and exposes a local SOCKS5 proxy. Aether-GUI wraps that terminal tool in a small, animated desktop app so you don't have to touch a command line to use it — press Connect, and everything else (identity provisioning, route discovery, prompt answering) happens automatically in the background.

This project does not reimplement any of Aether's tunneling logic. It drives the real `aether` binary in a pseudo-terminal, answers its interactive setup prompts on your behalf, and watches its output to tell you what's happening. All the actual censorship-circumvention work — MASQUE/QUIC obfuscation, WireGuard, route probing — is Aether's, not this repo's.


  


## Features

- **Auto mode** — the default screen is just a single button. No configuration is required; it connects using your last-successful settings (or sensible defaults on first run).
- **Advanced panel** — for when you want control, a collapsible panel exposes the real options Aether's setup supports:
  - **Protocol**: MASQUE (disguises traffic as normal HTTPS), WireGuard (lighter, faster), or WARP-in-WARP/gool (two nested WireGuard tunnels for extra security at a speed cost)
  - **Scan Mode**: Turbo, Balanced, Thorough, Stealth, or Ironclad — trading route-discovery speed against how much probe traffic it generates; Ironclad opens a real tunnel through each candidate and sends a real HTTP request before trusting it (slowest, but guaranteed working)
  - **IP Version**: IPv4, IPv6, or both
  - **MASQUE Transport**: HTTP/3 (QUIC — fastest handshake) or HTTP/2 (TCP — looks like ordinary HTTPS, works where UDP is blocked or throttled)
  - **Obfuscation**: how heavily the handshake is disguised from DPI — profiles adapt to the selected protocol; escalate if the default can't get through
  - **Quick reconnect**: remember the last working gateway and re-test it first, skipping the full scan when it still works
  
  Each option has an explanation on hover.
- **Live progress** — while Aether searches for a working route, the GUI shows real elapsed time and, once Aether reports its own scan budget, an actual percentage and progress bar — not just a spinner.
- **Automatic reconnect** — if the tunnel drops unexpectedly mid-session (observed occasionally with WARP-in-WARP, but handled the same way for every protocol), the GUI retries automatically with backoff, shown as a visible "Reconnecting… (attempt N of 3)" rather than silently dying or dumping you back to a bare error. A user-requested disconnect is never retried.

## Installing

Grab the latest installer from the Releases page:

- `Aether-GUI_x.y.z_x64-setup.exe` — standard installer (recommended)
- `Aether-GUI_x.y.z_x64_en-US.msi` — MSI package, for scripted or enterprise installs

Windows x64 only for now — see Building from source for other platforms.

## Building from source

1. **Prerequisites**
   - [Node.js](https://nodejs.org/) and npm
   - [Rust](https://rustup.rs/) (stable toolchain)
   - Tauri's platform prerequisites — see the [Tauri v2 prerequisites guide](https://v2.tauri.app/start/prerequisites/) (on Windows this is the MSVC C++ Build Tools + WebView2 Runtime, both usually already present; macOS needs Xcode Command Line Tools; Linux needs `webkit2gtk` and friends)

2. **Install frontend dependencies**

   ```sh
   npm install
   ```

3. **Fetch the Aether binary**

   Aether-GUI bundles the real `aether` binary from CluvexStudio/Aether releases rather than building it — this repo only ships the GUI. Fetch and checksum-verify it for your platform:

   ```sh
   ./src-tauri/binaries/fetch-aether.sh
   ```

   This script covers Linux and macOS directly. On Windows, download the matching `aether-windows-*.zip` from the Aether releases page yourself, verify it against the published `SHA256SUMS.txt`, and extract `aether.exe` into `src-tauri/binaries/`.

4. **Run in development mode**

   ```sh
   npm run tauri dev
   ```

5. **Build a release installer**

   ```sh
   npm run tauri build
   ```

   Installers land under `src-tauri/target/release/bundle/` (NSIS `.exe` and `.msi` on Windows; `.dmg`/`.app` on macOS; `.deb`/`.AppImage`/`.rpm` on Linux — cross-platform bundles must each be built on their own OS, or via CI).

## How it works

- **Frontend**: React 19 + Tailwind v4, state managed with Zustand, animated with [Motion](https://motion.dev/) — all talking to the Rust backend over Tauri's IPC. Deliberately lightweight: the ambient background is two compositor-only CSS gradient orbs, and every looping animation freezes while the window is unfocused, so the app costs next to nothing sitting in the background.
- **Backend**: Rust, using [`portable-pty`](https://docs.rs/portable-pty) to spawn the real Aether v1.5.0 binary in a genuine pseudo-terminal. Your chosen profile — protocol, scan mode, IP version, MASQUE transport (HTTP/3 or HTTP/2), obfuscation profile, quick reconnect, Zero Trust, tunnel DNS and routing rules — is passed up front as CLI flags/environment, so Aether's interactive prompts normally never appear. A Zero Trust email-code prompt is bridged safely into the GUI; credentials are never written to the saved profile.
- **Ground truth for "connected"**: the GUI doesn't trust Aether's log wording alone (that's fragile across releases) — it treats a successful TCP connection to the local SOCKS5 port (`127.0.0.1:1819`) as the actual proof the tunnel is up.
- **State machine**: `Idle → Launching → Connecting → Connected`, with `Reconnecting` and `Error` as the two ways a connection attempt can end up needing your attention — `Reconnecting` retries automatically (with backoff, capped at 3 attempts), `Error` is the final word once retries are exhausted or something isn't retriable (e.g. the binary itself is missing).

## About Aether

Aether is the actual censorship-circumvention engine this app wraps — a standalone terminal tool that discovers reachable routes and establishes the tunnel, independent of any GUI. If you'd rather use it directly from a terminal, or want to understand exactly what it's doing under the hood, that's the repo to read. Aether-GUI exists purely to make that tool one click away for people who don't want to live in a terminal.

## License

GNU Affero General Public License v3.0.
