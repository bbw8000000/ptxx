---
title: "cryingcheems/codex-team-oauth"
owner: "cryingcheems"
name: "codex-team-oauth"
fullName: "cryingcheems/codex-team-oauth"
description: "利用Team 空间域名free 账号跳过手机号登录 codex的研究脚本"
sourceUrl: "https://github.com/cryingcheems/codex-team-oauth"
stars: 149
forks: 70
language: "Python"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-16T13:34:12Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Codex Team-跳过手机号注册脚本

## 说明

这是一个脱敏版的 `codex_team_oauth.py` 脚本，用于展示如何使用 Codex client_id 流程自动注册账号并获取 OAuth token。

该脚本依赖本地 `deps/` 目录中的 Sentinel 支持代码。

## 需要分享的文件

- `codex_team_oauth.py`
- `deps/__init__.py`
- `deps/sentinel.py`
- `deps/sentinel_quickjs.py`
- `deps/openai_sentinel_quickjs.js`
- `.env.example`

## 依赖安装

请先安装 Python 依赖：

```bash
python3 -m pip install --upgrade pip
pip install curl_cffi
```

如果要走 QuickJS 路径，还需要系统可用 `node`：

```bash
node -v
```

## 环境变量配置

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env`，将以下变量替换为真实值：

- `TEST_EMAIL`
- `TEST_PASSWORD`
- `TEST_INBOX_API`  inbuck 邮箱地址

`CLIENT_ID` 和 `CODEX_REDIRECT_URI` 已固定在脚本中，无需在 `.env` 中配置。

## 运行方式

```bash
python3 codex_team_oauth.py
```

脚本会自动读取当前目录下的 `.env` 文件。

## 注意

- 该脚本仅用于示例和测试，切勿分享 `.env` 中的真实凭据。
- 不要附带 `/tmp/codex_token_*.json` 或其他敏感输出文件。
- `TEST_INBOX_API` 需要指向可用的 OTP 邮件服务接口。

## 友情链接

- [LINUX DO - 新的理想型社区](https://linux.do/)
