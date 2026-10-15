---
title: "lfzk550/fanzha-ai-proxy"
owner: "lfzk550"
name: "fanzha-ai-proxy"
fullName: "lfzk550/fanzha-ai-proxy"
description: "国家反诈AI API 转 OpenAI 兼容格式反向代理服务 || 仅学习用途"
sourceUrl: "https://github.com/lfzk550/fanzha-ai-proxy"
stars: 112
forks: 150
language: "未知"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-08"
pushedAt: "2026-09-07T08:44:24Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# 🛡️ 国家反诈 AI 反向代理服务 (fanzha-ai-proxy)

将“国家反诈AI”智能助手转换为标准 **OpenAI 兼容 API 接口** (`/v1/chat/completions`) 的高性能反向代理服务。

完美支持流式 (SSE) 输出与非流式响应，可直接无缝接入 **NextChat**、**OneAPI / New API**、**LobeChat**、**Codex CLI** 等主流 AI 客户端及开发框架。

---

## 🌟 项目特性

- ⚡ **标准 OpenAI API**：完全兼容 `/v1/chat/completions` 与 `/v1/models` 规范。
- 🌊 **流式 SSE 响应**：修复并完整支持首包 `role` 下发、增量 delta 传输及 `finish_reason: stop` 结束标识。
- 🗝️ **灵活鉴权管理**：支持从请求头 `Authorization: Bearer ` 动态传参，也支持通过环境变量全局配置。
- 🔄 **自动续期支持**：内置 Access Token + Refresh Token 刷新机制，长效维持会话状态（最长约 90 天免重新登录）。
- 🧩 **多模态与 Prompt 兼容**：自动解析处理复杂的 `messages` 结构及多层数组类型 content。

---

## 🔑 令牌 (Token) 获取教程

> 提示：“国家反诈AI”后端基于 JWT 进行身份验证。代理服务需要 Access Token 访问接口，配置 Refresh Token 可支持自动长效续期。

### 方法一：通过 ADB 提取本地数据库 (推荐 / 最稳定)

应用采用 Uni-App 静态打包架构，登录状态持久化保存在手机应用私有 SQLite 数据库中。

1. **开启调试**：手机开启开发者选项并启用 USB 调试，通过数据线连接电脑（终端运行 `adb devices` 确认设备已连接）。
2. **定位数据库路径**：应用本地 SQLite 数据库位于 `/data/data/uni.app.UNIAD10B08/databases/DCStorage`。
3. **提取数据库文件并查询**：
   ```bash
   # 导出数据库文件到 SD 卡并 pull 到电脑
   adb shell "su -c 'cp /data/data/uni.app.UNIAD10B08/databases/DCStorage /sdcard/DCStorage'"
   adb pull /sdcard/DCStorage ./DCStorage

   # 使用 sqlite3 查询 user 记录
   sqlite3 ./DCStorage "SELECT value FROM DC_AD10B08_storage WHERE key='user';"
   ```
4. **提取字段**：解密/解析返回的 JSON 内容，查找 `accessToken`（Access Token）与 `refreshToken`（Refresh Token）。

---

### 方法二：通过 Chrome Webview 调试 (免 Root)

1. 手机连电脑并开启 USB 调试。
2. 手机打开“国家反诈AI”App 并进入 AI 对话界面。
3. 电脑端打开 Chrome 浏览器，访问地址：
   ```text
   chrome://inspect/#devices
   ```
4. 在页面列表中找到 `uni.app.UNIAD10B08` 对应的 Webview 目标，点击 **inspect**。
5. 在弹出的开发者工具中切换到 **Network (网络)** 标签页。
6. 在 App 中发送任意一条消息，观察抓到的网络请求。
7. 点击请求路径形如 `/api/ai/create_session` 或 `/api/ai/chat` 的接口，在 **Request Headers** 中找到：
   ```text
   Authorization: Bearer eyJhbGciOiJIUzI1...
   ```
8. 复制 `Bearer ` 后面的字符串，即为 Access Token。

---

### 方法三：使用抓包工具 (Fiddler / Charles / Reqable / HTTPCanary)

1. 开启抓包工具并配置目标域名过滤：`xzfzznt.gaj.sh.gov.cn`。
2. 触发 AI 对话，截获 HTTP POST 请求。
3. 复制 Header 中的 `Authorization` 字段。

---

## 🚀 快速启动

### 1. 安装依赖

环境要求：Python 3.9+

```bash
git clone https://github.com/Mai-xiyu/fanzha-ai-proxy.git
cd fanzha-ai-proxy
pip install -r requirements.txt
```

### 2. 配置环境变量

复制环境变量模板：

```bash
cp .env.example .env
```

编辑 `.env` 文件或直接在终端导出环境变量：

**PowerShell (Windows)**:
```powershell
$env:FANZHA_ACCESS_TOKEN="你的Access_Token"
$env:FANZHA_REFRESH_TOKEN="你的Refresh_Token" # 可选
```

**Bash / Zsh (Linux / macOS)**:
```bash
export FANZHA_ACCESS_TOKEN="你的Access_Token"
export FANZHA_REFRESH_TOKEN="你的Refresh_Token" # 可选
```

### 3. 运行服务

```bash
python main.py
```

服务默认运行在 `http://127.0.0.1:8088`。

---

## 💻 客户端调用示例

### cURL

```bash
curl http://127.0.0.1:8088/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 你的Access_Token" \
  -d '{
    "model": "国家反诈AI",
    "messages": [
      {"role": "user", "content": "收到自称公检法的电话要求转账，应该怎么做？"}
    ],
    "stream": true
  }'
```

### Python (OpenAI SDK)

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:8088/v1",
    api_key="你的Access_Token"  # 若已在服务端配置环境变量，此处可填任意非空字符串
)

response = client.chat.completions.create(
    model="国家反诈AI",
    messages=[{"role": "user", "content": "请简要说明常见的电信网络诈骗手段有哪些？"}],
    stream=True
)

for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

---

## 📄 开源协议与声明

- 本项目仅用于技术交流、学术研究与个人学习验证，请勿用于非法用途。
- 本项目与官方应用无任何附属关系。
