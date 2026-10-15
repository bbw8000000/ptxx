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

# 全自动开发助手 (Auto-Dev)

端到端自动化开发流水线。从项目检测到最终报告，7 个阶段全自动执行。

## 为什么需要这个 Skill

大多数开发任务需要重复的准备步骤：检测技术栈、检查项目状态、规划实现方案、运行测试、审查代码。这个 skill 将这些步骤自动化，让你只需描述需求，剩下的交给流水线。

## 何时使用

- 用户描述了一个开发任务（新功能、bug 修复、重构等）
- 用户说"帮我开发"、"实现这个功能"、"全自动开发"
- 用户想要一个端到端的开发流程而不想手动协调每一步

### 何时不用

- 用户只是问问题或要解释
- 用户说"直接做"但没有给出具体任务描述
- 用户想要 prompt 优化（用 prompt-optimizer skill）
- 用户只是想聊天或探索代码库

## 工作流程

按以下 7 个阶段顺序执行。每个阶段完成后自动进入下一阶段。

### 阶段 1：自动检测 (Auto-Detect)

**目标**：了解项目是什么、用了什么技术。

1. 检查是否有 `.wolf/anatomy.md`，有则先读取（遵守 OpenWolf 协议）
2. 检测项目类型（参考 `references/detection-matrix.md`）：
   - 扫描 `package.json`、`go.mod`、`pyproject.toml`、`Cargo.toml` 等
   - 识别框架：Astro、Next.js、React、Vue、Django、Flask、Gin 等
   - 识别语言：TypeScript、Python、Go、Rust、Java 等
3. 检测项目结构：
   - 源码目录（src/、app/、lib/）
   - 测试目录（test/、**tests**/、tests/）
   - 配置文件（tsconfig、eslint、prettier 等）
4. 检测开发工具链：
   - 包管理器（npm、pnpm、yarn、pip、cargo）
   - 测试框架（jest、vitest、pytest、go test）
   - Linter（eslint、flake8、golangci-lint）
   - 构建工具（vite、webpack、tsc、go build）

**输出**：项目概览表格（技术栈、框架、工具链、目录结构）

### 阶段 2：自动诊断 (Auto-Diagnose)

**目标**：检查项目当前健康状态。

根据检测到的技术栈执行健康检查（参考 `references/health-checks.md`）：

1. **Git 状态**：
   - `git status` — 未提交的更改
   - `git log --oneline -5` — 最近的提交
   - 是否有未解决的合并冲突
2. **依赖状态**：
   - 检查是否有 `node_modules` / `.venv` / vendor 目录
   - 检查 lock 文件是否存在且最新
3. **构建状态**：
   - 运行构建命令（如果项目有 build script）
   - 记录构建是否成功
4. **测试状态**：
   - 运行测试命令（如果项目有 test script）
   - 记录测试通过率
5. **Lint 状态**：
   - 运行 linter（如果项目有 lint script）
   - 记录错误和警告数量

**优雅降级**：如果某个检查不适用（如没有测试框架），跳过并记录"未配置"。

**输出**：健康状态仪表盘（Git ✓/✗、依赖 ✓/✗、构建 ✓/✗、测试 ✓/✗、Lint ✓/✗）

### 阶段 3：自动规划 (Auto-Plan)

**目标**：为用户的任务制定实现计划。

1. 分析用户需求，提取关键信息：
   - 任务类型（新功能 / Bug 修复 / 重构 / 其他）
   - 涉及的模块或文件
   - 预期的输出或行为
2. 如果是 OpenWolf 项目，读取 `.wolf/cerebrum.md` 了解项目约定
3. 生成实现计划：
   - 将任务分解为可执行的步骤
   - 每个步骤标注预计涉及的文件
   - 标注依赖关系（哪些步骤必须按顺序执行）
4. 使用 `TaskCreate` 创建任务列表

**输出**：实现计划（步骤列表 + 任务跟踪）

