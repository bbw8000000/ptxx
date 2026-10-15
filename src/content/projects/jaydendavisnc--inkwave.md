---
title: "jaydendavisnc/inkwave"
owner: "jaydendavisnc"
name: "inkwave"
fullName: "jaydendavisnc/inkwave"
description: "Splatoon-style 4v4 turf-war shooter for the browser, built on three.js. No build step."
sourceUrl: "https://github.com/jaydendavisnc/inkwave"
stars: 191
forks: 74
language: "JavaScript"
topics: ["browser-game", "game", "javascript", "shooter", "splatoon", "threejs", "webgl"]
license: "MIT"
homepage: "https://inkwave-aah.pages.dev"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-26T12:51:53Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

INKWAVE


  An original Splatoon-style 4v4 turf-war shooter that runs in your browser.
  Paint the ground, swim through your ink, out-turf the other team.


  ▶ Play now ·
  Controls ·
  Run locally ·
  How it works ·
  Contributing


  
  
  
  


---

## Features

- **Turf war, 4 v 4.** Three minutes, most ground painted wins. Play against bots on three difficulty levels.
- **Squid form.** Hold to dive into your ink: swim fast, refill your tank, climb inked walls, dolphin-jump water gaps.
- **Seven weapons**, each with its own feel: Spritzer (shooter), Swell Roller, Glint Charger, Popper Blaster, Twinfin Dualies (dodge roll), Tidebucket Slosher and Gyre Splatling. Every kit comes with Splat Bombs and a special.
- **Three stages, day or dusk.** Tidewater Plaza, Kelpline Terminal and Halyard Marina, a working marina with a car ferry moored across the middle where the water gaps are the whole point.
- **Ink that behaves like liquid.** Splats spread and settle, fresh ink is glossy and dries, drips run down walls, and swimming leaves a wake in the surface itself.
- **A map you can actually read.** Hold Tab and the camera cranes up into a tilt-shift diorama of the live stage, with pins for your team and one-click Super Jumps.
- **Locker.** Choose your squidkid: tentacle style, headgear, face, outfit.
- **Everything procedural.** Characters, animation, weapons, textures, props, sound effects and music are all generated in code. There are no downloaded assets except two fonts.


  
  


## Controls

| Action | Keyboard / mouse | Gamepad |
|---|---|---|
| Move | W A S D | Left stick |
| Aim | Mouse | Right stick |
| Fire | Left click | RT |
| Squid form | Shift | LT |
| Jump / dodge roll | Space | A |
| Sub weapon (bomb) | Right click / E | RB |
| Special | F | Y |
| Map + Super Jump | Hold Tab or M, then 1–4 or click a pin | View |
| Pause | Esc | Start |

Gamepads work on the hosted (https) version. On a plain `http://` LAN address browsers block the Gamepad API.

## Running locally

There is no build step. Any static file server works; the included one also serves to your LAN and sends no-cache headers so module updates are never stale.

```bash
git clone https://github.com/jaydendavisnc/inkwave.git
cd inkwave
npm start        # http://localhost:8490
```

Useful URL parameters: `?map=halyard&time=dusk` picks a stage, `&autostart=180` skips the menus into a 180 s match, `&autopilot` lets a bot drive you.

```bash
npm install      # once, for the headless tools
npm run check    # syntax-check every module
npm run smoke    # boot + 8 s of autopilot in headless Chrome, fails on console errors
npm run build    # assemble dist/ (game + only the three.js addons it imports)
```

## How it works

- **Ink is painted in texture space.** Every paintable face owns a region of one 4K atlas; splats are drawn into it on the GPU while a coarse CPU grid keeps the turf score and gameplay queries in sync. The level shader layers the ink over the surface with its own height, gloss and wetness. See `src/world/paint.js` and `src/world/inkShading.js`.
- **Stages are data.** A layout is a list of boxes and ramps for one half of the arena; the other half is the 180° rotation, so both teams always get an identical field. Ambient occlusion is baked offline (`tools/bake-ao.mjs`). See `src/world/maps.js`.
- **Characters are fully procedural.** Geometry, materials, a 60-bone rig and every animation (locomotion, squid form, weapon poses, secondary motion) are code, driven by a spring-based pose system. See `docs/RIG.md`.
- **Systems talk through events.** Weapons, actors and the match emit typed events; effects, HUD and audio subscribe. The contract is documented in `docs/EVENTS.md` and `docs/CONTRACTS.md`.
- **Deterministic tooling.** The game exposes a freeze/step debug interface so filmstrips, handling measurements and bot simulations are reproducible frame by frame (`tools/film.py`, `tools/measure-handling.mjs`).

Rendering is three.js r186 (vendored, plain ES modules with an import map) with GTAO, bloom and a custom grade pass.

## Browser support

Chrome and Edge are the target; Firefox works. Safari runs but is slower. A discrete or recent integrated GPU is recommended for the High preset; the settings menu has Medium and Low tiers.

## Contributing

Issues and pull requests are welcome. Read CONTRIBUTING.md for the project layout and the checks to run first.

## License

MIT © 2026 Jayden Davis. INKWAVE is an independent project and is not affiliated with Nintendo; Splatoon is a trademark of Nintendo.
