---
title: "antiwork/chromeless"
owner: "antiwork"
name: "chromeless"
fullName: "antiwork/chromeless"
description: "The browser that isn't there — zero-chrome macOS browser for clean screenshots and fullscreen video. One Swift file."
sourceUrl: "https://github.com/antiwork/chromeless"
stars: 277
forks: 23
language: "Swift"
topics: ["browser", "macos", "screenshots", "swift", "webkit"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-07-03T19:22:27Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# chromeless

**The browser that isn't there.** The window *is* the webpage — no tabs, no toolbar, no address bar, no chrome at all. Made for clean screenshots, fullscreen YouTube, dashboards, and anything else that deserves the whole window.

A native macOS app in one Swift file, built on WKWebView (the Safari engine). No Electron, no dependencies, ~450 KB built.

*图片：chromeless start page*

## Build

```sh
./build.sh        # → Chromeless.app
open Chromeless.app
```

Requires the Xcode Command Line Tools (`xcode-select --install`). Optionally `mv Chromeless.app /Applications/`.

## Use

Everything is a keystroke (also listed on the start page and in the menu bar):

| Keys | Action |
| --- | --- |
| `⌘L` | Search or enter a URL (floating HUD) |
| `⌘drag` | Move the window from anywhere |
| `⌃⌘F` | Fullscreen (YouTube's own ⛶ button works too) |
| `⇧⌘S` | Snapshot the page as PNG → Desktop |
| `⌘P` | Pin the window above everything |
| `⌘[` / `⌘]` | Back / forward (two-finger swipe also works) |
| `Esc` | Bail out — back to the start page (`⌘[` returns) |
| `⌘=` `⌘-` `⌘0` | Zoom in / out / reset (pinch works too) |
| `⇧⌘C` | Copy the current URL |
| `⌘R` / `⇧⌘R` | Reload / reload ignoring cache |
| `⌘N` / `⌘W` | New window / close window |

The traffic-light buttons exist but stay invisible — hover the top-left corner to reveal them. The window remembers its frame and reopens your last page.

## CLI screenshot mode

Chromeless doubles as a webpage-to-PNG tool:

```sh
./Chromeless.app/Contents/MacOS/Chromeless https://example.com --snap shot.png --size 1440x900
./Chromeless.app/Contents/MacOS/Chromeless localhost:3000 --snap dev.png --wait 3
```

It loads the page, waits for it to settle, writes a Retina PNG, and exits.

## Notes

- Cookies and logins persist (kept in `~/Library/WebKit/com.chromeless.app/`), so YouTube stays signed in.

## Passkeys

Apple gates WebAuthn in WKWebView behind the restricted `com.apple.developer.web-browser.public-key-credential` entitlement, and macOS kills ad-hoc builds that claim it without an Apple-issued provisioning profile (verified: instant SIGKILL). Chromeless checks its own signature at runtime:

- **Default build (no entitlement):** the WebAuthn API is hidden, so sites feature-detect the absence and offer their fallbacks instead of a doomed passkey prompt. For Google, "Try another way" → **"Get a prompt on your phone"** signs you in with no password and no passkey — it's Google's own push approval, not WebAuthn.
- **Entitled build:** passkeys work natively via iCloud Keychain + Touch ID. To get there: join the Apple Developer Program, request the *Web Browser Public Key Credential* capability for your App ID (developer.apple.com → Certificates, Identifiers & Profiles → your identifier → Additional Capabilities, or Apple's capability request form), download a provisioning profile containing it, then:

  ```sh
  PROVISIONING_PROFILE=chromeless.provisionprofile \
  CODESIGN_IDENTITY="Apple Development: you@example.com (TEAMID)" ./build.sh
  ```

  The same binary detects the entitlement and stops hiding WebAuthn. macOS may show a one-time consent (System Settings → Privacy & Security lists passkey access for web browsers).
- Presents a Safari user agent; element fullscreen, autoplay, and AirPlay are enabled.
- First `⇧⌘S` may trigger the standard macOS prompt to allow Desktop access.
- Deliberately absent: tabs, find-in-page, downloads, history UI, extensions. That's the point.

## License

MIT
