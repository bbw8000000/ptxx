---
title: "xsser/cliproxyapi-cloudflare-stack"
owner: "xsser"
name: "cliproxyapi-cloudflare-stack"
fullName: "xsser/cliproxyapi-cloudflare-stack"
description: "感谢马斯克 让我grok自由，免费注册grok 无数个号。然后cpa自由使用"
sourceUrl: "https://github.com/xsser/cliproxyapi-cloudflare-stack"
stars: 118
forks: 10
language: "Shell"
topics: ["cli-proxy-api", "cloudflare", "cloudflare-tunnel", "cloudflare-workers", "openai-api", "self-hosted"]
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-07-12T09:16:35Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# cliproxyapi-cloudflare-stack

用自己的凭证搭一个 OpenAI 兼容的 LLM API 网关，全部跑在自托管基础设施上。

## 解决什么问题
不想把账号凭证直接交给第三方中转，想自己掌控：统一一个入口、多凭证组成池、对外 HTTPS，且不开放任何公网入站端口。

## 功能
- **收信端点**：Cloudflare Worker + D1，在你自己的域名上程序化收信。
- **API 网关**：CLIProxyAPI 多凭证池、热加载、故障转移，对外暴露 `/v1/*`。
- **安全暴露**：Cloudflare Tunnel 把内网网关反代成 HTTPS 公网域名（无需公网 IP、无需开端口）。

## 如何使用
1. **部署 CPA 网关**（VM 上）：`bash scripts/deploy_vm.sh`，记下输出的 `sk-` API key 与 auth-dir。
2. **搭收信 Worker**：复制 `templates/wrangler.toml.template` 填值 → `wrangler deploy`；再用 Email Routing 设 catch-all 指向该 Worker。
3. **加凭证**：把**你已获授权**的凭证 `.json` 放进 CPA 的 auth-dir（或 `SRC=./auth_local VM_HOST=user@host bash scripts/sync_credentials.sh`），CPA 自动热加载。
4. **对外 HTTPS**：用 `templates/cloudflared-cpa.service.template` 起 Tunnel，得到 `https://./v1`。
5. **调用**：任意 OpenAI 兼容客户端，`baseURL` 填上一步域名，`apiKey` 填 `sk-` key。

详细步骤与部署坑点见 `SKILL.md`。

> **免责**：仅用于学习部署架构与管理你已授权的凭证；不得用于自动注册、绕过人机验证或违反任何第三方（含 x.ai、Cloudflare）ToS。风险自担，按「现状」提供。

## License
MIT。
