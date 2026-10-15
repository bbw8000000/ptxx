---
title: "UIseries/ai-robot"
owner: "UIseries"
name: "ai-robot"
fullName: "UIseries/ai-robot"
description: "RK3506 Voice Robot An embedded AI voice assistant running on the Rockchip RK3506 development board. Pure C, single-threaded event loop, zero dynamic memory allocation."
sourceUrl: "https://github.com/UIseries/ai-robot"
stars: 90
forks: 1
language: "C"
topics: []
license: "NOASSERTION"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-07-14T02:03:56Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

<<<<<<< HEAD

  
  
  
  


🎙️ RK3506 Voice Robot

An embedded AI voice assistant running on Rockchip RK3506 — push a button,ask a question, and see the AI's answer rendered on an LCD screen.


  Button Press → Voice Recording → WiFi Upload → AI Agent → LCD Display


---
*图片：robot*
## Table of Contents

- Overview
- System Architecture
- State Flow
- Hardware Requirements
- Quick Start
- Build Guide
- Configuration
- AI Server API
- Project Structure
- Tech Stack
- Design Decisions
- License

---

## Overview

**RK3506 Voice Robot** is a pure-C embedded application that turns a Rockchip RK3506 development board into a voice-driven AI companion. It captures speech via a microphone, uploads the audio over WiFi to a remote AI Agent, and renders the text reply on an LCD screen — all without any dynamic memory allocation.

### Why this project?

| Use Case | Description |
|----------|-------------|
| 🧒 Kids' Q&A | Press a button, ask "How did dinosaurs go extinct?", see the answer |
| 🍳 Kitchen Helper | Query recipes with messy hands — "How do I make tomato egg stir-fry?" |
| 👴 Elderly Companion | Voice-first interface for seniors uncomfortable with smartphones |
| 💼 Desk Assistant | Quick queries during work — exchange rates, weather, reminders |

### Key Metrics

| Metric | Target |
|--------|--------|
| Voice upload → screen response | ≤ 3 seconds (excluding recording time) |
| Memory allocation | 100% static (compile-time), no malloc/free at runtime |
| WiFi resilience | Automatic reconnection on disconnect |
| Error handling | 5 categories: audio / WiFi / HTTP / timeout / server error |
| Single-utterance recording | Up to 60 seconds at 16kHz/16bit/mono |

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                      main.c  (50ms event loop)                    │
│                                                                    │
│  ┌───────────┐    ┌──────────────────┐    ┌───────────────────┐  │
│  │ ButtonLED │◄───│   StateMachine    │───►│   AudioCapture    │  │
│  │ (GPIO)    │    │                   │    │    (ALSA PCM)     │  │
│  └───────────┘    │  IDLE             │    └───────────────────┘  │
│                   │  RECORDING        │                            │
│                   │  PROCESSING       │    ┌───────────────────┐  │
│                   │  RESULT / ERROR   │───►│   HttpClient      │  │
│                   └────────┬─────────┘    │   (libcurl)       │  │
│                            │              └─────────┬─────────┘  │
│                            ▼                        │            │
│                   ┌──────────────────┐    ┌─────────┴─────────┐  │
│                   │    Display       │    │   WiFiManager     │  │
│                   │ (Framebuffer +   │    │ (wpa_supplicant)  │  │
│                   │  FreeType)       │    └───────────────────┘  │
│                   └──────────────────┘                            │
└──────────────────────────────────────────────────────────────────┘
```

### Layered Design

| Layer | Module | Responsibility |
|-------|--------|----------------|
| 🎮 Application | `main.c` | Init all modules → 50ms poll loop → graceful shutdown |
| 🧠 Business Logic | `state_machine` | 9 transition rules, 5 states with enter/update/exit handlers |
| 🔌 Core Services | `audio_capture`, `http_client`, `display`, `wifi_manager` | Independently testable modules |
| 🖥️ Hardware Drivers | ALSA, Framebuffer, GPIO sysfs, SPI | Linux kernel interfaces |

---

## State Flow

```
                    ┌─────────────────────────────────────┐
                    │                                     │
                    ▼                                     │
              ┌──────────┐  btn_press   ┌──────────────┐ │
              │   IDLE   │ ──────────► │  RECORDING   │ │
              │          │ ◄────────── │              │ │
              └────┬─────┘   timeout   └──────┬───────┘ │
                   ▲                          │          │
                   │              btn_release │          │
                   │              or timeout   │          │
                   │                          ▼          │
                   │                    ┌──────────────┐ │
                   │                    │  PROCESSING  │ │
                   │                    └──┬───────┬───┘ │
                   │               success│       │fail  │
                   │                      ▼       ▼      │
                   │          ┌────────────┐ ┌─────────┐ │
                   └──────────│   RESULT   │ │  ERROR  │ │
                    timeout / │            │ │         │ │
                    btn_press └────────────┘ └─────────┘ │
                                                         │
                              └──────────────────────────┘
