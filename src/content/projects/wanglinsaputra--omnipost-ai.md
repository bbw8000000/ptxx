---
title: "wanglinsaputra/OmniPost-AI"
owner: "wanglinsaputra"
name: "OmniPost-AI"
fullName: "wanglinsaputra/OmniPost-AI"
description: "AI-powered Chrome extension for generating and publishing posts to Facebook, Threads, and X using ChatGPT, CLAUDE and Gemini."
sourceUrl: "https://github.com/wanglinsaputra/OmniPost-AI"
stars: 51
forks: 27
language: "TypeScript"
topics: ["ai", "automation", "chatgpt", "chrome-extension", "gemini", "typescript", "vite"]
license: "MIT"
homepage: "https://s.id/x1w4R"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-08-25T20:43:43Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# OmniPost AI


  


Chrome extension for multi-platform auto-posting. AI-powered (ChatGPT / Gemini) content generation with one-click publish to Facebook, Threads, and X (Twitter).

## Features

- **AI Content Generation** -- pick ChatGPT, Claude, or Gemini, describe your topic, AI writes the post
- **Multi-Platform** -- post to Facebook, Threads, and X (Twitter) from a single popup
- **Image Upload** -- attach one image to your post; it is uploaded automatically along with the text on Threads, Facebook, and X
- **Thread Scheduling** -- set date and time for Threads posts (uses chrome.alarms)
- **Multi-Paragraph Threads** -- configure 1-5 paragraphs for Threads
- **No API Keys Required** -- works with your existing browser login sessions

### Extension

```
extension/
  manifest.json           Chrome extension manifest (MV3)
  vite.config.ts          Vite build config with CRXJS
  src/
    background/           Service worker (background.ts)
    content_scripts/      Content scripts for AI and social platforms
      platforms/          Per-platform posting logic (facebook.ts, threads.ts, x.ts)
    popup/                Extension popup UI (index.html, popup.ts, style.css)
    utils/                Shared types, selectors, Supabase client
```

### Extension

```bash
cd extension
npm install
npm run dev       # watch mode with hot reload
npm run build     # production build -> dist/
```

## Build Output

Extension build produces a `dist/` folder ready for Chrome loading:
1. Open Chrome -> chrome://extensions
2. Enable Developer mode
3. Load unpacked -> select `extension/dist/`

## AI Models

| Model   | Temp/Incognito Mode |
|---------|---------------------|
| ChatGPT | `?temporary-chat=true` |
| Claude  | `?incognito=true` |
| Gemini  | Fresh session |

## Platform Support

| Platform  | Post Type        | Image | Schedule | Paragraph Count |
|-----------|------------------|-------|----------|-----------------|
| Threads   | Multi-paragraph  | Yes (first post) | Yes      | 1-5             |
| Facebook  | Single post      | Yes   | No       | N/A             |
| X (Twitter) | Single tweet   | Yes   | No       | N/A (280 chars) |

## Links

- [Documentation](https://omnipost.codeworks.web.id/)
- GitHub

## Licensi

MIT
