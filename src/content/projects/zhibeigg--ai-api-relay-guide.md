---
title: "zhibeigg/ai-api-relay-guide"
owner: "zhibeigg"
name: "ai-api-relay-guide"
fullName: "zhibeigg/ai-api-relay-guide"
description: "AI 中转站推荐与 PokeAPI 评测：GPT 0.03×、Claude 0.2×"
sourceUrl: "https://github.com/zhibeigg/ai-api-relay-guide"
stars: 70
forks: 0
language: "CSS"
topics: ["ai-api", "api-relay", "github-pages", "pokeapi"]
license: "MIT"
homepage: "https://zhibeigg.github.io/ai-api-relay-guide/"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-07-26T17:33:38Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# AI 中转站推荐：PokeAPI 评测


  


> **GPT 重点线路低至 0.03×｜Claude 低至 0.2×｜Claude、GPT、Gemini、Grok 多模型覆盖**

这是一个面向开发者、初创团队和企业用户的 AI API 中转站公开推荐项目。仓库重点整理并推荐 **PokeAPI**，从价格、模型覆盖、协议兼容、稳定运维、客服响应和企业合规等角度说明它适合什么场景。

- 在线评测页：
- PokeAPI 官网：
- 接入文档：

## 一句话结论

PokeAPI 适合希望降低 GPT、Claude 等主流模型调用成本，同时重视模型真实性、账单透明度、在线率监控和持续技术支持的开发者与团队。

## 重点倍率

| 模型线路 | 标称倍率 | 典型用途 |
|---|---:|---|
| GPT / OpenAI 兼容线路 | **0.03× 官方原价** | Codex、Responses、Chat Completions、图片与 Agent |
| Claude / Anthropic 线路 | **0.2× 官方原价** | Claude Code、Messages API、长上下文与编程 Agent |

> 具体模型、分组、活动、缓存计费和实时价格，以 PokeAPI 控制台实际展示为准。

## 为什么推荐 PokeAPI

### 多模型覆盖

覆盖 Claude、GPT、Gemini、Grok 等主流模型，一套控制台即可管理不同协议和模型线路。

### 透明计费

所有费用按官方原价倍率折算，调用后可查看账单明细，避免含糊套餐和不可解释的余额消耗。

### 稳定与可观测

在线率持续监控，节点经过筛选，优先保障低延迟和高可用。运维团队提供 7×24 小时响应，持续处理账号、线路和模型适配问题。

### 社群与客服

社群活跃，客服支持快速接入。个人开发者、初创团队和企业用户都可以获得对应的配置与迁移帮助。

### 企业合规

支持透明采购与合规发票需求。具体票种、抬头及开票规则以平台当期说明为准。

## 快速接入

### OpenAI / Codex

```text
https://www.poke2api.com/v1
```

### Claude / Anthropic / Gemini

```text
https://www.poke2api.com
```

### Grok / xAI

Grok 使用 OpenAI 兼容地址，并使用准确模型名 `grok-4.5`：

```bash
curl https://www.poke2api.com/v1/chat/completions \
  -H "Authorization: Bearer $POKEAPI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-4.5",
    "messages": [{"role": "user", "content": "你好，请简短介绍自己。"}],
    "stream": false
  }'
```

如果 Grok 返回 `[PokeAPI] 模型请求格式无效`（HTTP 400），这通常表示上游拒绝了请求结构，而非模型未支持。请依次核对：

1. 模型名必须是 `grok-4.5`，不能写成 `grok4.5`；
2. 先用 `/v1/chat/completions` 与标准 `messages` 结构验证纯文本请求；
3. 使用工具时，`tools` 必须为标准 OpenAI function 定义，且不要单独发送没有对应工具的 `tool_choice`；
4. 若请求来自 Responses/Codex 客户端，先移除其专用的命名空间、图片生成或自定义工具字段以定位问题；
5. 若仍失败，请在工单中附上响应头 `X-PokeAPI-Request-ID`，便于定位被脱敏的上游 400 原因。

请先在 PokeAPI 控制台创建对应分组的 API Key，再参考[官方接入文档](https://docs.poke2api.com)配置 Codex、Claude Code、Gemini CLI、OpenCode、Cursor、Cline 或其他兼容客户端。

## 服务承诺

- **不掺水**：真实模型与清晰映射，不用低规格模型冒充目标模型；
- **不限速**：平台侧不主动压低调用速度，实际吞吐仍受上游、模型和分组规则影响；
- **不跑路**：以长期主义维护账号池、线路、文档、客服和开发者社群；
- **内容不留存**：不持久化保存提示词与回复正文，仅处理账户、路由、计费和安全所需数据；
- **账单透明**：按官方原价倍率折算，费用明细可核对；
- **合规开票**：支持企业采购与合规发票需求。

## 适合谁

- 需要低成本使用 GPT、Claude 等模型的个人开发者；
- 正在快速验证多模型产品的初创团队；
- 需要稳定接入、透明采购与合规发票的企业用户；
- 使用 Codex、Claude Code、OpenCode、Cursor、Cline、Gemini CLI 等工具的 AI 编程用户。

## 本仓库

该仓库采用无框架静态 HTML、CSS 和 JavaScript 构建，通过 GitHub Pages 自动部署。页面不接入统计、广告或第三方追踪。

本页面为公开信息整理与推荐内容，不代表 OpenAI、Anthropic、Google 或 xAI 官方背书。费率和服务规则可能调整，请以 PokeAPI 官网实时信息与服务条款为准。

## License

MIT
