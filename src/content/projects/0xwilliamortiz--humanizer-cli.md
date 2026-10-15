---
title: "0xwilliamortiz/humanizer-cli"
owner: "0xwilliamortiz"
name: "humanizer-cli"
fullName: "0xwilliamortiz/humanizer-cli"
description: "33 ways to spot AI-written text, right in your terminal. Before/after examples, draft checker, zero dependencies."
sourceUrl: "https://github.com/0xwilliamortiz/humanizer-cli"
stars: 141
forks: 16
language: "JavaScript"
topics: ["ai-slop", "ai-slop-detection", "ai-slop-detector", "ai-slop-fixer", "ai-slop-remover", "claude-code-plugin", "claude-skills", "codex"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-08-02"
pushedAt: "2026-08-01T21:41:13Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# humanizer

**33 ways to spot AI-written text, right in your terminal.**
No network, no API key, no dependencies. One 87 KB C program.


windows x64 &middot; unpack and run &middot; all releases


---

## What this is

A terminal reference for the humanizer skill, which collects the
patterns catalogued in Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing).
Thirty-three habits give away text produced by a language model: dashes where a
comma would do, "not just X, it's Y", padded phrasing, emoji in headings,
manufactured enthusiasm.

Every pattern comes with before and after examples. Drafts can be checked on the
spot. Nothing leaves your machine: the program reads `SKILL.md` sitting next to
it and prints.

## Getting started

The binary sits in the project root, so the shortest route needs nothing
installed at all:

```powershell
.\humanizer.exe
.\humanizer.exe show 14
.\humanizer.exe check draft.md
```

With Node 18 or newer available, `npx` adds a prompt that stays open between
commands:

```powershell
npm install
npx humanizer
```

```
humanizer> show 14
humanizer> check draft.md
humanizer> search hedging
humanizer> exit
```

A command can be passed straight away, and it runs before the prompt appears:

```powershell
npx humanizer show 14
```

> [!NOTE]
> `npm install` downloads nothing. There are no dependencies, and nothing is
> installed globally. It only exists to register the `humanizer` name for `npx`.

## Commands

| Command | What it does |
|---|---|
| `patterns` | every pattern, grouped by section |
| `show ` | one pattern in full, with before and after |
| `search ` | patterns matching a keyword |
| `check ` | scan a draft for the mechanical tells |
| `prompt [file]` | print the whole skill prompt, ready to paste into any chat |
| `install` | how to load the skill into an agent |
| `doctor` | what is running, and where `SKILL.md` came from |

Flags: `--copy`, `--out `, `--skill `, `--no-color`.

## Checking a draft


Plain rules catch **13 of the 33 patterns** honestly: dashes, emoji, curly
quotes, the AI vocabulary list, "not just X, it's Y", padding, hedging, lists
with bolded lead-ins, chatbot leftovers, flattery, signposts like "let's dive
in", and rhetorical openers.

The other twenty need a reader. A regular expression cannot tell inflated
significance from a fair claim. Output gives the pattern number, how many times
it fired, the line, and the matching fragment. Treat it as a hint rather than a
verdict: the skill itself has a section on false positives.

## Rewriting without an API key

```powershell
.\humanizer.exe prompt draft.md --copy
```

This puts the full skill prompt, followed by your draft, on the clipboard. Paste
that into any chat and you get the rewrite by hand. No key and no subscription
involved.

## How it works

```
humanizer-cli/
├── humanizer.exe         the program, 87 KB, needs nothing
├── SKILL.md              the skill, and the source of every fact shown
├── package.json
├── README.md
├── LICENSE
├── docs/                 images used by this file
└── sources/
    ├── launch.mjs        entry point for npx
    ├── panel.mjs         the panel, printed by Node
    ├── humanizer.cmd     launcher for running without Node
    └── postinstall.mjs
```

`humanizer.exe` is a plain C program. There is no interpreter and no bundled
runtime inside, only code and a compiled-in copy of `SKILL.md`. It links against
`kernel32`, `msvcrt` and `user32`, which ship with Windows.

The panel and the binary are kept apart on purpose. Node prints the panel after
reading `SKILL.md` directly, so it looks the same however the binary behaves,
including when it is replaced by something else or deleted. The binary, for its
part, is never handed arguments this project invented: it runs exactly what you
typed. Swapping in a different executable therefore breaks nothing.

The launcher looks for the binary in the project root first, then in `sources/`,
so either location works.

### Where SKILL.md comes from

In order of preference: the path given to `--skill`, then `SKILL.md` in the
current directory, then one next to the binary, and finally the compiled-in
copy. The program works anywhere on its own, and a `SKILL.md` placed beside it
wins, so edits show up without a rebuild.


Troubleshooting


**SmartScreen warns about the exe** because it carries no code signature. Open
"More info" and allow it to run.

**Antivirus removes the exe** occasionally, for the same reason. Restore it from
quarantine, or unpack the archive again.

**Box drawing shows up as garbage** in a console without UTF-8. Windows Terminal
handles it, and so does `chcp 65001`.

**`(exit code N)` after a command** reports a nonzero return code from the
program. The panel is unaffected, since it prints independently.


## Credits

- blader/humanizer for the skill itself
- [WikiProject AI Cleanup](https://en.wikipedia.org/wiki/Wikipedia:WikiProject_AI_Cleanup) for the underlying observations

## License

MIT, same as the skill.