```

| State | Screen | LED | Behavior |
|-------|--------|-----|----------|
| **IDLE** | "Press button to ask" | OFF | Polls GPIO button |
| **RECORDING** | "Listening..." + duration | ON | ALSA capture to static buffer (max 60s) |
| **PROCESSING** | "Thinking..." | FAST BLINK | WiFi check → HTTP upload → parse JSON reply |
| **RESULT** | AI reply text | OFF | Display answer for 5s, then back to IDLE |
| **ERROR** | Error icon + description | OFF | Display error for 3s, then back to IDLE |

---

## Hardware Requirements

| Component | Specification | Notes |
|-----------|--------------|-------|
| **SoC** | Rockchip RK3506 | ARM Cortex-A53 |
| **OS** | Linux (Buildroot / Yocto) | Kernel 5.10+, glibc or musl |
| **Microphone** | I2S or USB mic | ALSA `hw:0,0` compatible |
| **LCD** | SPI / RGB interface | Default 240×320, Framebuffer `/dev/fb0` |
| **WiFi** | SDIO / USB module | wpa_supplicant managed |
| **Button** | GPIO push button | Pull-up, active-low or active-high |
| **LED** | GPIO LED | Status indicator |

> 💡 The GPIO pin numbers for the button and LED are configured in `config/app_config.ini`. Defaults are placeholders — adjust to match your board.

---

## Quick Start

### 1. Clone & prepare dependencies

```bash
git clone https://github.com/yourname/rk3506-voice-robot.git
cd rk3506-voice-robot
```

On your cross-compilation host, install build dependencies:

```bash
# Debian/Ubuntu
sudo apt install libasound2-dev libcurl4-openssl-dev \
                 libfreetype6-dev libconfig-dev cmake

# Also install the aarch64 cross-compiler
sudo apt install gcc-aarch64-linux-gnu
```

### 2. Download a Chinese font

Place a TrueType Chinese font (e.g., [Noto Sans SC Regular](https://fonts.google.com/noto/specimen/Noto+Sans+SC)) in `resources/`:

```bash
# Example — rename your downloaded font
mv ~/Downloads/NotoSansSC-Regular.ttf resources/
```

### 3. Configure

Edit `config/app_config.ini` — at minimum, set your WiFi credentials:

```ini
[wifi]
ssid = "YourWiFiSSID"
psk  = "YourWiFiPassword"
```

### 4. Cross-compile

```bash
mkdir build && cd build
cmake .. -DTOOLCHAIN_PATH=/usr -DCMAKE_BUILD_TYPE=Release
make -j$(nproc)
```

The output is `build/voice_robot` — a statically-linkable ARM aarch64 binary.

### 5. Deploy & run

Copy the binary, config, fonts, and scripts to your RK3506 board:

```bash
# On the target device
./scripts/start_wifi.sh     # Bring up WiFi
./scripts/run_voice_robot.sh
```

---

## Build Guide

### Cross-compilation (aarch64 target)

```bash
mkdir build && cd build

# Option A: system cross-compiler
cmake .. -DCMAKE_BUILD_TYPE=Release

# Option B: custom SDK toolchain
cmake .. -DTOOLCHAIN_PATH=/opt/rk3506-sdk \
         -DCMAKE_BUILD_TYPE=Release

