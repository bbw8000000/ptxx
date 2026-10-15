---
title: "arcships/light-ocr"
owner: "arcships"
name: "light-ocr"
fullName: "arcships/light-ocr"
description: "Fast, offline OCR for Node.js & C++. PP-OCRv6 with Core ML / WebGPU hardware acceleration — recognize text in images with confidence scores & coordinates. npm: @arcships/light-ocr"
sourceUrl: "https://github.com/arcships/light-ocr"
stars: 508
forks: 42
language: "C++"
topics: ["apple-silicon", "computer-vision", "coreml", "cpp17", "d3d12", "image-processing", "machine-learning", "napi"]
license: "Apache-2.0"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-24T15:37:52Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# light-ocr

*图片：Core CI*
*图片：License*
[*图片：C++17*](https://isocpp.org/)
*图片：Node--API v8*
[*图片：npm*](https://www.npmjs.com/package/@arcships/light-ocr)


English | 简体中文

*图片：light-ocr pixel-art banner*

**Fast, offline OCR for Node.js and C++.**

Recognize text in PDF, JPEG, PNG, or raw image data directly on your machine.
`light-ocr` returns lines in reading order with confidence scores and
quadrilateral coordinates. The Node.js package includes PP-OCRv6 Small,
PDFium, a Chinese fallback font, and prebuilt components for macOS, Linux, and
Windows—without postinstall or first-run downloads.

| | |
| --- | --- |
| **Best for** | local OCR in Node.js apps, CLIs, desktop software, and native C++ integrations |
| **Inputs** | JPEG, PNG, PDF, encoded bytes, or decoded pixel buffers |
| **Outputs** | text, confidence, quadrilateral boxes, page metadata, and timing |
| **Distribution** | one npm install; CommonJS, ESM, TypeScript, and eight prebuilt platforms |

## Quick start

Node.js 22 or newer is supported; the 22 and 24 LTS lines are Tier 1
(fully tested), and the stable Node-API ABI lets newer Node versions load the
same prebuilt binaries without a library release.

```bash
npm install @arcships/light-ocr
```

```ts
import { createEngine } from "@arcships/light-ocr";
import { readFile } from "node:fs/promises";

const engine = await createEngine();

try {
  const result = await engine.recognizeEncoded(
    await readFile("image.jpg"),
  );

  for (const line of result.lines) {
    console.log(line.text, line.confidence, line.box);
  }
} finally {
  await engine.close();
}
```

`createEngine()` automatically chooses the right execution mode for the
current platform. If your application already decodes images,
`recognize()` also
accepts `GRAY8`, `RGB8`, `BGR8`, and `RGBA8` pixel data.

PDF pages use the same package:

```ts
import { recognizeDocument } from "@arcships/light-ocr";

for await (const page of recognizeDocument("report.pdf", { dpi: 200 })) {
  console.log(page.index, page.lines.map((line) => line.text));
}
```

CommonJS uses the same exports through `require("@arcships/light-ocr")`.

## CLI

The `light-ocr` command is available after install — no extra setup:

```bash
# Recognize text + coordinates
light-ocr image.png --format json

# Just text
light-ocr image.png --format text

# PDF pages, using the renderer already included by npm
light-ocr report.pdf --pages 1-10 --format text

# Detect text regions only (no recognition)
light-ocr detect image.png

# Region of interest
light-ocr recognize image.png --region 100,80,640,320 --format json

# Engine info
light-ocr info --version

# System diagnostics (hardware and providers)
light-ocr doctor --json
```

Image commands are `recognize` (default), `detect` (boxes only), `info`
(version diagnostics), and `doctor` (system diagnostics). A `.pdf` path routes
directly to document OCR; `document` handles explicit multi-source jobs. Output
uses a versioned `schemaVersion: 1` contract. EXIF orientation is corrected
automatically. See the CLI design and
npm package README for the complete
install-and-use reference.

## PDF and multi-page documents

PDF and multi-page OCR are built into `@arcships/light-ocr`. The matching
PDFium binary and checksum-pinned Noto Sans SC fallback font are carried by
the same platform npm package as the OCR runtime. This keeps PDFs that reference
common non-embedded Chinese fonts renderable before OCR, with no postinstall
script, runtime download, compiler, system-font requirement, or separate
package to install.

```bash
# Single PDF with default 150 DPI
light-ocr report.pdf

# Page range with streaming JSONL output
light-ocr report.pdf --pages 1-10 --format jsonl

# Multiple images as one document
light-ocr document scan1.png scan2.png scan3.png --format text
```

Programmatic API:

```ts
import { recognizeDocument } from "@arcships/light-ocr";

// Stream pages from a PDF
for await (const page of recognizeDocument("report.pdf", { dpi: 200 })) {
  console.log(page.index, page.lines.length, page.source.kind);
}

// Multiple images
for await (const page of recognizeDocument([buf1, buf2, buf3])) {
  console.log(page.index, page.lines);
}
```

## What you get

- **Local processing.** Images, PDFs, and OCR results stay on your machine.
- **One package to install.** The model, OCR runtime, PDF renderer, and Chinese fallback font are included through the npm package's platform dependency.
- **No secondary downloads.** Installation and runtime need no postinstall fetch, compiler, model download, PDF engine download, or font download.
- **Useful output.** Every line includes recognized text, confidence, and its position in the original image.
- **Hardware acceleration by default.** Auto tries Core ML first on macOS 15+ Apple Silicon, and WebGPU first on the Linux and Windows builds below.
- **Application-friendly execution.** Recognition runs off the JavaScript main thread and supports queues, cancellation, and explicit cleanup.
- **Small text in large images.** An optional `tiled` mode preserves small and dense text in high-resolution images.

> **macOS re-signing.** Downstream macOS packagers may re-sign the native binaries with their own Developer ID (or ad-hoc) identity, for example when notarizing a distributed app. On macOS the loader accepts a re-signed Mach-O when its code signature verifies and its signing identity matches the host application (same TeamIdentifier, or both ad-hoc signed); other platforms and unsigned mutations keep the strict size + SHA-256 gate.

> ⭐ **Like light-ocr?** Give it a star — it helps others discover the project and keeps us motivated!

## Platform acceleration

The npm package provides the following eight builds. The default `createEngine()` call uses Auto mode:

| Platform | Auto mode |
| --- | --- |
| macOS on Apple Silicon | Core ML on macOS 15+, then CPU |
| macOS on Intel | CPU |
| Linux x64 with glibc | WebGPU through Vulkan, then CPU |
| Linux arm64 with glibc | CPU |
| Linux x64 with musl (Alpine) | CPU |
| Linux arm64 with musl (Alpine) | CPU |
| Windows x64 | WebGPU through D3D12, then CPU |
| Windows arm64 | CPU |

Applications that need explicit control can choose `auto`, `cpu`, `apple`, or
`webgpu` through the
`execution` option.

## Model tiers

Small remains the stable default. Tiny and Medium are opt-in preview packages
under the `next` tag. All three expose the same API, types, result schema, and
error model, while each install contains only its selected model.

| Tier | Package / command | Model payload | Status |
| --- | --- | ---: | --- |
| Small | `@arcships/light-ocr` / `light-ocr` | ~30 MB | stable default |
| Tiny | `@arcships/light-ocr-tiny@next` / `light-ocr-tiny` | ~6.3 MB | preview; 49 languages, no Japanese |
| Medium | `@arcships/light-ocr-medium@next` / `light-ocr-medium` | ~139 MB | preview; quality-first |

Tiny and Medium stay on `next`; they do not change what
`npm install @arcships/light-ocr` installs.

## Measured performance

Version 0.3.0 was measured on three real devices:

*图片：light-ocr 0.3.0 same-device speed and OCR process CPU-time reductions*

| Device | Acceleration | End-to-end speedup | OCR process CPU time |
| --- | --- | ---: | ---: |
| Apple M4 Max | Core ML | **2.30×** on `HELLO 123`; **2.85×** on a dense form | **95.91%–97.67% less** |
| NVIDIA RTX 5060 Ti on Linux | WebGPU / Vulkan | **5.70×** overall across 14 test images | **69.97% less** |
| AMD Radeon 780M on Windows | WebGPU / D3D12 | **2.44×** overall across 14 test images | **46.33% less** |

These are same-machine comparisons with the CPU path, and results vary by workload and hardware. For the 14-image results, overall speedup is the sum of the per-image CPU median times divided by the sum of the WebGPU median times. The CPU column measures cumulative OCR process CPU time over the same workloads, rather than an instantaneous system-utilization sample; lower CPU time leaves more capacity for the rest of the application while OCR is active. The Apple run passed its locked CPU-parity thresholds; both WebGPU runs were byte-identical to CPU FP32 on all 14 images. See the 0.3.0 release report for complete measurements and methodology.

## C++

C++ projects build the static library from source and link the `light_ocr::core` CMake target. The API accepts decoded `GRAY8`, `RGB8`, `BGR8`, or `RGBA8` pixels; start with the C++ API guide and build instructions.

## Agent Skill

An Agent Skill is included for AI agents
that can call local commands. It provides scenario-driven workflows, command
selection guidance, and exit code reference:

- When to use OCR vs. a multimodal model
- Detect-then-recognize workflows for large images
- ROI field extraction for receipts and forms
- Verifying multimodal output against deterministic OCR

## Documentation

- npm package README
- CLI reference
- Node.js image engine and CLI details
- Agent Skill
- C++ API
- Apple Silicon acceleration
- Linux WebGPU acceleration
- Windows WebGPU acceleration
- Model bundle
- Build and release
- Roadmap
- Changelog
- npm 0.5.8 release record — English
- npm 0.5.8 发布记录 — 中文
- npm 0.5.7 release record — English
- npm 0.5.7 发布记录 — 中文
- npm 0.5.6 release record — English
- npm 0.5.6 发布记录 — 中文
- npm 0.3.0 release report

## Community and license

Issues and pull requests are welcome — see CONTRIBUTING.md for guidelines. All participants are expected to follow our Code of Conduct.

`light-ocr` is available under the Apache License 2.0.
