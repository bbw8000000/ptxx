---
title: "Astro 5 到 6：内容层、服务端岛屿与更多"
description: "梳理 Astro 5 到 6 的核心更新，包括 Content Layer、Server Islands、SVG 组件等重要特性。"
pubDate: 2026-05-23
heroImage: "/hero/astro-5-features.png"
category: "技术"
tags: ["Astro", "前端", "框架", "性能"]
featured: true
---

Astro 从 5.0 到 6.x 带来了大量更新。这篇文章梳理最值得关注的核心特性。

## Content Layer 内容层

这是 Astro 5 最重要的更新。Content Layer 提供了统一的、类型安全的内容管理 API，让你从**任意数据源**加载内容。

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
  }),
});
```

以前只能用 `type: 'content'` 加载本地 Markdown，现在可以通过 loader 接入 REST API、CMS、数据库等任何数据源。性能方面：Markdown 构建速度提升最高 5 倍，内存占用降低 25-50%。

## Server Islands 服务端岛屿

将岛屿架构延伸到服务端。同一页面中可以混合**静态缓存**和**动态渲染**的内容。

```astro
---
// 用户头像 — 动态部分
const user = await getUser(Astro.cookies.get('userId'));
---

<html>
  <body>
    <h1>欢迎回来</h1>
    <!-- 静态页面 + 动态岛屿 -->
    <Avatar server:defer>
      <div slot="fallback">加载中...</div>
      <img src={user.avatar} />
    </Avatar>
  </body>
</html>
```

典型场景：用户头像、购物车、个性化推荐。每个岛屿独立加载，支持缓存头控制，props 自动加密保障隐私。

## 简化预渲染

Astro 5 取消了 `hybrid` 输出模式，将其合并到默认的 `static` 模式中。只需添加适配器并设置 `prerender = false`：

```typescript
// astro.config.mjs
import node from '@astrojs/node';

export default defineConfig({
  output: 'static', // 默认模式
  adapter: node(),
});
```

```astro
---
// src/pages/api/data.ts
export const prerender = false; // 这个页面按需渲染
---
```

## astro:env 类型安全环境变量

新增 `astro:env` 模块，区分客户端/服务端变量，启动时自动校验：

```typescript
import { DATABASE_URL, PUBLIC_API_KEY } from 'astro:env';

// DATABASE_URL — 服务端密钥，启动时校验是否存在
// PUBLIC_API_KEY — 客户端可用，自动注入到前端
```

支持 string/number/boolean/enum 类型，启动时校验必填项，避免部署后才发现缺少环境变量。

## SVG 组件

直接导入 `.png` 文件作为组件使用：

```astro
---
import Logo from '../assets/logo.png';
---

<Logo class="w-12 h-12" fill="currentColor" />
```

SVG 变成真正的 Astro 组件，可以传 props、控制属性，不再需要手动复制 SVG 代码。

## 其他亮点

- **响应式图片**：自动生成 srcset 和 sizes，适配多屏幕
- **图片裁剪**：支持 fit 和 position 属性
- **CSP 支持**：原生内容安全策略头配置
- **Vite 6**：搭载全新 Environment API
- **高级路由**（6.x 实验性）：通过 Hono 中间件自定义请求管线

## 升级建议

如果你还在用 Astro 4.x：

1. 先升级到 5.x，迁移 Content Layer（改动最大）
2. 检查 `type: 'content'` 是否改为 `glob()` loader
3. 更新 `src/content/config.ts` 为 `src/content.config.ts`（新路径）
4. 测试构建和运行，确认无误后再考虑 6.x

> Astro 的迭代速度很快，但核心理念没变：**内容优先，零 JavaScript 默认**。这是它最大的竞争力。
