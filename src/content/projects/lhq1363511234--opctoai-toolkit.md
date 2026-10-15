---
title: "lhq1363511234/opctoai-toolkit"
owner: "lhq1363511234"
name: "opctoai-toolkit"
fullName: "lhq1363511234/opctoai-toolkit"
description: "SMTP console + Grok container toolkit monorepo"
sourceUrl: "https://github.com/lhq1363511234/opctoai-toolkit"
stars: 43
forks: 14
language: "Python"
topics: []
license: "Apache-2.0"
defaultBranch: "main"
snapshotDate: "2026-07-22"
pushedAt: "2026-07-21T17:45:18Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# opcToai Toolkit

*图片：License*
[*图片：LINUX DO*](https://linux.do)

English README · 安全说明 · Apache-2.0 · [LINUX DO](https://linux.do)

一个由 Docker Compose 管理的工具箱 monorepo，包含：

- **SMTP Console**：统一管理发件 SMTP、临时邮箱、收件、验证码提取和邮件服务连接状态。
- **Cloudflare Mail**：Workers + Email Routing + D1 + R2 的自建收件服务。
- **Grok Web**：浏览器工作流与账号/配置管理界面。该模块需要你自行提供合规的外部邮件、代理和 CPA 等服务配置。

统一入口由 Nginx 网关提供：

| 路径 | 服务 | 默认容器端口 |
| --- | --- | --- |
| `/smtp/` | 邮件控制台 | 18430 |
| `/grok/` | Grok Web | 18425 |

## 特性

- 单仓库、单个 `compose.yaml` 管理服务。
- 运行配置与源码分离：密码、Token、代理、邮箱和账户数据不进入 Git，也不被写入镜像层。
- Grok 服务使用 Xvfb、Chromium 与共享内存配置，适合容器运行环境。
- 可替换网关、SMTP、邮箱 API、CPA 服务和代理，无需修改源代码。

## 模块文档

| 模块 | 文档 |
| --- | --- |
| SMTP Console + Cloudflare 完整部署 | apps/smtp/README.md |
| Cloudflare Worker 邮件源码 | apps/cloudflare-mail/README.md |
| Grok 模块 | apps/grok/README.md |
| **Grok 外接配置（填表详解）** | apps/grok/EXTERNAL_CONFIG.md |
| Grok Docker 打包说明 | apps/grok/docker/README.md |

## 快速开始

### 1. 准备配置

```bash
git clone git@github.com:lhq1363511234/opctoai-toolkit.git
cd opctoai-toolkit
cp config/smtp/.env.example config/smtp/.env
cp config/grok/config.json.example config/grok/config.json
```

编辑两个配置文件，填入你自己的 SMTP、邮箱服务、代理和远程服务地址。**不要把真实凭据提交到 Git。**

若要自建 Cloudflare 收件服务，先按 apps/cloudflare-mail/README.md 部署 Worker，再在 `config/smtp/.env` 中设置：

```env
FREEMAIL_BASE=https://your-mail-worker.example.workers.dev
FREEMAIL_API_KEY=your-worker-jwt-token
```

### 2. 启动

```bash
docker compose up -d --build
```

> Grok 默认直接拉 Docker Hub 镜像 `cirstein/grok-register-web:latest`，不必本地编译。

默认入口：

```text
http://localhost:8080/smtp/
http://localhost:8080/grok/
```

如需修改入口端口：

```bash
TOOLKIT_PORT=18080 docker compose up -d --build
```


### 3. Grok 官方镜像快速启动（无需本地编译）

前置：先配好 `config/grok/config.json`（邮箱 API + 代理等）。

Docker Hub：

```text
cirstein/grok-register-web:latest
```

```bash
docker pull cirstein/grok-register-web:latest
cp config/grok/config.json.example config/grok/config.json
# 编辑 config/grok/config.json
docker compose up -d grok gateway
```

访问：`http://localhost:8080/grok/`


更多说明：apps/grok/docker/README.md

## 数据持久化

| 数据 | 位置 |
| --- | --- |
| SMTP 发信日志 | Docker volume `smtp-data` |
| 临时邮箱状态 | Docker volume `mail-console-data` |
| Grok 运行配置、账户导出与 CPA 文件 | `./config/grok/` |

部署前请备份 `config/grok/` 和 Docker volumes。

## 生产部署建议

1. 使用 HTTPS 反向代理并启用身份验证；不要直接公开 Docker 端口。
2. 使用独立的、最小权限的 SMTP 凭据与 API Token。
3. 对代理、邮箱 API、CPA 服务配置网络访问控制和请求限流。
4. 定期更新 Chromium、基础镜像与 Python 依赖。
5. 遵守上游服务的条款、当地法律和平台规则；不要将本项目用于绕过访问控制、批量滥用或未经授权的账户操作。

## 开发检查

```bash
python3 -m py_compile apps/smtp/app.py apps/grok/web_app.py
node --check apps/cloudflare-mail/src/server.js
docker compose config
```

## 目录结构

```text
apps/
  smtp/              SMTP Console 源码、Dockerfile、完整邮件部署 README
  cloudflare-mail/   Cloudflare Worker 邮件源码、wrangler 模板、D1 SQL
  grok/              Grok Web 源码和 Dockerfile
docker/
  gateway/           统一 Nginx 网关配置
config/
  smtp/              本地 SMTP 环境变量（不提交）
  grok/              Grok 本地运行配置（不提交）
compose.yaml
```


## 社区

本项目已获得 [LINUX DO](https://linux.do) 社区认可链接。

欢迎在社区讨论部署、反馈问题和分享配置经验：

- 社区主站：https://linux.do

## 致谢与许可证

本仓库整体采用 Apache License 2.0。

- Grok 模块保留原有上游来源信息，详见 THIRD_PARTY_NOTICES.md。
- Cloudflare 邮件模块基于 Apache-2.0 的 `idinging/freemail`，许可证保存在 `apps/cloudflare-mail/LICENSE`。
- 二次分发前请核对上游许可证及依赖许可证。
- 社区认可：本项目已链接认可 [LINUX DO](https://linux.do) 社区。
