---
title: "kaolti/monolith-terrain"
owner: "kaolti"
name: "monolith-terrain"
fullName: "kaolti/monolith-terrain"
description: "Interactive 3D topographic map — real-world elevation data rendered as a vintage USGS topo sheet with a sci-fi HUD. Three.js."
sourceUrl: "https://github.com/kaolti/monolith-terrain"
stars: 104
forks: 12
language: "JavaScript"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-07-07T12:58:14Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# MONOLITH — interactive 3D topographic map

An interactive, real-time 3D terrain map in the style of a vintage USGS topographic sheet, crossed with a sci-fi FUI overlay. Load **real-world elevation data** for anywhere on Earth, or generate procedural mountain ranges — then explore them with contour lines, hypsometric tinting, survey grids, spot elevations, clickable peak markers, radar scans, and cinematic camera tours.

**Live demo:** https://kaolti.github.io/monolith-terrain/

## How to use

| Action | How |
|---|---|
| Look around | Drag to orbit, scroll to zoom, right-drag to pan |
| Inspect a peak / basin | Click a `PK-xx` / `DEP-xx` marker — the camera flies in and a data panel opens |
| Go back | Click ✕ on the panel — the camera returns to where you were |
| Cinematic flyover | Open **Tour**, pick *from* / *to*, press **▶ start tour** (drag to cancel mid-flight) |
| Radar scan | **HUD → trigger scan** — a wave sweeps the terrain and physically lifts the surface |
| Change location | **Terrain source → location** presets, or *Custom* + latitude/longitude, then **load location** |
| Save your settings | **copy parameters** puts the full state on your clipboard as JSON |

### Terrain sources

- **real world (DEM)** — fetches elevation tiles for the chosen coordinates and rebuilds the map with true landforms. Spot elevations and peak data show real values.
  - **detail (zoom)** — z10–14: how large an area you get (z12 ≈ 28 km across, z13 ≈ 14 km)
  - **vertical scale** — relief exaggeration; real proportions read flat at map scale, so 1.5–3 is typical
- **procedural noise** — seeded multi-octave simplex terrain with a hovering monolith and an excavated instrument basin. Every knob (octaves, warp, amplitude…) is live.

### Parameter folders

**Map overlay** (hypsometric gradient stops, contour interval/color, survey grid) · **Surface material** (roughness, micro bump) · **Camera & focus** (real depth of field with autofocus) · **Look** (exposure, contrast, grain, fog) · **HUD** (accent/ink colors, scan wave shape + displacement) · **Motion / Tour** (fly-to easing, tour path smoothing, banking, look-ahead) · **Performance** (render scale, static shadows, shadow resolution) · **Light** (sun azimuth/elevation, shadow softness).

## Run locally

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # static build in dist/
```

No API keys or environment variables needed.

## Deploy

Pushing to `main` auto-deploys to GitHub Pages via the included workflow. Alternatively, any static host works:

```bash
npm run build
npx wrangler deploy   # Cloudflare (uses wrangler.jsonc)
```

## Tech

- [three.js](https://threejs.org) — rendering; terrain map styling (gradient, contours, grid, scan wave) is injected into the standard PBR shader via `onBeforeCompile`
- postprocessing — real depth-buffer DOF, ACES tone mapping, grain, vignette, SMAA
- [lil-gui](https://lil-gui.georgealways.com) — parameter panel
- [Vite](https://vitejs.dev) — build; plain JavaScript, no framework
- Hand-rolled seeded simplex noise / FBM / ridged multifractal for procedural terrain
- Tours: Catmull-Rom path sampled by arc length, trapezoidal velocity profile, damped-gimbal rotation controller

## Elevation data & attribution

Real-world mode uses the **[Terrain Tiles](https://registry.opendata.aws/terrain-tiles/)** dataset (Terrarium encoding), publicly hosted through the AWS Open Data program — no key required.

> Terrain tiles by [Mapzen](https://www.mapzen.com/) / Tilezen, from the AWS Open Data Terrain Tiles dataset. Underlying data sources include SRTM (NASA), USGS 3DEP/NED, ETOPO1 (NOAA) and others — see the full attribution list.

## License

MIT
