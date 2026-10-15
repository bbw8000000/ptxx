---
title: "ollama/ollama"
owner: "ollama"
name: "ollama"
fullName: "ollama/ollama"
description: "Get up and running with Kimi-K2.6, GLM-5.2, MiniMax, DeepSeek, gpt-oss, Qwen, Gemma and other models."
sourceUrl: "https://github.com/ollama/ollama"
stars: 178503
forks: 17399
language: "Go"
topics: ["deepseek", "gemma", "gemma3", "glm", "go", "golang", "gpt-oss", "llama"]
license: "MIT"
homepage: "https://ollama.com"
defaultBranch: "main"
snapshotDate: "2026-08-14"
pushedAt: "2026-08-13T22:38:02Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Ollama

Start building with open models.

## Download

### macOS

```shell
curl -fsSL https://ollama.com/install.sh | sh
```

or [download manually](https://ollama.com/download/Ollama.dmg)

### Windows

```shell
irm https://ollama.com/install.ps1 | iex
```

or [download manually](https://ollama.com/download/OllamaSetup.exe)

### Linux

```shell
curl -fsSL https://ollama.com/install.sh | sh
```

[Manual install instructions](https://docs.ollama.com/linux#manual-install)

### Docker

The official [Ollama Docker image](https://hub.docker.com/r/ollama/ollama) `ollama/ollama` is available on Docker Hub.

### Libraries

- ollama-python
- ollama-js

### Community

- [Discord](https://discord.gg/ollama)
- [𝕏 (Twitter)](https://x.com/ollama)
- [Reddit](https://reddit.com/r/ollama)

## Get started

```
ollama
```

You'll be prompted to run a model or connect Ollama to your existing agents or applications such as `Claude Code`, `OpenClaw`, `OpenCode` , `Codex`, `Copilot`,  and more.

### Coding

To launch a specific integration:

```
ollama launch claude
```

Supported integrations include [Claude Code](https://docs.ollama.com/integrations/claude-code), [Codex](https://docs.ollama.com/integrations/codex), [Copilot CLI](https://docs.ollama.com/integrations/copilot-cli), [DeepSeek Harness](https://docs.ollama.com/integrations/deepseek-harness), [Droid](https://docs.ollama.com/integrations/droid), and [OpenCode](https://docs.ollama.com/integrations/opencode).

### AI assistant

Use [OpenClaw](https://docs.ollama.com/integrations/openclaw) to turn Ollama into a personal AI assistant across WhatsApp, Telegram, Slack, Discord, and more:

```
ollama launch openclaw
```

### Chat with a model

Run and chat with [Gemma 4](https://ollama.com/library/gemma4):

```
ollama run gemma4
```

See [ollama.com/library](https://ollama.com/library) for the full list.

See the [quickstart guide](https://docs.ollama.com/quickstart) for more details.

## REST API

Ollama has a REST API for running and managing models.

```
curl http://localhost:11434/api/chat -d '{
  "model": "gemma4",
  "messages": [{
    "role": "user",
    "content": "Why is the sky blue?"
  }],
  "stream": false
}'
```

See the [API documentation](https://docs.ollama.com/api) for all endpoints.

### Python

```
pip install ollama
```

```python
from ollama import chat

response = chat(model='gemma4', messages=[
  {
    'role': 'user',
    'content': 'Why is the sky blue?',
  },
])
print(response.message.content)
```

### JavaScript

```
npm i ollama
```

```javascript
import ollama from "ollama";

const response = await ollama.chat({
  model: "gemma4",
  messages: [{ role: "user", content: "Why is the sky blue?" }],
});
console.log(response.message.content);
```

## Supported backends

- llama.cpp project founded by Georgi Gerganov.

## Documentation

- [CLI reference](https://docs.ollama.com/cli)
- [REST API reference](https://docs.ollama.com/api)
- [Importing models](https://docs.ollama.com/import)
- [Modelfile reference](https://docs.ollama.com/modelfile)
- Building from source

## Community Integrations

> Want to add your project? Open a pull request.

### Chat Interfaces

#### Web

- Open WebUI - Extensible, self-hosted AI interface
- Onyx - Connected AI workspace
- LibreChat - Enhanced ChatGPT clone with multi-provider support
- Lobe Chat - Modern chat framework with plugin ecosystem ([docs](https://lobehub.com/docs/self-hosting/examples/ollama))
- NextChat - Cross-platform ChatGPT UI ([docs](https://docs.nextchat.dev/models/ollama))
- Perplexica - AI-powered search engine, open-source Perplexity alternative
- big-AGI - AI suite for professionals
- Lollms WebUI - Multi-model web interface
- ChatOllama - Chatbot with knowledge bases
- Bionic GPT - On-premise AI platform
- Chatbot UI - ChatGPT-style web interface
- Hollama - Minimal web interface
- Chatbox - Desktop and web AI client
- chat - Chat web app for teams
- Ollama RAG Chatbot - Chat with multiple PDFs using RAG
- Tkinter-based client - Python desktop client

#### Desktop

- Dify.AI - LLM app development platform
- AnythingLLM - All-in-one AI app for Mac, Windows, and Linux
- Maid - Cross-platform mobile and desktop client
- Witsy - AI desktop app for Mac, Windows, and Linux
- Cherry Studio - Multi-provider desktop client
- Ollama App - Multi-platform client for desktop and mobile
- PyGPT - AI desktop assistant for Linux, Windows, and Mac
- Alpaca - GTK4 client for Linux and macOS
- SwiftChat - Cross-platform including iOS, Android, and Apple Vision Pro
- Enchanted - Native macOS and iOS client
- RWKV-Runner - Multi-model desktop runner
- Ollama Grid Search - Evaluate and compare models
- macai - macOS client for Ollama and ChatGPT
- AI Studio - Multi-provider desktop IDE
- Reins - Parameter tuning and reasoning model support
- ConfiChat - Privacy-focused with optional encryption
- LLocal.in - Electron desktop client
- [MindMac](https://mindmac.app) - AI chat client for Mac
- [Msty](https://msty.app) - Multi-model desktop client
- [BoltAI for Mac](https://boltai.com) - AI chat client for Mac
- [IntelliBar](https://intellibar.app/) - AI-powered assistant for macOS
- [Kerlig AI](https://www.kerlig.com/) - AI writing assistant for macOS
- [Hillnote](https://hillnote.com) - Markdown-first AI workspace
- [Perfect Memory AI](https://www.perfectmemory.ai/) - Productivity AI personalized by screen and meeting history

#### Mobile

- Ollama Android Chat - One-click Ollama on Android

> SwiftChat, Enchanted, Maid, Ollama App, Reins, and ConfiChat listed above also support mobile platforms.

### Code Editors & Development

- Cline - VS Code extension for multi-file/whole-repo coding
- Continue - Open-source AI code assistant for any IDE
- Void - Open source AI code editor, Cursor alternative
- Copilot for Obsidian - AI assistant for Obsidian
- twinny - Copilot and Copilot chat alternative
- gptel Emacs client - LLM client for Emacs
- Ollama Copilot - Use Ollama as GitHub Copilot
- Obsidian Local GPT - Local AI for Obsidian
- Ellama Emacs client - LLM tool for Emacs
- orbiton - Config-free text editor with Ollama tab completion
- AI ST Completion - Sublime Text 4 AI assistant
- VT Code - Rust-based terminal coding agent with Tree-sitter
- QodeAssist - AI coding assistant for Qt Creator
- [AI Toolkit for VS Code](https://aka.ms/ai-tooklit/ollama-docs) - Microsoft-official VS Code extension
- [Open Interpreter](https://docs.openinterpreter.com/language-model-setup/local-models/ollama) - Natural language interface for computers

### Libraries & SDKs

- LiteLLM - Unified API for 100+ LLM providers
- Semantic Kernel - Microsoft AI orchestration SDK
- LangChain4j - Java LangChain (example)
- LangChainGo - Go LangChain (example)
- Spring AI - Spring framework AI support ([docs](https://docs.spring.io/spring-ai/reference/api/chat/ollama-chat.html))
- [LangChain](https://python.langchain.com/docs/integrations/chat/ollama/) and [LangChain.js](https://js.langchain.com/docs/integrations/chat/ollama/) with [example](https://js.langchain.com/docs/tutorials/local_rag/)
- Ollama for Ruby - Ruby LLM library
- any-llm - Unified LLM interface by Mozilla
- OllamaSharp for .NET - .NET SDK
- LangChainRust - Rust LangChain (example)
- Agents-Flex for Java - Java agent framework (example)
- Elixir LangChain - Elixir LangChain
- Ollama-rs for Rust - Rust SDK
- LangChain for .NET - .NET LangChain (example)
- chromem-go - Go vector database with Ollama embeddings (example)
- LangChainDart - Dart LangChain
- LlmTornado - Unified C# interface for multiple inference APIs
- Ollama4j for Java - Java SDK
- Ollama for Laravel - Laravel integration
- Ollama for Swift - Swift SDK
- [LlamaIndex](https://docs.llamaindex.ai/en/stable/examples/llm/ollama/) and [LlamaIndexTS](https://ts.llamaindex.ai/modules/llms/available_llms/ollama) - Data framework for LLM apps
- Haystack - AI pipeline framework
- [Firebase Genkit](https://firebase.google.com/docs/genkit/plugins/ollama) - Google AI framework
- Ollama-hpp for C++ - C++ SDK
- PromptingTools.jl - Julia LLM toolkit ([example](https://svilupp.github.io/PromptingTools.jl/dev/examples/working_with_ollama))
- Ollama for R - rollama - R SDK
- [Portkey](https://portkey.ai/docs/welcome/integration-guides/ollama) - AI gateway
- [Testcontainers](https://testcontainers.com/modules/ollama/) - Container-based testing
- LLPhant - PHP AI framework

### Frameworks & Agents

- AutoGPT - Autonomous AI agent platform
- crewAI - Multi-agent orchestration framework
- Strands Agents - Model-driven agent building by AWS
- Cheshire Cat - AI assistant framework
- any-agent - Unified agent framework interface by Mozilla
- Stakpak - Open source DevOps agent
- Hexabot - Conversational AI builder
- Neuro SAN - Multi-agent orchestration (docs)

### RAG & Knowledge Bases

- RAGFlow - RAG engine based on deep document understanding
- R2R - Open-source RAG engine
- MaxKB - Ready-to-use RAG chatbot
- Minima - On-premises or fully local RAG
- Chipper - AI interface with Haystack RAG
- ARGO - RAG and deep research on Mac/Windows/Linux
- Archyve - RAG-enabling document library
- [Casibase](https://casibase.org) - AI knowledge base with RAG and SSO
- [BrainSoup](https://www.nurgo-software.com/products/brainsoup) - Native client with RAG and multi-agent automation

### Bots & Messaging

- LangBot - Multi-platform messaging bots with agents and RAG
- AstrBot - Multi-platform chatbot with RAG and plugins
- Discord-Ollama Chat Bot - TypeScript Discord bot
- Ollama Telegram Bot - Telegram bot
- LLM Telegram Bot - Telegram bot for roleplay

### Terminal & CLI

- aichat - All-in-one LLM CLI with Shell Assistant, RAG, and AI tools
- oterm - Terminal client for Ollama
- gollama - Go-based model manager for Ollama
- tlm - Local shell copilot
- tenere - TUI for LLMs
- ParLlama - TUI for Ollama
- llm-ollama - Plugin for [Datasette's LLM CLI](https://llm.datasette.io/en/stable/)
- ShellOracle - Shell command suggestions
- LLM-X - Progressive web app for LLMs
- cmdh - Natural language to shell commands
- VT - Minimal multimodal AI chat app

### Productivity & Apps

- AppFlowy - AI collaborative workspace, self-hostable Notion alternative
- Screenpipe - 24/7 screen and mic recording with AI-powered search
- Vibe - Transcribe and analyze meetings
- Page Assist - Chrome extension for AI-powered browsing
- NativeMind - Private, on-device browser AI assistant
- Ollama Fortress - Security proxy for Ollama
- 1Panel - Web-based Linux server management
- Writeopia - Text editor with Ollama integration
- QA-Pilot - GitHub code repository understanding
- Raycast extension - Ollama in Raycast
- Painting Droid - Painting app with AI integrations
- Serene Pub - AI roleplaying app
- [Mayan EDMS](https://gitlab.com/mayan-edms/mayan-edms) - Document management with Ollama workflows
- [TagSpaces](https://www.tagspaces.org) - File management with [AI tagging](https://docs.tagspaces.org/ai/)

### Observability & Monitoring

- [Opik](https://www.comet.com/docs/opik/cookbook/ollama) - Debug, evaluate, and monitor LLM applications
- OpenLIT - OpenTelemetry-native monitoring for Ollama and GPUs
- [Lunary](https://lunary.ai/docs/integrations/ollama) - LLM observability with analytics and PII masking
- [Langfuse](https://langfuse.com/docs/integrations/ollama) - Open source LLM observability
- [HoneyHive](https://docs.honeyhive.ai/integrations/ollama) - AI observability and evaluation for agents
- [MLflow Tracing](https://mlflow.org/docs/latest/llms/tracing/index.html#automatic-tracing) - Open source LLM observability

### Database & Embeddings

- pgai - PostgreSQL as a vector database (guide)
- MindsDB - Connect Ollama with 200+ data platforms
- chromem-go - Embeddable vector database for Go (example)
- Kangaroo - AI-powered SQL client

### Infrastructure & Deployment

#### Cloud

- [Google Cloud](https://cloud.google.com/run/docs/tutorials/gpu-gemma2-with-ollama)
- [Fly.io](https://fly.io/docs/python/do-more/add-ollama/)
- [Koyeb](https://www.koyeb.com/deploy/ollama)
- Harbor - Containerized LLM toolkit with Ollama as default backend

#### Package Managers

- [Pacman](https://archlinux.org/packages/extra/x86_64/ollama/)
- [Homebrew](https://formulae.brew.sh/formula/ollama)
- [Nix package](https://search.nixos.org/packages?show=ollama&from=0&size=50&sort=relevance&type=packages&query=ollama)
- [Helm Chart](https://artifacthub.io/packages/helm/ollama-helm/ollama)
- Gentoo
- [Flox](https://flox.dev/blog/ollama-part-one)
- [Guix channel](https://codeberg.org/tusharhero/ollama-guix)
