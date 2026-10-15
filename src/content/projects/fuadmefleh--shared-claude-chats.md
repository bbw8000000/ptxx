---
title: "fuadmefleh/Shared-Claude-Chats"
owner: "fuadmefleh"
name: "Shared-Claude-Chats"
fullName: "fuadmefleh/Shared-Claude-Chats"
description: "An archive of public Claude and Grok conversations, exported from their share links as plain markdown, plus the two scripts that produce it."
sourceUrl: "https://github.com/fuadmefleh/Shared-Claude-Chats"
stars: 235
forks: 66
language: "Python"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-07-28"
pushedAt: "2026-07-27T21:26:41Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Shared AI Chats

An archive of public Claude, Grok, and Kimi conversations, exported from their
share links as plain markdown, plus the three scripts that produce it. A
handful of other conversations, added by hand from sources with no public
share link, live alongside them.

1,334 conversations, 15,252 messages, ~38 MB.

| Directory | Source | Conversations | Messages | Longest |
| --- | --- | --- | --- | --- |
| `claude_chats/` | `claude.ai/share` | 755 | 7,865 | 282 |
| `grok_chats/` | `grok.com/share` | 519 | 7,210 | 4,308 |
| `kimi_chats/` | `kimi.com/share` | 57 | 171 | 28 |
| `aistudio_chats/` | Google AI Studio (manual) | 3 | 6 | 4 |

## Layout

```
scripts/claude_share_export.py     exporter for claude.ai shares
scripts/grok_share_export.py       exporter for grok.com shares
scripts/kimi_share_export.py       exporter for kimi.com shares
scripts/aistudio_export.py         converter for raw Google AI Studio page copies
link_lists/claudeaisharelinks.txt  the claude.ai links this archive was built from
link_lists/grokaisharelinks.txt    the grok.com links this archive was built from
link_lists/kimiaisharelinks.txt    the kimi.com links this archive was built from
raw_google_dumps/                  raw AI Studio page copies aistudio_export.py reads
claude_chats/                      one markdown file per Claude conversation
grok_chats/                        one markdown file per Grok conversation
kimi_chats/                        one markdown file per Kimi conversation
aistudio_chats/                    one markdown file per AI Studio conversation

claude_chats/.claude-share-export.json manifest for claude_chats/
grok_chats/.grok-share-export.json     manifest for grok_chats/
kimi_chats/.kimi-share-export.json     manifest for kimi_chats/
aistudio_chats/.aistudio-export.json   manifest for aistudio_chats/
```

Every conversation is one markdown file, named from its title:

```
Adding-Kerberos-Authentication-to-Hadoop-Cluster-on-EC2.md
AI-inflection-point-and-the-future-of-automation.md
네이버-AI-모델서비스-기획-직무-기업조사-리포트.md
```

Titles keep their original script rather than being transliterated, so non-Latin
filenames are expected. A conversation with no usable title falls back to its
snapshot UUID (`18754235-198d-446b-afc6-26191ea62d27.md`).

## File format

All four converters write the same shape: a metadata header, then alternating
turns separated by a horizontal rule.

```markdown
# 네이버 AI 모델/서비스 기획 직무 기업조사 리포트

- Source: https://claude.ai/share/b76ffb8c-8a9d-43fb-b02d-0990e2e2fc7c
- Author: 쏠테크
- Created: 2026-02-04
- Messages: 2

---

## Human

당신은 자기소개서 작성을 돕기 위해…

---

## Assistant

# 조사 전략
…
```

The `---` before each turn is load-bearing. Message bodies contain their own
markdown headings, so without it a `## Assistant` turn marker would be
indistinguishable from a heading written inside a reply.

The headers differ slightly by source: Claude and Kimi transcripts carry
`Author`, Grok and AI Studio transcripts carry `Model`. Grok transcripts may
also include generated-image links, attachment names, and — when exported with
the relevant flags — quoted thinking steps and cited web/X sources. Kimi
transcripts may include quoted `Tool:` blocks — web search, code execution, or
other tool calls the assistant made mid-turn, rendered inline rather than
gated behind a flag. AI Studio transcripts may include `[Attachment: name
(size)]` markers for uploaded files, and omit `Source` entirely when the raw
dump didn't record a `LINK:` line.

## Manifests

