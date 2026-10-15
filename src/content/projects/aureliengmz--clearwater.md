---
title: "Aureliengmz/clearwater"
owner: "Aureliengmz"
name: "clearwater"
fullName: "Aureliengmz/clearwater"
description: "Real-time, photoreal shallow water in a single HTML file. WebGL2, no libraries, no build step."
sourceUrl: "https://github.com/Aureliengmz/clearwater"
stars: 420
forks: 76
language: "HTML"
topics: ["caustics", "fft", "realtime-rendering", "shaders", "single-file", "water", "webgl2"]
license: "MIT"
homepage: "https://aureliengmz.github.io/clearwater/"
defaultBranch: "main"
snapshotDate: "2026-09-26"
pushedAt: "2026-09-23T13:20:28Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Clearwater

Real-time, photoreal shallow water in a single HTML file. WebGL2, no libraries, no build step, no external assets.

**[Live demo](https://aureliengmz.github.io/clearwater/)** · drag to look around · tap the water

*图片：Clearwater*

## Run

Open `index.html` in a browser, from disk or any static host. Nothing to install.

Needs WebGL2 with float render targets (`EXT_color_buffer_float`). Resolution adapts to keep the frame rate up.

| URL option | Effect |
| --- | --- |
| `?debug` | Frame rate, resolution, quality level |
| `?noglare` | Disable lens-diffraction glare |
| `?t=5` | Freeze time at 5 s (screenshots) |
| `?yaw=0.5&pitch=-0.4` | Initial camera direction, radians |
| `?view=caus` | Show the raw caustics texture |

## Code map

Everything lives in `index.html`, in sections marked `/* ---- Name ---- */`:

| Section | What to tweak |
| --- | --- |
| Ocean spectrum (FFT) | `L` patch size, `DEPTH`, `TARGET_SLOPE` wave steepness |
| Interactive ripples | `RN`, `RSIZE` simulation grid |
| Caustics | `G` ray grid, `C` caustics resolution, `IORS` per-channel refraction |
| Main water shader | Fresnel, absorption, seabed shading (GLSL) |
| Post / Lens diffraction glare | Bloom, glare, tone curve, grain |
| Camera & input | `SUN_EL`, `SUN_AZ` sun position, `VFOV` |
| Loop | Frame loop, adaptive quality |

The seabed texture is base64 in `` at the end of the file. To regenerate it: `python tools/make_pebbles.py` (numpy, scipy, pillow), then paste the base64 JPEG into that block.

## References

- Jerry Tessendorf, *Simulating Ocean Water*: FFT waves
- Evan Wallace, *WebGL Water*: refracted-grid caustics
- Inigo Quilez, *Texture repetition*: seabed tiling
- Marc Olano & Dan Baker, *LEAN Mapping*: distant highlights

## Credits

 Made by [Aurélien](https://x.com/Aurelien_Gz) at
 [Lumaris](https://lumaris.works).

MIT License, see LICENSE.
