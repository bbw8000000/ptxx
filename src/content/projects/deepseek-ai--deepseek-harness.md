---
title: "deepseek-ai/deepseek-harness"
owner: "deepseek-ai"
name: "deepseek-harness"
fullName: "deepseek-ai/deepseek-harness"
description: "DeepSeek Harness: Everything is a Plugin."
sourceUrl: "https://github.com/deepseek-ai/deepseek-harness"
stars: 124774
forks: 12372
language: "TypeScript"
topics: ["ai-agents", "cordis", "dsh", "dsh-plugin"]
license: "MIT"
homepage: "https://deepseek.com/harness"
defaultBranch: "master"
snapshotDate: "2026-08-16"
pushedAt: "2026-08-13T13:00:21Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# DeepSeek Harness

English | 中文

DeepSeek Harness (`dsh`) is an open-source agent harness developed by [DeepSeek AI](https://deepseek.com).

It uses an architecture where **everything is a plugin**, and is powered by Cordis, whose design is described in _A Programming Paradigm for Spatiotemporal Composability_.

## Developer preview

DeepSeek Harness is currently in _developer preview_ and is iterating rapidly. **THERE WILL BE COMPATIBILITY-BREAKING CHANGES.**

## Run

### Run from `npm`

Install `Node.js`, then run:

```sh
npx @deepseek-ai/dsh web
```

The command starts the Web UI, served at `http://127.0.0.1:3080` by default. See Web UI guide.

### Run from source

To run from a repository checkout:

```sh
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

## Community and support

- Feel free to submit feedback or bug reports through GitHub Discussions.
- Add the `dsh-plugin` topic to your plugin repository for discoverability.
- Join DeepSeek Harness Discord community.

## Contributing

See CONTRIBUTING.md.

## Development

Start with the development guide and architecture documentation.

For agents, follow AGENTS.md.

## License

MIT

Third-party dependencies and their licenses are disclosed in THIRD_PARTY_NOTICES.md.
