---
title: "liyupi/ai-model-world"
owner: "liyupi"
name: "ai-model-world"
fullName: "liyupi/ai-model-world"
description: "AI 大模型世界，把 556 个大模型拟人化成像素小人的可视化站点。进来就能看到此刻谁最聪明、谁最会写代码、谁最便宜、谁刚发布，往下是国内与国外分区的厂商广场、完整的发布时间线和多维排行榜。搜索认模型名、厂商和能力，输入「多模态」会直接列出全部多模态模型。数据取自 Epoch AI、models.dev、LiveBench 与 Hugging Face，每小时自动同步，所有文案由真实数据生成，不调用任何 LLM。Next.js 静态导出，零后端。"
sourceUrl: "https://github.com/liyupi/ai-model-world"
stars: 49
forks: 12
language: "TypeScript"
topics: ["ai", "ai-models", "benchmark", "chinese", "data-visualization", "deepseek", "large-language-models", "leaderboard"]
license: "MIT"
homepage: "https://bilibili.com/toy/ai-model-world"
defaultBranch: "main"
snapshotDate: "2026-09-18"
pushedAt: "2026-09-17T17:44:07Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# 大模型世界 · AI Model World

AI 模型多到记不住，新闻里天天蹦出新名字，可你很难说清此刻到底谁最强、谁最便宜、谁刚出生。
这个站把五百多个大模型搬进了一座像素小镇，每个模型都是住在厂商小屋里的一个角色，
你进来扫一眼就知道当下的格局。

*图片：首页广场*

最上面那排是「今日格局」，八块领奖台分别写着最聪明、最会编程、最划算、最便宜、
记性最好、最新发布、国内最强、开源最强。每块只给一个名字、一个数字和一句为什么，三秒读完。
紧接着的一排按类型分，文本、视觉、全模态、图像生成、视频生成、语音各占一格，点进去是筛好的名单。

再往下就是广场本体。国外和国内分成两块，每块又按厂商实力分成头部、主力、尚无评测三条街。
每家厂商住一间能看见内部的小屋，屋里站着这家当下的门面模型。

*图片：国外与国内分区*

画归画，数归数。房间和角色只负责身份与观感，真正用来横向比较的是名牌下面那四条能力横条，
也就是聪明、编程、记性、便宜——格子越多越强，缺数据的画成带描边的空槽，
厂商自报的成绩会缀一个「自报」。最底下那行是这个模型的一句话定位，由数据套模板生成，
不经过任何 LLM。屋子下沿偶尔挂一张小纸条，写着「本家更新：某某」，
那是在提醒你这家刚发了新型号、只是还没拿到第三方评测分。

点开任意一个角色，你能看到它的身世、战绩、屋内陈设，以及同系列历代的演进关系。

*图片：模型详情页*

想横向回顾整个行业，就去「时间线」。几百个模型按发布日期排成一条长河，
往下滚就是一部三年多的 AI 编年史。

*图片：发布时间线*

想较真谁强谁弱，就去「排行榜」。综合智力、性价比、上下文、价格，
再加上三十多个互不通用的第三方编程赛制，每一榜都标着参赛模型数和数据来源。
跨赛制的分数永远不会被混算成一个数，因为同一个模型换套评测脚手架就能差二三十分。

*图片：排行榜*

找具体的东西靠导航条左边那个搜索框。它认模型名，也认厂商，还认能力——
你输入「多模态」，它会告诉你全站有多少个并直通筛好的名单；
你输入「智谱 多模态」，它就回答「智谱到底有没有多模态模型」这个问题。

*图片：全局搜索*

最后，这个站点不需要人维护。新模型发布、旧模型退役、价格调整、榜单更新，全部自动同步。

---

## 文档

| 文档 | 内容 |
|---|---|
| docs/HANDOFF.md | **接手开发先读这一份**：当前状态、不可违背的原则、踩过的坑、代码地图 |
| docs/DESIGN.md | **模型属性 → 人物形象的完整对照表**，含所有档位阈值与厂商形象母题 |
| docs/DATA.md | 数据来源、字段仲裁规则、合规边界、容错设计 |
| docs/ARCHITECTURE.md | 系统架构与零维护链路 |
| docs/research/coding-benchmarks-2026.md | 编程测评数据源全景：许可证原文、覆盖率实测、已排除的源及理由 |
| docs/research/reference-sites-2026.md | 参考网站与信息设计方案，当前的能力条改造出自这里 |
| docs/llm-metadata-sources-research.md | 元数据源调研原始报告（结论均经 `curl` 实测） |
| docs/data-sources-research.md | 榜单与参数量调研原始报告 |
| docs/pixel-character-pipeline-research.md | 像素角色合成管线调研报告 |