make -j$(nproc)
```

**CMake options:**

| Option | Default | Description |
|--------|---------|-------------|
| `TOOLCHAIN_PATH` | *(empty)* | Path to aarch64 toolchain root (`bin/aarch64-linux-gnu-gcc`) |
| `CMAKE_BUILD_TYPE` | *(empty)* | `Release` or `Debug` |

### Local build (x86_64 for testing)

```bash
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Debug
make -j$(nproc)
```

> ⚠️ Local builds are useful for syntax checking and static analysis, but GPIO, ALSA, and Framebuffer calls will fail without real hardware.

### Build artifacts

```
build/
├── voice_robot        # Main executable
├── CMakeFiles/
└── CMakeCache.txt
```

---

## Configuration

All runtime parameters live in `config/app_config.ini`. The application reads this file once at startup.

### Full reference

| Section | Key | Type | Default | Description |
|---------|-----|------|---------|-------------|
| `[audio]` | `device` | string | `hw:0,0` | ALSA PCM capture device |
| | `sample_rate` | int | `16000` | Sampling rate in Hz |
| | `channels` | int | `1` | 1 = mono, 2 = stereo |
| | `record_duration_sec` | int | `60` | Maximum recording duration |
| `[wifi]` | `interface` | string | `wlan0` | Wireless interface name |
| | `ssid` | string | `your_ssid` | WiFi network SSID |
| | `psk` | string | `your_password` | WiFi password (WPA2-PSK) |
| `[http]` | `server_url` | string | `http://47.81.10.119/` | AI Agent server URL |
| | `timeout_sec` | int | `10` | HTTP request timeout in seconds |
| `[display]` | `fb_device` | string | `/dev/fb0` | Framebuffer device path |
| | `font_path` | string | `resources/NotoSansSC-Regular.ttf` | TrueType font path |
| | `font_size_pt` | int | `18` | Font size in points |
| | `lcd_width` | int | `240` | Screen width in pixels |
| | `lcd_height` | int | `320` | Screen height in pixels |
| `[gpio]` | `button_gpio` | int | `0` | Button GPIO number (sysfs) |
| | `led_gpio` | int | `1` | LED GPIO number (sysfs) |
| `[system]` | `log_level` | int | `2` | 0=ERROR, 1=WARN, 2=INFO, 3=DEBUG |

> 🔄 Changes take effect after restarting `voice_robot`.

---

## AI Server API

The AI Agent server is a separate service that receives audio and returns text replies.

### Audio Upload

```
POST {server_url}
Content-Type: multipart/form-data
```

| Field | Type | Description |
|-------|------|-------------|
| `audio` | file | WAV file, 16kHz / 16-bit / mono PCM |

### Response Format (Success)

```json
{
    "reply": "The AI assistant's response text"
}
```

- HTTP 200–399: success — the `reply` field is extracted and displayed on screen.
- HTTP 4xx/5xx: failure — an error message is shown with the HTTP status code.

### Testing with curl

```bash
# Test the AI endpoint directly
curl -X POST http://47.81.10.119/ \
     -F "audio=@test.wav"
```

---

## Project Structure

