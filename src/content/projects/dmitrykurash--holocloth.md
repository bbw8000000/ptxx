---
title: "dmitrykurash/holocloth"
owner: "dmitrykurash"
name: "holocloth"
fullName: "dmitrykurash/holocloth"
description: "Real-time holographic cloth design tool. Drape posters and graphics on simulated fabric — iridescent foil shader, Verlet cloth physics, macro depth of field, film grain, bump maps, and transparent PNG export. Built with Three.js (WebGL 2), React, and DialKit. Physics and shaders written from scratch."
sourceUrl: "https://github.com/dmitrykurash/holocloth"
stars: 64
forks: 6
language: "TypeScript"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-07-25"
pushedAt: "2026-07-22T15:58:49Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Holocloth

A little browser tool for playing with holographic fabric.

You get a sheet of simulated cloth floating in space. You can grab it, throw it around, drape your own images over it, and watch them ripple like they're printed on holo foil. When it looks good — export a PNG.

*图片：Holocloth*

## What it does

- **Real cloth physics** — grab the sheet and pull. It wrinkles, settles, and floats like fabric in gel. Written from scratch (Verlet integration, no physics library).
- **Holographic material** — an iridescent foil shader with rainbow diffraction, sparkle, and bump maps. Also chrome and black cloth presets.
- **Your images** — upload any image or SVG and it becomes the cloth, or a sticker on top of it. Everything bends and folds with the fabric.
- **Camera looks** — macro depth of field (click to pick a focus point), ambient occlusion in the folds, film grain, bloom.
- **Export** — one click PNG, with or without the background.
- **Versions** — save looks and switch between them while you work.

## Controls

| Action | How |
|---|---|
| Grab the cloth | Click + drag on it |
| Orbit the camera | Drag empty space |
| Pan | Hold `Space` + drag, or right-drag |
| Zoom | Scroll |
| Move a sticker | Turn on `Edit` in the Images panel, then drag it |

## Run it

One line (needs Node 20+ and git):

```bash
git clone https://github.com/dmitrykurash/holocloth.git && cd holocloth && npm install && npm run dev
```

Then open the local URL Vite prints — usually `http://localhost:5199`.

## Tech

- [Three.js](https://threejs.org) (WebGL 2) — rendering
- [React](https://react.dev) + TypeScript + [Vite](https://vite.dev)
- Custom GLSL: the holo foil shader, a circle-of-confusion depth of field pass, film grain
- Custom cloth simulation: Verlet integration with structural, shear, and bend constraints
- DialKit by [Josh Puckett](https://x.com/joshpuckett) — the control panel UI

## Credits

Made by [Dmitry Kurash](https://x.com/DmitryKurash).

UI powered by DialKit — a lovely little library by [Josh Puckett](https://x.com/joshpuckett) for dialing in interface parameters.
