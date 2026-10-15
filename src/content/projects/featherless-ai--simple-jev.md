---
title: "featherless-ai/simple-jev"
owner: "featherless-ai"
name: "simple-jev"
fullName: "featherless-ai/simple-jev"
description: "Turn any open model into a classifier/jev endpoint"
sourceUrl: "https://github.com/featherless-ai/simple-jev"
stars: 308
forks: 32
language: "Python"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-20"
pushedAt: "2026-09-18T19:47:32Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

*图片：Simple Jev Mascot and Logo*

# Simple Jev Project

Use compatible open models from huggingface, for structured classification and scoring, without training a separate classifier head.

Explore the demos, playground, and documentation at [simple-jev.featherless.ai](https://simple-jev.featherless.ai/).

Send shared context and a set of questions. Simple Jev reads the model's next-token logits for each question and builds a JSON response containing choices, rubric scores, or truth/support judgments. The model does not generate a JSON completion: the server constructs the response from the scores.

The current implementation runs locally with Hugging Face Transformers and PyTorch. Shared request validation, versioned prompt instructions, and response scoring live in the plain Python `common/` folder so other inference implementations can use the same rules.

## Try it today

Try the [public demo API](https://simple-jev-demo-api.featherless.ai/v1/) with **no login, API key, or authentication required**. The demo has a **2k-token context limit** and is **rate limited to 2 requests per second (2 RPS)**.

First, list the available models with `GET /v1/models`:

```bash
curl https://simple-jev-demo-api.featherless.ai/v1/models
```

The demo already serves Gemma as `featherless-ai/gemma-4-26B-A4B-classifier`. Try it directly with `POST /v1/classifier`, or use another model ID returned by the list:

```bash
curl https://simple-jev-demo-api.featherless.ai/v1/classifier \
  -H 'Content-Type: application/json' \
  --data-binary @- <<'JSON'
{
  "model": "featherless-ai/gemma-4-26B-A4B-classifier",
  "state": "Mia owns a red bicycle.",
  "questions": {
    "color": {
      "type": "choice",
      "instructions": "What color is Mia's bicycle?",
      "criteria": {"red": null, "blue": null}
    }
  }
}
JSON
```

For production deployments, [Featherless paid plans](https://featherless.ai/) offer higher limits. To run the server yourself, follow the setup below.

## Running the HF Server

Use Python 3.12 or newer. The commands below use Python 3.13.

```bash
# Clone the repository and create an environment.
git clone https://github.com/featherless-ai/simple-jev.git
cd simple-jev
python3.13 -m venv .venv
source .venv/bin/activate

# Install the server, including the shared common modules.
python -m pip install -e './hf-server'

# Start with a small model on CPU.
python hf-server/hf_server.py \
  --model Qwen/Qwen3.5-0.8B \
  --device cpu --dtype float32 \
  --max-model-len 4096 \
  --max-batch-size 4 --max-batch-tokens 4096

# Alternatively, run Gemma 4 MoE on an NVIDIA GPU with BF16 support.
# Stop the CPU server first, or choose a different --port.
python hf-server/hf_server.py \
  --model google/gemma-4-26B-A4B-it \
  --device cuda --dtype bfloat16 \
  --max-model-len 8192 \
  --max-batch-size 4 --max-batch-tokens 8192
```

The first run downloads the model unless it is already cached. A local model directory can also be passed to `--model`. For CUDA or ROCm, install the appropriate PyTorch build for your hardware before installing the server.

The GPU example uses [Gemma 4 26B-A4B Instruct](https://huggingface.co/google/gemma-4-26B-A4B-it). Allow memory for the full model weights, KV cache, and inference buffers; sparse expert activation does not mean only the active experts occupy memory. Use `--device auto` to let Transformers place weights across available devices. This is a launch example, not a verified full-size Gemma benchmark.

The server listens on `http://127.0.0.1:8000`. Once the model is loaded:

```bash
curl http://127.0.0.1:8000/health
```

Open `http://127.0.0.1:8000/docs` for the interactive API documentation. After installation, `simple-jev` and `python -m hf_server` accept the same arguments as the script.

## How do I use the API?

Send a non-streaming `POST /v1/classifier` request. The `model` value must exactly match the ID or path used to start the server. The examples below use Qwen; if you started Gemma, use `google/gemma-4-26B-A4B-it` instead. Supply exactly one of:

- `state`: a string, JSON object, or JSON array containing the shared context.
- `messages`: text chat history, rendered using the model's own chat template.

The API takes inspiration from TypeSafe's structured-decision interface and includes project-specific behavior. `/v1/systemone` is an alias of `/v1/classifier`; both run the same implementation. Use this repository's API reference as the contract for clients.

```bash
curl http://127.0.0.1:8000/v1/classifier \
  -H 'Content-Type: application/json' \
  --data-binary @- <<'JSON'
{
  "model": "Qwen/Qwen3.5-0.8B",
  "state": "Mia owns a red bicycle. Her dog is named Max.",
  "questions": {
    "color": {
      "type": "choice",
      "instructions": "What color is Mia's bicycle?",
      "criteria": {"red": null, "blue": null}
    },
    "support": {
      "type": "score",
      "instructions": "How well does the context support that Mia owns a bicycle?",
      "criteria": ["Unsupported", "Partially supported", "Fully supported"]
    },
    "dog": {
      "type": "noul",
      "instructions": "Is Mia's dog named Max?"
    }
  }
}
JSON
```

Question IDs become keys in `answers`. The following response illustrates the shape; the numbers are examples, not promised model outputs:

```json
{
  "model": "Qwen/Qwen3.5-0.8B",
  "answers": {
    "color": {
      "type": "choice",
      "choice": "red",
      "confidence": 0.95,
      "probabilities": {"red": 0.95, "blue": 0.05}
    },
    "support": {
      "type": "score",
      "score": 1.75,
      "confidence": 0.8,
      "probabilities": {"0": 0.05, "1": 0.15, "2": 0.8},
      "legend": {"0": "Unsupported", "1": "Partially supported", "2": "Fully supported"}
    },
    "dog": {"type": "noul", "noul": 0.9}
  },
  "usage": {"input_tokens": 600, "output_tokens": 0}
}
```

| Question type | Input criteria | Result |
| --- | --- | --- |
| `choice` | Object with 2–50 candidate IDs and optional descriptions | Highest-probability candidate, its confidence, and the candidate distribution. |
| `score` | Array of 2–50 rubric levels, lowest to highest | Expected zero-based rubric index, confidence, distribution, and rubric legend. A three-level rubric returns a value from 0 to 2, including fractional values. |
| `noul` | Optional `true` and/or `false` descriptions | Truth/support judgment from 0.01 to 0.99, derived from the model's distribution over nine rating tokens. |

Choice and score confidence is the largest probability among their allowed labels. These distributions, and the Noul value, are not calibrated probabilities of correctness.

For chat input, send `messages` instead of `state`. This complete example classifies a customer message and provides explicit descriptions for the possible answers:

```bash
curl http://127.0.0.1:8000/v1/classifier \
  -H 'Content-Type: application/json' \
  --data-binary @- <<'JSON'
{
  "model": "Qwen/Qwen3.5-0.8B",
  "messages": [
    {"role": "user", "content": "I was charged twice for my subscription. Please refund the duplicate charge."}
  ],
  "questions": {
    "route": {
      "type": "choice",
      "instructions": "Which team should handle this message?",
      "criteria": {
        "billing": "Payments, invoices, and refunds",
        "technical": "Errors and problems using the product"
      }
    },
    "refund_requested": {
      "type": "noul",
      "instructions": "Does the customer explicitly request a refund?",
      "criteria": {
        "true": "The customer asks for money back.",
        "false": "The customer makes no refund request."
      }
    }
  }
}
JSON
```

Unknown top-level request fields are ignored, including completion settings such as `temperature`, `max_tokens`, and `stream`. Unknown fields inside questions and options are rejected. There is no completion sampling or streaming. The HF server currently supports text only; images, audio, video, and tool calls are unsupported.

`usage.input_tokens` counts unique token prefixes within the request, sharing the common context across questions. `usage.output_tokens` is zero because no output tokens are generated. For diagnostic timings, start the server with `ENABLE_OPEN_JEV_ADVANCED_METRICS=1`; adding `"options": {"raw_logits": true}` to a request then includes selected-token logits.

## What is a classifier, and why “System One”?

A classifier maps input to a defined set of answers. For example, a support system might route a message to `billing` or `technical`, score its urgency against an ordered rubric, and judge whether it requests a refund. Those decisions can feed directly into ordinary application code.

TypeSafe uses “System One” to describe models designed for fast, structured decisions, drawing the name from the distinction between fast intuitive thinking and slower deliberate reasoning. Its [introduction to System One and Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) explains that motivation. Simple Jev explores this style of interface using existing open language models. It does not reproduce TypeSafe's model architecture or training, or establish equivalent accuracy, calibration, or speed.

In this implementation, the useful change is how the model is used:

1. The shared prompt builder creates consistent classifier instructions and one scoring branch per question.
2. The HF server renders those instructions and the context into the model's native chat format.
3. It evaluates the exact common token prefix once and reuses that prefix's KV cache across batches of question suffixes.
4. It reads the next-token logits for the allowed answer labels. Shared scoring code normalizes those scores and constructs the JSON response.

This avoids generating and parsing a prose or JSON answer token by token. Reusing the context can also reduce repeated computation when several questions refer to the same input. Actual latency depends on the model, hardware, context length, and number of questions. Cache reuse currently lasts only for a single request.

A valid response structure does not guarantee a correct decision. Model capability and question wording still matter; evaluate answer quality on your own task separately from validating the server's inference and response pipeline.

## How shared prompts and prefill-only scoring reduce work

A normal text-generation request has a **prefill** step that processes the input, followed by **decode** steps that generate tokens one at a time. Prefill already produces logits for the next token. Simple Jev uses those logits directly to score predefined answer labels, so it needs no autoregressive decode loop.

For several questions about the same context, most of the prompt is identical. After applying the model's chat template and tokenizing each question's prompt, the server finds their exact common token prefix:

```text
Shared instructions + context + shared question briefing
                           │
                     Prefill once
                     Save KV cache
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
  Color question    Support question    Dog question
         │                 │                 │
    Label logits      Label logits      Label logits
         └─────────────────┼─────────────────┘
                           ▼
                JSON built by the server
```

The KV cache stores the model's attention state for the shared prefix. Each question continues from a copy of that cache with its own suffix and answer prefix. The server batches these suffixes, reads the logits at each row's last real token, and passes the selected label scores to the shared response scorer. Questions do not consume one another's answers.

For example, suppose four question prompts each contain a 1,000-token common prefix and a 50-token suffix:

| Execution | Prompt tokens processed, excluding padding |
| --- | --- |
| Evaluate each complete prompt separately | `4 × (1,000 + 50) = 4,200` |
| Reuse the shared prefix | `1,000 + 4 × 50 = 1,200` |

If all four suffixes fit in one batch, the shared execution takes one prefix forward pass and one batched suffix forward pass. These token counts illustrate avoided repeated input processing, not a measured latency ratio: each suffix still attends to the cached prefix, and copying caches, padding, and model execution have costs.

`--max-batch-size` limits questions per suffix batch; `--max-batch-tokens` limits the number of padded suffix tokens in that batch. Neither limits total model/cache memory or chunks the shared prefix. The current server reuses caches within a request and processes model requests serially. See the HF execution guide for details.

## Shared prompt contract and project layout

| Location | Purpose |
| --- | --- |
| `common/` | Plain Python modules for `ClassifierRequest`, prompt planning, and response scoring. No separate package installation is required. |
| `common/PROMPT_STRUCTURE_V1.md` | Language-independent v1 specification: inputs, prompt strings, chat roles, answer labels, and scoring rules. |
| `hf-server/hf_server.py` | Single-file Transformers implementation: chat rendering, model loading, cached inference, HTTP API, and CLI. |
| `hf-server/API_REFERENCE.md` | Detailed request/response contract, validation, diagnostics, and configuration. |
| `RFDT/` | Task-specific decision training: prepare labels, distill teacher estimates, train on answer-token logits, and export a student. |

`prepare_prompt(request, version="v1")` returns a cacheable system prompt prefix, prefix instruction, suffix instruction, and ordered questions. The inference implementation handles chat formatting and model execution; `common/response_scoring.py` converts label logits or mapped PyTorch tensors into answers.

The version fixes one prompt/scoring configuration so implementations can stay consistent, including implementations in other languages. It defaults to `v1`; the HTTP API currently uses that version. There are no per-request independent/rating modes or score-format switches.

## Testing

From the repository root, with the environment activated:

```bash
python -m pip install -e './hf-server[test]'
python -m pytest -c hf-server/pyproject.toml common/tests hf-server/tests -q
```

The tests cover request validation, prompt construction, response scoring, tensor/token mapping, HTTP behavior, and cached-versus-full inference using tiny locally initialized models. They do not require downloading pretrained model weights and do not measure classification accuracy.

Models need a supported Transformers implementation, a usable chat template, compatible cache operations, and answer labels that each extend the rendered prompt by exactly one distinct token. The server checks label tokenization; compatibility with every open model is not guaranteed.

## One more thing: Really Fancy Decision Training (RFDT)

Want a smaller model that is better at your specific use case? **RFDT** lets you fine-tune a model on the decisions your application needs. Provide context or chat history, questions, and answers—or let a larger teacher model supply the missing answers.

RFDT trains directly on the allowed answer-token logits using the same prompt structure as Simple Jev inference. The scripts support dataset preparation, teacher labeling, multi-GPU training, LoRA adapters, evaluation, and export to the HF server. See the RFDT guide and examples to get started on your own hardware.

As we scale up support and usage of Simple Jev models on [Featherless](https://featherless.ai/), we will roll out support for serving fine-tuned models and running fine-tuning on the platform. The RFDT scripts are available in this repository today; hosted fine-tuned model support and fine-tuning are part of that upcoming rollout.