---

## 数据来源

| 用途 | 来源 | 许可 |
|---|---|---|
| 模型元数据 | [models.dev](https://models.dev) | MIT |
| 榜单分数（智力 / 数学 / 科学 / 编程） | [Epoch AI](https://epoch.ai) | CC-BY 4.0 |
| 编程测评（Coding / Agentic Coding） | [LiveBench](https://livebench.ai) | Apache-2.0 |
| 参数量与开源许可 | [Hugging Face](https://huggingface.co) | 逐模型判断 |
| 新模型发现与发布日期交叉校验 | OpenRouter · Vercel AI Gateway · LiteLLM | 仅用于发现，不转存展示 |
| 角色美术素材 | [Liberated Pixel Cup](https://lpc.opengameart.org) | CC0 / OGA-BY，署名见 `assets/lpc/CREDITS.md`，站内 `/credits/` 页由它生成 |
| 中文像素字体 | Fusion Pixel Font | OFL-1.1 |

本项目**不使用** Artificial Analysis 的任何数据（其条款禁止再分发），
也不抓取 LMArena（其条款禁止自动化抓取）。详见 docs/DATA.md 的合规章节。

---

## 本地开发

```bash
npm install
npm run dev
```

`npm run dev` 会先由 `prebuild` 钩子合成精灵图（约 13 秒），再启动开发服务器。
本机 3000 端口常被占用时会自动改用 3001。

> `loadSnapshot()` 与 `listSpriteSlugs()` 只在生产构建里缓存；开发时每次请求重读磁盘，
> `npm run sync` / `npm run sprites` 之后刷新页面即可看到结果，不需要重启。
> 但 `next build` 会把 `.next` 写成静态导出状态，之后再 `npm run dev` 前要 `rm -rf .next`。

### 数据与素材管线

```bash
npm run sync       # 抓取上游、仲裁、校验，产出 data/models.json
npm run sprites    # 由 data/models.json 再生产 public/：角色精灵图 + 搜索索引
npm run font       # 中文像素字体子集化（改了中文文案后才需要跑）

npx tsx scripts/sync/selftest.ts   # 数据管线 217 项纯函数自检，不联网
```

### 体检脚本

`scripts/qa/` 下全部只读，用来回答「为什么是这个结果」。完整清单见
HANDOFF.md，最常用的几个：

```bash
npx tsx scripts/qa/why-flagship.ts openai   # 这家为什么是这个模型上广场
npx tsx scripts/qa/stale-flagships.ts       # 还有哪些门面不是本家最新的
npx tsx scripts/qa/roster-signals.ts        # 广场每位门面有哪些数据、缺哪些
npx tsx scripts/qa/shots.ts                 # 三个断点批量截图，视觉自验证
npx tsx scripts/qa/verify-text.ts "某段文字" # 区分「没改干净」和「浏览器缓存」
```

两条管线均**离线确定性**：不需要任何 API 密钥，同样的输入永远产出同样的输出。

> 从中国大陆运行时 Hugging Face 会连接失败，参数量与许可证字段会留空并标记
> `confidence: unknown`，不影响管线其余部分。生产环境的抓取跑在 GitHub Actions 上，不受此影响。

---

## 贡献

系统里唯一依赖人类常识的地方是厂商的形象母题——机器读得出 DeepSeek 的定价，
读不出它应该是一头鲸鱼。这部分放在 `src/data/vendor-registry.ts`，是一张查表。

**如果你发现某家厂商还没有专属形象**（它会显示为「神秘旅人」兜底形象），
欢迎提 PR 加一行。加不加系统都能正常运行，加了只是更好看。

---

## 许可

代码与文档 MIT。像素素材（CC0 / OGA-BY 3.0）、中文字体（OFL-1.1）与
数据快照（CC-BY 4.0 等）各自遵循上游许可，逐项的适用范围、署名义务与排除的数据源
见 NOTICE.md。
