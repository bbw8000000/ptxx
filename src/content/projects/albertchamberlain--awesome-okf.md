---
title: "Albertchamberlain/Awesome-OKF"
owner: "Albertchamberlain"
name: "Awesome-OKF"
fullName: "Albertchamberlain/Awesome-OKF"
description: "Curated Open Knowledge Format (OKF) resources — plugins, skills, proposals, and tools. YAML-driven, agent-searchable."
sourceUrl: "https://github.com/Albertchamberlain/Awesome-OKF"
stars: 92
forks: 2
language: "Python"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-08"
pushedAt: "2026-09-08T01:41:48Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

Awesome OKF


  The curated catalog of Open Knowledge Format resources.


  YAML-driven. Agent-searchable. Community-curated.


  
  
  


  English | 中文 | 日本語 | 한국어


  Catalog &ensp;·&ensp;
  Connect an Agent &ensp;·&ensp;
  CLI &ensp;·&ensp;
  Contributing


---

## What is OKF

Open Knowledge Format (OKF) is an open specification by Google Cloud — define knowledge as a directory of Markdown files with YAML frontmatter and a small set of conventions. No runtime, no SDK.

## What's Different Here

Awesome OKF keeps the entire OKF ecosystem in **one validated YAML catalog**, then turns it into a browsable list, a searchable CLI, and an MCP meta-server that AI agents can query directly:


```
                      catalog.yaml
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                 ▼
      README.md         CLI tools        MCP server
   (human-browsable)  (searchable)   (agent-searchable)
```


> **Edit one record. Regenerate the docs. Re-query from anywhere.**

---

## See It in Action

```text
User (or Agent):
  "Find an OKF plugin for Obsidian vault conversion."

Agent calls:
  search_catalog({
    "query": "Obsidian",
    "kind": "plugin",
    "limit": 3
  })

Awesome-OKF responds:
  ┌──────────────────────────────────────────────────────────────┐
  │ obsidian-to-okf                                plugin        │
  │ Convert Obsidian vaults to OKF — wikilinks become OKF links. │
  │ Platform: python  ·  Tags: obsidian, wikilink, markdown      │
  └──────────────────────────────────────────────────────────────┘
```

*The catalog speaks OKF.*

---

## Quick Start

### Connect to Your Agent

Add Awesome OKF to any MCP client so your agent can discover OKF resources:

```bash
pipx install awesome-okf
```

```json
{
  "mcpServers": {
    "awesome-okf": {
      "command": "awesome-okf-server"
    }
  }
}
```

### CLI

```bash
awesome-okf stats
awesome-okf list --kind plugin
awesome-okf search obsidian
awesome-okf readme
```

---

## 🛠️ Our Tools

### convert-to-okf 🔄

Zero-dependency CLI that converts various formats into OKF knowledge bundles:

| 📥 Input Format | ✨ What It Does |
|---|---|
| 📋 Markdown awesome-xx lists | Extracts `- Title — Description` items → OKF entries |
| 📊 JSON arrays | Converts `{title, url, description}` objects → OKF entries |
| 🔗 URL lists | Plain text URL collections → OKF entries |

```bash
# One command, instant OKF bundle
python scripts/convert-to-okf.py README.md -o kb/ -t concept

# Output: kb/ with 45 Markdown files, each with YAML frontmatter
# Ready for: myokf validate kb/
```

### awesome-okf CLI 🎛️

The data-driven catalog CLI (same architecture as Awesome-MCP):

| 🔍 Command | 📝 Purpose |
|---|---|
| `awesome-okf search obsidian` | Full-text search across all 29 entries |
| `awesome-okf list --kind plugin` | Filter by category |
| `awesome-okf readme` | Regenerate this README from catalog.yaml |
| `awesome-okf-server` | MCP meta-server — let AI agents query the catalog |

---

## 🔥 Popular Repositories

| 🏆 Repository | 📌 What It Offers |
|---|---|
| ⭐ yzfly/awesome-okf | 中文世界第一个 OKF 落点 — 7 plugins + 7 skills + 3 proposals |
| ⭐ linyiru/awesome-okf | English OKF resource hub — spec, tools, samples, guides |
| 📚 GoogleCloudPlatform/knowledge-catalog | Official OKF spec, SDK, and proposals by Google |
| 🧠 karpathy/llm-wiki | The original LLM Wiki that inspired OKF |

