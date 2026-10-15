---
title: "KKKKhazix/AIHOT"
owner: "KKKKhazix"
name: "AIHOT"
fullName: "KKKKhazix/AIHOT"
description: "一个自己找热点、自己写日报的网站框架。把信源和精选标准换成你的，它就是你的行业热点站。"
sourceUrl: "https://github.com/KKKKhazix/AIHOT"
stars: 1412
forks: 422
language: "TypeScript"
topics: ["ai", "llm", "mcp", "news-aggregator", "rss", "self-hosted"]
license: "MIT"
homepage: "https://aihot.news"
defaultBranch: "main"
snapshotDate: "2026-09-29"
pushedAt: "2026-09-29T00:06:43Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

一个自己找热点、自己写日报的网站框架。
  把信源换成你的，把精选标准换成你的 KnowHow，它就是你的行业热点站。


  跑起来 ·
  改成你的行业 ·
  它是怎么工作的 ·
  文档


## 这是什么

[AIHOT](https://aihot.news) 是我做的一个 AI 热点网站。它每天从一批信源里收资料，用大模型先筛一遍、再独立打两次分，挑出真正值得看的，写成中文标题和摘要；把不同来源说的同一件事聚成一个事件，按有多少人在说排出热点；每天早上出一份日报。

这个仓库是它的完整框架：网站、后台、精选流程、聚簇和热度算法，**所有提示词的原文和入选门槛**，都在这里。

## 为什么开源

这半年，很多做法律、做 HR、做金融、做贵金属的朋友问我，能不能也给他们的行业做一个。

我做不了。我不懂你们的行业，不知道哪些信源有用，也不知道什么样的消息，对你们来说才叫热点。

但你们懂。

既然我没办法满足所有人，那就把火种交到大家自己手上。

## 说在前面

- **我不是专业的开发者。** 我是设计师出身，半年前还看不太懂代码。这套代码是我和 AI 一起重写的，比以前干净了很多，但一定还有写得不好的地方。发现问题欢迎提 Issue，我不一定能很快回复，先说声抱歉。
- **这是一份快照。** 它来自 AIHOT 正在线上跑的代码，不是精心打磨的通用框架。以后 AIHOT 的更新，我会尽量同步过来，但没法保证每一次都同步。
- **里面没有 AIHOT 的信源名单和运营数据。** 仓库带了 18 个公开的海外 AI 资讯源做示范，够你跑起来看效果；真正的信源，要换成你自己行业的。
- **请不要用 AIHOT 的名字和 Logo。** 换上你自己的名字，它就是你的站。

## 它是怎么工作的


  
  


一条资料从信源进来，先判重，再预筛；可能重要的独立打两次分，过了门槛才进精选；然后写中文标题和摘要，和别的报道聚成事件，算进热度，最后进日报。每一步的提示词都在 `industry/prompts/`，改标准不用改代码。详见 精选与校准。

### 聚簇与热点


  
  


同一件事，官网发一篇、媒体转十篇、X 上吵一天，读者只需要看到一次。AIHOT 把它们聚成一个**事件**：先用标题摘要的向量在最近两周里找候选，再让模型判断是同一件事、后续进展，还是两件事；拿不准的合并，换一家模型再确认一遍。

**热度**按事件算，不按文章算：48 小时内，每个独立来源只算一次，24 小时减半。重复抓取不会多算，一家媒体发十篇也只算一次，所以排在前面的，是真正有很多人在说的事。

### 速度


  
  


## 你会得到什么

| | |
|---|---|
| **六种信源** | RSS、网页列表、JSON 接口、X 账号、微信公众号，以及你自己脚本推送进来的内容。信源分级（官方一手 / 媒体个人），抓取频率按产出自动调整 |
| **精选** | 预筛，同一份评分标准独立打两次分，再按信源分级的门槛决定入选。提示词和门槛全部公开，全部可以改；用你自己标注的样本在 SelectBench 里校准 |
| **写作** | 中文标题、答案先行的摘要、推荐理由、标签，外文全文翻译；防止模型把原文没提到的公司写进标题 |
| **聚簇** | 不同来源报道的同一件事聚成一个事件，后续进展挂在同一个事件下，事件页有综述；人工改过的归属不会被覆盖 |
| **热点** | 按事件算热度：独立来源越多越靠前，X 上的讨论也算进来；和 6 小时前比，涨得快的标上升，新出现的标“新” |
| **日报、周报、月报** | 每天 08:00 出日报，每周一出周报，每月 1 日出月报，按分类分节，带导语 |
| **主题与搜索** | 公司、方向、内容形态三类主题页；标题摘要搜索和全文相关搜索 |
| **给 Agent 用** | RSS（精选、全部、全文、日报）、公开 API、MCP、`llms.txt`，同一份内容给人看也给 Agent 用 |
| **后台** | 信源管理与试抓、内容诊断、精选评测、每一步单独换模型、付费服务的预算熔断、运行记录与告警 |
| **AI 专属模块** | 模型榜（汇总多家公开评测，方法公开）和 Codex 重置监控。别的行业一个开关关掉 |

## 看一眼


  
  


  
  


截图来自用示范信源跑起来的本地站，站名是默认的 MyHOT。

## 跑起来

需要 [Docker](https://docs.docker.com/get-docker/)，和一个 OpenAI 兼容的模型 API Key（DeepSeek、千问、智谱都可以）。

```bash
git clone https://github.com/KKKKhazix/AIHOT.git myhot
cd myhot
node scripts/init-env.ts --llm-key <你的模型 API Key>
docker compose up -d --build
```

打开 。后台在 `/admin`，管理员密码在 `.env` 的 `ADMIN_PASSWORD` 里。一两分钟后开始有内容，第一次导入的资料大约半小时处理完。

机器上没有 Node、服务器在中国大陆、要配域名和 HTTPS，见 部署。

## 把它改成你的行业

最省事的办法：打开你的 Agent（Claude Code、Codex 都可以），把这个仓库交给它，然后说：

```text
请读 AGENTS.md 和 docs/customize.md，把这个站改成「法律」行业的热点站。
我关心的是：……（你想盯哪些信源，你觉得什么消息重要、什么不重要，越具体越好）。
```

要改的东西几乎都在 `industry/` 这一个文件夹里，代码基本不用动：

| 文件 | 改什么 |
|---|---|
| `site.ts` | 站名、行业词、首页文案、关于页 |
| `taxonomy.ts`、`topics.json` | 分类、标签、主题 |
| `sources.json` | 首次启动时导入的信源 |
| `prompts/` | 精选标准和写作要求。**你的行业 KnowHow，就写在这里** |
| `selection.ts` | 入选门槛 |
| `features.ts` | 模型榜、Codex 重置监控的开关 |
| `brand/`、`pages/` | 图标、使用规则和隐私说明 |

最值得花时间的是评分标准（`prompts/selection-score.md`）和门槛：拿一两百条你自己标注过的资料，用 `scripts/eval-selection.ts` 跑一遍，看它选得准不准，再回去改。怎么做写在 精选与校准 里。

## 文档

| 文档 | 内容 |
|---|---|
| 把它改成你的行业 | 站名、分类、信源、提示词、门槛、品牌，一步一步来 |
| 信源 | 六种信源怎么配，分级和全文，外部推送接口 |
| 精选与校准 | 一条资料怎么变成精选，怎么用自己的样本校准 |
| 部署 | Docker、域名和 HTTPS、中国大陆、更新、备份、花多少钱 |
| 架构 | 三个进程、几条不变的规则、目录、对外出口 |
| 模型榜与 Codex 重置监控 | 两个 AI 专属模块 |

技术栈：Node.js 24 · TypeScript · React Router（服务端渲染）· Fastify · PostgreSQL · pg-boss · Tailwind CSS · Docker Compose。

## 最后

AIHOT 曾经只是我无数个深夜里，一个很小、很小的念头。

我不知道它会被改成什么样子，会走到多远的地方。但这可能就是开源最浪漫的地方。

剩下的路，就交给你们了。

—— 数字生命卡兹克

## 许可

代码使用 MIT 许可证。AIHOT 的名字和 Logo 不在许可范围内。字体、模型厂商和评测来源的标志各有自己的许可和商标归属，见 NOTICE。

---

**In English:** AIHOT ([aihot.news](https://aihot.news)) is an AI news site that collects from many sources, lets a language model filter and score every item twice, writes Chinese headlines and summaries, clusters reports of the same story into one event, ranks events by how many independent sources discuss them, and publishes a daily briefing. This repository is its complete framework, including every prompt and threshold. Hand it to your coding agent with `AGENTS.md` and `docs/customize.md` to turn it into a news site for your own field. The documentation is in Chinese.
