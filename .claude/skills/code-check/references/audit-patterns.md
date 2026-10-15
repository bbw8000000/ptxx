# 审计模式库

## 代码质量检查模式

### 函数长度检查

**JavaScript/TypeScript**:

```
function\s+\w+\s*\([^)]*\)\s*\{  → 计算函数体行数
```

**Python**:

```
def\s+\w+\s*\([^)]*\)\s*:  → 计算函数体行数
```

**Go**:

```
func\s+\w+\s*\([^)]*\)\s*\{  → 计算函数体行数
```

### 嵌套深度检查

**通用模式**:

```
统计缩进层级（空格或 tab 数量）
超过 4 层缩进 = 深层嵌套
```

### 文件长度检查

```
统计文件总行数
超过 800 行 = 大文件
超过 400 行 = 中等文件
```

### 命名规范检查

**变量命名**:

- 检查是否有单字母变量（除循环变量外）
- 检查是否有拼音命名
- 检查是否有无意义命名（如 temp, data, obj）

**函数命名**:

- 检查是否使用动词开头
- 检查是否清晰表达意图

**类命名**:

- 检查是否使用 PascalCase
- 检查是否有意义

### 重复代码检查

```
查找相似度 > 80% 的代码块
- 提取代码指纹（去除空白和注释）
- 比较指纹相似度
```

### 魔法数字检查

```
查找硬编码的数字（除 0, 1, -1 外）
查找硬编码的字符串（除常见常量外）
```

## 安全检查模式

### 硬编码密钥

**通用模式**:

```
(password|passwd|pwd|secret|token|key|api_key|apikey|access_token)\s*[:=]\s*['"][^'"]+['"]
```

**环境变量检查**:

```
检查 .env 文件是否在 .gitignore 中
检查是否有 .env.example
```

### SQL 注入

**危险模式**:

```
query\s*\(\s*['"`].*\+  → 字符串拼接
query\s*\(\s*['"`].*\$\{  → 模板字符串
execute\s*\(\s*['"`].*%s  → 格式化字符串
```

**安全模式**:

```
query\s*\(\s*['"`].*\?\s*,  → 参数化查询
query\s*\(\s*['"`].*\$1\s*,  → PostgreSQL 参数
```

### XSS 漏洞

**危险模式**:

```
innerHTML\s*=  → 直接设置 HTML
dangerouslySetInnerHTML  → React 危险设置
v-html  → Vue 危险设置
document\.write  → 文档写入
eval\s*\(
```

**安全模式**:

```
textContent\s*=  → 安全文本设置
innerText\s*=  → 安全文本设置
使用模板引擎的自动转义
```

### CSRF 保护

**检查**:

```
表单是否有 CSRF token
API 是否验证 CSRF token
是否有 SameSite cookie 属性
```

### 路径遍历

**危险模式**:

```
fs\.(readFile|writeFile|unlink)\s*\(\s*req\.  → 直接使用用户输入
path\.join\s*\(\s*__dirname\s*,\s*req\.  → 拼接用户输入
```

**安全模式**:

```
检查路径是否在允许的目录内
使用 path.resolve 并验证结果
```

### 命令注入

**危险模式**:

```
exec\s*\(\s*.*\+  → 字符串拼接
spawn\s*\(\s*.*\$\{  → 模板字符串
child_process\.exec  → 直接执行
```

**安全模式**:

```
使用 execFile 或 spawn 的数组参数
验证和净化用户输入
```

## 性能检查模式

### N+1 查询

**危险模式**:

```
for\s*\(.*\)\s*\{[^}]*query  → 循环中的查询
forEach\s*\([^}]*query  → 循环中的查询
while\s*\(.*\)\s*\{[^}]*query  → 循环中的查询
```

**安全模式**:

```
使用 JOIN 查询
使用批量查询
使用 DataLoader
```

### 缺少分页

**检查**:

```
SELECT\s+\*\s+FROM\s+\w+\s*(?!LIMIT|WHERE|ORDER\s+BY)  → 无限制查询
find\s*\(\s*\)\s*;  → 无限制查询
```

### 缺少缓存

**检查**:

```
重复的昂贵计算
重复的 API 调用
重复的数据库查询
```

### 同步阻塞

**JavaScript 危险模式**:

```
readFileSync
writeFileSync
execSync
```

**Python 危险模式**:

```
time.sleep
requests.get  (同步)
```

## 测试覆盖检查模式

### 测试文件存在性

**检查**:

```
源文件: src/utils/helper.ts
测试文件: src/utils/__tests__/helper.test.ts
           src/utils/helper.test.ts
           src/utils/helper.spec.ts
           tests/utils/helper_test.py
```

### 测试质量检查

**检查**:

```
是否有 assert/expect 语句
是否测试了边界情况
是否测试了错误处理
是否有无意义的测试（如 just expect(true)）
```

### 测试隔离检查

**检查**:

```
测试之间是否共享状态
是否有 beforeEach/afterEach 清理
是否有全局状态修改
```

## 最佳实践检查模式

### 错误处理

**JavaScript 检查**:

```
try\s*\{[^}]*\}\s*catch\s*\(\s*\w+\s*\)\s*\{\s*\}  → 空 catch
Promise\.catch\s*\(\s*\(\s*\)\s*=>\s*\{\s*\}\s*\)  → 空 catch
```

**Python 检查**:

```
except:  → 捕获所有异常
except\s+\w+:  → 但没有处理
```

### 类型安全 (TypeScript)

**检查**:

```
any 类型使用
类型断言使用
非空断言使用
```

### 依赖管理

**检查**:

```
package.json 中的依赖版本
是否有安全漏洞（npm audit）
是否有过时的依赖
```

## 评分计算

### 代码质量评分

```
基础分: 100
- CRITICAL: -20 分/个
- HIGH: -10 分/个
- MEDIUM: -5 分/个
- LOW: -2 分/个
最低分: 0
```

### 安全评分

```
基础分: 100
- CRITICAL: -30 分/个（安全问题更严重）
- HIGH: -15 分/个
- MEDIUM: -5 分/个
- LOW: -2 分/个
最低分: 0
```

### 性能评分

```
基础分: 100
- CRITICAL: -20 分/个
- HIGH: -10 分/个
- MEDIUM: -5 分/个
- LOW: -2 分/个
最低分: 0
```

### 测试覆盖评分

```
基础分: 100
- CRITICAL: -25 分/个
- HIGH: -10 分/个
- MEDIUM: -5 分/个
- LOW: -2 分/个
最低分: 0
```

### 最佳实践评分

```
基础分: 100
- HIGH: -10 分/个
- MEDIUM: -5 分/个
- LOW: -2 分/个
最低分: 0
```

### 整体评分

```
整体评分 = (代码质量 + 安全 + 性能 + 测试 + 最佳实践) / 5
```

## 严重级别定义

| 级别     | 定义                     | 示例                                |
| -------- | ------------------------ | ----------------------------------- |
| CRITICAL | 必须立即修复，有严重风险 | SQL 注入、硬编码密钥、500+ 行函数   |
| HIGH     | 应该尽快修复，有明显问题 | N+1 查询、缺少输入验证、100+ 行函数 |
| MEDIUM   | 建议修复，影响质量       | 命名不够清晰、缺少缓存、缺少注释    |
| LOW      | 可选修复，改进建议       | 代码风格、微小优化                  |
