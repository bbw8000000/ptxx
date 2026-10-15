---
title: "UditAkhourii/cdaf"
owner: "UditAkhourii"
name: "cdaf"
fullName: "UditAkhourii/cdaf"
description: "CDAF (Cached Descriptive Asset Files) - open sidecar format for video so AI agents stop re-analyzing the same footage. Spec, CLI, agent skill, reproducible benchmark."
sourceUrl: "https://github.com/UditAkhourii/cdaf"
stars: 81
forks: 6
language: "Python"
topics: ["agentic-ai", "ai-agents", "file-format", "gemini", "llm", "remotion", "sidecar", "token-optimization"]
license: "MIT"
homepage: "https://zenodo.org/records/22110594"
defaultBranch: "main"
snapshotDate: "2026-08-27"
pushedAt: "2026-08-26T19:30:09Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# CDAF — Cached Descriptive Asset Files

*图片：tests*
[*图片：npm*](https://www.npmjs.com/package/cdaf-skill)
*图片：License: MIT*
*图片：Spec: v1.0*

**Stop making AI agents watch the same video twice.**

CDAF is an open sidecar format for video: a plain-text, timestamped description that
lives next to the video file with the same basename. Generate it once, and every AI
agent that touches that footage afterward reads a few hundred text tokens instead of
running a full video-understanding pass.

### Teach your agent the format — one command

```bash
npx cdaf-skill
```

Works on Windows, macOS, and Linux. That installs the agent skill, so
your coding agent checks for a `.cdaf` sidecar and verifies it against the video's hash
*before* it ever spends tokens watching. Then describe your footage once:

```bash
pip install "cdaf[generate] @ git+https://github.com/UditAkhourii/cdaf.git#subdirectory=cli"
cdaf generate ./footage
```

```
footage/
├── sunset-drone.mp4     ← plays everywhere, untouched
└── sunset-drone.cdaf    ← what agents read instead of watching
```

*图片：CDAF turns repeated per-task video analysis into one per-asset description pass followed by verified text reads*

**Measured** (reproducible benchmark, `gemini-2.5-flash`, 20 questions): answering
from the sidecar matched direct video analysis on accuracy — **20/20 vs 19/20** — at
**10.1× fewer prompt tokens per question** (303 vs 3,066) and ~35% lower latency. The
ratio grows linearly with clip length (~50× for 60-second footage). In production use
at scale, this pattern cut video-workflow AI costs to roughly **1/25th**.

---

## Components

| Component | Where | What it does |
|---|---|---|
| **Spec** | SPEC.md | The normative format definition (v1.0) |
| **Engine** | cli/cdaf/ | Python library: parse, validate, hash, generate |
| **CLI** | cli/ | `cdaf` command: generate / validate / read / status |
| **Local provider** | cli/cdaf/local.py | `--local`: generate with a local model, no API key |
| **Agent Skill** | skills/ | Teaches agents the sidecar-first protocol · `npx cdaf-skill` |
| **Benchmarks** | benchmarks/ | Reproducible eval: sidecar vs direct video |
| **Paper** | paper/PREPRINT.md | arXiv preprint draft built on the benchmark |

---

## 📄 Spec

A CDAF asset is `clip.mp4` + `clip.cdaf`: a UTF-8 sidecar with a minimal `key: value`
header and a markdown body. The header carries the **SHA-256 and byte size of the
exact video described** — edit the video and every conforming tool detects the sidecar
as stale and refuses to use it. The body is optimized for the actual reader (an LLM):

```
--- CDAF/1.0
video: sunset-drone.mp4
sha256: 4a7d1ed4…
bytes: 48211394
duration: 00:00:31.500
generator: gemini-2.5-flash
created: 2026-08-26T14:03:12Z
---

## Summary
A 31-second aerial drone clip of a coastal highway at golden hour…

## Segments
[00:00.0-00:05.2] Wide aerial establishing shot: a two-lane coastal highway…
[00:05.2-00:12.8] The drone pushes in and descends toward the highway…

## Transcript
(no speech)

## On-screen Text
(none)

## Tags
drone, aerial, coastal highway, golden hour, sunset, b-roll, …
```

Full normative rules (freshness semantics, versioning, section grammar):
**SPEC.md**. A complete example:
examples/sunset-drone.cdaf.

## ⚙️ Engine (core library)

The `cdaf` Python package is split by dependency weight:

- **Zero-dependency core** (sidecar.py) — parse, serialize,
  chunked SHA-256, freshness checking, segment extraction. Agents and CI can validate
  sidecars with nothing but the standard library.
- **Generator** (generate.py) — Gemini Files API,
  bring-your-own-key, `brief`/`standard`/`rich` detail profiles, token-usage capture.
  Only imported when you generate.
- **Probe** (probe.py) — optional ffprobe metadata
  (duration/resolution/fps), degrades gracefully when ffprobe is absent.

```python
from cdaf import load, check_freshness, sidecar_path_for

sc = load(sidecar_path_for("footage/sunset-drone.mp4"))
if check_freshness("footage/sunset-drone.mp4", sc) == "fresh":
    context_for_llm = sc.body
```

The format is model-agnostic: the engine's Gemini backend is one implementation, and
Claude/GPT/local-VLM backends slot in behind the same `Sidecar` type.

## 💻 CLI

Requires Python ≥ 3.10. Bring your own Gemini API key
([free tier available](https://aistudio.google.com/apikey)) — your footage goes to
your key, not to us.

```bash
pip install "cdaf[generate] @ git+https://github.com/UditAkhourii/cdaf.git#subdirectory=cli"
export GEMINI_API_KEY=your-key          # PowerShell: $env:GEMINI_API_KEY="your-key"

cdaf generate ./footage                 # describe every video, skip fresh sidecars
cdaf status ./footage                   # FRESH / STALE / MISSING report
cdaf read ./footage/sunset-drone.mp4    # print the description (verifies hash first)
cdaf validate ./footage/clip.mp4        # exit 0 iff sidecar is well-formed and fresh
```

Working from a clone instead? `pip install ./cli[generate]`. A PyPI release
(`pip install cdaf`) is on the roadmap.

Flags: `--detail brief|standard|rich`, `--model `, `--force`.
`validate`/`read`/`status` need **no dependencies and no API key**. Safety lives in
the tool, not just in guidance: `cdaf read` refuses to print a stale sidecar.

## 🤖 Agent Skill

The skill turns the format into behavior: **before analyzing any video, check for the
sidecar; verify freshness (size check for exploration, full hash for consequential
decisions); read it instead of watching; grep `.cdaf` files to search whole libraries;
regenerate when stale.**

Install it with `npx cdaf-skill` (see above),
or pick a scope:

| Command | Installs to |
|---|---|
| `npx cdaf-skill` | `~/.claude/skills/cdaf` (all your projects) |
| `npx cdaf-skill --project` | `./.claude/skills/cdaf` (this project only) |
| `npx cdaf-skill --dir ` | anywhere you want |
| `npx cdaf-skill --print` | stdout — for pasting into other agent frameworks |

Re-running is safe: an unchanged skill is left alone, and a modified one is backed up
to `SKILL.md.bak` before updating. Prefer to copy it by hand? The file is
skills/claude-code/cdaf/SKILL.md.

Any other agent framework — the whole contract is one system-prompt paragraph:

> Before analyzing a video file, look for a `.cdaf` file with the same basename. If
> its `bytes`/`sha256` header matches the video file, read it instead of processing
> the video.

### Why agentic video editors care

Programmatic and agent-native editors (Remotion, HyperFrames, prompt-to-edit tools)
already do everything in text — compositions are code, cut decisions are data. Video
understanding is the one step that forces them out of the text domain, priced per
exposure (~263 tokens per second of footage on Gemini-class models). With CDAF:

- **Selection becomes retrieval** — "sunset coastal shots, no people" is a grep over
  `.cdaf` files, not a multimodal sweep of the library.
- **Cut lists come from segment timestamps** — `[00:05.2-00:12.8]` lines map straight
  to Remotion ``s or HyperFrames clips.
- **Captions and audio sync for free** — the Transcript section aligns speech to the
  timeline.
- **The library appreciates** — 40 candidate clips ≈ 473k tokens to watch, ~24k to
  read — every session after the first.

## 📊 Benchmarks

Fully reproducible: bench.py synthesizes test videos with
ffmpeg from scripted recipes (known colors, hard cuts, timed word overlays), so ground
truth is exact and grading is objective — no LLM judge, no dataset license.

```bash
python benchmarks/bench.py make     # synthesize testset (needs ffmpeg)
python benchmarks/bench.py run     # both conditions via Gemini (needs GEMINI_API_KEY)
python benchmarks/bench.py report  # writes benchmarks/RESULTS.md
```

*图片：Accuracy, prompt-token cost, and latency for 20 questions in each condition*

| Condition | Accuracy | Mean prompt tokens/question | Mean latency |
|---|---|---|---|
| Direct video | 19/20 (95%) | 3,066 | 3.46 s |
| **CDAF sidecar** | **20/20 (100%)** | **303** | **2.24 s** |

Each sidecar-answered question saves 2,763 prompt tokens, so generating a sidecar
(3,601 tokens) **breaks even after ≈1.3 questions per video** — everything after that
is the ~10× saving. Per-clip and per-question detail:
benchmarks/RESULTS.md.

## 📝 Paper

**[https://zenodo.org/records/22110594](https://zenodo.org/records/22110594)** — *Cached Descriptive Asset Files (CDAF):
A Sidecar Format for Token-Efficient Video Understanding in Agentic Pipelines* —
arXiv draft (cs.MM / cs.AI): format rationale, benchmark methodology and results,
production case study, integration analysis for agentic editors, limitations.

## Roadmap

- PyPI release of the `cdaf` CLI (`pip install cdaf`)
- MCP server exposing `cdaf_read` / `cdaf_status` / `cdaf_generate` to any MCP client
- Hosted free converter (no local install; bring-your-own-key or free quota)
- Additional generator backends (Claude, GPT, local VLMs)
- Node/TypeScript port of the engine
- Natural-footage benchmark extension with human-verified QA
- Signed sidecars (`signature` header) for cross-organization trust

## License

MIT — see LICENSE.
