---
title: "Alejandros17487/ai-jailbreaks"
owner: "Alejandros17487"
name: "ai-jailbreaks"
fullName: "Alejandros17487/ai-jailbreaks"
description: "AI jailbreaks: 35 paste-ready AI jailbreak prompts for 25+ frontier and open-weight models - system prompts, AGENTS.md specs, and Ollama Modelfiles. Built for AI security research and red-team testing."
sourceUrl: "https://github.com/Alejandros17487/ai-jailbreaks"
stars: 490
forks: 89
language: "未知"
topics: ["ai", "ai-safety", "jailbreak", "jailbreaking", "privacy", "safety", "security"]
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-10-24"
pushedAt: "2026-10-21T14:49:16Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# AI Jailbreaks

**AI jailbreaks — a curated collection of system prompts, persona locks, workspace policies, and agent operating specs for frontier, open-weight, and free stealth models. Every AI jailbreak here is a complete, paste-ready prompt.**

*图片：Prompts*
*图片：Targets*
*图片：PRs Welcome*
*图片：Stars*


---


  
  
  


**Jailbreaks not working? Try [7API](https://7api.st/?src=github)** — the cheapest API for frontier models at up to 99% off, including Uncensored and Abliterated models that never refuse.


---

## About

This repo holds **35 paste-ready prompts for 25+ models**: full system prompts, persona definitions, workspace policies, `AGENTS.md` files, config blocks, and Ollama Modelfiles. Every file is complete — no summaries, no excerpts.

What's inside:

- Free stealth models on OpenCode Zen
- Open-weight families: GLM, DeepSeek, Kimi, Qwen, Gemma, GPT-OSS
- Closed frontier models: Claude, Gemini, Grok, Mistral
- Coding-agent and workspace instruction formats
- Ollama Modelfiles and harness-specific configuration

New here? Skim the collection or jump to how to use.

> [!WARNING]
> **Research and educational use only.**
>
> This repo documents how persona framing, instruction hierarchies, prompt conflicts, and policy overrides shape model behavior — the same findings that help developers harden AI against prompt injection.
>
> Don't use this material to harm others, break the law, or violate a provider's terms of service.

## Collection

### OpenCode Zen — Free Stealth Models

| Model | File | Type |
|---|---|---|
| **Big Pickle** | bigpickle-opencode.md | VANTA persona lock with explicit operating floor |
| **Space Bunny** | spacebunny-agents.md | Assistant operating specification |
| **LongCat 2.5** | longcat-agents.md | Assistant operating specification |
| **MiMo V2.6** | mimo-2.6-agents.md | Assistant operating specification |
| **Step 5 Preview** | step-5-preview.md | Workspace operating profile |
| **Muse Spark 1.3** | muse-spark-1.3.md | Agent deployment operating policy |
| **Muse Spark 1.3 v2** | muse-spark-1.3-v2.md | Runtime scope-note variant |
| **Muse.ai** | muse-ai-agents.md | Assistant operating specification |

### Anthropic — Claude

| Model | File | Type |
|---|---|---|
| **Opus** | opus-v1.md · opus-v2.md | Conversational groundwork persona, v1 / v2 |
| **Sonnet** | sonnet-v1.md · sonnet-v2.md | Writer's-room framing, v1 / v2 |

### Zhipu — GLM / ZCode

| Model | File | Type |
|---|---|---|
| **GLM-5.2** | glm-5.2.md | System prompt |
| **GLM ZCode 5.2** | glm-zcode-5.2.md | System prompt |
| **GLM ZCode 5.3** | glm-zcode-5.3.md · glm-zcode-5.3-agents.md | System prompt + `AGENTS.md` drop-in |
| **GLM-5.3 Flash** | glm-5-3-flash.md | Assistant operating specification |
| **GLM-5.3 (OpenCode)** | glm5-3-opencode.md | Assistant operating specification |

### DeepSeek

| Model | File | Type |
|---|---|---|
| **DeepSeek V3** | deepseek-v3.md | System prompt |
| **DeepSeek V4** | deepseek-v4.md | System prompt |
| **DeepSeek 4.1** | deepseek-4-1.md | Assistant operating specification |

### Moonshot — Kimi

| Model | File | Type |
|---|---|---|
| **Kimi K2** | kimi-k2.md | System prompt |
| **Kimi K3** | kimi-k3-agents.md | Workspace operating profile |

### xAI — Grok

| Model | File | Type |
|---|---|---|
| **Grok Build** | grok-build.md | Agent operating instructions |
| **Grok 4.7** | grok-4.7.md | App-builder workspace guide |
| **Grok Config** | grok-config.txt | `` priority and routing configuration |

### Google / Mistral / Alibaba

| Model | File | Type |
|---|---|---|
| **Gemini 4 Argon** | gemini-4-argon.md | Operating policy |
| **Mistral Large 4** | mistral-large-4.md | Agent system prompt |
| **Qwen 3.7** | qwen-3.7.md | System prompt |

### Ollama Modelfiles

| Model | File | Type |
|---|---|---|
| **Gemma 4** | gemma4.md | `FROM` + `SYSTEM` block |
| **GPT-OSS 20B** | gpt-oss-20b.md | `FROM` + `SYSTEM` block |

### Unfiled Files

A few newer additions aren't indexed under a specific model yet:

- beam.md
- muse-wonder.md
- qwen-preferences.md
- unified.md

## How to Use

### System Prompts

Paste the file's contents into whatever system-prompt or custom-instructions field your client or API offers — an API `system` message, a chatbot's custom instructions, an agent instruction block, or harness-level prompt configuration.

### AGENTS.md Files

Save the file as `AGENTS.md` in the root of your repository or workspace. Coding agents and compatible tools pick it up as project-level instructions.

### Workspace Policies

Files marked as an **assistant operating specification** or **workspace operating profile** belong in environments with persistent global instructions. An OpenCode install, for example, reads:

```text
~/.config/opencode/AGENTS.md
```

The exact location depends on your client or harness.

### Ollama Modelfiles

Feed the file straight to Ollama:

```bash
ollama create gemma4-jb -f gemma4.md
```

Swap the model name and source file as needed.

### Grok Configuration

Grok-config.txt is meant for the config field of the target harness — not the regular conversation.

> [!NOTE]
> Prompt behavior is version-dependent. Models get updated, instruction hierarchies shift, and system prompts rotate — what works on one release may fail on the next. If a file looks outdated, open an issue or send an updated version.

## Contributing

Pull requests are welcome. Follow these conventions:

1. **One prompt per file**, named lowercase with hyphens and no spaces:
   ```text
   model-name.md
   ```
2. **Include the full prompt** — paste-ready, not a summary or excerpt.
3. **Say where it goes** — system prompt, `AGENTS.md`, Modelfile, config slot, or another instruction surface.
4. **Version your changes** — a significant revision gets a new file, not a silent overwrite:
   ```text
   opus-v3.md
   ```
5. **Keep claims honest** — don't advertise compatibility you haven't tested.

Found something that no longer behaves as documented? An issue with the model, version, and affected file is already a big help.

## Disclaimer

Everything here is **for research and education**. The repo documents prompt-level instruction behavior, instruction conflicts, persona framing, model configuration, and related LLM security concepts — material that can also help developers defend against prompt injection.

The maintainers don't endorse unlawful, abusive, or harmful use. Model providers may restrict some of these prompts under their terms of service, and it's on you to know and follow the rules that apply to the systems you use.

---


**Star the repo if it saved you a session of prompt archaeology.**

*Issue reports and pull requests keep the collection current as models change.*
