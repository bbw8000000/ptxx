---
title: "openai/mcp-extensions"
owner: "openai"
name: "mcp-extensions"
fullName: "openai/mcp-extensions"
description: "Build plugins that feel like native, first-class features of ChatGPT."
sourceUrl: "https://github.com/openai/mcp-extensions"
stars: 642
forks: 32
language: "TypeScript"
topics: []
license: "Apache-2.0"
defaultBranch: "main"
snapshotDate: "2026-10-02"
pushedAt: "2026-09-30T23:18:08Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# OpenAI MCP Extensions

OpenAI MCP Extensions adds ChatGPT-specific capabilities to MCP so developers can build plugins that feel like native, first-class features.

## Showcase

All examples below use the Bits & Bolts plugin, which you can try by installing the plugin.

### Sidebar entrypoints

Allow users to access your app from the sidebar.

*图片：Opening an MCP App from the sidebar*

### File extension handlers

Render custom file viewers when users open a supported file type.

*图片：Opening a CAD file in a custom file viewer*

### Composer mentions

Let users search your plugin’s resources from the composer and add references to a message.

*图片：Searching for a CAD part with composer mentions*

### Extended forms

Let users select a CAD part using thumbnail choices.

*图片：Selecting a CAD part in a Bits & Bolts form*

## Get started

### 0. Try it out

Install the Bits & Bolts Remote plugin:

1. Install [Bits & Bolts Remote from the plugin directory](https://chatgpt.com/plugins/plugin_asdk_app_6abadab6e7d881919e7491d52c7846e8).
2. Select **Bits & Bolts Remote** in the sidebar to open the **Parts Library**.

   *图片：Bits & Bolts Remote selected in the sidebar with the Parts Library open*

### 1. Create a plugin

Read the [plugin documentation](https://developers.openai.com/codex/build-plugins) about how to create a plugin. Once you have a plugin…

### 2. Add the SDKs to your MCP server

Follow the SDK installation instructions for the current source:

- TypeScript: `@openai/mcp-extensions` for MCP servers and Apps.
- Python: `openai-mcp-extensions` for MCP servers.

### 3. Explore supported extensions

Read the spec to learn more about supported extensions.

## License

This project is licensed under the Apache License 2.0.
