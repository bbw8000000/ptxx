---
title: "eooce/transfer-api"
owner: "eooce"
name: "transfer-api"
fullName: "eooce/transfer-api"
description: "Cloudflare Worker adapter for unlimited.surf OpenAI/Anthropic-compatible API routes."
sourceUrl: "https://github.com/eooce/transfer-api"
stars: 465
forks: 2895
language: "JavaScript"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-21T09:37:40Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Transfer unlimited.surf API Worker

中文 | English

这是一个 Cloudflare Worker 中转适配器，用于把 `https://unlimited.surf` 转换成 OpenAI 兼容的 `/v1/*` 接口，以及 Anthropic/Claude Code 兼容的 `/v1/messages` 和 `/anthropic/*` 接口。

## 温馨提醒
据网友反馈，社区有人将unlimited.surf接入Claude code，结果被控制了电脑写入了乱七八糟的东西，可能网站有投毒行为，建议不要接入有控制权的agent，可以使用cherry-studio等。#相关反馈

## 功能概览

- OpenAI 兼容：`/v1/chat/completions`、`/v1/responses`、`/v1/models`、`/v1/files`。
- Anthropic 兼容：`/v1/messages`、`/v1/models`、`/anthropic/v1/messages`、`/anthropic/v1/models`。
- unlimited.surf 原始接口代理：`/api/*` 会直接转发到上游。
- Web Search：映射到上游 `POST /api/search`。
- Merge AI：映射到上游 `POST /api/merge`。
- Files：上传/提取映射到上游 `POST /api/attachments/extract`。
- Agent Setup、Codex、MCP：提供说明和配置入口，分别是 `/v1/setup`、`/v1/codex`、`/v1/mcp`。

注意：MCP server 仍然需要在本地 agent、IDE 或 Claude Code/Codex 环境里运行。这个 Worker 只提供模型 API 端点，不会在 Cloudflare 边缘侧读取或修改你的本地文件。

## 通过 GitHub 关联 Cloudflare 自动部署

可以把本项目推送到 GitHub 私有仓库，然后让 Cloudflare 在每次提交后自动部署。

### 1. 推送到 GitHub

创建 GitHub 仓库并推送本项目。不要把 unlimited.surf API key 提交进仓库。

### 2. 在 Cloudflare 连接 GitHub 仓库

1. 打开 Cloudflare Dashboard。
2. 进入 `Workers & Pages`。
3. 点击 `Create`。
4. 选择 `Import a repository` 或 `Connect to Git`。
5. 按提示授权 Cloudflare 访问 GitHub。
6. 选择这个项目所在的 GitHub 仓库。
7. Root directory 填 `/`，除非你把项目放在仓库子目录里。

### 3. 配置构建和部署参数

Cloudflare 部署表单里可以使用：

```text
Framework preset: None
Build command: npm install
Deploy command: npx wrangler deploy
Root directory: /
Wrangler config: wrangler.toml
```

如果 Cloudflare 只提供一个命令输入框，可以填：

```bash
npm install && npx wrangler deploy
```

### 4. 添加 Cloudflare Secret

在 Worker 设置里添加上游 key：

```text
UNLIMITED_SURF_API_KEY=<你的 unlimited.surf key>
```

推荐再添加一个客户端访问 key，用来保护你的 Worker：

```text
WORKER_API_KEY=<你自定义的调用密钥>
```

通常位置是：

```text
Workers & Pages -> 你的 Worker -> Settings -> Variables -> Secrets
```

请只把 key 放到 Secret 里，不要写进 `wrangler.toml`、`README.md` 或任何 GitHub 文件。

如果设置了 `WORKER_API_KEY`，客户端调用 Worker 时必须传这个 key。如果没有设置 `WORKER_API_KEY`，Worker 会保持兼容模式，客户端传任意 key 都可以，真正请求上游时使用 `UNLIMITED_SURF_API_KEY`。

### 5. 部署后验证

部署完成后打开：

```text
https://.workers.dev/health
```

看到 JSON 里有 `"ok": true` 即表示 Worker 正常运行。

