---
title: "localai-org/kimodo.cpp"
owner: "localai-org"
name: "kimodo.cpp"
fullName: "localai-org/kimodo.cpp"
description: "NVIDIA Kimodo ported to C++/GGML"
sourceUrl: "https://github.com/localai-org/kimodo.cpp"
stars: 285
forks: 22
language: "C++"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-08-24"
pushedAt: "2026-08-22T21:35:19Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# kimodo.cpp

GGML/C++ implementation of NVIDIA's Kimodo text-to-motion model.

## Status

`Kimodo-SMPLX-RP-v1` accepts either a UTF-8 prompt or a precomputed LLM2Vec
embedding and generates unconstrained SMPL-X22 local rotations and root
translations on CPU or Vulkan. The text encoder uses eight-layer Vulkan chunks
by default; set `KIMODO_TEXT_LAYER_CHUNK=1..32` to tune VRAM use.

Included: checked GGUF loading, safetensors conversion, DDIM sampling, C/C++
APIs, CPU/Vulkan parity tests, and a local text-to-motion demo. Constraints,
SOMA, G1, GLB export, and quantised models are not implemented yet.

## Build and test

GGML is a pinned Git submodule:

```sh
git submodule update --init --recursive
nix develop path:. --command cmake --preset debug
nix develop path:. --command cmake --build --preset debug
nix develop path:. --command ctest --preset debug
```

The standard test suite requires the local motion GGUF, text bundle, and
fixtures. It never downloads weights by itself. `release`, `asan-ubsan`, and
`fuzz` presets are also available.

For sanitizer work:

```sh
nix develop path:. --command cmake --preset asan-ubsan
nix develop path:. --command cmake --build --preset asan-ubsan
nix develop path:. --command env \
  LD_LIBRARY_PATH="$PWD/build/asan-ubsan/ggml/src:$PWD/build/asan-ubsan/ggml/src/ggml-vulkan:$LD_LIBRARY_PATH" \
  ASAN_OPTIONS=detect_leaks=0:abort_on_error=1 UBSAN_OPTIONS=print_stacktrace=1 \
  ctest --preset asan-ubsan --output-on-failure
```

Leak detection is disabled because Vulkan loader/driver allocations are global
to the process. The GGUF parser fuzzer requires Clang.

## API

`include/kimodo/kimodo_capi.h` is the C API. Model loading checks the motion
GGUF and text bundle before inference. Use `kimodo_generate_embedding` for
4096 F32 values or `kimodo_generate` for text. Both return SMPL-X22 root
translations and local XYZW rotations.

## Demo

After building the debug preset and converting the text bundle:

```sh
go run ./demo -addr 0.0.0.0:8094
```

Open `http://localhost:8094`. The left sidebar contains the prompt and a
persistent history; choosing a previous animation restores its prompt for a
new generation.

## Licensed weights

The SMPL-X checkpoint and Llama base model are gated. After accepting their
Hugging Face licences and authenticating, download the exact revisions and
hash manifests with:

```sh
nix develop path:. --command hf auth login
nix develop path:. --command scripts/download_weights.sh \
  --output "$PWD/models" --with-text
```

Convert the local LLM2Vec model to the native component bundle with:

```sh
nix develop path:. --command scripts/convert_llm2vec_bundle.sh \
  "$PWD/models/llama3-8b-instruct-base" "$PWD/generated/llm2vec-text-bundle"
```
