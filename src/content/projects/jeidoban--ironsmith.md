---
title: "Jeidoban/Ironsmith"
owner: "Jeidoban"
name: "Ironsmith"
fullName: "Jeidoban/Ironsmith"
description: "Create personal Mac apps instantly with a prompt. Supports on-device and cloud LLMs"
sourceUrl: "https://github.com/Jeidoban/Ironsmith"
stars: 329
forks: 28
language: "Swift"
topics: []
license: "GPL-3.0"
homepage: "https://ironsmith.app"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-12T18:29:58Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

Ironsmith

[Ironsmith](https://ironsmith.app) is a free, open-source macOS menu bar app for making small, personal Mac apps with AI. Describe what you want, and Ironsmith generates, builds, and saves a native SwiftUI app you can launch, edit, and export to your Applications folder.


  


## What It Does

- **Builds real Mac apps.** Generated apps are native Swift and SwiftUI apps that you can create, run, edit, and export from the menu bar.
- **Works with local AI.** Ironsmith was designed with local AI support in mind, and has Ollama support out of the box. You can also connect any OpenAI compatible API, so LM Studio and Llama.cpp work great too.
- **Supports hosted models too.** Bring your own API keys for OpenAI, Anthropic, and Gemini, log in or skip the API key and sign into Ironsmith to access them immediately. Using your existing ChatGPT login is also supported.
- **Offers specialized coding agents.** Choose Ironsmith's in-house agents for tiny macOS apps or OpenAI's Codex for more complex projects.
- **Doesn't require Xcode.** Every generated app is a Swift package and is built entirely with the lightweight Xcode command line tools rather than full Xcode. In fact Ironsmith itself doesn't even use Xcode!
- **Sandboxes every app by default.** Generated apps are built as signed app bundles with sandboxing and hardened runtime enabled, greatly reducing the impact of bugs, mistakes, or malicious behavior. Sensitive permissions such as camera and microphone access must also be explicitly enabled. However, you can disable these protections, and if you do, it’s highly recommended that you review the code before running it.

## Examples

Ironsmith works best for focused utilities: the small apps you wish existed but wouldn't want to hunt down or build yourself. That said, with more capable models like GPT‑5.6 Sol or Fable 5, you can create some surprisingly sophisticated apps.

| Synthesizer | Painting App | HEIF Converter |
| --- | --- | --- |
|  |  |  |

| SVG Editor | Notepad | Network Visualizer |
| --- | --- | --- |
|  |  |  |

Some examples of prompts you can try:

- "Make a utility that renames a folder of screenshots by date and window title."
- "Build a tiny app that splits a PDF into one file per page."
- "Build a clipboard cleaner that strips tracking parameters from copied URLs."
- "Make a small CSV inspector that highlights duplicate rows and missing values."

## Install

Download the latest Ironsmith build from GitHub Releases or [the website](https://ironsmith.app).

Ironsmith requires macOS 26 or newer and supports both Intel and Apple Silicon Macs. Make sure Apple Intelligence is enabled where available; Ironsmith uses it to create app icons and provide the built-in Foundation Model.

On first launch, Ironsmith checks for the Xcode Command Line Tools as generated apps are compiled locally. If they are missing, macOS will prompt you to install them. You can also install them manually:

```sh
xcode-select --install
```

## Develop

Development requires macOS 26 or newer and the Xcode Command Line Tools. Xcode itself is not required.

Build the development app:

```sh
script/build.sh
```

Build and run the development app:

```sh
script/build.sh run
```

Run tests:

```sh
script/test.sh
```

Clean SwiftPM and script outputs:

```sh
script/clean.sh
```
Copy `Config/.env.example` to `Config/.env` and fill in `IRONSMITH_DEV_SIGN_IDENTITY` with your Apple Development ID to avoid repeated keychain asks when running new builds.

## Contribute

Issues and pull requests are welcome. Start with CONTRIBUTING.md for the local workflow and PR expectations.

## License

Ironsmith is licensed under the GNU General Public License v3.0.
