# Code-Check 全面代码审计

> **版本**: 1.0.0 | **作者**: YannJY02 | **类型**: Model-invoked Skill + User-invoked Skill
>
> **GitHub**: https://github.com/ekegukeku64-blip/claude-code-skills

---

## 简介

Code-Check 是一个 Claude Code Skill，提供全面的代码审计功能。支持 5 个维度的检查：代码质量、安全漏洞、性能问题、测试覆盖、最佳实践。

### 解决的问题

代码问题如果不及时发现，会随着项目增长变成技术债。Code-Check 提供系统化的代码审计，帮你及早发现和修复问题。

### 核心特性

- 5 维度全面审计
- 按严重级别分类（CRITICAL/HIGH/MEDIUM/LOW）
- 生成详细审计报告
- 支持全项目或指定范围审计
- 手动和自动双重触发
- 与 auto-dev skill 互补

---

## 安装

### 方式 1：直接复制

```bash
# 复制 skill 目录
cp -r code-check ~/.claude/skills/

# 确保目录结构正确
ls ~/.claude/skills/code-check/
# SKILL.md  references/
```

### 方式 2：从 GitHub 安装

```bash
git clone https://github.com/ekegukeku64-blip/claude-code-skills.git
cp -r claude-code-skills/code-check ~/.claude/skills/
```

### 目录结构

```
~/.claude/skills/code-check/
├── SKILL.md                    # 主 skill 文件（必须）
└── references/                 # 参考资料（按需加载）
    ├── audit-patterns.md       # 审计模式库（正则表达式、检查模式）
    └── report-template.md      # 审计报告模板
```

---

## 触发方式

### 手动触发

| 触发词   | 说明     |
| -------- | -------- |
| `/check` | 快速触发 |
| `/audit` | 快速触发 |
| 检查代码 | 中文触发 |
| 代码审计 | 中文触发 |
| 代码审查 | 中文触发 |
| 帮我检查 | 中文触发 |

### 自动触发

当用户提到以下关键词时自动触发：

- "代码质量"、"安全漏洞"、"性能问题"
- "测试覆盖"、"代码规范"
- "有没有问题"、"帮我看看"

### 不触发的情况

- 用户想实现新功能（用 auto-dev skill）
- 用户只是问问题或要解释
- 用户在浏览代码但没要求审计

---

## 5 个维度详解

### 维度 1：代码质量 (Code Quality)

**检查项**：

- **函数长度**：超过 50 行的函数
- **文件长度**：超过 800 行的文件
- **嵌套深度**：超过 4 层的嵌套
- **命名规范**：变量、函数、类的命名是否清晰
- **重复代码**：相似度高的代码块
- **注释质量**：是否有无用注释或缺少必要注释
- **魔法数字**：硬编码的数字和字符串

**严重级别**：

| 级别     | 条件             | 示例         |
| -------- | ---------------- | ------------ |
| CRITICAL | 严重影响可维护性 | 500+ 行函数  |
| HIGH     | 明显违反最佳实践 | 100+ 行函数  |
| MEDIUM   | 可改进项         | 命名不够清晰 |
| LOW      | 风格建议         | 代码风格     |

**检查模式**：

```
函数长度: function\s+\w+\s*\([^)]*\)\s*\{
嵌套深度: 统计缩进层级（空格或 tab 数量）
文件长度: 统计文件总行数
命名规范: 检查单字母变量、拼音命名、无意义命名
```

### 维度 2：安全漏洞 (Security)

**检查 OWASP Top 10**：

- **注入漏洞**：SQL、NoSQL、OS、LDAP 注入
- **认证缺陷**：弱密码策略、会话管理问题
- **敏感数据暴露**：硬编码密钥、明文密码
- **XML 外部实体**：XXE 漏洞
- **访问控制缺陷**：权限检查缺失
- **安全配置错误**：默认配置、不必要的功能
- **跨站脚本**：XSS 漏洞
- **反序列化漏洞**：不安全的反序列化
- **使用含漏洞的组件**：过时的依赖
- **日志和监控不足**：缺少安全日志

**其他安全检查**：

- **硬编码密钥**：API key、密码、token
- **CSRF 保护**：状态变更操作缺少 CSRF 防护
- **路径遍历**：未净化的文件路径
- **命令注入**：不安全的命令执行

**严重级别**：

