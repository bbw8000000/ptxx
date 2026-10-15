---
title: "Parcle-AI/parcle-memory"
owner: "Parcle-AI"
name: "parcle-memory"
fullName: "Parcle-AI/parcle-memory"
description: "开源项目 Parcle-AI/parcle-memory 的站内资料。"
sourceUrl: "https://github.com/Parcle-AI/parcle-memory"
stars: 510
forks: 1
language: "Python"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-20T16:35:07Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Parcle

**Long-term memory for AI agents**

Ingest conversations and files, then ask questions in natural language and get
cited answers back. Give every user a private, persistent agent memory.


  
  


---

## Why Parcle?

LLMs forget everything between calls. Parcle gives every user a private memory you
can write to and search:

- 🧠 **Per-user memory** — scope everything to a `user_id`.
- 💬 **Ingest anything** — chat transcripts and files (PDF, Markdown, text, …) go in the same place.
- 🔎 **Ask, don't query** — search returns a synthesized **answer** with **citations**, not just raw chunks.

👉 **[Learn more about agent memory →](https://parcle.ai/agent-continuity-lp)**

## Installation

```bash
pip install parcle
```

## REST API

Not using Python? You can call Parcle from any language over HTTP.
See the **REST API Reference** for endpoints,
request/response schemas, and examples in curl and JavaScript.

## Quickstart (Python SDK)

```python
from parcle import Parcle

# Reads PARCLE_API_KEY from the environment if api_key is omitted.
client = Parcle(api_key="pmem_...")

# 1. Create the user you'll be storing memory for. Do this once per user
#    before ingesting. Pass your own user_id, or omit it to have one generated.
client.create_user(user_id="name")

# 2. Write a conversation into a user's memory.
#    Ingestion is incremental: omit session_id to start a new session, then
#    pass the returned session_id back to append more turns to the same one.
dialog = client.ingest_dialog(
    user_id="ada",
    messages=[
        {"role": "user", "content": "I'm allergic to peanuts."},
        {"role": "assistant", "content": "Got it — I'll avoid peanuts in suggestions."},
    ],
)
client.ingest_dialog(
    user_id="ada",
    session_id=dialog.session_id,  # append to the same session
    messages=[
        {"role": "user", "content": "Also, I don't eat shellfish."},
    ],
)

# 3. ...or ingest a file (PDF, Markdown, text, …).
client.ingest_file(user_id="ada", file="diet-notes.pdf")

# Ingestion waits until content is searchable by default. Pass wait=False if you want to enqueue writes and call wait_until_ready(...) yourself.

# 4. Ask a question. You get an answer with confidence and citations.
result = client.search(user_id="ada", query="What food should I avoid?")

print(result.answer)      # "You're allergic to peanuts, so avoid them."
print(result.confidence)  # 0.92
print(result.citations)   # [Citation(type='session', id='...')]
```
