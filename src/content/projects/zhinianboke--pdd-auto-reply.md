---
title: "zhinianboke/pdd-auto-reply"
owner: "zhinianboke"
name: "pdd-auto-reply"
fullName: "zhinianboke/pdd-auto-reply"
description: "面向拼多多多店铺商家的客服消息自动化系统。基于拼多多商家后台实时收发客服消息，结合关键词规则、AI 智能回复与知识库工具调用，实现 7×24 小时自动应答、转人工、风控与营业时间管控。"
sourceUrl: "https://github.com/zhinianboke/pdd-auto-reply"
stars: 127
forks: 53
language: "Python"
topics: []
license: "AGPL-3.0"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-11T09:26:33Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# 拼多多自动回复系统（pdd-auto-reply）

面向拼多多多店铺商家的客服消息自动化系统。基于拼多多商家后台实时收发客服消息，结合关键词规则、AI 智能回复与知识库工具调用，实现 7×24 小时自动应答、转人工、风控与营业时间管控。

系统采用左侧导航 + 右侧内容的管理界面布局，蓝白主色调并支持暗黑模式，顶部面包屑导航、右上角用户菜单、菜单显隐与移动端响应式适配。

---

## 交流群

| 微信群 | QQ群 | 微信公众号 | Telegram | 赞赏支持 |
|:---:|:---:|:---:|:---:|:---:|
| *图片：微信群* | *图片：QQ群* | *图片：微信公众号* | *图片：Telegram* | *图片：赞赏支持* |
| 扫码加入微信交流群 | 扫码加入QQ交流群 | 关注公众号发送"最新源码"获取最新代码 | 扫码加入Telegram群 | 如果觉得好用，请作者喝杯咖啡 |

如群二维码过期，请关注公众号获取最新群链接。

## 功能特性

- **账号与店铺管理**：多账号、多店铺集中管理；支持账号密码登录（Playwright 浏览器，必要时人工过验证码/滑块）与手动粘贴 Cookie 导入两种接入方式；Cookie 凭据加密存储与自动刷新。
- **消息收发与自动回复**：维护与拼多多商家后台的长连接（自动重连 + 心跳），消息入队按序消费；命中关键词规则、商品专属回复或默认回复兜底。
- **AI 智能回复**：接入 LLM（OpenAI 兼容），通过工具调用检索商品知识库与客服知识库生成回复。
- **知识库**：商品知识库与客服知识库（售后政策、物流、退换货、常见问答等），支持中文分词检索。
- **商品管理**：商品列表查询与商品卡片发送。
- **会话转移 / 转人工**：将客户会话从自动回复转接给指定人工客服。
- **风控与消息过滤**：回复频率限制、风险消息识别、黑名单与消息过滤规则。
- **营业时间控制**：按店铺维度配置自动回复生效时间区间。
- **通知渠道**：系统事件向商家推送（邮件 / Webhook 等）。
- **日志**：消息日志、风控日志、系统日志，支持后端分页查询与定时清理。
- **用户与权限**：多用户、多角色、统一权限模块，菜单按授权渲染。
- **在线聊天**：管理端实时查看会话并人工介入。
- **数据看板**：核心指标统计与数据分析。

---

## 技术栈

**后端（Python 3.11+）**
- FastAPI + Uvicorn（ASGI）
- SQLAlchemy + PyMySQL（MySQL，参数化查询）
- websockets（拼多多长连接）
- Playwright（账号密码登录）
- OpenAI 兼容客户端 + jieba（AI 回复与知识库检索）
- PyJWT + passlib[bcrypt]（鉴权与密码哈希）
- pytest + Hypothesis（单元测试与属性测试）

**前端**
- Vue 3 + Vite
- Vue Router + Pinia
- Tailwind CSS + lucide-vue-next
- axios

**基础设施**
- MySQL 8.0（业务数据，全链路北京时间 UTC+8）
- Redis 7（缓存 / 分布式锁）

---

## 项目结构