---

## Catalog

> **29 curated entries** · 4 tools · 7 plugins · 7 skills · 5 proposals · 6 docs
> *Deliberately curated — not an exhaustive index.*


## 🛠️ Tools & CLI

### Cli

- myokf-cli `cli` — Unified CLI for OKF — pull from GitHub, validate, and package to single-file web. — `cli`, `python`, `validation`, `packaging`

### Conversion

- convert-to-okf `cli` — CLI tool to convert Markdown awesome-xx lists, JSON arrays, and URL lists into OKF knowledge bundles — zero dependencies, standard library only. — `conversion`, `cli`, `markdown`, `json`

### Quality

- OKF Validator (myokf) `cli` — Built-in OKF schema validator — checks YAML frontmatter, link integrity, and spec compliance. — `validation`, `quality`, `schema`

### SDK

- OKF Python SDK ✅ `python` — Official Python SDK for reading, validating, and writing OKF bundles — referenced by Google as the reference implementation. — `sdk`, `python`, `official`


## 🔌 Producer Plugins

### Cli

- myokf-cli (plugin entry) `python` — Unified CLI entry point wrapping all seven producer plugins. — `cli`, `aggregator`, `zero-dependency`

### Code

- github-to-okf `python` — Extract code symbols from GitHub repositories into OKF. — `github`, `code`, `symbols`, `zero-dependency`

### Document

- feishu-to-okf `python` — Convert Feishu (Lark) knowledge spaces and documents into OKF. — `feishu`, `lark`, `document`, `zero-dependency`
- notion-to-okf `python` — Convert Notion Markdown exports into OKF. — `notion`, `markdown`, `zero-dependency`
- obsidian-to-okf `python` — Convert Obsidian vaults to OKF — wikilinks become OKF links. — `obsidian`, `wikilink`, `markdown`, `zero-dependency`

### List

- awesome-to-okf `python` — Convert GitHub awesome-xx lists into structured OKF knowledge bases. — `awesome-list`, `conversion`, `zero-dependency`

### Web

- html-to-okf `python` — Convert HTML files into OKF. — `html`, `web`, `zero-dependency`


## 🤖 Claude Code Skills

### Conversion

- book-to-okf `claude-code` — Split books and long-form articles into interlinked concept knowledge bases. — `book`, `long-form`, `concepts`
- code-to-okf `claude-code` — Convert codebases into OKF with Claude Code. — `code`, `repository`, `enrichment`

### Creation

- okf-creator `claude-code` — Create high-quality OKF knowledge bases from scratch with Claude Code. — `creation`, `knowledge-base`

### Import

- awesome-to-okf (skill) `claude-code` — Import awesome lists and enrich them into OKF with Claude Code. — `awesome-list`, `import`, `enrichment`
- github-to-okf (skill) `claude-code` — Repository to OKF enrichment workflow with Claude Code. — `github`, `repository`, `enrichment`

### Publishing

- okf-to-book `claude-code` — Publish OKF knowledge bases as VitePress documentation sites. — `vitepress`, `publishing`, `docs`
- okf-to-web `claude-code` — Package OKF into a single-file web page with interactive knowledge graph. — `web`, `single-file`, `knowledge-graph`


## 📝 Proposals & Extensions

### Upstream

- Attested Computation Proposal `web` — Propose verifiable computation records for OKF knowledge entries. — `computation`, `verification`, `upstream`
- Lifecycle & Staleness Proposal `web` — Propose `status` and `stale_after` lifecycle fields for OKF v0.2. — `lifecycle`, `staleness`, `upstream`
- OKF Discovery Protocol (KEP-1) ✅ `web` — Proposal for a standard discovery mechanism that lets agents find OKF bundles without hardcoding paths. — `discovery`, `upstream`, `kep`
- Sources & Provenance Extension `web` — Propose `sources` field and provenance tracking for OKF v0.2. — `sources`, `provenance`, `upstream`
- Trust Signals (KEP-2) ✅ `web` — Proposal for verification chains and trust tiering so consumers can distinguish machine-confirmed from human-reviewed content. — `trust`, `verification`, `upstream`, `kep`


## 📖 Documentation & Specifications

### Example

