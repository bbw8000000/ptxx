---
title: "maria-rcks/dinorip"
owner: "maria-rcks"
name: "dinorip"
fullName: "maria-rcks/dinorip"
description: "Free & Open Source Texture Ripper"
sourceUrl: "https://github.com/maria-rcks/dinorip"
stars: 296
forks: 10
language: "TypeScript"
topics: ["game-development", "ps1", "psx", "ripper", "texture-rip", "texture-ripper", "textures"]
license: "MIT"
homepage: "https://dinorip.lakebed.app"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-28T19:46:38Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# DinoRip

*图片：DinoRip screenshot*

Desktop texture ripper for building PNG textures and texture atlases from
reference images.

> Attribution: DinoRip is a remake of puck_psx's original texture ripper.
> Please support the original project:
> [Buy the original version](https://puszke.itch.io/pucks-texture-ripper).

## Features

- Load PNG, JPG, and JPEG source images, or paste image files from the clipboard.
- Add perspective rippers, move corners, bend edges, and extract textures.
- Auto-extract edited rippers into the atlas workspace.
- Move, resize, rotate, pack, and size atlas textures.
- Edit texture color with brightness, contrast, saturation, hue shift,
  grayscale, invert, sharpen, posterize, dithering, and saved presets.
- Apply texture adjustments to one texture or all atlas textures.
- Export the selected texture, every texture, or the full atlas as PNG.
- Use undo/redo, pan/zoom, fullscreen, and the in-app shortcuts overlay.


## Shortcuts

> On macOS the modifier is **⌘** (Command); on Windows/Linux it is **Ctrl**.

### General

| Action | Shortcut | Demo |
| --- | --- | --- |
| Undo | ⌘/Ctrl + Z |  |
| Redo | ⇧ + ⌘/Ctrl + Z, or ⌘/Ctrl + Y |  |
| Toggle fullscreen | ⌘/Ctrl + F |  |
| Paste from clipboard | ⌘/Ctrl + V |  |
| Zoom | Mouse wheel | *图片：Zoom demo* |
| Pan the view | Middle-drag, or drag empty canvas | *图片：Pan the view demo* |
| Delete selection | Delete / Backspace |  |

### Ripper

| Action | Shortcut | Demo |
| --- | --- | --- |
| Add a ripper | A |  |
| Extract the ripper | Enter |  |
| Select a ripper | Click it | *图片：Select a ripper demo* |
| Move the ripper | Drag inside the ripper | *图片：Move the ripper demo* |
| Move a corner | Drag a corner | *图片：Move a corner demo* |
| Scale the ripper | ⌘/Ctrl + drag a corner | *图片：Scale the ripper demo* |
| Add a corner | Middle-click an edge |  |
| Delete a corner | Middle-click a corner, or Alt/Option + click a corner |  |
| Bend an edge | ⌘/Ctrl + drag an edge | *图片：Bend an edge demo* |
| Reshape a curve | Drag a curve handle |  |
| Remove a curve | Double-click a curve handle |  |
| Select/deselect a corner | ⇧ + click a corner |  |
| Move selected corners | Drag a selected corner |  |
| Marquee-select corners | ⇧ + drag empty canvas |  |
| Move a source image | ⇧ + drag the image |  |

> Cmd/Ctrl-scaling or moving the ripper transforms any curve control points along with the corners, so curved edges keep their shape.

### Atlas

| Action | Shortcut | Demo |
| --- | --- | --- |
| Apply adjustments | S |  |
| Select a texture | Click it |  |
| Move a texture | Drag the texture |  |
| Resize a texture | Drag a corner |  |
| Resize one side | Drag an edge |  |
| Resize proportionally | ⇧ + drag a corner |  |
| Rotate a texture | Drag the rotation handle |  |
| Snap rotation to 45° | ⇧ + drag the rotation handle |  |
| Delete the texture | Delete, or Backspace |  |
| Toggle conserve / rectify | Right-click the texture |  |


## Development

```sh
pnpm install
pnpm dev
```

Useful checks:

```sh
pnpm typecheck
pnpm test
pnpm lint
pnpm build
```

## Requirements

- Node.js 18+
- pnpm 11+

## License

MIT
