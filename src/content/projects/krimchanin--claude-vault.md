---
title: "Krimchanin/claude-vault"
owner: "Krimchanin"
name: "claude-vault"
fullName: "Krimchanin/claude-vault"
description: "Keep Claude Desktop chats safe when switching accounts — local-first backup and restore for conversations."
sourceUrl: "https://github.com/Krimchanin/claude-vault"
stars: 39
forks: 0
language: "TypeScript"
topics: ["backup", "chat-history", "claude", "claude-desktop", "linux", "local-first", "macos", "privacy"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-17"
pushedAt: "2026-09-16T23:30:52Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Never lose your Claude chats when switching accounts

English · Русский · 简体中文 · Deutsch · Español · Français

*图片：Tauri 2* *图片：Rust* *图片：Local only* *图片：MIT*

**Claude Vault** keeps an independent, local copy of your Claude Desktop and Claude Code conversations so an account switch cannot make valuable work disappear.

The project is built with Tauri 2, Rust, React, TypeScript, Tailwind CSS, and genuine shadcn-style Radix UI components. It does not use Anthropic's official export flow and does not upload conversation data anywhere.

> This is an independent community project. It is not affiliated with, endorsed by, or supported by Anthropic.

## Download

Choose the installer for your operating system and processor. All files come directly from the latest GitHub Release.

| Platform | Recommended download | Alternative |
| --- | --- | --- |
| Windows x64 | Setup `.exe` | `.msi` |
| Windows x86 / 32-bit | Setup `.exe` | `.msi` |
| Windows ARM64 | Setup `.exe` | `.msi` |
| macOS Apple Silicon | `.dmg` | `.app.tar.gz` |
| macOS Intel | `.dmg` | `.app.tar.gz` |
| Linux x64 | `.AppImage` | `.deb` · `.rpm` |
| Linux ARM64 | `.AppImage` | `.deb` · `.rpm` |

The current builds are unsigned, so Windows SmartScreen or macOS Gatekeeper may display a warning. The complete source and reproducible release workflow are public in this repository.

## How it works

```text
Claude's local files
        ↓
Back up to Claude Vault
        ↓
Switch Claude accounts safely
        ↓
Restore only files that are missing
```

Claude Vault mirrors Claude's original files instead of converting conversations into a proprietary database. When restoring, it merges missing data back into the matching Claude folders and leaves every existing file untouched.

> **Private by design:** no cloud, no accounts, no analytics, no telemetry, and no network synchronization. Your raw conversations stay on your computer. Restore never overwrites an existing Claude file.

## What it does

- Experimental Windows account switching: save the current account, quit Claude, then swap to another saved account from Vault. See account switching for setup, security, and recovery details.

- Detects Claude Desktop data in both classic and Microsoft Store installation locations on Windows.
- Lists locally available sessions with titles, dates, sizes, and turn counts.
- Opens the complete user/assistant transcript for sessions that have matching JSONL history.
- Creates an independent archive inside Claude Vault's own application-data directory.
- Updates archived files whose contents changed without duplicating unchanged files.
- Restores only missing files; existing Claude files are never overwritten.
- Preserves raw metadata, transcripts, attachments, and scratch-workspace files byte-for-byte.
- Supports custom paths and Russian, English, Simplified Chinese, German, Spanish, and French.

## Safety semantics

- **Backup** adds new files and updates archived copies whose contents changed.
- **Restore** only adds missing files. It never replaces an existing Claude file.
- Symbolic links are ignored while scanning and copying.
- `` blocks are hidden only in the viewer. Raw JSONL is never modified.

See docs/archive-format.md for exact paths and archive layout.

## Development

Requirements: Windows 10/11, Node.js 20+, Rust stable with MSVC, WebView2, and the Tauri 2 Windows prerequisites.

```powershell
npm install
npm run tauri dev
```

Quality checks:

```powershell
npm run format:check
npm run check
cargo test --manifest-path src-tauri/Cargo.toml
```

Build Windows installers with `npm run tauri build`. Tauri writes them under `src-tauri/target/release/bundle/`.

## Privacy and limitations

- All conversation operations are local; there are no analytics, accounts, or network synchronization.
- Claude's internal formats are undocumented and may change in future releases.
- Restored sessions may require restarting Claude Desktop before they appear.
- Without a JSONL transcript, metadata can still be preserved and listed, but the full conversation cannot be displayed.
- Windows is the currently verified platform. macOS and Linux discovery is implemented but still needs broader real-device testing.

## Motivation

Claude Desktop can remove locally visible chats when the user switches accounts. Other coding clients preserve their local history across account changes, so this behavior is surprising and can make valuable work appear lost. Claude Vault gives that history an independent home and lets the user merge it back later without overwriting newer files.

## Contributing, security, and license

Read CONTRIBUTING.md before opening a pull request. Report sensitive issues according to SECURITY.md. Licensed under the MIT License.
