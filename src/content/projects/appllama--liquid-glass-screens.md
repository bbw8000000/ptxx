---
title: "Appllama/liquid-glass-screens"
owner: "Appllama"
name: "liquid-glass-screens"
fullName: "Appllama/liquid-glass-screens"
description: "Explore liquid-glass welcome screens with floating stickers and interactive swipe animations."
sourceUrl: "https://github.com/Appllama/liquid-glass-screens"
stars: 198
forks: 20
language: "TypeScript"
topics: ["animation", "expo", "expo-router", "glassmorphism", "ios", "liquid-glass", "mobile-development", "mobile-ui"]
license: "GPL-3.0"
homepage: "https://appllama.io"
defaultBranch: "main"
snapshotDate: "2026-09-06"
pushedAt: "2026-09-05T07:31:04Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

React Native Expo Liquid Glass Screens — 2 Swipe-Up Welcome Cookbooks


  An open-source pair of liquid-glass welcome screens for React Native and Expo: one glass sphere, one gesture, two skies. A UI study inspired by Wabi's create screen.


  
  
  
  
  
  


  Explore cookbooks
  ·
  Copy a prompt
  ·
  Replicate the artwork
  ·
  Run locally
  ·
  Use the API
  ·
  Legal notice


*图片：Cookbook 1, Sky: the daylight liquid-glass welcome screen at the gate, mid-swipe, and open*

*图片：Cookbook 2, Astro: the night liquid-glass welcome screen at the gate, mid-swipe, and open*

Showcase artwork uses simulator captures of this implementation. The reference clip that the interaction was calibrated against is not redistributed.

> [!IMPORTANT]
> **Educational reference only.** This is an independent, unofficial Appllama project and is not affiliated with or endorsed by Wabi, Apple, or any other referenced company. Every bitmap and clip in this repository was generated for it; the interaction grammar is a study of a publicly visible screen. Do not ship these screens unchanged. Before any public or commercial use, replace the wordmarks, stickers, copy, and backdrops with your own, then make the final composition and motion meaningfully unique. Read the full intellectual-property notice.

## 2 cookbooks. One Expo project. Copy either.

Liquid Glass Screens is a React Native Expo cookbook for developers studying how a physical, gesture-driven welcome screen is built. Both cookbooks are the same TypeScript component with a different theme, drawn into one React Native Skia canvas and moved entirely on the UI thread with React Native Reanimated and React Native Gesture Handler.

The screen works like this:

- a great glass dome sits on the bottom edge of the page, refracting whatever is behind it;
- swiping up carries it toward the middle of the screen, and it shrinks as it climbs until it is a "+" button — the size is a function of position, so it follows the finger both ways;
- while it is being pushed, a chromatic caustic gathers at its crown and answers the force of the hand;
- when it lands, the cookbook's stickers surface through the button's own glass, get magnified and split by the lens on the way out, and settle into a plume that keeps breathing above it;
- the copy comes in with a positional blur wipe, a rotating third line, and a call to action; and
- dragging it back down grows it again and takes the plume away — a short dip followed by an upward fade in Cookbook 1, drawn into a stardust vortex in Cookbook 2.

You can:

- run both cookbooks from one Expo Router app;
- copy one named component, its theme, and its assets into an existing app;
- paste a cookbook-specific prompt into Codex, Claude Code, Cursor, or another coding agent;
- regenerate every wordmark, sticker, and backdrop from the prompts in `prompts/`; and
- read the measured motion numbers in `docs/MOTION_SPEC.md`.

