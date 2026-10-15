---
title: "sheying2013/OpenBrowser"
owner: "sheying2013"
name: "OpenBrowser"
fullName: "sheying2013/OpenBrowser"
description: "本地指纹浏览器 · 多环境隔离 · 代理 / 指纹 / 同步 / RPA"
sourceUrl: "https://github.com/sheying2013/OpenBrowser"
stars: 739
forks: 144
language: "JavaScript"
topics: ["chromium", "electron", "fingerprint-browser", "proxy", "rpa"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-28"
pushedAt: "2026-09-25T17:25:00Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

*图片：Version*
*图片：Platform*
*图片：License*
[*图片：Node*](https://nodejs.org/)

**Multi-language support / 多国语言支持**

🇺🇸 **English** · 🇨🇳 中文

**Local fingerprint browser · Isolated Chromium profiles · Proxy / fingerprint / sync / RPA**


---

## Overview

OpenBrowser is a local desktop fingerprint browser for managing multiple isolated Chromium environments. It combines profile isolation, proxy configuration, browser fingerprint controls, extension management, window synchronization, a local API, MCP integration, and local RPA workflows in one desktop app.

The app supports multiple UI languages, currently including English and Chinese.

> Read the disclaimer before use. OpenBrowser does not guarantee anonymity, unique fingerprints, or compatibility with any specific website.

## Contents

- Screenshots
- Key features
- Supported platforms
- Quick start
- Packaging
- Self-tests
- Project layout
- Data and security

## Screenshots

| Overview | Environments |
| :---: | :---: |
| *图片：Overview* | *图片：Environments* |
| Main navigation and module entry points | Profiles, start/stop controls, and groups |

| Profile / fingerprint | Local settings |
| :---: | :---: |
| *图片：Profile editor* | *图片：Settings* |
| Proxy, fingerprint, and extension settings | Theme, language, and system options |

## Key features

| Area | What it provides |
| --- | --- |
| **Profile isolation** | Separate Chromium profiles so cookies, cache, and storage do not mix. |
| **Batch management** | Groups, tags, bulk start/stop, logs, and window sizing. |
| **Proxy support** | HTTP / HTTPS / SOCKS proxies per environment, with egress checks. |
| **Fingerprint controls** | Platform, language, timezone, user agent, Canvas, WebGL, WebRTC, and more. |
| **Extension center** | Built-in, recommended, and local extensions loaded per environment. |
| **Window sync** | CDP-based synchronization for clicks, scrolling, input, and tabs. |
| **Local RPA** | Flows for navigation, waiting, clicking, typing, and screenshots. |
| **Local API / MCP** | Local integration endpoint on `127.0.0.1:50325` by default. |
| **Independent kernel** | Download a standalone Chromium kernel or use a custom local path. |
| **Backup options** | Local, WebDAV, GitHub, and cloud-drive backups when explicitly enabled. |

## Supported platforms

| Platform | Architecture | Status |
| --- | --- | --- |
| Windows | x86_64 | ✅ Supported |
| macOS | x86_64 | ✅ Supported |
| macOS | arm64 | ✅ Supported |
| Ubuntu | x86_64 | ✅ Supported |

## Quick start

Requires Node.js LTS and npm.

```bash
cd Browserapp
npm ci --include=dev
npm run selftest
npm start
```

Or use the launcher scripts from the repository root:

| Platform | Launcher |
| --- | --- |
| macOS | `start-test.command` |
| Windows | `start-test.cmd` |
| Ubuntu | `start-test.sh` |

## Packaging

```bash
cd Browserapp
# Optional: OPENBROWSER_PACKAGE_ARCH=x86_64 or arm64
# Ubuntu x86_64 only: explicitly fetch the Chrome for Testing package seed.
npm run prepare:linux-kernel
npm run package:portable
```

Build output is written to `Browserapp/dist/`.

| Platform | Output notes |
| --- | --- |
| Windows | Includes `START.cmd`. |
| macOS | Includes `OpenBrowser.app` and `启动.command`. |
| Ubuntu x86_64 | Includes an `OpenBrowser-…tar.gz` portable archive and launcher. |

Ubuntu packages include Chrome for Testing under
`kernels/chrome-for-testing/chrome-linux64`; the application never downloads a
kernel at runtime. Run the package as a normal desktop user, not with `sudo`.
If required, install the standard Electron/Chromium desktop libraries:

```bash
sudo apt-get install libatk-bridge2.0-0 libatk1.0-0 libatspi2.0-0 libcups2 libdrm2 libgbm1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libxcomposite1 libxdamage1 libxfixes3 libxkbcommon0 libxrandr2
```

## Self-tests

```bash
cd Browserapp
npm run selftest
npm run selftest:automation
npm run selftest:protocol
npm run selftest:isolation
npm run selftest:kernel
npm run selftest:cloud
```

## Project layout

```text
OpenBrowser/
├── Browserapp/            # App source
├── docs/screenshots/      # Screenshots
├── start-test.command     # macOS launcher
├── start-test.cmd         # Windows launcher
├── start-test.sh          # Ubuntu launcher
├── DISCLAIMER.md
├── LICENSE
├── README.md              # English documentation
└── README_CN.md           # Chinese documentation
```

This repository contains source code and documentation only. It does not include profiles, cookies, proxy credentials, bundled kernel binaries, or installers. Official Windows x64 and macOS arm64 builds use the matching Wayfern kernel during CI packaging; macOS x86_64 builds use the OpenBrowser 148 kernel; Ubuntu x86_64 builds explicitly fetch Chrome for Testing during CI packaging.

## Data and security

- The local API binds to loopback by default.
- If `OPENBROWSER_API_KEY` is set, requests must include the `api-key` header.
- Browser startup failures are appended to the local-only `browser-startup.log` under the user's OpenBrowser data directory. Inspect it with `npm run log:startup` from `Browserapp/`; logs are ignored by Git.
- Third-party notices are documented in `THIRD-PARTY-NOTICES.md`.
- Cloud backup integrations only connect outward after explicit user configuration.

## Documentation

- Automation module
- Disclaimer
- Third-party notices

---


Third-party kernel sources


The independent kernel comes from Donut Browser / [Wayfern](https://wayfern.com/) by zhom. Update feed: [wayfern.json](https://donutbrowser.com/wayfern.json). Terms: [Wayfern ToS](https://wayfern.com/tos).

The repository does not store kernel binaries. Official platform packages obtain the matching Wayfern kernel from the official feed during CI packaging; macOS x86_64 packages use the checked-in OpenBrowser 148 runtime.


## License

MIT

---


If OpenBrowser is useful to you, a Star is appreciated ⭐
