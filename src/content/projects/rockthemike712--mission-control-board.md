---
title: "rockthemike712/mission-control-board"
owner: "rockthemike712"
name: "mission-control-board"
fullName: "rockthemike712/mission-control-board"
description: "Single-file, zero-dependency task board: owner-vs-agent plates, a dependency map, tap-to-complete."
sourceUrl: "https://github.com/rockthemike712/mission-control-board"
stars: 80
forks: 14
language: "HTML"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-07-26"
pushedAt: "2026-07-24T20:25:22Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Mission Control — a dependency-aware task board

A single-file, zero-dependency task board you drop into any project. Two owners (e.g. **you**
vs **your coding agent**), each with one consolidated plate, plus a **map view** that draws the
whole project as a transit map — one line per track, converging on a **terminus** (GO LIVE),
each line's current bottleneck pulsing.

**"Ready" is never stored — it's derived.** Every task lists its `deps`; a task is blocked
until all of them are done. Complete one and anything it unblocks animates into **Up now**.

No build. No framework. No npm install. It's one HTML file that runs from `file://`.

**Grab it and go:**
```bash
curl -O https://raw.githubusercontent.com/rockthemike712/mission-control-board/main/board.html
open board.html   # then edit the  block to make it yours
```

## What it looks like

**Tap any station and the map answers back** — completing a task ripples through its
dependents, and the 🔓 toast names exactly what just unblocked:

*图片：The whole map, then zoom in and complete a task — the 🔓 toast names everything it unblocked*

The whole project on one screen — one line per track, cross-track dependencies as connectors,
everything converging on the **GO LIVE** terminus:

*图片：Network map view*


Each owner's plate: Up now (tap the ring to complete), then Waiting and Done.
The Lines view — each track as a subway diagram; ⛓ chips jump to the blocker.


Light theme is built in (tap ◐):

*图片：Network map in light theme*

> The screenshots use the included `examples/nabshift.seed.json`
> — a scrubbed, real-world board. Your own board is whatever you put in the seed.

```bash
open board.html          # macOS
# or
xdg-open board.html      # Linux
# or serve it
npx serve .
```

Out of the box `board.html` shows a small demo project so you can click around. Then you make
it yours by editing one thing: the **seed**.

---

## Make it yours

Everything project-specific lives in a single JSON block near the bottom of `board.html`:

```html

{ "config": {...}, "rev": 1, "tracks": [...], "tasks": [...] }

```

Edit that block, save, refresh. The engine above it (the ``, the map module, and the
main ``) is generic and never needs touching.

Two ways to work:

1. **No build** — copy `board.html` into your project, edit the inline seed by hand. Done.
2. **Optional builder** — keep your seed in its own file and inject it:
   ```bash
   node build.js my-project.seed.json > board.html
   ```
   Zero dependencies; purely a convenience for keeping one engine + many seeds.

---

## The seed schema

```jsonc
{
  "config": {
    "boardId": "my-project",                 // namespaces this board's localStorage + sync payload
    "title": "My Project — Mission Control",  // browser tab title
    "wordmark": "MY PROJECT",                 // header wordmark (plain text)…
    "wordmarkHTML": "MYPROJECT", // …or opt into an accent span
    "eyebrow": "Mission Control",             // small line under the wordmark
    "mapLabel": "MAP",                        // third tab label (optional)
    "terminusMessage": "🎉 SHIPPED 🎉",        // toast when the terminus task completes

    "lanes": [                                // exactly two — the two owners
      { "id": "me",    "label": "ME",    "name": "Me",    "subtitle": "your whole plate",
        "glyph": "M", "color": "#FFB020", "world": true },
      { "id": "agent", "label": "AGENT", "name": "Agent", "subtitle": "the agent's plate",
        "glyph": "A", "color": "#45E0FF" }
    ],
    "ext": { "label": "WORLD", "glyph": "⧗", "color": "#8B95AC" }
  },

  "rev": 1,               // bump when you commit a new seed; old device deltas merge under it
  "updated": "2026-07-24",

  "tracks": [             // the "lines" on the map; each task belongs to one
    { "id": "build", "name": "Build", "color": "#F472B6" }
  ],

  "tasks": [
    {
      "id": "b-core",              // stable, unique; other tasks reference it in `deps`
      "title": "Build the core feature",
      "short": "Core",             // one-word keyword shown on the zoomed-out map
      "owner": "me",               // a lane id, or "ext" for the outside world
      "status": "open",            // "open" | "done"
      "track": "build",
      "deps": ["b-scaffold"],      // blocked until all of these are done
      "priority": "high",          // "high" | "medium" | "low"
      "doing": true,               // optional — shows an "in flight" marker
      "terminus": true,            // optional — at most one task; forced to the bottom, drawn as GO LIVE
      "detail": "One line of context.",
      "ref": { "label": "spec", "href": "https://…" }  // optional link chip
    }
  ]
}
```

