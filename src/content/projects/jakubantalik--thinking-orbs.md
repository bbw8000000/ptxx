---
title: "Jakubantalik/thinking-orbs"
owner: "Jakubantalik"
name: "thinking-orbs"
fullName: "Jakubantalik/thinking-orbs"
description: "Dotted thought-orb loading indicators for AI & agent UIs — six tuned states, two sizes, auto dark/light"
sourceUrl: "https://github.com/Jakubantalik/thinking-orbs"
stars: 211
forks: 14
language: "TypeScript"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-07-22"
pushedAt: "2026-07-21T21:33:07Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# thinking-orbs

Dotted thought-orb loading indicators for AI & agent UIs. Six hand-tuned animated states, each shipped at two purpose-tuned sizes, rendered on a plain 2D canvas — no WebGL, no filters, works identically in Chrome, Safari and Firefox.

[Live demo](https://orbs.jakubantalik.com) · Repository · Report an issue

## Install

```bash
npm install thinking-orbs
```

## Quick start

```tsx
import { ThinkingOrb } from 'thinking-orbs';

function Status() {
  return ;
}
```

## States

Six verbs an agent can be doing, each a distinct animation:

```tsx
    {/* particles on tilted orbits */}
  {/* a scan meridian sweeps a dotted globe */}
    {/* bands scramble, then click back solved */}
  {/* a waveform rolls through the rings */}
  {/* an undulating multi-band sash */}
    {/* dotted outline: circle → triangle → square */}
```

## Sizes

Two tuned presets — separate designs, not a scale factor. `64` for chat-avatar scale, `20` for inline-text scale. Each carries its own dot count, dot size and speed tuning:

```tsx


```

## Theme

Strictly monochrome — light ink for dark backgrounds, dark ink for light backgrounds — with the mode picked automatically from the host project:

```tsx
   {/* default — detects from the project */}
   {/* pin: light dots for dark backgrounds */}
  {/* pin: dark dots for light backgrounds */}
```

`auto` resolves in three layers and updates live when any of them change:

1. an ancestor `data-theme="dark|light"` attribute or `dark`/`light` class (the Tailwind / shadcn convention), watched via `MutationObserver`;
2. otherwise `prefers-color-scheme`, subscribed for live OS theme switches;
3. SSR-safe — the canvas paints only on the client, after the theme has resolved.

## Other props

```tsx

```

All other `` props (`className`, `style`, `data-*`, …) pass through.

## Accessibility & performance

- `role="img"` with a sensible per-state `aria-label` out of the box.
- `prefers-reduced-motion: reduce` renders a static representative frame — no animation — and still follows the live theme.
- Every instance pauses automatically when scrolled offscreen (`IntersectionObserver`) or when the tab is hidden, and resumes in phase — all instances share one clock.
- Plain 2D canvas arcs only: no `ctx.filter`, no SVG filters, no WebGL — the same pixels everywhere, cheap on low-end devices. Device-pixel-ratio capped at 2.

## License

MIT © Jakub Antalik