`claude_chats/.claude-share-export.json`, `grok_chats/.grok-share-export.json`,
`kimi_chats/.kimi-share-export.json`, and `aistudio_chats/.aistudio-export.json`
map each conversation to the file written for it, plus title, message count,
and export timestamp. Each converter reads its own manifest to skip
conversations it already has, so re-running the same input is cheap. Deleting
a manifest means the next run reconverts everything it covered.

For the three share-link exporters, a manifest is looked for in the output
directory and then just above it, and a transcript that has since been moved
into a subdirectory is recognised by name rather than downloaded again.
`aistudio_export.py`'s manifest keys on a hash of the raw dump's own bytes,
since dumps have no id of their own.

## Adding more

Claude and Grok need `curl_cffi`; Kimi needs `requests`:

```bash
pip install -r requirements.txt
```

Put share links in a file, one per line — blank lines and `#` comments are
ignored:

```
# new batch
https://claude.ai/share/b76ffb8c-8a9d-43fb-b02d-0990e2e2fc7c
https://claude.ai/share/7a9b58a6-0903-4964-8207-cbe44de743ff
```

Then export into the matching directory:

```bash
python3 scripts/claude_share_export.py link_lists/claudeaisharelinks.txt -o claude_chats
python3 scripts/grok_share_export.py   link_lists/grokaisharelinks.txt   -o grok_chats
python3 scripts/kimi_share_export.py   link_lists/kimiaisharelinks.txt   -o kimi_chats
```

Any of the three also takes bare links or ids as positional arguments, `-f
FILE` (repeatable) instead of a positional links file, and `-o` defaults to
the current directory. Kimi links may carry a locale segment
(`kimi.com/share/en/`) and tracking query strings (`?ra=1`); both are
stripped down to the bare id before fetching.

Already-archived conversations are skipped, so it's safe to keep appending to
one links file and re-run it. Use `--force` to re-fetch a conversation that has
gained messages since it was archived — the archive is a snapshot, not a live
mirror.

Optional content flags, off by default (Claude/Grok only — Kimi has none, its
tool-call blocks are always included):

- `--include-thinking` (both) — thinking blocks, where the snapshot exposes them
- `--include-sources` (Grok only) — web pages and X posts cited by each answer

### AI Studio (manual)

Google AI Studio prompts (`aistudio.google.com/app/prompts/...`) sit behind a
Google login — there's no public share API to fetch, so there's no `-links.txt`
workflow here. Instead:

1. Select-all-copy the chat page's text and paste it into a new `.txt` file
   under `raw_google_dumps/`. Optionally prepend a `LINK: ` line so the
   transcript records where it came from.
2. Convert it:
   ```bash
   python3 scripts/aistudio_export.py raw_google_dumps -o aistudio_chats --model "Gemini 2.5 Pro"
   ```
   `aistudio_export.py` strips the page's own UI chrome (`ThinkingThoughts`,
   `chevron_right`, the disclaimer footer, `file thumbnail` blocks) and splits
   on the `User`/`Model` speaker labels it leaves behind. `--model` is recorded
   on every transcript in the run; there's no way to detect it from the dump.
3. If a copy missed a reply's text (AI Studio sometimes only copies the
   collapsed thinking-toggle chrome, not the response under it), the script
   prints a warning and writes `_[empty message -- not captured in the raw
   copy]_` — paste the missing text back into the dump and rerun.

Already-converted dumps are skipped on rerun (matched by content hash); use
`--force` to reconvert one you've edited.

## Caveats

Only public shares are reachable through the three `*_share_export.py` scripts;
there is no authenticated path, so revoked or private conversations return
"not found." The links files have been pruned to what actually exported, so a
fresh run of any of them should come back clean. `aistudio_chats/` is the
deliberate exception — those conversations were never public, so they're
transcribed by hand from a private, logged-in session instead of fetched.

Claude's and Grok's share pages are empty SPA shells, so those two exporters
read the underlying JSON APIs directly. Those endpoints sit behind a
Cloudflare check that fingerprints TLS rather than headers, which is why they
use `curl_cffi` (browser TLS impersonation) instead of plain `requests`. Kimi's
share page is server-rendered instead — the conversation JSON is embedded in a
`window.HYDRATION_INIT_STATE = {...}` script tag, no separate API call needed —
and it isn't behind a Cloudflare gate, so `kimi_share_export.py` uses plain
`requests`.

Some fidelity is lost upstream. Claude's own share API flattens tool calls and
search widgets to a literal `This block is not supported on your current device
yet.` fence, and that placeholder is what lands in these files. Nothing in the
export pipeline can recover the original content.
