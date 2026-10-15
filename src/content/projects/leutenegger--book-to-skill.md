---
title: "Leutenegger/book-to-skill"
owner: "Leutenegger"
name: "book-to-skill"
fullName: "Leutenegger/book-to-skill"
description: "Turn any technical book PDF into a Claude Code skill — ready to study, reference, and use while you work."
sourceUrl: "https://github.com/Leutenegger/book-to-skill"
stars: 1140
forks: 141
language: "Python"
topics: ["agent", "agent-memory", "agent-skill", "agent-skills", "agentic", "agentic-ai", "agents", "ai-agents"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-08-16"
pushedAt: "2026-08-14T11:41:40Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

book-to-skill


  Turn any technical book, document folder, or collection of sources into a unified agent skill — ready to study, reference, and use while you work in GitHub Copilot CLI, Amp, or Claude Code.


  
  
  


  Why ·
  What it generates ·
  Beyond books ·
  How it works ·
  Usage ·
  Install ·
  FAQ ·
  Performance ·
  Changelog


  24×–51× fewer tokens than dumping the book into context to answer one question, measured on real books.


pip install -e .
book-to-skill install
book-to-skill &lt;path-to-book.pdf&gt;


**How it works, in 3 steps:**

1. **Point** it at a file, folder, or glob — `book-to-skill ./my-book.pdf`
2. **It distills** the book into a skill — frameworks, decision rules, anti-patterns, and per-chapter files. Structure, not a summary.
3. **Your agent loads it on demand** — ask `/my-book replication` and it reads the right chapter and answers from the real content, no hallucination.

---

## Install

**As agent skill (recommended):**

```powershell
pip install -e .
book-to-skill install
```

Copies the skill into `~/.claude/skills/book-to-skill`, `~/.agents/skills/book-to-skill`, `~/.copilot/skills/book-to-skill` (and related paths).

**Convert a book:**

```powershell
book-to-skill path\to\book.pdf
book-to-skill "path\to\docs\*.epub" my-skill-slug
book-to-skill --check
```

**Other commands:**

```powershell
book-to-skill help
book-to-skill list
book-to-skill readme
book-to-skill ui
```

On the first two CLI runs (if `ui/book-to-skill-ui.zip` is present), the GUI is unpacked and launched automatically with `cwd = ui/`. After that it stays quiet. Force with `book-to-skill ui`.

Manual skill install (any host):

```bash
git clone https://github.com/Leutenegger/book-to-skill.git ~/.claude/skills/book-to-skill
# Copilot CLI: ~/.copilot/skills/
# Amp / cross-agent: ~/.agents/skills/
```

---

## Why

You buy a great technical book. You read it once. Three months later you can't remember chapter 7 existed.

The usual workarounds don't help:

- "Let me just search the PDF" → you get a list of pages, not answers
- "I'll ask the agent about this book" → it either hallucinates or says it doesn't have the content
- "I'll take notes as I read" → you end up with a 200-line doc you never open again

**book-to-skill solves this by turning the book into a structured skill your agent loads on demand.**

Once installed, type `/your-book-slug replication` and the agent reads the right chapter and answers from the actual content. No hallucination. No digging through PDFs.

Works with any host that supports the open Agent Skills standard — GitHub Copilot CLI, Amp, and Claude Code all read the same `SKILL.md` format.

---

## What it generates

Running `book-to-skill your-book.pdf` (or a folder, glob, or list of files) creates a full skill in your agent's skills directory:

| File | Purpose | Size |
|------|---------|------|
| `SKILL.md` | Core mental models + chapter index | ~4,000 tokens |
| `chapters/ch01-*.md` … | One file per chapter, loaded on-demand | ~1,000 tokens each |
| `glossary.md` | Key terms with chapter refs | ~1,500 tokens |
| `patterns.md` | Techniques, algorithms, design patterns | ~2,000 tokens |
| `cheatsheet.md` | Decision tables and quick-reference rules | ~1,000 tokens |

Chapter files are loaded on-demand — they don't count against the skill budget until you ask about that topic.

---

## Beyond books

The name says "book", but the input is any structured prose:

- **Internal documentation** — ADRs, runbooks, onboarding guides
- **Brand & design systems** — voice guidelines, component principles
- **Research clusters** — papers + notes, updated as new material lands
- **Specs & standards** — RFCs, API contracts, compliance docs

If you re-open a document often enough to wish you'd memorized it, it's a candidate.

---

## How it works

Two halves: a deterministic Python **extractor** (document → clean text + metadata) and a spec-driven **generator** (your agent follows `SKILL.md` to turn that into a structured skill). On-demand chapter files keep the loaded skill small.

Full walkthrough → docs/how-it-works.md

---

## Usage

```
book-to-skill  [skill-name]
```

Plus analyze-only, generate-from-analysis, and update/fold-in modes.

All modes and examples → docs/usage.md

---

## Requirements

The extractor tries tools in order per format and uses the first available. Plain text, Markdown, reStructuredText and AsciiDoc need no extra deps.

```powershell
book-to-skill --check
```

**PDF:**

| Book type | Tool | Install |
|-----------|------|---------|
| Text-heavy | `pdftotext` (poppler) / `pypdf` / `pdfminer.six` | system / pip |
| Technical (code, tables) | `docling` | `pip install docling` |

**EPUB:** `ebooklib` + `beautifulsoup4` (or stdlib zipfile fallback)  
**DOCX / HTML / RTF:** optional pip packages, stdlib fallbacks available  
**MOBI / AZW:** Calibre `ebook-convert`

Scanned PDFs need OCR first (`ocrmypdf input.pdf output.pdf`).

Optional extras:

```powershell
pip install "book-to-skill[all]"
```

---

## Copyright & fair use

book-to-skill ships **no book content**. It's a converter you point at files you already own.

- Processing is local. Your files are never uploaded by this tool.
- Use your own copy (bought book, company docs, papers you have the right to read).
- The output is structured notes — frameworks, definitions, takeaways — not a reproduction of the text.
- Don't redistribute generated skills of copyrighted works.

---

## License

MIT — applies to the converter (code + skill definition) in this repository, **not** to any book or document you process with it.

Based on the original book-to-skill by virgiliojr94.