The project comes from the product-flow research behind [Appllama](https://appllama.io), a library of onboarding, paywall, and product UI from leading iOS apps.

## The 2 cookbooks

| Cookbook | Screen ID | Component | Backdrop | Return | Source | Agent prompt |
| --- | --- | --- | --- | --- | --- | --- |
| Cookbook 1 — Sky | sky | SkyGlassWelcome | Looping cloud video | Stickers dip, float back up, and fade | View theme | Copy prompt |
| Cookbook 2 — Astro | astro | AstroGlassWelcome | Two-layer still: stars + horizon glow | Stickers spiral into a stardust vortex | View theme | Copy prompt |

Both cookbooks render through `LiquidGlassScreen`. A theme decides the backdrop, the wordmark, the forty sticker slots, the palette, the copy, the blur tint, the lens dispersion, the day-or-night glass tuning, and how the plume leaves.

## Copy-paste prompts

Open the matching section, use GitHub's copy button, and paste the complete prompt into a coding agent while it is working inside your existing Expo app. Each prompt tells the agent exactly which repository files, assets, native dependencies, and semantic actions to inspect.

The prompts are intentionally strict about preserving your current app architecture and intentionally strict about replacing the study's identity before release.


Cookbook 1 — Sky liquid-glass welcome screen — copy prompt

~~~text
You are working inside my existing Expo React Native repository.

Use https://github.com/Appllama/liquid-glass-screens as a read-only technical reference. Integrate only Cookbook 1, the Sky liquid-glass welcome screen, into my app. Do not turn my app into the gallery and do not modify unrelated features.

Reference files:
- src/liquid-glass/liquid-glass-screen.tsx, src/liquid-glass/glass.ts, src/liquid-glass/orb-field.tsx, src/liquid-glass/copy.tsx, src/liquid-glass/types.ts
- src/liquid-glass/cookbooks/sky.ts and src/liquid-glass/sky-glass-welcome.tsx
- assets/cookbooks/sky/ (sky.mp4, sky-poster.png, wordmark.png, stickers/)
- the Sky section of docs/MOTION_SPEC.md
- src/app/_layout.tsx only as an asset preloading reference
- NOTICE.md and docs/ASSET_PROVENANCE.md

Public API:
- Component: SkyGlassWelcome
- Screen ID: sky
- Semantic action: sky.lets-go
- Props: initialState ('gate' | 'open'), onActionPress, onPrimaryPress
- Relevant packages: @shopify/react-native-skia, react-native-reanimated, react-native-worklets, react-native-gesture-handler, expo-blur, expo-image, expo-status-bar, and expo-asset

Requirements:
1. Before editing, inspect my Expo SDK, React Native version, router, package manager, native splash configuration, onboarding routes, and existing dependencies. This screen needs a development build or a native build; it does not run in Expo Go.
2. Copy only this component, its theme, its assets, and the transitive helpers it actually imports (glass.ts, orb-field.tsx, copy.tsx, types.ts). Do not copy the demo router, the gallery home, or Cookbook 2.
3. Preserve my package versions, navigation, state architecture, app configuration, and native projects. Install only missing compatible packages with npx expo install, then rebuild the native app.
4. Preload the video, poster, wordmark, and stickers before revealing the React tree. Adapt the loading pattern to my app instead of replacing my root layout.
5. Mount the component inside a full-height flex: 1 surface with no visible navigation header and no surrounding safe-area padding, inside a GestureHandlerRootView; the component owns its canvas and status bar.
6. Reproduce the reference behavior accurately: keep the 402×874 reference geometry, the position-driven sphere size, the lens backdrop filter and glass shader, the force-driven caustic, the sticker plume and its fall, the blur-wipe copy with the rotating third line, the reduced-motion behavior, and the accessibility labels. Do not replace the gesture with a button or the motion with a generic fade.
7. Wire the semantic action through onActionPress to my existing onboarding route.
8. Treat this as an educational prototype. Before any public or commercial release, replace the wordmark, stickers, copy, and backdrop with authorized original artwork, then make the final composition and motion meaningfully unique.
9. Validate the swipe up, a partial drag that springs back, the swipe down, the "Let's go" action, reduced motion, TypeScript, lint, an iPhone simulator, and one Android viewport, in a native or development build.
10. Finish by summarizing every file and dependency changed.
~~~


Cookbook 2 — Astro liquid-glass welcome screen — copy prompt

~~~text
You are working inside my existing Expo React Native repository.

Use https://github.com/Appllama/liquid-glass-screens as a read-only technical reference. Integrate only Cookbook 2, the Astro liquid-glass welcome screen, into my app. Do not turn my app into the gallery and do not modify unrelated features.

Reference files:
- src/liquid-glass/liquid-glass-screen.tsx, src/liquid-glass/glass.ts, src/liquid-glass/orb-field.tsx, src/liquid-glass/copy.tsx, src/liquid-glass/types.ts
- src/liquid-glass/cookbooks/astro.ts and src/liquid-glass/astro-glass-welcome.tsx
- assets/cookbooks/astro/ (stars.png, glow.png, wordmark.png, stickers/)
- the Astro section of docs/MOTION_SPEC.md
- src/app/_layout.tsx only as an asset preloading reference
- NOTICE.md and docs/ASSET_PROVENANCE.md

Public API:
- Component: AstroGlassWelcome
- Screen ID: astro
- Semantic action: astro.lets-go
- Props: initialState ('gate' | 'open'), onActionPress, onPrimaryPress
- Relevant packages: @shopify/react-native-skia, react-native-reanimated, react-native-worklets, react-native-gesture-handler, expo-blur, expo-image, expo-status-bar, and expo-asset

Requirements:
1. Before editing, inspect my Expo SDK, React Native version, router, package manager, native splash configuration, onboarding routes, and existing dependencies. This screen needs a development build or a native build; it does not run in Expo Go.
2. Copy only this component, its theme, its assets, and the transitive helpers it actually imports (glass.ts, orb-field.tsx, copy.tsx, types.ts). Do not copy the demo router, the gallery home, or Cookbook 1.
3. Preserve my package versions, navigation, state architecture, app configuration, and native projects. Install only missing compatible packages with npx expo install, then rebuild the native app.
4. Preload the star layer, the glow layer, the wordmark, and the stickers before revealing the React tree. Adapt the loading pattern to my app instead of replacing my root layout.
5. Mount the component inside a full-height flex: 1 surface with no visible navigation header and no surrounding safe-area padding, inside a GestureHandlerRootView; the component owns its canvas and the light status bar.
6. Reproduce the reference behavior accurately: keep the 402×874 reference geometry, the position-driven sphere size, the two-layer backdrop with the glow that dissipates through the glass, the night glass tuning, the zero-dispersion dome, the force-driven caustic, the sticker plume, the stardust vortex on the way down with its glow flare, the blur-wipe copy with the rotating third line, the reduced-motion behavior, and the accessibility labels. Do not replace the gesture with a button or the motion with a generic fade.
7. Wire the semantic action through onActionPress to my existing onboarding route.
8. Treat this as an educational prototype. Before any public or commercial release, replace the wordmark, stickers, copy, and backdrop with authorized original artwork, then make the final composition and motion meaningfully unique.
9. Validate the swipe up, a partial drag that springs back mid-vortex, the swipe down, the "Let's go" action, reduced motion, TypeScript, lint, an iPhone simulator, and one Android viewport, in a native or development build.
10. Finish by summarizing every file and dependency changed.
~~~


## Replicate the artwork

Every wordmark, sticker, backdrop, and clip in this repository was generated, and the exact prompts and post-processing steps are published so you can make your own set in the same visual language, in your own identity:

- `prompts/sky-cookbook.md` — the chrome-balloon wordmark, the die-cut photographic stickers, the holographic icons, the marker speech bubbles, and the seamless cloud loop.
- `prompts/astro-cookbook.md` — the night wordmark, the app-building sticker set, the horizon-glow starfield, and the star/glow layer split that lets the glow dissipate through the glass.

The prompts were run with GPT Image 2 at high quality and 1K, Seedance 2.0 for the cloud loop, and a background-removal pass for the die-cuts. Any comparable image model will do; keep the style sentences and the "no text, no watermark" tail.

## Run the Expo gallery

Requirements: Node.js 22.13 or newer, Xcode for iOS, or Android Studio for Android. The screens use React Native Skia's runtime shaders and video decoding, so they run in a native build, not in Expo Go.

~~~bash
git clone https://github.com/Appllama/liquid-glass-screens.git
cd liquid-glass-screens
npm ci
npm run ios
~~~

The default route is the gallery home with two buttons, Cookbook 1 and Cookbook 2. Each cookbook also has a direct route:

~~~text
/sky
/astro
~~~

Open one directly, or land with the sphere already up and the plume out:

~~~bash
npx uri-scheme open "liquid-glass://astro" --ios
npx uri-scheme open "liquid-glass://sky?state=open" --ios
~~~

## How the glass works

Each cookbook is one Skia `Canvas` with five layers, bottom to top:

| Layer | What it is |
| --- | --- |
| Scene | The cloud video (Sky) or the star layer plus an additive glow layer (Astro), drawn inside the canvas so the lens can bend it. |
| Stickers | Forty die-cut sprites moved by a UI-thread frame callback: buoyancy, wander, a home in the plume, neighbour repulsion, and the finger's push. Astro adds a 260-mote stardust ring buffer. |
| Lens | A `BackdropFilter` running `LENS_SKSL`: thick-glass magnification, a bevelled rim that shears, per-channel dispersion, and a "slosh" offset that drags the picture inside with the motion. |
| Glass | `GLASS_SKSL`: the body, rim light, sheen, halo, and the motion caustic that focuses from a lavender bloom into a bowl of cyan-to-blue light with a gold thread. A `night` uniform blends the daylight and night tunings. |
| Copy | React Native `Text` above the canvas — the wordmark, the hint, the headline with its struck word, the rotating third line with a per-word blur wipe, and the pill. |

The sphere's radius is a pure function of its position, and its caustic answers force rather than speed, so shrinking toward the button and growing back read identically in both directions.

## React Native liquid glass API

### Import one component

~~~tsx
import { AstroGlassWelcome, type LiquidGlassActionId } from './src/liquid-glass';

function handleAction(actionId: LiquidGlassActionId) {
  if (actionId === 'astro.lets-go') {
    // Navigate to your original onboarding flow.
  }
}

export function Welcome() {
  return ;
}
~~~

### Select from the typed registry

~~~tsx
import { CookbookScreen, type CookbookId } from './src/liquid-glass';

export function Preview({ name }: { name: CookbookId }) {
  return  console.log(id)} />;
}
~~~

