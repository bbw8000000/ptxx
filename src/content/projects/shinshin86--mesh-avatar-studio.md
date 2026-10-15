---
title: "shinshin86/mesh-avatar-studio"
owner: "shinshin86"
name: "mesh-avatar-studio"
fullName: "shinshin86/mesh-avatar-studio"
description: "Turn one illustration into an animated 2D mesh avatar with a coding agent and a local editor"
sourceUrl: "https://github.com/shinshin86/mesh-avatar-studio"
stars: 170
forks: 15
language: "TypeScript"
topics: ["2d-animation", "avatar", "claude-code", "codex", "mesh-deformation", "vtuber", "webgl"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-10-05"
pushedAt: "2026-10-04T22:30:05Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Mesh Avatar Studio

日本語

Turn a single illustration into an animated 2D mesh avatar: it blinks, talks, turns its head,
breathes and sways its hair. A coding agent prepares the avatar from your image; you fine-tune
it in a local editor with a live preview.

*图片：The editor with the Miko sample*

## Try the sample

Requires Node.js 22.17+.

```sh
npm install
npm run dev
```

Open the URL printed in the terminal (for example `http://127.0.0.1:5173/`). The editor opens
the bundled sample, Miko in a qipao. Pick a part on the left, drag its dots on the image and
watch the preview on the right. The sample is read-only; when you change it, choose
**Copy and keep editing** to continue in your own copy.

## How it works

Making an avatar from your own illustration takes four steps. Steps 1 and 4 are done by a
coding agent (Claude Code or Codex) working in this repository; steps 2 and 3 happen in the
editor.

### 1. Ask your agent to create the avatar

Open Claude Code or Codex in this repository folder and give it your illustration:

> Create an avatar from this image following docs/agent-guide.md: `/path/to/your-image.png`

The agent follows the agent guide: it checks how accurately it reads
coordinates, places the rig on zoomed grids, cuts the image into layers and reviews the
avatar in fixed poses. The project is saved in `projects//`, which is never committed.
Best results come from a front-facing, head-and-shoulders PNG with a transparent background.
When no project is open, the editor shows this request ready to copy.

*图片：The request for a new avatar*

Recommended setups:

| Agent | Model |
|---|---|
| Claude Code | Claude Opus 5.5 |
| Codex | GPT-6.1 Sol |

### 2. Open the project and check it

Start the editor (`npm run dev`), choose **Open project** and pick your project from the list.
In the preview, use **Pose test** to turn and tilt the head and close the eyes, and
**Lip sync** to check the vowel mouth shapes.

*图片：Lip sync check*

### 3. Fix what looks wrong by dragging

Select a part on the left. Its dots are highlighted on the image; drag them to fix the
placement. The preview follows your changes immediately. Some values also decide how the image
is cut into layers: eye and hand outlines, and the head, hair and bun areas used for the hair
mask. After changing those, a banner appears; choose **Save and rebuild layers** there. It takes
a few seconds.

*图片：Editing the eye outline*

*图片：Rebuilding layers after changing an outline*

Zoom with a pinch or Ctrl/Cmd+scroll, pan with two fingers or by dragging empty space, and use
**Fit selected part** to jump to the current part.

### 4. Get drawn eyes and mouths

Without drawings, the eyes and mouth move by mesh deformation alone. Drawn closed eyes and
vowel mouths make blinking and talking look much more natural. In **Drawn variants**, check
**Eyes**, **Mouth** or both, copy the message and paste it into Codex opened in this
repository folder. Codex draws them with its built-in image generation and imports them; the
editor reloads them automatically. (Claude Code cannot generate images; its message prepares
the masks and prompts for you to hand to an image generator.)

*图片：Requesting drawn mouths*

## More

- Agent guide: the step-by-step procedure agents follow
- Reference: projects, building layers by hand, all editor controls, tests
- Rig fields: what every value in `rig.json` means

## License

The code is released under the MIT License.

The sample character Miko (`samples/miko-qipao/`) is not covered by the MIT License. Miko is the
character of AITuber OnAir, © Yuki Shindo (AITuber OnAir), and her images are provided under the
[Miko Character Usage Guidelines](https://miko.aituberonair.com/#terms); see
samples/miko-qipao/MIKO_ASSET_TERMS.md. They may be used
and modified as part of your own works, but not redistributed on their own or as an asset
collection. This project is not an official AITuber OnAir product.
