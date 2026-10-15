---
title: "achimala/TheLongSilence"
owner: "achimala"
name: "TheLongSilence"
fullName: "achimala/TheLongSilence"
description: "A space exploration game built by Claude Opus 5"
sourceUrl: "https://github.com/achimala/TheLongSilence"
stars: 327
forks: 46
language: "JavaScript"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-07-30"
pushedAt: "2026-07-27T15:41:10Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# THE LONG SILENCE

A procedural space-exploration game that runs in a browser tab. WebGL2, no
assets — every star, world, ring system, nebula and derelict is generated from
a seed and shaded by hand-written GLSL.

```
npm install
npm run dev        # http://localhost:5173
npm run build      # static bundle in dist/
```

---

## The game

Forty thousand years ago nine hundred inhabited worlds inside an eighty
light-year volume fell silent in four days. No debris, no radiation signature,
no sign of violence. The Choir left their cities lit, their orbits tidy, their
archives open — and seven instruments standing in seven systems.

You fly the survey vessel *Pale Seeker*. Chart systems, scan what you find,
and attune to the Resonators; each one yields a Canto and pushes the drive a
little further. All seven opens the Aperture.

### Controls

| | Desktop | Touch |
|---|---|---|
| Steer | mouse (click to capture) or arrow keys | left stick |
| Roll | `Q` / `E` | right stick, horizontal |
| Throttle | `W` / `S`, or scroll | right stick vertical, or `+` / `−` |
| Boost | `Shift` | `BST` |
| Scan | hold `F` | hold `SCAN` |
| Land / lift off | `L` | — |
| Fold drive | `J` | `FOLD` |
| Star map | `M` | `MAP` |
| Archive | `Tab` | `ARC` |
| Full stop | `X` | — |
| Camera | `V` | — |
| Frame stats | `P` | — |

Fold speed scales with distance from the nearest mass, so an approach
decelerates itself and drops you out just clear of the surface. Interstellar
transit is initiated from the star map and costs drive charge by distance.

---

## How it renders

**Scale and precision.** One world unit is one kilometre. Systems span millions
of units while the ship is 0.1 units long, so the world uses a *floating
origin* — the ship sits at (0,0,0) and everything else is positioned relative
to it each frame — plus a logarithmic depth buffer. Custom `ShaderMaterial`s
opt into log depth by hand (`LOGD_*` chunks in `src/gfx/glsl/noise.js`); miss
that and two concentric spheres z-fight into triangular confetti.

**Planets are baked, not evaluated.** Twenty-odd octaves of simplex per pixel
per frame is not survivable on a phone, so each solid world is rendered once
into a cubemap holding linear albedo in RGB and terrain height in A. The
runtime shader is three texture taps for normals plus lighting. Cubemaps rather
than equirectangular maps: no pole pinch, no seam. The nearest world gets
re-baked at 1024²/face; everything else sits at 256².

**Atmospheres are single-scattering raymarches** through a spherical shell in
planet-radius object space, with Rayleigh coefficients set from real optical
depths (~0.05/0.10/0.23 at zenith) and a soft planetary penumbra on the light
ray so twilight fades instead of ending at a line.

**Auto exposure** runs entirely on the GPU: a 64² luminance reduction to 8² to
1², then a ping-pong adaptation target. The metric is a *sqrt* mean — a log
mean is the textbook choice but space frames are 90% black sky and the log of
near-zero drags the average to nothing, blowing out every shot.

**Post** is hand-rolled: bright prefilter → six-level dual-filter bloom with
attenuated wide mips → anamorphic streak → god rays and lens ghosts → composite
(radial blur, chromatic aberration inside the sampler, AgX tonemap, grain,
dither) → FXAA.

**Performance** holds 60fps by trading resolution, never features: the engine
watches frame time and moves the render scale between 0.62× and 2×.

---

## Layout

```
src/
  core/       Engine (renderer, quality tiers, frame loop), Input
  gfx/        PostFX, Sky (nebula cubemap + HDR star field), cube baking,
              greeble (the shared construction + surfacing kit), GLSL
  world/      generate (seeded universe), Planet, Star, Surface (the ground),
              Fleet (traffic), Station, Structures, Asteroids, Dust, shaders
  ship/       Ship — procedural hull with injected panel-line PBR, flight model
  game/       Game (world state, scanning, fold, floating origin), Director
              (cutscenes), encounters, lore
  ui/         HUD, Codex, StarMap, stylesheet
  audio/      procedural WebAudio drone and engine
tools/        browser verification: survey.mjs, play.mjs, probe.mjs, sheet.mjs
```

**One kit builds everything.** `gfx/greeble.js` owns the plate-seam law, the
weathering, the sun-bleaching, the grazing rim term and the five base materials,
and the player's hull, every freighter, every station and every derelict are
surfaced by it. Parts bake their transforms into their geometry and are welded
per material, so panel lines run continuously across part boundaries and a
hundred pieces cost six draws.

**Traffic is on a schedule, not a simulation.** Craft follow analytic paths
keyed to the clock, so they are exactly where they belong after a fold jump or a
two-minute pause. Each carries a *beacon* — a quad sized from view depth to hold
a constant few pixels — because sixty metres of hull four million kilometres
away is far below one, and a moving spark is what makes a system read as busy.

**The ground is a separate scene.** Orbit needs a whole planet with no visible
geometry; standing on one needs ten kilometres of terrain with no visible
sphere. `world/Surface.js` is a radial grid whose rings grow exponentially,
displaced by the same terrain law the orbital bake uses, bent down by the
planet's real radius, and hazed by the same scattering coefficients as the
atmosphere shell above it.

## Verification

```
node tools/play.mjs        # 17 interaction assertions (flight, scan, fold, jump)
node tools/survey.mjs      # screenshots every set-piece, reports fps/draws
node tools/probe.mjs "" --shot out.png     # one expression, one frame
node tools/sheet.mjs a.png b.png --out s.png   # contact sheet — judge a set at once
node tools/levels.mjs shots/*.png              # tone statistics per frame
node tools/judgeset.mjs                        # rebuild the review set in shots/judge/
```

`levels.mjs` is the one that stops arguments. "It looks flat" is not
actionable; "0.00% of pixels clip and the 99th percentile is 165" is, and that
is exactly what the game measured before the highlight range was fixed.

Every tool boots through `tools/boot.mjs`, which exists because the dev server
hot-reloads on any source edit: a capture that started before the reload
finishes happily and screenshots the title card, with a plausible frame rate
printed next to it. It verifies the overlay is actually gone and starts over if
it is not, and the multi-shot tools re-check between shots.

Phones are turned away at the door with a short message rather than served a
reduced build — every feature worth looking at here is one a handset cannot
afford, and a bad first impression is worse than none.

Both drive a real headed Chromium with GPU rasterisation against `npm run dev`.
