---
title: "xianyu110/ecommerce-image-skills"
owner: "xianyu110"
name: "ecommerce-image-skills"
fullName: "xianyu110/ecommerce-image-skills"
description: "12 电商出图 Agent Skills for Claude Code / Codex / Cursor · GPT Image 2.5 (Flare/Sunburst) · Amazon 白底主图, A+, 场景图, 模特图, 小红书封面, 淘宝详情页"
sourceUrl: "https://github.com/xianyu110/ecommerce-image-skills"
stars: 41
forks: 9
language: "Python"
topics: ["agent-skills", "ai-image", "amazon", "claude-skills", "ecommerce", "gpt-image", "product-photography"]
license: "MIT"
homepage: "https://gptimage2.asia/ecommerce"
defaultBranch: "main"
snapshotDate: "2026-10-05"
pushedAt: "2026-10-04T12:40:18Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# 🛒 Ecommerce Image Skills

**12 个电商出图 Agent Skills · GPT Image 2.5（Flare / Sunburst）**
**12 Agent Skills for ecommerce product images — Amazon · 淘宝天猫 · Shopee · TikTok Shop · 小红书**

*图片：Agent Skills*
*图片：Claude Code*
*图片：Codex*
*图片：Cursor*
*图片：GPT Image 2.5*
*图片：License: MIT*
*图片：GitHub stars*
[*图片：Try online*](https://gptimage2.asia/ecommerce?utm_source=github&utm_medium=readme&utm_campaign=ecommerce-image-skills&utm_content=badge)

中文 · English · 效果展示 Showcase · Skills · Star History


↑ 全部是本仓库 skill 的真实输出（GPT Image 2.5，未 PS） · All real outputs from these skills, no retouching

### ⚡ 一行安装 / One-line install

```bash
npx skills add xianyu110/ecommerce-image-skills
```

或 / or：Claude Code 里 `/plugin marketplace add xianyu110/ecommerce-image-skills` · 手动复制见 安装 / manual copy: Install


Before → After：同一张随手拍 → 6 种平台图 · one casual photo → six platform-ready images

**如果对你有用，欢迎点个 ⭐ Star，让更多卖家看到。**
**If this saves you a designer's afternoon, a ⭐ helps others find it.**


---

## 🇨🇳 中文

> ### 🚀 使用方式 / 在哪里用
>
> - **国内使用地址**：
> - **API 使用地址**：[https://tryallapi.com/](https://tryallapi.com/?utm_source=github&utm_medium=readme&utm_campaign=ecommerce-image-skills&utm_content=zh-where-to-use)（OpenAI 兼容，`GPTIMAGE_BASE_URL=https://tryallapi.com/v1`）
> - **Codex 使用**：
> - **国外使用地址**：[https://gptimage2.asia/](https://gptimage2.asia/?utm_source=github&utm_medium=readme&utm_campaign=ecommerce-image-skills&utm_content=zh-where-to-use)

把「拍商品图 + 美工做图」拆成 12 个可单独安装的 Agent Skill。丢一张手机随手拍的商品照片给 Claude Code / Codex / Cursor，它就会按平台规则出白底主图、场景图、卖点图、A+、尺寸图、模特图、大促 Banner、小红书封面、淘宝详情长图……

**和一堆 prompt 的区别：**

- 🔒 **产品身份锁定**：每个 skill 第一步先锁定形状 / 颜色 / Logo / 文字，并原样带进每一条提示词，减少"图很好看但产品被改了"。
- 📐 **平台规格内置**：Amazon 主图（#FFFFFF、≥85%）、A+ 模块尺寸、淘宝 750 宽详情、小红书 3:4、各平台 Banner 尺寸。
- 🧠 **模型路由**：默认 **Flare**（快、适合出场景和多版本）；需要保留 Logo/文字、局部编辑时切 **Sunburst**。
- 🛠 **脚本做确定性的事**：白底/占比检查与修复、A+ 裁切、拼图、详情页拼接切片、批量换背景（断点续跑 + 预算上限）。
- 🚦 **三种出图方式**：①agent 自带生图工具 ②配置 `GPTIMAGE_API_KEY`（任意 OpenAI 兼容接口）用 `scripts/generate.py` ③都没有时输出最终提示词 + 一个在线运行链接。

### 📦 安装

```bash
git clone https://github.com/xianyu110/ecommerce-image-skills.git
cd ecommerce-image-skills

# Claude Code（全局；或复制到项目内 .claude/skills/）
mkdir -p ~/.claude/skills && cp -r skills/* ~/.claude/skills/

# Codex
mkdir -p ~/.codex/skills && cp -r skills/* ~/.codex/skills/

# Cursor（项目内）
mkdir -p .cursor/skills && cp -r skills/* .cursor/skills/
```

只想要某一个？复制对应文件夹即可，例如 `cp -r skills/amazon-white-background ~/.claude/skills/`。每个 skill 文件夹自带所需脚本，互不依赖。

也可以用 [skills CLI](https://skills.sh)：`npx skills add xianyu110/ecommerce-image-skills`，或在 Claude Code 里 `/plugin marketplace add xianyu110/ecommerce-image-skills`。

### 🚀 使用

直接对 agent 说：

```text
用 amazon-white-background 把 ./photos/bottle.jpg 做成亚马逊白底主图，并跑检查脚本
给这个水杯出一整套 Amazon 7 张图（ecommerce-listing-suite），先给我计划
用 xiaohongshu-cover 做 3 个小红书封面，标题「一整天都冰的水杯」
把 ./photos 里 40 张图批量换成纯白背景，最多花 40 次调用
```

### 🔑 出图方式（可选 API Key）

| 方式 | 条件 | 做法 |
|---|---|---|
| ① 内置工具 | agent 自带生图（如 Codex imagegen） | 自动使用 |
| ② API Key | 设置 `GPTIMAGE_API_KEY`，可选 `GPTIMAGE_BASE_URL`（推荐 `https://tryallapi.com/v1`；默认 `https://api.openai.com`，任何 OpenAI 兼容网关都行） | `python scripts/generate.py --model sunburst --image product.jpg --prompt-file p.txt` |
| ③ 无 key | — | 输出最终提示词 + 一个 [gptimage2.asia](https://gptimage2.asia/ecommerce?utm_source=github&utm_medium=readme&utm_campaign=ecommerce-image-skills&utm_content=zh-route-c) 在线运行链接（预填提示词，上传商品图即可） |

### 模型选择 / Model routing

| 默认 **Flare** `gpt-image-2.5-flare` | 切 **Sunburst** `gpt-image-2.5-sunburst` |
|---|---|
| 新场景、背景、版式、快速多版本 | 必须保留 Logo / 标签 / 小字 |
| 文生图概念图 | 局部编辑：换背景、换色、去杂物 |
| 草稿供挑选 | 最终主图、文字密集的信息图 / 尺寸表 |

### 🙋 没有 Claude / API？ / No Claude or API key?

这些 skill 跑在 Claude Code / Codex / Cursor 等 agent 里；用脚本出图时需要一个 OpenAI 兼容接口。还没有的话：

- **方法一 · Claude 国内镜像站**：`https://claude-opus.top/` —— 国内直接使用 Claude
- **方法二 · 一站式 API**：`https://tryallapi.com/register?aff=5A6A` —— Claude / GPT / Gemini 一个 Key 全搞定，`GPTIMAGE_BASE_URL=https://tryallapi.com/v1` 即可给 `scripts/generate.py` 出图

Need a Claude account or an OpenAI-compatible key? Option 1: Claude mirror for mainland China `https://claude-opus.top/` · Option 2: one key for Claude / GPT / Gemini `https://tryallapi.com/register?aff=5A6A`. Any OpenAI-compatible endpoint works — these are just convenient options.

---

## 🖼 效果展示 / Showcase

同一张手机随手拍的水杯照片（卫衣用平铺图）→ GPT Image 2.5 真实生成，未经 PS（白底图仅跑了一次 `check_main_image.py --fix` 把近白像素统一为 #FFFFFF）。
One casual phone photo in → real GPT Image 2.5 outputs, no manual retouching (the main image only went through `check_main_image.py --fix`). Prompts: docs/showcase-prompts.md.

| Skill | 输入 Input | 输出 Output | |
|---|---|---|---|
| **白底主图 · White-bg main**`amazon-white-background`Sunburst，`check_main_image.py --fix` 后 100% #FFFFFF · coverage 87% |  |  | [在线试试 / Try online →](https://gptimage2.asia/ecommerce?utm_source=github&utm_medium=readme&utm_campaign=ecommerce-image-skills&utm_content=showcase-amazon-white-background) |
| **生活场景 · Lifestyle**`lifestyle-scene`Flare，户外徒步场景 |  |  | [在线试试 / Try online →](https://gptimage2.asia/ecommerce?utm_source=github&utm_medium=readme&utm_campaign=ecommerce-image-skills&utm_content=showcase-lifestyle-scene) |
| **卖点信息图 · Infographic**`selling-point-infographic`Sunburst，英文文案逐字渲染 |  |  | [在线试试 / Try online →](https://gptimage2.asia/ecommerce?utm_source=github&utm_medium=readme&utm_campaign=ecommerce-image-skills&utm_content=showcase-selling-point-infographic) |
| **模特上身 · Try-on**`model-try-on`Flare，平铺卫衣 → 模特 |  |  | [在线试试 / Try online →](https://gptimage2.asia/ecommerce?utm_source=github&utm_medium=readme&utm_campaign=ecommerce-image-skills&utm_content=showcase-model-try-on) |
| **小红书封面 · RED cover**`xiaohongshu-cover`Flare，中文大字标题 3:4 |  |  | [在线试试 / Try online →](https://gptimage2.asia/ecommerce?utm_source=github&utm_medium=readme&utm_campaign=ecommerce-image-skills&utm_content=showcase-xiaohongshu-cover) |
| **大促 Banner · Sale banner**`sale-banner`Flare，11.11 Shopee / TikTok Shop 风格 |  |  | [在线试试 / Try online →](https://gptimage2.asia/ecommerce?utm_source=github&utm_medium=readme&utm_campaign=ecommerce-image-skills&utm_content=showcase-sale-banner) |

> 输入图本身也是 AI 生成的虚构产品「AURA」，仅作演示。 The input product "AURA" is fictional (AI-generated) for demo purposes.

---

## 🧩 Skills / 技能列表

| Skill | 中文说明 | 默认模型 |
|---|---|---|
| `amazon-white-background` | Amazon 白底主图：纯白 #FFFFFF、主体 ≥85%、无文字，附 Python 检查/修复脚本 | Sunburst |
| `lifestyle-scene` | 生活场景图：厨房/户外/办公/健身等场景库，产品保真 | Flare |
| `model-try-on` | 模特上身图：平铺/挂拍 → 模特试穿，保留面料、颜色、Logo | Sunburst |
| `selling-point-infographic` | 卖点信息图：一图一卖点、图标+标注线，文案逐字确认 | Sunburst |
| `amazon-a-plus` | A+ 页面模块：970×600 / 970×300 / 300×300 / 1464×600…，统一风格锁 + 裁切脚本 | Flare |
| `size-chart` | 尺寸规格图：cm/inch 双单位标注、服装尺码表，数字只用用户提供的 | Sunburst |
| `multi-angle-set` | 多角度套图：正/侧/背/顶/45°/细节，统一光位背景 + 拼图脚本 | Sunburst |
| `sale-banner` | 大促 Banner：淘宝天猫 / Shopee / Lazada / TikTok Shop / Amazon 尺寸与大促配色 | Flare |
| `batch-background-swap` | 批量换背景 / SKU 换色：断点续跑、重试、预算上限、CSV 日志 | Sunburst |
| `xiaohongshu-cover` | 小红书封面 3:4：6 种爆款版式、大字标题、种草风 | Flare |
| `taobao-detail-long-image` | 淘宝/天猫/拼多多 750 宽详情长图：分屏规划 + 拼接切片脚本 | Flare |
| `ecommerce-listing-suite` | 总入口：按平台规划整套图（Amazon 7 张 / 淘宝 5+详情 / 小红书），调度上面 11 个 skill 并质检 | Auto |

---

## 🇺🇸 English

> **Where to use** — run online at [gptimage2.asia](https://gptimage2.asia/?utm_source=github&utm_medium=readme&utm_campaign=ecommerce-image-skills&utm_content=en-where-to-use) (international) · API via [tryallapi.com](https://tryallapi.com/?utm_source=github&utm_medium=readme&utm_campaign=ecommerce-image-skills&utm_content=en-where-to-use) (OpenAI-compatible, `GPTIMAGE_BASE_URL=https://tryallapi.com/v1`) · mainland China: [chatgpt-plus.top](https://chatgpt-plus.top/list/#/home) · Codex: [momoai.czvip.cn](https://momoai.czvip.cn/products/m13)

Twelve installable Agent Skills that turn a casual product photo into platform-ready ecommerce images — Amazon main images, lifestyle scenes, infographics, A+ modules, size charts, on-model shots, sale banners, Xiaohongshu covers and Taobao detail pages — from inside Claude Code, Codex, Cursor or any agent that reads `SKILL.md`.

**What makes it different from a prompt pack**

- 🔒 **Product identity lock** — every skill first locks shape / colour / logo / text and carries that block into every prompt.
- 📐 **Platform specs built in** — Amazon main image (#FFFFFF, ≥85% coverage), A+ module sizes, 750-px detail pages, 3:4 RED covers, banner sizes.
- 🧠 **Model routing** — **Flare** by default; **Sunburst** for text-preserving and local edits.
- 🛠 **Scripts for deterministic steps** — white-background/coverage check & fix, A+ crops, grids, long-image stitching, batch edits with resume and a budget cap.
- 🚦 **Three generation routes** — (a) the agent's built-in image tool, (b) `GPTIMAGE_API_KEY` + any OpenAI-compatible `GPTIMAGE_BASE_URL` via `scripts/generate.py`, (c) otherwise the final prompt plus a one-click link to run it online.

### Install

```bash
git clone https://github.com/xianyu110/ecommerce-image-skills.git && cd ecommerce-image-skills
cp -r skills/* ~/.claude/skills/     # Claude Code (or /.claude/skills/)
cp -r skills/* ~/.codex/skills/      # Codex
cp -r skills/* .cursor/skills/       # Cursor (project)
```

Each skill folder is self-contained (its scripts are bundled), so you can copy just the ones you need. Alternatives: `npx skills add xianyu110/ecommerce-image-skills`, or `/plugin marketplace add xianyu110/ecommerce-image-skills` in Claude Code.

### Use

```text
Use amazon-white-background on ./photos/bottle.jpg and run the check script.
Plan a full 7-image Amazon set for this bottle with ecommerce-listing-suite — show me the plan first.
Batch-replace backgrounds in ./photos with pure white, cap at 40 API calls.
```

### Optional API key

```bash
export GPTIMAGE_API_KEY=sk-...
export GPTIMAGE_BASE_URL=https://tryallapi.com/v1  # recommended; or https://api.openai.com / any OpenAI-compatible gateway
python skills/amazon-white-background/scripts/generate.py --model sunburst \
  --image bottle.jpg --size 1024x1024 --prompt-file prompt.txt --out out/main.png
python skills/amazon-white-background/scripts/check_main_image.py out/main.png --fix out/main-fixed.png
```

No key and no built-in tool? The skill prints the final prompt and a single link to run it in the browser at [gptimage2.asia](https://gptimage2.asia/ecommerce?utm_source=github&utm_medium=readme&utm_campaign=ecommerce-image-skills&utm_content=en-route-c).

### Skills

| Skill | What it does | Default model |
|---|---|---|
| `amazon-white-background` | Amazon main image: pure #FFFFFF, product ≥85%, no text — with a Python check/fix script | Sunburst |
| `lifestyle-scene` | Lifestyle / in-use scenes from a scene library, product kept identical | Flare |
| `model-try-on` | On-model try-on from flat-lay or hanger shots, fabric & logo preserved | Sunburst |
| `selling-point-infographic` | Feature infographics: one benefit per image, icons & callouts, exact copy | Sunburst |
| `amazon-a-plus` | A+ Content modules (970×600, 970×300, 300×300, 1464×600 …) with style lock + crop script | Flare |
| `size-chart` | Size / dimension charts in cm + inch and apparel size tables — user numbers only | Sunburst |
| `multi-angle-set` | Multi-angle gallery with one lighting/background lock + grid script | Sunburst |
| `sale-banner` | Sale banners for Taobao/Tmall, Shopee, Lazada, TikTok Shop, Amazon — sizes & campaign presets | Flare |
| `batch-background-swap` | Batch background swap / SKU recolour with resume, retries, budget cap, CSV log | Sunburst |
| `xiaohongshu-cover` | Xiaohongshu (RED) 3:4 covers in 6 proven layouts | Flare |
| `taobao-detail-long-image` | Taobao/Tmall/PDD 750-px detail page: screen plan + stitch & slice script | Flare |
| `ecommerce-listing-suite` | Orchestrator: plans a full listing set per platform, calls the 11 skills, QA every image | Auto |

---

## 🤝 Contributing

New platform specs, better templates, more scripts — PRs welcome. Please keep each skill self-contained (`skills//SKILL.md` + `scripts/`) and only cite platform rules you can link to.

## Related

- ecommerce-video-skills — 姊妹仓库：电商短视频 Skills（主图转视频 · 钩子脚本 · ffmpeg 自动成片）
- brand-ip-kit-skills — 品牌 IP 视觉套件 Skills（IP 形象 · Logo · VI · 包装 · 表情包）
- golive-china-skills — 国内上线 Skills（ICP 备案 · 微信/支付宝支付 · 小程序 · 隐私合规）
- awesome-gpt-image2.5 — GPT Image 2.5 prompt gallery (Flare · Sunburst · Sketch)
- awesome-gptimage2 — GPT Image 2 中文提示词实战手册
- [gptimage2.asia](https://gptimage2.asia/ecommerce?utm_source=github&utm_medium=readme&utm_campaign=ecommerce-image-skills&utm_content=related) — run GPT Image 2.5 online

## 🔗 友情链接 / Friends

- [LINUX DO](https://linux.do) — 新的理想型社区 / A new ideal community

## ⭐ Star History


## License

MIT © xianyu110. Platform rules change — always double-check the current seller-centre guidelines before uploading.

---


**关于作者 / About** — 我是 MaynorAI 团队，分享 AI 编程、AI SaaS 工具出海、一人团队搭建经验。
We're the MaynorAI team, sharing AI coding, taking AI SaaS tools global, and building as a one-person team.
