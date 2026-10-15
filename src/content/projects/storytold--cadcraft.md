---
title: "storytold/cadcraft"
owner: "storytold"
name: "cadcraft"
fullName: "storytold/cadcraft"
description: "CADCraft: computer-aided design and drafting — an open-source, clean-room AutoCAD-style app in pure Rust"
sourceUrl: "https://github.com/storytold/cadcraft"
stars: 1444
forks: 607
language: "Rust"
topics: []
license: "Apache-2.0"
defaultBranch: "main"
snapshotDate: "2026-10-10"
pushedAt: "2026-10-10T02:51:15Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

CADCraft


  Computer-aided design and drafting; an open-source, clean-room reimplementation of Autodesk AutoCAD, rebuilt in pure Rust.


  A fast, open-source take on the AutoCAD workflow: the command line, object snaps, layers,
  dimensions, hatches, blocks and DXF drawings you already know. It runs natively on macOS,
  Windows, Linux and FreeBSD, and in the browser via WebAssembly.
  By the ArtCraft team.


  
  
  
  
  


  


  CADCraft on getartcraft.com ·
  ArtCraft ·
  All Crafting Apps


  
  Apartment plan (examples/apartment.dxf): walls with pick-point hatching, TrueType MTEXT room labels, a TABLE, a multileader and architectural dimensions — built entirely from CADCraft commands.


> [!NOTE]
> **ArtCraft is a community of artists from all walks of life.** Painters, photographers,
> filmmakers, illustrators, designers, animators, hobbyists, and people who picked up a pencil
> last week. If you make things, you're one of us. **[Come say hi on Discord](https://discord.gg/artcraft).**


  Screenshots ·
  Why CADCraft ·
  What works today ·
  Quick start ·
  Agents, MCP and the CLI ·
  Architecture ·
  Roadmap ·
  Downloads ·
  The Crafting Apps ·
  License and credits


## Screenshots


  
    
    
  
  
    Layouts: paper space with viewports, page setups and PLOT to PDF. Double-click a viewport to work in model space through it.
    Mounting bracket: a two-view part drawing with centre lines, hidden lines, an ANSI31 section hatch and a title block.
  


## Why CADCraft

- **The workflow you know.** Type `L`, click two points, type `@5<45`, press Enter. The command
  line, prompts with clickable `[Keywords]`, AutoComplete, object snaps, polar tracking, ortho,
  direct distance entry, window and crossing selection, grips, and right-click-to-repeat behave
  the way decades of drafting habit expect.
- **Open files.** DXF is read and written natively (ASCII and binary, R12 through 2018), and DWG
  files (R13 through 2018) open and save through the open-source acadrust library. Export to SVG
  and PNG today.
- **Fast and native.** Pure Rust and egui, no Electron, no web view. One binary on macOS
  (universal), Windows, Linux and FreeBSD, plus a WebAssembly build for the browser.
- **Built for agents.** Every menu item, tool and prompt is a command. Agents can type at the
  command line exactly like a person, call any command with JSON, inspect the drawing to verify
  their work, and render it — over MCP, a JSON control channel, or the CLI.
- **Free.** MIT OR Apache-2.0, with no account and no subscription.

## What works today

CADCraft is in early, fast development. Honest status (see ROADMAP.md for parity
numbers):

| Area | Status |
|---|---|
| Drawing area | Model space with adaptive grid, axes, pan/zoom (wheel, middle-drag, pinch), crosshair cursor with pickbox, UCS icon, ViewCube, viewport label |
| Command line | Prompts with keywords, history, AutoComplete, aliases, `@dx,dy`, `@d` in the file names is the version number, and `SHA256SUMS.txt` lists a checksum for every file.

### Windows

| Build | Installer | Portable |
|---|---|---|
| x64 (64-bit Intel/AMD) | `cadcraft--windows-x64.msi` | `cadcraft--windows-x64-portable.zip` |
| arm64 (Snapdragon and other ARM PCs) | `cadcraft--windows-arm64.msi` | `cadcraft--windows-arm64-portable.zip` |
| x86 (32-bit) | `cadcraft--windows-x86.msi` | `cadcraft--windows-x86-portable.zip` |

Installers and executables are code-signed.

### macOS

| Build | File | Notes |
|---|---|---|
| App, universal (Apple silicon + Intel) | `cadcraft--macos-universal.dmg` | Signed and notarized |
| Command-line tool, universal | `cadcraft-cli--macos-universal.zip` | Signed and notarized |

