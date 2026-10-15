---
title: "alchaincyf/loop-engineering-orange-book"
owner: "alchaincyf"
name: "loop-engineering-orange-book"
fullName: "alchaincyf/loop-engineering-orange-book"
description: "别再问我什么是 Loop Engineering — 橙皮书系列。A plain-language guide to loop engineering (中文 + English PDF). Free."
sourceUrl: "https://github.com/alchaincyf/loop-engineering-orange-book"
stars: 1120
forks: 107
language: "未知"
topics: []
license: "NOASSERTION"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-08-23T14:18:43Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

**English** | 中文版 README


  


# Loop Engineering: Stop Asking Me What It Is

> 橙皮书 (Orange Book) Series · by HuaShu (花叔)

A plain-language field guide to **loop engineering** — the term that blew up in a single week of June 2026, when [Peter Steinberger](https://x.com/steipete/status/2063697162748260627), Boris Cherny (head of Claude Code at Anthropic), and Google's [Addy Osmani](https://addyosmani.com/blog/loop-engineering/) all pointed at the same shift and gave it a name.

The one-line version: **stop being the person who prompts the agent. Design the system that does it for you.**


  
  


## Download

| Edition | PDF |
|---------|-----|
| 中文版 (Chinese) | **PDF Download** |
| English | **PDF Download** |

## What This Book Covers

Loop engineering sits **one floor above the harness**. If harness engineering equips a single agent run — which tools it gets, what counts as "done" — loop engineering is the outer system that runs on a timer, spawns its own helpers, verifies the work, remembers what it did, and decides what to do next. You build it once and let it poke the agents instead of you.

If you've read the **Harness Engineering** Orange Book, this is the next floor up. It stands on its own — you don't need the previous one.

**9 sections across 4 parts:**

| Part | Content | Sections |
|------|---------|----------|
| 1. What It Is | The definition, the one-week origin story, and the prompt → context → harness → loop stack | §01–02 |
| 2. How It Turns | The five moves of one loop, the six parts you build it from, and why an AI can't grade its own code | §03–05 |
| 3. Where It Runs, What It Costs | Three real loops (Addy's morning triage, Stripe's Minions, the scheduling reality) and the four costs — verification debt, comprehension rot, token blowout, cognitive surrender | §06–07 |
| 4. How You Start | Staying the engineer, and building your first loop today | §08–09 |


  
  


## Who Is This For

- Developers already using Claude Code / Codex / Cursor who still drive the agent prompt by prompt, and want to climb one level up
- AI power users curious why "you shouldn't be prompting your agents anymore" went viral
- Anyone who read the Harness Engineering Orange Book and wants the outer loop

All sources are public and first-hand: Addy Osmani's founding post, Anthropic's harness-design engineering blog, Stripe's Minions, and the official Claude Code / Codex docs.

## 橙皮书 (Orange Book) Series

Part of the 橙皮书 series — free, practical guides on AI tools. Other titles include Claude Code, Harness Engineering, Agent Skills, OpenClaw, and more.

All books free to download: **[huasheng.ai/orange-books](https://www.huasheng.ai/orange-books)**

## About the Author

**HuaShu (花叔)** · AI Native Coder · Indie Developer

An AI content creator with 500K+ followers across platforms. Built every product — including an App Store #1 paid iOS app — entirely with AI tools, never writing a line of code by hand. Open-sourced Nuwa.skill, huashu-design, and more.

- X/Twitter: [@AlchainHust](https://x.com/AlchainHust)
- YouTube: [@Alchain](https://www.youtube.com/@Alchain)
- Bilibili: [花叔v](https://space.bilibili.com/14097567/)
- WeChat Official Account: 花叔
- Website: [huasheng.ai](https://www.huasheng.ai/)

## Version

- **v260615** — First edition, written the week loop engineering emerged (June 2026), based on Addy Osmani's founding post and the official Claude Code / Codex docs.
- AI tools evolve fast — refer to each product's official documentation for the latest.

## 📚 Read Online on WorkBuddy

This book is also available on WorkBuddy's knowledge base, one page per chapter — or just drop the link into your agent as context.

https://www.workbuddy.cn/space/d/H6TXqZsuCnOeR3SvXpNXZk

All orange books: https://www.workbuddy.cn/space/d/YcllWXknAUoMk6lFSWdfbI
## License

MIT License — free to use, copy, modify, and distribute, including commercially. Attribution appreciated but not required.
