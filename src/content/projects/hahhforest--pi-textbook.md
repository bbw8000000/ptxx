---
title: "hahhforest/pi-textbook"
owner: "hahhforest"
name: "pi-textbook"
fullName: "hahhforest/pi-textbook"
description: "《动手学 Pi》：沿 15 个真实 checkpoint 从零构建 Pi-style Agent"
sourceUrl: "https://github.com/hahhforest/pi-textbook"
stars: 92
forks: 6
language: "TypeScript"
topics: ["agent-engineering", "ai-agent", "chinese", "llm", "textbook", "typescript"]
license: "MIT"
homepage: "https://build-your-own-pi-cn.enochzhang.chatgpt.site"
defaultBranch: "main"
snapshotDate: "2026-07-22"
pushedAt: "2026-07-21T17:17:24Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

动手学 Pi


  沿 15 个 checkpoint，从一条离线轨迹开始，亲手实现一个 Pi-style coding agent。


  在线阅读
  · 课程代码


  
    
  


## 这是什么

沿 15 个可运行 checkpoint，从一条离线 Agent 轨迹出发，逐步实现：

`TypeScript 协议 → 流式模型 → Provider → 工具 → Agent Loop → 会话树 → Context Compaction → 扩展 → Eval`

每章由四部分闭环：**教材正文 + 真实 commit + 聚焦测试 + 故障实验**。课程代码不是伪代码演示，而是一条可以 checkout、运行和验证的 Git 历史。

## 开始阅读

直接打开[在线教材](https://build-your-own-pi-cn.enochzhang.chatgpt.site)，或在本地运行：

```bash
git clone https://github.com/hahhforest/pi-textbook.git
cd pi-textbook
npm install
npm run dev
```

## 教材与课程代码

| 仓库 | 作用 |
| --- | --- |
| `pi-textbook` | 你正在看的 HTML 教材与网站 |
| `pi` 的课程分支 | 15 个 checkpoint 的可运行代码；课程源码位于仓库内的 `packages/pi-course/` |

课程分支从固定上游 commit `8479bd84` 出发，以 `course(00)` 到 `course(14)` 组织完整历史；`pi-course-v1` 与 `course-v1/00` 到 `course-v1/14` tags 固定第一版课程。

## 和 Agent 一起练习

```bash
git clone --branch course/build-your-own-pi https://github.com/hahhforest/pi.git
cd pi
npm install
npm run checkpoint -w @pi/course -- 05
npm run practice -w @pi/course -- 05 ../pi-practice-05
```

`checkpoint` 定位本章的 parent、target 与聚焦测试；`practice` 创建一个不含答案和 Git 历史的练习目录。把本章网页、命令输出与练习目录中的 `LEARNING.md` 一起交给陪学 Agent 即可。

## 项目说明

这是社区原创的非官方课程，不隶属于或代表 Pi / Earendil Works。应用与原创代码采用 MIT License；教材正文与原创媒体采用 CC BY 4.0；Pi 上游代码沿用其原许可证和作者归属。详见 `LICENSE` 与 `LICENSE-CONTENT`。

构建、测试和跨仓库历史校验见 `CONTRIBUTING.md`。

感谢 [LINUX DO](https://linux.do/) 提供中文技术交流空间。
