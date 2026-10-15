# Auto-Dev 全自动开发助手

> **版本**: 1.0.0 | **作者**: YannJY02 | **类型**: Model-invoked Skill
>
> **GitHub**: https://github.com/ekegukeku64-blip/claude-code-skills

---

## 简介

Auto-Dev 是一个 Claude Code Skill，提供端到端的自动化开发流水线。用户只需描述需求，skill 会自动完成从项目检测到最终报告的全部 7 个阶段。

### 解决的问题

大多数开发任务需要重复的准备步骤：检测技术栈、检查项目状态、规划实现方案、运行测试、审查代码。Auto-Dev 将这些步骤自动化，大幅减少手动操作。

### 核心特性

- 7 阶段全自动流水线
- 自动检测 10+ 种技术栈
- 委托专业 agent 进行代码审查和安全检查
- 支持 TDD 开发方式
- 生成中文开发报告
- 与 OpenWolf 协议兼容

---

## 安装

### 方式 1：直接复制

```bash
# 复制 skill 目录
cp -r auto-dev ~/.claude/skills/

# 确保目录结构正确
ls ~/.claude/skills/auto-dev/
# SKILL.md  references/
```

### 方式 2：从 GitHub 安装

```bash
git clone https://github.com/ekegukeku64-blip/claude-code-skills.git
cp -r claude-code-skills/auto-dev ~/.claude/skills/
```

### 目录结构

```
~/.claude/skills/auto-dev/
├── SKILL.md                    # 主 skill 文件（必须）
└── references/                 # 参考资料（按需加载）
    ├── detection-matrix.md     # 技术栈检测矩阵
    ├── health-checks.md        # 项目健康检查命令
    └── report-template.md      # 中文报告模板
```

---

## 触发方式

### 自动触发（推荐）

当用户描述开发任务时，skill 会自动触发。触发词包括：

| 语言 | 触发词                                                                                                                                     |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 中文 | 帮我开发、实现这个功能、全自动开发、帮我写、帮我实现、帮我做一个、开发一个、做个项目、新建项目、帮我修复、帮我重构、帮我优化、帮我添加功能 |
| 英文 | auto dev, auto develop, full auto, help me build, help me develop, help me implement, help me create, help me fix, help me refactor        |

### 不触发的情况

- 用户只是问问题或要解释（"解释一下"、"怎么用"、"什么是"）
- 用户说"直接做"但没有给出具体任务描述
- 用户想要 prompt 优化

---

## 7 个阶段详解

### 阶段 1：自动检测 (Auto-Detect)

**目标**：了解项目是什么、用了什么技术。

**检测内容**：

- 项目类型（前端/后端/全栈/CLI/库）
- 技术栈（TypeScript、Python、Go、Rust、Java 等）
- 框架（Astro、Next.js、React、Vue、Django、Flask、Gin 等）
- 包管理器（npm、pnpm、yarn、pip、cargo）
- 测试框架（jest、vitest、pytest、go test）
- Linter（eslint、flake8、golangci-lint）
- 构建工具（vite、webpack、tsc、go build）

**支持的技术栈**：

| 生态    | 检测文件                         | 支持的框架                               |
| ------- | -------------------------------- | ---------------------------------------- |
| Node.js | package.json                     | React, Next.js, Astro, Vue, Svelte, Nuxt |
| Python  | pyproject.toml, requirements.txt | Django, Flask, FastAPI                   |
| Go      | go.mod                           | Gin, Echo, Fiber, Chi                    |
| Rust    | Cargo.toml                       | Actix, Axum                              |
| Java    | pom.xml, build.gradle            | Spring Boot                              |

**输出**：项目概览表格

### 阶段 2：自动诊断 (Auto-Diagnose)

**目标**：检查项目当前健康状态。

**检查项**：