如果已经设置 `WORKER_API_KEY`，验证请求也需要带上它：

```bash
curl https://.workers.dev/health \
  -H "Authorization: Bearer <你的 WORKER_API_KEY>"
```

测试 OpenAI 模型列表：

```bash
curl https://.workers.dev/v1/models \
  -H "Authorization: Bearer <你的 WORKER_API_KEY>"
```

测试 Anthropic/Agent 配置说明：

```bash
curl https://.workers.dev/v1/setup \
  -H "Authorization: Bearer <你的 WORKER_API_KEY>"
```

## 本地 Wrangler 手动部署

也可以在本地直接部署：

```powershell
npm install -g wrangler
wrangler login
wrangler secret put UNLIMITED_SURF_API_KEY
wrangler secret put WORKER_API_KEY
wrangler deploy
```

`UNLIMITED_SURF_API_KEY` 填 unlimited.surf 的真实 key。`WORKER_API_KEY` 填你自定义给客户端使用的 key。

`WORKER_API_KEY` 是可选的：如果不设置，客户端可以传任意 key；如果设置了，客户端必须传这个 key。也可以不配置 `UNLIMITED_SURF_API_KEY`，改为每次请求直接传 unlimited.surf key，但不推荐这样做。

## 调用时使用哪个 key

推荐配置两个 Secret：

```text
UNLIMITED_SURF_API_KEY=<你的 unlimited.surf key>
WORKER_API_KEY=<你自定义的客户端 key>
```

客户端调用时使用 `WORKER_API_KEY`，不要直接暴露 unlimited.surf key：

```bash
curl https://.workers.dev/v1/chat/completions \
  -H "Authorization: Bearer <你的 WORKER_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"model":"gateway-gpt-5","messages":[{"role":"user","content":"Hello"}]}'
```

规则如下：

```text
设置了 WORKER_API_KEY:
  客户端必须传 WORKER_API_KEY
  Worker 使用 UNLIMITED_SURF_API_KEY 请求 unlimited.surf

没有设置 WORKER_API_KEY:
  客户端传任意 key 都可以
  Worker 优先使用 UNLIMITED_SURF_API_KEY 请求 unlimited.surf
  如果也没有 UNLIMITED_SURF_API_KEY，则把客户端传入的 key 当作 unlimited.surf key
```

## OpenAI 兼容接口

Base URL：

```text
https://.workers.dev/v1
```

支持接口：

- `GET /v1/models`
- `POST /v1/chat/completions`
- `POST /v1/responses`
- `POST /v1/search`
- `POST /v1/merge`
- `GET /v1/key`、`GET /v1/usage`
- `POST /v1/files`
- `POST /v1/files/extract`、`POST /v1/attachments/extract`
- `GET /v1/setup`、`GET /v1/codex`、`GET /v1/mcp`

示例：

```bash
curl https://.workers.dev/v1/chat/completions \
  -H "Authorization: Bearer <你的 WORKER_API_KEY 或 unlimited.surf key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"gateway-gpt-5","messages":[{"role":"user","content":"Hello"}],"stream":true}'
```

## Anthropic / Claude Code 兼容接口

Base URL：

```text
https://.workers.dev
```

支持接口：

- `POST /v1/messages`
- `GET /v1/models`
- `POST /anthropic/v1/messages`
- `GET /anthropic/v1/models`
- `GET /v1/setup`、`GET /v1/codex`、`GET /v1/mcp`

Claude Code PowerShell 示例：

```powershell
$env:ANTHROPIC_BASE_URL = "https://.workers.dev"
$env:ANTHROPIC_AUTH_TOKEN = "<你的 WORKER_API_KEY 或 unlimited.surf key>"
$env:ANTHROPIC_API_KEY = "<你的 WORKER_API_KEY 或 unlimited.surf key>"
$env:ANTHROPIC_MODEL = "claude-opus-4-7-20260101"
claude
```

## 功能映射