Rules the board relies on (all checked by the test):

- **Two lanes.** `config.lanes` has exactly two entries — the two owners. Labels, colors, and
  glyphs are yours.
- **`owner: "ext"`** is the reserved id for the outside world (a number arriving, a vetting
  queue clearing). Ext tasks surface on whichever lane is marked `"world": true` (default: the
  first lane), pulsing until you tap ✓ when the world delivers.
- **One terminus, at most.** Flag the final task `"terminus": true`; the map forces it to the
  bottom and draws every line converging on it.
- Every `dep` must resolve to a real task id, and the graph must be acyclic.

---

## The three views

| Tab | What it shows |
| --- | --- |
| **Lane A / Lane B** | Each owner's full plate in one list: **Up now** (unblocked — tap the ring to complete), **Waiting** (blocked, names its blocker), **Done** (collapsed). Ext/world items sit on the world-lane with a pulsing ⧗. |
| **Map** | The dependency graph as a transit map. **◈ Network**: the metro map, fitted to screen, tap a station to zoom in. **≣ Lines**: one card per track, stations as rows with ⛓ jump-chips to blockers. |

## The sync loop

Taps persist **per device** in `localStorage` as *deltas* over the committed seed — so pulling
a newer seed merges cleanly under your local changes, and a delta the seed catches up to
self-cleans. The **Sync** button (lights up when you have local changes) exports a compact
payload:

```json
{ "kind": "my-project-board-sync", "rev": 1, "at": "…",
  "done": ["task-ids…"], "reopened": [], "added": [tasks…], "removed": [] }
```

Apply it to the seed to make it permanent — hand it to your coding agent to commit, or edit the
seed by hand. **Discard local changes** (in the Sync sheet) resets the device to the committed
board.

---

## Tests

```bash
node tests/smoke.js
```

Zero dependencies. Validates every seed (the demo in `board.html` + everything in `examples/`):
two lanes, valid owners/tracks/statuses, unique ids, deps resolve, the graph is acyclic, at
most one terminus — and reproduces the engine's readiness derivation to prove a blocked task
unblocks when its deps complete. Also asserts the engine carries no project-specific coupling.

For UI changes, also smoke it in a real browser: open `board.html`, tap a ring in **Up now**
and confirm the 🔓 unblock toast, switch to **Map** and confirm stations render and tap to
toggle, and check both light and dark (the ◐ button).

---

## `examples/`

- **`nabshift.seed.json`** — a real launch board (six tracks, ~49 tasks, cross-track deps, a
  `world` lane, a terminus), kept as a worked example of a filled-in graph. Scrubbed of the
  originating project's private details. View it:
  ```bash
  node build.js examples/nabshift.seed.json > nabshift-board.html && open nabshift-board.html
  ```
- **`content-pipeline.seed.json`** — an editorial board (Writer / Editor lanes, Research → Draft
  → Edit → Publish), showing the same engine on a non-software workflow.
- **`job-search.seed.json`** — a personal board (Me / Mentor lanes, ending at OFFER SIGNED) —
  proof the two "owners" can be you and anyone helping you, not just you-and-an-agent.

Each is a different shape — different lane labels, tracks, and terminus — all from the same
unchanged engine. Copy whichever is closest to your project and edit from there.

---

## What people are saying

> "I think you may have come up with a pretty ingenious way of looking at how we develop with
> AI from now on. I think this is really useful. I'm going to play around with it this weekend.
> Well done!"
> — **mwilsonsc**

> "This is so awesome! This seems like what I wanted and what I was trying to come up with in my
> head so I could ask Claude to build it, but I didn't actually know (if that makes sense lol —
> like what I envisioned that I would envision, but couldn't). Great job! I'm going to take a
> deeper look into it when I have the time."
> — **da_martian**

> "I made a kanban style mission control but this looks really slick. I'd check it out for sure."
> — **angelarose210**

---

## Splitting this into its own repo

This folder is self-contained — nothing outside it is required. To make it a standalone repo
you reuse across projects:

```bash
# from a copy of this board-kit/ folder
git init
git add board.html build.js README.md examples/ tests/
git commit -m "Mission Control task board"
# create an empty repo on your host, then:
git remote add origin git@github.com:/mission-control-board.git
git push -u origin main
```

Add a CI check (optional) so a bad seed can't merge — GitHub Actions:

```yaml
# .github/workflows/ci.yml
name: ci
on: [push, pull_request]
jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: node tests/smoke.js
```

Then **per project**, either copy `board.html` and edit its seed, or keep a `*.seed.json` per
project and `node build.js project.seed.json > board.html`. Each board's device state is keyed
by `config.boardId`, so several boards coexist on one machine without colliding.
