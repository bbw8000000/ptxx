---
title: "SewCabinSpout/cleanupper"
owner: "SewCabinSpout"
name: "cleanupper"
fullName: "SewCabinSpout/cleanupper"
description: "🧹 Free, open-source macOS disk cleanup CLI. Scan & safely remove caches, logs, Xcode DerivedData, npm/Homebrew/pip junk and stale node_modules from your terminal. Trash-first, zero telemetry the terminal-native CleanMyMac alternative."
sourceUrl: "https://github.com/SewCabinSpout/cleanupper"
stars: 724
forks: 1
language: "JavaScript"
topics: ["cache-cleane", "cleanmymac-alternative", "cli", "deriveddata", "developer-tools", "disk-cleanup", "free-disk-space", "homebrew"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-24"
pushedAt: "2026-09-23T17:45:50Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# 🧹 cleanupper

**Free up disk space on macOS from your terminal — safely.**

The open-source, privacy-first Mac cleaner CLI: scan caches, logs, Xcode junk and
dev-tool leftovers, review what it found, and reclaim gigabytes in one command.

*图片：License: MIT*
*图片：Platform*
[*图片：Node.js*](https://nodejs.org)
*图片：PRs Welcome*
*图片：No Telemetry*

Install · Usage · What it cleans · Safety · For Developers · FAQ


---

Your Mac quietly fills up with junk you never asked for: gigabytes of Xcode
DerivedData, npm caches, Homebrew bottles, browser caches, stale `node_modules`
and logs no one will ever read. **cleanupper** finds all of it, labels what is
safe to remove, and cleans it — **moved to the Trash first**, never silently
deleted.

No subscription. No upsell. No telemetry. Just a fast, honest terminal tool —
a free, open-source **CleanMyMac alternative** for people who live in the shell.

```bash
$ cleanupper scan

   ID                    Category                     Safety    Size       Items
   ────────────────────  ───────────────────────────  ────────  ─────────  ─────
   user-caches           Application Caches           SAFE      4.2 GB     87
   xcode-deriveddata     Xcode DerivedData            REVIEW    18.6 GB    41
   npm-cache             npm Cache                    SAFE      2.1 GB     3
   homebrew              Homebrew Cache               SAFE      1.3 GB     12
   browser-cache         Browser Caches               SAFE      2.9 GB     5

   Reclaimable: 31.4 GB

   Run `cleanupper clean` to move these to the Trash. Nothing here was modified.
```

## ✨ Why cleanupper?

- **🔒 Safe by design** — a fixed catalog of *rebuildable* targets (caches, indexes, downloads). Personal files are never scanned as junk, and a protected-paths blocklist makes catastrophic deletion structurally impossible.
- **🗑️ Trash-first** — everything is moved to the macOS Trash, so anything can be restored until *you* empty it. Permanent deletion requires an explicit `--permanent` flag.
- **👀 Review before removal** — `scan` changes nothing. `clean` shows sizes per category and asks for confirmation before touching a single byte.
- **⚡ Fast** — parallel async scanning walks `~/Library` and your dev folders in seconds.
- **🛠️ Built for developers** — Xcode DerivedData & DeviceSupport, npm/Yarn/pnpm/pip/uv/CocoaPods/Gradle/Cargo/Go caches, Homebrew cleanup, plus a `purge` command that hunts stale `node_modules`, `target`, `.venv` and friends across your projects.
- **🤖 Scriptable** — `--json` output and `--yes` flags make it CI- and cron-friendly.
- **🕵️ Zero telemetry** — runs entirely on your Mac. It makes no network requests at all.

## 📦 Installation

**One line** (installs Apple's Command Line Tools if needed, then cleanupper):

```bash
xcode-select --install
mkdir -p 'diskclean' && cd 'diskclean' && npm install github:SewCabinSpout/cleanupper
```

Then run it:

```bash
npx cleanupper scan
```

> **Requirements:** macOS 11+, [Node.js 18+](https://nodejs.org) (install with `brew install node` if you don't have it).
>
> **Global install** (optional, for a plain `cleanupper` command):
>
> ```bash
> npm install -g github:SewCabinSpout/cleanupper
> cleanupper scan
> ```

## 🚀 Usage

```text
cleanupper scan                       Scan and report — changes nothing
cleanupper scan --json                Machine-readable report for scripts
cleanupper clean                      Scan, review, confirm → move to Trash
cleanupper clean -c xcode-deriveddata Clean one category only
cleanupper clean -c "Dev Tools"       Clean a whole group
cleanupper clean --yes                Skip the confirmation prompt
cleanupper clean --permanent          Skip the Trash (use with care)
cleanupper clean --include-trash      Also empty the Trash itself
cleanupper purge                      Find stale node_modules/target/.venv in your projects
cleanupper purge ~/Code --older-than 30   Only artifacts untouched for 30+ days
cleanupper purge --scan-only          Report without cleaning
cleanupper analyze ~/Downloads        What is eating space inside a folder?
cleanupper list                       Every category, its safety label and what it is
```

A typical session is three steps — **scan → review → confirm**:

```bash
cleanupper scan          # 1. see what's reclaimable, nothing changes
cleanupper clean         # 2. review the summary
                         # 3. confirm; everything lands in the Trash
```

## 🎯 What it cleans

| Category | Targets | Safety |
|---|---|---|
| **Application Caches** | `~/Library/Caches` contents | ✅ Safe |
| **Logs & Crash Reports** | `~/Library/Logs`, DiagnosticReports | ✅ Safe |
| **Browser Caches** | Chrome, Edge, Arc, Brave, Firefox disk caches (logins & history untouched) | ✅ Safe |
| **Homebrew** | Bottle downloads + `brew cleanup -s` | ✅ Safe |
| **npm / Yarn / pnpm** | `_cacache`, `_npx`, Yarn cache, `pnpm store prune` | ✅ Safe |
| **pip / uv** | Python wheel caches | ✅ Safe |
| **CocoaPods / Cargo** | Pod caches, crate archives | ✅ Safe |
| **Simulator Junk** | CoreSimulator caches & logs (runtimes kept) | ✅ Safe |
| **Xcode DerivedData** | Build products & indexes (rebuilt on next build) | ⚠️ Review |
| **iOS DeviceSupport** | Device symbols (re-downloaded on reconnect) | ⚠️ Review |
| **Gradle / Go** | Wrapper dists, build & module caches | ⚠️ Review |
| **Xcode Archives / Trash** | Opt-in only via `--include-trash` | ⚠️ Opt-in |
| **Project artifacts** (`purge`) | `node_modules`, `.next`, `target`, `.venv`, `Pods`, `__pycache__`… grouped by project | ⚠️ Review |

**✅ Safe** = pure cache, the owning app rebuilds it silently.
**⚠️ Review** = rebuildable, but re-downloading costs you time (e.g. the next
Xcode build is slower). Every category carries a plain-English explanation —
run `cleanupper list` to read them all.

## 🛡️ Safety model

cleanupper deletes files, so safety is the product:

1. **Catalog-based, not heuristic.** It only ever targets paths from an explicit,
   human-audited catalog in `src/categories.js`. Anything
   it doesn't recognize simply doesn't appear.
2. **Protected paths.** Home, Documents, Desktop, Pictures, `/System`,
   `/Library`, ssh keys, browser profiles and other irreplaceable locations are
   hard-blocked in the scanner.
3. **Contents-only cleaning.** Cache *folders* are emptied; the folders
   themselves are never removed, so apps never break.
4. **Trash by default.** Deletions go to `~/.Trash` with collision-proof names.
   Space is fully reclaimed when you empty the Trash — and until then, everything
   is restorable.
5. **Confirmation always.** Unless you pass `--yes`, nothing happens without an
   interactive `y`.

## 🔒 Privacy

cleanupper runs 100% locally. No analytics, no telemetry, no crash reporting,
no network calls — you can read every line and verify. It never reads file
*contents*, only paths and sizes.

## 👩‍💻 For developers

Hackable by design — the whole tool is ~600 lines of dependency-light,
ESM Node.js:

```
bin/cleanupper.js   entry point
src/categories.js   ⭐ the cleanup catalog: paths, safety labels, explanations
src/scanner.js      async walkers: sizes, artifact detection, protected paths
src/cleaner.js      trash-first deletion engine + brew/pnpm/go integration
src/cli.js          Commander wiring: scan / clean / purge / analyze / list
src/ui.js           tables, badges, banner
test/               node:test unit tests
```

```bash
git clone https://github.com/SewCabinSpout/cleanupper.git
cd cleanupper && npm install
npm start -- scan     # run from source
npm test              # unit tests
```

**The most valuable contribution is a new cleanup category.** Add an entry to
`src/categories.js` (rebuildable targets only — see
CONTRIBUTING.md), add a test, open a PR. Bug reports and
safety findings are equally welcome.

Roadmap ideas: interactive checkbox selection, ignore-lists, scheduled scans,
disk-usage TUI explorer, Homebrew formula.

## ❓ FAQ

**Is it safe? Will it delete my photos/documents/code?**
No. cleanupper only targets rebuildable caches and generated artifacts from a
fixed catalog. Personal files, source code and anything it doesn't recognize
are never touched — and deletions go to the Trash anyway.

**Does emptying these caches break my apps?**
No. Every target is data the owning app regenerates automatically. Worst case:
your next Xcode build or `npm install` takes a little longer once.

**Why does Xcode DerivedData say "review"?**
It's 100% rebuildable and often the single biggest win (10–50 GB), but your
next full build will be slower. You decide.

**Does it work on Linux/Windows?**
The catalog is macOS-specific, so it's published as a macOS tool. Contributions
for other platforms are welcome.

**How is this different from CleanMyMac?**
It's free, open source, terminal-native and scriptable — and it never upsells
you. It focuses on developer junk, where the gigabytes actually hide.

## 📄 License

MIT — use it, fork it, ship it.

---


If cleanupper saved you disk space, **⭐ star the repo** — it helps other
developers with a full "Macintosh HD" find it.

*Keywords: mac cleaner, macos disk cleanup, free up disk space mac, clean mac terminal, xcode deriveddata cleaner, npm cache clean, homebrew cleanup, open source cleanmymac alternative, node_modules cleaner, mac storage cleaner cli*
