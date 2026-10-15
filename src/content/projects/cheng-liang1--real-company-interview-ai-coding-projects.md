---
title: "CHENG-LIANG1/real-company-interview-ai-coding-projects"
owner: "CHENG-LIANG1"
name: "real-company-interview-ai-coding-projects"
fullName: "CHENG-LIANG1/real-company-interview-ai-coding-projects"
description: "三个匿名化真实 AI Coding 面试项目题与一套通用解题方法"
sourceUrl: "https://github.com/CHENG-LIANG1/real-company-interview-ai-coding-projects"
stars: 153
forks: 9
language: "未知"
topics: ["agent", "ai-coding", "documentation", "interview", "take-home-assignment"]
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-08-27"
pushedAt: "2026-08-26T05:47:32Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# 真实公司面试 AI Coding 项目

本仓库整理了三道来自真实招聘流程的 AI Coding 项目题，并给出一套可以复用于限时笔试、Take-home Assignment 和现场结对开发的通用方法。

为保护隐私，本文做了以下处理：

- 不出现公司、面试官、招聘人员或业务客户名称。
- 题面经过匿名化和结构化改写，不是原始材料的逐字转载。
- 只保留能够说明工程能力的技术目标、约束和验收标准。

## 三道项目题

| 编号 | 项目 | 形态 | 主要考察 | 我的个人解法 |
| --- | --- | --- | --- | --- |
| 01 | Computer Use Agent Dashboard | Web + Agent + 隔离桌面 | Computer Use、工具循环、会话隔离、可观测性、运行时可靠性 | ai-agent-dashboard |
| 02 | React Native 截图行动 Agent | React Native / iOS，48 小时 | 多模态理解、结构化 Action、Human-in-the-loop、原生工具、Memory | ContactFlow |
| 03 | Jira 风格任务管理系统 | Web，一日 MVP | 需求取舍、CRUD、看板拖拽、本地持久化、时间线、交付质量 | ForceTrack |

三个解法仓库是我针对对应题目的个人实现，包含源码、设计文档、测试与实际交付记录。本仓库继续只保留题目复盘和方法论。

## ForceTrack：真实 AI Coding 对话历史

查看 ForceTrack 从 PRD 到 Repo Wiki 的 24 个真实对话轮次

## 通用方法

AI Coding 项目通用解法 将整个过程拆成：

1. 需求澄清与范围冻结；
2. Starter / 现有仓库审计；
3. 数据、状态、工具与运行时设计；
4. 垂直切片和 AI 任务拆分；
5. 人工 Review 与自动化验证；
6. 限时取舍、演示和最终交付。

## 三道题共同在考什么

三道题表面上分别是 Agent、移动端和项目管理系统，实际都在判断候选人能否：

- 把模糊要求转成可验收的 P0 范围；
- 使用 AI 提高实现速度，同时保留自己的技术判断；
- 做出完整闭环，而不是堆页面或套一层模型 API；
- 处理状态、失败、恢复、权限、持久化和边界条件；
- 用测试、构建、演示和文档证明结果；
- 在时间有限时主动砍掉低价值范围。

真正拉开差距的通常不是代码量，而是：**需求理解、架构边界、过程控制、验收证据和取舍能力。**

## 阅读顺序

如果你准备类似笔试，建议先读三道题，再读通用解法。实际做题时，先复制通用解法中的需求矩阵、任务合同和交付检查清单，再根据题目删减。

## 说明

本文用于个人复盘、求职准备和工程学习。不同招聘流程的实际题面、时限与保密要求可能不同，请始终以你收到的正式材料为准。
