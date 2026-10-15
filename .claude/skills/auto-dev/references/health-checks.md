# 项目健康检查命令

## 通用检查（所有项目）

### Git 状态

```bash
# 检查是否是 git 仓库
git rev-parse --is-inside-work-tree 2>/dev/null

# 未提交的更改
git status --short

# 最近 5 次提交
git log --oneline -5

# 是否有未解决的合并冲突
git diff --name-only --diff-filter=U
```

### 目录结构

```bash
# 列出顶层目录
ls -la

# 查看源码目录
ls src/ 2>/dev/null || ls app/ 2>/dev/null || ls lib/ 2>/dev/null
```

## Node.js / TypeScript 检查

### 依赖状态

```bash
# 检查 node_modules 是否存在
test -d node_modules && echo "node_modules exists" || echo "node_modules missing"

# 检查 lock 文件
ls package-lock.json pnpm-lock.yaml yarn.lock 2>/dev/null

# 检查过期依赖（如果有 npx）
npx npm-check-updates --target minor 2>/dev/null || true
```

### 构建检查

```bash
# 检查是否有 build script
node -e "const p=require('./package.json');console.log(p.scripts?.build||'no build script')"

# 运行构建（如果有）
npm run build 2>&1 || pnpm build 2>&1 || yarn build 2>&1
```

### 测试检查

```bash
# 检查是否有 test script
node -e "const p=require('./package.json');console.log(p.scripts?.test||'no test script')"

# 运行测试（如果有）
npm test 2>&1 || pnpm test 2>&1 || yarn test 2>&1
```

### Lint 检查

```bash
# 检查是否有 lint script
node -e "const p=require('./package.json');console.log(p.scripts?.lint||'no lint script')"

# 运行 lint（如果有）
npm run lint 2>&1 || pnpm lint 2>&1 || yarn lint 2>&1
```

### TypeScript 类型检查

```bash
# 检查是否有 tsconfig
test -f tsconfig.json && npx tsc --noEmit 2>&1 || echo "No TypeScript config"
```

## Python 检查

### 依赖状态

```bash
# 检查虚拟环境
test -d .venv && echo "venv exists" || echo "no venv"

# 检查依赖文件
ls requirements.txt pyproject.toml Pipfile setup.py 2>/dev/null

# 检查已安装的包
pip list 2>/dev/null | head -20
```

### 构建检查

```bash
# Django 检查
python manage.py check 2>&1 || echo "Not Django"

# 语法检查
python -m py_compile src/ 2>/dev/null || true
```

### 测试检查

```bash
# 运行 pytest
pytest --tb=short 2>&1 || echo "pytest not available"

# 运行 unittest
python -m unittest discover 2>&1 || echo "unittest failed"
```

### Lint 检查

```bash
# ruff（推荐）
ruff check . 2>&1 || echo "ruff not available"

# flake8
flake8 . 2>&1 || echo "flake8 not available"

# mypy 类型检查
mypy . 2>&1 || echo "mypy not available"
```

## Go 检查

### 依赖状态

```bash
# 检查 go.mod
test -f go.mod && echo "go.mod exists" || echo "no go.mod"

# 检查依赖
go mod verify 2>&1

# 检查过期依赖
go list -m -u all 2>/dev/null | grep '\[' || echo "all up to date"
```

### 构建检查

```bash
# 编译检查
go build ./... 2>&1
```

### 测试检查

```bash
# 运行测试
go test ./... -v -count=1 2>&1

# 测试覆盖率
go test ./... -cover 2>&1
```

### Lint 检查

```bash
# golangci-lint
golangci-lint run 2>&1 || echo "golangci-lint not available"

# go vet
go vet ./... 2>&1
```

## Rust 检查

### 依赖状态

```bash
# 检查 Cargo.toml
test -f Cargo.toml && echo "Cargo.toml exists" || echo "no Cargo.toml"

# 检查过期依赖
cargo outdated 2>&1 || echo "cargo-outdated not installed"
```

### 构建检查

```bash
# 编译检查
cargo check 2>&1
```

### 测试检查

```bash
# 运行测试
cargo test 2>&1
```

### Lint 检查

```bash
# clippy
cargo clippy 2>&1

# 格式检查
cargo fmt --check 2>&1
```

## Java / Kotlin 检查

### Maven 项目

```bash
# 编译检查
mvn compile 2>&1

# 测试
mvn test 2>&1

# 代码检查
mvn checkstyle:check 2>&1 || echo "checkstyle not configured"
```

### Gradle 项目

```bash
# 编译检查
gradle build 2>&1

# 测试
gradle test 2>&1

# 代码检查
gradle check 2>&1
```

## 结果解读

### 状态标记

- ✓ 通过：命令成功执行，无错误
- ⚠ 警告：命令执行成功但有警告
- ✗ 失败：命令执行失败，有错误
- — 跳过：不适用或未配置

### 健康评分

| 检查项    | 权重 | 说明                           |
| --------- | ---- | ------------------------------ |
| Git 状态  | 20%  | 干净的工作区表示良好的开发习惯 |
| 依赖状态  | 15%  | 依赖完整且不过时               |
| 构建状态  | 25%  | 代码能正确编译                 |
| 测试状态  | 25%  | 测试通过率高                   |
| Lint 状态 | 15%  | 代码风格一致                   |

总分 = 各项得分 × 权重之和
