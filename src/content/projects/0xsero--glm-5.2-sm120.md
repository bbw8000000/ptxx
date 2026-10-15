---
title: "0xSero/glm-5.2-sm120"
owner: "0xSero"
name: "glm-5.2-sm120"
fullName: "0xSero/glm-5.2-sm120"
description: "GLM-5.2-NVFP4-REAP-469B serving on SM120 (4× RTX PRO 6000 Blackwell) — one-command vLLM launch recipe, 250K context, DeepSeek Sparse Attention + MTP speculative decode"
sourceUrl: "https://github.com/0xSero/glm-5.2-sm120"
stars: 154
forks: 11
language: "Shell"
topics: ["blackwell", "glm", "llm-inference", "moe", "nvfp4", "reap", "rtx-pro-6000", "sm120"]
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-19T01:51:08Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# GLM-5.2-NVFP4-REAP-469B — vLLM serving (4× RTX PRO 6000 Blackwell)

A turnkey Docker setup to serve **[0xSero/GLM-5.2-NVFP4-REAP-469B](https://huggingface.co/0xSero/GLM-5.2-NVFP4-REAP-469B)**
(REAP-pruned, NVFP4, DeepSeek-Sparse-Attention) on **4× NVIDIA RTX PRO 6000 Blackwell
(SM120, 96 GB each)** with the `voipmonitor` b12x vLLM image.

> **Model:** [huggingface.co/0xSero/GLM-5.2-NVFP4-REAP-469B](https://huggingface.co/0xSero/GLM-5.2-NVFP4-REAP-469B) · ~313 GB on disk (NVFP4) · REAP-pruned 469B MoE · DeepSeek Sparse Attention + MTP.

Validated config: **DCP=4 · 250k context · ~3× concurrency · ~60 tok/s decode · fp8
KV cache · MTP speculative decode · tool-calling · reasoning on by default (toggle off)**.

## Hardware target

| | |
|---|---|
| GPUs | 4× RTX PRO 6000 Blackwell (SM120), 96 GB each, **no NVLink** (PCIe) |
| Model on disk | ~313 GB (NVFP4), ~78.6 GB/GPU resident |
| Interconnect | PCIe — requires `NCCL_P2P_DISABLE=1` (see below) |

## Prerequisites

- Docker + the **NVIDIA Container Toolkit**.
- Access to the b12x image (`voipmonitor/vllm:black-benediction-…`). It is the only
  image that bundles `GlmMoeDsaForCausalLM` + `Glm4MoeMTPModel` + the SM120 sparse-MLA
  kernel (`B12X_MLA_SPARSE`) + the ModelOpt NVFP4 MoE loader.
- The model weights on a local path (default `/mnt/llm_models/GLM-5.2-NVFP4-REAP-469B`).

## Quick start — one command

```bash
# 1. Download the weights (~313 GB NVFP4) — needs the hf CLI: pip install -U huggingface_hub
hf download 0xSero/GLM-5.2-NVFP4-REAP-469B --local-dir /mnt/llm_models/GLM-5.2-NVFP4-REAP-469B

# 2. (optional) point at a different weights path / port
cp .env.example .env        # defaults already target /mnt/llm_models/... on port 8000

# 3. Launch. This starts the server, waits for it, and smoke-tests it.
./launch.sh
```

`launch.sh` blocks until the server is actually answering, then prints:

```
  ✅ READY — GLM-5.2 is serving and answered: READY
  Endpoint : http://localhost:8000/v1   (model: GLM-5.2-NVFP4-REAP-469B)
  Try it   : ./chat.sh "write a haiku about GPUs"
```

(First boot compiles kernels + captures CUDA graphs, ~6 min — `launch.sh` waits it
out and tails the log if anything fails.) Then talk to it:

```bash
./chat.sh "explain quicksort in 3 bullet points"
# or hit the OpenAI-compatible API directly:
curl -s http://localhost:8000/v1/chat/completions -H 'Content-Type: application/json' \
  -d '{"model":"GLM-5.2-NVFP4-REAP-469B","messages":[{"role":"user","content":"hello"}]}'
```

`docker compose up -d` works too (same config; thinking off).

## Reasoning (thinking) — on by default

GLM-5.2 is a reasoning model, so **thinking is ON by default.** The chain-of-thought
streams into `message.reasoning` (`delta.reasoning` when streaming) and the final
answer into `message.content`.

```bash
curl -s http://localhost:8000/v1/chat/completions -H 'Content-Type: application/json' -d '{
  "model": "glm-5.2",
  "messages": [{"role":"user","content":"Is 91 prime? Think it through."}],
  "max_tokens": 2000
}' | python3 -c 'import sys,json; m=json.load(sys.stdin)["choices"][0]["message"]; print("reasoning:", (m.get("reasoning") or "")[:120], "...\ncontent  :", m.get("content"))'
```

> ⚠️ **Give it room.** Thinking spends tokens *before* the answer, so a small
> `max_tokens` gets consumed mid-thought and `content` comes back empty
> (`finish_reason: "length"`) — the reasoning is still in `message.reasoning`.
> Use `max_tokens` ≥ 2000 (or omit it) and you get both.

Don't want the thinking (snappy direct answers, no empty-content risk for tiny
`max_tokens`)? Turn it off:

```bash
ENABLE_THINKING=0 ./launch.sh          # restart without reasoning
```

| Mode | Behaviour | Use when |
|---|---|---|
| **reasoning on** *(default)* | `reasoning` + `content` split; use `max_tokens` ≥ 2000 | general use, hard math/code/logic |
| **reasoning off** (`ENABLE_THINKING=0`) | answer directly in `content`, any `max_tokens` | agents/UIs that cap `max_tokens` low |

`./chat.sh "..."` shows the thinking (dimmed) above the answer. Tool calling
(`--tool-call-parser glm47`) works in **both** modes.

## Validated configuration

| Setting | Value | Why |
|---|---|---|
| `--tensor-parallel-size` | 4 | one shard per GPU |
| `--decode-context-parallel-size` | **4** | shards MLA KV across the 4 GPUs → 250k fits |
| `--max-model-len` | 250000 | 710,593-token pool → **2.84× concurrency at 250k** |
| `--max-num-seqs` | 2 | target concurrency |
| `--kv-cache-dtype` | **fp8** | `fp8_ds_mla`; **required** on SM120 (bf16 = garbage) |
| `--quantization` | modelopt_fp4 | NVFP4 weights |
| `--attention-backend` | B12X_MLA_SPARSE | SM120-native sparse MLA decode |
| `--moe-backend` | b12x | NVFP4 MoE |
| `--speculative-config` | mtp, 3 tokens | MTP speculative decode |
| `--hf-overrides` | `index_topk_pattern` | **coherence-critical** (see below) |
| `--tool-call-parser` | glm47 | tool calls (always on) |
| `--reasoning-parser` | glm45 | on by default; omitted only with `ENABLE_THINKING=0` |

### Why `index_topk_pattern` (coherence-critical)

GLM-5.2 uses DeepSeek Sparse Attention. vLLM reads `index_topk_pattern`, **not** the
checkpoint's `indexer_types` array. Without the pattern, **all 78 layers build full
indexers** and the 57 "share/skip" (`S`) layers corrupt long-context attention →
garbage output. The 78-char `F`/`S` string (21 `F`, 57 `S`) is derived from the
model's `indexer_types` and injected via `--hf-overrides`. On boot you should see
**57** log lines: `Using index_topk_pattern/index_topk_freq to skip sparse MLA indexer …`.

### Why `DCP_SIZE=4`

With DCP=1 the MLA KV cache is replicated per TP rank, so a single 250k request needs
~14.5 GB but only ~10.3 GB/GPU is free → OOM (max ~177k). `decode-context-parallel-size=4`
shards the KV across the 4 GPUs along the sequence dim, yielding a 710,593-token pool.

### DCP=4 is the recipe — 250k context at ~3× concurrency

`DCP=4` is the default and the validated flagship: **250k context · ~3× concurrency
(710,593-token KV pool) · ~60 tok/s decode** (warm, with MTP). Sharding the MLA KV
across the 4 GPUs along the sequence dim is what makes 250k fit at all.

| `DCP_SIZE` | Max context | KV pool @ max | Concurrency | Decode (warm) | |
|---|---|---|---|---|---|
| **4** *(default)* | **250000** | **710,593 tok** | **~3× (2.84×)** | **~60 tok/s** | **the recipe** |
| 2 | 250000 | ~355k tok | 1.42× | ~49 tok/s | middle ground |
| 1 | ~131k (OOM > ~177k) | ~178k tok | 1.36× | ~81 tok/s | optional: smaller ctx, faster |

> Measured at temp 0, b12x, MTP=3, fp8 KV. Decode is steady-state and
> MTP-acceptance-dependent (~60 tok/s warm short ctx). **Cold TTFT is
> compile-dominated** — the first request at a new prompt length JIT-compiles that
> size bucket (tens of seconds), then warm / prefix-cache hits are fast. A slow
> *first* request is the kernel cache warming up, **not** a hang.

Only if you specifically want a smaller, faster ≤128k box instead, set `DCP_SIZE=1`
+ `MAX_MODEL_LEN=131072` in `.env` (~81 tok/s, but caps at ~131k and loses the
250k / ~3× headroom).

### Why `NCCL_P2P_DISABLE=1`

These RTX PRO 6000 are PCIe (no NVLink); the b12x PCIe allreduce path hangs at NCCL
init without P2P disabled.

## Performance (measured, warm)

| Metric | Value |
|---|---|
| Decode | **~60 tok/s** (short ctx, warm, MTP), ~45 tok/s @ 64k–100k |
| Prefill | ~5,100 tok/s @ 64k (warm); ~45k–65k tok/s on prefix-cache hits |
| TTFT | sub-second (short ctx); ~12 s for a fresh uncached 64k prefill |
| Concurrency | **~3× (2.84×) at 250k** (710,593-token KV pool) |

> First touch of a brand-new long prefix incurs a one-time compile of that size
> bucket (e.g. ~195 s for a fresh 99.5k prompt). Subsequent same-size prefills and
> prefix-cache hits are fast.

## Logs & peak throughput

`launch.sh` starts a background monitor (`monitor.sh`) that **forwards the serve logs
to a file** and **records peak prefill/decode throughput** — both survive container
auto-restarts (it re-attaches).

| File | Contents |
|---|---|
| `logs/serve.log` | full vLLM serve logs — `tail -f logs/serve.log`; rotated at 100 MB |
| `logs/peak.json` | `{ "peak_prefill_tps", "peak_decode_tps", "updated" }` |

```bash
tail -f logs/serve.log          # live serve logs
cat   logs/peak.json            # peak throughput so far
```

Measured peaks here (DCP=4, 250k, MTP): **decode ~57–60 tok/s**, **prefill ~1,400
tok/s** warm (a cold first-touch of a new prompt length compiles that size bucket
first — see Performance). Peaks accumulate across the
life of the deployment, including container restarts.

> `docker compose` users: run `./monitor.sh &` once after `up` — compose can't start
> the host-side monitor itself (the `logging:` block still rotates `docker logs`).

## Testing

```bash
python3 test/coherence_test.py core         # logic, math, code, philosophy, ascii, multi-turn
python3 test/coherence_test.py long         # 64k needle-in-haystack recall
python3 test/longctx_multiturn_test.py      # ~100k-token, 6-turn reasoning battery
```

All harnesses stream with **no `max_tokens`** and report TTFT, prefill tok/s, and
decode tok/s. The reasoning model emits its chain-of-thought in the `reasoning` field
and the final answer in `content`.

## fp8 / fp4 KV cache on SM120

- **fp8** KV (`fp8_ds_mla`) works and is the practical floor. The checkpoint ships no
  `k/v_scale`, so fp8 runs at scale 1.0 (a one-line startup warning).
- **fp4** KV is **hardware-blocked** on SM120: the DSA fp4 indexer cache asserts SM100
  (datacenter Blackwell, B200/GB200). Not available on the RTX PRO 6000.

## Troubleshooting

| Symptom | Fix |
|---|---|
| OOM at 250k, "estimated maximum model length ~177728" | set `DCP_SIZE=4` |
| Garbage / incoherent long-context output | ensure `INDEX_TOPK_PATTERN` is set (57 skip lines on boot) |
| Hang at NCCL init | keep `NCCL_P2P_DISABLE=1` |
| Garbage at all lengths | `--kv-cache-dtype fp8` is mandatory on SM120 |
| Empty / `null` `content` (`finish_reason: length`) | thinking ate the token budget | raise `max_tokens` ≥ 2000 (or omit), or run `ENABLE_THINKING=0` — see Reasoning |