| 级别     | 条件               | 示例                 |
| -------- | ------------------ | -------------------- |
| CRITICAL | 可被利用的安全漏洞 | SQL 注入、硬编码密钥 |
| HIGH     | 潜在安全风险       | 缺少输入验证         |
| MEDIUM   | 安全最佳实践违反   | 缺少 HTTPS           |
| LOW      | 安全建议           | 安全配置优化         |

**检查模式**：

```
硬编码密钥: (password|secret|token|api_key)\s*[:=]\s*['"][^'"]+['"]
SQL 注入: query\s*\(\s*['"`].*\+
XSS: innerHTML\s*= | dangerouslySetInnerHTML | v-html
路径遍历: fs\.(readFile|writeFile|unlink)\s*\(\s*req\.
命令注入: exec\s*\(\s*.*\+
```

### 维度 3：性能问题 (Performance)

**检查项**：

- **N+1 查询**：循环中的数据库查询
- **缺少分页**：无限制的数据查询
- **缺少缓存**：重复的昂贵计算
- **内存泄漏**：未释放的资源
- **不必要的重渲染**：React/Vue 组件优化
- **大包体积**：未优化的依赖
- **阻塞操作**：同步的 I/O 操作

**严重级别**：

| 级别     | 条件             | 示例          |
| -------- | ---------------- | ------------- |
| CRITICAL | 严重影响用户体验 | 页面加载 > 5s |
| HIGH     | 明显的性能瓶颈   | N+1 查询      |
| MEDIUM   | 可优化项         | 缺少缓存      |
| LOW      | 微优化建议       | 微小优化      |

**检查模式**：

```
N+1 查询: for\s*\(.*\)\s*\{[^}]*query
缺少分页: SELECT\s+\*\s+FROM\s+\w+\s*(?!LIMIT|WHERE|ORDER\s+BY)
同步阻塞: readFileSync | writeFileSync | execSync
```

### 维度 4：测试覆盖 (Test Coverage)

**检查项**：

- **测试文件存在性**：是否有对应的测试文件
- **测试覆盖率**：关键路径是否被测试覆盖
- **测试质量**：测试是否有意义（不只是覆盖率）
- **测试隔离**：测试之间是否独立
- **边界测试**：是否测试了边界情况
- **错误处理测试**：是否测试了异常情况

**严重级别**：

| 级别     | 条件             | 示例           |
| -------- | ---------------- | -------------- |
| CRITICAL | 核心功能无测试   | 关键模块无测试 |
| HIGH     | 关键路径测试不足 | 错误处理未测试 |
| MEDIUM   | 边界情况未覆盖   | 边界值未测试   |
| LOW      | 测试改进建议     | 测试优化       |

**检查模式**：

```
测试文件: src/utils/helper.ts → src/utils/__tests__/helper.test.ts
测试质量: 检查是否有 assert/expect 语句
测试隔离: 检查是否有 beforeEach/afterEach 清理
```

### 维度 5：最佳实践 (Best Practices)

**检查项**：

- **错误处理**：是否显式处理错误
- **类型安全**：TypeScript 类型使用是否正确
- **依赖管理**：依赖是否最新、是否有安全漏洞
- **代码组织**：文件结构是否合理
- **API 设计**：接口是否一致
- **文档**：是否有必要的文档

**严重级别**：

| 级别   | 条件             | 示例         |
| ------ | ---------------- | ------------ |
| HIGH   | 明显违反最佳实践 | 空 catch 块  |
| MEDIUM | 可改进项         | any 类型使用 |
| LOW    | 建议             | 文档补充     |

**检查模式**：

```
空 catch: try\s*\{[^}]*\}\s*catch\s*\(\s*\w+\s*\)\s*\{\s*\}
any 类型: any 类型使用
依赖管理: package.json 中的依赖版本
```

---

## 审计流程

### 阶段 1：项目扫描

1. 检测项目类型和技术栈
2. 扫描项目结构，识别关键文件
3. 确定审计范围（全项目或指定目录）

### 阶段 2：并行审计

并行执行 5 个维度的审计：

1. **代码质量审计**
   - 使用 Grep 查找长函数、深层嵌套
   - 使用 Read 检查文件长度
   - 分析命名规范

2. **安全审计**
   - 使用 Grep 查找硬编码密钥
   - 使用 Grep 查找潜在注入点
   - 检查安全配置

3. **性能审计**
   - 使用 Grep 查找 N+1 查询模式
   - 使用 Grep 查找同步阻塞操作
   - 检查缓存使用

4. **测试审计**
   - 使用 Glob 查找测试文件
   - 使用 Bash 运行测试覆盖率
   - 分析测试质量

5. **最佳实践审计**
   - 检查错误处理
   - 检查类型安全
   - 检查依赖状态

### 阶段 3：问题汇总

1. 按严重级别分类问题
2. 统计各维度问题数量
3. 计算整体健康评分

### 阶段 4：生成报告

生成详细审计报告，包含：

- 项目概览
- 问题汇总（按严重级别）
- 详细问题列表（按维度）
- 修复建议
- 整体评分

---

## 评分计算

### 各维度评分

```
代码质量: 基础分 100, CRITICAL -20, HIGH -10, MEDIUM -5, LOW -2
安全: 基础分 100, CRITICAL -30, HIGH -15, MEDIUM -5, LOW -2
性能: 基础分 100, CRITICAL -20, HIGH -10, MEDIUM -5, LOW -2
测试: 基础分 100, CRITICAL -25, HIGH -10, MEDIUM -5, LOW -2
最佳实践: 基础分 100, HIGH -10, MEDIUM -5, LOW -2
最低分: 0
```

### 整体评分

```
整体评分 = (代码质量 + 安全 + 性能 + 测试 + 最佳实践) / 5
```

---

## 完整 SKILL.md

```yaml
---
name: code-check
description: >-
  全面代码审计 — 自动检查代码质量、安全漏洞、性能问题、测试覆盖率、最佳实践。
  生成详细审计报告，按严重级别分类，给出修复建议。
  TRIGGER when: user says "检查代码", "代码审计", "代码审查", "代码自检",
  "check code", "code audit", "code review", "code check", "audit code",
  "review code", "扫描代码", "分析代码", "代码质量", "安全检查",
  "性能检查", "测试覆盖", "代码规范", "帮我检查", "帮我审查",
  "看看代码有没有问题", "代码有什么问题", "帮我扫描一下",
  "/check", "/audit", "/code-check", "/code-audit".
  Also TRIGGER when: user mentions code quality, security issues,
  performance problems, test coverage, or best practices concerns.
  DO NOT TRIGGER when: user wants to implement features (use auto-dev),
  wants explanation, says "解释一下", "怎么用", "什么是".
  DO NOT TRIGGER when: user is just browsing code without asking for audit.
origin: community
metadata:
  author: YannJY02
  version: '1.0.0'
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - Agent
  - TaskCreate
  - TaskUpdate
---
```

---

## 参考资料

### audit-patterns.md（审计模式库）

包含各维度的检查模式和正则表达式，用于自动化检查。

**主要模式**：

- 代码质量：函数长度、嵌套深度、命名规范
- 安全：硬编码密钥、SQL 注入、XSS、路径遍历
- 性能：N+1 查询、缺少分页、同步阻塞
- 测试：测试文件存在性、测试质量
- 最佳实践：错误处理、类型安全

### report-template.md（审计报告模板）

用于生成审计报告，包含三种模板：

- 完整报告模板（全项目审计）
- 简洁报告模板（快速检查）
- 维度专项报告模板（单维度审计）

---

## 示例

### 示例 1：全项目审计

**用户输入**：

```
/check
```

**执行流程**：

1. 扫描项目结构
2. 并行执行 5 个维度审计
3. 汇总问题
4. 生成报告

**输出示例**：

```markdown
# 代码审计报告

**项目**：my-astro-blog
**时间**：2026-05-27 14:30

## 概览

| 维度     | CRITICAL | HIGH | MEDIUM | LOW | 评分   |
| -------- | -------- | ---- | ------ | --- | ------ |
| 代码质量 | 0        | 1    | 3      | 5   | 85/100 |
| 安全漏洞 | 0        | 0    | 1      | 2   | 95/100 |
| 性能问题 | 0        | 1    | 2      | 3   | 80/100 |
| 测试覆盖 | 1        | 2    | 1      | 0   | 60/100 |
| 最佳实践 | 0        | 1    | 2      | 4   | 85/100 |

**整体评分**：81/100
```

### 示例 2：指定范围审计

**用户输入**：

```
检查 src/api/ 目录的安全问题
```

**执行流程**：

1. 扫描 src/api/ 目录
2. 重点执行安全审计
3. 生成安全审计报告

### 示例 3：自动触发

**用户输入**：

```
我的代码有什么问题吗？
```

**执行流程**：

1. 自动触发 code-check skill
2. 执行全项目审计
3. 生成报告

---

## 与 auto-dev 的区别

| 场景         | 使用 code-check | 使用 auto-dev |
| ------------ | --------------- | ------------- |
| 检查代码问题 | ✓               | ✗             |
| 实现新功能   | ✗               | ✓             |
| 修复已知 bug | ✗               | ✓             |
| 提交前审查   | ✓               | ✗             |
| 定期健康检查 | ✓               | ✗             |

**最佳实践**：

- 开发前：用 code-check 检查现有代码
- 开发中：用 auto-dev 实现功能
- 开发后：用 code-check 审查新代码
- 提交前：用 code-check 做最终检查

---

## 审计范围

### 全项目审计

不指定范围时，审计整个项目。

### 指定范围审计

用户可以指定：

- 特定目录：`检查 src/ 目录`
- 特定文件：`检查这个文件`
- 特定类型：`检查所有 API 文件`

---

## 常见问题

### Q: 审计会修改代码吗？

A: 不会。code-check 只检查问题并生成报告，不会修改代码。如果需要修复问题，可以使用 auto-dev skill。

### Q: 审计需要多长时间？

A: 取决于项目大小。小型项目（< 100 文件）通常 1-2 分钟，大型项目可能需要 5-10 分钟。

### Q: 如何提高评分？

A: 先修复 CRITICAL 和 HIGH 问题，再处理 MEDIUM 问题。LOW 问题可以酌情处理。

### Q: 支持哪些语言？

A: 支持所有主流编程语言，包括 JavaScript/TypeScript、Python、Go、Rust、Java/Kotlin、Ruby、PHP、Swift、C/C++ 等。

---

## 配合 Stop Hook 使用

除了手动触发，还可以配置 Stop hook 在会话结束时自动检查本次修改的代码。

### 配置方式

1. 创建脚本 `~/.claude/scripts/session-code-check.sh`
2. 在 `~/.claude/settings.json` 中添加 Stop hook

**settings.json 配置**：

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/scripts/session-code-check.sh",
            "timeout": 30,
            "statusMessage": "会话结束代码自检中..."
          }
        ]
      }
    ]
  }
}
```

**session-code-check.sh 脚本**：

```bash
#!/bin/bash
echo "=== 会话结束代码自检 ==="

# 检查是否在 git 仓库中
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "非 git 仓库，跳过自检"
    exit 0
fi

# 获取本次会话修改的文件
CHANGED=$(git diff --name-only 2>/dev/null)
STAGED=$(git diff --cached --name-only 2>/dev/null)
ALL=$(echo -e "$CHANGED\n$STAGED" | sort -u | grep -v '^$')

if [ -z "$ALL" ]; then
    echo "本次会话无文件修改，跳过自检"
    exit 0
fi

echo "修改的文件:"
echo "$ALL"
echo ""

# 代码质量检查
echo "--- 代码质量检查 ---"
echo "$ALL" | while read f; do
    if [ -f "$f" ]; then
        LINES=$(wc -l < "$f" 2>/dev/null)
        if [ "$LINES" -gt 800 ]; then
            echo "⚠ $f: $LINES 行（超过 800 行建议拆分）"
        fi
    fi
done
echo ""

# 安全检查
echo "--- 安全检查 ---"
echo "$ALL" | while read f; do
    if [ -f "$f" ]; then
        MATCHES=$(grep -n -i 'password\|secret\|token\|api_key\|apikey' "$f" 2>/dev/null | head -3)
        if [ -n "$MATCHES" ]; then
            echo "⚠ $f 发现潜在敏感信息:"
            echo "$MATCHES"
        fi
    fi
done
echo ""

# 语法检查
echo "--- 语法检查 ---"
echo "$ALL" | while read f; do
    if [ -f "$f" ]; then
        case "$f" in
            *.js|*.jsx|*.ts|*.tsx)
                if command -v node >/dev/null 2>&1; then
                    node --check "$f" 2>/dev/null && echo "✓ $f: 语法正确" || echo "✗ $f: 语法错误"
                fi
                ;;
            *.py)
                if command -v python3 >/dev/null 2>&1; then
                    python3 -m py_compile "$f" 2>/dev/null && echo "✓ $f: 语法正确" || echo "✗ $f: 语法错误"
                fi
                ;;
        esac
    fi
done
echo ""

echo "=== 自检完成 ==="
```

---

## License

MIT