### Bring your own theme

~~~tsx
import { LiquidGlassScreen, SKY_THEME } from './src/liquid-glass';

const MY_THEME = {
  ...SKY_THEME,
  id: 'sky' as const,
  wordmark: require('./assets/my-wordmark.png'),
  copy: { ...SKY_THEME.copy, headline: 'Plan and share', struck: 'spreadsheets', kept: 'trips' },
};

export function Welcome() {
  return  {}} />;
}
~~~

### Source-distributed Git dependency

The package exports src/index.ts, so SDK-matched workspaces can consume it directly:

~~~bash
npm install github:Appllama/liquid-glass-screens
~~~

~~~tsx
import { SkyGlassWelcome } from 'liquid-glass-screens';
~~~

The demo currently targets Expo SDK 57, React Native 0.86, React Native Skia 2.6, and Reanimated 4.5. Existing apps on another Expo SDK should prefer the copy-paste prompt workflow so npx expo install can resolve compatible native dependency versions.

### Shared props

| Prop | Purpose |
| --- | --- |
| initialState | 'gate' (default) starts with the dome on the bottom edge. 'open' starts with the sphere already up and the plume out — the deterministic state for screenshots. |
| onActionPress | Receives the typed semantic ID (sky.lets-go or astro.lets-go) when the pill is pressed. |
| onPrimaryPress | Backward-compatible handler for the pill. onActionPress takes precedence. |

