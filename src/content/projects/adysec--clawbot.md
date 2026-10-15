---
title: "adysec/clawbot"
owner: "adysec"
name: "clawbot"
fullName: "adysec/clawbot"
description: "iLink bot management tool with CLI and web dashboard."
sourceUrl: "https://github.com/adysec/clawbot"
stars: 25
forks: 21
language: "Rust"
topics: ["ai", "claw", "clawbot", "clawhub", "openclaw", "wechat"]
license: "未标注"
homepage: "https://wechat.adysec.com"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-11T11:39:06Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# clawbot

iLink bot management tool with CLI and web dashboard.

## Usage

```
Usage: clawbot-web 

Commands:
  login              Log in with a QR code and save the account locally
  qrcode             Request a login QR code and print it as JSON
  qrcode-status      Query a login QR code status
  account            Inspect saved accounts
  get-context-token  Wait for the next inbound message and print its context token
  send               Send a text, image, or file message
  serve              Start the web dashboard server
  help               Print this message or the help of the given subcommand(s)
```

### Commands

```bash
cargo run -- serve
```
