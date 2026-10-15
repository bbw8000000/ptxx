---
title: "blendi-remade/unreel"
owner: "blendi-remade"
name: "unreel"
fullName: "blendi-remade/unreel"
description: "Your personal AI video streaming service"
sourceUrl: "https://github.com/blendi-remade/unreel"
stars: 111
forks: 21
language: "TypeScript"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-04"
pushedAt: "2026-09-03T01:52:05Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# UNREEL

**Endless television. Written and rendered while you watch.**

UNREEL is a streaming service where nothing on it exists until you press play. Pick a title and a showrunner LLM writes the episode a few shots at a time while [MiniMax H3 Max Turbo](https://fal.ai/models/minimax/h3-max-turbo/text-to-video) renders each shot live on [fal](https://fal.ai). Turbo renders faster than the clip plays, so the next shot is always finished before the current one ends. That one fact is what makes an infinite channel possible.

*图片：The UNREEL browse page*

## What is on it

**Original films.** Fourteen of them, across hard sci-fi, cyber-noir, western, folk horror, heist, romance, boxing, dark fantasy and more. Each one is a single continuous take: every shot starts from the exact last frame of the previous one, so the film keeps its characters, its light and its place while the story moves. Dialogue is scripted word for word and shown as captions.

**Live channels.** Eight brainrot channels that hard-cut between escalating gags. Capybara News Network, Goblin Tax Season, Toaster Court, Dad Rock Volcano. Never the same twice.

Every cover is key art painted by [Nano Banana 2](https://fal.ai/models/fal-ai/nano-banana-2) with the title typography rendered into the image. Every card hover, billboard loop and cold open is a Turbo clip.

*图片：Hollow Creek, mid-watch*

## How a stream works

```
press play
  │
  ├─ the pre-rendered preview plays instantly as the cold open
  ├─ the showrunner writes 1 shot (about 2s), then 4, then 10 at a time
  └─ shot 1 renders from the cold open's last frame (about 2.5s)
        │
        ▼
  each shot renders while the previous one plays,
  chaining from its last frame, and the buffer grows
        │
        ▼
  the player swaps to the next clip the instant the current one ends
```

A few details that matter:

- **Speech.** The video model babbles unless voices are declared wordless, and speaks a line cleanly only when the prompt quotes it verbatim. The showrunner writes every line in quotes; the code adds the matching sound clause and shows the line as a caption. Verified with Whisper.
- **Continuity.** Story shots use image-to-video from the previous shot's last frame, grabbed in the browser from a same-origin proxy. A rendered clip becomes playable the moment it exists; only the next shot waits for the frame.
- **Pacing.** At 480P an 8-second shot renders in about 2.5 seconds, so the buffer fills within two shots. 768P renders in about 5 seconds and barely keeps pace once the frame handoff is added, so 480P is the default. It is one constant in `lib/stream.ts`.
- **Opening.** The first LLM call is on the critical path and LLM latency has a long tail, so it is hedged: two identical requests, first to parse wins. If the first shot still misses the end of the cold open, the player holds the last frame for a beat rather than showing a spinner. The next shot starts from that frame, so the cut is seamless.
- **Keys.** `FAL_KEY` stays server-side behind `@fal-ai/server-proxy`. Clips stream through a small media proxy so canvas frame grabs never hit CORS.

## Stack

- Next.js 15, React 19, TypeScript. No UI framework.
- [fal](https://fal.ai) for everything generated: MiniMax H3 Max Turbo for video, Nano Banana 2 for key art, Gemini 2.5 Flash via fal's LLM router for the showrunner.
- A small client-side state machine (`lib/stream.ts`) that owns the shot queue, the render buffer and the last-frame chain.

## Quick start

```bash
npm install
cp .env.example .env.local   # add your fal key
npm run catalog              # paints 22 covers and films 22 previews, about 2 minutes
npm run dev
```

Get a key at [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys). The catalog build is a one-off and costs roughly $0.08 per cover and $0.06 per preview. `npm run catalog` skips titles that are already built; use `--force`, `--only `, `--covers` or `--previews` to rebuild parts of it.

## Cost while watching

A story title renders an 8-second shot roughly every 8 seconds of playback. A chaos channel renders 5-second shots two at a time. At Turbo's current rate a ten-minute session is well under a dollar, plus a few cents of LLM calls. Close the tab to stop.

## Add a title

Everything lives in `catalog/titles.mjs`: a logline, a premise for the showrunner, a visual style appended to every shot, a key-art prompt and a preview prompt. Set `mode` to `story` for a chained film or `chaos` for a hard-cutting channel, add the id to a row, run `npm run catalog -- --only your-id`, and it is on the shelf.

Rename the whole service in `lib/brand.ts`.
