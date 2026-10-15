---
title: "unstablebuild/rune"
owner: "unstablebuild"
name: "rune"
fullName: "unstablebuild/rune"
description: "the development environment for pros"
sourceUrl: "https://github.com/unstablebuild/rune"
stars: 396
forks: 22
language: "Go"
topics: ["agent-orchestration", "ai", "cli", "coding-agents", "developer-tool", "devtools", "go", "golang"]
license: "GPL-3.0"
homepage: "https://rune.build"
defaultBranch: "main"
snapshotDate: "2026-09-13"
pushedAt: "2026-09-11T20:32:05Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Rune

*图片：Linux*
*图片：macOS*
*图片：Lint*
[*图片：codecov*](https://codecov.io/gh/unstablebuild/rune)
[*图片：Discord*](https://discord.gg/2pdrdj6xJ)
[*图片：Reddit*](https://www.reddit.com/r/UnstableBuild/)
*图片：License: GPL v3*

Rune is a fast, GPU-rendered, keyboard-driven IDE for power users. The Unix way, finished
as a product: code, terminals, CLI tools, language intelligence, debugging, and AI agents,
all in one composable, multi-workspace environment.

Rune Agent, in `cmd/rune-agent`, is an AI coding agent shipped as an extension rather than
part of the core editor. This keeps Rune suitable for automatic programming while
still allowing uncorrupted manual programming, and it pushes the extension
system to support complex applications.

Rune has been slowly developed over the course of the last few years and we've taken great
care in making it easy to develop and maintain. We hope you enjoy hacking it as much as
you enjoy using it.

See [docs.rune.build](https://docs.rune.build) for the full documentation.

*图片：Rune IDE showing its character-grid interface, with an editor, a file tree, and an agent session side by side.*

## Repository layout

- `cmd/rune` — the main Rune application
- `cmd/rune-agent` — the Rune Agent extension and packages
- `cmd/rune/docs` — the documentation site published at docs.rune.build; its
  markdown is embedded into the binary and served by the `docs:///` workspace
- `internal/` — the editor, terminal, text, workspace, and LLM packages the
  binaries are built from

Everything outside `cmd/` lives under `internal/`. Rune is an application, not
a library: the supported, semver-stable API for writing extensions is
rune-go-sdk, which is a
separate Apache-2.0 module. Packages in this repository carry no compatibility
guarantees and are refactored freely.

See AGENTS.md for a deeper tour of the architecture.

## Build prerequisites

Rune links a GPU renderer through cgo, so a C toolchain is required. macOS
needs only the Xcode command line tools. Linux additionally needs the X11,
OpenGL, ALSA, Wayland, and xkbcommon development headers, whose package names
differ per distribution.

[Building from source](https://docs.rune.build/develop/building) has the
verified package lists for Debian/Ubuntu, Fedora/RHEL, Arch, openSUSE, Alpine,
and Void, along with a walkthrough of your first change to the editor.

## Makefile

A plain checkout builds with the standard Go tooling — no submodules or code
generation steps required:

```bash
go run ./cmd/rune
```

The Makefile adds the version, commit, and build-date ldflags plus the
release build tags:

```bash
make                 # build all binaries into bin/
make debug           # build with the race detector and debug-only commands enabled
make clean           # remove bin/ and target/

# individual binaries
make rune            # the editor (bin/rune)
make rune-agent      # the agent extension binary (bin/rune-agent)

# testing and code quality
make test            # run the test suite with the race detector
make test-e2e        # also run the e2e suites (requires docker)
make test-no-race    # run the test suite without the race detector
make coverage        # generate a coverage report
make lint            # run golangci-lint
make format          # run go fmt
make generate        # regenerate generated files (protobufs, mocks, docs)

# license headers
make license         # add the license header to files that are missing one
make assert_license  # fail if any file is missing the canonical header
```

The remaining targets (`dist`, `release`, `rune-dmg*`, `*-docker-*`,
`*-notarize`, `*-dist*`) drive Unstable Build's internal
release, packaging, and cloud deployment pipelines and are not expected to
work outside that environment.

## Contributing

See CONTRIBUTING.md.

To report a security issue, see SECURITY.md.

## Sponsorship

Rune is developed by Unstable Build, LLC, a self-funded company. If you'd like to
financially support us, you can do so via GitHub Sponsors. There are no perks or
entitlements associated with sponsorship.

## License

Rune is licensed under the GNU General Public License, version 3
or, at your option, any later version.
