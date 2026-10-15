---
title: "ddoemonn/interior"
owner: "ddoemonn"
name: "interior"
fullName: "ddoemonn/interior"
description: "micro-interactions for react, built for the half-second after a click"
sourceUrl: "https://github.com/ddoemonn/interior"
stars: 394
forks: 11
language: "TypeScript"
topics: ["animation", "micro-interactions", "motion", "react", "ui-components"]
license: "MIT"
homepage: "https://interior.dev"
defaultBranch: "main"
snapshotDate: "2026-08-02"
pushedAt: "2026-07-31T14:02:53Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# interior[.]dev


Micro-interactions for React, built for the half-second after a click.

Everybody builds these components. Almost nobody finishes them. The missing
twenty percent is always the same three things: a jump, a restart, an animation
that ignores the person watching it. This set ships that last twenty percent.

## How it works

There is no package. Every component is one file in
`components/interior/` that you copy into your project.
Each file exports two things:

- a headless hook (`useX`) that owns all the behaviour and touches zero class names
- a styled component (`X`) built on the hook, as an example you can keep or replace

The behaviour lives entirely in the hook, so reskinning a component to your own
design language costs nothing but classes. The only dependency is
[`motion`](https://motion.dev).

## The idea

Trust is won in the half-second after a click, and lost in exactly the same
place. A button that resizes when its label changes, a list that jumps as it
loads, a drag that gets stuck because the tab lost focus: none of these are
bugs anyone files, but every one of them teaches the person to stop believing
the interface.

So every component here is argued out to the frame. Nothing moves unless
something happened; motion that models a physical process obeys that process
instead of taste; every state the component can reach has its space reserved
before it arrives; and every gesture knows all the ways it can be abandoned.
The keyboard is not a fallback but a second complete implementation, and under
`prefers-reduced-motion` the information still arrives; only the trip is
skipped.

## Running the docs

```
bun install
bun run dev
```

The design language behind every decision lives in DESIGN.md.
