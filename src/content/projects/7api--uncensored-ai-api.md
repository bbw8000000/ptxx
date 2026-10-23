---
title: "7API/uncensored-ai-api"
owner: "7API"
name: "uncensored-ai-api"
fullName: "7API/uncensored-ai-api"
description: "Uncensored AI API and models — one key for Claude, GPT, Gemini, Grok, DeepSeek, GLM and Kimi, with uncensored and abliterated variants where available. OpenAI- and Anthropic-compatible. Pay per token."
sourceUrl: "https://github.com/7API/uncensored-ai-api"
stars: 128
forks: 34
language: "未知"
topics: ["abliterated-models", "ai-gateway", "anthropic-compatible", "claude-api", "claude-code", "deepseek-api", "gemini-api", "glm-api"]
license: "MIT"
homepage: "https://7api.st/?utm_source=github&utm_medium=repo&utm_campaign=uncensored-ai-api"
defaultBranch: "main"
snapshotDate: "2026-10-23"
pushedAt: "2026-10-22T16:32:01Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Uncensored AI API or Model — One Key. Every Frontier Model.

**Uncensored AI access for developers: choose an uncensored AI API or an uncensored AI model and run it through one OpenAI- and Anthropic-compatible endpoint — Claude, GPT, Gemini, Grok, DeepSeek, GLM and Kimi, with uncensored and abliterated variants where available.**


  
  


*图片：Models*
*图片：API*
*图片：Billing*
*图片：Crypto*
*图片：No subscription*

