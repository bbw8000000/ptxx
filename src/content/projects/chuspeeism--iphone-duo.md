---
title: "chuspeeism/iphone-duo"
owner: "chuspeeism"
name: "iphone-duo"
fullName: "chuspeeism/iphone-duo"
description: "Interactive iPhone Duo fold animation with projected screen UI, progressive blur, and custom image uploads. Built with Three.js."
sourceUrl: "https://github.com/chuspeeism/iphone-duo"
stars: 72
forks: 6
language: "JavaScript"
topics: []
license: "MIT"
homepage: "https://iphone-duo-tawny.vercel.app"
defaultBranch: "main"
snapshotDate: "2026-09-11"
pushedAt: "2026-09-10T11:51:07Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# iPhone Duo · Fold Preview

A browser-based study of foldable screen transitions, built with Three.js.

[Live demo](https://iphone-duo-tawny.vercel.app/)

## Features

- Only the cover half rotates; the rear-camera half stays fixed.
- Screen content uses a fixed front-view projection during folding. The outer UI stays aligned with its hinge-side left edge.
- Blur and darkening follow the image coordinates, including the image edges. Maximum blur radius is 72 source pixels; darkening uses twice the transition strength, capped at black.
- Wallpaper, Launcher, and Custom modes. Custom opens the image picker directly and applies one image to both screens; the outer screen shows the image's right half.
- Drag to orbit, scroll to zoom, or use the play button and slider to fold the device.
- Responsive controls for desktop and mobile. Uploaded images stay in the current browser tab.

## Run locally

The application is static HTML, CSS, and JavaScript. No Node.js build step is required. Three.js is bundled locally.

The Apple reference assets are downloaded separately. Use Python 3.12 to prepare them:

```sh
git clone https://github.com/jadon7/iphone-duo.git
cd iphone-duo
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-assets.txt
python scripts/prepare-assets.py
python -m http.server 8766 --bind 127.0.0.1
```

On Windows, activate the environment with `.venv\Scripts\activate`.

Open http://127.0.0.1:8766/. Serve the directory over HTTP; opening `index.html` as a local file cannot load the model.

The preparation script downloads the original Star White USDZ and UI images from Apple, selects the model's Landscape pose, flattens its references, and rewrites texture paths for the browser. The resulting files stay in the ignored `assets/` directory. Asset URLs were verified on September 10, 2026.

## Screen controls

Choose **Wallpaper** or **Launcher** for the default screen layouts. Choose **Custom** to select an image. The inner screen contains the whole image; the outer screen crops to the right-hand portion and aligns that portion to its left edge. Recommended image size: 2670 × 1878.

The slider controls the fold from closed to open. The default view is fully open and paused. The outer screen turns off at full opening.

## Source map

| File | Purpose |
| --- | --- |
| `index.html` | Screen-mode tabs and fold controls |
| `main.js` | Three.js scene, fold deformation, projected UI, blur, and darkening |
| `ui.js` | Default screen layouts |
| `style.css` | Desktop and mobile layout |
| `scripts/prepare-assets.py` | Download and prepare the reference assets |
| `vercel.json` | Install and prepare assets during Vercel builds |
| `vendor/three/` | Three.js runtime and required add-ons |

## Deploy

The Vercel project is connected to this GitHub repository. Pushes to `main` publish the production site; other branches create preview deployments.

`vercel.json` installs the asset tools and runs `scripts/prepare-assets.py` during each build. Git deployments therefore include the model and screen images without storing those assets in the repository.

For a manual Vercel deployment:

```sh
vercel link
vercel --prod
```

`.vercelignore` keeps local credentials and Git metadata out of deployments while including the prepared assets.

For other static hosts, prepare the assets locally before publishing the project directory.

## License and sources

Original application code is released under the MIT license. See third-party notices for bundled libraries and reference assets.

Apple models and imagery are excluded from the repository and the MIT license. The preparation script links to their original sources; their use is subject to Apple's terms. This project is an independent animation study.

- [Apple iPhone Duo](https://www.apple.com/iphone-duo/)
- [Apple HIG: Designing for iPhone Duo](https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo)
- [Three.js](https://threejs.org/)