- Chat 映射到上游 `POST /api/chat`。
- Web Search 在调用 `/v1/search`、传入 `web_search_options`、传入 `query`，或包含 web search tool 时映射到 `POST /api/search`。
- Merge AI 在调用 `/v1/merge`、传入 `merge: true`，或传入 2 个以上 `models` 时映射到 `POST /api/merge`。
- Models 映射到上游 `GET /api/models`，如果上游不可用会返回内置 fallback 模型列表。
- Files 映射到上游 `POST /api/attachments/extract`。如果需要持久化文件，需要额外接入 Cloudflare KV 或 R2。
- Codex、Agent Setup、MCP 是配置说明入口；MCP 工具执行仍然发生在本地 agent/IDE 里。
- Embeddings、audio、images 会返回 `501`，因为当前提供的 unlimited.surf 文档中没有这些原生接口。

## 原始上游代理

任何 `/api/*` 请求都会被转发到 unlimited.surf，并自动带上配置好的 key，因此你仍然可以通过 Worker 使用原始接口。

---

## English

This is a Cloudflare Worker adapter for `https://unlimited.surf`. It exposes OpenAI-compatible `/v1/*` routes and Anthropic/Claude Code-compatible `/v1/messages` plus `/anthropic/*` aliases.

## Features

- OpenAI-compatible routes: `/v1/chat/completions`, `/v1/responses`, `/v1/models`, `/v1/files`.
- Anthropic-compatible routes: `/v1/messages`, `/v1/models`, `/anthropic/v1/messages`, `/anthropic/v1/models`.
- Raw upstream proxy: `/api/*` forwards directly to unlimited.surf.
- Web Search maps to upstream `POST /api/search`.
- Merge AI maps to upstream `POST /api/merge`.
- Files extraction maps to upstream `POST /api/attachments/extract`.
- Agent Setup, Codex, and MCP info endpoints are available at `/v1/setup`, `/v1/codex`, and `/v1/mcp`.

MCP servers still run inside your local agent, IDE, Claude Code, or Codex environment. This Worker only provides the model API endpoint and does not read or modify local files from Cloudflare.

## Deploy from GitHub with Cloudflare

Push this project to a GitHub repository, then let Cloudflare deploy it automatically on each commit.

### 1. Push to GitHub

Create a GitHub repository and push this project. Do not commit your unlimited.surf API key.

### 2. Connect the repository in Cloudflare

1. Open the Cloudflare Dashboard.
2. Go to `Workers & Pages`.
3. Click `Create`.
4. Choose `Import a repository` or `Connect to Git`.
5. Authorize Cloudflare to access GitHub if prompted.
6. Select the repository containing this project.
7. Set Root directory to `/` unless the project is in a subdirectory.

### 3. Build and deploy settings

Use these values:

```text
Framework preset: None
Build command: npm install
Deploy command: npx wrangler deploy
Root directory: /
Wrangler config: wrangler.toml
```

If Cloudflare shows only one command field, use:

```bash
npm install && npx wrangler deploy
```

### 4. Add the Cloudflare Secret

Add the upstream key in the Worker settings:

```text
UNLIMITED_SURF_API_KEY=
```

Recommended: add a client-facing key to protect the Worker:

```text
WORKER_API_KEY=
```

The usual location is:

```text
Workers & Pages -> your Worker -> Settings -> Variables -> Secrets
```

Keep keys in Secrets only. Do not put them in `wrangler.toml`, `README.md`, or GitHub files.

If `WORKER_API_KEY` is set, clients must send that key when calling the Worker. If `WORKER_API_KEY` is not set, the Worker keeps compatibility mode and accepts any client key while using `UNLIMITED_SURF_API_KEY` for upstream requests.

### 5. Verify the deployment

Open:

```text
https://.workers.dev/health
```

You should see JSON with `"ok": true`.

If `WORKER_API_KEY` is set, include it in verification requests too:

```bash
curl https://.workers.dev/health \
  -H "Authorization: Bearer "
```

Test OpenAI-compatible models:

```bash
curl https://.workers.dev/v1/models \
  -H "Authorization: Bearer "
```

