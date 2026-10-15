---
title: "goehou/tabbit-toy"
owner: "goehou"
name: "tabbit-toy"
fullName: "goehou/tabbit-toy"
description: "这是一个基于tabbit的研究包，可以转化成OAI格式出来，同时增加了会员认证功能和一键提取cookie的浏览器拓展，方便快速本地快速使用claude gpt等模型"
sourceUrl: "https://github.com/goehou/tabbit-toy"
stars: 501
forks: 809
language: "JavaScript"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-08-23T14:07:47Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Tabbit-toy

## 这是什么

[Tabbit](https://tabbit.ai) 是一款基于 Chromium 的国产 AI 浏览器,内置了 21 个 AI 模型(Claude-Opus-4.8、GPT-5.5、Gemini-3.5-Flash、DeepSeek-V4-Pro 等)。正常情况下你必须**打开 Tabbit 浏览器**才能用这些模型。


```
你的客户端 ──OpenAI格式──▶ Tabbit2API(本地服务) ──翻译+签名──▶ web.tabbit.ai
    ▲                                                                    │
    └────────────── OpenAI 格式回复 ◀─────────── SSE 流 ◀────────────────┘
```

## 前置条件

1. **装了 Tabbit 浏览器**并能登录账号([tabbit.ai](https://tabbit.ai) 下载)
2. **Pro 会员**:在 Tabbit 设置里"设为默认浏览器"可解锁(免费),premium 模型(Claude/GPT/Gemini)必需
3. **Node.js 18+**(本项目零依赖,无需 `npm install`)

## 快速开始

### 第 1 步:导出 Cookie

Tabbit 的登录态存在 Cookie 里(含一个 HttpOnly 的 JWT token),需要从浏览器导出一次。

**用本项目自带的 Chrome 扩展(推荐)**:

1. 打开 Chrome 或 Tabbit 浏览器,地址栏输入 `chrome://extensions/`
2. 右上角打开**「开发者模式」**
3. 点**「加载已解压的扩展程序」**,选 `D:\toy\tabbit2api\cookie-helper-extension` 文件夹
4. 访问 `https://web.tabbit.ai/` 并登录
5. 点浏览器工具栏上的扩展图标 → 点**「复制 Cookie」**
6. 准备粘贴(下一步用)

> 也可以手动:F12 → Application → Cookies → `https://web.tabbit.ai` → 把每条 `name=value` 用 `; ` 拼起来

### 第 2 步:获取真实版本号

在 Tabbit 浏览器的 `web.tabbit.ai` 页面按 F12,Console 里执行:

```js
chrome.tabInstance.getDeviceInfo().then(d => console.log(d.tabbitVersion))
```

会输出类似 `1.1.39(10101039)`,记下这个值。

### 第 3 步:配置 .env

复制配置模板:

```bash
cp .env.example .env
```

用记事本打开 `.env`,填两个字段:

```env
TABBIT_COOKIE=粘贴第1步复制的整串 Cookie
TABBIT_VERSION=1.1.39(10101039)   # 填第2步拿到的值
```

### 第 4 步:启动服务

```bash
node src/server.mjs
```

看到下面的输出就说明启动成功:

```
═══════════════════════════════════════════════════════════
 Tabbit2API · OpenAI 兼容代理
  端口: 8787
  鉴权: 未开启
  版本: 1.1.39(10101039)
═══════════════════════════════════════════════════════════
```

### 第 5 步:调用

**命令行测试**:

```bash
# 非流式
curl http://localhost:8787/v1/chat/completions ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"Default\",\"messages\":[{\"role\":\"user\",\"content\":\"你好\"}]}"

# 流式
curl http://localhost:8787/v1/chat/completions ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"Claude-Opus-4.8\",\"messages\":[{\"role\":\"user\",\"content\":\"你好\"}],\"stream\":true}"
```

**接入 Cherry Studio / NextChat 等客户端**:

| 设置项 | 填什么 |
|--------|--------|
| API 地址 (baseURL) | `http://localhost:8787/v1` |
| API Key | 随便填(如 `sk-anything`),不校验 |
| 模型名 | `Default` / `Claude-Opus-4.8` / `GPT-5.5` 等(见下方列表) |

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/v1/models` | 模型列表(OpenAI 格式) |
| `POST` | `/v1/chat/completions` | 聊天补全(支持 `stream: true/false`) |
| `GET` | `/healthz` | 健康检查(Cookie 是否有效 + 会话数 + 自动刷新状态) |
| `POST` | `/admin/refresh-cookie` | 手动触发一次 Cookie 刷新(从本机 Tabbit 浏览器拉取) |

## 可用模型

| 模型 | 类型 |
|------|------|
| `Default` | 免费无限 |
| `GLM-5.2` `GLM-5.1` | 免费计量 |
| `DeepSeek-V4-Pro` `DeepSeek-V4-Flash` `DeepSeek-V3.2` | 免费计量 |
| `Kimi-K2.6` `Kimi-K2.5` | 免费计量 |
| `MiniMax-M3` `MiniMax-M2.7` | 免费计量 |
| `Claude-Haiku-4.5` | 免费计量 |
| `GPT-5.2-Chat` | 免费计量 |
| `Qwen3.5-Plus` `Doubao-Seed-1.8` | 免费计量 |
| `Claude-Opus-4.8` `Claude-Opus-4.7` `Claude-Sonnet-4.6` | ⭐ Pro 会员 |
| `GPT-5.5` `GPT-5.4` | ⭐ Pro 会员 |
| `Gemini-3.5-Flash` `Gemini-3.1-Pro` | ⭐ Pro 会员 |

> ⭐ Pro 会员模型需要:① 账号设过默认浏览器 ② 请求头 `unique-uuid` 标记位 = 1(本项目已自动处理)

## Cookie 自动刷新(可选,推荐)

Cookie 里的 JWT 约 7 天过期。与其每次手动重新导出,可让服务**自动从本机运行的 Tabbit 浏览器拉取最新 Cookie**——浏览器原生层会在 JWT 快过期时静默续期,所以服务拿到的永远是最新的。

### 开启方法

1. 用调试端口启动 Tabbit(一次性,之后日常使用都带这个参数即可):

   ```bash
   # macOS
   open -a Tabbit --args --remote-debugging-port=9222
   # Windows / Linux:在 Tabbit 快捷方式「目标」后追加 --remote-debugging-port=9222
   ```

2. 保持 Tabbit 停留在 `web.tabbit.ai` 页面(任意会话页即可)。

3. 启动服务。此时 `.env` 里**可以留空 `TABBIT_COOKIE`**,服务启动时会自动从浏览器拉取并写回 `.env`:

   ```bash
   node src/server.mjs
   ```

### 刷新策略

- **启动时**:若 `.env` 中无有效 Cookie,自动从浏览器拉取一次
- **定时**:每 `COOKIE_REFRESH_MINUTES`(默认 360 分钟 = 6 小时)后台刷新
- **按需**:请求遇到 401/403/492/493 等鉴权错误时立即刷新重试
- **手动**:`POST /admin/refresh-cookie` 强制刷新
- **兜底**:浏览器未开 / 未带调试端口 / 未登录 → 刷新静默失败,继续使用 `.env` 中上次的 Cookie(日志会提示)。刷新成功后会写回 `.env`,即使浏览器关闭、重启服务也能用最近一次有效 Cookie

> ⚠️ 自动刷新依赖 Node 22+ 内置的 WebSocket。Node 18/20 下该功能自动关闭(静默降级为手动配置 `.env`),不影响其余功能。
> ⚠️ CDP 是 Chrome 系浏览器通用协议,`--remote-debugging-port` 在 Windows/macOS/Linux 行为一致,跨平台可用。

## 每日自动签到(可选)

Tabbit 个人中心有「每日签到」活动(连续签到领 usage / 桌面宠物权益)。本服务内置**纯 HTTP 签到**,随代理一起启动、无需弹浏览器、不依赖 CDP,完全独立于代理请求链路。

### 原理(逆向扩展 popup 的接口)

- 查状态:`GET {base}/api/commerce/activity/v1/sign-in/status?scene_codes=daily_sign_in&scene_codes=desktop_pet`
- 签到:`POST {base}/api/commerce/activity/v1/sign-in`,body `{ request_no, scene_codes: [...] }`
- 鉴权仅用 Cookie(与代理同一个 Cookie,由代理的 CDP 自动刷新保持新鲜)
- `request_no` 为 32 位 hex(时间戳位 + 默认浏览器标记 + 随机位),已按扩展算法还原

### 开启方法

1. 在 env 文件里加一行(默认关闭):

   ```bash
   TABBIT_AUTO_CHECKIN=1
   ```

2. 正常启动代理即可,签到会随服务一起运行:

   ```bash
   node src/server.mjs                 # 读 .env(国际版)
   node src/server.mjs --profile domestic  # 读 .env.domestic(国内版)
   ```

   启动横幅会显示 `每日自动签到: 开`。**启动立即签到一次**,之后每天 00:00:30 自动循环,无需 cron/launchd。

### 独立 CLI(可选)

不想随代理启动,也可以单独跑:

```bash
node scripts/checkin-api.mjs              # 常驻:国内+国际都签,每日循环
node scripts/checkin-api.mjs --once       # 只跑一轮(测试用)
node scripts/checkin-api.mjs --profile domestic  # 只签国内版
# npm 别名: npm run checkin / checkin:once / checkin:dom / checkin:intl
```

> ⚠️ 签到仅使用当前实例 env 文件里的 Cookie。国际版(`.env` / `web.tabbit.ai`)与国内版(`.env.domestic` / `web.tabbit.com`)是**两个不同账号体系**,Cookie 不能混用——各版本用各自的 env 文件即可。

## 配置项(.env)

| 变量 | 必填 | 默认 | 说明 |
|------|------|------|------|
| `TABBIT_COOKIE` | ❌ 否* | — | web.tabbit.ai 域下完整 Cookie(留空则启动时从浏览器自动拉取) |
| `TABBIT_VERSION` | ✅ 是 | `1.1.39(10101039)` | 真实版本号(来自 getDeviceInfo) |
| `TABBIT_BASE_URL` | ❌ 否 | `https://web.tabbit.ai` | Web 后端地址。**国内版改为对应域名**(如 `https://web.tabbit.com`)即可兼容,协议完全一致 |
| `TABBIT_SIGN_KEY` | ❌ 否 | 自动拉取 | HMAC 签名 key |
| `PORT` | ❌ 否 | `8787` | 服务端口 |
| `API_KEY` | ❌ 否 | 空(不校验) | 代理鉴权 key |
| `CDP_PORT` | ❌ 否 | `9222` | 本机 Tabbit 调试端口(开启自动刷新需要) |
| `COOKIE_REFRESH_MINUTES` | ❌ 否 | `360` | Cookie 自动刷新间隔(分钟,设 `0` 可关闭定时刷新) |
| `TABBIT_AUTO_CHECKIN` | ❌ 否 | 空(关) | `1` 开启每日自动签到(随代理启动,每日 00:00:30 循环) |

> \* 开启 Cookie 自动刷新后 `TABBIT_COOKIE` 可留空:服务启动时会从运行中的 Tabbit 浏览器(需 `--remote-debugging-port=9222`)拉取并写回 `.env`。

## 多版本共存（国际版 + 国内版）

Tabbit 国际版与国内版**协议完全一致**(相同的 `/chat/sign-key`、`/proxy/v1/model_config/models`、`/api/v1/chat/completion`、相同签名/HMAC/SSE 格式),仅后端域名与内置模型列表不同。因此本代理**无需改代码即可兼容国内版**,只需指定 `TABBIT_BASE_URL`。

国内版内置国产模型(DeepSeek / 豆包 / Kimi / 通义 / GLM 等),国际版内置 Claude / Gemini / GPT 等。两个版本**同时跑在同一台机器**用「双实例」即可,互不干扰:

```bash
# 每个实例用独立 env 文件 + 一行启动（推荐）
#   --profile  等价 TABBIT_ENV=.env.
#   npm 脚本 start:intl / start:dom 已封装好

# ── 实例 A:国际版 ──
npm run start:intl            # 读 .env.intl    → http://localhost:8787
# 等价: TABBIT_ENV=.env.intl node src/server.mjs
# 等价: node src/server.mjs --profile intl

# ── 实例 B:国内版 ──
# 国内版客户端需以不同的 --remote-debugging-port 启动(不能共用 9222)
npm run start:dom             # 读 .env.domestic → http://localhost:8788
# 等价: TABBIT_ENV=.env.domestic node src/server.mjs
# 等价: node src/server.mjs --profile domestic
```

> 国内版后端域名实测为 `https://web.tabbit.com`（非早前猜测的 `web.tabbit-ai.com`）。
> 三种启动方式完全等价,按需选择;端口 / CDP 端口 / 后端域名都写在各自的 `.env.` 里,无需每次敲一长串环境变量。

客户端侧(自动刷新需要):

```bash
# 国际版
open -a "Tabbit" --args --remote-debugging-port=9222
# 国内版(用各自的应用名 / 端口)
open -a "Tabbit 国内版" --args --remote-debugging-port=9223
```

要点:

- 每个实例必须有**独立的 `.env` / 环境变量**:各自的 `TABBIT_COOKIE`、`TABBIT_BASE_URL`、`PORT`、`CDP_PORT`。两套 cookie 分别来自各自登录态,**不能混用**。
- 两个 Tabbit 客户端**不能用同一个调试端口**,否则 CDP 只会连到其中一个。
- 用不同 `PORT` 区分:OpenAI 客户端里把 `base_url` 指向 `http://localhost:8787`(国际)或 `http://localhost:8788`(国内)即可切换。
- `cookie-helper-extension` 导出时,确认浏览器当前处于对应版本域名下,导出的是该域的 Cookie。

## 项目结构

```
tabbit2api/
├── src/
│   ├── server.mjs              # OpenAI 兼容 HTTP 服务(原生 http,零依赖)
│   └── config.mjs              # 配置加载
├── scripts/
│   ├── probe.mjs               # 探测脚本(验证 Cookie/签名/聊天是否通)
│   ├── checkin-api.mjs         # 每日签到 CLI(独立跑;或由 server 随代理拉起)
│   └── lib/
│       ├── cdp.mjs             # 零依赖 CDP 客户端:Cookie/版本号自动拉取
│       ├── checkin.mjs         # 每日签到核心(纯 HTTP,env 开关 TABBIT_AUTO_CHECKIN)
│       └── tabbit.mjs          # ★ 逆向核心:签名/指纹/SSE/会话/聊天
├── cookie-helper-extension/    # Chrome 扩展:导出 Cookie + 抓请求
├── docs/                       # 协议文档 + 实现路线图
├── .env.example                # 配置模板
└── package.json
```

## 常见问题


Cookie 过期了怎么办?

JWT token 有效期约 7 天。若已开启 Cookie 自动刷新,服务会每 6 小时自动从本机 Tabbit 浏览器拉取最新 Cookie,无需手动操作;浏览器关闭后 `.env` 中仍保留上次有效 Cookie 可继续使用。未开启自动刷新时,过期后用扩展重新导出一次 Cookie 更新 `.env` 里的 `TABBIT_COOKIE` 重启服务即可。


报错 "premium users only"?

premium 模型(Claude/GPT/Gemini)需要 Pro 会员:在 Tabbit 浏览器设置里"设为默认浏览器"解锁。本项目的 `unique-uuid` 标记位已自动设为 1。


报错 "AI service temporarily unavailable"?

通常是 `chat_session_id` 失效。服务会自动从 `/newtab` 拉取会话列表,如果账号下没有会话,先在 Tabbit 浏览器里随便发一条消息创建一个对话即可。


报错 493 "update_version"?

`TABBIT_VERSION` 格式不对。必须是真实格式(如 `1.1.39(10101039)`),用第 2 步的方法从 `getDeviceInfo()` 获取。


## 文档

- docs/逆向流程与协议.md — 协议细节(端点/签名/SSE/Pro 机制)
- docs/实现路线图.md — 项目结构与技术栈

## 注意事项

- ⚠️ Cookie 等同账号控制权,`.env` 已加入 `.gitignore`,切勿提交到 git
- ⚠️ 仅供个人学习研究,不要商用、高并发滥用、二次分发账号
- 本项目基于逆向分析,Tabbit 更新后协议可能变化,需要重新适配,如果觉得本项目对学习研究有用,请您给我一个免费的star

## ⚠️ 免责声明

   本项目仅供个人学习与技术研究,不提供任何明示或暗示的担保,使用风险由使用者自行承担。

   - **与官方无关**:本项目非 Tabbit 官方产品,与 Tabbit 及其关联方无任何合作、代言或隶属关系。"Tabbit" 等商标版权归原权利人所有,本项目仅作为技术研究对象。
   - **合规风险**:本项目通过分析 Tabbit Web 端协议实现。使用前请自行评估法律风险,由此产生的一切后果由使用者自行承担,作者不承担任何责任。
   - **账号风险**:Cookie 等同于账号控制权,因泄露、滥用导致账号被封、数据丢失等损失,作者不承担责任。请妥善保管 `.env`,切勿提交到任何公开仓库。
   - **稳定性**:Tabbit 更新后协议可能随时变化导致失效,作者不保证持续维护或可用性。
   - **使用限制**:禁止将本项目用于商业用途、禁止二次分发账号/Token、禁止高并发滥用。因违规使用产生的一切后果由使用者承担。

## Links

- [Linux Do](https://linux.do/)