LiquidGlassActionId, LiquidGlassActionPressHandler, COOKBOOK_IDS, COOKBOOK_METADATA, CookbookTheme, and STICKER_SIZES are exported for autocomplete and typed tooling.

## Motion, responsiveness, and accessibility

- **Reference geometry:** each layout is authored at 402×874 points and scaled by width and height separately, so the dome stays centred on the bottom edge on every iPhone.
- **Motion:** every value is either driven by the finger or by a spring that receives the release velocity. Timings, thresholds, and physics constants are documented in MOTION_SPEC.md.
- **UI thread only:** the gesture, the sphere, the shaders' uniforms, the sticker physics, and the dust all run in worklets; the JavaScript thread is only told when the open state comes and goes.
- **Reduced motion:** the landing spring loses its bounce and the third line fades in place instead of wiping.
- **Interaction safety:** the pill is inert and absent from the accessibility tree until it has appeared; the page itself carries the swipe hint as its accessibility label.
- **Asset loading:** the demo preloads both cookbooks' bitmaps and the clip before the animated React layer is shown.
- **Status bar:** the component sets the status bar style that its backdrop needs (dark on Sky, light on Astro).

## Project structure

~~~text
assets/cookbooks/sky/           Cloud loop, poster, wordmark, 22 stickers
assets/cookbooks/astro/         Star layer, glow layer, wordmark, 24 stickers
docs/MOTION_SPEC.md             Measured geometry, thresholds, springs, and physics
docs/ASSET_PROVENANCE.md        Auditable generated-asset inventory
prompts/                        Prompts to regenerate every asset, per cookbook
scripts/                        Simulator recording and Maestro flows used for verification
src/app/                        Expo Router demo: the gallery home and the two routes
src/liquid-glass/               The screen, the shaders, the sticker field, the copy, the two themes
src/index.ts                    Source-distributed package entry
~~~

## Verification

~~~bash
npm run verify
~~~

The verification command runs:

1. TypeScript with tsc --noEmit;
2. Expo ESLint; and
3. dependency compatibility tests for routing, malformed URI input, and Xcode project identifiers; and
4. particle worklet regressions for Sky's fading return and Astro's vortex.

