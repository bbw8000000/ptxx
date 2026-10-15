---
title: "Kindness-Kismet/stelliberty_android"
owner: "Kindness-Kismet"
name: "stelliberty_android"
fullName: "Kindness-Kismet/stelliberty_android"
description: "A modern network client for android."
sourceUrl: "https://github.com/Kindness-Kismet/stelliberty_android"
stars: 31
forks: 0
language: "Kotlin"
topics: ["kotlin"]
license: "GPL-3.0"
defaultBranch: "main"
snapshotDate: "2026-09-29"
pushedAt: "2026-09-29T02:19:01Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Stelliberty Android

*图片：English*
&nbsp;
*图片：简体中文*


[*图片：Android*](https://developer.android.com)
[*图片：Kotlin*](https://kotlinlang.org)
*图片：License*


Stelliberty is a native Android proxy client based on Mishka, powered by mihomo, with a Jetpack Compose interface built on miuix.

Use Android VPN without root, or choose ROOT TUN and ROOT TPROXY for privileged traffic capture. Manage subscriptions, proxy groups, connections, and routing from one app.


---

## Navigation

- Installation
- Quick Start
- Features
- FAQ
- Development Guide
- Release Workflow
- Contributing
- License and Credits


---

## 📦 Installation

↑ Back to Navigation

Download an APK from the Releases page.

| Channel | Where to find it | Intended use |
|---|---|---|
| Stable | Latest stable release | Regular use |
| Beta | Releases marked **Pre-release**, with a `-betaN` version | Try upcoming changes |

Android 12 or later is required. Choose `arm64-v8a` for current phones or `x86_64` for devices and emulators with that architecture.

Stable and beta packages share the same application ID and signing key. Android checks the version code when installing an update; a beta of the next version may be newer than the current stable release.


---

## 🚀 Quick Start

↑ Back to Navigation

1. Import a subscription URL, scan a QR code, or select a local configuration file.
2. Select the active subscription and choose nodes on the proxy page.
3. Choose Rule, Global, or Direct mode on the home page.
4. Start the proxy and approve the Android VPN permission. ROOT modes require root access instead.

For configuration options, see the [mihomo documentation](https://wiki.metacubex.one/en/config/).


---

## ✨ Features

↑ Back to Navigation

| Area | Capabilities |
|---|---|
| Traffic capture | VPN, ROOT TUN, ROOT TPROXY, per-app allowlists and blocklists, ROOT hotspot handling |
| Subscriptions | URL, file, and QR import; age-encrypted configurations; scheduled updates; per-subscription User-Agent |
| Proxy management | Group selection, latency tests, provider refresh, configuration editing |
| Diagnostics | Live traffic, connections, logs, and DNS queries |
| Automation | Quick Settings tile, start on boot, and Wi-Fi policies |
| Appearance | Light and dark themes, dynamic colors, blur effects, and wide-screen layouts |
| Data | Backup, restore, and WebDAV support |


---

## ❓ FAQ

↑ Back to Navigation

### Do I need root?

VPN mode works without root. ROOT TUN and ROOT TPROXY need root permission; TPROXY also requires support from the device kernel.

### How do the tunnel modes differ?

| Mode | Traffic capture |
|---|---|
| VPN | Android creates and manages the VPN interface |
| ROOT TUN | The core creates a TUN interface and configures routing |
| ROOT TPROXY | Firewall rules and policy routing redirect traffic to the core |

### Why does a configuration change require a restart?

Configuration changes currently take effect by restarting the core. Rule, Global, and Direct describe routing behavior; they are separate from the tunnel mode.

### Does the app provide a subscription?

No. Import your own subscription or configuration. The project supplies the client and its proxy core.


---

## 🛠 Development Guide

↑ Back to Navigation

### Prerequisites

| Tool | Requirement |
|---|---|
| Python | 3.10 or later |
| Git | Required for submodules |
| Android SDK | Install command-line tools and accept SDK licenses; SDK settings are in ProjectConfig.kt |
| Go | The prebuild script downloads the latest stable release into `build/go/`; no system installation is needed |
| JDK and Gradle launcher | Downloaded by the prebuild script |

Android Gradle Plugin resolves the NDK and CMake used for native compilation. Android dependency coordinates and tool versions are maintained in libs.versions.toml.

Local builds and CI use the same portable Go setup, with archives verified against the official SHA256 checksums. Regular builds reuse the downloaded toolchain without checking the network. Run `python scripts/prebuild.py --refresh-go` to check for and install the latest stable release; a compiler version change also rebuilds the native core.

### Architecture

```text
android/app/src/main/kotlin/com/stelliberty/android/
├── ui/           Compose screens, components, navigation, and themes
├── viewmodel/    Screen state and user actions
├── domain/       Models and repository interfaces
├── data/         Repositories, JSON stores, core API clients, and backup
├── platform/     Android integration and service control
└── service/      VPN, ROOT, subscriptions, and background services
android/app/src/main/cpp/                        JNI and process helpers
android/app/src/main/native/stelliberty_core/     Go core integration
third_party/                                    mihomo and scripta submodules
scripts/                                        Prebuild and build entry points
```

Screens receive dependencies through parameters. ViewModels depend on repository interfaces, and platform code owns Android-specific behavior. See AGENTS.md for project conventions.

### Build and Verify

```bash
git clone --recurse-submodules https://github.com/Kindness-Kismet/stelliberty_android.git
cd stelliberty_android
python scripts/prebuild.py
python scripts/build.py --dev
```

| Command | Result |
|---|---|
| `python scripts/build.py compile --dev` | Compile debug Kotlin without rebuilding the native core |
| `python scripts/build.py --dev` | Build a debug APK |
| `python scripts/build.py` | Build a release APK |
| `python scripts/build.py --abi x86_64` | Build for a selected architecture |
| `python scripts/build.py --version 1.0.1-beta1` | Override the packaged version without editing source metadata |
| `python scripts/prebuild.py --refresh-geo` | Refresh bundled GeoIP resources |
| `python scripts/prebuild.py --refresh-go` | Update portable Go to the latest stable release |

APKs are collected in `build/apk/`. Release signing uses `KEYSTORE_PATH`, `KEYSTORE_PASS`, `KEY_ALIAS`, and `KEY_PASSWORD` environment variables. An unsigned local release build must be signed before installation.

The repository uses a directory and extension allowlist. CI also rejects tracked files outside that allowlist, including files added with force. Downloaded launchers, JDKs, Go toolchains, GeoIP data, native binaries, caches, and temporary files stay outside Git. Collected Baseline Profiles remain tracked because a download cannot recreate them.


---

## 🔖 Release Workflow

↑ Back to Navigation

| Workflow | Trigger | Output |
|---|---|---|
| Stable Build | Version change on `main`, or manual dispatch from `main` | `vX.Y.Z`, marked as the latest stable release |
| Beta Build | Product changes on `beta` excluding pushes that change the application version or changelog, or manual dispatch from `beta` | Next patch version with an increasing `-betaN` suffix, marked as a pre-release |
| Verify Pull Request | Pull requests targeting `beta` or `main` | Kotlin compilation without release credentials or publishing |

Both release channels build signed **release** APKs for all two supported 64-bit architectures. The local `--dev` flag selects a debug build and does not select the beta release channel.

Configure these repository Actions secrets before publishing:

| Secret | Value |
|---|---|
| `KEYSTORE_BASE64` | Release keystore encoded as Base64 without line wrapping |
| `KEYSTORE_PASS` | Keystore password |
| `KEY_ALIAS` | Signing key alias |
| `KEY_PASSWORD` | Signing key password |

Use the same key for both channels. APK uploads finish before a release becomes public. Stable releases use .github/CHANGELOG.md; beta releases list commits since the previous release baseline. The first beta uses the current changelog if no baseline exists.

The version-bump skill updates `ProjectConfig.VERSION_NAME` and rewrites the current changelog: English bullets first, a separator, then matching Simplified Chinese bullets. It does not raise dependency versions or publish releases on its own.


---

## 📋 Contributing

↑ Back to Navigation

Submit changes to `beta`. Promote reviewed changes from `beta` to `main` for a stable release.

- Keep each change focused and preserve existing user data and configuration behavior.
- Maintain English, Simplified Chinese, and Traditional Chinese app strings together.
- Register new interactive controls in the debug test ID system.
- Run `git diff --check` and the relevant compile or package command.
- Read the matching project skill before changing UI, services, subscriptions, core APIs, or native builds.


---

## 📄 License and Credits

↑ Back to Navigation

This project is licensed under GPL-3.0. Third-party projects retain their own licenses.

- Mishka — direct upstream
- mihomo — proxy core; integrated through the mihomo submodule
- miuix — Compose UI components
- scripta — configuration editor submodule