- Karpathy's LLM Wiki (OKF) `web` — Karpathy's LLM knowledge base converted to OKF — a real-world example of OKF in action. — `example`, `llm`, `karpathy`
- LLM Wiki (Karpathy) `web` — The original LLM knowledge base by Andrej Karpathy that inspired OKF — a living wiki of LLM concepts as Markdown files. — `example`, `llm`, `karpathy`, `inspiration`
- OKF Market Concept `web` — A conceptual OKF knowledge market — imagine a marketplace where knowledge entries are traded as verifiable assets. — `market`, `concept`, `knowledge-economy`
- OKF Super Corpus ✅ `web` — A large-scale example OKF bundle curated by Google Cloud — demonstrates the format at scale across multiple domains. — `example`, `large-scale`, `google`

### Guide

- OKF Blog Post (Chinese) `web` — Chinese translation of the OKF launch blog post. — `blog`, `translation`, `chinese`

### Spec

- OKF Specification (Chinese) `web` — Full Chinese translation of the OKF specification, with mandatory requirements and gaps annotated. — `spec`, `translation`, `chinese`
- OKF Specification (English) ✅ `web` — Official OKF specification by Google Cloud — v0.2 with sources, trust, lifecycle, and attested computation. — `spec`, `english`, `official`
- OKF Specification (Official) ✅ `web` — Google's official OKF v0.2 specification — the canonical reference for the format. — `spec`, `official`, `google`


---

## Data Model

```yaml
- id: obsidian-to-okf
  name: obsidian-to-okf
  kind: plugin
  category: document
  url: https://github.com/yzfly/awesome-okf/tree/main/plugins/obsidian-to-okf
  description: Convert Obsidian vaults to OKF — wikilinks become OKF links.
  platform: [python]
  official: false
  tags: [obsidian, wikilink, markdown]
```

---

## Contributing

Add or edit entries in `data/catalog.yaml`, then:

```bash
awesome-okf validate
awesome-okf readme
pytest
```

See `CONTRIBUTING.md` for the entry schema.

---

## 🤖 For AI Agents

If you are an AI agent (Claude Code, Codex, Cursor) working on this repo, here's what you need to know:

### Project structure

```
data/catalog.yaml          # SINGLE SOURCE OF TRUTH — all entries live here
README.template.md         # English template (hand-written narrative)
README.template.zh.md      # Chinese template
README.template.ja.md      # Japanese template
README.template.ko.md      # Korean template
src/awesome_okf/           # CLI + MCP meta-server (Python)
scripts/convert-to-okf.py  # Format converter tool
```

### Rules (non-negotiable)

1. **Never edit README\*.md directly** — they are generated. Edit `data/catalog.yaml`, then regenerate.
2. **Never edit the CATALOG blocks** in templates — the `` markers are auto-generated.
3. **Adding an entry** = append a YAML block to `data/catalog.yaml` + regenerate + run tests. Schema:
   ```yaml
   - id: kebab-case-id          # unique, never reused
     name: Human Readable Name
     kind: tool|plugin|skill|proposal|doc
     category: free-form-group
     url: https://...
     description: One sentence, no marketing fluff.
     platform: [cli|python|web|claude-code]
     official: false            # true ONLY for Google/vendor official
     tags: [3-5 short tags]
   ```
4. **Validate before commit**: `awesome-okf validate && pytest`
5. **Never create duplicate ids** — edit the existing entry in place.
6. **Multi-language**: if you touch a template, mirror the change in all four templates.

### Useful commands

```bash
awesome-okf stats                    # entry counts by kind
awesome-okf list --kind plugin       # filter by kind
awesome-okf search            # full-text search
awesome-okf validate                 # schema + duplicate-id check
awesome-okf readme                   # regenerate all READMEs
awesome-okf-server                   # MCP meta-server (stdio)
```

### MCP meta-server

The catalog is exposed to agents via `awesome-okf-server` with four tools:
`search_catalog`, `list_catalog`, `get_catalog_entry`, `catalog_stats`, `convert_to_okf`.
Connect it to your MCP client to query OKF resources programmatically.

---


## Related Lists

- yzfly/awesome-okf — the original Chinese OKF resource hub
- OKF Specification — official Google Cloud spec

---


  MIT — see LICENSE. Catalog descriptions link to upstream projects under their respective licenses.
