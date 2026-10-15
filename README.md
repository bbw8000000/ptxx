<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/bbw8000000/ptxx/main/public/favicon.svg">
    <img width="64" height="64" alt="盘腿修仙" src="https://raw.githubusercontent.com/bbw8000000/ptxx/main/public/favicon.svg">
  </picture>
</p>

<h1 align="center">盘腿修仙</h1>

<p align="center">
  <i>学修仙的个人博客 — AI 工具 · 在线工具 · 成长记录</i>
</p>

<p align="center">
  <a href="https://zilvd.icu/">访问博客</a>
  ·
  <a href="#核心路线">核心路线</a>
  ·
  <a href="#本地开发">本地开发</a>
  ·
  <a href="#维护入口">维护入口</a>
</p>

---

## 核心路线

这个站点目前按三条主线组织：

- **AI 工具**：记录真实使用场景、提示词、踩坑和工作流。
- **在线工具**：沉淀可以直接在浏览器里使用的小工具。
- **成长记录**：记录普通人的试错、复盘、坚持和阶段状态。

主要页面：

| 页面       | 作用                          |
| ---------- | ----------------------------- |
| `/`        | 入口页，负责品牌和氛围        |
| `/home/`   | 主首页，承接三条阅读/使用路线 |
| `/blog/`   | 全部文章归档                  |
| `/tools/`  | 在线工具箱                    |
| `/growth/` | 成长记录                      |
| `/now/`    | 此刻状态                      |
| `/about/`  | 关于我                        |

## 技术栈

| 层   | 技术                                                          |
| ---- | ------------------------------------------------------------- |
| 框架 | Astro v6                                                      |
| 样式 | Tailwind CSS v4 + 自定义 CSS 变量                             |
| 内容 | Markdown / MDX + Astro Content Collections                    |
| 搜索 | Pagefind                                                      |
| 字体 | `@fontsource` 自托管字体 + 按词频分档的中文子集（构建时生成） |
| 部署 | GitHub Pages + GitHub Actions                                 |
| 评论 | 自建 API：Cloudflare Pages Functions + D1                     |

## 本地开发

```sh
npm install
npm run dev
```

生成中文子集字体需要 `fonttools` 与 `brotli`（`pip install fonttools brotli`）。没装也能构建，
中文会回退到系统衬线体，`npm run fonts:check` 会提示分档已经落后于内容。

开发地址通常是：

```text
http://localhost:4321/
```

常用命令：

```sh
npm run dev           # 启动开发服务器
npm run build         # 构建站点并生成 Pagefind 索引
npm run check         # Astro 类型检查与内容集合校验（不构建）
npm run test          # 运行单元测试
npm run lint          # ESLint 检查
npm run format:check  # Prettier 格式检查
npm run verify        # lint + 格式 + 测试 + 检查 + 构建 + 字体覆盖 + 站点体检（提交前跑这个）
npm run check:site    # 只读站点体检：死链 / 孤儿页面 / 未被引用的资源
npm run fonts:build   # 单独重跑中文分档：排序 → 生成子集 → 注入 @font-face
npm run fonts:check   # 校验每页每个汉字都有字体覆盖
npm run preview       # 预览构建产物
npm run daily         # 本地补跑每日内容生成
npm run build:api     # 构建评论 API（Pages Functions）产物
```

### 中文体积是怎么降下来的

中文衬线体 Noto Serif SC 整字库 1.4MB。`@fontsource` 按**码点**把它切成约 100 个分片，
浏览器按码点命中，于是每页要拉 16 个文件、约 640KB，才能显示正文里那 250 多个汉字。

改成按**词频**（这个字出现在多少页）排序分档后，每页只需要它真正用到的那 1~2 档：
**中位 118KB / 1 个请求**，降幅约 81%。分档与页面映射由 `scripts/build-font-packs.mjs`、
`scripts/subset_font_packs.py`、`scripts/inject-font-packs.mjs` 三个脚本在构建时完成，
详见 `CLAUDE.md`。细节可自查：`config/font-packs.json` 是分档表，`public/fonts/` 是产物。

首页与全站背景的盤树素材也做过取舍：海报用 WebP（124KB，JPEG 193KB 作回退），
背景视频按 CRF 33 重编码（571KB → 465KB），在 56% 不透明度 + 遮罩下看不出差别。

## 项目结构

```text
src/
├── components/          # 通用组件
│   └── home/            # 首页模块
├── content/
│   ├── posts/           # 博客文章
│   ├── projects/        # GitHub 项目快照（脚本生成）
│   └── templates/       # 内容模板
├── content.config.ts    # Content Collections 的 schema（posts / projects）
├── layouts/             # 全站布局和文章布局
├── pages/               # 页面路由
│   ├── index.astro      # 入口页
│   ├── home.astro       # 主首页
│   ├── blog/            # 博客列表和文章详情
│   └── tools/           # 在线工具页面
├── scripts/             # 客户端脚本（入口动效、背景、交互反馈等）
├── styles/              # 全局样式
├── utils/               # 阅读时长、摘要、草稿存储等
└── lib/                 # API 客户端与领域逻辑

functions/               # 评论 API（Cloudflare Pages Functions）
├── _lib/                # 鉴权、限流、校验、CORS、D1 访问
└── api/                 # auth / comments / admin 三组路由

migrations/              # D1 建表 SQL
tests/                   # node:test 单元测试
scripts/                 # 构建与内容生成脚本（Node + Python）
config/                  # 分档表、白名单等构建期配置（font-packs.json 由脚本维护）
public/fonts/            # 中文子集字体（构建时生成，文件名带内容指纹）
.github/workflows/       # CI/CD（含 PR 门禁、站点部署、API 部署、日更）
```