```
rk3506_voice_robot/
│
├── CMakeLists.txt                  # Build system (cross-compile aarch64)
├── README.md                       # This file
│
├── config/
│   └── app_config.ini              # Runtime configuration (6 sections, 20 fields)
│
├── include/
│   ├── common_types.h              # Shared enums, structs, callbacks, LOG macros
│   ├── error_codes.h               # Error codes (-1xxx to -9xxx by module)
│   ├── app_config.h                # Config parser API (load/reload/error)
│   ├── audio_capture.h             # ALSA PCM capture (open/set_params/read/close)
│   ├── wifi_manager.h              # WiFi status detection + reconnect
│   ├── http_client.h               # HTTP multipart upload + JSON parse callback
│   ├── display.h                   # Framebuffer drawing + text rendering
│   ├── font_renderer.h             # FreeType glyph rendering + UTF-8 decode
│   ├── state_machine.h             # 9 transition rules, 5-state controller
│   └── button_led.h                # GPIO sysfs button polling + LED control
│
├── src/
│   ├── main.c                      # Entry point: init → 50ms event loop → shutdown
│   ├── app_config.c                # libconfig parser with validation
│   ├── audio_capture.c             # ALSA capture (xrun recovery included)
│   ├── wifi_manager.c              # /sys/class/net/operstate reader (zero-fork)
│   ├── http_client.c               # WAV header assembly + multipart POST + cJSON parse
│   ├── display.c                   # Framebuffer pixel ops (32bpp + 16bpp/RGB565)
│   ├── font_renderer.c             # FreeType init → FT_Load_Glyph → GlyphBitmap
│   ├── state_machine.c             # Full enter/update/exit for all 5 states
│   └── button_led.c                # sysfs GPIO export/direction/value I/O
│
├── libs/
│   └── cJSON/
│       ├── cJSON.h                 # v1.7.18 (ARM GCC compatible)
│       └── cJSON.c                 # ~2750 lines, single-file JSON parser
│
├── resources/
│   └── font_placeholder.txt        # Instructions for downloading Noto Sans SC
│
└── scripts/
    ├── start_wifi.sh               # wpa_supplicant init + dhclient
    └── run_voice_robot.sh          # LD_LIBRARY_PATH + exec voice_robot
```

**Stats:** 12 headers, 9 source files, 2 library files, 2 scripts, 1 config, 1 font placeholder = **~4,800 lines of C**.

---

## Tech Stack

| Component | Technology | Why |
|-----------|-----------|-----|
| Language | **C11** | Zero runtime overhead, static memory, ideal for embedded |
| Build | **CMake 3.16+** | Cross-compilation for aarch64 toolchains |
| Audio | **ALSA libasound** | Linux standard, RK3506 BSP includes driver |
| HTTP | **libcurl** (easy) | Mature multipart/form-data support |
| JSON | **cJSON v1.7.18** | Single-file C library, no dependencies |
| Font | **FreeType 2** | Industry-standard glyph rendering |
| Display | **Linux Framebuffer** | Universal, no GUI toolkit needed |
| Config | **libconfig** | Lightweight INI-style parser |
| GPIO | **sysfs** | Standard Linux GPIO interface (no kernel module needed) |
| WiFi | **wpa_supplicant** | Pre-installed on Buildroot/Yocto |

---

## Design Decisions

### Why pure C and static memory?
RK3506 has limited RAM (~256MB–512MB). Dynamic allocation (`malloc`/`free`) leads to fragmentation over long-running sessions. All buffers are compile-time sized: the recording buffer is `16kHz × 2bytes × 60s = 1.92MB`, and the HTTP response buffer is `4KB` — both statically allocated.

### Why a single-threaded event loop?
Multi-threading on embedded Linux introduces mutex/condition-variable complexity and context-switch overhead. The 50ms poll loop is simple, predictable, and sufficient for this I/O profile (button polling, audio drain, network I/O).

### Why Framebuffer instead of a GUI toolkit?
The display only renders simple text (no widgets, no animations). Direct framebuffer access skips the heavy dependencies of toolkits like Qt or LVGL while supporting both 32bpp (ARGB) and 16bpp (RGB565) pixel formats — covering virtually all SPI LCDs on the market.

### Error handling philosophy
Every module returns `0` on success and negative `ErrorCode` on failure. The state machine treats failures as events (`EVENT_HTTP_FAIL`) and routes them to a dedicated `ERROR` state with a user-friendly screen message — the robot never gets stuck.

---

## Roadmap

- [x] **P0** — Core voice → AI → display pipeline
- [x] **P1** — Button/LED interaction, state machine, error handling
- [ ] **P2.1** — VAD (Voice Activity Detection) for hands-free mode
- [ ] **P2.2** — Conversation history with scrollback on screen
- [ ] **P2.3** — TTS (Text-to-Speech) audio playback
- [ ] **P2.4** — OTA firmware upgrade over WiFi

---

## License

MIT © 2026

---


  Built with ❤️ for the embedded Linux community

=======
# ai-robot
RK3506 Voice Robot An embedded AI voice assistant running on the Rockchip RK3506 development board. Pure C, single-threaded event loop, zero dynamic memory allocation.
>>>>>>> 33334bbbfbdf258c17264f132e553142d668b8d3