- Git 状态（未提交更改、最近提交、合并冲突）
- 依赖状态（node_modules、.venv、lock 文件）
- 构建状态（运行构建命令）
- 测试状态（运行测试命令）
- Lint 状态（运行 linter）

**优雅降级**：如果某个检查不适用（如没有测试框架），跳过并记录"未配置"。

**输出**：健康状态仪表盘

### 阶段 3：自动规划 (Auto-Plan)

**目标**：为用户的任务制定实现计划。

**步骤**：

1. 分析用户需求，提取关键信息
2. 读取 `.wolf/cerebrum.md` 了解项目约定（如果有）
3. 生成实现计划
4. 使用 `TaskCreate` 创建任务列表

**输出**：实现计划（步骤列表 + 任务跟踪）

### 阶段 4：自动实现 (Auto-Implement)

**目标**：按照计划实现代码。

**开发方式**：

- 如果有测试框架：TDD 方式（RED → GREEN → IMPROVE）
- 如果没有测试框架：直接实现，每步验证

**委托**：对于复杂实现，委托给 `tdd-guide` agent。

**输出**：实现的代码 + 任务完成状态

### 阶段 5：自动验证 (Auto-Verify)

**目标**：验证实现是否正确。

**验证项**：

- 构建验证（编译无错误）
- 测试验证（测试通过）
- Lint 验证（无错误）
- 类型检查（TypeScript/mypy）

**自动修复**：简单错误（格式问题、缺少导入）自动修复。

**输出**：验证结果

### 阶段 6：自动审查 (Auto-Review)

**目标**：审查代码质量和安全性。

**并行执行**：

1. 代码质量审查 → 委托 `code-reviewer` agent
2. 安全审查 → 委托 `security-reviewer` agent（安全敏感代码时）

**安全敏感代码触发条件**：

- 认证/授权逻辑
- 用户输入处理
- 数据库查询
- 文件操作
- API 调用
- 加密操作

**严重级别**：

- CRITICAL：必须修复才能继续
- HIGH：应该修复
- MEDIUM：建议修复
- LOW：可选

**输出**：审查报告

### 阶段 7：自动报告 (Auto-Report)

**目标**：生成开发报告。

**报告内容**：

- 项目概览（技术栈、框架、项目类型）
- 任务摘要（做了什么、为什么做）
- 变更详情（修改/新增/删除的文件）
- 验证结果（构建/测试/Lint 状态）
- 审查结果（发现的问题和修复情况）
- 下一步建议

**输出**：完整的中文开发报告

---

## 完整 SKILL.md

```yaml
---
name: auto-dev
description: >-
  全自动开发助手 — 自动检测项目、诊断问题、规划任务、实现代码、验证测试、审查代码、生成报告。
  7 阶段全自动流水线：检测 → 诊断 → 规划 → 实现 → 验证 → 审查 → 报告。
  TRIGGER when: user says "帮我开发", "实现这个功能", "全自动开发", "自动开发",
  "帮我写", "帮我实现", "帮我做一个", "开发一个", "做个项目", "新建项目",
  "帮我修复", "帮我重构", "帮我优化", "帮我添加功能", "帮我加个功能",
  "auto dev", "auto develop", "full auto", "automate development",
  "help me build", "help me develop", "help me implement", "help me create",
  "help me fix", "help me refactor", or any development task request.
  DO NOT TRIGGER when: user asks a question, wants explanation, says "just explain",
  "只是问问", "解释一下", "怎么用", "什么是", or wants prompt optimization.
  DO NOT TRIGGER when user says "直接做" without context — need a task description.
origin: community
metadata:
  author: YannJY02
  version: '1.0.0'
---
```

---

## 参考资料

### detection-matrix.md（技术栈检测矩阵）

映射文件模式到技术栈，用于阶段 1 的自动检测。

**核心映射**：

- `package.json` → Node.js/TypeScript 生态
- `pyproject.toml` → Python 生态
- `go.mod` → Go 生态
- `Cargo.toml` → Rust 生态
- `pom.xml` / `build.gradle` → Java/Kotlin 生态

