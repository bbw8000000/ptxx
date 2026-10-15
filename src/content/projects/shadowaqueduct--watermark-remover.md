---
title: "ShadowAqueduct/watermark-remover"
owner: "ShadowAqueduct"
name: "watermark-remover"
fullName: "ShadowAqueduct/watermark-remover"
description: "Purge multi-vendor AI watermarks: clean Unicode text, apply statistical rewrite hooks, and clear C2PA plus metadata from PNG, JPEG, SVG, PDF, DOCX, HTML, and MD."
sourceUrl: "https://github.com/ShadowAqueduct/watermark-remover"
stars: 760
forks: 72
language: "Python"
topics: ["claude-ai", "claude-code", "claude-code-plugin", "claude-skills", "codex", "codex-cli", "codex-skill", "codex-skills"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-08-24"
pushedAt: "2026-08-23T22:07:11Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

```
_ _ _ ____ ___ ____ ____ _  _ ____ ____ _  _ ____    ____ ____ _  _ ____ _  _ ____ ____
| | | |__|  |  |___ |__/ |\/| |__| |__/ |_/  [__  __ |__/ |___ |\/| |  | |  | |___ |__/
|_|_| |  |  |  |___ |  \ |  | |  | |  \ | \_ ___]    |  \ |___ |  | |__|  \/  |___ |  \
```

# watermarks-remover

*图片：CI*
*图片：Release*
*图片：Stars*

Agent skill + stdlib Python service that strips multi-vendor AI provenance marks from text and files. For privacy and hygiene on content **you own**.

The skill is a thin HTTP client — the agent host needs no Python. All work runs in the service.

**Author:** ShadowAqueduct

**Latest release:** v0.5.0

| Layer | Target | Method |
| --- | --- | --- |
| **A** | Invisible Unicode, exotic spaces, bidi, tag chars | Deterministic Python |
| **B** | Statistical (token-sampling) text watermarks | Agent rewrite + optional `rewrite_text.py` |
| **Files** | C2PA / EXIF / XMP / doc props | PNG, JPEG, WebP, AVIF, HEIC, BMP, GIF, TIFF, SVG, PDF, DOCX, XLSX, PPTX, EPUB, ODT, HTML, Markdown, MP4/MOV/M4A/M4V, WAV, MP3, FLAC |

Covers class-level marks from Claude, Gemini/SynthID-Text, OpenAI provenance surfaces, and open-LLM schemes (Kirchenbauer green-list, keyed-Gumbel / Aaronson EXP).

---

## Install

Skill ships **no code** — it calls the service over HTTP. Install the skill, start the service, set `WATERMARKS_SERVICE_URL` if it is not `http://127.0.0.1:8765`.

One installer (Python 3.10+, stdlib only):

```bash
python3 install_skill.py --skill remove-ai-marks --target claude-code
```

| Host | Target | Lands in |
| --- | --- | --- |
| Claude Code (personal) | `--target claude-code` | `~/.claude/skills/` |
| Claude Code (project) | `--target claude-project --project-dir PATH` | `PATH/.claude/skills/` |
| Cowork / claude.ai / cloud | `--target cowork` | `dist/.zip` (upload under Customize → Skills) |
| Cursor | `--target cursor` | `~/.cursor/skills/` |

Shipped skills: `remove-ai-marks` (full, service-backed) and `clean-user-facing-text` (text only, self-contained). Use `--list` to see them. Existing installs are kept as backups unless you pass `--force`. `--link` symlinks the checkout for live edits.

### Claude Code plugin (marketplace)

```
/plugin marketplace add guillaumemeyer/watermarks-remover
/plugin install watermarks-remover@watermarks-remover
```

Skills load as `/watermarks-remover:remove-ai-marks` and `/watermarks-remover:clean-user-facing-text`. Update with `/plugin marketplace update watermarks-remover`.

### Grok

```bash
mkdir -p ~/.grok/skills
ln -sfn "$(pwd)/skills/remove-ai-marks" ~/.grok/skills/remove-ai-marks
```

### Start the service

```bash
make serve                 # http://127.0.0.1:8765
# or:
python3 service/scripts/server.py --host 127.0.0.1 --port 8765
```

Optional system tools (used when present): `c2patool`, `exiftool`, `qpdf`. Core scripts need only Python 3.10+ stdlib.

---

## Automatic cleaning via hook

A skill is an instruction — the model decides whether to run it. A **hook** runs on every matching tool call and does not need model cooperation.

The plugin registers a `PostToolUse` hook on `Write|Edit|MultiEdit|NotebookEdit` that runs `service/scripts/hook_written_file.py`:

| Mode | Behaviour |
| --- | --- |
| `check` (default) | Reports marks, leaves the file alone |
| `clean` | Strips marks in place, notifies the model |

Set mode via plugin settings (`Hook mode`) or `WATERMARKS_HOOK_MODE=clean`. Without the plugin, add the hook yourself in `~/.claude/settings.json`.

Hooks cover files the agent writes and the pre-commit gate. Chat transcript text still depends on the skill (best-effort).

---

## Quick use

```bash
SCRIPTS=service/scripts

python3 "$SCRIPTS/inspect_file.py" draft.md
python3 "$SCRIPTS/clean_file.py" draft.md -o draft.cleaned.md
python3 "$SCRIPTS/clean_file.py" photo.png -o photo.cleaned.png
python3 "$SCRIPTS/clean_file.py" notes.docx -o notes.cleaned.docx

# Text Layer A
python3 "$SCRIPTS/inspect_text.py" draft.md
python3 "$SCRIPTS/clean_text.py" draft.md -o draft.cleaned.md --stats

# Layer B rewrite (default: print prompt only)
python3 "$SCRIPTS/rewrite_text.py" draft.md --backend print-prompt --strength paraphrase
```

Text tools refuse binary input (DOCX, PDF, images) and point you at `inspect_file.py` / `clean_file.py`. Unrecognized formats are never auto-cleaned.

---

## HTTP service

Same machinery as a stdlib HTTP server (`service/scripts/server.py`):

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/health` | `{"ok": true, "version": ...}` |
| GET | `/capabilities` | optional tools / backends |
| GET | `/openapi.json` | OpenAPI 3.0.3 spec |
| POST | `/inspect` | kind, suspicious, report |
| POST | `/detect` | detections |
| POST | `/clean` | cleaned base64 + report |
| POST | `/inspect/batch`, `/clean/batch` | per-file results (max 50) |

```bash
WM="http://127.0.0.1:8765"
curl -s "$WM/health"
curl -s -X POST "$WM/clean" -H 'Content-Type: application/json' \
  -d "{\"file\": \"$(base64 < notes.md | tr -d '\n')\", \"name\": \"notes.md\"}"
```

Set `WATERMARKS_SERVER_API_KEY` to require bearer auth. Binds loopback by default.

Detection is separate from cleaning. Text detectors (MarkLLM, keyed-Gumbel, Claude seam) and image SynthID scoring are opt-in and fail-soft.

---

## Docker

```bash
make docker-core-build
docker run --rm -p 127.0.0.1:8765:8765 --read-only --tmpfs /tmp watermarks-remover

docker compose up -d                         # core only
docker compose --profile harness up -d       # + markllm / markdiffusion
docker compose --profile heavy up -d         # + ctrlregen / synthid (local builds)
```

Published images on GHCR: core, markllm, markdiffusion. CtrlRegen and SynthID scorer stay local-only (upstream licensing). Copy `.env.example` → `.env` for optional config; nothing is required for basic text cleaning.

---

## File formats

| Format | Clean |
| --- | --- |
| PNG / JPEG / WebP | Drop C2PA / XMP / EXIF segments |
| AVIF / HEIC | Drop ISOBMFF boxes |
| BMP / GIF / TIFF | Truncate trailing meta / drop extensions & tags |
| SVG | Strip ``, XMP |
| PDF | exiftool → qpdf (structural) → optional Ghostscript deep image pass |
| DOCX / XLSX / PPTX / ODT / EPUB | Scrub props, customXml, OPF, embedded media |
| HTML / Markdown | Strip meta / JSON-LD / AI frontmatter keys + Layer A |
| MP4 / MOV / M4A / M4V / WAV / MP3 / FLAC | Drop C2PA / ID3 / LIST chunks |

PDF needs `qpdf` for a real strip (exiftool alone is incremental and leaves recoverable bytes). Ghostscript handles metadata inside embedded images. Soft-bound C2PA and pure pixel/audio/video watermarks remain out of scope for the core path.

---

## Optional backends

| Backend | Role | Notes |
| --- | --- | --- |
| reverse-SynthID | Image SynthID score | External checkout; detection only |
| CtrlRegen | Pixel-domain removal | External; heavy; conservative strength default |
| MarkLLM | Text watermark verify (KGW / SynthID) | Same-config only, not a vendor oracle |
| MarkDiffusion | Image watermark harness + DiffusionPurification | Same-config only |
| keyed-Gumbel (`detect_gumbel.py`) | Model-free same-key replay | Stdlib; needs the generation key |

Bootstrap scripts live under `service/scripts/` (`setup_synthid.sh`, `setup_ctrlregen.sh`, `setup_markllm.sh`, `setup_markdiffusion.sh`). Layer B rewrite is iterative and can be driven by these detectors when configured.

---

## How text marking works

- **Layer A** removes edit-based Unicode carriers (testable, lossless).
- **Layer B** attacks sampling watermarks via heavy rewrite (best-effort; costs style and voice).
- **File cleaners** strip C2PA / XMP / props from supported containers.

No tool can certify that a vendor detector will fail. Prefer a non-origin model for Layer B so you do not re-stamp the text.

Skip Layer B when quality matters more than hygiene: use Layer A + file cleaners and keep the original prose.

---

## Pre-commit

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/guillaumemeyer/watermarks-remover
    rev: v0.5.0
    hooks:
      - id: watermarks-remover-check   # fail on marks
      # - id: watermarks-remover-clean # opt-in: clean in place
```

---

## Ethics

For privacy and research on content you own or are authorized to process. Not for academic fraud or false “human-written” claims. Users must follow local law. The authors disclaim liability for misuse.

See `skills/remove-ai-marks/references/ethics.md`.

---

## License

MIT — see LICENSE.

## Bibliography (selected)

- [How Claude marks AI-generated content](https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content)
- Dathathri et al., *Scalable watermarking for identifying large language model outputs* (SynthID-Text, Nature 2024)
- Kirchenbauer et al., *A Watermark for Large Language Models* (arXiv:2301.10226)
- C2PA / c2patool
- Liu et al., *Image Watermarks are Removable Using Controllable Regeneration from Clean Noise* (CtrlRegen, ICLR 2025)
- THU-BPM/MarkLLM, MarkDiffusion
```
```
