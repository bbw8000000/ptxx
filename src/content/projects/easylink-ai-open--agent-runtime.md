---
title: "easylink-ai-open/agent-runtime"
owner: "easylink-ai-open"
name: "agent-runtime"
fullName: "easylink-ai-open/agent-runtime"
description: "Standalone agent runtime core with neutral LLM types, provider clients, tool loop, and extension protocols."
sourceUrl: "https://github.com/easylink-ai-open/agent-runtime"
stars: 290
forks: 51
language: "Python"
topics: []
license: "Apache-2.0"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-07-23T05:23:29Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# agent-runtime

A standalone agent runtime core. The runtime owns the agent loop, neutral LLM
types, provider HTTP clients selected by `LLMConfig`, standard tool/prompt/cache
primitives, collaboration-mode mechanics, hooks, budgets, and context helpers.
Product behavior such as memory, sessions, sandboxing, channels, durable
storage, and brand policy stays outside and is composed around these primitives.

## Why

The loop (request → tool calls → repeat → finalize), context estimation,
iteration budget, collaboration modes, and hooks are stable, reusable logic.
Tying them to a product package, database, or web server makes them
un-reusable. This package stays independent of product applications and speaks neutral
runtime data types at its boundaries.

## Quick start

```python
from agent_runtime import Agent, LLMConfig

agent = Agent(
    llm_config=LLMConfig(
        api="openai-chat-completions",
        model="gpt-4.1-mini",
        api_key="...",
        base_url="https://api.openai.com/v1",
    )
)
result = agent.ask("hi")
print(result.content)
print(result.messages)           # list[Message] (neutral conversation model)
```

Only `llm_config` is required for a real model turn. For tests or unusual
providers, `model_client` can still be injected directly.

## Provider-neutral by design

The loop speaks a **neutral model**, never OpenAI/Anthropic dict shapes:

- `Message` / `TextPart` / `ImagePart` / `ToolCallPart` / `ToolResultPart` — the
  conversation. `ImagePart` (URL or base64) maps to each provider's image
  format. Use `Message.user_with_images(text, [ImagePart(...)])`.
- `LLMRequest` / `LLMResponse` / `LLMStreamEvent` — the model call. `system` is a
  top-level field; tool calls carry structured `arguments` (a dict, not a JSON
  string); `stop_reason` and `usage` are normalized.

Built-in wire converters (`agent_runtime.llm.openai`,
`agent_runtime.llm.anthropic`) translate between the neutral model and each
provider's on-the-wire format. Runtime-owned HTTP provider clients use these
internally when `Agent` is constructed from `LLMConfig`.

## Injection protocols

| Protocol | What it does | Default |
| --- | --- | --- |
| `ModelClient` | Optional custom/test LLM injection | Built from `LLMConfig` |
| `ToolDispatcher` | Lists tool specs, executes by name | `NoopToolDispatcher` (no tools) |
| `SystemPromptProvider` | Builds the system prompt | `StaticSystemPrompt("")` |
| `CacheStrategy` | Shapes the request / extracts cache usage | `NoopCacheStrategy` |

The product layer supplies tools, prompts, cache strategy, sandbox/tool
implementations, and persistence. It normally supplies `LLMConfig`, not a
provider client.

## Runtime primitives

The runtime provides reusable defaults for common product wiring:

- `ToolRegistry` / `RegistryToolDispatcher` for registering model-callable
  local tools.
- `PromptParts` / `PromptProvider` for stable system prompt assembly.
- `PromptCacheStrategy` for provider request shaping and cache usage parsing.

Products can use these directly or swap in protocol-compatible alternatives.

## Collaboration modes

The kernel ships the *mechanism*, not the policy. A `CollaborationMode` is a data
structure (name + developer instructions + blocked tool names + blocked effect
classes). The kernel checks tool permission and injects the mode's instructions;
it defines no concrete modes and hard-codes no tool names.

```python
from agent_runtime import Agent, CollaborationMode

plan_mode = CollaborationMode(
    name="plan",
    developer_instructions="Plan only. Do not mutate state.",
    blocked_tools=frozenset({"write_file"}),
    blocked_effects=frozenset({"repo_mutating"}),
)
agent = Agent(llm_config=..., collaboration_mode=plan_mode)
```

## Hooks

`AgentHooks` is the lifecycle extension point: `on_messages_initialized`,
`before_model_request`, `after_model_response`, `before_tool_call`,
`after_tool_call`, `after_turn`. Compose several with `CompositeAgentHooks`.
The product uses hooks for context compaction, policy enforcement, auditing,
etc. — without touching the loop.

## Production concerns the loop handles

- **Streaming.** Set `stream=True` and pass a `stream_callback`. The loop calls
  the configured model client's stream path, forwards `content.delta` events to the callback, and
  assembles the final message. Without a callback it falls back to `complete()`.
- **Model-call retries.** Transient failures from `complete()`/`stream()` are
  retried (`AgentConfig.max_model_retries`, default 2) with backoff; exhaustion
  raises `ModelCallError`.
- **Tool-error containment.** A tool raising an exception is converted into a
  tool message (`{"ok": false, "error": ...}`) so the agent sees it and
  continues, instead of crashing the turn. Toggle with
  `AgentConfig.tool_errors_as_messages`.
- **Human-in-the-loop pause.** A tool raises `WaitingForUserInput` to pause the
  turn; the loop records the tool result, sets
  `TurnResult.waiting_for_user_input = True`, and returns gracefully.
- **Interruption.** `interrupt_check` returning true raises
  `AgentLoopInterrupted`, which the loop turns into a `TurnResult` with
  `interrupted=True` rather than propagating.
- **Token usage.** `TurnResult.prompt_tokens` / `completion_tokens` /
  `total_tokens` aggregate usage reported by the model client across the turn.
- **Context compaction.** Set `AgentConfig.max_context_tokens` and inject a
  `Compactor`. Before each model request the loop checks the budget and, if
  exceeded, compacts in place. `SummarizingCompactor` preserves leading system
  messages and a recent tail, and replaces the middle with a model-generated
  summary (via a `ModelClient`, so any provider works). The default
  is `NoopCompactor` (never compacts, no hidden model calls).

## What lives here vs. the product

- **Here (runtime):** loop, budget, collaboration mechanism, hooks, token
  estimation, provider-neutral data types, `LLMConfig`, OpenAI/Anthropic HTTP
  provider clients, standard tool/prompt/cache primitives, the protocols +
  no-op defaults.
- **Product layer:** concrete tool handlers, memory/skill content, collaboration
  policy, sandbox implementations, persistence (sessions), servers, channels,
  cloud tenancy, and brand behavior.

`TurnResult` carries messages + metadata only — no session/persistence
coupling. Persisting a turn is the product's job.

## Development

```bash
uv venv --python 3.11 .venv
uv pip install -e . --python .venv/bin/python
uv pip install pytest --python .venv/bin/python
.venv/bin/python -m pytest tests/ -q
```

Tests use fakes or monkeypatched HTTP boundaries — no network, no database, no
product imports.

## License

agent-runtime is licensed under the Apache License, Version 2.0. See
`LICENSE` for details.
