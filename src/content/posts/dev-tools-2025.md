---
title: "2025 年我的开发工具箱"
description: "分享我日常使用的开发工具，从终端到编辑器，提升开发效率的实用选择。"
pubDate: 2026-05-19
heroImage: "/hero/dev-tools-2025.png"
category: "工具"
tags: ["工具", "效率", "终端", "VS Code"]
featured: false
---

工欲善其事，必先利其器。分享一下我日常开发中离不开的工具。

## 终端：Warp

Warp 是一个现代化的终端，几个让我离不开的功能：

- **命令块**：每条命令和输出自动分块，不会滚动时迷失
- **AI 命令搜索**：用自然语言描述想要的操作，自动推荐命令
- **共享工作流**：团队可以共享常用命令片段

```bash
# 以前记不住的复杂命令，现在自然语言描述
# "find all markdown files modified in the last 7 days"
find . -name "*.md" -mtime -7
```

如果你用 Windows Terminal，推荐安装 Oh My Posh 美化提示符。

## 编辑器：VS Code + 必装插件

VS Code 依然是最平衡的选择。我的必装插件清单：

| 插件 | 用途 |
|------|------|
| **Cursor** | AI 辅助编码，Tab 补全 |
| **Error Lens** | 内联显示错误，不用看问题面板 |
| **GitLens** | 代码行级 blame，追溯修改历史 |
| **Pretty TypeScript Errors** | 让 TS 错误信息可读 |
| **Tailwind CSS IntelliSense** | Tailwind 类名补全和预览 |

## 包管理：pnpm

从 npm 切到 pnpm 后，磁盘空间省了一半，安装速度快了 3 倍。

```bash
# 安装
npm install -g pnpm

# 使用方式和 npm 完全一样
pnpm install
pnpm add lodash
pnpm run dev
```

pnpm 用硬链接共享依赖，10 个项目用同一个 lodash，只占一份磁盘空间。

## API 测试：Bruno

Postman 越来越臃肿，Bruno 是更好的替代品：

- 请求集合存在本地文件夹，可以用 Git 管理
- 界面简洁，启动快
- 支持环境变量、脚本、断言

```bash
# 安装
brew install bruno  # macOS
# 或者下载安装包 https://www.usebruno.com/
```

## 数据库：TablePlus

轻量级的数据库 GUI，支持 PostgreSQL、MySQL、SQLite、Redis 等。界面干净，查询速度快，比 DBeaver 好看太多。

## 文档：MkDocs + Material

写技术文档用 MkDocs + Material 主题，Markdown 写内容，自动生成漂亮的文档站。

```bash
pip install mkdocs-material
mkdocs new my-docs
mkdocs serve
```

## 图片处理：Squoosh

Google 出品的在线图片压缩工具，浏览器里直接用，不需要装软件。支持 WebP、AVIF 等现代格式转换。

## Chrome 插件

- **Wappalyzer**：一键查看网站技术栈
- **React DevTools**：React 组件调试
- **Lighthouse**：性能审计
- **Dark Reader**：强制暗色模式（保护眼睛）

## 写在最后

工具不在多，在于用熟。与其装 20 个插件，不如把 5 个核心工具用到极致。

> 你的工具箱里有什么好东西？欢迎留言分享。
