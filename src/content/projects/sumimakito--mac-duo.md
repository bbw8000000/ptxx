---
title: "sumimakito/Mac-Duo"
owner: "sumimakito"
name: "Mac-Duo"
fullName: "sumimakito/Mac-Duo"
description: "Wish you could bring the iPhone Duo effect to your MacBook?"
sourceUrl: "https://github.com/sumimakito/Mac-Duo"
stars: 135
forks: 14
language: "Swift"
topics: ["flip", "iphone", "iphoneduo", "mac", "macos", "menubar", "menubar-app", "menubarapp"]
license: "Apache-2.0"
defaultBranch: "main"
snapshotDate: "2026-09-11"
pushedAt: "2026-09-10T20:55:28Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Mac Duo

**Wish you could bring the iPhone Duo effect to your MacBook?**

https://github.com/user-attachments/assets/3ea3b098-c6d2-4398-8f3a-e9087bbb33f2

Close the lid and watch your screen content tilt, blur, and fade as it moves.  
Mac Duo adds this effect to your MacBook, with controls in the menu bar.


With the default settings, it's recommended to view the effect in front of your MacBook.

- **Metal rendering:** Uses GPU rendering to apply perspective, blur, and dimming as the lid closes.
- **Live screen content:** Uses ScreenCaptureKit to capture and render screen content in real time.
- **Adjustable perspective:** Tweak the perspective to suit your viewing position and make the effect look more natural.


> [!NOTE]
> Mac Duo is completely **free** to use. Whether you use the app or reuse its code in your projects, please consider sponsoring me if you find it helpful.
>
> Special thanks to our team at Moeru AI for sponsoring the Apple Developer Program membership used to sign and notarize the prebuilt app here.

## Download

Download DMG | Download ZIP

These downloads contain the latest development build for Apple Silicon and Intel Macs.

Requires macOS 14 or later and a MacBook with a compatible lid angle sensor.
Grant Screen Recording permission when prompted to enable the effect.

## Build

Requires Xcode with Swift 6.0 or later. Run from the project directory:

```sh
./build.sh
```

The script creates `build/Mac Duo.app` with an ad-hoc signature. Open it from Finder, or build and launch with:

```sh
./build.sh --run
```

macOS may require Screen Recording permission again after rebuilding with ad-hoc signing.

## Known limitations

- Only MacBooks with a compatible lid angle sensor can use the effect. The app reports when no sensor is available.
- The effect applies only to the built-in display.
- The effect stops when macOS sleeps as the lid closes.
- Clicks pass through the effect to the apps underneath.

## Acknowledgements

This project is built with AI assistance.

## License

Licensed under the Apache License 2.0. Copyright 2026 Makito.

See NOTICE for attribution.
