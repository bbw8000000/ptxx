---
title: "jaredpalmer/kev"
owner: "jaredpalmer"
name: "kev"
fullName: "jaredpalmer/kev"
description: "tiny Jev-like model built on top of Qwen2.5-0.5B you can train and run on your MacBook"
sourceUrl: "https://github.com/jaredpalmer/kev"
stars: 580
forks: 33
language: "Python"
topics: []
license: "Apache-2.0"
defaultBranch: "main"
snapshotDate: "2026-09-20"
pushedAt: "2026-09-20T02:35:18Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# kev

Jev-inspired decision model. Typed questions in, calibrated probabilities out, one forward pass.


  
  
  
  
  


*图片：kev playground*

kev is a LoRA adapter and a small readout head on top of a Qwen base model (0.5B to 8B). It reads a document once and answers many typed questions about it in parallel, in a single prefill pass with no decoding. The document and every question are packed into one sequence; a block-causal mask lets each question see the document but never another question. A pointer head then scores each question's options against its decision token and applies softmax. Those probabilities are the output. The head is trained with cross-entropy against labelled outcomes, so the probabilities are learned rather than generated as text.

The architecture follows the reconstruction of TypeSafe's Jev in [Jev's Architecture Unmasked](https://archerhume.com/posts/jevs-architecture-unmasked). The API follows TypeSafe's [System One](https://docs.typesafe.ai/api) contract, so the official `typesafe-sdk` works against a local kev server with a `base_url` change.

## Highlights

- **Three question types.** `noul` (yes/no), `choice` (2–255 options), `score` (ordered levels). One shared readout.
- **One pass, many answers.** The state is encoded once. Questions run as isolated branches under a block-causal mask.
- **Isolation is exact.** A question cannot see a sibling question. Packed and separate requests agree to `4e-6`.
- **Probabilities, not prose.** Trained with cross-entropy on labelled outcomes. Out of domain, `kev-4b` has Brier 0.33 and 8% confident errors on sources it never saw.
- **Drop-in API.** `POST /v1/systemone` with TypeSafe's request and response shapes. Their SDK's quickstart runs unmodified.
- **A family, measured the same way.** 0.5B, 0.6B, 4B and 8B checkpoints scored on frozen, checksummed suites with a locked test, against the real Jev on the same items. Out of domain: kev-4b 0.79, kev-8b 0.80, Jev 0.86.
- **Runs on a laptop; trains in the cloud.** `kev-0.5b` trains in ~1h45m on an Apple M5; the 4B/8B recipes train in 40–70 min on one H100 via Modal and serve on a 32 GB Mac in bf16.

*图片：kev family vs Jev on sources kev never trained on*

## Installation

Requires Python 3.12+, [uv](https://docs.astral.sh/uv/), and Node 20+ for the playground. Serving is tested on Apple Silicon (MPS); training and evaluation on CUDA (H100 via Modal) and MPS.

```bash
git clone https://github.com/jaredpalmer/kev.git && cd kev
uv sync --extra serve
cd playground && npm install && cd ..
```

### Download the weights

All checkpoints are on the Hugging Face Hub in the [kev collection](https://huggingface.co/collections/jaredpalmer/kev-6aad9d0ea49f2589665e07cd). `--run` accepts a Hub id; the base model downloads on first load. **`kev-4b` is the one to start with**: the best accuracy per byte, and it serves on a 32 GB Mac in bf16.

```bash
KEV_DTYPE=bf16 uv run --extra serve python -m kev.serve --run jaredpalmer/kev-4b --port 8009
```

| checkpoint | base | in-distribution (dev / locked test) | out-of-domain (dev / locked test) | serve on a Mac | card |
|---|---|---|---|---|---|
| [`kev-0.5b`](https://huggingface.co/jaredpalmer/kev-0.5b) · v0.1 release | Qwen2.5-0.5B | 0.712 / – | 0.575 / – | fp32, ~160 ms | MODEL_CARD.md |
| [`kev-0.6b`](https://huggingface.co/jaredpalmer/kev-0.6b) · preview | Qwen3-0.6B-Base | 0.805 / 0.819 | 0.598 / 0.631 | fp32 | card |
| [`kev-4b`](https://huggingface.co/jaredpalmer/kev-4b) · preview | Qwen3-4B-Base | 0.854 / 0.856 | 0.790 / **0.806** | bf16, ~1 s | card |
| [`kev-8b`](https://huggingface.co/jaredpalmer/kev-8b) · preview | Qwen3-8B-Base | 0.863 / **0.870** | 0.796 / 0.780 | bf16, ~2 s | card |
| Jev (hosted reference) | – | 0.845 / – | 0.857 / – | | |

Same frozen items for every row (`evals/v4`: 1,200 in-distribution questions from the trained sources; 764 out-of-domain records from six public sources kev never trained on plus held-out programmatic policy rules). The three previews carry no version tag: our predeclared release screen (both siblings of a held-out policy pair correct ≥ 70%, on **every** seed of the recipe) is not yet met — the best recipe lands at 0.62–0.73 across seeds, with a single family (day-precision date arithmetic) deciding it. Each card records its single locked-test read. `kev-0.5b` is also attached to the GitHub release.

## Quick Start

Start the server:

```bash
KEV_DTYPE=bf16 uv run --extra serve python -m kev.serve --run jaredpalmer/kev-4b --port 8009
```

Ask it something:

```bash
curl -s localhost:8009/v1/systemone -H 'content-type: application/json' -d '{
  "state": "Shoes arrived two weeks late and in the wrong size. Also I see two charges on my card.",
  "model": "kev-latest",
  "questions": {
    "department":  {"type": "choice", "instructions": "Which team should handle this?",
                    "criteria": {"returns": "Exchanges, refunds, wrong or damaged items",
                                 "shipping": "Delivery status, delays, lost packages",
                                 "billing": "Charges, invoices, payment problems"}},
    "escalate":    {"type": "noul",  "instructions": "Does this need urgent human attention?"},
    "frustration": {"type": "score", "instructions": "How frustrated is the customer?",
                    "criteria": ["Calm", "Frustrated", "Very angry"]}
  }}'
```

```json
{
  "model": "kev-latest",
  "answers": {
    "department":  { "type": "choice", "choice": "returns", "confidence": 0.83,
                     "probabilities": { "returns": 0.89, "shipping": 0.04, "billing": 0.07 } },
    "escalate":    { "type": "noul", "noul": 0.54 },
    "frustration": { "type": "score", "score": 1.25, "confidence": 0.88,
                     "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
                     "probabilities": { "0": 0.00, "1": 0.75, "2": 0.25 } }
  },
  "usage": { "input_tokens": 101, "output_tokens": 161 },
  "latency_ms": 277
}
```

(`kev-4b`, bf16 on an M5.)

Or use the TypeSafe SDK:

```python
from typesafe_sdk import TypeSafeClient, Choice, Noul, Score

client = TypeSafeClient(api_key="local", base_url="http://127.0.0.1:8009", model="kev-latest")
r = client.system_one(
    state="I was charged twice. Please fix this ASAP.",
    questions={
        "billing": Noul(instructions="Is this ticket about billing?"),
        "tone": Choice(instructions="What is the customer's tone?", criteria={"calm": None, "frustrated": None, "angry": None}),
        "urgency": Score(instructions="How urgent is this ticket?", criteria=["can wait", "this week", "today"]),
    },
)
r.nouls["billing"].noul, r.choices["tone"].choice, r.scores["urgency"].score
```

### Playground

```bash
cd playground && npm run dev -- -p 3001
```

Open localhost:3001. Load a preset, edit the state and questions, press `⌘↵`. **Packed vs separate** compares one N-question request with N single-question requests. **Permute** re-asks a Choice under six option orders. The **Isolation probe** and **Boundary forgery** presets reproduce the two experiments from the blog post.

**Chess** at localhost:3001/chess: the legal moves are the options of one Choice question, the board is the state, and a Score rates the position in the same request. Play the model or watch it play itself; games are kept in `localStorage`.

*图片：kev chess: every move is a Choice question*

## API

### `POST /v1/systemone`

```jsonc
{
  "state": "…",                          // string | object | array — the content to evaluate
  "model": "kev-latest",
  "questions": {
    "": {                            // you choose the id; the model never sees it
      "type": "noul" | "choice" | "score",
      "instructions": "…",               // string | object | array
      "criteria": …                      // noul: {true?, false?}  choice: {option: description|null}  score: [level, …]
    }
  }
}
```

| Answer type | Fields | Derived from the distribution `p` |
|---|---|---|
| `noul` | `noul` | `p[yes]` |
| `choice` | `choice`, `probabilities`, `confidence` | `argmax`, `p` by option key, `(p_max − 1/K) / (1 − 1/K)` |
| `score` | `score`, `legend`, `probabilities`, `confidence` | `Σ k·p[k]`, level index → text, `p` by level index |

Structured `instructions`, `criteria` and `state` are flattened to labelled text. Option and branch delimiters cannot be forged from user text. Validation errors return `422`.

### Other endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/v1/models` | Model, base and run info |
| `POST` | `/v1/systemone/permute` | One Choice question under N option orders |
| `POST` | `/v1/systemone/separate` | Each question in its own pass, for comparison |

There is no authentication. The server is intended for local use.

## How It Works

```mermaid
flowchart LR
    A[API requeststate + typed questions] --> B[render to textapi.to_record]
    B --> C[pack into one sequencemodel.encode]
    C --> D[block-causal mask +branch position ids]
    D --> E[causal LM backboneQwen base + LoRAprefill only]
    E --> F[pointer readoutdecide token · option tokens]
    F --> G[softmax per question]
    G --> H[API responsechoice · confidence · score]
```

**Packing.** The state and every question go into one token sequence. Reserved tokens mark the structure.

```
 …state…
 instructions  option 1   option 2  …     ← question 1
 instructions  option 1   option 2  …     ← question 2
```

**Mask.** Position `i` attends to `j` when `j ≤ i` and `j` is in the state or in the same question as `i`. State tokens are computed once. Question branches never see each other.

```mermaid
flowchart TB
    subgraph S[state prefix — computed once]
        s1[t1] --> s2[t2] --> s3[t3]
    end
    subgraph Q1[question 1 branch]
        q1a[q] --> q1b[opt] --> q1c[opt] --> q1d[decide]
    end
    subgraph Q2[question 2 branch]
        q2a[q] --> q2b[opt] --> q2c[opt] --> q2d[decide]
    end
    S --> Q1
    S --> Q2
    Q1 -. no attention .- Q2
```

**Positions.** Each branch restarts its position ids after the state. Every question sees "state, then one question". Question order does not matter.

**Readout.** A pointer head scores each option's `` hidden state against the `` hidden state and applies softmax. `K` is whatever the request sends. `` follows all options, so the model reads the full list before scoring; this is what makes "none of the above" work.

**Training.** LoRA (r=16) on the backbone, head from scratch, cross-entropy on the option distribution. Training data and live requests go through the same renderer, so the model never meets a format at inference that it did not see in training.

## Training

Training data are public datasets converted to TypeSafe-shaped requests plus programmatic policy pairs, frozen into checksummed suites (`evals/`). `kev-0.5b` used six sources (Banking77, AG News, MNLI, BoolQ, SST-5, Yelp; 9,000 records). The current recipe (`kev-4b`, `kev-8b`) trains on `decision-v4`/`v6`: ten to thirteen public sources at 1,000 records each plus two arms of 448 programmatic policy records, two epochs, LoRA r=16, **lr 5e-5** — the single largest recipe improvement we found, because the default 2e-4 erodes what the base model already knows (details and the base-model probe in PLAN.md).

*图片：training*

```bash
# sanity run, ~1 minute
uv run python -m kev.train --n_per_source 40 --accum 4 --out runs/smoke

# kev-0.5b, ~1h45m on an M5
uv run python -m kev.train --n_per_source 1500 --epochs 2 --perm_kl 0 --ord_w 0 --out runs/kev

# the kev-4b recipe on a frozen suite (one H100 via Modal, ~40 min; see below)
uv run python -m kev.train --suite evals/v4/decision-v4 --base Qwen/Qwen3-4B-Base --epochs 2 --lr 5e-5 \
    --batch 4 --accum 2 --dtype bf16 --checkpointing 1 --p_none_pair 0.25 --device cuda --out runs/kev-4b
```

| Flag | Default | Purpose |
|---|---|---|
| `--base` | `Qwen/Qwen3-0.6B-Base` | Causal LM backbone (any Qwen2.5/Qwen3 base; Qwen3-4B/8B for the previews) |
| `--n_per_source` | `1000` | Records sampled per dataset |
| `--holdout` | – | Sources to exclude, e.g. `mnli,sst5`, for out-of-source evaluation |
| `--perm_kl` | `0` | Optional symmetric KL between predictions under two option orders |
| `--ord_w` | `0` | Optional ranked probability score for ordered levels |
| `--suite` | – | Train on a frozen suite's training partition |
| `--batch`, `--dtype` | `1`, `fp32` | Padded batch size; `bf16` autocast on CUDA (fp32 master weights) |
| `--device` | auto | `cuda`, `mps`, or `cpu` |
| `--p_none_pair` | `0` | Fraction of Choice records that also emit a none-of-the-above minimal pair (true option present / removed) |
| `--option_isolation` | `0` | Option spans as isolated sub-branches with shared positions: exact permutation invariance (costs accuracy at 4B) |
| `--lora_targets`, `--head_lr`, `--weight_decay` | `all`, `=lr`, `0.01` | Low-drift knobs; none beat plain lr 5e-5 |

The released `kev-0.5b` used cross-entropy without either extra loss. The current data conversion and sampling have changed, so rerunning this command does not reproduce its weights exactly. The optional ordinal loss now compares cumulative probabilities, a proper scoring rule, rather than absolute error of the expected level. Full historical recipe in the model card.

On a Mac, run one training job at a time; two jobs on the same Apple GPU slow each other by about 10×. The MBP path is kept working, but anything longer than a smoke run goes to Modal. The MBP figure above is the `kev-0.5b` run.

### Modal

Studies run as one H100 container per trial, in parallel, with results pulled back into `runs/` and ranked by the same code that runs locally.

```bash
uv run modal token new                                    # once; opens the browser
KEV_GPU=T4 uv run modal run modal_app.py::smoke           # end-to-end check, ~1 minute of GPU

uv run modal run modal_app.py::study \
    --suite evals/decision-v2 --plan experiments/data-ablation-v2.json \
    --name ablation-v2 --transfer evals/transfer-v2 \
    --existing jaredpalmer/kev-0.5b                       # legacy checkpoints scored alongside

uv run modal run modal_app.py::evaluate --run jaredpalmer/kev-0.5b --suite evals/transfer-v2 --name transfer-kev
```

A plan is a JSON list of 1–8 trials over an allowlisted set of training parameters (`kev/experiment.py`). Each trial records the local git commit, the suite hash, and the hashes of the shipped `kev/*.py`; the container refuses to run if they differ from what the launcher hashed. Training uses TF32 and optional bf16; evaluation is fp32-exact (TF32 alone moves probabilities by ~1e-3, enough to trip the isolation gate). Measured: 0.019 s/record for Qwen2.5-0.5B at batch 8 on an H100 vs 0.34 s/record on an M5, ~$0.15–0.30 per 0.5B trial.

## Evaluation

```bash
uv run python -m kev.evaluate --run runs/kev --n_per_source 150 \
    --baseline --baseline_instruct Qwen/Qwen2.5-0.5B-Instruct
```

Writes `runs/kev/eval.json`. Baselines use the same rendered text and read next-token logits over option letters.

| | Zero-shot base | Zero-shot Instruct | **kev-0.5b** |
|---|---|---|---|
| Choice, 4-way (AG News) | 0.813 / 0.069 | 0.787 / 0.160 | **0.940 / 0.028** |
| Choice, 3-way (MNLI) | 0.460 / 0.225 | 0.433 / 0.390 | **0.747 / 0.100** |
| Choice, 77-way (Banking77) | – | – | **0.860 / 0.057** |
| Noul (BoolQ) | 0.427 / 0.274 | 0.607 / 0.084 | **0.753 / 0.136** |
| Score, 5 levels (Yelp) | 0.313 / 0.043 | 0.353 / 0.078 | **0.553 / 0.118** |
| **All** (1,350 held-out questions) | | | **0.799 / 0.065** |

Cells are accuracy / ECE (10 bins) for the original `kev-0.5b`. These are in-distribution numbers; the test splits come from the training datasets. The current checkpoints are compared on frozen suites below.

### Frozen research suites

Every number in this README after the table above comes from frozen, checksummed suites under `evals/`: separate training, calibration, development, and locked test partitions; pinned dataset and base-model revisions; per-record provenance. Development partitions select models; the locked test is read once per published candidate (`--allow-test`, or `modal_app.py::locked_test`, which refuses a second read). Manifests and dev/test partitions are in git; training partitions over 10 MB are fetched from the [`jaredpalmer/kev-suites`](https://huggingface.co/datasets/jaredpalmer/kev-suites) mirror and verified against the manifest hash on first use.

| suite | trains on | evaluates | used for |
|---|---|---|---|
| `decision-v4` / `v6` | 10–13 public sources + programmatic policy pairs | 1,200 in-distribution questions | model selection, kev-4b / kev-8b |
| `transfer-v4` | nothing | QNLI, SciQ, TweetEval, PAWS, MMLU, Emotion + held-out policy rule structures | out-of-domain, every trial |
| `decision-v1`, `transfer-v1` | six sources | first kev-0.5b vs Jev comparison | historical |

```bash
uv run python -m kev.benchmark --run jaredpalmer/kev-4b --suite evals/v4/transfer-v4 --out runs/my-eval
uv run python -m kev.experiment --suite evals/v4/decision-v4 --plan experiments/auto/lowdrift-4b-v4.json --out runs/my-study --transfer evals/v4/transfer-v4
uv run python -m kev.autoresearch leaderboard        # rebuild runs/leaderboard.md from every study
```

Trials are configuration-only: `kev.experiment` refuses configs outside a bounded allowlist, records code, suite, and git hashes, checks complete coverage, isolation, and packing, scores the transfer suite, and never reads the locked test. `kev.autoresearch` runs bounded hill-climb rounds over that allowlist on Modal and keeps the leaderboard; 90 trials so far, all in `runs/leaderboard.md`.

### Comparison with Jev

`kev.jev` scores the same frozen partitions against the real `typesafe-ai/jev` through Vercel AI Gateway (AI SDK 7 `experimental_evaluate`, cost-capped; about two cents per suite). Jev is the hosted reference product; its training exposure to these public datasets is unknown, so this is a shared-item comparison, not a controlled ablation.

| out-of-domain, `transfer-v4` dev (764 records) | Qwen3-8B base, untrained | Qwen3-30B-A3B base, untrained | kev-0.6b | kev-4b | kev-8b | Jev |
|---|---|---|---|---|---|---|
| accuracy | 0.726 | 0.707 | 0.598 | 0.790 | 0.796 | **0.857** |
| Brier (lower is better) | 0.366 | 0.365 | 0.521 | 0.328 | 0.337 | **0.211** |
| confident errors (p ≥ 0.9 and wrong) | 0.6% | 0.5% | 5.2% | 8.2% | 9.9% | 3.7% |
| held-out policy rules, both siblings correct | 0.55 | 0.44 | 0.11 | 0.73 | 0.69 | **0.86** |
| MMLU / PAWS | 0.75 / 0.84 | 0.79 / 0.82 | 0.46 / 0.56 | 0.65 / 0.72 | 0.70 / 0.78 | 0.90 / 0.79 |

The two untrained columns are the base models read zero-shot from next-token letter logits (`scripts/base_mmlu_probe.py`): kev-8b beats its own base by +5.8 pp [+1.8, +10.0] and the untrained 30B-A3B by +9.7 pp [+4.7, +14.4], while both untrained models beat every kev on knowledge (MMLU) and paraphrase (PAWS) — the fine-tune still gives back some of what the base knows.

What the controlled studies established (record-clustered paired bootstraps, seeds replicated; full log in PLAN.md):

- **Capacity dominates out of domain.** With public examples and synthetic budget held equal, 0.6B → 4B is +14–19 pp; 4B → 8B is +1.5–2 pp.
- **Fine-tuning erodes base capability, and the learning rate controls it.** The 4B base scores 0.69 on the same MMLU items zero-shot; the default recipe trained it down to 0.60–0.66. lr 5e-5 recovers most of it: +4.7 pp [+0.4, +9.6], replicated at three seeds on 4B and 8B.
- **More public data raises in-distribution accuracy and lowers or flattens transfer.** Knowledge MCQ sources lift MMLU a few points without moving the total.
- **Programmatic contrastive policy pairs** teach the trained rule structures (0.85–1.0) and transfer partially to unseen ones (0.5–0.67 at 4B/8B, near chance at 0.6B); none-of-the-above minimal pairs fixed the "none" shortcut in-domain (0.75 → 0.93 at 4B).
- **Structural diversity in the synthetic rules** (60 random rule trees with negation anywhere, instead of eight fixed shapes) fixed the two failing held-out compositions (0.62–0.66 → 0.75–0.97) and produced the current previews (+3 pp transfer at 4B and 8B). Day-precision date arithmetic (`deadline`) did not move under any data we generated (0.45–0.60; untrained bases 0.53; Jev 0.93).
- Fourteen one-knob mutations around the low-lr recipe, anchoring to the base model's own distribution, and weight-space interpolation all land within ±1 pp: the remaining gap to Jev is MMLU, PAWS, Emotion, and date arithmetic, not hyperparameters.

The first comparison (`kev-0.5b` on `decision-v1`/`transfer-v1`: −1.8 pp in-distribution with a CI including zero, **−19.1 pp [−23.1, −15.0]** out of domain) is kept as `docs/kev-vs-jev.png` and `docs/kev-vs-jev-transfer.png`; regenerate with `uv run python scripts/plot_eval_comparison.py`, the family figure with `uv run python scripts/plot_family.py`.

The mechanism tests below are from `kev.evaluate` on `kev-0.5b`; the 4B/8B checkpoints reproduce the isolation and packing results exactly (max delta 4e-6, checked on every trial).

| Mechanism test | Result |
|---|---|
| Isolation — secret in sibling question / absent / in state | `p = 0.03` / `0.03` / **`0.99`** |
| Packed vs separate — max probability difference | **`3.7e-6`**, packed 2.0× faster |
| Permutation — argmax flips under 4 option orders | 7.4% |
| IIA — log-odds shift from one irrelevant option | 0.13 mean, 0.34 p90 |
| Boundary forgery — fake delimiters in option text | option count unchanged, forged option `p ≤ 0.09` |

## Limitations

- **Out of domain it trails Jev by 6–7 points** at 4B/8B and by 26 at 0.6B. The gap is concentrated in knowledge (MMLU 0.69–0.75 vs 0.90), paraphrase (PAWS), noisy-label emotion, and date arithmetic. Fine-tuning still loses some of what the base model knows even at lr 5e-5.
- **Held-out rule reasoning** (unseen compositions of policy conditions) is 0.62–0.73 both-siblings-correct depending on the seed; Jev is 0.86. The predeclared release screen (≥ 0.70 on every seed) is not yet met; the deciding family is day-precision date arithmetic.
- **Calibration is in-distribution.** Temperature fitted in-domain does not transfer; out-of-domain probabilities are usable but not calibrated (ECE ~0.1).
- **Product-shaped questions** with no training analogue are not guaranteed; the low-drift 4B/8B recipes carry fewer task priors than the 0.6B and can answer differently on the same input. Measure on your own data.
- **Context.** Trained at 384 state / 1,024 branch tokens; serving caps at 8,192. Jev allows ~32k per branch.
- **Serving.** One request at a time, no cross-request KV cache, dense per-sample mask. 8B needs bf16 (`KEV_DTYPE=bf16`) on a 32 GB Mac.
- **Score confidence** uses a stand-in formula. TypeSafe has not published theirs.

## Development

```bash
uv run python -m pytest tests/test_unit.py -q                                      # no weights, no server; runs in CI
KEV_BASE_URL=http://127.0.0.1:8009 uv run --extra serve python -m pytest tests/test_api.py -q   # against a running server
cd playground && npm run lint && npx tsc --noEmit -p .
```

`tests/test_api.py` runs the TypeSafe docs' example requests and the official SDK against the local server.


Troubleshooting

- **`MPS backend out of memory` while training.** Do not enable `output_hidden_states`; read `last_hidden_state` from the bare backbone. Do not add tokens with peft `trainable_token_indices`. Lower `--n_per_source` on small machines.
- **Playground shows `connecting…` and buttons do nothing.** Next.js 16 dev only trusts the hostname it started with. Use `localhost:3001` or add your host to `allowedDevOrigins` in `next.config.ts`. Nothing is logged; verify hydration with a browser, not `curl`.
- **`Dataset scripts are no longer supported`.** Use `legacy-datasets/banking77`; already wired in `data.py`.


## Authors

- Jared Palmer (@jaredpalmer)

Built with [Devin](https://devin.ai). Architecture claims from [Archer Hume](https://archerhume.com/posts/jevs-architecture-unmasked). API contract from [TypeSafe](https://docs.typesafe.ai/api). Backbone: [Qwen2.5-0.5B](https://huggingface.co/Qwen/Qwen2.5-0.5B). Related work: [Hydragen](https://arxiv.org/abs/2402.05099), [DeFT](https://arxiv.org/abs/2404.00242), [FIRST](https://arxiv.org/abs/2406.15657).

## License

Apache-2.0. The base model is distributed under the Qwen license. Datasets carry their own licenses; see the model card.
