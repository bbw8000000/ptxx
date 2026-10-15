---
title: "steelbrain/metal2vulkan"
owner: "steelbrain"
name: "metal2vulkan"
fullName: "steelbrain/metal2vulkan"
description: "Translate Metal AIR / LLVM IR to Vulkan SPIR-V with a native Rust emitter"
sourceUrl: "https://github.com/steelbrain/metal2vulkan"
stars: 144
forks: 4
language: "Rust"
topics: []
license: "LGPL-3.0"
defaultBranch: "master"
snapshotDate: "2026-07-25"
pushedAt: "2026-07-23T23:26:05Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# metal2vulkan

*图片：License: LGPL-3.0-or-later*

> **Alpha.** This project is early and under active development. The public API, CLI flags,
> reflection layout details, and SPIR-V output may change without a stable semver guarantee
> while the crate is in the `0.x` series. Treat it as research-quality: useful for
> experimentation and integration pilots, not a frozen interface.

Translate **Metal AIR** (LLVM bitcode / sanitized `.ll`) to **Vulkan SPIR-V** using a native Rust
emitter. Production translation does not invoke LLVM `llc`.

## Features

- Native AIR/LLVM-IR → `OpCapability Shader` / Logical GLSL450 SPIR-V
- Stage interface lowering for vertex, fragment, compute (kernel), and passthrough
- Library API plus a CLI compatible with simple `in → out.spv` harnesses
- Optional `serde` feature for reflection metadata JSON
- Optional workspace package for local Metal oracle / Vulkan executor experiments

## Install

```sh
# CLI
cargo install metal2vulkan

# Library (Cargo.toml)
metal2vulkan = "0.1"
```

## CLI

```sh
metal2vulkan   --stage vertex|fragment|passthrough|kernel
# optional interface metadata JSON (requires --features serde)
metal2vulkan in.ll out.spv --stage kernel --emit-meta out.json
```

- Success: prints a line containing `PASS`, writes SPIR-V, exits `0`
- Failure: prints `FALLBACK`, exits non-zero

On failure the CLI writes a repro bundle under `$TMPDIR/metal2vulkan-repros` (override with
`METAL2VULKAN_REPRO_DIR`).

### Example

```sh
cargo run --example translate_native -- path/to/shader.ll kernel out.spv
```

## Library

```rust
use metal2vulkan::passes::Stage;
use std::path::Path;

fn translate_ll(sanitized_ll: &str) -> Result, String> {
    let tmp = std::env::temp_dir().join("m2v-scratch");
    std::fs::create_dir_all(&tmp).ok();
    metal2vulkan::translate_sanitized_native(sanitized_ll, Stage::Kernel, Path::new(&tmp))
}
```

See crate docs (`cargo doc --open`), `docs/ARCHITECTURE.md` for the
pipeline, and `docs/REFLECTION.md` for how consumers read binding metadata
after a convert. Repository layout and the developer loop are in
CONTRIBUTING.md. How to stay confident while refactoring (harvest, hash ledgers,
A/B) is in `docs/VALIDATION.md`.

## Coverage policy

Grammar and lowering behavior is locked with **synthetic** Rust tests. This repository does not
ship third-party captured shaders. Prefer reduced `.ll` fixtures that name structural properties.
Optional private system-metallib harvest and hash-only drift pins are documented in
`docs/VALIDATION.md`.

`spirv-val` coverage is not the same as correct end-to-end pixels.

## License

Licensed under the GNU Lesser General Public License v3.0 or later
(`LGPL-3.0-or-later`).

Metal is a trademark of Apple Inc. metal2vulkan is an independent project and is not affiliated
with, sponsored by, or endorsed by Apple Inc.
