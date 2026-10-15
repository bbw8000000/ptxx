---
title: "helloaiden0305/odm_helper_demo"
owner: "helloaiden0305"
name: "odm_helper_demo"
fullName: "helloaiden0305/odm_helper_demo"
description: "精简版demo，仅用于个人技术学习分享，不涉及商业数据，数据已处理脱敏。"
sourceUrl: "https://github.com/helloaiden0305/odm_helper_demo"
stars: 35
forks: 1
language: "TypeScript"
topics: []
license: "NOASSERTION"
defaultBranch: "main"
snapshotDate: "2026-07-31"
pushedAt: "2026-07-30T16:11:38Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# XZY ODM 研发测试助手

本项目演示一个面向 ODM 研发测试场景的智能助手架构，包含 RTC 语音交互、RAG 知识检索、LLM 流式生成和 TTS 语音回复能力。

页面展示名为 **XZY 研发测试助手**，用于模拟内部工程师查询 SOP、测试规范、软硬件常见问题、历史缺陷和日志分析方法。

## 业务背景

ODM 研发测试过程中会沉淀大量规范、问题单、调试记录和历史缺陷。

新人排查蓝牙、Wi-Fi、ANR、刷机失败、相机黑屏等问题时，常常需要在多份文档和日志中来回检索。

本项目用脱敏 mock 数据演示一个轻量研发测试助手：先检索工程知识，再生成简洁、可执行的处理建议。

## 架构流程

```text
用户语音
  ↓
前端 RTC SDK
  ↓
火山 RTC 云端 Agent
  ↓
ASR 语音转文字
  ↓
CustomLLM Callback
  ↓
Python FastAPI /api/chat_callback
  ↓
RAG 检索 ODM 工程知识
  ↓
Ark / Doubao LLM 流式生成
  ↓
SSE 返回 RTC 云端
  ↓
TTS 合成语音
  ↓
前端播放 AI 回复
```

## 前端职责

前端展示 RTC 进房、设备控制、字幕展示、打断和通话状态展示能力。
当前改造只使用场景展示和少量样式，使页面呈现为内部工程工作台风格。

默认前端代理地址保持为：

```text
http://localhost:3001
```

## 后端职责

项目保留一套 Python 后端：`rag_llm_server`。
接口路径和端口保持不变，Python 后端负责返回场景配置、代理 RTC OpenAPI 请求，并接收 CustomLLM callback 执行 RAG 检索与 LLM 流式生成。

需要兼容的接口：

```text
/getScenes
/proxy
/api/chat_callback
/debug/chat
/debug/rag
```

## RTC / ASR / LLM / TTS 协作关系

RTC 负责实时音频传输和 Agent 链路编排；
ASR 将用户语音转成文本；
CustomLLM callback 把文本请求转发到本地 FastAPI；
RAG 先检索 ODM 工程知识；
LLM 根据知识上下文生成回答；
TTS 将回答合成为语音并回传给前端播放。

## RAG 知识库说明

当前 GitHub 展示版为了方便本地运行，默认使用 `rag_llm_server/data/odm_knowledge.json` 中的脱敏 mock ODM 知识数据和轻量关键词检索逻辑模拟 RAG 流程。
真实企业环境可替换为火山知识库 / VikingDB 或企业内部 RAG 检索服务。

mock 数据覆盖：

```text
X100 蓝牙连接失败、Wi-Fi 断连日志抓取、ANR 日志分析、刷机失败、相机预览黑屏、音频无声、测试报告提交规范、Bug 回归验证等。
```

## 本地启动方式

### 1. 准备环境变量

首次运行时，先从模板创建自己的本地环境变量文件：

```shell
cp .env.example rag_llm_server/.env
```

然后编辑 `rag_llm_server/.env`，填入自己的火山引擎、RTC、Ark、ASR/TTS 和公网回调地址配置。不要把 `rag_llm_server/.env` 提交到 GitHub。

### 2. 启动 Python 后端

```shell
cd rag_llm_server
python main.py
```

后端默认监听：

```text
http://localhost:3001
```

### 3. 启动公网回调映射

