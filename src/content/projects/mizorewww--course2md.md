---
title: "mizorewww/course2md"
owner: "mizorewww"
name: "course2md"
fullName: "mizorewww/course2md"
description: "Turn YouTube, Bilibili, or local course/meeting recordings into slide-illustrated Markdown and HTML lecture notes."
sourceUrl: "https://github.com/mizorewww/course2md"
stars: 121
forks: 5
language: "Rust"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-01"
pushedAt: "2026-09-01T04:32:08Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# course2md

Turn YouTube, Bilibili, or local course/meeting recordings into slide-illustrated Markdown and HTML lecture notes.

[*图片：Rust*](https://www.rust-lang.org/)
*图片：License*
*图片：Platform*
[*图片：AUR*](https://aur.archlinux.org/packages/course2md-bin)

**English** · 中文

---

## Quick Start

> Make sure you completed the Installation section first.

Simply provide an online video URL or a path to a local video file. When the run finishes, the illustrated notes (`course.md` / `course.html`) appear under `./out////`:

```bash
# Process a Bilibili video
course2md https://www.bilibili.com/video/BV1pb8o6yE8f

# Process a YouTube video
course2md https://youtu.be/dQw4w9WgXcQ

# Process a local lecture or meeting recording
course2md ./lecture.mp4
```

> **First Run Note**:
> - **macOS (Apple Silicon, `coreml`)**: On first interactive run, `course2md` asks which ASR model to download: **Qwen3-ASR 0.6B** (recommended — best for Chinese/English, smallest, most efficient) or **Whisper large-v3-turbo** (better for multilingual). Weights are cached under `~/Library/Caches/qwen3-speech/`.
> - **Linux / Windows (`gpu` / `cpu`)**: Downloads the GGUF ASR model (~2.4 GB) to `~/.cache/course2md/models/`.
> - **Cloud STT (`api`)**: No local model download needed; transcribes via an OpenAI-compatible endpoint (e.g. OpenRouter).
> - **Slow / blocked network?** Set a HuggingFace mirror first: `export HF_ENDPOINT=https://hf-mirror.com` — or skip local models entirely with `course2md  --provider api`.
> - Tip: pre-download the offline model any time with `course2md models download`.

---

## Installation

`course2md` relies on the following multimedia tools:
- `ffmpeg` & `ffprobe` (Audio/video extraction and slide sampling)
- `yt-dlp` (Online video parsing and downloading; only needed for online URLs)
- `llama-server` (Provided by `llama.cpp`; only needed for local `gpu` / `cpu` backends, not required for macOS `coreml` or cloud `api` mode)

---

### macOS

> Requires **macOS 15 (Sequoia) or later** on Apple Silicon (the CoreML backend depends on the ANE runtime shipped with macOS 15+; Intel Macs fall back to the `gpu`/`cpu` backends).

**Homebrew (recommended)** — dependencies, the Developer-ID-signed binary and the CoreML `mlx.metallib` are all handled for you:

```bash
brew install mizorewww/tap/course2md
```


Alternative: install.sh

```bash
brew install ffmpeg yt-dlp   # llama.cpp only needed for the gpu/cpu fallback backend
curl -fsSL https://raw.githubusercontent.com/mizorewww/course2md/main/install.sh | bash
```


---

### Arch Linux / CachyOS

Available on the **AUR** with automated dependency resolution:

```bash
# Install via AUR helper (first-class citizen)
yay -S course2md-bin
# or using paru:
# paru -S course2md-bin
```


Manual installation

```bash
# 1. Install dependencies
sudo pacman -S ffmpeg yt-dlp llama-cpp

# 2. Install course2md
curl -fsSL https://raw.githubusercontent.com/mizorewww/course2md/main/install.sh | bash
```


---

### Debian / Ubuntu

```bash
# 1. Install base dependencies and build tools
sudo apt update
sudo apt install -y ffmpeg yt-dlp git cmake build-essential

# 2. Build and install llama-server
git clone https://github.com/ggml-org/llama.cpp.git
cmake -S llama.cpp -B llama.cpp/build -DLLAMA_CURL=OFF
cmake --build llama.cpp/build --config Release -j
sudo install -m755 llama.cpp/build/bin/llama-server /usr/local/bin/llama-server

# 3. Install course2md
curl -fsSL https://raw.githubusercontent.com/mizorewww/course2md/main/install.sh | bash
```

---

### Windows

Install dependencies via `winget` in **PowerShell**:

```powershell
winget install --id Gyan.FFmpeg -e
winget install --id yt-dlp.yt-dlp -e
winget install --id ggml.llamacpp -e
```

> Alternatively, install via Scoop: `scoop install ffmpeg yt-dlp` (for local `gpu`/`cpu` ASR you additionally need `llama-server.exe` from llama.cpp releases on your `PATH`).

**Install course2md**:
1. Download `course2md-windows-x86_64.exe` from Releases.
2. Rename to `course2md.exe` and place it in a directory listed in your `PATH`.

---

### Building from Source

Requires the stable Rust toolchain:

```bash
git clone https://github.com/mizorewww/course2md.git
cd course2md

# Standard install
cargo install --path .

# Or build release binary only
cargo build --release
```

- **macOS Apple Silicon Note**: Building native CoreML support requires Xcode 16+ (Swift 6 toolchain). `build.rs` compiles the Swift package and copies `mlx.metallib` to the target directory. If you do not need native CoreML support, skip it via: `COURSE2MD_NO_APPLE=1 cargo build --release`.
- **Other Platforms**: Linux, Windows, and x86_64 macOS builds automatically skip Apple-native components.

---

## ASR Backends

`course2md` provides multiple speech recognition backends via `--provider ` or configuration:

| Backend (`--provider`) | Target & Default Policy | Architecture & Models | External Dependencies | Model Download & Cache Path | Highlights |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`coreml`** | **macOS Apple Silicon**(Default for prebuilt arm64) | **Silero VAD v6.2.1 CoreML** (ANE)+ **Qwen3-ASR 0.6B** (default) or **Whisper large-v3-turbo** (speech-swift) | **Zero external dependencies**(requires co-located `mlx.metallib`) | ~1–2 GB`~/Library/Caches/qwen3-speech/`*(supports `HF_ENDPOINT` mirror)* | Leverages Apple Neural Engine (ANE) and Metal; lowest power consumption (~375 J per 3 min); lightweight memory footprint; no daemon process |
| **`gpu`** | **Linux / Windows / Intel Mac**(Default on non-Apple-Silicon) | **ffmpeg silencedetect**+ **Qwen3-ASR 1.7B GGUF Q8** | Requires `llama-server`(from `llama.cpp`) | ~2.4 GB`~/.cache/course2md/models/` | High-precision 1.7B Q8 quantized model; fastest throughput via Metal / CUDA / Vulkan |
| **`cpu`** | **Universal Fallback** | Same as `gpu`, with `-ngl 0` | Requires `llama-server` | ~2.4 GB`~/.cache/course2md/models/` | Pure CPU execution; maximum hardware compatibility |
| **`api`** | **Cloud STT (Any platform)** | **ffmpeg silencedetect**+ OpenAI-compatible `/audio/transcriptions` (e.g. OpenRouter) | **Zero local model dependencies**(requires network & API key) | **None** (Cloud-hosted) | Zero disk consumption, offloads computation to cloud. *Privacy note: audio chunks are uploaded.* |
| **`npu`** | **Linux / Windows**(Intel Core Ultra / AI Boost) | **ffmpeg silencedetect**+ **OpenVINO Whisper Large-v3 Turbo** (default) / Base / Tiny | Requires `uv` or `python` with `openvino-genai` & NPU driver | Downloaded on demand via HuggingFace | **>6x faster than CPU**, low power, low memory (550MB vs 3.5GB CPU), high accuracy on Intel NPU |

> **CoreML Model Selection**: When using `--provider coreml`, switch models via `--asr-model qwen3` (default) or `--asr-model whisper`. On first run in an interactive terminal, `course2md` will ask and remember your preference in `~/.config/course2md/asr_model`.
>
> **Automatic Fallback**: On macOS, if the `coreml` backend fails during initialization or runtime, `course2md` automatically logs a warning and falls back to the `gpu` / `llama-server` pipeline to ensure task completion.

---

## Configuration

To avoid passing repetitive command-line arguments, `course2md` provides a global TOML configuration file.

### Configuration Path
- **macOS / Linux**: `~/.config/course2md/config.toml` (follows `$XDG_CONFIG_HOME`)
- **Windows**: `%APPDATA%\course2md\config.toml`

### Priority Hierarchy
**CLI Flags > Configuration File (config.toml) > Built-in Defaults**

### Configuration Management Commands

```bash
# 1. Generate an annotated configuration template (use --force to overwrite existing)
course2md config init

# 2. Display the configuration path and effective default settings
course2md config show
```

### Configuration File Structure

```toml
# ~/.config/course2md/config.toml

[defaults]
# Output root directory (structured as ////)
out = "out"

# Frame similarity SSIM threshold (0.0 to 1.0; lower value = more slides captured)
similarity = 0.85

# Frame sampling check interval in seconds
sample_interval = 1.0

# Cooldown time (seconds) after a new slide is captured before capturing again
cooldown = 10.0

# Region of Interest (ROI), e.g. "40%,0%-100%,100%"; empty compares full frame
# roi = "40%,0%-100%,100%"

# ASR transcription thread count (for local llama.cpp)
threads = 4

# Inference backend: coreml (macOS Apple Silicon) | gpu | cpu | api
# provider = "coreml"

# CoreML model variant: qwen3 (default) | whisper (large-v3-turbo)
# asr_model = "qwen3"

# Maximum speech segment duration in seconds before splitting
max_speech = 20.0

# Output document formats: md, html, json
formats = ["md", "html"]

# llama.cpp GGUF model directory (leave commented for default cache)
# model_dir = "~/.cache/course2md/models"

# Keep downloaded media.mp4 video file after processing
keep_video = false

[asr_api]
# Cloud STT settings (used when --provider api)
# OpenAI-compatible /audio/transcriptions endpoint
base_url = "https://openrouter.ai/api/v1"
api_key = "sk-or-v1-xxxxxxxx"
model = "qwen/qwen3-asr-flash-2026-02-10"
# Other popular models on OpenRouter: openai/whisper-large-v3-turbo, qwen/qwen3-asr-1.7b

[llm]
# Enable LLM subtitle polishing by default (default: false; run `course2md llm setup` to configure)
enabled = false

# OpenAI-compatible API endpoint (auto-prefixes https:// if omitted)
base_url = "https://api.deepseek.com/v1"

# API Key (file permissions automatically restricted to 0600 on Unix)
api_key = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Model identifier
model = "deepseek-chat"

# Custom prompt (leave empty to use high-quality built-in proofreading prompt)
prompt = ""

# Permanently suppress the post-run LLM suggestion hint (default: false)
disable_hint = false
```

---

## Cloud STT via OpenRouter (`--provider api`)

`course2md` supports transcribing via any OpenAI-compatible `/audio/transcriptions` endpoint without requiring local GPU or ASR model downloads:

- **Default Provider**: OpenRouter with `qwen/qwen3-asr-flash-2026-02-10` (~$0.000035/second of audio).
- **Other Models**: Supports `openai/whisper-large-v3-turbo`, `qwen/qwen3-asr-1.7b`, etc.
- **API Key Resolution**: Reads `--asr-api-key`, config file `[asr_api].api_key`, or the `OPENROUTER_API_KEY` environment variable.

```bash
# Transcribe using OpenRouter with an environment variable
export OPENROUTER_API_KEY=sk-or-v1-xxxx
course2md https://... --provider api

# Override model or endpoint via CLI
course2md https://... --provider api --asr-api-model openai/whisper-large-v3-turbo
```

> **Privacy Note**: With `--provider api`, speech audio chunks are uploaded to the specified cloud endpoint for transcription. Video frames, OCR/SSIM, and VAD segmentation remain strictly local.

---

## LLM Subtitle Polishing (Optional)

`course2md` can automatically invoke a Large Language Model (LLM) after ASR transcription to proofread and refine the generated transcript.

- **Polishing Scope**: Corrects verbal tics and filler words (e.g., "um", "uh", "you know"), stuttering/repetitions, homophone typos, and technical terminology spelling. **Preserves original meaning, does not summarize, add, or translate content**.
- **Compatible Endpoints**: Any OpenAI-compatible `/chat/completions` API (e.g., DeepSeek, GLM, OpenAI, Ollama, vLLM).
- **Fault Tolerance**: Batches requests in 20-segment chunks (`temperature=0`). If a batch fails or returns invalid JSON, it automatically falls back to raw ASR text and logs a warning without halting the conversion.

### Management Commands

```bash
# Interactive setup and enablement (press Enter to keep existing values; tests connectivity upon save)
course2md llm setup

# Non-interactive configuration via flags
course2md llm setup --base-url https://api.deepseek.com/v1 --api-key sk-xxxx --model deepseek-chat

# View current LLM status (API Key masked)
course2md llm status

# Disable LLM polishing while preserving configured credentials
course2md llm disable
```

### CLI Overrides at Runtime

```bash
# Force enable / disable LLM polishing for a single run
course2md https://... --llm
course2md https://... --no-llm

# Temporarily override endpoint, key, or model
course2md https://... --llm --llm-base-url https://api.deepseek.com/v1 --llm-api-key sk-xxxx --llm-model deepseek-chat

# Suppress post-run LLM suggestion hint for a single run
course2md https://... --no-llm-hint
```

---

## Language & Internationalization

`course2md` automatically adapts its interface to your system environment:

- **Default Language**: English.
- **Automatic Localization**: If your system locale (`LC_ALL`, `LC_MESSAGES`, or `LANG`) starts with `zh`, help messages, runtime logs, completion summaries, and interactive prompts automatically switch to Chinese.

---

## Output Structure

Generated assets are organized into `out////`:

```text
out////
├── course.md          # Illustrated Markdown document (default)
├── course.html        # Self-contained styled HTML document (default)
├── structured.json    # Full structured data (when formats includes json)
├── frames/            # Extracted slide keyframe images
│   ├── slide_0001.jpg
│   └── ...
├── audio.wav          # Extracted audio (16kHz mono WAV)
├── timeline.jsonl     # Timestamp-aligned event stream
├── meta.json          # Video title, author, duration metadata
└── media.mp4          # Downloaded video (local input is read in-place; cleaned up by default)
```

### Completion Summary Example

Upon completion, `course2md` outputs a comprehensive summary detailing paths, metrics, elapsed time, and resident memory usage (RSS):

```text
──────── course2md done ────────
Title: Introduction to Computer Science - Lecture 01
Output dir: out/bilibili/Introduction to Computer Science - Lecture 01/BV1pb8o6yE8f

Documents:
  out/bilibili/Introduction to Computer Science - Lecture 01/BV1pb8o6yE8f/course.md
  out/bilibili/Introduction to Computer Science - Lecture 01/BV1pb8o6yE8f/course.html
Screenshots: out/bilibili/Introduction to Computer Science - Lecture 01/BV1pb8o6yE8f/frames/ (24 images)
Audio: out/bilibili/Introduction to Computer Science - Lecture 01/BV1pb8o6yE8f/audio.wav
Video: deleted (--keep-video)
Timeline: out/bilibili/Introduction to Computer Science - Lecture 01/BV1pb8o6yE8f/timeline.jsonl

Stats: 24 screenshots / 142 speech segments / 8930 chars
Elapsed: 47s
Peak memory: 1406 MB (course2md) + largest child 59 MB (llama-server/ffmpeg)
Model dir: /Users/username/.cache/course2md/models
──────────────────────────────
```

---

## CLI Options

| Option | Description | Default |
| :--- | :--- | :--- |
| `-o, --out ` | Output root directory | `out` |
| `--provider ` | ASR backend: `coreml` (macOS arm64), `gpu` (non-Mac), `cpu`, or `api` (cloud STT) | Platform default |
| `--asr-model ` | CoreML ASR model variant (`qwen3` 0.6B or `whisper` large-v3-turbo) | `qwen3` |
| `--asr-api-base-url ` | Cloud STT base URL (OpenAI-compatible) | `https://openrouter.ai/api/v1` |
| `--asr-api-key ` | Cloud STT API Key (or set `OPENROUTER_API_KEY` env) | Config / Env |
| `--asr-api-model ` | Cloud STT model slug (e.g. `qwen/qwen3-asr-flash-2026-02-10`) | `qwen/qwen3-asr-flash-2026-02-10` |
| `--similarity <0~1>` | SSIM similarity threshold; **lower = more slides captured** | `0.85` |
| `--sample-interval ` | Frame sampling check interval in seconds | `1.0` |
| `--cooldown ` | Minimum seconds between two consecutive slide captures | `10.0` |
| `--roi ` | Region of interest for slide comparison (e.g. `40%,0%-100%,100%`) | Full frame |
| `--formats ` | Comma-separated output formats: `md,html,json` | `md,html` |
| `--threads ` | Number of ASR worker threads (for local `gpu`/`cpu`) | `4` |
| `--max-speech ` | Maximum speech segment duration in seconds | `20.0` |
| `--keep-video` | Preserve downloaded/extracted `media.mp4` | Disabled |
| `--no-download` | Skip downloading (when `media.mp4` exists in directory) | Disabled |
| `--llm` | Force enable LLM subtitle polishing for this run | Disabled |
| `--no-llm` | Force disable LLM subtitle polishing for this run | Disabled |
| `--no-llm-hint` | Suppress post-run LLM suggestion hint | Disabled |
| `-v, --verbose` | Increase logging verbosity (use `-vv` for debug) | `info` |
| `-q, --quiet` | Quiet mode (errors only) | Disabled |

Display full help:

```bash
course2md --help
```

---

## Benchmarks & Power Metrics

Measured on Apple Silicon (arm64) running a **3-minute** 1080p recorded lecture clip with `powermetrics` hardware sampling (idle baseline ≈ 1.9 W):

| Backend (`--provider`) | Wall Time | Avg Power (CPU / GPU / ANE) | Peak Memory | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **`coreml` + qwen3** *(macOS default)* | 47 s | 6.7 W / 0.2 W / **3.5 W** | 1.41 GB in-proc | **Lowest power** — Neural Engine does the heavy lifting; best on battery; zero external dependencies |
| **`coreml` + whisper-turbo** | 87 s | 15.3 W / 0.3 W / 0.4 W | 1.51 GB in-proc | Whisper large-v3-turbo on CoreML; decoder mostly on CPU for short segments |
| **`gpu` (llama.cpp Metal)** | **13 s** | 4.7 W / **16.0 W** / — | 26 MB + 3.3 GB child | **Fastest**; GPU bursts; needs `llama-server` (Qwen3-ASR 1.7B Q8) |
| **`cpu` (llama.cpp)** | 26 s | **21.2 W** / 0.6 W / — | 26 MB + 4.8 GB child | Universal fallback; high CPU power |
| **`api` (cloud STT)** | ~10 s | < 1 W | negligible | Audio uploaded to provider; speed depends on network |
| **`npu` (Intel Core Ultra)** | **16 s** | NPU hardware acceleration | 18 MB + 557 MB child | **>6x faster than CPU** on Intel Core Ultra laptops; Whisper Large-v3 Turbo |

👉 See the comprehensive macOS Benchmark Report for full methodology, energy breakdowns, and reproduction scripts.

---

## License

This project is licensed under the MIT License.
