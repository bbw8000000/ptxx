---
title: "igorbarshteyn/jlens-gguf"
owner: "igorbarshteyn"
name: "jlens-gguf"
fullName: "igorbarshteyn/jlens-gguf"
description: "Interactive Jacobian-Lens visualizer and live steerer for GGUF models on llama.cpp"
sourceUrl: "https://github.com/igorbarshteyn/jlens-gguf"
stars: 87
forks: 13
language: "Python"
topics: []
license: "Apache-2.0"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-07-12T02:04:43Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# jlens-gguf — the Jacobian Lens for llama.cpp / GGUF models

A GGUF-native implementation of the **Jacobian Lens** from Anthropic's
[*Verbalizable Representations Form a Global Workspace in Language
Models*](https://transformer-circuits.pub/2026/workspace/index.html), plus an
**interactive visualizer & manipulator** (in the spirit of Neuronpedia's
J-Lens pages) that works against GGUF models served by llama.cpp — with
**live steering, concept swapping (patching), ablation, and steered
generation**.

```
                                  browser (web UI)
                                        │  JSON
                        ┌───────────────▼────────────────┐
                        │  bridge  (python, numpy)       │  lens math:
                        │  jlens_gguf.server             │  J_l transport, unembed,
                        │   • model GGUF → readout wts   │  top-k, ranks, J-lens vectors,
                        │   • lens GGUF  → J_l (+ bias)  │  steering / swap / ablate,
                        └───────┬────────────────────────┘  sparse decomposition
                                │  HTTP (binary activations, generic residual edits)
                        ┌───────▼────────────────────────┐
                        │  jlens-server  (C++, llama.cpp)│  the same GGUF file your
                        │   • captures l_out- per    │  llama-server mmaps — weights
                        │     layer/position             │  are shared page cache
                        │   • applies add / low-rank /   │
                        │     set edits mid-graph        │
                        │   • generation w/ edits active │
                        └────────────────────────────────┘
```

> **New here? Start with QUICKSTART.md** — a friendly,
> task-oriented walkthrough. This README is the full reference.

The reference PyTorch implementation reads the residual stream with hooks and
computes with torch tensors. Here, **the lens lives in a GGUF file**, readout
weights (final norm + unembedding) are **read directly from the model GGUF**
(dequantized with gguf-py, no torch), and residual-stream access + live
interventions go through a small **llama.cpp-based activation server** that
hooks the computation graph via ggml's scheduler eval callback.

## Quickstart

```bash
# clone with the llama.cpp submodule
git clone --recursive  jlens-gguf   # or: git clone … && git submodule update --init

# 0) prerequisites: gcc, cmake, python3  (llama.cpp comes as a submodule)

# 1) build the native activation server (builds llama.cpp too if needed)
native/build.sh

# 2) python env
python3 -m venv .venv && .venv/bin/pip install -e .   # or: pip install numpy requests gguf

# 3) fit a lens for your model (ridge regression over WikiText, ~minutes on CPU)
.venv/bin/python -m jlens_gguf fit \
    --model models/qwen2.5-1.5b-instruct-q8_0.gguf \
    --corpus wikitext:100 \
    -o lenses/qwen1.5b-lens.gguf

# 4) launch the visualizer (autostarts the native server)
.venv/bin/python -m jlens_gguf serve \
    --model models/qwen2.5-1.5b-instruct-q8_0.gguf \
    --lens lenses/qwen1.5b-lens.gguf
# → open http://127.0.0.1:8090
```

Or all-in-one: `scripts/jlens-up MODEL.gguf [LENS.gguf]`.

### Even quicker: point it at a model you're already running

If you already have a **llama-server** running, `quickstart` reads which GGUF
it serves (from its `/props`), spins up the introspection sidecar on the same
file, auto-loads a matching lens if one exists, and opens the browser:

```bash
python -m jlens_gguf quickstart --llama-server http://127.0.0.1:8080
# or just a file:
python -m jlens_gguf quickstart models/qwen2.5-1.5b-instruct-q8_0.gguf
# with no args it tries http://127.0.0.1:8080
python -m jlens_gguf quickstart
```

(The sidecar mmaps the same GGUF, so this adds only its KV cache, not another
copy of the weights.)

### 60-second demo (Qwen2.5-1.5B-Instruct, Q8_0)

Prompt: `Fact: The capital of Japan is Tokyo.\nFact: The currency used in the
country shaped like a boot is` — the model answers *" the Japanese yen"*: it
binds "currency" to the salient *Japan* instead of the boot-shaped country.
The lens shows exactly this: ` yen` collapses to rank 0 in the last layers
while ` euro`/` Euro` hover at rank 60–500 in the workspace band — the
runner-up hypothesis the paper describes. Add two **ablate** interventions
(` yen` and ` Japanese`, layers 14–26) and generate:

> **baseline:** ` the Japanese yen.` → **ablated:** ` the Euro.`

a concept-level correction of a faulty two-hop, performed live on a
quantized GGUF through llama.cpp.

*图片：ablation demo*

Without `--lens` the visualizer runs with the **identity lens** (= the classic
logit lens) — everything works, readouts are just less faithful at early
layers.

### Any GGUF, including Mixture-of-Experts

Fitting and visualization work on **any GGUF llama.cpp can load** — dense or
MoE (Qwen3-MoE, Mixtral, DeepSeek, OLMoE, …). The lens only ever touches the
`d_model`-wide residual stream (`l_out-`), which is identical whether the
block's FFN is dense or a sparse expert mixture, so **MoE routing and expert
count don't affect the lens at all**. Quantized weights are fine: readout
weights are dequantized to fp32 and the numpy readout matches llama.cpp's own
logits to corr > 0.9999 even at Q4 (verified on a 64-expert OLMoE and on Q8
Qwen).

**Scaling to large models.** The regression fit's memory is
`n_layers × 2 × d_model² × itemsize` (two Gram matrices per fitted layer) and
the lens file is `n_layers × d_model² × 2` bytes — both `O(n_layers·d_model²)`
and **independent of expert count**. `fit` prints this footprint up front. For
a ~200–400B MoE (e.g. Qwen3.5-397B-A17B): the *model itself* dominates memory,
so run it on hardware sized to load it; the lens then adds ~25–50 GiB of fit
RAM (use `--gram-dtype float32` to halve it) and a multi-GiB lens file. If that
doesn't fit at once, fit a **band** of layers with `--layers a,b,c` over
several passes and combine them with `JacobianLensGGUF.merge`. The main
*interactive* cost is the readout grid (`positions × d_model × vocab` per
layer) — use a layer **stride** or shorter prompts on very large models. Per-
token forward cost is set by the *active* parameters (A17B ≪ 397B), so capture
passes stay tractable, and GPU offload (`-ngl`) speeds them up.

### Converting a real (causal) Jacobian lens

The paper's estimator `J_l = E[∂h_final/∂h_l]` needs backprop, which llama.cpp
does not have. Two options:

- **`fit` (GGUF-native, above)** — per-layer ridge regression
  `h_final ≈ A_l h_l + b` over a corpus: the same-position, *correlational*
  surrogate of the Jacobian transport (a tuned-lens-style translator). Works
  on any quantized GGUF, forward passes only.
- **`convert-pt` (exact)** — fit the true causal lens on the original HF
  checkpoint with Anthropic's reference code,
  then convert the `.pt` to lens-GGUF (works *without* torch installed):

  ```bash
  .venv/bin/python -m jlens_gguf convert-pt lens.pt lens.gguf
  ```

  The converted lens drops into the same visualizer.

## Backend mode — steer any app that speaks to llama-server

`jlens-server` is also a **drop-in llama-server replacement**: point any
OpenAI-compatible app (Open WebUI, SillyTavern, your own code, the `openai`
SDK) at it, and a **server-held live intervention set** is applied to *every*
completion it serves — so you can steer, ablate, or swap concepts in the
tokens the app actually generates, and watch it in the visualizer beside it.

```
   your chat app ──OpenAI──▶  jlens-server /v1/chat/completions
                                     ▲ applies the live intervention set
   J-Lens UI  ──push/clear──────────┘   (steer / swap / ablate)
              ──"load last chat"──▶  visualize the exact conversation
```

Endpoints on `jlens-server` (default `:8091`):

| endpoint | purpose |
|---|---|
| `POST /v1/chat/completions` | OpenAI chat, streaming + non-streaming |
| `POST /v1/completions` | OpenAI text completion |
| `GET  /v1/models` | model id |
| `GET/POST/DELETE /jlens/interventions` | read / set / clear the live set |
| `GET  /jlens/last_completion` | the exact tokens of the last completion |

Interventions apply live during both prompt processing and token generation
(they edit the residual stream mid-graph, so they affect the KV cache and the
sampled tokens). In the UI's **Live backend** panel:

- **push interventions** — install the enabled chips as the backend's live
  set (position ranges become all-positions, since an app's conversation
  doesn't line up with visualizer prompts).
- **clear** — remove them; the backend returns to normal.
- **load last chat** — pull the app's most recent completion into the
  heatmap (prompt + generated tokens marked) to see the readouts behind what
  it just said.

Example — steer a downstream app with nothing but the stock `openai` client:

```python
import openai
client = openai.OpenAI(base_url="http://127.0.0.1:8091/v1", api_key="x")

# operator (elsewhere): POST /jlens/interventions to ablate the " Euro" direction
client.chat.completions.create(model="m", messages=[
    {"role": "user", "content": "The currency of the country shaped like a boot is the"}])
# → "…is the Indonesian rupiah" instead of "…the Euro": the concept is gone,
#   live, and the output stays grammatical.
```

*图片：live backend panel*

**Prefix caching / determinism:** the backend reuses the KV prefix across
turns (a chat app's growing history decodes only the new tokens). Like
llama-server, greedy output is *not* bit-invariant to prefix reuse — llama.cpp
sums cached vs in-batch KV blocks in a different order, so a completion may
differ from a fully-fresh recompute by a token. The **visualizer's** forward
path always recomputes fresh, so its readouts are exact and reproducible;
changing the live set invalidates the cache automatically.

**What it can't do:** attach to an *already-running* stock `llama-server`
process — activation access needs the callback registered at context creation,
which is why the sidecar exists. Run your app against `jlens-server` instead;
it mmaps the same GGUF, so weights are shared.

## Integrating with your app (ATHENA, talk-llama, anything on llama-server)

There are two integration levels, depending on whether you want to *watch* the
j-space or *manipulate* what your app generates:

**(a) Inspect only — leave your app untouched.** Keep your app on its current
llama-server. Run `jlens-gguf quickstart --llama-server `: it reads
the model from that server and opens the visualizer on the same GGUF. You get
the full layer×position readout, pins, rank charts, and decomposition for any
prompt you paste in — no change to your app. (It can't see the app's *live*
activations, since those live in the other process; it recomputes them on the
same weights.)

**(b) Inspect *and* steer your app — point your app at `jlens-server`.**
Because `jlens-server` speaks the OpenAI API and accepts llama-server's launch
flags, it's a drop-in backend:

```bash
# however you launch llama-server today, e.g.:
#   llama-server -m model.gguf -c 8192 -ngl 99 --host 0.0.0.0 --port 8080
# just swap the binary — same flags work:
native/jlens-server -m model.gguf -c 8192 -ngl 99 --host 0.0.0.0 --port 8080
```

Now point your app's base URL at `http://:8080/v1` (for talk-llama.cpp,
that's its OpenAI/server endpoint; for an agent framework like **ATHENA**, set
the model/base-URL it uses for llama.cpp to this). Open the visualizer
(`jlens-gguf serve --llama-server http://:8080` or point `--native-url`
at it), build steer/swap/ablate interventions, and hit **push interventions** —
they apply to every completion your app requests from that moment on, and
**load last chat** shows you the readouts behind what it just said. Remove them
with **clear** and the backend behaves like a normal llama-server again.

So: *ATHENA (or any llama-server client) → `jlens-server` → your GGUF*, with the
J-Lens UI riding alongside. If you tell me exactly how ATHENA points at
llama.cpp (a base URL, a spawned `llama-server`, or an in-process
`libllama`), I can tailor a drop-in recipe or a launch wrapper.

## Staying in sync with upstream llama.cpp / ggml

`jlens-server` **does not fork or patch llama.cpp or ggml** — it links against
their *public* API only (`llama.h`, `ggml.h`, `ggml-backend.h`, `libllama`),
using the same `ggml_backend_sched` eval-callback hook that `llama-imatrix`
and the debug tooling use. The HTTP and JSON dependencies are vendored under
`native/vendor/`, so the build never reaches into llama.cpp's internal file
layout either. Updating is therefore just:

```bash
cd llama.cpp && git checkout  && cd ..   # or: git submodule update --remote
native/build.sh          # rebuilds libllama + jlens-server
```

llama.cpp is pinned as a **git submodule** (currently `ggml-org/llama.cpp` at a
known-good commit), so a fresh clone gets a matching pair, and bumping it is one
command. The one internal convention `jlens-server` relies on is the residual
tensor name `l_out-` (stable across all mainstream decoder architectures);
a startup self-check reports `l_out_ok: false` in `/props` if a future/unusual
architecture ever stops exposing it, so a mismatch fails loudly rather than
silently.

## The visualizer

- **Heatmap** — lens top-1 token at every (position, layer); scrollable,
  virtualized, hover for the full top-k. Click a cell to select it and pin its
  token. `⇧`+hover scrubs; arrow keys move the selection.
- **By-Layer / By-Pos panels** — full top-k readout down the stack at the
  selected position, and across positions at the selected layer.
- **Pins** — pinned tokens get log-rank trajectories (rank vs layer, rank vs
  position) and a viridis rank heatmap over the whole grid.
- **Cell readout** — top-40 tokens with probabilities at the selected cell;
  one click steers/swaps with the cell's top token.
- **Decompose** — the paper's sparse J-space decomposition (greedy matching
  pursuit onto J-lens vectors): which token-directions make up this
  activation, with coefficients and explained variance.
- **Interventions** (the manipulator):
  - **steer** — `h ← h + α‖h‖·v̂_t` at chosen layers/positions. Positive α
    summons a concept, negative suppresses it.
  - **swap** — the paper's concept patch: read lens coordinates
    `c = V⁺h` of two tokens and exchange them, `h ← h + V(σ(c)−c)`.
    The component orthogonal to both directions is untouched.
  - **ablate** — project a token's J-lens direction out of the stream.
  - Interventions apply **live** during prompt processing *and* generation;
    cells whose top-1 changed vs. the un-intervened baseline get an orange
    marker, with the baseline token shown in the tooltip.
- **Generate** — continue the prompt with interventions active, side-by-side
  with the un-steered baseline; or "visualize continuation" to extend the
  heatmap into generated tokens.
- **lens checkbox** — toggle between the fitted lens and the raw logit lens.

URL params: `?prompt=...&autorun=1&gen=24`.

## How it works

**Native server** (`native/jlens_server.cpp`, ~700 lines, links only
`libllama`): registers a `ggml_backend_sched` eval callback. llama.cpp names
each block's residual output `l_out-`; when such a node finishes, the
callback (a) applies any interventions to the requested (layer, position)
ranges by editing the tensor in place — downstream nodes, the KV entries of
later layers, and the model's own sampled tokens all see the edit — and (b)
copies the (post-edit) activations out. Three edit primitives cover all lens
operations: `add` (steering vector), `lowrank` (`h += A(Bh)` — swap is rank-2,
ablation rank-1), and `set`. One detail worth knowing: llama.cpp gathers only
logit-requested rows before the last block, so the server requests logits at
all positions whenever the final layer is captured.

**Bridge** (`jlens_gguf/server.py`): reads `output.weight` / `output_norm.*`
straight from the model GGUF (any quantization; dequantized once to fp32),
loads `J_l` from the lens GGUF, and does all lens math in numpy:

    lens_logits(h, l) = softcap( W_U · norm( J_l h + b_l ) )

J-lens vectors are `v_t = J_lᵀ(γ ⊙ W_U[t])` (the norm's diagonal scale folded
in). The UI's steer/swap/ablate specs are translated into native `add`/
`lowrank` edits per fitted layer, with steering magnitudes scaled by the
layer's typical residual norm (stored in the lens file at fit time).

**Lens GGUF format**: tensors `jlens.J.{layer}` `[d,d]` (fp16) and optional
`jlens.b.{layer}`; metadata `jlens.d_model`, `jlens.source_layers`,
`jlens.target_layer`, `jlens.fit_method` (`jacobian` | `regression` |
`identity`), `jlens.n_prompts`, `jlens.h_rms`. `python -m jlens_gguf inspect
lens.gguf` prints it.

## Command-line flags

`jlens-server` accepts the common **llama-server** launch flags so you can swap
the binary in place: `-m/--model`, `-c/--ctx-size`, `-b/--batch-size` and
`-ub/--ubatch-size` (both map to the prompt chunk), `-t/--threads`,
`-ngl/--n-gpu-layers`, `-mg/--main-gpu`, `-fa/--flash-attn [on|off|auto]`,
`--no-mmap`, `--mlock`, `--host`, `--port`. Single-sequence-only flags it
doesn't need (`--parallel`, `--cont-batching`, `--api-key`, `--jinja`, …) are
accepted and ignored with a notice, so an existing launch command won't error.
`jlens-server --help` lists them.

## Pairing with llama-server

`jlens-server` is built from your llama.cpp checkout and **mmaps the same
GGUF** your `llama-server` serves, so model weights are shared page cache —
running both costs one copy of the weights plus each server's KV cache. Run
your chat frontend against llama-server as usual and point the visualizer at
the same file to inspect/steer the same model live.

## API sketch (native server)

```
GET  /props /vocab /health /v1/models
POST /tokenize /detokenize /apply_template
POST /jlens/forward   {tokens, capture_layers?, dtype?, interventions?,
                       n_predict?, sampling?, logits_positions?}
      → "JLNS" binary: header JSON + raw f16/f32 activation blocks
POST /v1/chat/completions /v1/completions   (OpenAI-compatible; live set applied)
GET/POST/DELETE /jlens/interventions        (the live intervention set)
GET  /jlens/last_completion                 (exact tokens of the last completion)
```

Interventions: `{layer, pos_start, pos_end (-1 = ∞), mode: add|set|lowrank,
data: b64 f32, k?}`. See `native/jlens_server.cpp` header comment for the
full schema, and `jlens_gguf/client.py` for the Python client.

## Tests

```bash
.venv/bin/python -m pytest tests/    # 60 tests (incl. backend mode)
```

Covers: lens GGUF roundtrip, pure-python `.pt` conversion, numpy unembed vs
llama.cpp logits (≤1e-4), capture determinism, all three edit primitives
against closed-form expectations, regression-fit quality vs the logit lens,
every bridge endpoint including steering/swap/ablate rank effects, **backend
mode** (OpenAI chat/completions, streaming, stop sequences, live-intervention
effects, KV prefix reuse, forward/completion interplay), and a
headless-Chromium drive of the full UI. `tests/test_moe.py` adds a
Mixture-of-Experts check (capture + readout + intervention + steered
generation), auto-skipped unless a MoE GGUF is present
(`JLENS_MOE_MODEL=/path/to/moe.gguf`).

## Caveats

- The regression lens is a *correlational* approximation; for the paper's
  causal claims, fit with the reference code and `convert-pt`.
- Grid computation is `T × d × vocab` per layer in numpy — a few seconds per
  run for a 1.5B model with a 152k vocab on CPU. Use layer `stride` or
  shorter prompts if it drags.
- Architectures whose graphs don't name `l_out` tensors are rejected at
  startup (`l_out_ok: false` in `/props`) — all mainstream llama.cpp decoder
  archs have them.
- `apply_template` uses llama.cpp's built-in template matcher (chatml
  fallback), not a full Jinja engine.
- Bind addresses default to 127.0.0.1; neither server has auth. Keep them
  local.

## Layout

```
native/           jlens_server.cpp, build.sh, poc_cb.cpp
  vendor/         vendored cpp-httplib + nlohmann/json (build is self-contained)
jlens_gguf/       python package: lens, model_reader, readout, client,
                  fitting, pt_convert, server (bridge), cli, web/ (UI + d3)
tests/            pytest suite + CDP browser driver
scripts/jlens-up  one-command launcher
llama.cpp/        git submodule (ggml-org/llama.cpp, public API only)
lenses/           fitted lenses (gguf; gitignored — fit or download locally)
```

Code: Apache-2.0 (see `LICENSE`/`NOTICE`). The web UI's heatmap/panel/rank-chart
design is adapted from Anthropic's jacobian-lens reference visualization
(Apache-2.0). Vendored `cpp-httplib` and `nlohmann/json` are MIT; `d3` is ISC.