**包管理器检测**：

- `pnpm-lock.yaml` → pnpm
- `yarn.lock` → yarn
- `package-lock.json` → npm

### health-checks.md（项目健康检查命令）

按技术栈组织的检查命令，用于阶段 2 的自动诊断。

**检查维度**：

- Git 状态
- 依赖状态
- 构建状态
- 测试状态
- Lint 状态

### report-template.md（中文报告模板）

用于阶段 7 的自动报告生成。

**报告结构**：

1. 项目概览
2. 任务摘要
3. 变更详情
4. 验证结果
5. 审查结果
6. 下一步建议

---

## 示例

### 示例 1：新功能开发

**用户输入**：

```
帮我给博客添加一个搜索功能
```

**执行流程**：

1. 检测：Astro v6 + Tailwind CSS + MDX
2. 诊断：Git 干净、构建正常、无测试框架
3. 规划：实现搜索组件 → 添加搜索索引 → 集成到布局
4. 实现：创建 Search.astro、search.ts、搜索逻辑
5. 验证：构建通过
6. 审查：代码质量通过，无安全问题
7. 报告：生成中文报告

### 示例 2：Bug 修复

**用户输入**：

```
帮我修复首页加载慢的问题
```

**执行流程**：

1. 检测：Next.js 15 + React
2. 诊断：构建正常、测试 80% 通过
3. 规划：分析性能瓶颈 → 优化图片 → 添加懒加载
4. 实现：TDD 方式写性能测试 → 优化代码
5. 验证：测试通过、构建通过
6. 审查：代码质量通过
7. 报告：生成报告

### 示例 3：重构

**用户输入**：

```
帮我重构 API 层，用仓储模式
```

**执行流程**：

1. 检测：Go + Chi router
2. 诊断：Git 有未提交更改、测试全部通过
3. 规划：定义接口 → 实现仓储 → 迁移调用方
4. 实现：TDD 方式逐步重构
5. 验证：测试通过、构建通过
6. 审查：代码质量通过
7. 报告：生成报告

---

## 与其他 Skill 的关系

| 组件                      | 关系                                           |
| ------------------------- | ---------------------------------------------- |
| `code-check`              | 互补。code-check 只检查问题，auto-dev 实现功能 |
| `code-reviewer` agent     | auto-dev 阶段 6 委托代码审查                   |
| `security-reviewer` agent | auto-dev 阶段 6 委托安全审查                   |
| `tdd-guide` agent         | auto-dev 阶段 4 委托 TDD 指导                  |
| `prompt-optimizer` skill  | 用户想要优化 prompt 时使用                     |

---

## 语言处理

- 检测用户输入语言
- 中文输入 → 中文输出
- 英文输入 → 英文输出
- 技术术语保持英文（如 API、CSS、npm）

---

## OpenWolf 兼容性

如果项目有 `.wolf/` 目录：

1. 检测阶段读取 `.wolf/anatomy.md`
2. 实现阶段读取 `.wolf/cerebrum.md`
3. 完成后更新 `.wolf/memory.md`
4. 遵守 `.wolf/OPENWOLF.md` 的所有规则

---

## 常见问题

### Q: skill 会自动修改我的代码吗？

A: 是的，auto-dev 会自动实现代码。但在实现前会展示计划，用户可以确认后再执行。

### Q: 如果没有测试框架怎么办？

A: 会跳过 TDD 阶段，直接实现代码，并在报告中说明"未配置测试框架"。

### Q: 支持哪些语言？

A: 支持 Node.js/TypeScript、Python、Go、Rust、Java/Kotlin、Ruby、PHP、Swift、C/C++ 等主流语言。

### Q: 如何指定审计范围？

A: 目前 auto-dev 默认审计整个项目。如果需要指定范围，可以使用 code-check skill。

---

## License

MIT
