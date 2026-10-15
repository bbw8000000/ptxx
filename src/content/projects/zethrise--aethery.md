---
title: "ZethRise/Aethery"
owner: "ZethRise"
name: "Aethery"
fullName: "ZethRise/Aethery"
description: "One-click mobile GUI for the Aether censorship-circumvention tunnel — Kotlin & Rust"
sourceUrl: "https://github.com/ZethRise/Aethery"
stars: 179
forks: 9
language: "Kotlin"
topics: ["aether", "android", "censorship", "gui", "kotlin", "mobile-app", "rust"]
license: "AGPL-3.0"
defaultBranch: "master"
snapshotDate: "2026-07-20"
pushedAt: "2026-07-20T09:27:58Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Aethery


  


  Native Android client for private, censorship-resistant connections.


  
  
  
  


> **v0.1.1** — Aethery is an Android app around the Aether core. It is not a replacement or fork of Aether's networking engine.

## What Aethery does

Aethery turns Aether into an Android-first VPN experience. It provides the native interface, Android VPN/TUN bridge, connection state, protocol picker, live connection logs, and release packaging. Aether remains responsible for route discovery, tunnel establishment, transport protocols, and encrypted traffic handling.

```text
Android UI + Android VPN/TUN
            │
            ▼
      Aethery client
            │ JNI
            ▼
 Aether core — discovery, MASQUE, WireGuard, routing
```

## Highlights

- Native Android UI with one-tap connect, connection state, motion, and live logs.
- Connection type picker: **VPN** routes device traffic through Android `VpnService`; **Proxy** exposes local SOCKS5 at `127.0.0.1:1819` by default for apps configured to use it.
- **MASQUE** over HTTP/3, with HTTP/2 fallback when available.
- **WireGuard** for networks where it is reachable.
- **WARP-on-WARP** (`gool`) support through the Aether core.
- Automatic endpoint scanning with IP-level diagnostics, cached-gateway reconnect, and Ironclad verification.
- Retained Aether v1.3.0 Android FFI core builds into `libaether.so`; it is excluded from GitHub language statistics.
- App-level default protocol setting and direct links to releases/source.

## Protocol notes

| Protocol | Intended use |
| --- | --- |
| MASQUE | Recommended default. Uses HTTPS-like tunnel transport and can fall back to HTTP/2. |
| WireGuard | Fast direct transport where UDP/WireGuard is reachable. |
| WARP-on-WARP | Nested WireGuard transport supplied by Aether. It still needs a reachable outer WireGuard path. |

Network filtering differs by provider and location. A protocol appearing connected means Aether completed its tunnel readiness check; it does not promise that every destination is reachable on every network.

## Download

Draft and published builds are available from GitHub Releases.

| Device ABI | Asset |
| --- | --- |
| 64-bit ARM | `Aethery-arm64-v8.apk` |
| 32-bit ARM | `Aethery-Arm64-v7.apk` |

The second filename intentionally follows the current release naming convention, while its contents target `armeabi-v7a`.

Install an APK from Android Downloads after allowing installs from the source application when Android asks.

## Build from source

### Requirements

- Android Studio with Android SDK 36
- Android NDK `26.3.11579264`
- CMake `3.22.1`
- JDK 17
- Rust stable with required Android targets:

  ```powershell
  rustup target add aarch64-linux-android armv7-linux-androideabi
  ```

- `cargo-ndk`

### Build APKs

Gradle builds and stages matching Aether library automatically:

```powershell
.\gradlew.bat :app:assembleDebug -PtargetAbi=arm64-v8a
.\gradlew.bat :app:assembleDebug -PtargetAbi=armeabi-v7a
```

Build both ABI splits:

```powershell
.\gradlew.bat :app:assembleDebug
```

APK output:

```text
app/build/outputs/apk/debug/app-arm64-v8a-debug.apk
app/build/outputs/apk/debug/app-armeabi-v7a-debug.apk
```

## CI releases

The Android release workflow runs manually and builds debug APKs for `arm64-v8a` and `armeabi-v7a`. It uploads only direct `.apk` files to a **draft** GitHub Release. See the release guide.

To prepare v0.1.1:

```bash
Open **Actions**, select **Build Android APKs**, choose **Run workflow**, and enter `v0.1.1` as the release tag.
```

Review the draft assets and release note in GitHub, then publish the release when ready.

## Project layout

```text
app/                 Android application and JNI bridge
core/aether/         Aether Rust core used by this client
core/quiche/         QUIC/HTTP3 dependency used by Aether
.github/             issue forms and Android release workflow
```

## Contributing

Read CONTRIBUTING.md before opening an issue or pull request. Bug and feature forms are available from New issue.

## Security

Do not disclose security-sensitive tunnel, credential, or traffic issues in public issues. Read SECURITY.md for private reporting guidance.

## License

Aethery is licensed under GNU AGPL-3.0. Aether and bundled dependencies retain their own license terms; see their respective files in `core/`.

## Credits

- Aether — network core.
- quiche — QUIC and HTTP/3 library used by Aether.
- Built by ZethRise.
