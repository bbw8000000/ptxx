---
title: "vlad-terin/jev-browser"
owner: "vlad-terin"
name: "jev-browser"
fullName: "vlad-terin/jev-browser"
description: "Jev-powered element selection for your agent’s existing computer-use tools"
sourceUrl: "https://github.com/vlad-terin/jev-browser"
stars: 56
forks: 5
language: "JavaScript"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-18"
pushedAt: "2026-09-18T02:23:41Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Jev Browser

An agent skill and runtime that uses Jev to select browser actions through your existing tools.

Your agent plans the task once. Jev selects elements inside a continuous observation, action and verification loop—without an agent turn between every step.

For multi-step navigation, the agent supplies concise directional guidance: useful concepts or categories to move toward and ambiguities to avoid. Jev chooses the actual observed links. Pass that guidance once with the task; no extra planning call is required at each hop. See the WikiRace scenario and workflow for recorded examples.

## Examples 

Excalidraw drawing: 

https://github.com/user-attachments/assets/2e456743-96d5-4ad9-8ca3-97f7b6ed11f2


## Quick start

The tested setup is **Codex with compatible browser tools**, **Node.js 22+**, and a **[TypeSafe API key](https://console.typesafe.ai/)**. Jev Browser supplies the skill and runtime; your agent supplies browser access.

Install or update the Codex integration from this repository:

```sh
npm run install:codex
```

Then paste this into Codex:

```text
Install https://github.com/vlad-terin/jev-browser for Codex.
Check Node.js 22+, compatible browser tools and TYPESAFE_API_KEY first.
Keep the key in my local environment; never print it or put it in chat.
Read the installer, run npm test, then run npm run install:codex.
Load the jev-browser skill
and test a read-only navigation using the continuous runner.
Report runner time separately from setup and planning.
```

Reload skills or start a new session if needed. Then ask:

> Use jev-browser to browse Hacker News, filter to the last month, and open the first article.

Manual installation · Other agents · Make Jev the default

## How it works

```text
Agent prepares a bounded plan
  → snapshot → Jev selects → browser acts → verify → next step
  → final result and timing
```

The runner returns control to the agent when a step needs help. It records selection, observation, action and total runner time. Setup and planning are measured separately.

## Codex + CUA integration

The installed Codex runtime exposes one composed entry point,
`createCodexCuaSession(...)`. It keeps Jev's semantic choice loop and Codex's
physical interaction layer together, while resolving `TYPESAFE_API_KEY` inside
the local Node runtime rather than copying it into the CUA REPL.

```js
var { createCodexCuaSession } =
  await import('file:///ABSOLUTE_SKILL_DIR/runtime/src/index.mjs');
var codexBrowser = {
  tabs: { new: () => cua.createBrowserTab('chrome', undefined, { sessionName: '⚡ Jev' }) }
};
var jevCua = await createCodexCuaSession({ browser: codexBrowser });
```

`jevCua.workflow(...)` runs a bounded continuous workflow. Jev chooses an
observed semantic target for target-relative actions; CUA executes it and the
runner verifies an independent postcondition. `jevCua.wikiRace(...)` uses that
same configured session for bounded concurrent navigation jobs.

### First-class CUA actions

The CUA adapter covers the interactions that ordinary link traversal cannot:

| Action | Intended use |
|---|---|
| `click`, `setValue`, `selectText` | Semantic control and editable-cell interaction |
| `secondaryAction`, `scroll` | Accessibility actions and target-relative scrolling |
| `paste`, `typeText`, `pressKey` | Focused editor input, clipboard workflows, shortcuts |
| `drag` | Coordinate range selection and custom-grid manipulation |

Direct focus/coordinate actions intentionally do not ask Jev to invent an
element choice. For target-relative actions, the adapter re-observes the AX
snapshot and rejects stale selections before CUA dispatches input. This is an
integration layer, not a claim that the link-navigation evaluation below
measures spreadsheet, drawing-canvas, or arbitrary desktop-app reliability.

## Token and choice limits

Small snapshots use one request. Larger snapshots automatically split page text and element choices, run up to six requests in parallel, then compare shortlisted candidates in a final call. Token-limit rejections trigger bounded subdivision.

TypeSafe’s [Choice primitive](https://docs.typesafe.ai/primitives/choice) allows 255 options; we reserve one for “none.” Token sizing is estimated, and splitting adds calls and can lose cross-chunk context. Configuration and details.

## Compatibility

**Experimental.** The continuous browser adapter is tested with Codex’s browser runtime. The CUA adapter supports the first-class primitives above for spreadsheet and custom-grid work. Claude Code has a skill installer and selection CLI; its continuous loop needs compatible adapter wiring. Other agents can integrate through the same interfaces.

The Codex adapter supports bounded multi-tab workflows with named tabs, link opening, tab switching, and destination verification (12 workflow tabs by default, configurable). Existing single-tab calls still work. Visual-only controls and unexpected script-created popups may need host assistance. Page text is sent to TypeSafe.

The optional global CLI returns selections; it does not install an agent skill or browser. CLI installation and agent support.

## Recorded live navigation evaluation

Latest available results per website are shown below. **Wikipedia now shows the directional rerun: 20/20 completed**, one tab at concurrency 1. The other 19 websites retain their original concurrency-3 results; **no new runs were performed for them**.

Every website links to its scenario, workflow, exact goal and recorded trial routes. Timing and step medians describe successful runs. Steps are observed verified link hops, not proven shortest paths. Token totals cover all attempts in that row and exclude Codex usage; **Not captured** means unavailable, not zero.

| Website | Task destination | Completed | Median | P95 | Steps: median | Jev tokens: input / output |
|---|---|---:|---:|---:|---:|---:|
| Wikipedia | Three directional WikiRace pairs | 20/20 | 9.65s | 20.75s | 4 | 4,479,289 / 511,079 |
| Python | Control-flow tutorial | 20/20 | 1.66s | 2.23s | 2 | Not captured |
| MDN | JavaScript Functions guide | 20/20 | 2.09s | 3.56s | 1 | Not captured |
| Node.js | File-system API | 14/20 | 5.16s | 8.95s | 1 | Not captured |
| React | Sharing State Between Components | 20/20 | 6.09s | 8.14s | 2 | Not captured |
| TypeScript | Narrowing | 20/20 | 3.32s | 4.07s | 1 | Not captured |
| Rust | What Is Ownership? | 20/20 | 1.68s | 2.89s | 1 | Not captured |
| Go | Generics tutorial | 20/20 | 1.26s | 2.34s | 1 | Not captured |
| SQLite | SELECT documentation | 20/20 | 2.19s | 3.61s | 2 | Not captured |
| PostgreSQL | SQL-language tutorial | 20/20 | 4.65s | 5.86s | 4 | Not captured |
| Git | Rebase manual | 20/20 | 2.12s | 3.05s | 1 | Not captured |
| GitHub Docs | Pull requests | 18/20 | 10.67s | 18.93s | 6 | Not captured |
| Docker | What is a container? | 18/20 | 23.43s | 27.70s | 13 | Not captured |
| Kubernetes | Pods | 20/20 | 5.73s | 8.35s | 3 | Not captured |
| Vue | Form Input Bindings | 20/20 | 2.08s | 8.63s | 1 | Not captured |
| Svelte | Overview | 20/20 | 1.99s | 2.85s | 1 | Not captured |
| Django | First-app tutorial | 20/20 | 1.54s | 2.29s | 1 | Not captured |
| Flask | Quickstart | 20/20 | 2.39s | 3.01s | 1 | Not captured |
| NumPy | Absolute basics | 20/20 | 2.14s | 4.46s | 1 | Not captured |
| Chrome for Developers | Console overview | 17/26 | 5.51s | 11.39s | 2 | Not captured |

This table combines separate recorded runs; do not interpret it as a single pooled benchmark or attribute the Wikipedia change to guidance alone. The original 406-attempt benchmark (375 completions, including Wikipedia 8/20) is preserved in historical results. Chrome retains six original target-URL errors in its 17/26 total; the corrected subset completed 17/20.

Full metrics and measurement coverage · Metrics CSV · Scenario index

## Documentation

- Installation, updates and default routing
- Continuous runner and Codex adapter
- Other browser tools and normalized snapshots
- Library API and configuration
- Recorded live results and per-site statistics
- Live methodology and limitations

## Development

```sh
npm test
npm run demo                       # offline
npm pack --dry-run
```

Powered by [TypeSafe’s Jev](https://docs.typesafe.ai/). MIT licensed.