Test Anthropic/agent setup docs:

```bash
curl https://.workers.dev/v1/setup \
  -H "Authorization: Bearer "
```

## Manual deploy with Wrangler

You can also deploy from your local machine:

```powershell
npm install -g wrangler
wrangler login
wrangler secret put UNLIMITED_SURF_API_KEY
wrangler secret put WORKER_API_KEY
wrangler deploy
```

Use your real unlimited.surf key for `UNLIMITED_SURF_API_KEY`. Use your own client-facing key for `WORKER_API_KEY`.

`WORKER_API_KEY` is optional. If it is not set, clients may send any key. If it is set, clients must send this exact key. You can also skip `UNLIMITED_SURF_API_KEY` and pass the real unlimited.surf key on every request, but that is not recommended.

## Which key should clients use?

Recommended setup:

```text
UNLIMITED_SURF_API_KEY=
WORKER_API_KEY=
```

Clients should use `WORKER_API_KEY`, not the upstream unlimited.surf key:

```bash
curl https://.workers.dev/v1/chat/completions \
  -H "Authorization: Bearer " \
  -H "Content-Type: application/json" \
  -d '{"model":"gateway-gpt-5","messages":[{"role":"user","content":"Hello"}]}'
```

Rules:

```text
WORKER_API_KEY is set:
  clients must send WORKER_API_KEY
  Worker uses UNLIMITED_SURF_API_KEY for unlimited.surf

WORKER_API_KEY is not set:
  clients may send any key
  Worker prefers UNLIMITED_SURF_API_KEY for unlimited.surf
  if UNLIMITED_SURF_API_KEY is also missing, the client key is treated as the unlimited.surf key
```

## OpenAI-compatible routes

Base URL:

```text
https://.workers.dev/v1
```

Supported routes:

- `GET /v1/models`
- `POST /v1/chat/completions`
- `POST /v1/responses`
- `POST /v1/search`
- `POST /v1/merge`
- `GET /v1/key`, `GET /v1/usage`
- `POST /v1/files`
- `POST /v1/files/extract`, `POST /v1/attachments/extract`
- `GET /v1/setup`, `GET /v1/codex`, `GET /v1/mcp`

Example:

```bash
curl https://.workers.dev/v1/chat/completions \
  -H "Authorization: Bearer " \
  -H "Content-Type: application/json" \
  -d '{"model":"gateway-gpt-5","messages":[{"role":"user","content":"Hello"}],"stream":true}'
```

## Anthropic / Claude Code-compatible routes

Base URL:

```text
https://.workers.dev
```

Supported routes:

- `POST /v1/messages`
- `GET /v1/models`
- `POST /anthropic/v1/messages`
- `GET /anthropic/v1/models`
- `GET /v1/setup`, `GET /v1/codex`, `GET /v1/mcp`

Claude Code PowerShell example:

```powershell
$env:ANTHROPIC_BASE_URL = "https://.workers.dev"
$env:ANTHROPIC_AUTH_TOKEN = ""
$env:ANTHROPIC_API_KEY = ""
$env:ANTHROPIC_MODEL = "claude-opus-4-7-20260101"
claude
```

## Feature mapping

- Chat maps to upstream `POST /api/chat`.
- Web Search maps to upstream `POST /api/search` when you call `/v1/search`, pass `web_search_options`, pass `query`, or include a web search tool.
- Merge AI maps to upstream `POST /api/merge` when you call `/v1/merge`, pass `merge: true`, or pass `models` with 2+ model IDs.
- Models maps to upstream `GET /api/models` with a fallback catalog if the upstream call fails.
- Files maps upload/extract requests to upstream `POST /api/attachments/extract`; persistent file storage requires adding KV or R2.
- Codex, Agent Setup, and MCP are setup/info endpoints. MCP tool execution remains local to the client agent or IDE.
- Embeddings, audio, and images return `501` because the provided unlimited.surf docs do not expose those native APIs.

## Raw upstream proxy

Any `/api/*` request is forwarded to unlimited.surf with the configured key, so the original API remains available through the Worker.
