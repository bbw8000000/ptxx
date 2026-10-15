---
title: "zjp1997720/zhijian-ai-bluebook-workbuddy-harness"
owner: "zjp1997720"
name: "zhijian-ai-bluebook-workbuddy-harness"
fullName: "zjp1997720/zhijian-ai-bluebook-workbuddy-harness"
description: "智见 AI 蓝皮书：拆解 WorkBuddy 的提示词、记忆、插件、专家、Skill 与安全边界。"
sourceUrl: "https://github.com/zjp1997720/zhijian-ai-bluebook-workbuddy-harness"
stars: 97
forks: 10
language: "未知"
topics: ["ai-agent", "bluebook", "harness", "workbuddy", "zhijian-ai"]
license: "未标注"
homepage: "https://zjp1997720.github.io/zhijian-ai-bluebook-workbuddy-harness/"
defaultBranch: "main"
snapshotDate: "2026-08-17"
pushedAt: "2026-08-16T05:51:24Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

WorkBuddy Harness 拆解

把 UI 上的按钮，翻译回磁盘上的文件与发给模型的请求

智见 AI 蓝皮书 · ZJBB-003 · 公开测试版 v0.1.0


  在线阅读
  ·
  下载 PDF
  ·
  离线 HTML
  ·
  反馈问题


---

WorkBuddy 很容易上手，也很容易在深入使用后碰到一堵看不见的墙：它为什么记住了这件事？插件往主线程里注入了什么？改了配置为什么不生效？专家、Skill、Connector、SubAgent 和 Agents Team 到底是什么关系？

这本书不复述按钮怎么点。它沿着一条更有用的路径往下拆：**从界面行为找到本地文件，再从本地文件还原一次请求是怎样被拼装出来的。**

| 版本 | 规模 | 图解 | 证据边界 |
|---|---:|---:|---|
| 公开测试版 v0.1.0 | 60 页 · 15 章 + 4 附录 | 18 张机制图 | WorkBuddy 5.3.13 · macOS 本地实测 |

## 直接阅读

| 形式 | 入口 | 适合场景 |
|---|---|---|
| 在线版 | [**打开 GitHub Pages →**](https://zjp1997720.github.io/zhijian-ai-bluebook-workbuddy-harness/) | 浏览器直接阅读，无需下载 |
| PDF | **下载 book.pdf →** | A4 排版，适合本地阅读与转发 |
| 单文件 HTML | 下载 book.html | 自包含离线版，保存后可直接打开 |
| Release | 查看 v0.1.0-pilot | 版本化下载、发布说明与资产校验 |

> PDF 文件较大，GitHub 在线预览可能加载不完整，建议下载后阅读。

## 适合谁

- 天天在用 WorkBuddy，但遇到“不生效、行为怪、插件装完反而变笨”时不知道从哪里排查的人。
- 想弄懂系统提示词、身份、记忆、插件和项目上下文如何共同进入一次请求的 Agent 实践者。
- 需要安全定制 WorkBuddy，或要把 Harness 机制讲给学员、同事和客户的工程师与讲师。
- 用过 Claude Code、Codex 等 Coding Agent，想理解 WorkBuddy 图形界面背后运行机制的人。

## 读完能解决什么

1. 建立一套可迁移的 Harness 心智模型，而不是背功能菜单。
2. 在本机找到 WorkBuddy 关键目录，并理解每一层文件负责什么。
3. 说清插件、专家、Skill、Connector、SubAgent 与 Agents Team 的关系。
4. 看懂身份、记忆、插件注入和项目上下文如何拼成系统提示词。
5. 用“层级 → 优先级 → 缓存 → 同步 → 版本”五步路径排查为什么配置没有生效。
6. 在安装插件或修改配置前，先判断注入面、权限面与隐私风险。

## 全书结构

| 部分 | 章节 | 你会得到什么 |
|---|---|---|
| 一、从按钮走向文件 | 第 1—3 章 | 一次对话的拆解方法、五层 Harness 模型、本地目录地图 |
| 二、请求是怎样拼出来的 | 第 4—6 章 | 三层记忆、系统提示词拼装、身份四件套与边界 |
| 三、能力如何进入主线程 | 第 7—11 章 | 专家、插件、Skill、会话证据、Connector 与 MCP |
| 四、安全与生态坐标 | 第 12—13 章 | 插件供应链、隐私边界，以及与 Claude Code / Codex 的设计对照 |
| 五、从理解走向实战 | 第 14—15 章 | 五步排查手册，以及课程、团队和组织复用方法 |
| 附录 | A—D | 目录速查、故障排查卡、术语表、版本冻结与研究方法 |

### 两条推荐阅读路线

- **只想把 WorkBuddy 用稳：** 1 → 2 → 3 → 5 → 7 → 12 → 14。
- **想做深度定制或讲课：** 在主路线基础上补 4 → 6 → 8 → 9 → 10 → 13 → 15。

## 书中一页

这张图概括了全书的方法：每一个产品层级，都要能落回本地证据，并在书中找到对应解释。

*图片：五层 Harness 与本地证据对照*

## 版本与证据边界

- **目标版本：** WorkBuddy 5.3.13（build `20fd9da5c9a0cac41feb61b133f7bce4fe183a89`）。
- **声明环境：** macOS 本地安装与运行时观测。
- **资料截止：** 2026-08-15。
- **证据规模：** 12 个来源、27 条 Claim，关键结论覆盖率 100%。
- **研究边界：** 只解释本地文件、官方资料和可观测运行时能够支持的结论；不把闭源内部实现的推断写成事实。

WorkBuddy 更新很快。书中的路径、字段和默认行为都应放在上述版本边界内理解；使用更新版本时，请同时核对官方文档和本机实际结果。

本书是独立研究与实践指南，与 WorkBuddy 及相关厂商无隶属或官方合作关系。

## 许可

- 原创正文与确定性知识图：[`CC BY-SA 4.0`](https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hans)。
- 原创示例代码：`MIT`。
- 第三方材料遵循其原始许可。
- 智见 AI 名称、Logo、智见小蓝角色设定与品牌母资产保留权利，不随正文许可开放。

完整边界见 `LICENSES.md`。文件完整性可通过 `CHECKSUMS.sha256` 核验。

## 关于作者

**大鹏｜智见 AI**

智见科技创始人，AI 落地顾问、企业与高校培训讲师，长期研究 Agent、Skill、Context Engineering 与 AI 编程工作流。

- GitHub：@zjp1997720

## 仓库边界

这个仓库只发布读者交付物：自包含 HTML、PDF、许可、校验和与经批准的展示图片。它不包含内部写书 Skill、作者画像、研究控制面、审稿记录、构建中间件或生产工作流。

如果你发现版本差异、事实错误或阅读问题，请直接提交 Issue。
