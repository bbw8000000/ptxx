---
title: "kota-zo/myspoti"
owner: "kota-zo"
name: "myspoti"
fullName: "kota-zo/myspoti"
description: "Native Android client for Spotify, built with Jetpack Compose"
sourceUrl: "https://github.com/kota-zo/myspoti"
stars: 68
forks: 3
language: "Kotlin"
topics: ["ad-free", "adblock", "android", "jetpack-compose", "kotlin", "lyrics", "music-player", "music-video"]
license: "GPL-3.0"
defaultBranch: "main"
snapshotDate: "2026-10-15"
pushedAt: "2026-10-14T23:05:51Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Myspoti

*图片：Latest release*
*图片：License: GPL-3.0*

**Spotify on Android, free account, no ads.** A native Jetpack Compose client with synced lyrics and official music videos.


  


  ⬇ Download the latest APK


The official Spotify Web Player runs in a hidden WebView and does the actual playback, with the phone's DRM and Spotify's own reporting. The native UI drives it, so plays count on your account exactly as they do in a browser. You always sign in yourself, on Spotify's own login page.

## Features

- **No ads.** Ads are blocked inside the embedded Web Player, the way a browser ad blocker does it. It works with a free account: no Premium, no patched Spotify app, and the DRM is left untouched.
- Home, search (with filters: songs, artists, albums, playlists, podcasts), library, artist, album and playlist pages, with Spotify's official labels. The app is in French on a French phone, in English on any other.
- Synced lyrics: Spotify first, then [LRCLIB](https://lrclib.net) as a fallback.
- Official music videos, when one exists. The video plays muted, in sync with the song. The app only uses YouTube videos marked as official clips, and shows nothing when no clip exists.
- Spotify Connect, media notification, lock screen and Bluetooth controls.
- **Offline downloads.** Download a song, an album, a playlist or your Liked Songs, then play them without a connection. The audio comes from YouTube Music (Opus or AAC, as YouTube serves it, never re-encoded), not from Spotify. Each file is checked against the recording's official preview (looked up by ISRC), so a live take, a remix or a cover is rejected. Files stay in Myspoti's private storage.

## Screenshots

| Home | Player | Artist | Album |
|:---:|:---:|:---:|:---:|
|  |  |  |  |

## Not included

- No DRM circumvention.
- No Spotify audio download or decryption. Offline downloads come from YouTube Music, not from Spotify or any other paid service.
- No altered listening events.

## Disclaimer

Blocking ads goes against Spotify's Terms of Use, and Spotify may suspend accounts that do it. Use this app at your own risk. If you can, support artists with Premium or by buying their music.

## Build

The Android project is in `base/`. Requirements: JDK 17+ and the Android SDK (compileSdk 37).

```bash
cd base
./gradlew assembleDebug
./gradlew testDebugUnitTest
```

Every push builds and tests on GitHub Actions. A `v*` tag publishes a signed APK in Releases, which the app checks for updates.

## Credits

- UI derived from Spotui / Metrolist (GPL-3.0).
- NewPipeExtractor (GPL-3.0).
- Material Icons (Apache 2.0).
- Figtree font (SIL OFL 1.1, see `base/licenses/`).
- Google Analytics neutralizer adapted from uBlock Origin (GPL-3.0).

## License

GPL-3.0.

Not affiliated with or endorsed by Spotify. Spotify is a trademark of Spotify AB.
