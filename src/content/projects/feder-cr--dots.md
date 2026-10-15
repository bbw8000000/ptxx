---
title: "feder-cr/dots"
owner: "feder-cr"
name: "dots"
fullName: "feder-cr/dots"
description: "Open-source dots for the web: an AI agent with its own browser, one that does not get blocked."
sourceUrl: "https://github.com/feder-cr/dots"
stars: 2402
forks: 419
language: "Python"
topics: ["ai-agent", "ai-agents", "ai-browser", "anti-detect-browser", "browser-agent", "browser-automation", "chatgpt", "dotfiles"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-10-02"
pushedAt: "2026-09-29T23:24:01Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

dots

Every AI agent is a model and a browser.You can swap the model with one flag. The browser is what the website sees.

---

Windows, in PowerShell:

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
$env:Path = "$env:USERPROFILE\.local\bin;$env:Path"
uvx --from git+https://github.com/feder-cr/dots dots --openrouter-key sk-or-...
```

Linux:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.local/bin/env
uvx --from git+https://github.com/feder-cr/dots dots --openrouter-key sk-or-...
```

Then open **http://127.0.0.1:8765**. The conversation on the left, the browser on the right, live.

## It all comes down to the browser

When a web agent fails, the model is rarely why. The page never loaded, a
challenge appeared, the login expired, the click did not land. All of that
happens in the browser, before the model gets to think.

So dots is built around one:

- **A real Firefox engine, patched in C++.** The fingerprint is decided inside
  the engine, not painted over with JavaScript that a page can inspect.
- **One identity per seed.** Screen, fonts, GPU, timezone and language agree
  with each other, and `--seed` gives back the same person on every run.
- **Nothing for a page to find.** No WebDriver flag, no DevTools protocol, no
  automation globals in the page.
- **A person's hands.** The pointer travels to what it clicks and keys are
  pressed one at a time, so every event the page receives is a trusted one.
- **A browser that remembers.** `--profile-dir` keeps logins and cookies from
  one run to the next.
- **Where it connects from is who it is.** With `--proxy`, the timezone and the
  language follow the exit.

The model is any model on OpenRouter, and `--model` changes it.

## What to ask it

> Go to ``. One way, Milan to Lisbon, economy, one adult. Check
> every date from the 12th to the 16th of next month and read the cheapest fare
> for each day. If a date has no availability, say so. Do not guess a number.

## The same browser, in your own assistant

Claude Code, Codex, Gemini CLI or any MCP client:
invisible_playwright_mcp
gives them this browser as a server. `dots` is its interface, and `dots --help`
lists every option.

---

Not affiliated with OpenAI. MIT licensed.
