---
title: "cobanov/awesome-jev"
owner: "cobanov"
name: "awesome-jev"
fullName: "cobanov/awesome-jev"
description: "A curated, source-backed list of projects built with Jev, TypeSafe AI's System One model for typed decisions."
sourceUrl: "https://github.com/cobanov/awesome-jev"
stars: 213
forks: 37
language: "未知"
topics: ["ai-agents", "awesome", "awesome-list", "confidence-aware-ai", "decision-intelligence", "jev", "llm-guardrails", "model-routing"]
license: "CC0-1.0"
defaultBranch: "main"
snapshotDate: "2026-09-20"
pushedAt: "2026-09-20T03:37:19Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Awesome Jev [*图片：Awesome*](https://awesome.re)

> A curated, source-backed list of projects built with Jev, TypeSafe AI's System One model for fast, typed, probabilistic decisions.

Jev takes program state plus typed questions and returns constrained answers with probabilities. It is designed for software decisions such as classification, routing, scoring, ranking, verification, and guardrails, rather than free-form text generation.

This list favors public source code, concrete Jev usage, clear limitations, and reproducible evidence. The latest review added **52 community projects and resources**, bringing that part of the list to **102**, alongside official resources, provider integrations, and related lists. See the September 19 research notes for pinned source evidence and review boundaries. Review completed September 19, 2026 (Europe/Istanbul); upstream event dates below are UTC.

## Contents

- Start here
- Recent developments
- Official resources
- Provider integrations
- SDKs and developer tools
- Agents, coding, and guardrails
- Context and compaction
- Browser and computer use
- Routing, data, and workflows
- Games, robotics, and interactive demos
- Media and creative tools
- Open reproductions and research
- Evaluation and calibration
- Guides and cookbooks
- Related lists
- Contributing

## Start here

