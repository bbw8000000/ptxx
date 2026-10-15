---
title: "CoolkHz/gptibo"
owner: "CoolkHz"
name: "gptibo"
fullName: "CoolkHz/gptibo"
description: "Self-hosted GPTibo storefront, admin and Go backend — sanitized MIT source"
sourceUrl: "https://github.com/CoolkHz/gptibo"
stars: 437
forks: 254
language: "TypeScript"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-10-14"
pushedAt: "2026-10-14T02:40:46Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# GPTibo

**可自托管的数字商品商城，包含用户前台、管理后台与代理工作台。**

*图片：CI*
MIT License · 快速开始 · 后端文档 · 安全说明

GPTibo 将商品展示、下单支付、订单交付、售后处理和代理商店管理整合在同一套系统中。前端使用 React 与 TypeScript，后端提供 Go + PostgreSQL 和 Cloudflare Workers + D1 两种实现，便于按部署环境选择和二次开发。

原站点已停止运营，项目现以 MIT 许可证开放源码。支付与供应商接入使用匿名适配器，需要配置自己的服务后使用。

## 功能

| 模块 | 能力 |
| --- | --- |
| 用户商城 | 商品与套餐展示、下单、支付状态、订单查询、售后申请、中英文界面、深浅色主题 |
| 管理后台 | 商品定价、订单与客户管理、退款处理、代理管理、结算与通知配置 |
| 代理工作台 | 独立商店、品牌设置、自定义域名、商品管理、订单统计与下级代理管理 |
| 业务后端 | 身份验证、支付回调、采购适配、异步任务、邮件通知与交易状态管理 |
| 开发与部署 | 数据库迁移、Docker Compose、自动化测试、GitHub Actions 与源码安全扫描 |

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | React 19、TypeScript、Vite、Tailwind CSS |
| Go 后端 | Go、Gin、PostgreSQL，API 与业务 Worker 分进程运行 |
| Cloudflare 后端 | Workers、D1、Wrangler |
| 邮件 | React Email |
| 验证 | Node.js Test Runner、Go Test、Gitleaks |

两套后端均服务于商城。当前公开版本包含商城侧供应商适配器，**不包含独立供货平台及供应商执行系统**。

## 快速开始

### 环境准备

- Node.js 24、npm、Git、Python 3。
- 使用 Go 后端时，准备 Docker Compose；原生开发需要 Go 1.26+ 和 PostgreSQL。
- 使用 Cloudflare 后端时，通过项目内的 Wrangler 运行本地环境。

```sh
git clone https://github.com/CoolkHz/gptibo.git
cd gptibo
npm ci
```

选择下面一种后端方式运行。

### 方式一：Go + PostgreSQL

在仓库根目录执行以下命令，初始化本地秘密、数据库和运行角色：

```sh
cd services/storefront
python3 scripts/init-secrets.py
cp .env.example .env
docker compose config --quiet
docker compose build api
docker compose up -d --wait postgres
docker compose --profile maintenance run --rm maintenance migrate
docker compose --profile maintenance run --rm maintenance grant-runtime
docker compose up -d --wait api worker
```

另开终端，在仓库根目录启动前端：

```sh
npx vite --config services/storefront/vite.config.ts
```

访问 `http://127.0.0.1:5175`。前端会将 `/api` 请求代理到本机 Go API 的 `8093` 端口。

原生启动、管理员登录、邮件服务与接入配置见 Go 后端文档。Windows 用户可使用后端目录中的 `scripts/init-secrets.ps1` 初始化秘密。

### 方式二：Cloudflare Workers + D1

在仓库根目录执行：

```sh
cp .dev.vars.example .dev.vars
npx wrangler d1 migrations apply gptibo-local --local
npm run preview:worker
```

默认访问 `http://127.0.0.1:8787`。需要前端热更新时，另开终端运行 `npm run dev`，访问 `http://127.0.0.1:5173`；API 请求会转发到本地 Worker。

`.dev.vars` 保存本地配置，不应提交。远程部署时需创建自己的 Cloudflare 资源，并替换 `wrangler.jsonc` 中的占位配置。

### 页面入口

| 页面 | 路径 |
| --- | --- |
| 商城 | `/` |
| 管理后台 | `/admin` |
| 代理工作台 | `/partner` |

管理员登录需要配置自己的管理员身份、TOTP 和邮件验证服务。默认配置不提供可直接登录的管理员账号，也不会发起真实支付、采购或通知。

## 项目结构

```text
src/                   商城前台、管理后台与代理工作台
services/storefront/   Go API、业务 Worker、迁移与部署配置
worker/                Cloudflare Workers 后端
migrations/            D1 数据库迁移
emails/                邮件模板
tests/                 前端与 Worker 业务测试
scripts/               构建与源码检查脚本
public/                静态资源
.github/workflows/     持续集成
```

## 配置与接入

| 配置文件 | 用途 |
| --- | --- |
| services/storefront/.env.example | Go 后端基础运行配置 |
| services/storefront/.env.integrations.example | Go 后端支付、采购及通知接入 |
| .dev.vars.example | Cloudflare 本地配置 |
| wrangler.jsonc | Worker 与 D1 资源配置 |

供应商适配器使用 `recharge`、`account_supplier`、`delivery_supplier`、`xgift` 等通用名称；`gatewaya`、`gatewayb` 为匿名聚合支付适配器。请依据自己的服务协议核对地址、签名、商品映射、金额和回调，再开启对应功能。

真实商户身份、密钥、账号凭据和生产数据不随源码提供。`example.invalid` 是不可用于真实接入的保留域名，示例商品与金额仅用于演示。请使用新数据库安装；匿名化后的迁移不兼容原生产数据库。

## 开发与验证

在仓库根目录执行：

```sh
npm test                # 前端与 Worker 业务测试
npm run lint            # 静态检查
npm run build           # 类型检查、邮件模板与前端构建
npm run security:scan   # 公开源码检查
```

Go 后端验证：

```sh
cd services/storefront
go test ./...
go vet ./...
```

完整数据库测试需设置 `STOREFRONT_TEST_DATABASE_URL`，连接本机、库名以 `_test` 结尾的专用数据库；未配置时集成测试会跳过。详细要求见后端测试说明。

自动化测试不连接真实支付或供应商服务。生产部署前，需要在自己的环境验证完整交易流程。

## 参与贡献

欢迎通过 Issues 反馈问题或提出建议，也欢迎提交 Pull Request。

1. 描述问题、预期行为和复现步骤。
2. 提交范围明确的改动，涉及交易或账务逻辑时补充回归测试。
3. 运行与改动相关的检查，在 PR 中说明验证结果。

请勿提交真实凭据、用户资料、生产日志或数据库。安全问题请按 SECURITY.md 中的方式报告。

## 许可证

项目代码采用 MIT License，允许在保留版权与许可声明的前提下使用、修改和分发。

第三方资源遵循各自许可证，商标及美术作品权利归原权利人所有。详见品牌资源说明与第三方样式说明。
