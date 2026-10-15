---
title: "decionis/agent-safe-pipeline"
owner: "decionis"
name: "agent-safe-pipeline"
fullName: "decionis/agent-safe-pipeline"
description: "Reference architecture for AI agents that propose actions but cannot authorize them — immutable intent capture, an independent Decionis policy verdict (ALLOW/ESCALATE/BLOCK), verified human approval, and a SafeExecutor that consumes a single-use intent-bound grant."
sourceUrl: "https://github.com/decionis/agent-safe-pipeline"
stars: 467
forks: 59
language: "TypeScript"
topics: ["agentic-ai", "ai-agent-permissions", "ai-agents", "ai-governance", "ai-safety", "authorization", "decionis", "human-in-the-loop"]
license: "Apache-2.0"
homepage: "https://decionis.com/docs?utm_source=github&utm_medium=org_readme&utm_campaign=dev_discovery"
defaultBranch: "master"
snapshotDate: "2026-08-16"
pushedAt: "2026-08-16T03:15:12Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Agent-Safe Pipeline

*图片：Continuous integration*
*图片：CodeQL*
*图片：Secret scanning*
[*图片：OpenSSF Scorecard*](https://scorecard.dev/viewer/?uri=github.com/decionis/agent-safe-pipeline)
*图片：License: Apache-2.0*

**Let agents propose. Let policy decide.**

Agent-Safe Pipeline is a reference architecture for executing AI-agent actions through an independent authorization boundary.

This repository is a library and runnable reference implementation, not a hosted authorization service or a substitute for provider-side identity, least privilege, network isolation, and incident response. Its safety claims apply only when the documented trust boundary is preserved.

```text
Agent -> immutable intent -> Decionis -> ALLOW / ESCALATE / BLOCK -> SafeExecutor -> API
                                      |
                                      +-> Presence -> verified human approval -> Decionis re-evaluation
```

Agents can reason, plan, and propose actions. They must not determine whether their own actions are authorized, possess downstream privileged credentials, or choose which trusted handler runs.

## Five-minute demo

Requirements: Node.js 22.14 or later and pnpm 9.

```bash
git clone https://github.com/decionis/agent-safe-pipeline.git
cd agent-safe-pipeline
pnpm install --frozen-lockfile
pnpm --filter @decionis/agent-safe-example-basic demo
```

The demos use an explicitly non-production fixture authority. A production integration uses `DecionisGate` and `DecionisGrantVerifier` with server-side credentials.

```ts
const captured = intentCapture.capture(agentProposal, trustedContext);
const decision = await gate.evaluate(captured);
const result = await executor.run(captured, decision);
```

The executor accepts a captured intent and a decision. It does not accept an arbitrary callback from the agent. A sealed `ActionRegistry` maps action names to trusted handlers and validates parameters before consuming a single-use grant.

## Repository map

- `packages/pipeline` — `IntentCapture`, `DecionisGate`, Presence coordination, and `SafeExecutor`.
- `examples/basic-agent` — the smallest BLOCK flow.
- `examples/shopify-refund-agent` — amount-based ALLOW / ESCALATE / BLOCK.
- `examples/github-deploy-agent` — environment and force-push controls.
- `examples/mcp-tool-gate` — a real stdio MCP server with a governed tool.
- `ARCHITECTURE.md` and `THREAT-MODEL.md` — trust boundary and abuse analysis.
- `conformance/agent-safe-intent-v1.json` — portable canonical-hash test vector.
- `conformance/vectors/` — edge-case canonical-hash vectors (Unicode/astral, NFC vs NFD, negative zero, fractional/exponent numbers, nested arrays, UTF-16 key sort order), auto-discovered by the conformance test.
- `FIXTURE-PROVENANCE.md` — origin and permitted use of every fixture family.
- `DEPENDENCY-LICENSES.md` — generated inventory method and platform-conditional dependency notes.
- `SECURITY-EVIDENCE.md` — control-to-artifact evidence map and published gaps.
- `PUBLICATION-SIGNOFFS.md` — human decisions that automation cannot make.

## Production invariants

1. Agent input contains only the proposed action, target, and parameters. Tenant, actor, downstream target, and credentials come from trusted runtime configuration.
2. The exact canonical intent is hashed and expires quickly.
3. Decionis independently decides. Network errors, malformed responses, missing grants, or binding mismatches fail closed.
4. Presence proves a human approved that exact intent; Presence never directly authorizes execution. Decionis verifies the receipt and re-evaluates policy.
5. The grant is bound to the intent, decision, audience, and expiry and is consumed atomically before the handler runs.
6. Downstream credentials exist only behind the trusted executor.

See `docs/trust-boundary.md` before integrating a real downstream API.

## Public-repository policy

This is intended to be the public, canonical reference implementation. It should not be mirrored: mirrors create contract and security-fix drift. Public content belongs here—architecture, package source, synthetic policies, and runnable examples. Production policy bundles, customer data, credentials, internal infrastructure, and private incident material do not.

Decionis remains the authoritative decision service, Presence remains the human-verification service, and their server internals can evolve independently behind versioned contracts.

## Status

The workspace package is versioned `0.1.2` but is not claimed as published until the registry release workflow succeeds. Install it from this workspace today. The canonical repository URL was verified on 2026-08-14; availability of future package releases is intentionally not fabricated in these docs.

## Development

```bash
pnpm install --frozen-lockfile
pnpm verify
```

`pnpm verify` enforces formatting, Markdown lint, fixture conventions, canonical licensing, separate
production/toolchain audits, deterministic performance tests, types, tests, and coverage thresholds
of 90% for lines/functions/statements and 85% for branches. `pnpm mutation` checks that
trust-boundary tests kill deliberate code mutations. `pnpm fuzz` runs deterministic property tests
against canonical intent handling; CI also runs them weekly with a larger bounded sample.
Installation activates the repository's `simple-git-hooks` pre-commit guardrails.

Apache-2.0 licensed. See `LICENSE`, `TRADEMARKS.md`, `SECURITY.md`, and `CONTRIBUTING.md`. Report suspected vulnerabilities through GitHub's private advisory form, not a public issue.