CI also runs npm audit --audit-level=moderate. The scoped security overrides and their compatibility checks are documented in docs/DEPENDENCIES.md.

The same gates run in GitHub Actions. There is no web export: the screens depend on Skia runtime shaders and native video decoding. The interactions were verified in the iPhone simulator with the Maestro flows in `scripts/maestro/`, recorded at a constant 60 fps with `scripts/simrec.sh` and scrubbed frame by frame.

## Frequently asked questions

### Does this use Apple's Liquid Glass?

No. "Liquid glass" here describes the effect: a sphere of refracting, sloshing glass drawn with Skia runtime shaders. It does not use UIKit's glass materials, so it renders identically on iOS and Android and can lens anything drawn into the canvas, including the stickers.

### Can I use only one cookbook without the gallery?

Yes. Import SkyGlassWelcome or AstroGlassWelcome, or copy the screen, its four helpers, one theme, and that theme's assets. The Expo Router demo is optional.

### Why is there a video in one cookbook and a still in the other?

Sky's clouds drift, so a seamless ping-pong loop is the honest choice. Astro's night is a still because every animated starfield tried read as a screensaver; instead the horizon glow is split into its own layer and dissipates through the glass as the sphere rises, which gives the page life without a loop.

### Does it run in Expo Go?

No. React Native Skia's runtime shaders and video decoding need a development build or a native build.

### Can I use these exact designs commercially?

The original project code is GPL-3.0-licensed and the generated artwork is inventoried in ASSET_PROVENANCE.md, but the screens are a study of a publicly visible interaction. Replace the identity, make the composition and motion your own, and obtain any clearance required for your use.

## Contributing

Issues and focused pull requests are welcome.

- Keep each cookbook independently importable.
- Keep every animated value on the UI thread.
- Preserve reduced-motion and accessibility behavior.
- Document any timing, threshold, or physics change in docs/MOTION_SPEC.md.
- Do not submit extracted production artwork, source screenshots, or source video from third-party apps.
- Record provenance and the prompt for every new distributable bitmap.
- Run npm run verify and the Maestro flows before opening a pull request.

Open an issue or start a pull request.

## Educational use and intellectual property

This is an independent, unofficial project created by Appllama for education, UI research, and technical demonstration. It is not affiliated with, sponsored by, endorsed by, or authorized by Wabi, Apple, or any other referenced company.

Third-party product names, trademarks, service marks, logos, screen text, artwork, and other brand elements belong to their respective owners. They are referenced only to identify and study a publicly visible welcome-screen interaction. Appllama claims no ownership of, and grants no license to, any third-party intellectual property. "Liquid Glass" is a term Apple uses for its own design system; this project is not that system and does not use it.

The GNU General Public License v3.0 applies only to original project code and original material that Appllama is legally able to license. It does **not** grant permission to use third-party trademarks, copyrighted material, protected trade dress, or other proprietary material.

**Do not ship these reference implementations unchanged.** Before using an implementation in a public or commercial product, you must:

- replace the wordmarks, stickers, copy, and backdrops with your own authorized artwork;
- create your own independently designed colors, typography, spacing, composition, and motion language;
- remove anything that could imply affiliation, sponsorship, endorsement, or approval by a referenced company; and
- obtain any permissions or legal clearance required for your use and jurisdiction.

Changing only a wordmark, app name, or accent color may not be sufficient. Calling a use "educational" or "noncommercial," adding attribution, or including this notice does not automatically make the use lawful or qualify it as fair use. Fair use is evaluated case by case.

This notice is informational, is not legal advice, and does not guarantee that any particular use is permitted. If you are uncertain, consult a qualified intellectual-property attorney before publishing or distributing your work. See the full repository notice, the [U.S. Copyright Office fair-use guidance](https://www.copyright.gov/fair-use/more-info.html), and the [USPTO trademark-infringement overview](https://www.uspto.gov/page/about-trademark-infringement).

Rights holders can request a correction or removal by opening an issue.

## License

Original source code is available under the GNU General Public License v3.0, subject to the third-party rights and exclusions explained above and in NOTICE.md.

## An open-source creation by Appllama


  
    
      
      
      
    
  


  Study the onboarding, paywall, and product flows behind leading iOS apps at
  appllama.io.


  Follow @appllamaio on X
  ·
  Created by @jaimintf
  ·
  Star the repository
