---
title: "shuaiplus/inkstone"
owner: "shuaiplus"
name: "inkstone"
fullName: "shuaiplus/inkstone"
description: "A self-hosted Markdown notebook that runs entirely on Cloudflare Workers."
sourceUrl: "https://github.com/shuaiplus/inkstone"
stars: 113
forks: 89
language: "TypeScript"
topics: ["backlinks", "cloudflare-d1", "cloudflare-durable-objects", "cloudflare-kv", "cloudflare-r2", "cloudflare-workers", "codemirror", "hono"]
license: "NOASSERTION"
homepage: "https://inkstone-demo.pages.dev/"
defaultBranch: "main"
snapshotDate: "2026-08-02"
pushedAt: "2026-07-31T19:32:24Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

Inkstone


  A self-hosted Markdown notebook for writing, organizing, syncing, and backing up personal knowledge.


  中文 ·
  Contributing ·
  LGPL-3.0-only ·
  Demo


## About

Inkstone is a browser-based notebook that runs on Cloudflare Workers. Notes always remain plain Markdown text; on top of that foundation, the application provides focused writing, live preview, full-text search, bidirectional links, offline editing, multi-device synchronization, public sharing, and off-site backups.

It is a complete self-hosted application. The deployer retains control of the database, attachments, and runtime environment.

Every new account automatically receives two standard starter notes, one in Chinese and one in English. The browser-only demo reuses the same note content; refreshing the page restores these two starter notes instead of loading a separate set of demo data.

## Features

| Area | Included |
| --- | --- |
| Writing | CodeMirror 6 editor, **live preview**, editor/split/preview layouts, synchronized scrolling, outline, **focus mode**, **typewriter mode**, **autosave**, and **version history** |
| Markdown | Tables, task lists, footnotes, definition lists, callouts, tabs, **details blocks**, **math**, **Mermaid diagrams**, **syntax highlighting**, **Front Matter**, and Pandoc-style attributes |
| Organization | Nested folders, inline tags, favorites, pinning, archive, trash, **wiki links**, backlinks, block references, note embeds, and a relationship graph |
| Search | D1 FTS5 **full-text search** with Chinese indexing, filters, recent notes, and command-palette navigation |
| Reliability | Installable PWA, offline app launch, browser-side cache, **offline write queue, optimistic concurrency control**, conflict copies, realtime notifications, and polling fallback |
| Sharing | Public note links with optional access passwords and expiration dates |
| Portability | JSON and ZIP exports, directly readable **Markdown**, attachment export, and **manual or scheduled WebDAV/S3 backups** |
| Interface | **Desktop and mobile layouts**, **dark/light themes**, accent colors, Simplified Chinese, and English |

## Data storage

| Component | Purpose |
| --- | --- |
| Cloudflare D1 | Accounts, notes, folders, tags, settings, versions, shares, and search indexes |
| Cloudflare R2 or Workers KV | Attachment and uploaded-avatar binaries through the `FILES` or `FILES_KV` binding |
| Browser IndexedDB | Local cache and pending offline writes |
| `SyncHub` Durable Object | Realtime change notifications between active clients |
| `CredentialVault` Durable Object | Isolated storage for the key used to encrypt backup credentials |
| WebDAV or S3 storage | User-configured off-site backups |

## Deployment

1. Fork the Inkstone repository to your GitHub account.
2. Open [Cloudflare Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages/create).
3. Select **Continue with GitHub**, then choose your forked repository.
4. For R2 mode, set the build command to `npm run build` and the deploy command to `npm run deploy`.
   - To use KV mode, change the deploy command to `npm run deploy:kv`.
5. After deployment completes, open the generated Workers URL.

## Exports and backups

- JSON export preserves structured notebook data for re-import.
- ZIP export includes structured data, readable Markdown files, attachments, and a manifest.
- Remote backup targets support WebDAV and S3-compatible storage.
- Multiple targets can be configured and run manually or on a schedule.
- Login passwords, active sessions, share passwords, and backup-service credentials are not included in exports.

## Development and verification

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Worker and client |
| `npm run dev:kv` | Start locally with the KV attachment configuration |
| `npm run dev:demo` | Start the reset-on-refresh browser-only demo |
| `npm run typecheck` | Run TypeScript project checks |
| `npm run test:unit` | Run the Vitest unit test suite |
| `npm run i18n:check` | Verify parity between the English and Chinese locale resources |
| `npm run comments:check` | Enforce the source-comment policy |
| `npm run build` | Type-check and create a production build |
| `npm run deploy:kv` | Build and deploy with `wrangler.kv.toml` |
| `npm run deploy:demo` | Build and deploy the static browser-only demo |
| `npm run test:e2e` | Exercise the API against a running disposable local instance |

The end-to-end script creates, changes, and deletes data at `http://localhost:7712`. Run it only against a fresh local state dedicated to testing.

## Repository layout

```text
src/
├── client/   React interface, editor, preview, and local state
├── shared/   Shared types, limits, locale resources, and Markdown utilities
└── worker/   Hono API, authentication, D1 access, sync, sharing, and backups
public/       Static assets
scripts/      Repository checks and end-to-end verification scripts
tests/        Cross-module regression tests
```

## Security and contributions

Read `SECURITY.md` before reporting a vulnerability. Development setup and contribution requirements are documented in `CONTRIBUTING.md`.

## License

Inkstone is distributed under the GNU Lesser General Public License v3.0 only, using the SPDX identifier `LGPL-3.0-only`.
