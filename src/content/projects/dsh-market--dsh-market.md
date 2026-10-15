---
title: "dsh-market/dsh-market"
owner: "dsh-market"
name: "dsh-market"
fullName: "dsh-market/dsh-market"
description: "The plugin market inside DeepSeek Harness — browse, search, one-click install · DSH 可视化插件市场"
sourceUrl: "https://github.com/dsh-market/dsh-market"
stars: 450
forks: 37
language: "TypeScript"
topics: ["deepseek-harness", "dsh-plugin", "marketplace"]
license: "MIT"
homepage: "https://dshmarket.com"
defaultBranch: "main"
snapshotDate: "2026-08-16"
pushedAt: "2026-08-16T11:02:00Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# dsh-market

English | 中文

[*图片：npm*](https://www.npmjs.com/package/dshmarket)
*图片：stars*

The plugin market inside DeepSeek Harness. Open Settings → **Plugin Market** → browse, search, one-click install.

*图片：dsh-market*

One-click themes — install, switch live, no restart:

*图片：Themes tab*

## Install

```sh
dsh plugin --profile web add dshmarket
```

Restart `dsh web`, then open **Settings → Plugin Market**.

## What you get

- **Browse & search** the full community catalog (800+ plugins, growing daily) — category filters, star counts, top/new sorting, bilingual descriptions that follow your UI language
- **Screenshots** — AppStore-style screenshots in the install dialog: author-curated via the registry, with automatic README extraction as fallback; images load from GitHub hosting only, and only after you open the dialog
- **Themes** — a dedicated tab for community themes and skins: install → active immediately, switch with one click (themes are mutually exclusive, your choice survives restarts), uninstall to revert
- **One-click install** — confirm the source, watch live progress; most plugins go live after a page refresh, no restart
- **Backup & restore** — export your profile's plugin list and configuration as readable JSON, import it on another machine, or store it on WebDAV with daily auto-backup; restores validate before writing and roll back on failure
- **Updates** — per-plugin update checks (npm version or pinned commit vs HEAD), one-click update, or update everything at once; the market updates itself the same way
- **Uninstall** — two-step confirm; plugins installed this session are removed live
- **Restart when needed** — changes that cannot hot-load show a one-click restart beside the pending-change banner; the action is restricted to same-origin loopback requests
- **Zero jargon** — if a component is missing (pnpm), the market detects it and offers a one-click automatic setup
- **Log export** — one click produces a sanitized plain-text log for bug reports (home paths and credential shapes are masked; nothing is ever sent anywhere)

## Speed

Installs prefer npm tarballs over full-repo GitHub downloads whenever a plugin publishes to npm (registry-verified against the repo to prevent name squatting). Registry installs are typically seconds; GitHub-only plugins depend on your connection to GitHub.

## Security

- Installs are restricted to sources listed in the curated [awesome-dsh-plugin](https://awesome-dsh-plugin.com) registry — anything else is rejected
- Build scripts stay blocked by default (pnpm ≥10); allowing one is your explicit per-package choice
- Terminal/CLI-surface plugins are flagged before you install them into the web profile
- The install endpoint accepts same-origin POST only; the market never phones home
- Backups can contain credentials from your profile config — the UI warns before export and upload; WebDAV sync is https-only, refuses private-network targets, and never stores your password in the browser
- The restart endpoint additionally requires a direct loopback client (forwarded requests are rejected) and relaunches the exact DSH entry, arguments, environment, and working directory
- One-click restart launches a detached replacement. If DSH is managed by systemd, launchd, pm2, or another supervisor, set the plugin option `allowRestart: false` and let the supervisor own restarts instead; the pending-change notice remains visible but the button is hidden
- For terminal-attached launches, the detached replacement keeps running after the original terminal closes
- Listing ≠ endorsement: plugins are third-party code, install sources you trust

## Submit your plugin

**This repo is the market app, not the catalog.** The plugin list comes from the curated awesome-dsh-plugin registry — to get your plugin listed in the market, open a PR **there** (one entry in the list; the site and this market pick it up automatically, usually within a day). Please don't PR plugin entries against this repo.

## Roadmap & feedback

- Planned features live on the Roadmap — every item welcomes community PRs (drop a note in the linked issue before starting)
- File bugs and ideas as issues; attaching the market's "Export log" makes diagnosis 10x faster

## Data source

Live from [awesome-dsh-plugin.com/plugins.json](https://awesome-dsh-plugin.com/plugins.json) — curated entries, npm mapping, and star counts refreshed daily by CI — with a bundled snapshot as offline fallback.

## Friends

### DSH Desktop (dataelement)

dsh-desktop — a desktop app for DeepSeek Harness: run and manage a local Harness without installing Node.js yourself. Ships with this plugin market preset as the default. [dshdesktop.com](https://dshdesktop.com)

### modlens

modlens — the first vision plugin for DeepSeek Harness: bolts visual understanding onto text-only models like DeepSeek and GLM. Paste an image, get structured JSON evidence back — OCR, layout, semantics. Available right in this market:

```sh
dsh plugin --profile web add @liustack/modlens
```

## License

MIT · [dshmarket.com](https://dshmarket.com)
