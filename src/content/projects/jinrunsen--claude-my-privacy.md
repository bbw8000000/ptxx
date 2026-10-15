---
title: "jinrunsen/claude-my-privacy"
owner: "jinrunsen"
name: "claude-my-privacy"
fullName: "jinrunsen/claude-my-privacy"
description: "MyPrivacy: local name and company pseudonymization for Claude Code, with restoration for tools and assistant reply display."
sourceUrl: "https://github.com/jinrunsen/claude-my-privacy"
stars: 50
forks: 6
language: "Python"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-10-07"
pushedAt: "2026-10-06T09:01:23Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# MyPrivacy

English | 中文

MyPrivacy replaces specified names and company information with aliases in model-input text supported by Claude Code, restores the originals before local tools run, and redacts the text returned by tools. It also attempts to restore aliases in supported assistant reply displays. The plugin uses best-effort replacement, has no command or email allowlist, and does not lock the session when replacement fails.

**It only processes configured terms; it is not a general-purpose PII detector.** Unconfigured information and unsupported content may remain unchanged. The source includes no personal mappings, and the plugin itself does not call a model or a network detection service. Replacement scope and limitations explains which content is protected and which content is restored.

The current plugin version is **0.5.0**. Offline tool and terminal display checks have passed on macOS with Claude Code **2.1.290**; other versions and platforms require fresh verification. See the verification guide for the checked scope.

The repository is named `claude-my-privacy`, the installation identifier is `my-privacy@my-privacy-marketplace`, and all commands use the `/my-privacy-` prefix.


## Install and verify

Run the following commands from the repository root. First confirm that the `claude` command is available; see the contributing guide for additional development and offline-verification dependencies.


### 1. Create private configuration

Copy the fictional example outside the repository, then edit it with your own mappings. The copy command below will not overwrite an existing file.

```sh
mkdir -p "$HOME/.config/claude-my-privacy"
chmod 700 "$HOME/.config/claude-my-privacy"
if [ ! -e "$HOME/.config/claude-my-privacy/mappings.json" ]; then
  cp -n examples/mappings.example.json "$HOME/.config/claude-my-privacy/mappings.json"
fi
chmod 600 "$HOME/.config/claude-my-privacy/mappings.json"
```

The example configuration uses 陈星河 → 陈瑞恩, `chenxinghe` → `ryanchen`, 云杉智科 → 海岚数科, and `cedarbyte` → `harborwave`. **Enter real information only outside the repository.** See the configuration guide for the format, case handling, and alias selection.


### 2. Install the plugin

Register this directory as a local marketplace, then install the plugin:

```sh
claude plugin marketplace add "$PWD" --scope user
claude plugin install my-privacy@my-privacy-marketplace --scope user
```


### 3. Confirm that configuration is active

Run these commands in a Claude Code session:

```text
/reload-plugins
/my-privacy-status
```

When a nonempty configuration loads successfully, the status includes `Configuration: loaded` and a `mappings` count greater than zero. `loaded; mappings: 0` means the term list is empty; `unavailable` or `invalid` means replacement is inactive. The troubleshooting guide provides recovery steps for each state. The status command does not display the term list, and the plugin has no persistent status-bar display.


## Everyday use

Enter requests and use tools as usual. For example, the example configuration restores `staff42@harborwave.example` on the model side to `staff42@cedarbyte.example` for actual tool execution. Supported assistant reply displays attempt to show originals without changing stored session text or model context. The plugin also attempts to restore execution arguments used by Write, Edit, or Bash to write files. See the full flow and display limits.

After editing private configuration, run `/reload-plugins`, then check `/my-privacy-status`. The plugin reads configuration only once per load. Use `/my-privacy-audit` for diagnostics; it retains only structural metadata, without commands or body text.


## Update

After updating the source and incrementing the plugin version, run this command in a terminal:

```sh
claude plugin update my-privacy@my-privacy-marketplace --scope user
```

Then run `/reload-plugins` and `/my-privacy-status` in the active session. The source directory is the marketplace installation source; the running copy is in the Claude plugin cache. If you move the source directory, register the marketplace path again.

`install.py` additionally changes plugin ordering, disables a specified compaction plugin, and writes telemetry-related settings. Use the CLI commands above for routine installation; see the development guide for the script's side effects.


## Documentation and development

Choose documentation by task; you do not need to read the entire implementation:

| Task | Document |
| --- | --- |
| Configure terms in names, companies, domains, and email addresses | Configuration guide |
| Understand the differences between input, tool execution, files, and replies | Replacement behavior and limits |
| Diagnose paths, old blocking messages, and tool errors | Troubleshooting and audit |
| Locate implementation, loading, and storage responsibilities | Architecture |
| Change code, check documentation, and prepare a release | Contributing guide |
| Run isolated verification and consult historical probes | Verification guide |

The project does not yet have an open-source license; the plugin manifest is marked `UNLICENSED`.