```
pdd-auto-reply/
├── common/              # 公共库（被各服务通过 sys.path 共享，无独立入口）
│   ├── core/            #   配置加载
│   ├── db/              #   数据库会话、仓储、重试、初始化自检
│   ├── models/          #   数据模型（用户/店铺/回复/知识/任务/日志/设置等）
│   ├── schemas/         #   统一响应体与输入清洗
│   ├── services/        #   公共服务（数据字典、AI 供应商、知识库、种子数据等）
│   └── utils/           #   加解密、分页、安全、时间工具
├── backend/             # HTTP API 服务（默认端口 8089）
│   ├── app/api/routes/  #   REST 路由（auth/users/roles/shops/keywords/...）
│   ├── app/services/    #   业务服务
│   ├── app/core/        #   核心装配
│   └── main.py          #   服务入口（最小入口桩）
├── websocket/           # 长连接服务（默认端口 8090）
│   ├── channel_pdd/     #   拼多多通道：连接管理、消息队列、登录、转人工
│   ├── engine/          #   回复引擎：关键词匹配、消息过滤、营业时间、风控
│   ├── agent/           #   AI 回复引擎、LLM 客户端、工具调用
│   ├── login/           #   Playwright 登录、Cookie 导入
│   ├── routes/          #   连接/登录/消息/商品/Cookie 接口
│   └── main.py
├── scheduler/           # 定时任务服务（默认端口 8091）
│   ├── tasks/           #   调度服务、任务执行器、日志清理
│   └── main.py
├── frontend/            # Vue 3 前端
│   ├── src/pages/       #   页面（看板/店铺管理/关键词/知识库/日志/在线聊天等）
│   ├── src/api/         #   接口封装
│   ├── src/router/      #   路由
│   └── src/store/       #   Pinia 状态
└── .env.example         # 环境变量模板
```

后端按服务拆分，三个服务（backend / websocket / scheduler）均以各自目录下的 `main.py` 为统一入口，公共逻辑收敛至 `common` 库经 `sys.path` 共享复用。

---

## 环境要求

- Python 3.11+
- Node.js 18+（前端构建）
- MySQL 8.0
- Redis 7

---

## 本地开发

### 1. 准备环境变量

复制模板并按需修改（数据库、Redis、密钥、端口等）：

```bash
cp .env.example .env
```

> 注意：`.env` 含密钥与密码，已在 `.gitignore` 中忽略，禁止提交。生产环境务必将 `JWT_SECRET_KEY`、`DATA_ENCRYPT_KEY`、`INTERNAL_SERVICE_TOKEN` 修改为强随机值。

主要配置项说明：

| 变量 | 说明 |
| --- | --- |
| `MYSQL_*` | MySQL 主机、端口、库名、账号、密码 |
| `REDIS_*` | Redis 主机、端口、密码、库号 |
| `BACKEND_WEB_PORT` / `WEBSOCKET_PORT` / `SCHEDULER_PORT` | 各服务监听端口（默认 8089 / 8090 / 8091） |
| `*_SERVICE_URL` | 服务间通信地址（禁止写死 localhost，经环境变量管理） |
| `JWT_SECRET_KEY` / `DATA_ENCRYPT_KEY` / `INTERNAL_SERVICE_TOKEN` | 安全密钥（生产务必修改） |
| `DEFAULT_ADMIN_USERNAME` / `DEFAULT_ADMIN_PASSWORD` | 初始超级管理员（仅数据库无用户时首次自检创建） |
| `BROWSER_HEADLESS` / `MAX_CAPTCHA_CONCURRENT` | Playwright 登录无头开关与验证码并发数 |
| `PLAYWRIGHT_USER_DATA_DIR` | 浏览器登录态持久化目录 |
| `LOG_LEVEL` | 日志级别 |

### 2. 启动后端服务

后端由三个服务组成，需分别启动。各服务安装依赖后运行其 `main.py`：

```bash
# 后端 API 服务（端口 8089）
cd backend
pip install -e .
python main.py

# WebSocket 长连接服务（端口 8090）
cd websocket
pip install -e .
playwright install chromium   # 首次需安装浏览器
python main.py

# 定时任务服务（端口 8091）
cd scheduler
pip install -e .
python main.py
```

> 各服务通过 `sys.path` 共享 `common` 公共库，无需单独打包安装。首次启动后端会自动建表、补字段、补数据字典并创建初始管理员（数据库无用户时）。

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev        # 开发模式（默认 host 0.0.0.0）
```

构建生产产物：

```bash
npm run build
```

---

## 测试

各服务均提供 pytest 测试（含基于 Hypothesis 的属性测试）：

```bash
cd backend && pytest        # 后端 API 测试
cd websocket && pytest      # 长连接/引擎测试
cd scheduler && pytest      # 调度任务测试
cd common && pytest         # 公共库测试
```

---

## 许可证

本项目采用 GNU Affero General Public License v3.0 (AGPL-3.0) 开源协议。

这意味着：你可以自由使用、修改和分发本项目，但若你修改本项目并通过网络向用户提供服务（如部署为在线服务），则必须向这些用户公开你修改后的完整源代码。详见 LICENSE 文件。
