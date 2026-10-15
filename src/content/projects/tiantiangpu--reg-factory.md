---
title: "tiantianGPU/reg-factory"
owner: "tiantianGPU"
name: "reg-factory"
fullName: "tiantianGPU/reg-factory"
description: "天天卡网"
sourceUrl: "https://github.com/tiantianGPU/reg-factory"
stars: 1970
forks: 778
language: "Python"
topics: []
license: "未标注"
homepage: "https://ttcard.zeabur.app"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-18T08:40:21Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# 🏭 reg-factory

### Outlook · Gmail · ChatGPT · Grok · Claude · Gemini · GitHub · Google One

**邮箱注册、平台授权、凭据导出与下游导入的一体化本地控制台**


  
  &nbsp;
  
  &nbsp;
  
  &nbsp;
  
  &nbsp;
  
  &nbsp;
  


  
  &nbsp;
  
    
  
  &nbsp;
  
    
  


  
  
  
  
  


---


  
    
  


> **IPWO住宅代理提供195+地区住宅 IP 资源，适用于 AI 应用、浏览器自动化、海外服务访问及开发测试等场景，为开发者提供多地区网络环境选择。**
> **重点！**2GB动态住宅流量无门槛发放，领取入口，进作者群不定时IP福利发放。

> **中转站：** [天天 AI Pro](https://tiantianai.pro) · [天天 AI](https://tiantianai.co)
>
> **卡网地址：** [TTCard](https://ttcard.zeabur.app)

项目将 Outlook 邮箱、ChatGPT、Grok、Claude、Kiro 注册，Codex OAuth、账号导出和下游导入整合到同一个 Web 控制台，同时保留可组合的命令行入口。

当前主版本为 `2.1.1`，重点是低成本并发、极致省流和 Claude 协议注册兼容：任务按槽位隔离浏览器与住宅出口，代理池不足时自动降并发；住宅流量模式支持 `extreme`，并新增 ClaudeX 风格 HTTP 注册协议。详见 2.1.1 更新日志。

> 仅用于学习、开发和经授权的测试。密钥、账号、Cookie、Token 和运行日志均应保留在本机，不要提交到仓库。

## 快速开始

第一次使用建议先阅读 新手教程。教程从下载安装开始，按界面顺序说明网络出口、指纹浏览器、Outlook Graph 辅助邮箱、住宅节流、并发、成功率自动停止、结果检查和升级，不要求先理解命令行或 `.env`。

### Windows 便携安装包

从 Releases 下载 `reg-factory-windows-x64-<版本>.zip`，完整解压后双击 `reg-factory.exe`，程序会自动打开控制台页面。便携包无需安装 Python；浏览器与网络出口按下面的前置条件选择配置。不要直接在 ZIP 压缩包预览窗口中运行 EXE。

默认端口是 `8799`。程序只复用相同版本的现有服务；旧版本占用端口时，新版会自动选择后续空闲端口并打开新版页面。再次双击同一新版会复用已经运行的新版服务。启动失败时错误窗口会保留，便于截图排查。

配置和运行数据默认保存在 `%LOCALAPPDATA%\RegFactory`，升级时直接替换程序目录即可。首次切换到便携包时，如果检测到仍在运行的源码版且其目录包含邮箱、Cookie 或 Token，新版会自动沿用该资产目录。

`1.2.30` 及更早便携版的一键更新启动参数存在问题，需要先从 Releases 手动下载并覆盖安装一次新版。新版的“一键更新”会重试断流下载、校验 SHA-256 与包内版本，并在失败时显示实际原因；数据目录不会随程序目录替换。

Windows 便携包包含全新的独立 Codex K12 适配器；K12 使用独立端口 `8806` 和独立数据目录，可通过 `start_k12.bat` 单独启动。

### 从源码运行

运行前需要：

- Python 3.10+
- 默认使用 [BitBrowser](https://www.bitbrowser.cn/download)，也支持内置 Chromium、自定义 Chrome/Chromium 和 AdsPower
- Clash Verge 2.5.2 Windows x64（自动/固定节点模式），或一个住宅代理服务
- Node.js 20+（仅 Gmail Android 模块或源码前端开发按需需要）

Windows：

```text
1. 双击 install.bat
2. 启动 BitBrowser；使用 Clash 网络模式时同时启动 Clash Verge
3. 双击 start.bat
4. 打开 http://127.0.0.1:8799/
```

macOS / Linux：

```bash
./install.sh
./start.sh
```

安装脚本会创建 `.venv`、安装 Python 与 Playwright 依赖，并在缺少时从 `.env.example` 生成 `.env`。详细前置条件和环境变量见 配置说明。

## Web 控制台

主控制台默认监听 `http://127.0.0.1:8799/`，提供以下入口：

- 新手指南：首次打开自动引导 Clash External Controller、控制密码、住宅代理、继承全局、浏览器、Outlook Graph 辅助邮箱、接码、资产 API 和任务勾选配置；支持按阶段跳过并从顶栏重新打开。
- 任务库：按流程分类选择任务，只展示常用参数，低频参数收进“更多设置”。
- 运行日志：实时查看输出和结果状态；可停止当前任务树，或一键清理新旧版本遗留的全部注册任务。
- 邮箱池：批量导入 Outlook 各地域域名、Hotmail/Live/MSN、iCloud 和自定义邮箱；兼容 JSON、RT/client_id 正反顺序及多种分隔符。
- 资产 API：直接领取本地尚未领取的邮箱或平台账号，不在取件前在线检测；邮箱可选“仅领取最近扫描为正常”，同一账号跨输出格式只返回一次。
- 号池扫描：同平台低频串行、近期结果自动复用，遇到限流或连续风控响应自动暂停；按需校验 Outlook、ChatGPT、Claude、Grok 和 Kiro，并标注 ChatGPT Plus 免费试用资格。
- 网络出口：切换 Clash 自动轮换、固定节点或动态住宅 IP，并测试公网出口。
- 环境配置：分组编辑 `.env` 并测试外部服务连通性。
- Codex K12：独立管理 K12 workspace、邮箱资产、任务与 Codex 凭据；主面板只负责启动和内嵌入口。
- Plus Codex 导入：使用已经开通 Plus 的 ChatGPT 账号，登录后强制完成手机号接码验证，再走 Codex OAuth 并导入 SUB2API；不再执行提链、绑卡或支付。WebUI 支持批量粘贴 Outlook/Hotmail/Live/MSN、iCloud、ChatGPT session Cookie/token 和完整 Codex OAuth JSON，也兼容 RT/client_id 正反顺序及多种分隔符。
- GoPay 钱包支付：集成在现有 Plus 协议支付面板中；选择 `GoPay + 批量协议支付` 后，系统先提取 Midtrans 链接，再从本地钱包池自动选择可用账号支付。钱包池弹窗负责注册/登录、余额、号码和 OTP，不再提供第二套支付入口。

控制台只监听本机。Codex K12 独立服务默认监听 `8806`，说明见 k12/README.md。

动态住宅 IP 会在创建新浏览器窗口时写入完整代理认证；轮换后的代理从下一个新窗口开始使用。网络页可分别设置 Outlook、Claude、ChatGPT、Grok、Kiro 和 GitHub 的出口，例如 Outlook 使用 Clash、其他平台使用住宅代理，并可按平台测试真实公网 IP。

住宅模式默认启用“平衡节流”，浏览器会跳过普通图片、字体和音视频，并保留脚本、样式表以及 Cloudflare、hCaptcha、Arkose、PerimeterX 等验证资源。网络页可以切换到“激进节流”进一步拦截样式表和常见统计请求；Microsoft 登录与 Graph 授权页会保留必要样式表，避免可见状态判断失真。该设置只影响浏览器页面资源，不改变账号 API、代理分配和出口粘性。

并发注册会为每个任务创建独立浏览器 Profile、Cookie 和指纹环境。住宅代理池会按并发槽分配不同端点；没有住宅 IP 时也可把网络模式设为 `clash_fixed`，或在单平台注册任务中指定一个节点，以同一固定公网 IP 并发。`clash_auto` 的节点选择是全局状态，为避免注册中途换 IP 会自动降为单并发。建议先从并发 `2` 开始，固定 Clash 并发需自行承担共享出口带来的关联和限流风险。

## 本地资产 API

本地接口支持按顺序或指定 `index` 领取邮箱、Claude/ChatGPT/Grok Cookie 和 Kiro Builder ID 账号；`format=cookies` 输出浏览器扩展可导入的标准 JSON，并可把 ChatGPT 会话转换为 SUB2API、CPA 或 chatgpt2api 格式。读取请求直接从本地尚未领取的资产中返回数据，不会先发起在线状态检测。邮箱设置 `normal_only=true` 时只使用最近一次扫描缓存筛选正常状态，领取时仍不联网。账号成功返回后会按平台写入领取账本，切换输出格式也不会再次返回；需要复用时必须显式重置领取记录。号池扫描按平台低频串行并自动复用近期结果，接口响应受网络、出口和目标服务风控影响，不能保证是账号的永久状态。控制台左侧打开“资产 API”即可配置访问密钥、生成调用命令和查看状态。默认仅允许本机访问，可配置 `REG_FACTORY_ASSET_API_KEY`。

```bash
# 按顺序取下一个邮箱
curl "http://127.0.0.1:8799/api/assets/emails?format=json"

# 只领取最近一次扫描为正常的邮箱（领取时不联网检测）
curl "http://127.0.0.1:8799/api/assets/emails?normal_only=true"

# 领取当前未领取列表中的第 3 个 ChatGPT 账号，输出 SUB2API 格式
curl "http://127.0.0.1:8799/api/assets/cookies/chatgpt?format=sub2api&index=2"

# 指定第 1 个 Claude 账号，输出标准浏览器 Cookie JSON
curl "http://127.0.0.1:8799/api/assets/cookies/claude?format=cookies&index=0"

# 配置 API Key 后增加鉴权请求头
curl "http://127.0.0.1:8799/api/assets/cookies/chatgpt?format=cpa" \
  -H "X-API-Key: your-key"
```

省略 `index` 时领取当前未领取列表中的第一条；指定 `index` 时从当前未领取范围选择。两种方式都会记录领取，同一平台账号跨格式不重复返回。完整平台格式、响应字段和领取记录重置方式见 本地资产 API。

## 常用命令

```bash
# Outlook -> Claude / ChatGPT / Grok / Kiro / GitHub
python run_full_flow.py --platforms claude chatgpt grok kiro github

# 同时处理 3 个邮箱；每个邮箱内的所选平台默认并行
python run_full_flow.py --rounds 12 --concurrency 3 --platforms claude chatgpt kiro

# 使用已有邮箱池并行注册多个平台
python register_three_platforms.py --from-pool --parallel

# 常驻注册 Outlook
python outlook_reg_loop.py

# [重要] Graph RT 提取必须配置可接收验证码的辅助邮箱，否则 proofs/Add 安全信息页无法完成授权
# 默认使用 YYDS 辅助邮箱并自动接码
python tools/extract_graph_tokens.py --email user@outlook.com --password 'password'
# 仅做 Outlook Graph 授权：批量粘贴/准备 email----password（也兼容五个短横线），不执行账号解锁
python tools/authorize_outlook.py --input accounts.txt --concurrency 3 --method http
# HTTP 失败账号会记录到 outlook_no_graph.txt，之后显式改用 Cloak 浏览器授权
python tools/authorize_outlook.py --input outlook_no_graph.txt --method browser --concurrency 2
# 自定义临时邮箱：.env 设置 OUTLOOK_GRAPH_RECOVERY_PROVIDER=custom，并填好 CUSTOM_MAIL_*
# 自有 Outlook 辅助邮箱：设置 provider=outlook，并填
# OUTLOOK_GRAPH_RECOVERY_OUTLOOK_MAILBOX=email@outlook.com----password----refresh_token----client_id

# Claude 使用最新 Outlook refresh token
python register.py --count 1 --node auto --latest-rt

# ClaudeX HTTP 协议版（无需创建 Chromium/CDP Profile）
python register.py --count 1 --protocol http --provider yyds

# Claude 使用 YYDS 临时邮箱
python register.py --count 1 --node auto --provider yyds

# ChatGPT 使用 iCloud 接码邮箱（先在 .env 配置 ICLOUD_MAIL_API_KEY）
python register_chatgpt.py --count 1 --email-provider icloud

# ChatGPT 注册固定使用 iCloud 接码邮箱（icloud-code + service=openai）
# 先在 .env 设置 CHATGPT_EMAIL_PROVIDER=icloud 和 ICLOUD_MAIL_API_KEY

# 已开通 Plus 账号：手机号接码验证 -> Codex OAuth -> SUB2API
python tools/import_plus_codex.py --accounts-file accounts.txt --sms-provider auto --phone-attempts 3

# Grok 浏览器注册并导入 SUB2API
python register_grok.py --count 1 --sub2api

# Kiro Builder ID 注册并导出长期凭据
python register_kiro.py --count 1

# Codex OAuth -> SUB2API / CPA
python oauth_codex.py --keep
```

完整参数、导出和补传命令见 CLI 手册。

## 项目结构

```text
reg-factory/
├─ common/                 # 浏览器、邮箱、代理、验证码、上传等共享能力
├─ tools/                  # 导出、校验、token 补传等维护工具
├─ runtime/                # 本机日志、状态与临时凭据（内容不提交）
├─ webui/                  # FastAPI 服务与原生前端
├─ k12/                    # 独立 Python K12 适配器与前端
├─ gmail_android/          # BlueStacks + Appium 的 Gmail 流程
├─ vision_solver/          # 通用视觉验证码求解库
├─ xconsole_client/        # XConsole 客户端
├─ vendor/gopay_engine/    # 隔离的 GoPay/Gojek 与 Midtrans 协议核心
├─ tests/                  # Python 测试
├─ run_full_flow.py        # 端到端主入口
├─ register_*.py           # 各平台注册入口
├─ outlook_reg_loop.py     # Outlook 常驻注册入口
└─ config.py               # 统一配置读取
```

根目录只保留用户直接运行的入口和兼容模块；一次性维护命令放 `tools/`，可复用逻辑放 `common/`。完整依赖关系和新增文件约定见 架构说明。

## 运行数据

下列内容由程序生成且默认忽略，不属于源码：

| 路径 | 内容 |
|---|---|
| `.env` | 本机密钥与服务地址 |
| `emails.txt` | 邮箱池 |
| `cookies/` | 平台 Cookie |
| `tokens/` | 标准 Token 与上传状态 |
| `_outlook_pool/` | Outlook 待用账号 |
| `outlook_accounts/` | Outlook 账号与 Graph Token |
| `runtime/logs/`、`tri_register_logs/` | 任务日志 |
| `runtime/state/` | Clash/住宅代理轮换状态 |
| `runtime/secrets/` | 本地临时凭据与测试密钥 |
| `runtime/gopay/` | GoPay 账号、PIN、token、短信配置和支付任务状态 |
| `screenshots*/` | 调试截图 |
| `unlock_results/` | Outlook 解锁结果 |

这些路径可能包含敏感信息。排查问题时也不要直接上传完整文件。

## 开发与验证

```bash
python -m unittest discover -s tests
node --check webui/static/app.js
```

更新已安装实例请使用 `update.bat` 或 `./update.sh`。更新脚本会先检查运行中的任务，再更新依赖、重启并验证 WebUI 版本。

## 文档

- 新手教程
- 配置说明
- 本地资产 API
- CLI 手册
- 架构与目录约定
- 维护工具索引
- Gmail Android 本地环境
- 常见问题
- 版本记录

## 支持

- QQ 群：`1048143135`
- Telegram：[@TIANTIANAIPRO](https://t.me/TIANTIANAIPRO)

## 🔗 Friend Links

- 🐧 [**LinuxDO**](https://linux.do) — A community for tech enthusiasts
