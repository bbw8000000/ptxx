---
title: "upvoteclub/upvote-club-mcp-apps"
owner: "upvoteclub"
name: "upvote-club-mcp-apps"
fullName: "upvoteclub/upvote-club-mcp-apps"
description: "MCP Apps with task progress UI for Upvote.club. Part of upvoteclub/upvote-club-mcp-* family — see core repo for all packages."
sourceUrl: "https://github.com/upvoteclub/upvote-club-mcp-apps"
stars: 41
forks: 0
language: "JavaScript"
topics: ["mcp", "model-context-protocol", "upvote-club", "upvote-club-mcp"]
license: "未标注"
homepage: "https://upvote.club/api"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-07-14T09:27:02Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Upvote.club — MCP Apps

Interactive [MCP App](https://claude.com/docs/connectors/building/mcp-apps/getting-started) with an inline **task progress card** for `get_task_status`.

All 6 Public API tools are available; `get_task_status` renders a progress bar UI in Claude.

## Upvote Club MCP packages

| Package | Repository | Use case |
|---------|------------|----------|
| Core | upvote-club-mcp-core | Shared MCP server library (6 tools) |
| Local | upvote-club-mcp-local | Cursor, Claude Code, manual Claude Desktop (`stdio`) |
| MCPB | upvote-club-mcp-mcpb | Single-click Claude Desktop `.mcpb` install |
| Remote | upvote-club-mcp-remote | Claude.ai custom connector (Streamable HTTP) |
| **Apps** | **This repo** — upvote-club-mcp-apps | MCP Apps + inline task progress UI |

## Build & run

```bash
git clone https://github.com/upvoteclub/upvote-club-mcp-apps.git
cd upvote-club-mcp-apps
npm install
npm run build
UPVOTE_API_KEY=upv_... npm start
# → http://localhost:8788/mcp
```

Stdio (Claude Desktop dev config):

```bash
UPVOTE_API_KEY=upv_... npm run start:stdio
```

```json
{
  "mcpServers": {
    "upvote-club-apps": {
      "command": "node",
      "args": ["/ABS/PATH/upvote-club-mcp-apps/main.js", "--stdio"],
      "env": { "UPVOTE_API_KEY": "upv_..." }
    }
  }
}
```

## Test with tunnel

Expose `http://localhost:8788/mcp` via Cloudflare Tunnel and add as Claude.ai custom connector with `X-API-Key` header.

## UI design

Follows [MCP Apps design guidelines](https://claude.com/docs/connectors/building/mcp-apps/design-guidelines): inline card, Claude theme CSS variables, max 2 actions (Refresh).

## Tools (6)

`get_api_reference`, `list_platforms`, `create_task`, `get_task_status`, `delete_task`

Full reference: API_REFERENCE.md

## Related

- Core dependency: @upvote-club/mcp-core
- HTTP-only connector without UI? → upvote-club-mcp-remote
- Claude Desktop bundle? → upvote-club-mcp-mcpb

## Privacy

Connects only to `https://api.upvote.club`. https://upvote.club/privacy-policy
