---
title: "OpenLabs-so/oa-design"
owner: "OpenLabs-so"
name: "oa-design"
fullName: "OpenLabs-so/oa-design"
description: "The Open Analytics design language as an agent skill: component recipes with type-checked source, token CSS, and a CLI. Works with Claude Code, Cursor, or any agent."
sourceUrl: "https://github.com/OpenLabs-so/oa-design"
stars: 112
forks: 5
language: "TypeScript"
topics: ["agent-skill", "ai-agents", "analytics", "claude-code", "design-system", "motion", "react", "tailwindcss"]
license: "MIT"
homepage: "https://getopen.so"
defaultBranch: "main"
snapshotDate: "2026-08-23"
pushedAt: "2026-08-20T19:25:29Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# oa-design

The design language of [Open Analytics](https://getopen.so), packaged three
ways: an agent skill, type-checked component recipes, and a CLI. People kept
asking how the dashboard looks and moves the way it does; this repository is
the answer, in a form an agent can execute. Every hex code, spring constant,
radius and easing is lifted from the shipped product, with the reasoning
attached.

The look in one sentence: **white surfaces with continuous-curvature corners,
resting on a quiet grey stage, drawn in a single ink, moved by a single
spring.**

## Get it

**CLI** (recipes into your project, shadcn-style):

```sh
npx getopen-design list                  # what's available
npx getopen-design add tab-bar toast     # recipes into ./oa-design
npx getopen-design add --all --code      # everything, .tsx source included
npx getopen-design tokens                # just the token CSS
npx getopen-design skill                 # agent skill into .claude/skills
```

**Claude Code**, without the CLI:

```sh
git clone https://github.com/OpenLabs-so/oa-design
cp -r oa-design/skills/oa-design .claude/skills/oa-design
```

**Any other agent** (Cursor, Codex, plain chat): grab
`DESIGN-SKILL.md`, the whole language compiled into one
file, and point your rules at it:

```
When building or styling UI, follow DESIGN-SKILL.md in full.
```

## What's in the box

```
skills/oa-design/     the agent skill
├── SKILL.md          ten rules, the spring table, the index
├── _root.css         the installable token block everything reads from
├── 01…12-*.md        one recipe per component, full source embedded
└── _*.md             guides: tokens, layout, components, motion, landing, copy

components/           the type-checked source the recipes embed
├── _lib/             cn + the seven springs as constants
└── /           squircle-card, button, dropdown, tab-bar, modal,
                      multi-step-dialog, skeleton, notice-strip,
                      floating-pill, toast, header-morph, reveal

cli/                  the getopen-design npm package
DESIGN-SKILL.md       everything in one file, for pasting
```

The recipes are the consumer format and they are never written by hand:
`node build/sync.mjs` injects the compiled source from `components/` into
each recipe (and `--cli` mirrors the payload into the npm package), so the
code in the MDs is exactly the code `npm run typecheck` passes.

## What's inside the language

- One ink, every neutral derived from it by `color-mix` percentages.
- The squircle surface system (CSS `shape()` clip-path, both layers, exact
  radii) behind the cards.
- A seven-spring motion vocabulary covering the entire product, plus the
  signature moves: the measured-height dialog choreography, the tab bar's
  label mask, the landing header's glass morph, the blur skeleton arrival.
- Layout as plates, fixed-height card grids, the notice and floating-pill
  patterns, toast physics.
- The copy voice, because half the design is the words.
- The quality floor: focus rings, reduced motion, no sideways scroll.

## What this is not

Not a component library and not a theme package: nothing here depends on us
at runtime. The values were written against React + Tailwind v4 +
[`motion`](https://motion.dev), but they are plain CSS numbers and spring
constants; port them anywhere. If your project already has a design system,
yours wins; use this to fill gaps.

## Credits

- Built from the shipped UI of [Open Analytics](https://getopen.so), which is
  itself open source.
- The repository shape (recipes + skill + CLI from one source) follows
  Jakub Antalik's transitions.dev,
  which also inspired our skeleton blur arrival. Thank you.

## License

MIT. Use it, ship it, sell what you build with it. A link back is
appreciated but not required.
