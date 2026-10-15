# 技术栈检测矩阵

## 文件模式 → 技术栈映射

### Node.js / TypeScript 生态

| 文件                             | 技术栈     | 包管理器      | 构建命令        | 测试命令   | Lint 命令      |
| -------------------------------- | ---------- | ------------- | --------------- | ---------- | -------------- |
| `package.json` + `tsconfig.json` | TypeScript | npm/pnpm/yarn | `npm run build` | `npm test` | `npm run lint` |
| `package.json` (react in deps)   | React      | npm/pnpm/yarn | `npm run build` | `npm test` | `npm run lint` |
| `package.json` (next in deps)    | Next.js    | npm/pnpm/yarn | `npm run build` | `npm test` | `npm run lint` |
| `package.json` (astro in deps)   | Astro      | npm/pnpm/yarn | `npm run build` | `npm test` | `npm run lint` |
| `package.json` (vue in deps)     | Vue.js     | npm/pnpm/yarn | `npm run build` | `npm test` | `npm run lint` |
| `package.json` (svelte in deps)  | Svelte     | npm/pnpm/yarn | `npm run build` | `npm test` | `npm run lint` |
| `package.json` (nuxt in deps)    | Nuxt.js    | npm/pnpm/yarn | `npm run build` | `npm test` | `npm run lint` |

**包管理器检测**：

- `pnpm-lock.yaml` → pnpm
- `yarn.lock` → yarn
- `package-lock.json` → npm

**脚本检测**：读取 `package.json` 的 `scripts` 字段，查找：

- `build` / `dev` / `start` / `test` / `lint` / `format`

### Python 生态

| 文件                               | 技术栈              | 包管理器   | 构建命令                 | 测试命令 | Lint 命令         |
| ---------------------------------- | ------------------- | ---------- | ------------------------ | -------- | ----------------- |
| `pyproject.toml` (django in deps)  | Django              | pip/poetry | `python manage.py check` | `pytest` | `flake8` / `ruff` |
| `pyproject.toml` (flask in deps)   | Flask               | pip/poetry | `flask run --test`       | `pytest` | `flake8` / `ruff` |
| `pyproject.toml` (fastapi in deps) | FastAPI             | pip/poetry | `uvicorn --help`         | `pytest` | `flake8` / `ruff` |
| `requirements.txt`                 | Python (pip)        | pip        | —                        | `pytest` | `flake8` / `ruff` |
| `setup.py`                         | Python (setuptools) | pip        | `python setup.py build`  | `pytest` | `flake8` / `ruff` |
| `Pipfile`                          | Python (pipenv)     | pipenv     | —                        | `pytest` | `flake8` / `ruff` |

**虚拟环境检测**：

- `.venv/` 目录存在 → 使用虚拟环境
- `Pipfile.lock` → pipenv
- `poetry.lock` → poetry

### Go 生态

| 文件                 | 技术栈      | 包管理器   | 构建命令             | 测试命令        | Lint 命令           |
| -------------------- | ----------- | ---------- | -------------------- | --------------- | ------------------- |
| `go.mod`             | Go          | go modules | `go build ./...`     | `go test ./...` | `golangci-lint run` |
| `go.mod` + `main.go` | Go CLI      | go modules | `go build -o app .`  | `go test ./...` | `golangci-lint run` |
| `go.mod` + `cmd/`    | Go (多入口) | go modules | `go build ./cmd/...` | `go test ./...` | `golangci-lint run` |

**框架检测**：

- `github.com/gin-gonic/gin` → Gin
- `github.com/labstack/echo` → Echo
- `github.com/gofiber/fiber` → Fiber
- `github.com/go-chi/chi` → Chi

### Rust 生态

| 文件                         | 技术栈       | 包管理器 | 构建命令      | 测试命令     | Lint 命令      |
| ---------------------------- | ------------ | -------- | ------------- | ------------ | -------------- |
| `Cargo.toml`                 | Rust         | cargo    | `cargo build` | `cargo test` | `cargo clippy` |
| `Cargo.toml` (actix in deps) | Rust + Actix | cargo    | `cargo build` | `cargo test` | `cargo clippy` |
| `Cargo.toml` (axum in deps)  | Rust + Axum  | cargo    | `cargo build` | `cargo test` | `cargo clippy` |

### Java / Kotlin 生态

| 文件               | 技术栈               | 包管理器 | 构建命令       | 测试命令      | Lint 命令              |
| ------------------ | -------------------- | -------- | -------------- | ------------- | ---------------------- |
| `pom.xml`          | Java (Maven)         | maven    | `mvn compile`  | `mvn test`    | `mvn checkstyle:check` |
| `build.gradle`     | Java/Kotlin (Gradle) | gradle   | `gradle build` | `gradle test` | `gradle check`         |
| `build.gradle.kts` | Kotlin (Gradle)      | gradle   | `gradle build` | `gradle test` | `gradle check`         |

### 其他语言

| 文件             | 技术栈       | 包管理器 | 构建命令           | 测试命令            | Lint 命令   |
| ---------------- | ------------ | -------- | ------------------ | ------------------- | ----------- |
| `Gemfile`        | Ruby         | bundler  | `bundle exec rake` | `bundle exec rspec` | `rubocop`   |
| `composer.json`  | PHP          | composer | `composer build`   | `composer test`     | `phpcs`     |
| `Package.swift`  | Swift        | SPM      | `swift build`      | `swift test`        | `swiftlint` |
| `CMakeLists.txt` | C/C++        | cmake    | `cmake --build .`  | `ctest`             | `cppcheck`  |
| `Makefile`       | C/C++ (make) | make     | `make`             | `make test`         | `cppcheck`  |

## 框架特征检测

### 前端框架

| 特征                                          | 框架       |
| --------------------------------------------- | ---------- |
| `pages/` 或 `app/` 目录 + `next.config.js`    | Next.js    |
| `src/pages/` 或 `src/app/` + `nuxt.config.ts` | Nuxt.js    |
| `astro.config.mjs`                            | Astro      |
| `vite.config.ts` + Vue                        | Vue + Vite |
| `svelte.config.js`                            | SvelteKit  |
| `angular.json`                                | Angular    |

### 后端框架

| 特征                         | 框架         |
| ---------------------------- | ------------ |
| `manage.py` + `settings.py`  | Django       |
| `app.py` + Flask imports     | Flask        |
| `main.py` + FastAPI imports  | FastAPI      |
| `go.mod` + Gin imports       | Go + Gin     |
| `Cargo.toml` + Actix imports | Rust + Actix |
| `pom.xml` + Spring Boot      | Spring Boot  |

## 通用回退

如果无法检测到特定技术栈：

- 构建命令：查找 `Makefile` 或 `build` 脚本
- 测试命令：查找 `test` 脚本或 `*_test.*` 文件
- Lint 命令：查找 `.eslintrc`、`.flake8`、`ruff.toml` 等配置文件
- 如果都没有，标记为"未检测到"并跳过对应阶段