[**Get an API key →**](https://7api.st/?utm_source=github&utm_medium=readme&utm_campaign=uncensored-ai-api) · Quickstart · Docs · [Telegram bot](https://t.me/hqclaudebot?start=github2)


---

## What is an uncensored AI API?

An **uncensored AI API** is a single programmatic endpoint that gives your application access to model variants with fewer built-in refusals than standard hosted models. If you are searching for **uncensored AI**, an **uncensored AI model** or an **uncensored AI API**, the same gateway covers all three: the API is the connection, the model is the engine, and uncensored AI is the category. Instead of maintaining separate SDKs, keys and billing accounts for every provider, you send one request and choose the model family you need.

**7API** is an OpenAI- and Anthropic-compatible gateway for exactly that workflow. It bundles frontier and open-weight model families — plus uncensored and abliterated variants where available — behind one API key, one balance and one billing model: pay per token, no subscription.

You may also see the same idea called an **uncensored LLM API**, an **unfiltered AI API**, a **no-refusal AI API**, or an **abliterated model API**. The labels overlap; the practical questions are the same: model coverage, compatibility, billing and behavior.

> **Uncensored does not mean lawless.** Model behavior still depends on the model, version, prompt and provider policy. You stay responsible for lawful, ethical use. See Safety & responsible use.

## What is an uncensored AI model?

An **uncensored AI model** is a model variant trained, fine-tuned or weight-modified to refuse less often than a standard release. The model is the engine; the API is how your application reaches it, and a gateway gives you one key across families.

| | |
|---|---|
| **Uncensored AI model** | The model itself, with reduced refusal behavior. |
| **Uncensored AI API** | The endpoint that lets your app call that model. |
| **API gateway** | One key, one bill and one compatible interface across model families. |

Uncensored models still vary by version, prompt and provider policy. Evaluate the exact model before deploying. See Uncensored vs. abliterated models.

## ✨ What you get

| | |
|---|---|
| 🔑 **One key, every family** | Claude, GPT, Gemini, Grok, DeepSeek, GLM and Kimi from a single account. |
| 🔌 **Drop-in compatibility** | OpenAI SDK, Anthropic SDK, Claude Code, Cursor, Codex CLI, OpenCode and any compatible client. |
| 🧠 **Uncensored options** | Select uncensored and abliterated variants alongside the standard models. |
| 💳 **Pay per token** | No subscription. Prompt caching lowers repeated input; BTC, ETH, USDT and LTC accepted. |
| 🛡️ **Honest limits** | Reduced refusals, not a guarantee. Evaluate the model before you deploy. |

## 🧠 Model families

| Family | What people use it for | Uncensored variants |
|---|---|---|
| **Claude** | Long-form reasoning, writing, coding agents | Select variants |
| **GPT** | General assistants, tools, structured output | Select variants |
| **Gemini** | Multimodal workflows, research, long context | Select variants |
| **Grok** | Real-time style answers, ideation | Select variants |
| **DeepSeek** | Coding, reasoning, cost-efficient agents | Select variants |
| **GLM** | Agents, coding, bilingual work | Select variants |
| **Kimi** | Long-document reading, agent workflows | Select variants |

Model IDs, context limits and live availability are shown in the [7API dashboard](https://7api.st/?utm_source=github&utm_medium=readme&utm_campaign=uncensored-ai-api). Availability changes as providers release new versions — always confirm the current model ID before deploying.

## Quickstart

### 1. Get your key and base URL

Create an account at **[7api.st](https://7api.st/?utm_source=github&utm_medium=readme&utm_campaign=uncensored-ai-api)**. Your API key starts with `sk-`; the exact **Base URL** is shown on the dashboard overview.

```bash
export SEVEN_API_KEY="sk-..."
export SEVEN_API_BASE_URL="https://.../v1"   # copy from the dashboard
```

### 2. OpenAI-compatible request

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SEVEN_API_KEY"],
    base_url=os.environ["SEVEN_API_BASE_URL"],
)

response = client.chat.completions.create(
    model="MODEL_ID",  # choose any model ID from the dashboard
    messages=[
        {"role": "system", "content": "You are a precise, helpful assistant."},
        {"role": "user", "content": "Explain the trade-offs of model routing in two paragraphs."},
    ],
)

print(response.choices[0].message.content)
```

### 3. Anthropic-compatible request

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["SEVEN_API_KEY"],
    base_url=os.environ["SEVEN_API_BASE_URL"],  # use the Anthropic base URL from the dashboard
)

message = client.messages.create(
    model="MODEL_ID",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a concise release note for a developer tool."}],
)

print(message.content[0].text)
```

### 4. cURL

```bash
curl "$SEVEN_API_BASE_URL/chat/completions" \
  -H "Authorization: Bearer $SEVEN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "MODEL_ID",
    "messages": [{"role": "user", "content": "Hello from the 7API quickstart."}]
  }'
```

Full setup guides: OpenAI-compatible · Anthropic-compatible · cURL.

## Works with your stack

| Client / SDK | Setup |
|---|---|
| **OpenAI SDK** | Set `base_url` to the 7API base URL |
| **Anthropic SDK** | Set `base_url` to the Anthropic-compatible endpoint |
| **Claude Code** | Point the Anthropic base URL at 7API |
| **Cursor** | Add a custom OpenAI-compatible provider |
| **Codex CLI** | Use an OpenAI-compatible provider profile |
| **OpenCode** | Configure a custom provider and model ID |
| **LangChain / LlamaIndex** | Use the OpenAI-compatible adapter |
| **Any OpenAI-compatible app** | Change two values: base URL and API key |

Step-by-step guides: Claude Code · Cursor · OpenCode · Codex CLI.

## Pricing

- **Pay per token** — you are charged for the tokens you actually use.
- **No subscription** — no monthly minimum and no seat fees.
- **Prompt caching** — repeated prefixes are billed at the lower cached-input rate.
- **Crypto top-ups** — BTC, ETH, USDT and LTC.
- **Subkeys** — fund a teammate or client separately from your main balance.
- **Referrals** — earn 15% of every deposit your referrals make.

Live model prices are listed in the dashboard and can change when providers update their rates. See Pricing & limits.

## Use cases

- **AI safety and red-team research** — compare how model versions handle instruction conflicts and policy boundaries.
- **Creative writing and worldbuilding** — work with fewer mid-scene refusals while keeping your own review process.
- **Agentic coding** — route Claude, GPT, DeepSeek and GLM through one key in Claude Code, Cursor, Codex or OpenCode.
- **Multilingual assistants** — test the same prompt across model families without rebuilding your integration.
- **Privacy-conscious prototyping** — keep billing and keys centralized while you evaluate providers.
- **Developer tooling** — subkeys and one balance make it easier to meter usage per project or client.

## Honest limits

- **No provider can guarantee that a model will never refuse.** Uncensored and abliterated variants reduce refusal behavior; they do not remove the need for evaluation, guardrails or human review.
- **Model behavior is version-dependent.** A prompt that works on one release may behave differently after an upstream update.
- **Provider terms still apply.** You are responsible for complying with the terms of the model providers and the laws that apply to you.
- **Availability changes.** Model IDs and uncensored variants rotate as providers ship updates; check the dashboard before relying on a specific ID.

## FAQ

**What is an uncensored AI API?**

An uncensored AI API gives developers programmatic access to model variants with fewer refusal behaviors than standard hosted models. 7API exposes those variants next to mainstream model families through one OpenAI- and Anthropic-compatible endpoint. Read the full guide →

**What is an uncensored AI model?**

An uncensored AI model is a model variant with reduced refusal behavior. The model is the engine your app calls; the API is the connection. Read the full explanation.

**Is 7API an uncensored AI model provider?**

7API is an API gateway, not the owner of the models. It provides one key for Claude, GPT, Gemini, Grok, DeepSeek, GLM and Kimi, including uncensored and abliterated variants where available. The model behavior and terms belong to the underlying providers.

**Is 7API OpenAI-compatible?**

Yes. Any client that accepts a custom OpenAI `base_url` can use 7API. The Anthropic-compatible endpoint covers Claude Code and other Anthropic-style clients.

**Do I need a subscription?**

No. 7API is pay-per-token. You top up a balance and spend it across models; there is no monthly subscription.

**Can I pay with crypto?**

Yes — BTC, ETH, USDT and LTC are supported for top-ups.

**Are all models uncensored?**

No. Standard frontier models are available alongside select uncensored and abliterated variants. Check the model list in the dashboard for current availability.

**Can I use 7API with Claude Code or Cursor?**

Yes. Claude Code uses the Anthropic-compatible endpoint; Cursor uses an OpenAI-compatible provider. Setup steps are in the client guide.

**Will an uncensored model never refuse?**

No. Refusal behavior varies by model, version, prompt and provider policy. Treat uncensored variants as research and creative tools, not as a guarantee.

**Where can I compare model families?**

Start with the model catalog and the alternatives guide, then check live availability in the dashboard.

## Documentation

| Guide | What it covers |
|---|---|
| What is an uncensored AI API? | Definitions, architecture, who it is for |
| Uncensored vs abliterated models | How the terms differ and what to expect |
| Model catalog | Claude, GPT, Gemini, Grok, DeepSeek, GLM, Kimi |
| Quickstart | Key, base URL, first request in minutes |
| OpenAI-compatible API | SDK, streaming, tools, structured output |
| Anthropic-compatible API | Messages API, Claude Code, system prompts |
| Claude Code, Cursor, OpenCode, Codex | Client-by-client setup |
| Pricing & limits | Pay-per-token, caching, crypto, subkeys |
| Use cases | Research, writing, agents, multilingual apps |
| Safety & responsible use | Compliance, evaluation, guardrails |
| FAQ | Long-form answers to common questions |
| Glossary | API, LLM, abliteration, token, gateway |
| Troubleshooting | Auth, model IDs, streaming, rate limits |
| API reference | Request shapes and compatibility notes |
| Alternatives | How to compare AI API providers |

## Related

- **[7API](https://7api.st/?utm_source=github&utm_medium=readme&utm_campaign=uncensored-ai-api)** — one key, every frontier model.
- **AI Jailbreaks** — 35 paste-ready system prompts and agent specs for research.
- **[Telegram channel](https://t.me/seven_api)** — model updates, pricing changes and support.
- **[Telegram bot](https://t.me/hqclaudebot?start=github2)** — quick access from Telegram.

---


**Star this repository if it helped you evaluate uncensored AI APIs.**

7API is an independent API gateway. Model names and trademarks belong to their respective owners. Not affiliated with GitHub, OpenAI, Anthropic, Google, xAI, DeepSeek, Zhipu or Moonshot. Use responsibly and follow the terms that apply to you.
