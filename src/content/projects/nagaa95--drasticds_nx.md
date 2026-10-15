---
title: "NaGaa95/DrasticDS_nx"
owner: "NaGaa95"
name: "DrasticDS_nx"
fullName: "NaGaa95/DrasticDS_nx"
description: "Port of Drastic DS for Switch."
sourceUrl: "https://github.com/NaGaa95/DrasticDS_nx"
stars: 34
forks: 0
language: "C"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-07-24"
pushedAt: "2026-07-23T22:24:57Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

Drastic DS · Switch Port

A native wrapper/port of Drastic DS Emulator to the Nintendo Switch.
It loads the original Android ARM64 emulator core `libdrastic_arm64.so`,
patches it, and runs it inside a minimal Android-like
environment natively.

Everything ships as a **single `DrasticDS.nro`**: it bundles the build-supplied
Drastic core, game database and cheat table, both renderer backends (OpenGL +
Vulkan/NVK), and an SDL cover-art launcher. Nintendo DS BIOS and firmware are
never packed into the NRO.

### How to install

1. Copy `DrasticDS.nro` into `/switch/` on your SD card.
2. Copy your own Nintendo DS system dumps into `/switch/drastic/system/`:
   * `nds_bios_arm7.bin` — 16 KiB ARM7 BIOS.
   * `nds_bios_arm9.bin` — 4 KiB ARM9 BIOS.
   * `nds_firmware.bin` — 256 KiB firmware.
3. Put legally obtained `.nds`, `.zip`, or `.rar` games in
   `/switch/drastic/games/`, or add another SD, USB, or SMB library folder from
   **Settings > Library & storage**.

The launcher creates the rest of the folder tree and extracts the selected
renderer and bundled application resources on demand:

```text
/switch/DrasticDS.nro
/switch/drastic/
  .emu/                   <- hidden renderer hosts, extracted when selected
    DrasticDS_nx_gl.nro   <- OpenGL host
    DrasticDS_nx_vk.nro   <- Vulkan/NVK host
  cache/
  cheats/                 <- custom Action Replay files
  cores/                  <- Drastic ARM64 core, auto-extracted
  covers/                 <- cover art (.png)
  forwarders/             <- HOME-menu shortcut working data
  gamecfg/                <- per-game launcher settings
  games/                  <- default ROM library
  lsfg/                   <- optional user-supplied Lossless.dll
  microphone/             <- optional microphone samples
  scripts/                <- Lua scripts
  slot2/                  <- Slot-2 data
  system/
    nds_bios_arm7.bin     <- your ARM7 BIOS dump (you supply)
    nds_bios_arm9.bin     <- your ARM9 BIOS dump (you supply)
    nds_firmware.bin      <- your firmware dump (you supply)
    game_database.xml     <- auto-extracted Drastic database
    usrcheat.dat          <- auto-extracted cheat database
  user/backup/            <- cartridge save files
  user/savestates/        <- save states and previews
  launcher.ini            <- launcher settings
  drastic.ini             <- effective settings for the next launch
```

### Default controls

* **L + R + Plus** — open the in-game menu.
* **ZR** — fast-forward; hold/toggle behavior is configurable.
* **ZL** — swap the DS screens.
* **Touch screen** — stylus input on the displayed bottom DS screen.
* **Right Stick + R-Stick** — docked-mode analog stylus and touch press.
* **L-Stick** — Drastic white-noise microphone input.
* **L + R + Y / X** — save/load the current state slot.
* **L + R + Up / Down** — change the state slot.
* **L + R + A** — reset the emulated DS.

Every runtime hotkey can be rebound to a button combination under
**Settings > Controller**.

### Notes

This will not run in applet/album mode. It needs the full memory and JIT
services of a game override. Launch it by holding **R** while opening an
installed title, or use a forwarder.

The launcher supports multiple library folders across SD, USB mass storage,
and SMB shares, cover downloads, themes, a file manager, and HOME-menu
shortcut creation.

Press **L + R + Plus** to open the in-game menu for save states, per-title
Action Replay cheats, screen layout and filter controls, emulation/audio/input
settings, frame generation, reset, and return to the launcher.

LSFG 2x Frame Generation is available with the Vulkan renderer under
**Settings > Frame Generation**. You must provide your own `Lossless.dll` at
`/switch/drastic/lsfg/Lossless.dll`. LSFG must be enabled before launching a
game so the Vulkan device and swapchain can be prepared; it can then be toggled
from the in-game menu.

Nearest, linear, Quilez, scanline, Scale2x, HQ2x, FXAA, FXAA HQ, and SMAA use
Drastic's original Android post-FX programs on both renderers. OpenGL executes
the generated GLES programs directly. Vulkan executes SPIR-V generated from
the same `.dfx`/`.dsd`.

### How to build

Install the devkitPro Switch toolchain and portlibs:

```sh
pacman -S devkitA64 switch-tools libnx switch-sdl2 switch-sdl2_ttf \
          switch-sdl2_image switch-curl switch-mesa switch-libdrm_nouveau \
          switch-zlib switch-zstd cmake ninja git python \
          mingw-w64-ucrt-x86_64-glslang
```

The default sibling layout expected by `build_all.sh` is:

```text
DrasticDS/
  com.dsemu.drastic_r2.6.0.4a-109_minAPI14(arm64-v8a)(nodpi)_drasticds.com/
  vulkandrv/builddir-switch/
  DrasticDS_nx/
```

```sh
bash ./build_all.sh
```

### Credits

* Drastic developers.
* fgsfds for the Switch so-loader groundwork reused here.
* TheOfficialFloW for the original Android so-loader lineage.
* Dantiicu for the Switch Vulkan driver.
* PancakeTAS for LSFG-VK.
* Slluxx for IconGrabber.

### Support

If you enjoy my work and want to support me:

[*图片：ko-fi*](https://ko-fi.com/D1D1P2MOG)

### Legal

This project has no affiliation with Exophase or the Drastic developers.
Drastic is proprietary software. No emulator core, BIOS, firmware, database,
cheat table, `Lossless.dll`, or game image is distributed in this repository;
you must supply legally obtained copies. The generated NRO intentionally
contains no Nintendo DS BIOS or firmware. Do not redistribute an NRO containing
other proprietary material unless you have the necessary rights. We do not
condone piracy.

Unless noted otherwise, the wrapper source is under the MIT License (see
`LICENSE`). The vendored LSFG-VK subset under `third_party/lsfg-vk` is
GPL-3.0-or-later. `Lossless.dll` remains proprietary and must be supplied by
the user.
