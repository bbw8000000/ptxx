---
title: "nateherkai/scroll-craft"
owner: "nateherkai"
name: "scroll-craft"
fullName: "nateherkai/scroll-craft"
description: "Claude Code skill for premium scroll-driven websites. Scroll becomes the timeline, on a real design floor, verified by screenshotting its own scroll."
sourceUrl: "https://github.com/nateherkai/scroll-craft"
stars: 500
forks: 86
language: "JavaScript"
topics: ["accessibility", "agent-skills", "ai-web-design", "anthropic", "claude-code", "claude-code-plugin", "creative-coding", "design-system"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-08-24"
pushedAt: "2026-08-23T21:29:51Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# scrollcraft

**A Claude Code skill that builds premium, scroll-driven websites, and holds them to a real design standard.**

Most AI website output fails in one of two directions. It is either well behaved and forgettable, or it is a flashy scroll animation with 2.1:1 body text, a headline that wraps to six lines on a phone, and the same six sections every other AI page has. scrollcraft is built to fail neither way: it treats **interaction** and **craft** as one job rather than two.

*图片：MIT*
[*图片：Claude Code plugin*](https://code.claude.com/docs/en/plugins)

---

## Three builds, three completely different pages

Same skill, same engine, no shared skeleton. The differences below are not themes: they are different page grammars, different navigation models, different endings.

### Orrery · a travel practice
One unbroken world. The whole page is a single fixed stage: you fall into a handmade scale model of the Earth, land in Kyoto, cross to Patagonia and the Sahara, and rise back to the workbench you started on. No section boundaries anywhere.

*图片：Orrery, a continuous-world scroll flight*

### PERKFORM · a protein coffee
A filmic one-shot that hard-cuts to two full-bleed inverted grounds mid-page. Loud, product-forward, and the only one of the three that raises its voice.

*图片：PERKFORM, a filmic one-shot product page*

### Fallowbank · a landscape design-build studio
Quiet, documentary, restrained. Museum-label copy over real photography, and a close that is a line of running text rather than a button.

*图片：Fallowbank, a restrained documentary page*

---

## What it actually does

**Interaction, engagement, and being unrepeatable**

- **Scroll is the timeline.** Video scrubs frame by frame under the wheel, sections pin while their argument advances, rails pan sideways, headlines assemble line by line, the page ground shifts colour as you travel, and the pointer moves things that are not scrolling.
- **Eight mutually exclusive page grammars.** Filmic one-shot, chaptered editorial, live surface, continuous world, typographic poster, gallery, split stage, rhythmic cutlist. Each one *forbids* what the others require, so two builds cannot quietly converge.
- **A required signature move.** Every build invents one bespoke interaction that exists on that site alone. A recoloured spotlight does not count.
- **A fingerprint gate.** A new build must differ from every page you have already made on at least 4 of 6 dimensions: grammar, nav, hero, act shape, close, signature move. Fail it and you change the plan, not the record.

**Craft, and how the page actually feels**

- **A feeling curve before any act exists.** One line per act: the emotion, then what on screen causes it. Two adjacent acts with the same feeling means one is filler.
- **One engineered peak.** Peak-end rule, applied literally. The peak gets the asset budget, the silence in front of it, and the most scroll room. A page with three peaks has none.
- **A typography floor.** Two families maximum, tracking that tightens as size grows, 45 to 75ch measure, line height inverse to measure, and light-on-dark compensated on three axes.
- **A spacing scale with actual rhythm.** 4px base, more space above a heading than below it, fluid section padding so a phone does not inherit desktop air.
- **Colour with six roles and one accent**, secondary text tinted rather than flat grey, no pure black, and a documented escape for pages that hard-cut between light and dark grounds.
- **Depth as five tools, not one.** Offset shadows, edge light, scale-and-blur as distance, overlap, and grain.
- **Brand guidelines are inputs, not decoration.** Point it at a brand kit and its hard rules win, including rules that forbid things the skill would otherwise reach for.
- **A refuse list.** Identical feature-card grids, `01 / 06` counters, scroll cues, gradient text, em dashes, invented statistics, fake dashboards, AI-purple gradients, and the cream-and-brass artisan palette every craft brand defaults to.

**It checks its own work**

A headless browser walks the finished page at every scroll position, waits for the video playhead to settle, and reports:

- **dead scroll**: scroll that changes nothing on screen
- **cues that never reach full opacity**: copy the reader can only ever see faded
- **contrast measured on the composited page**, per line, at the brightest frame that ever passes under it, with the direction picked per line so light-on-dark and dark-on-light are both graded correctly
- **legs stuck on a poster**: a clip that silently never decoded, which looks exactly like a paused film

Then it writes a contact sheet, because a machine can prove a page works and cannot tell you it means anything.

---

## Install

```bash
/plugin marketplace add nateherkai/scroll-craft
```
```bash
/plugin install nateherk-design
```

Then use it by describing what you want, or invoke it directly:

```
/nateherk-design:scrollcraft
```

If the install summary says `Run /reload-plugins to activate.`, run that.

To hack on the skill without installing:

```bash
claude --plugin-dir ./plugins/nateherk-design
```

## First run

```bash
node scripts/doctor.mjs              # preflight: says exactly what is missing
node scripts/workspace.mjs --ensure  # creates your workspace and an empty registry
```

Run `doctor` before anything else. The three most common setup faults all surface later as misleading errors otherwise: a stripped ffmpeg reports a missing filter as a syntax error in *your* command, a missing WebP muxer reports as a bad filename, and `playwright-core` resolves from the wrong directory.

## Requirements

| | Why | Notes |
| --- | --- | --- |
| **Node 18+** | every script | |
| **A full ffmpeg build** | encoding clips so they *scrub* rather than play | Some toolchains put a stripped ffmpeg on PATH with ~50 filters and no `scale`. `doctor` finds a real build if one exists; `SCROLLCRAFT_FFMPEG` overrides. |
| **`playwright-core` + Chrome** | the verification pass | `npm i playwright-core` **in the build folder** |
| **`KIE_AI_API_KEY`** | only if you want assets *generated* | Optional. Building from your own photos and footage needs no key and no spend, and it is a first-class route. See `.env.example`. |

## The workspace

Your builds and your fingerprint registry live in one directory, resolved rather than assumed. First hit wins:

1. `SCROLLCRAFT_HOME`
2. the nearest `.scrollcraft.json` walking up from the current directory: `{ "workspace": "path/to/builds" }`
3. `/scrollcraft`

Builds land in `/builds//`; your registry is `/FINGERPRINTS.md`.

**Your registry starts empty, and that is correct.** The gate exists to stop you repeating *yourself*, so your first build has nothing to clear and every build after it does. `EXAMPLES.md` is the author's twelve-row table, included so you can see what a filled registry looks like and which shapes tend to collide. It is illustration, not constraint.

## What is in here

```
plugins/nateherk-design/
└── skills/scrollcraft/
    ├── SKILL.md            the procedure: interview, grammar, score, build, verify
    ├── references/
    │   ├── uniqueness.md   eight page grammars, the signature move, the fingerprint gate
    │   ├── feel.md         the feeling curve, the engineered peak, the feel check
    │   ├── devices.md      nine scroll devices and the cue contract
    │   ├── worldflight.md  continuous-world mode: one fixed stage, no seams
    │   ├── worlds.md       art direction, and the style-preamble method
    │   ├── taste.md        the design floor: spacing, type, colour, depth, motion
    │   ├── assets.md       generation, camera moves, encoding for scrubbing
    │   ├── verify.md       the harness, and what it cannot tell you
    │   └── template.html   a starting skeleton, not a layout
    ├── engine/             scrollcraft.js + .css. The mechanism, never edited per project
    ├── templates/          the empty registry a new workspace is seeded from
    └── scripts/            doctor · workspace · kie · encode · serve · shoot · worldflight-assert
```

`CHANGELOG.md` is worth reading on its own: it records what broke on each build and the rule that came out of it, rather than a feature list.

## The one rule that matters most

The engine is the mechanism and it is **never edited per project**. Theme it with six colour tokens and two fonts, write your own semantic HTML, and drive anything bespoke off the `--sc-p` custom property the engine publishes. A runtime that builds the page from a config object is exactly why every site built on one looks the same.

## Honest limitations

- **Only ever run on Windows.** The scripts look for ffmpeg and Chrome in Windows, macOS and Linux locations, but no build has been done on a Mac. `SCROLLCRAFT_FFMPEG` and `SCROLLCRAFT_CHROME` override the search.
- **Generated video is not free.** A ten-leg continuous-world flight is a real spend. A page built from your own assets costs nothing.
- **It is opinionated on purpose.** It will refuse the layouts and palettes that make AI pages recognisable, and it will argue with you about your peak. If you want a page that looks like everything else, this is the wrong tool.

## Licence

MIT. See LICENSE.
