---
title: "SunkenCost/grok-regkit"
owner: "SunkenCost"
name: "grok-regkit"
fullName: "SunkenCost/grok-regkit"
description: "xAI/Grok account registration toolkit (browser + hybrid, SSO + CPA OIDC export)"
sourceUrl: "https://github.com/SunkenCost/grok-regkit"
stars: 151
forks: 69
language: "Python"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-07-15T08:23:25Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# grok-regkit

xAI / Grok **账号自动注册工具包**。

自动完成注册，产出 **SSO**（网页会话 / 号池），并可导出 **OIDC**（`xai-*.json` → CLIProxyAPI → free **Grok 4.5**）。  
支持 **浏览器注册** 与 **混合协议注册**，自带 Web 控制台、GUI、CLI。

> **SSO ≠ OIDC。** 仅有 SSO 不能当 Build 4.5 凭证。详见 `docs/sso-cpa/`。

**仅供研究、测试与个人学习。** 请遵守目标站点服务条款与当地法律。详见 `NOTICE.md`。

---

## 功能亮点

| 能力 | 说明 |
|------|------|
| 双注册模式 | `browser` 全浏览器 · `hybrid` 协议 RPC + 短浏览器采 Turnstile/castle |
| 临时邮箱 | **Cloudflare Temp Email** · **DuckMail** · **YYDS Mail**（见下表） |
| SSO 落盘 | `邮箱----密码----sso` → `accounts_*.txt`，可选写入号池 |
| CPA / OIDC | 协议优先 mint → `cpa_auths/xai-*.json` → **grok-4.5** |
| 可选反代 | `deploy/cpa_gateway` + Nginx 模板：多 key 配额暴露 CLIProxy（见下） |
| 多入口 | Web 控制台 · GUI · CLI · backfill 脚本 |

---

## 适配的临时邮箱

配置项：`email_provider`（Web 控制台「邮箱来源」Tab 切换）。  
**browser / hybrid 共用**同一套建号与收验证码逻辑。

