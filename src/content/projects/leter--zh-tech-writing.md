---
title: "leter/zh-tech-writing"
owner: "leter"
name: "zh-tech-writing"
fullName: "leter/zh-tech-writing"
description: "写中文技术文档的 Agent Skill，基于阮一峰《中文技术文档的写作规范》：短句、平实、没有 AI 腔"
sourceUrl: "https://github.com/leter/zh-tech-writing"
stars: 285
forks: 13
language: "未知"
topics: ["agent-skills", "chinese", "claude-code", "documentation", "style-guide", "technical-writing"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-24T17:49:53Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# zh-tech-writing

一个写中文技术文档的 Agent Skill。用它写 README、设计文档、接口说明和教程，读起来像工程师写的，没有 AI 腔。

规则基于阮一峰的《中文技术文档的写作规范》整理，另外补充了一份“AI 腔清单”。

适用于 Claude Code，以及其他支持 Agent Skills 的工具。

## 效果

下面是一段常见的 AI 写法：

> 随着微服务架构的不断发展，配置管理已经成为一个不容忽视的问题。值得注意的是，ConfigHub 不仅提供了强大的配置管理能力，更实现了与现有系统的无缝集成——让你轻松应对各种复杂场景！

用这个 skill 以后：

> ConfigHub 用来集中管理多个服务的配置。修改配置后，服务会在 5 秒内加载新值，不用重启。接入时，在启动命令里加上 `--config-hub=<地址>` 即可。

改动有三处：
- 删掉开场套话和感叹号。
- 去掉“不仅……更……”这种句式和破折号。
- 用具体事实替换“强大”“无缝”这类形容词。

事实需要来自你的项目。skill 找不到事实时，会删掉空话，或者直接问你。

## 安装

用 skills 命令行工具安装到全局：

```bash
npx skills add leter/zh-tech-writing -g
```

也可以手动安装。把 `skills/zh-tech-writing` 目录复制到 `~/.claude/skills/` 下面：

```bash
git clone https://github.com/leter/zh-tech-writing.git
cp -r zh-tech-writing/skills/zh-tech-writing ~/.claude/skills/
```

## 安装 autocorrect（推荐）

autocorrect 是一个命令行工具。它会自动在中英文之间补空格，并把中文句子里的半角标点改成全角。装了它，AI 写完文档后会按 skill 的要求运行一遍；没装就跳过这一步。

```bash
# macOS
brew install autocorrect

# Linux：从 Releases 页面下载二进制文件，放到 PATH 里的任意目录
# https://github.com/huacnlee/autocorrect/releases

# 已经装了 Rust 工具链
cargo install autocorrect
```

装好后运行 `autocorrect -V`，能看到版本号就说明装好了。

## 使用

你让 AI 写或修改中文技术文档时，skill 通常会自动加载。比如：

```
帮我给这个项目写一份 README
把 docs/deploy.md 改得更易读一些
```

也可以手动调用：

```
/zh-tech-writing 改一下 docs/api.md
```

如果只想看修改意见，不想让它直接改文件，就说出来：

```
/zh-tech-writing 检查 docs/api.md，只列问题，不要改
```

它会按“原句 → 改后 → 原因”的格式列出问题。

## 它做了什么

skill 让 AI 按下面的流程写文档：

1. 先确定读者是谁，读完要能做成什么事。
2. 按规则写：句子、语气、段落与结构、排版。
3. 用“AI 腔清单”逐条检查全文，命中的地方全部改掉。
4. 运行 `autocorrect --fix`，修正空格和标点。
5. 手动检查 autocorrect 不管的引号、省略号和破折号。

主要规则：

- 句子：逗号隔开的每一截尽量在 20 字以内。多用肯定句和主动语态。直接用动词，不套“进行”“做出”。
- 语气：像给同事讲清楚一件事。用数字、命令和报错原文代替形容词。
- 结构：每段第一句说重点。标题不跳级。少用四级标题。加粗和列表都不滥用。
- AI 腔清单：共 14 条，包括开场和结尾套话、“不是 A，而是 B”句式、硬凑三个排比、宣传腔形容词、黑话、破折号和翻译腔。

完整规则见 SKILL.md。

## 目录结构

```
skills/zh-tech-writing/
├── SKILL.md                     主文件：流程、核心规则、AI 腔清单
└── references/
    ├── typography.md            数字、标点、英文缩写的细则
    └── manual-structure.md      产品手册的目录结构和文件命名
```

`references/` 下的文件只在需要时读取。比如，文档里有数字范围时才读 `typography.md`。

## 来源与致谢

- 句子、段落、标题、标点和数字的规则，整理自阮一峰的《中文技术文档的写作规范》。原项目放在公共领域（public domain）。
  - 原规范里有两处符号写错了，这里改成了标准写法：破折号用 `——`，省略号用 `……`。
  - 原规范说数字和中文之间加不加空格都可以。这里统一定为加空格，这样和 autocorrect 的结果一致。
  - 原规范要求“不使用非正式语言”。这里放宽为：可以口语化，但不用网络流行语。
- 原规范本身参考了华为《产品手册中文写作规范》、LeanCloud《文档风格指南》、中文文案排版指北、Google Developer Documentation Style Guide 和国家标准 GB/T 15835-2011。
- “AI 腔清单”“用事实代替形容词”和整套写作流程，是这个项目新增的内容。
- 空格和标点的自动修正由 autocorrect（MIT 许可）完成。本项目只调用这个工具，没有包含它的代码。

## 许可

MIT