## 维护入口

### 新增文章

文章放在：

```text
src/content/posts/
```

可以复制模板：

```text
src/content/templates/post-template.md
```

发布前把 `draft` 改成 `false` 或删除该字段。

### 发布一篇文章（不用装任何软件）

浏览器里三步就够了，**不需要**本地环境、不需要 Git 命令：

1. 打开 👉 <https://github.com/bbw8000000/ptxx/tree/main/src/content/posts>
2. 右上角 **Add file → Create new file**（新建）或 **Upload files**（上传已有的 `.md`）
3. 文件名用英文/拼音（例如 `my-first-post.md`），内容照抄下面模板，点 **Commit changes**

Frontmatter 模板：

```markdown
---
title: '文章标题'
description: '一句话说明这篇文章解决什么问题，或记录什么经历。'
pubDate: 2026-10-15
heroImage: '/hero/og-default.png'
category: '技术'
tags: ['AI', '工具']
featured: false
draft: false
---

这里开始写正文，用 Markdown 格式。

## 小标题

- 列表项
```

字段说明（完整 schema 见 `src/content.config.ts`）：

| 字段          | 必填 | 默认     | 说明                                |
| ------------- | ---- | -------- | ----------------------------------- |
| `title`       | 是   | —        | 文章标题                            |
| `description` | 是   | —        | 摘要，用于列表页与 SEO              |
| `pubDate`     | 是   | —        | 发布日期（`YYYY-MM-DD`）            |
| `updatedDate` | 否   | —        | 更新日期，会显示「已更新」          |
| `heroImage`   | 否   | 默认封面 | 封面图路径，如 `/hero/xxx.png`      |
| `category`    | 否   | `未分类` | 分类，用于 `/category/<分类>/` 归档 |
| `tags`        | 否   | `[]`     | 标签数组，用于 `/tag/<标签>/`       |
| `featured`    | 否   | `false`  | `true` 会在首页置顶                 |
| `draft`       | 否   | `false`  | `true` 表示草稿，**不会发布**       |
| `noindex`     | 否   | `false`  | `true` 告诉搜索引擎不要收录         |

> 封面图放 `public/hero/` 下；不填 `heroImage` 会回退到默认封面。

提交后会发生什么：

- **GitHub Pages**：`Deploy to GitHub Pages` 工作流自动构建，约 1–2 分钟后发布到
  <https://bbw8000000.github.io/ptxx/>。
- **生产站点 <https://zilvd.icu>**：服务器定时任务（每 10 分钟）拉取仓库最新代码 →
  重新构建 → 自动部署，**最多 10 分钟**后线上更新。

### 新增工具

工具页面放在：

```text
src/pages/tools/
```

具体步骤见：

```text
docs/add-tool.md
```

### 评论与账号 API

自建的评论 / 账号接口（Cloudflare Pages Functions + D1）的接口清单、环境变量、
一次性初始化步骤和已知缺口见：

```text
docs/comment-api.md
```

### 站点体检

`npm run check:site` 只读扫描 `dist`，报告三类「不足」（需先 `npm run build`）：

| 检查项             | 说明                                       | 是否导致失败           |
| ------------------ | ------------------------------------------ | ---------------------- |
| 站内死链           | 链接目标在产物里不存在                     | 是（真 bug）           |
| 孤儿页面           | 构建出来了但没有任何内链指向，访客无法到达 | 否，加 `--strict` 才算 |
| 未被引用的静态资源 | `public/` 里没有任何产物引用到的文件       | 否，加 `--strict` 才算 |

`--strict` 用法：`npm run check:site -- --strict`。脚本不改任何文件。

### 部署

同一份源码构建出两个站点，靠 `SITE_URL` / `BASE_PATH` 两个环境变量区分：

| 站点       | 地址                                 | 构建参数                                                   | 触发方式                     |
| ---------- | ------------------------------------ | ---------------------------------------------------------- | ---------------------------- |
| 生产站     | <https://zilvd.icu>                  | `SITE_URL=https://zilvd.icu`、`BASE_PATH=/`                | 服务器定时任务（每 10 分钟） |
| Pages 镜像 | <https://bbw8000000.github.io/ptxx/> | `SITE_URL=https://bbw8000000.github.io`、`BASE_PATH=/ptxx` | 推送 `main` 后工作流自动部署 |

> 生产站 `zilvd.icu` 跑在国内服务器（腾讯云轻量）上，已做 ICP 备案；GitHub Pages
> 在海外，**只作预览/镜像**，不要给它绑 `zilvd.icu`（会让备案失效）。

- 推送到 `main` 分支后，`Deploy to GitHub Pages` 工作流自动构建并部署静态站点到 GitHub Pages。
- `functions/**`、`migrations/**` 或 `wrangler.toml` 有改动时，`Deploy API` 工作流会应用 D1 迁移并部署 Pages Functions。
- PR 会先经过 `CI` 工作流的 lint / 格式 / 测试 / 类型检查门禁。

> 本地手动构建生产站：`SITE_URL=https://zilvd.icu BASE_PATH=/ npm run build`，
> 产物在 `dist/`。

## 许可

- 原创程序代码、配置、脚本和工作流采用 [MIT License](./LICENSE)。
- `src/content/posts/**` 中的原创文章和 `public/hero/**` 中的原创封面保留所有权利。
- `src/content/projects/**` 中的第三方 README 快照仍遵循各自上游许可证，不由本仓库重新授权。
- 依赖包、字体及其他第三方资源遵循其各自许可证。

完整边界说明见 [LICENSE-SCOPE.md](./LICENSE-SCOPE.md)。