### Linux

| Format | x86_64 | aarch64 (ARM64) | Notes |
|---|---|---|---|
| AppImage | `cadcraft--linux-x86_64.AppImage` | `cadcraft--linux-aarch64.AppImage` | Runs anywhere; updates itself with AppImageUpdate (`.zsync` files) |
| Flatpak | `cadcraft--linux-x86_64.flatpak` | `cadcraft--linux-aarch64.flatpak` | Sandboxed; `flatpak install --user ` |
| Debian/Ubuntu | `cadcraft--linux-x86_64.deb` | `cadcraft--linux-aarch64.deb` | |
| Fedora/RHEL/openSUSE | `cadcraft--linux-x86_64.rpm` | `cadcraft--linux-aarch64.rpm` | |
| Tarball | `cadcraft--linux-x86_64.tar.gz` | `cadcraft--linux-aarch64.tar.gz` | Unpack anywhere |

### FreeBSD

| Build | File |
|---|---|
| x86_64 | `cadcraft--freebsd-x86_64.tar.gz` |

### Web (WebAssembly)

| Build | File | Notes |
|---|---|---|
| Static site | `cadcraft-web-.zip` | Runs in a modern browser; host it on any static server |

## The Crafting Apps

CADCraft is one of the **Crafting Apps**: free, open-source creative tools from the
[ArtCraft](https://getartcraft.com/) team, each written from scratch in Rust and each able to
stand on its own.

| | App | What it's for | Code | Learn more |
|:-:|---|---|---|---|
|  | **PhotoCraft** | Image editing: layers, masks, type and real PSD files | GitHub | [Website](https://getartcraft.com/apps/photocraft) |
|  | **VectorCraft** | Vector illustration | GitHub | [Website](https://getartcraft.com/apps/vectorcraft) |
|  | **FilmCraft** | Video editing, color and sound | GitHub | [Website](https://getartcraft.com/apps/filmcraft) |
|  | **LightCraft** | Photo library and raw development | GitHub | [Website](https://getartcraft.com/apps/lightcraft) |
|  | **PdfCraft** | Reading, organizing and protecting PDFs | GitHub | [Website](https://getartcraft.com/apps/pdfcraft) |
|  | **EffectCraft** | Motion graphics and visual effects | GitHub | [Website](https://getartcraft.com/apps/effectcraft) |
|  | **DesignCraft** | Page layout and publishing | GitHub | [Website](https://getartcraft.com/apps/designcraft) |
|  | **CADCraft** | **Computer-aided design and drafting · you are here** | GitHub | [Website](https://getartcraft.com/apps/cadcraft) |

And [**ArtCraft**](https://getartcraft.com/) itself, our AI image and video studio for artists who want real control.


  


Come make things with us


  Our Discord is where artists of every kind hang out: people who paint, shoot, draw, cut film,
  set type, and people still figuring out what they like to make. Share what you're working on,
  ask for help, tell us what's broken, or tell us what you wish these tools could do.
  Whatever your medium and however long you've been at it, you're welcome here.


  discord.gg/artcraft ·
  getartcraft.com ·
  The Crafting Apps ·
  CADCraft


## License and credits

CADCraft is dual-licensed under MIT or Apache-2.0, at your option.
Copyright (c) 2026 ArtCraft Team and the CADCraft contributors. Required notices are in NOTICE.

Bundled fonts, icons, images and other assets keep their own open licenses; each one is listed
with its author, source and license in ATTRIBUTION.md.

CADCraft's icons, its single-stroke drafting font, its hatch patterns and its linetypes are all
original work, drawn or defined in code. The sample drawings are generated in code too.

The ArtCraft name, wordmark and logos in `docs/brand/` are trademarks of the
ArtCraft Team and are not covered by this license. They may be used only unmodified, and only as
part of this repository and CADCraft, under `docs/brand/LICENSE-brand.txt`.
Forks and modified versions must remove them.

Autodesk, AutoCAD and DWG are trademarks or registered trademarks of Autodesk, Inc. in the United States and/or other countries. CADCraft is an independent, open-source project and is not affiliated with, sponsored by or endorsed by Autodesk, Inc.; these names are used only to describe the workflows and file formats it is compatible with.


  
  Made by the ArtCraft team and community.
