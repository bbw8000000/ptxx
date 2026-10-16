---
title: "feder-cr/open_scion"
owner: "feder-cr"
name: "open_scion"
fullName: "feder-cr/open_scion"
description: "Open-source version of Scion: version control built for coding agents."
sourceUrl: "https://github.com/feder-cr/open_scion"
stars: 738
forks: 72
language: "Go"
topics: ["ai-agents", "coding-agents", "git", "golang", "scion", "version-control"]
license: "NOASSERTION"
homepage: "https://www.anthropic.com/engineering/redesigning-source-control"
defaultBranch: "main"
snapshotDate: "2026-10-16"
pushedAt: "2026-10-15T13:24:44Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# open_scion

**Source control for the age of coding agents.**

Anthropic built **Scion**, a faster version control system for coding agents,
and described it in
[Redesigning source control](https://www.anthropic.com/engineering/redesigning-source-control):
a server-centric system built for hundreds of agents that read, write and land
code at the same time. Scion is internal to Anthropic and is not available to
the public.

So I built **open_scion**: an open-source version of that design that anyone can
run, and that the community can improve and maintain together.

MIT licensed. Vendor neutral: the server never calls a language model, and every
AI feature works with any provider, or none.

open_scion is an independent implementation of the publicly described design. It is not affiliated with or endorsed by Anthropic.

---

## Why

Classic Git hosting was built for humans who clone a repository, work for hours
and push once. Coding agents work differently: thousands of short-lived tasks,
each touching a few files, each wanting to land in seconds, all on the same
branches. Full clones, merge queues and client-side history walks become the
bottleneck.

Scion's answer is to move the work to the server: clients stay online and fetch
only what they need, history questions are answered (and cached) by the server,
changes land through a compare-and-swap instead of a queue, every update is an
entry in a changeset log, and the repository state lives in a consistent
database plus object storage so servers scale out. open_scion implements these
ideas, with normal Git repositories underneath.

## The Scion ideas, implemented

| Scion idea | In open_scion |
|---|---|
| **Always-online clients** that fetch exactly what they need | `ObjectService` serves single objects and sparse trees; `graft clone` and `graft sparse` materialize only the paths you ask for. |
| **Source control as an API**: history runs on the server | Blame, path history, ancestry and code search run server-side and are memoized as derived data, computed once per commit. |
| **Landing without a merge queue** | `UserLand` rebases a change onto the current tip and lands it with a compare-and-swap; concurrent lands on one branch are batched into a single reference update. |
| **Automatic conflict resolution** | A conflicting land is resolved by a resolver you choose (any LLM provider, a deterministic tool, or none) through a versioned, vendor-neutral protocol. |
| **Changeset log** | Every accepted reference update is recorded with its operation and actor in a dense, ordered log that clients list or watch live. |
| **Storage core: a database and object storage, stateless servers** | Each change is a changeset in a write-ahead log in SQLite or PostgreSQL, with a compare-and-swap per reference; packs live in object storage (file, S3, GCS, Azure). Server nodes are caches that any node can rebuild, so you add nodes to scale. |
| **Test after landing, revert the culprit** | `graft-verify` tests the tip, bisects a failure and reverts the change that broke it. |
| **Monitoring agents ("superfans")** | Agents follow the changeset stream and report what matters to each component, also through Slack. |
| **Agent-friendly review** | Reviews with semantic approval rules: a comment-only change can need fewer approvals than a logic change. |
| **Agents as first-class users** | Per-agent tokens, an RPC allowlist and branch policies decide what each agent may do. |
| **Strict cache tiers** | `graft-cache` caches immutable objects in daemon and regional tiers, verifying every object. |

## Architecture

```
        agents, CI jobs, sparse workspaces          graft CLI / Go SDK
                            |
                            v   gRPC
        +-------------------------------------------------+
        |  graft-cache (optional daemon and cache tiers)  |
        +------------------------+------------------------+
                                 v
   +---------------------------------------------------------------+
   |  open_scion server (any number of nodes)                      |
   |  land - objects - changesets - derived data - search - review |
   |  write path: changeset + compare-and-swap per reference       |
   +-----------+--------------------------------+------------------+
               |                                |
               v                                v
   +-----------------------+       +-----------------------------+
   |  SQLite / PostgreSQL  |       |  object storage             |
   |  changeset WAL, refs, |       |  content-addressed packs    |
   |  changelog, reviews   |       |  (file, S3, GCS, Azure)     |
   +-----------------------+       +-----------------------------+
               \                              /
                local Git repositories = caches any node can rebuild
```

Details: ARCHITECTURE.md and STORAGE.md.

## Quick start

Requirements: Linux or macOS, Go 1.26, a C toolchain, Meson and Ninja (the
build compiles a bundled Git).

```shell
git clone https://github.com/feder-cr/open_scion.git
cd open_scion
make build                         # server, CLI and tools into _build/bin
examples/graft/quickstart.sh       # a server, a cache daemon, two agents and a land, in a temporary directory
./_build/bin/graft                 # the CLI and its commands
```

To run your own server, adapt `examples/graft/config.toml`
and start it with `_build/bin/gitaly serve config.toml`. To put the repository
state in a database and object storage, add a `[graft.storage]` section: start in
`shadow` mode, import your repositories, then switch to `authoritative`
(STORAGE.md).

Inside the code the extensions are called **Graft**: the `[graft]`
configuration section, the `graft` CLI, `internal/graft` and `doc/graft`.

## Documentation

- Quickstart and configuration reference
- Architecture and the storage core
- Landing and batching, conflict resolution, derived data
- Review, search, verification, superfans and Slack chat
- Agent security, benchmarks, fuzzing
- Limitations and roadmap
- Design documents of each phase: PLAN.md to PLAN6.md

## Status

Version 0.1.0, the first public release. Everything above is implemented and
covered by unit, end-to-end, multi-node, crash and fuzz tests. Interfaces may
still change before 1.0. Known gaps (for example garbage collection of packs in
the storage core) are listed in LIMITATIONS.md.

## Community

open_scion is meant to be maintained by its community. Open an issue to report a
bug or propose an idea, start a discussion before a large design change, and send
pull requests: tests and a short description of the reasoning make them easy to
review. The design documents in `doc/graft/PLAN*.md` explain why things are the
way they are.

## Credits and license

open_scion is MIT licensed, see LICENSE.

It started as a fork of [Gitaly](https://gitlab.com/gitlab-org/gitaly), GitLab's
Git RPC server (MIT, Copyright GitLab Inc.), which provides the Git plumbing
underneath; every upstream Gitaly RPC keeps working. The non-MIT `ee/` directory
of upstream Gitaly is not part of this repository. Gitaly's own README is kept in
doc/UPSTREAM-GITALY.md, and third-party notices are in
NOTICE.