| `email_provider` | 服务 | 必填配置 | 说明 |
|------------------|------|----------|------|
| `cloudflare` | Cloudflare Temp Email 兼容 Worker | `cloudflare_api_base` | 可选 `cloudflare_api_key`、`cloudflare_auth_mode`（`none` / `x-admin-auth` / `bearer` / `x-api-key` / `query-key`）；路径可配 |
| `duckmail` | [DuckMail](https://api.duckmail.sbs) | `duckmail_api_key` | 拉域名 → 建地址 → 轮询邮件 |
| `yyds` | [YYDS Mail](https://vip.215.im/docs) | `yyds_api_key`（或 `yyds_jwt`） | 拉域名 → 建地址 → 轮询验证码 |

### 配置示例

**Cloudflare**

```json
{
  "email_provider": "cloudflare",
  "cloudflare_api_base": "https://your-worker.example.com",
  "cloudflare_auth_mode": "none",
  "cloudflare_api_key": "",
  "defaultDomains": "mail.example.com"
}
```

**DuckMail**

```json
{
  "email_provider": "duckmail",
  "duckmail_api_key": "your-key"
}
```

**YYDS Mail**

```json
{
  "email_provider": "yyds",
  "yyds_api_key": "your-key",
  "yyds_jwt": ""
}
```

更细的路径说明、扩展参考：`docs/mail-providers.md`。

---

## 架构

```text
临时邮箱（cloudflare / duckmail / yyds）
              │
              ▼
     注册 accounts.x.ai
     （browser 或 hybrid）
              │
              ▼
          SSO cookie
              │
     ┌────────┴────────┐
     ▼                 ▼
  号池 (SSO)      CPA mint (OIDC)
  Web 模型        xai-*.json → CLIProxyAPI → grok-4.5
```

| 注册模式 | 配置 | 说明 |
|----------|------|------|
| 全浏览器 | `"register_mode": "browser"` | 全程 Chromium，过盾稳 |
| 混合协议 | `"register_mode": "hybrid"` | 浏览器短采 token，业务走协议，通常更快 |

---

## 快速开始

```bash
cd grok-regkit
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
cp config.example.json config.json
# 填写 email_provider + 对应密钥、代理、register_mode
```

### Web（推荐）

```bash
# Linux 无桌面: export DISPLAY=:99  （配合 Xvfb）
uvicorn web.server:app --host 127.0.0.1 --port 8092 --workers 1
```

打开：`http://127.0.0.1:8092`

### GUI / CLI

```bash
python grok_register_ttk.py
python grok_register_ttk.py --cli
```

### 常用配置字段

| 字段 | 说明 |
|------|------|
| `email_provider` | `cloudflare` \| `duckmail` \| `yyds` |
| `register_mode` | `browser` \| `hybrid` |
| `proxy` / `proxy_mode` | 注册代理 |
| `cpa_export_enabled` | 注册后是否 mint OIDC |
| `cpa_prefer_protocol` | 协议 mint 优先 |
| `cpa_auth_dir` | 默认 `./cpa_auths` |

完整示例见 `config.example.json`。

---

## 可选：反代与 CPA 网关

注册成功并 mint 出 `xai-*.json` 后，可用 **CLIProxyAPI** 提供 OpenAI 兼容接口。  
本仓库 `deploy/` 提供可选参考：

- **cpa-gateway**：多客户端 key + 请求配额，转发到本机 CLIProxy  
- **Nginx 片段**：公网 `/cpa/` → gateway；可选注册 Web 面板反代  

完整步骤与 curl / SDK 示例：`docs/reverse-proxy.md` · 文件索引：`deploy/README.md`。

> 注册机核心**不依赖** `deploy/`。凭证勿混用（SSO ≠ CPA key）。

---

## 产物

| 路径 | 内容 |
|------|------|
| `accounts_*.txt` | browser：`邮箱----密码----sso` |
| `accounts_hybrid_*.txt` | hybrid：同上 |
| `cpa_auths/xai-.json` | OIDC，供 CLIProxyAPI |

存量补 OIDC：

```bash
python scripts/backfill_cpa_xai_from_accounts.py
```

---

## 环境要求

- Python 3.9+（推荐 3.11 / 3.12）
- Chrome / Chromium
- 可访问 `accounts.x.ai`、所选邮箱 API；按需代理
- Linux 服务器建议 Xvfb + 有头 Chromium

---

## 目录

```text
grok-regkit/
  grok_register_ttk.py     # 浏览器注册 + 调度
  hybrid_register.py       # 混合注册
  browser/  protocol/      # hybrid 依赖
  cpa_xai/  cpa_export.py  # OIDC mint
  web/                     # FastAPI 控制台
  deploy/                  # 可选：cpa-gateway + Nginx 模板
  scripts/                 # backfill 等
  docs/
    项目介绍.md
    mail-providers.md      # 邮箱适配说明
    reverse-proxy.md       # 反代 / CPA 网关用法
    sso-cpa/               # SSO / CPA 适配
  config.example.json
```

---

## 文档

| 文档 | 内容 |
|------|------|
| docs/项目介绍.md | 中文总览（亮点、模式、速度说明） |
| docs/mail-providers.md | 邮箱适配与扩展参考 |
| docs/sso-cpa/ | SSO ≠ OIDC · 模式矩阵 · 配置 |
| docs/reverse-proxy.md | 可选反代 · cpa-gateway · curl 示例 |
| LOCAL_RUN.md | 本机运行细节 |
| OPEN_SOURCE.md | 开源快照维护 |
| SECURITY.md | 密钥与安全 |
| NOTICE.md | 使用边界 |

---

## 🤝 Acknowledgments and Community

This project is forever grateful for the support and promotion from the [LINUX DO](https://linux.do) community.

本项目感谢 [LINUX DO](https://linux.do) 社区的支持与推广。

---

## License

MIT

## 免责声明

本项目与 xAI / Grok **无官方关系**。自动化可能导致账号或 IP 封禁，使用风险自负。