- **System One shape:** text or structured state + typed questions → constrained answers + probabilities → deterministic application code.
- **Question primitives:** `Choice` selects an option, `Score` evaluates ordered rubric levels, and `Noul` returns a number from 0 to 1 representing the probability of "yes". Review or abstention behavior is defined in application code. See the [primitive reference](https://docs.typesafe.ai/primitives).
- **Input boundary:** the hosted Jev model is text-only. Browser, audio, image, and robotics projects supply extracted text or structured observations, or use separate perception models. Independent multimodal reproductions are listed separately.
- **Good fits:** semantic routing, triage, reranking, rubric scoring, moderation, verification, and low-latency decisions inside bounded workflows.
- **Important caveat:** schema-valid output is not the same as a correct decision. Validate on your own data, calibrate thresholds, keep high-impact actions behind deterministic checks, and provide a human fallback.

## Recent developments

- **September 18: Python SDK 0.7.0.** Release notes document a breaking serialization change from `msgspec` to Pydantic, a new `response_model` argument, and corrected serialization of `str` subclasses.
- **September 18: OpenRouter listing.** [Jev 1.13](https://openrouter.ai/typesafe/jev-1.13) is listed with a September 18 date. This is a provider listing date, not evidence of a separate new upstream model revision.
- **September 16: Vercel AI Gateway integration.** The [announcement](https://vercel.com/changelog/typesafe-ai-jev-now-available-on-ai-gateway) introduces typed evaluation via AI SDK's experimental `evaluate` API.
- **Current model:** [TypeSafe documents](https://docs.typesafe.ai/models) `jev-1.13.0`, with both `jev-latest` and `jev-preview` currently pointing to it. Pin the version when comparing evaluations.
- **Ecosystem refresh:** new sections cover context pruning, browser/device control, media tools, and provider integrations. Entries newly added here include both September 18 launches and earlier release-week projects missing from the initial list.

## Official resources

- [TypeSafe AI](https://typesafe.ai/) - Product overview and early-access entry point.
- [Documentation](https://docs.typesafe.ai/) - Concepts, primitives, API, patterns, and SDK guides.
- [Introducing System One Models and Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) - Launch post covering the model interface, RLCD, published performance claims, demos, and caveats.
- typesafe-sdk-js - Official TypeScript and JavaScript SDK with inferred answer types.
- typesafe-sdk-python - Official synchronous and asynchronous Python SDK.
- system-one-adapter-python - Drop-in adapter for comparing the System One interface with LLM providers.
- skills - Official agent skills for building and evaluating System One workflows.
- [Models and aliases](https://docs.typesafe.ai/models) - Version IDs, current limits, pricing, and the distinction between stable and preview aliases.
- [Confidence](https://docs.typesafe.ai/confidence) - Distinguishes Choice/Score confidence from answer probability; Noul has no separate confidence field.
- [Jev 1.13 jaggedness](https://docs.typesafe.ai/model-jaggedness/jev-1.13) - First-party limitations covering arithmetic, dates, distractors, adversarial state, and structural inconsistencies.

## Provider integrations

- [Cloudflare AI](https://developers.cloudflare.com/ai/models/typesafe/jev/) - Provider-maintained `typesafe/jev` integration accepting state and typed questions.
- [OpenRouter](https://openrouter.ai/typesafe/jev-1.13) - Provider listing for `typesafe/jev-1.13`, alongside the moving `typesafe/jev-latest` alias.
- [Vercel AI Gateway](https://vercel.com/changelog/typesafe-ai-jev-now-available-on-ai-gateway) - `typesafe-ai/jev` through AI SDK's experimental `evaluate` interface; its Boolean primitive corresponds to TypeSafe's Noul.

## SDKs and developer tools

Community-maintained clients and tools; official TypeSafe SDKs are listed above.

- advocaat - Small type-safe client for asking Jev questions about datasets.
- hunch - Probabilistic control flow for Ruby: `if Hunch.likely?("fraudulent", given: order)` branches on a typed Jev answer, with graded predicates from `possibly?` to `definitely?`.
- jev - Elixir/OTP client designed around GenServer replies and pattern matching.
- jev-axi - CLI for picking, rating, checking, ranking, triaging, and guarding from the shell.
- jev-dsl - Early-alpha Haskell DSL that encodes typed question packets and decodes answers; HTTP transport is left to the caller.
- jev-mcp - MCP server exposing classify, score, check, match, and screen tools.
- jev-mcp - An eval-first MCP server for Jev, that returns typed judgments (noul, choice, score) with probabilities instead of generated text.
- jev-shell-history - Ranks existing zsh history entries for inline completion; accepting a suggestion does not execute it.
- jev.nvim - Neovim plugin that splits the buffer into functions with Treesitter, scores each against a plain-language question with Jev, and ranks answers by probability in the quickfix window.
- Jevbridge - ACP/MCP adapter for using Jev alongside coding and chat models.
- jevclient - Async Python client for typed Jev questions and probabilities.
- jevr - Native R client for typed questions and provider-independent answers through TypeSafe or OpenRouter.
- laravel-typesafe-jev - Laravel integration with typed responses, async requests, and testing fakes.
- ruby_decision_model - Ruby client with standard-library transport for TypeSafe and OpenRouter decision endpoints.
- semdecide - Typed semantic decisions for Unix pipelines and CI.
- typesafe-go - Idiomatic Go SDK for the TypeSafe API.
- typesafe-mcp - MCP connector that gives agents access to Jev decisions.
- typesafe-sdk-java - Community Java 17 client for Choice, Score, and Noul, with an optional Spring Boot starter.
- zod-jev - Pairs local Zod shape validation with Jev semantic validation.

## Agents, coding, and guardrails

Source-reviewed experiments and integrations. A model judgment does not establish safety or replace the host application's permission checks.

- agent-router - Pre-release Herdr integration that filters eligible coding models by quota and policy before Jev ranks them.
- blink - Navigates file and directory names with Jev-guided walkers to find codebase paths for a natural-language query.
- Canny - Evidence ledger that challenges unsupported "done" claims from coding agents.
- commit-miner - Classifies Git diffs and commit messages into change types and candidate security-fix/CWE labels for inspection.
- foreman - Software-factory supervisor that uses Jev to keep coding agents on task.
- is-malicious - Scans source, configuration, build, and CI files with Jev, then reports suspicious behavior and implicated lines before the code is run.
- jev-agent-skill - Claude Code/ZCode skill that offloads classify, screen, score, and compliance-check judgments to Jev via OpenCode Zen's free tier; ships a retry-hardened zero-dependency caller and a shop comment-triage pipeline.
- jev-belay - Claude Code Stop hook that checks the transcript for evidence before trusting a "done" claim, spending one four-question Jev call only when files changed with no passing check since, and failing open on every error path.
- jev-codex-router - Per-turn Codex model, reasoning, and speed-mode routing.
- jev-commit - Pre-commit hook where one Jev call judges whether the commit message matches the staged diff, flags debug leftovers and unmentioned work, and blocks only when it detects a credential.
- jev-guard - Cross-agent tool-call risk scoring with allow, ask, and deny outcomes.
- jev-pref - Linter that has Jev check code changes against project preferences from `jev-pref.json` and feeds findings back to coding agents.
- jev-review - Staged code-review workflow with a local dashboard.
- jev-review MCP plugin - Local-first continuous software-quality review for coding agents.
- jev-router - Chooses a model for each fresh Claude Code or Codex turn while wrapping the existing CLI.
- jev-scout - MCP server that scores an agent's every search query, result, and fetched page for relevance and credibility, with session budgets, SSRF-guarded fetching, and a live decision dashboard.
- jev-use - Claude Code / Codex / pi plugin where Jev answers batched noul, choice, and score questions and risk-checks tool calls, while a typed escalation contract hands writing and unsure steps back to the LLM.
- jevwire - MCP tools, an embeddable decision library, and advisory or restrictive Claude Code hooks; judgments do not grant native permissions.
- opencode-jev-orchestrator - Keeps an OpenCode parent model fixed and uses Jev difficulty judgments to delegate harder turns to temporary subagents.
- perch - Semantic code linter that evaluates code units against configurable Jev questions.
- pi-jev - Measured tool-call gate and general typed decision layer for the Pi coding agent.
- pi-warden - Pi extension that judges rule compliance, risky actions, stuck loops, and completion claims; enforcement depends on the hook and policy.
- skillbox - Self-hosted skill library with optional Jev relevance recommendations over an authorized catalog.
- skillranker - Rust CLI that ranks agent skills against live session context and can abstain.
- supercov - Scores source files so coding agents can prioritize code-quality work.
- wakegate - Experimental gate where Jev decides whether a timer or incoming event is worth resuming a sleeping agent's LLM; code skips only when Jev is confident and always wakes on user messages, errors, and a skip limit.

## Context and compaction

These tools select what reaches a model. Preserving retained text verbatim does not prove that omitted history was unnecessary.

- fast-dev-compaction - Codex port that restores Jev-selected verbatim history around native session compaction.
- fast-jev-compaction - Claude Code plugin and library that score tool-call/result pairs for deletion or truncation while retaining selected text verbatim.
- pi-fast-jev-compaction - Pi extension that prunes stale tool history and leaves summary compaction to Pi when pruning is insufficient.
- pi-jev-compact - Selective, verbatim context compaction for Pi using Jev model.
- pi-jev-context - Opt-in Pi extension that filters older messages from model requests while preserving the original session history.
- winnow - Judges tool results before admitting them into Claude Code context.
- yoshi - Experimental Claude Code/Codex proxy that uses Jev to prune request context while preserving tool-call protocol structure.

## Browser and computer use

These projects can operate real browsers or devices when enabled. Published demos have task-specific success criteria and do not establish general reliability.

- BrowserClaw - Zero-lock, session-preserving Chrome MCP server that couples a local Jev System One semantic micro-loop (`chrome_act_toward_goal`) with an 85%+ pruned DOM tree (Shadow DOM & iframe pierced), dispatching native CDP events (`isTrusted: true`) on active logged-in sessions without focus theft.
- jev-browser - Browser-use experiment powered by Jev decisions.
- jev-browser-use - Codex browser skill that uses Jev for navigation and target selection while Codex handles text entry and outcome verification.
- jev-social - Local Instagram and TikTok research app where Jev selects a platform and bounded socai operation from observed state, while code enforces confidence and the socai CLI executes the browser step.
- jev-ultrafast - Browser agent where Jev selects an operation and compatible DOM target, and a separate LLM supplies typed text.
- jev-voice-browser - Maps partial speech transcripts to browser intents and observed targets, with code deciding whether to act, wait, or ask.
- Jev for Chrome - Unofficial Chrome extension (Manifest V3) port of Jev Ultrafast: Jev picks the operation and DOM element in one request, a small text model writes typed values, and it runs in the user's own tabs through OpenRouter, TypeSafe or Cloudflare; includes a 17-task headless-Chromium suite with recorded traces.
- mobile-jev - Android agent using Mobilerun observations and bounded Jev actions; execute mode controls a real device, while the published Uber demo stops before booking.
- typesafe-computer-use - macOS computer-use experiment using OCR plus bounded Jev action selection.

## Routing, data, and workflows

- duckdb-jev - DuckDB extension that exposes Jev judgments as SQL values with return types derived from the declared criteria.
- HA-Jev - Home Assistant integration exposing typed answers as sensors, automation actions, and an Assist conversation agent.
- hono-jev-router - Routes Hono HTTP requests by meaning.
- jev-align (Sutro) - Active-learning CLI where Jev evaluates rows and surfaces uncertain or audit samples for human labeling, then GEPA proposes revised decision definitions that the user can accept or reject.
- jev-curate - Streaming filter and scorer for Parquet and JSONL datasets.
- jev-logtriage - Jev scores collapsed log batches for noise, severity, and whether an operator should act. Code maps the answers to suppress, watch, review, notify, or page. Nothing is executed.
- jev-reranker - Retrieval and RAG: uses Jev Noul judgments to assess retrieved documents for relevance and usefulness as answer evidence, then sorts results and optionally filters them using a configurable threshold.
- jev-reviewer - Research-document extraction aid where Jev selects and verifies source lines for verbatim quotes; findings require human review and are not clinical decisions.
- jev-search - Uses Jev to select search sources and rank Search1API results, returning source links and snippets.
- jev-trade - Hyperliquid trading desk where Jev answers Choice questions for long/short, open/close/hold, and leverage; application code quotes or sends no order. Defaults to a dry run; a live key can place real orders.
- jev-trader - Kuru/Monad trading experiment with optional Jev buy/sell decisions; defaults to a mock model and dry-runs without a private key, but configured execution can place real orders.
- jev-tree - Recursive choice over taxonomies larger than Jev's direct option limit.
- jevlogs - OpenTelemetry log triage before more expensive analysis.
- jevql - psql-shaped client and Go/TypeScript/Python SDKs for vanilla Postgres where Jev makes Noul, Choice, and Score judgements about individual table rows after the plain SQL has run on the server, and the client applies the resulting filter, sort, or group.
- jevsql - SQL-like filtering, ranking, classification, and scoring with natural-language predicates.
- llama-index-jev - LlamaIndex reranker and selector using Jev Score and Choice answers, with configurable confidence handling.
- n8n-nodes-typesafe-jev - Community n8n node for asking multiple typed questions over workflow state.
- pg-jev - PostgreSQL extension for semantic questions over table rows.
- pg_typesafe - Pre-alpha PostgreSQL C extension exposing Choice, Noul, Score, and batched judgments from SQL.
- tax-doc-classifier - Classifies text-bearing PDF pages into IRS form and page-kind candidates with a confidence gate; document triage, not tax advice, and scanned pages need OCR.
- tiershift - Policy-bounded model routing for TypeScript and Python.
- typesafe-jev-workflow - LangGraph email-intent workflow using a typed Jev choice.

## Games, robotics, and interactive demos

- heist-one - Browser stealth game where Jev judges guards while deterministic code owns the world.
- jev-canvas - Voice and finger-pointing control of a tldraw canvas: Jev picks the action, target shape and place from each partial transcript plus the fingertip position; deterministic code applies thresholds and executes the edit.
- jev-drone - Simulated MuJoCo quadrotor with Jev making slower tactical judgments from processed camera observations; deterministic code controls flight.
- jev-experiments - Collection of inspectable Jev demos, including scripted support conversations with typed intent, escalation, and suggested-response decisions.
- jev-palette - Command-palette demo where a single Choice question over a 77-command catalog turns the returned probability distribution into the per-keystroke ranking for Portuguese or English input; deterministic code executes the selected command, with a classic fuzzy-match baseline shown side by side.
- jev-plays-pokemon-red - Pokemon Red on PyBoy where deterministic code owns the route and arithmetic and Jev picks only at branches, with every battle turn's faint prediction scored by Brier against the emulator's RAM state.
- jev-tetris - Tetris where deterministic code enumerates every reachable placement, including tucks and spins, and writes each one as an English sentence; Jev returns a probability for all of them across five Choice questions, and the highest-weighted option is played while the whole distribution is drawn on the board. Ships a shuffled-probability control and a 23-line regex baseline over the same sentences, which outscores the model.
- JevPilot - Three.js driving simulation where Jev chooses among candidate paths and speeds while local code handles vehicle dynamics and geometry.
- JevScape - RuneBench-based RuneScape harness that maps Jev choices to a bounded game-action catalog and records tick-level results.
- killmyidea - Startup-idea evaluator that chooses kill, fix, or ship.
- tsai-sc - Original StarCraft shareware controlled with recorded Jev action probabilities.
- typesafe-mario - Super Mario Bros. agent choosing actions from structured emulator state.
- typesafe-snake - Snake autoplayer with one typed decision per tick and code-generated legal moves.

## Media and creative tools

- jev-skip - Browser extension that reads the YouTube caption track and paints a per-segment sponsor probability on the seek bar before the intro ends, with no crowd database; reports catching 77% of SponsorBlock's sponsor seconds across 23 videos at $0.0008 a video.
- jevmeter - Scores every sentence in a video and renders the result as an overlay.
- Jevthoven - Symbolic-music studio where Jev chooses plans, instruments, and bar patterns, and code renders editable music and MIDI.
- SlidePilot - Experimental Slidev controller that judges speech transcripts for slide completion, with deterministic checks and manual navigation.
- Sponsor Skip - Finds sponsor reads in YouTube transcripts or transcribed audio while code owns timestamps and playback skipping.
- unclutter - Browser extension that uses Jev to identify page clutter and saves reusable, reversible hiding rules.
- Vibe Check for X - Chrome extension that scores draft posts and reply context before posting; optional media descriptions come from a separate vision model.

## Open reproductions and research

These projects explore Jev-like interfaces or open implementations. They are independent efforts, not official TypeSafe releases or verified reproductions of its proprietary architecture, RLCD training, or calibration.

- Jev Visual - Educational MLX/Qwen vision-language experiment sharing image context across candidate-scoring questions; its probabilities are not calibrated correctness estimates.
- Jevlike - Trainable encoder and option-attention head for variable candidate sets, with separate visual game experiments.
- LitJev - Reproduction of Jev that turns any Qwen model into a fast decision model, serving the same `/v1/systemone` schema (Choice, Score, Noul) with no training and no generated answer text.
- jevmlx - Jev-style parallel constrained decisions for MLX models on Apple Silicon.
- kev - Qwen2.5-0.5B adapter and decision head with training code, released weights, and parallel typed-question inference.
- NanoJev - Small parallel-decision model with dynamic candidates, a training pipeline, and recorded game comparisons that include shared code planning.
- openjev - Local bilingual probability decisions from context, questions, and candidate answers.
- OpenJev (DiffusionGemma) - Independent Jev-compatible server over DiffusionGemma/vLLM; the documented setup requires custom vLLM patches.
- openjev-sglang - Jev-compatible API endpoint backed by open models and prefill-only inference.
- openvons - Open decision layer for finite options across text, images, and Japanese voice commands.
- parallelConstraintDecoding - Java and llama.cpp experiments in parallel constrained decoding.
- PlayJev - Open 0.8B vision-language model that reads a 448 px game frame and returns one move from the game's typed option list with a probability on each, one forward pass and no generated text; the game loop executes the argmax, the confidence gates an optional handover to a search program, and the weights and a ten-game browser demo are public.
- reflex - Open-model decision engine with shared-state inference, isolated question branches, and a WebGPU demo; browser and Python configurations differ.
- SemIf - Formerly OpenJev: an independent study of typed option readout from frozen open models, with shared-prefix experiments and a WebGPU demo.
- Simple Jev - Transforms compatible open-model logits into typed decisions without a separately trained classifier head; model compatibility is constrained.
- Verdict-open-jev - ModernBERT decision engine with calibrated uncertainty and a WebGPU playground.

## Evaluation and calibration

Results belong to each project's dataset, prompts, model version, and measurement setup. Inclusion means the evidence is inspectable, not that benchmarks were independently rerun.

- Janus - Measures when to use Jev versus other models and routes accordingly.
- jev-behavior-study - Independent synthetic-task study of Jev 1.13.0 framing sensitivity and failures, with raw responses and offline report checks.
- jev-benchmarks - Reproducible evaluation for calibration, selective risk, and latency.
- jev-decision-benchmarks - Independent evaluation of Jev on MetaTool, When2Call, and BFCL V4 agent decision tasks, focusing on tool selection, abstention, and tool-use decisions. Includes comparison tables against Claude, Qwen, and GPT models.
- jev-eval - Independent Jev versus GPT-5.6 Terra comparison on three labeled classification tasks, reporting accuracy, calibration, latency, and cost.
- jev-eval-agent - Compares LLM tool selection with Jev routing in a personal-assistant harness containing 100 mocked tools.
- jev-korean-benchmark - Small Korean/English sample study with recorded responses, including medical-text questions; not a clinical validation.
- jev-orderby-bench - Measures whether ORDER BY over a Jev probability is defensible (inversion rate, Score ordinality against a human grade, calibration, wording invariants, sort-key ties) under a pre-registered gate; passes on 20 Newsgroups topics, fails four of six conditions on Amazon ESCI product relevance, and shows a DuckDB extension's default 40-row batching fails the ranking gate that one row per request passes.
- jev-scout golden-set study - Hand-labeled 25-item search-triage study with pinned rubric versions and a drift baseline; reports 88% relevance and 96% credibility with all four misses decomposed.
- jev-search-rerank-eval - Chinese/English retrieval evaluation comparing Jev reranking with lexical, embedding, and fusion baselines, including judge-circularity analysis.
- jevcal - Fits and drift-checks confidence thresholds against labeled data.
- typesafe-ai-benchmark - LLM gateway that mimics the System One output shape for comparison work.

## Guides and cookbooks

- Building with Jev - Community agent skill covering question design, state preparation, confidence thresholds, and debugging decisions.
- [Classifying RAG passages](https://docs.typesafe.ai/cookbooks/classifying_rag_passages) - Official example of judging retrieved passages before passing them to an answering model.
- [Date extraction](https://docs.typesafe.ai/cookbooks/date_extraction_cookbook) - Official pattern separating typed extraction from date validation and arithmetic in code.
- [Double-checking citations](https://docs.typesafe.ai/cookbooks/citation_check) - Official example of checking whether source context supports a claim.
- Jev Cookbook - Community cookbook of 15 runnable recipes where Jev picks categories, tags, dates, duplicates and next browser actions while deterministic code owns thresholds, review bands and every action.
- [Parallel questions](https://docs.typesafe.ai/cookbooks/parallel_questions) - Official worked example of evaluating many questions over shared state in one request.
- [Skill suggestion](https://docs.typesafe.ai/cookbooks/skill_suggestion) - Official two-stage workflow that selects a skill and can reject the shortlist.

## Related lists

- awesome-jev-by-typesafe - Evidence-backed use cases, patterns, prompts, and starter code.
- awesome-jev - Large community directory with a searchable companion site.
- yibie/awesome-jev - High-signal field guide organized by decision domain.
- awesome-typesafe - Broader TypeSafe and System One ecosystem list.
- OmniJev/awesome-jev - Papers, open reproductions, independent evaluations, and technical lineage.
- awesome-jev-typesafe - CC0, awesome-lint clean, sorted by what you would install, with a short know-before-you-build section on the limits.
- MrJev/awesome-jev - Selective list with a 10-star bar and hands-on reviews of each tool at mrjev.com.

## Contributing

Built something with Jev? Read CONTRIBUTING.md and open a pull request. Small projects are welcome when the source clearly shows a concrete Jev decision loop.

## License

CC0 1.0 Universal. Linked projects keep their own licenses.

## Acknowledgements

Discovery used public GitHub search, TypeSafe and provider documentation, and the related community lists above. Descriptions added in this refresh were checked against pinned project READMEs and relevant source files; the research notes record those sources. Inclusion is not an endorsement by TypeSafe AI or a claim of production readiness.
