---
title: "zeroa234/ryza-ai-revive"
owner: "zeroa234"
name: "ryza-ai-revive"
fullName: "zeroa234/ryza-ai-revive"
description: "Offline fan-made Ryza AI companion. Bring your own LLM/TTS. 离线同人莱莎 AI 陪伴，自填大模型与语音。"
sourceUrl: "https://github.com/zeroa234/ryza-ai-revive"
stars: 34
forks: 5
language: "JavaScript"
topics: ["android", "chatbot", "electron", "html", "javascript", "llm", "nsfw", "offline"]
license: "未标注"
defaultBranch: "master"
snapshotDate: "2026-09-03"
pushedAt: "2026-09-02T10:17:27Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Ryza Chat / 莱莎 Chat

**EN** Offline fan-made AI companion. One static web app, plus thin Windows and Android shells. You bring your own LLM and TTS keys — nothing talks to an official server.

**中文** 离线同人 AI 陪伴。同一套纯前端，外加 Windows / Android 薄壳。大模型和语音接口由你在设置里自填，不连接任何官方服务。

> Unofficial fan project for personal use. Not affiliated with Gust, Koei Tecmo, or the original publisher.  
> 非官方同人项目，仅供个人使用，与官方及原发行方无关。

Current version: **1.2.15** — installer and APK: Releases

当前版本 **1.2.15**，Windows 安装包与安卓 APK 见 Releases。

---

## Features / 功能

| EN | 中文 |
|---|---|
| Talk modes (chat / story / immersive / ASMR / text) | 五种对话模式 |
| Spine 4.2 portrait + scenes, sit/stand, tap reactions | 立绘与场景、坐站切换、点击反应 |
| Local RPG layer (stamina, quests, inventory, daily login) | 体力 / 任务 / 背包 / 每日登录 |
| Bring-your-own OpenAI-compatible LLM + TTS (incl. Qwen) | 自填 OpenAI 兼容 LLM 与 TTS（含百炼） |
| 7 UI languages | 界面七语 |
| Desktop frameless window + Android WebView APK | 无边框桌面窗 + 安卓 WebView |

---

## Assets / 素材

This git repository is **source code only**. Original-game textures, Spine `.skel` binaries, voice / BGM / ambient / SE audio, and bundled fonts are **not** in the tree (including git history).

本仓库只放源码。原作贴图、Spine 骨骼二进制、语音 / BGM / 环境音 / SE、以及随包字体都不进 git，**历史提交里也没有**。

To run or rebuild from source, restore media into `web/assets/` (png / jpg / skel / m4a / wav / ttf). Do not commit them.

从源码运行或打包前，把素材放回 `web/assets/`，不要提交：

```powershell
python scripts/restore_media.py path\to\RyzaChat-1.2.15.apk
# or an unpacked desktop tree:
python scripts/restore_media.py path\to\win-unpacked\resources\web
```

JSON / atlas / SVG under `web/assets/` stay in git so the code still has structure tables. Raster, audio, and `.skel` do not.

`web/assets/` 里的 JSON、atlas、SVG 仍在仓库里；位图、音频、`.skel` 不在。

---

## Privacy / 隐私

- `config/providers.json` is **gitignored**. Copy `config/providers.example.json` and fill keys locally. Never commit it.
- Keys live in the app settings (localStorage / `%AppData%\RyzaChat`). They are not baked into exe/APK.
- Packaging runs `scripts/privacy_check.py` and **aborts** if a key-shaped secret or a personal machine path would ship.
- 打包产物里没有密钥。本仓库也不应出现账号、本机路径、个人网关。

---

## Run from source / 从源码运行

Restore media first (see **Assets / 素材** above), then start the bundled static server. Spine and `fetch` cannot use `file://`. The server also provides `/_proxy` for CORS:

```powershell
python scripts/serve.py
# open http://127.0.0.1:8765/
```

Do not use `python -m http.server` — there is no proxy, LLM/TTS will fail CORS.

### Desktop / 桌面

```powershell
cd desktop
npm install
npx electron .
```

Installer:

```powershell
powershell -File scripts/build_desktop.ps1
# -> output/desktop/RyzaChat-Setup-.exe
```

### Android / 安卓

```powershell
# one-time JDK 17 + Android SDK (see RYZA_ANDROID_TOOLS below)
powershell -File scripts/setup_android_tools.ps1
powershell -File scripts/build_apk.ps1
# -> output/android/RyzaChat-.apk
```

Toolchain directory: set `RYZA_ANDROID_TOOLS`, or put a single path in gitignored `config/android-tools.local.txt`. Default is `.android-tools/` inside this repo (also gitignored).

---

## Settings / 设置里要填什么

1. **LLM** — OpenAI-compatible base URL, model id, API key.
2. **TTS** (optional) — separate OpenAI-compatible or Qwen DashScope fields. Clone/preset model names must be filled on device; packaged builds do not include `providers.json`.

开发水合：把填好的 `config/providers.json` 放在本地即可（已被 ignore）。

---

## Tests / 测试

```powershell
node scripts/boot_smoke.js
node scripts/game_logic_regression.js
node scripts/memory_regression.js
node scripts/motion_regression.js
node scripts/expression_coverage.js
python scripts/privacy_check.py web
```

---

## Layout / 目录

```
web/          app (static HTML/JS; media under assets/ is local-only)
desktop/      Electron shell (ryza://app)
android/      WebView + local AssetServer
scripts/      serve, indexes, packaging, privacy gate
config/       version.json + providers.example.json
docs/         PROJECT / AUDIT / HANDOFF (implementation notes)
```

More detail: `docs/PROJECT.md`.

---

## Disclaimer / 声明

Character likenesses and original-game media originate from a copy of the game the author owns. They are not distributed via this git repository. This tree is a from-scratch client. Do not treat it as an official product, and do not use it for redistribution of paid services.

角色形象与原作媒体来自作者自有的游戏拷贝，不通过本 git 仓库分发。代码从零编写。请勿当成官方产品，也请勿拿去二次分发或接官方服务。