### 阶段 4：自动实现 (Auto-Implement)

**目标**：按照计划实现代码。

1. 如果项目有测试框架，采用 TDD 方式：
   - 先写失败的测试（RED）
   - 实现最小代码使测试通过（GREEN）
   - 重构优化（IMPROVE）
2. 如果没有测试框架，直接实现：
   - 按照计划逐步实现
   - 每步完成后验证（编译、运行）
3. 遵守项目现有代码风格和约定
4. 实现过程中更新任务状态

**委托**：对于复杂实现，可委托给 `tdd-guide` agent 获取 TDD 指导。

**输出**：实现的代码 + 任务完成状态

### 阶段 5：自动验证 (Auto-Verify)

**目标**：验证实现是否正确。

按顺序执行以下验证（根据可用性选择）：

1. **构建验证**：运行构建命令，确保无编译错误
2. **测试验证**：运行测试套件，确保所有测试通过
3. **Lint 验证**：运行 linter，确保无错误（警告可接受）
4. **类型检查**：如果有 TypeScript / mypy，运行类型检查

如果有验证失败：

- 分析错误原因
- 自动修复简单错误（如格式问题、缺少导入）
- 对于复杂错误，报告给用户并询问如何处理

**输出**：验证结果（每项检查 ✓/✗ + 错误详情）

### 阶段 6：自动审查 (Auto-Review)

**目标**：审查代码质量和安全性。

并行执行两个审查：

1. **代码质量审查**：
   - 委托给 `code-reviewer` agent
   - 检查代码风格、命名、结构
   - 检查是否有重复代码、过长函数、深层嵌套
2. **安全审查**（如果涉及安全敏感代码）：
   - 委托给 `security-reviewer` agent
   - 检查 OWASP Top 10
   - 检查硬编码密钥、SQL 注入、XSS 等

**安全敏感代码触发条件**：

- 认证/授权逻辑
- 用户输入处理
- 数据库查询
- 文件操作
- API 调用
- 加密操作

**审查严重级别**：

- CRITICAL（关键）：必须修复才能继续
- HIGH（高）：应该修复
- MEDIUM（中）：建议修复
- LOW（低）：可选

如果有 CRITICAL 问题，自动修复后重新验证。HIGH 问题报告给用户决定。

**输出**：审查报告（问题列表 + 严重级别 + 修复建议）

### 阶段 7：自动报告 (Auto-Report)

**目标**：生成开发报告。

使用 `references/report-template.md` 模板生成报告，包含：

1. **项目概览**：技术栈、框架、项目类型
2. **任务摘要**：做了什么、为什么做
3. **变更详情**：修改了哪些文件、新增了哪些文件
4. **验证结果**：构建/测试/Lint 状态
5. **审查结果**：发现的问题和修复情况
6. **下一步建议**：可以继续做什么

**输出**：完整的中文开发报告

## 语言处理

- 检测用户输入语言
- 中文输入 → 中文输出
- 英文输入 → 英文输出
- 技术术语保持英文（如 API、CSS、npm）

## OpenWolf 兼容性

如果项目有 `.wolf/` 目录：

1. 检测阶段读取 `.wolf/anatomy.md`
2. 实现阶段读取 `.wolf/cerebrum.md`
3. 完成后更新 `.wolf/memory.md`
4. 遵守 `.wolf/OPENWOLF.md` 的所有规则

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

## 相关组件

| 组件                      | 何时引用                         |
| ------------------------- | -------------------------------- |
| `code-reviewer` agent     | 阶段 6 代码审查                  |
| `security-reviewer` agent | 阶段 6 安全审查                  |
| `tdd-guide` agent         | 阶段 4 TDD 指导                  |
| `prompt-optimizer` skill  | 用户想要优化 prompt 而非执行任务 |
| OpenWolf `.wolf/`         | 项目使用 OpenWolf 管理时         |
