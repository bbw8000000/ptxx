---
title: "Forlives/21-day-self-interview"
owner: "Forlives"
name: "21-day-self-interview"
fullName: "Forlives/21-day-self-interview"
description: "🪞 An AI existential-psychology counselor asks you 3 meaningful questions every night for 21 days — and remembers, reflecting your own words back to you. Bilingual zh/en. A Hermes Agent skill. 每晚三个问题，一面慢慢显影的镜子。"
sourceUrl: "https://github.com/Forlives/21-day-self-interview"
stars: 109
forks: 39
language: "Python"
topics: ["ai-agent", "chinese", "cron", "existentialism", "hermes-agent", "journaling", "mental-health", "mirror"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-08T11:39:03Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# 🪞 21 天自我访谈 · 21 Days of Self-Interview

**每晚三个问题，一面慢慢显影的镜子。**
*Three questions every night. A mirror that slowly develops.*

让 AI 每晚主动问你三个对人生真正重要的问题——并且**记得**你的回答，
在第 7、14、21 天把你自己的话回映给你。
An AI that asks you three meaningful questions each night — and *remembers*
your answers, reflecting your own words back to you on Days 7, 14, and 21.

*图片：License: MIT*
*图片：Python*
*图片：No dependencies*
*图片：Languages*

中文 · English


---


## 中文

### 这是什么

大多数自省工具失败，是因为它们**没有记忆**——你今晚写的东西，明天就沉进
日记本里再没人看。

「21 天自我访谈」不一样。它让一个 AI 扮演**资深的存在主义心理咨询师**，
连续 21 个夜晚、每晚问你三个层层递进的问题，**记住**你的每一个回答，
并在第 7、14、21 天把你自己说过的原话拼成一张画像，还给你看。

> 重点不是给你建议，而是帮你**看清自己**：你实际在做什么、被什么驱动、
> 接下来选择成为谁。

**被长时间地看见**，是人很少获得、却极其渴望的体验。这就是这个项目想给你的。

### 21 个夜晚的设计

不是随便凑的题。三个七天阶段，层层递进：

| 阶段 | 天数 | 主题 |
|------|------|------|
| 🔍 **看见** | Day 1–7 | 起点 · 时间 · 能量 · 注意力 · 身体 · 面具 · 第一周回看 |
| 🧭 **理解** | Day 8–14 | 恐惧 · 渴望 · 剧本 · 重复 · 关系 · 遗憾 · 第二周回看 |
| 🕯️ **选择** | Day 15–21 | 价值 · 自由与责任 · 有限 · 真实 · 承诺 · 给予 · 自画像 |

**先看见，再理解，最后才谈选择。** 这个顺序是刻意的——跳过"看见"直接谈
"你想成为谁"，只会得到漂亮的空话。

借鉴了存在主义心理学（Yalom、Frankl）、苏格拉底式提问、正念观察、叙事疗法
与习惯科学。详见 `references/method.md`。

### 快速开始

这是一个 Hermes Agent skill，
配合每晚的定时任务运行。

```bash
# 1. 克隆
git clone https://github.com/Forlives/21-day-self-interview.git
cd 21-day-self-interview

# 2. 开始你的 21 天（中文）
python si.py init --lang zh        # 英文用 --lang en

# 3. 看看今晚该问什么
python si.py prompt
python si.py status
```

然后让你的 AI agent 加载这个 skill，并设一个每晚的定时任务（例如 22:00）。
在 Hermes 里：

```
把 21-day-self-interview 这个 skill 装上，
每晚 22:00 提醒我做今天的自我访谈。
```

agent 会在每晚：取出当天的问题 → 像咨询师一样一个个问你 →
记录你的回答 → 在回映日把你过去的话讲给你听。

### 不依赖任何第三方库

`si.py` 是纯 Python 标准库。题库是纯 JSON。你可以：
- 改任何一个问题（编辑 `questions.zh.json` / `questions.en.json`）
- 加一种新语言
- fork 成 7 天 / 30 天的版本

只要保持「看见 → 理解 → 选择」的递进，它就立得住。**欢迎 PR 你的题库变体。**

### 一句重要的话

这是一面镜子，不是医生。如果你正经历持续的痛苦或危机，请寻求专业的、
真实的人类帮助。详见 `references/safety.md`。

---


## English

### What it is

Most self-reflection tools fail because they have **no memory** — what you
write tonight sinks into a notebook and is never seen again.

**21 Days of Self-Interview** is different. It casts an AI as a **seasoned
existential-psychology counselor** who asks you three carefully sequenced
questions every night for 21 nights, **remembers** every answer, and on Days
7, 14, and 21 weaves your own past words into a portrait and hands it back.

> The point isn't advice. It's to help you **see yourself clearly**: what you
> actually do, what drives it, and who you choose to become from here.

**Being seen over time** is something people rarely get and deeply crave.
That's what this project is built to give.

### The 21-night arc

Three phases of seven, deliberately ordered:

| Phase | Days | Themes |
|-------|------|--------|
| 🔍 **See** | Day 1–7 | Starting point · Time · Energy · Attention · Body · Masks · Week-one review |
| 🧭 **Understand** | Day 8–14 | Fear · Longing · Script · Repetition · Relationships · Regret · Week-two review |
| 🕯️ **Choose** | Day 15–21 | Values · Freedom & responsibility · Finitude · Authenticity · Commitment · Giving · Self-portrait |

**See first, understand next, only then choose.** Skip "See" and you get
pretty, hollow answers. Draws on existential psychology (Yalom, Frankl),
Socratic questioning, mindful observation, narrative therapy, and habit
science. See `references/method.md`.

### Quick start

This is a Hermes Agent skill
that runs with a nightly scheduled task.

```bash
git clone https://github.com/Forlives/21-day-self-interview.git
cd 21-day-self-interview

python si.py init --lang en        # or --lang zh for Chinese
python si.py prompt
python si.py status
```

Then have your AI agent load the skill and set a nightly cron (e.g. 22:00).
The agent each night will: fetch the day's questions → ask you one at a time
like a counselor → record your answers → reflect your own past words back on
review days.

### Zero dependencies

`si.py` is pure Python stdlib. The question banks are plain JSON. Edit any
question, add a language, or fork it into a 7-day / 30-day version — as long
as you keep the "See → Understand → Choose" progression. **PRs with your own
variants are welcome.**

### One important note

This is a mirror, not a doctor. If you're going through persistent pain or
crisis, please seek professional, human help. See
`references/safety.md`.

---


Made with care · MIT License