如果要测试完整 RTC 云端 Agent + CustomLLM callback，需要让火山云端能访问本地 Python 后端。可以使用 ngrok：

```shell
ngrok http 3001
```

把 ngrok 输出的 `Forwarding` HTTPS 地址填到 `rag_llm_server/.env`：

```env
SERVER_URL=https://your-ngrok-domain.ngrok-free.app
```

注意：`SERVER_URL` 只填写域名，不要带 `/api/chat_callback`，代码会自动拼接成：

```text
{SERVER_URL}/api/chat_callback
```

如果只是查看前端页面或调试本地 mock RAG，可以暂时不启动 ngrok。

### 4. 启动前端

```shell
npm install
npm run dev
```

前端默认访问：

```text
http://localhost:3000
```

## 环境变量说明

`rag_llm_server/.env` 需要包含：

```text
VOLC_ACCESS_KEY=your_volc_access_key
VOLC_SECRET_KEY=your_volc_secret_key
ARK_API_KEY=your_ark_api_key
ARK_ENDPOINT_ID=your_ark_endpoint_id
RTC_APP_ID=your_rtc_app_id
RTC_APP_KEY=your_rtc_app_key
RTC_TOKEN_MODE=auto
RTC_DEBUG_PRINT_TOKEN=false
RTC_DYNAMIC_SESSION=true
RTC_TOKEN=your_optional_rtc_temp_token
RTC_ROOM_ID=XzyDemoRoom
RTC_USER_ID=XzyTester
ASR_APP_ID=your_asr_app_id
TTS_APP_ID=your_tts_app_id
SERVER_URL=https://your-public-callback-url.example.com
```

字段含义：

```text
VOLC_ACCESS_KEY / VOLC_SECRET_KEY：调用火山 RTC OpenAPI 的 AK/SK。
ARK_API_KEY / ARK_ENDPOINT_ID：Python 后端调用 Ark / Doubao LLM 使用。
RTC_APP_ID / RTC_APP_KEY：使用真实 AppKey 自动生成 RTC 进房 Token。
RTC_TOKEN_MODE：默认 `auto`，优先使用 `RTC_APP_KEY` 自动生成 Token；如需临时回退控制台 Token，可改成 `temp`。
RTC_DEBUG_PRINT_TOKEN：本地排查 `token_error` 时可临时设为 `true`，后端会打印完整 Token、RoomId、UserId 供 RTC 控制台校验；不要在共享日志或截图中暴露。
RTC_DYNAMIC_SESSION：默认 `true`，在自动 Token 模式下为每次页面会话生成随机 RoomId/UserId，避免多人共用固定 RTC 身份；临时 Token 模式会使用固定 RoomId/UserId。
RTC_TOKEN：可选。仅在 `RTC_TOKEN_MODE=temp` 或没有配置 AppKey 时作为临时 Token 兜底。
RTC_ROOM_ID / RTC_USER_ID：RTC 房间和测试用户 ID；如果使用临时 Token，需要与生成 Token 时绑定的值一致。
ASR_APP_ID / TTS_APP_ID：RTC 云端 Agent 的语音识别和语音合成配置。
SERVER_URL：公网可访问的 Python 后端地址，本地调试通常填 ngrok HTTPS 地址。
```

如果使用 `uv` 管理 Python 环境，也可以用下面方式启动后端：

```shell
cd rag_llm_server
uv run python main.py
```

## 安全说明

仓库只提交 `.env.example`，不提交任何真实 `.env`。`.gitignore` 已忽略 `.env` 和各目录下的 `.env` 文件。
上传 GitHub 前请再次确认：

```shell
git check-ignore -v rag_llm_server/.env
```

仓库中的示例配置只保留占位值，不应包含真实 AK/SK/API Key/Token。如果真实密钥已经进入 Git 历史，不要直接公开原仓库历史，应先轮换密钥并清理历史。

## 后续演进方向

后续可以接入真实企业知识库、日志系统、缺陷管理系统和权限体系；也可以将低敏知识放在云端知识库，将客户项目、完整日志和历史缺陷等敏感数据迁移到企业内部 RAG 检索服务。
