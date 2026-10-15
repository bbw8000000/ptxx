---
title: "Astro 博客搭建 #2：项目结构与内容配置"
description: "手把手搭建 Astro 博客 — 目录结构、内容集合、Markdown 配置、路由规则。"
pubDate: 2026-05-26
heroImage: "/hero/astro-blog-02.png"
category: 技术
tags: ["Astro", "博客", "前端", "教程"]
---

上一篇聊了为什么选 Astro。这篇开始动手。

## 创建项目

```bash
npm create astro@latest my-blog
cd my-blog
npm install
```

选模板的时候选 "Blog"，它会给你一个基础的博客结构。但我建议从空项目开始，这样每一块你都清楚。

## 目录结构

我的博客最终长这样：

```
blog/
├── src/
│   ├── content/
│   │   └── posts/          # Markdown 文章
│   ├── layouts/
│   │   ├── BaseLayout.astro  # 全局布局
│   │   └── PostLayout.astro  # 文章布局
│   ├── components/         # 组件
│   ├── pages/              # 路由页面
│   ├── styles/             # 全局样式
│   └── utils/              # 工具函数
├── public/                 # 静态资源（不经过构建处理）
│   ├── hero/               # 文章封面图
│   └── favicon.png
├── astro.config.mjs        # 配置文件
└── package.json
```

重点说几个：

### `src/content/posts/`

这是放文章的地方。每篇文章是一个 Markdown 文件，前面有 frontmatter：

```markdown
---
title: "文章标题"
description: "文章描述"
pubDate: 2026-05-26
category: "技术"
tags: ["Astro", "教程"]
---

正文内容...
```

### `src/content.config.ts`

定义文章的类型约束。这样写错字段名时构建会报错，不会静默失败：

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().default("随笔"),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

### `src/pages/blog/[...slug].astro`

路由文件，把 content 里的文章映射到 URL：

```astro
---
import { getCollection } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<PostLayout {...post.data} slug={post.id}>
  <Content />
</PostLayout>
```

## 关键配置

`astro.config.mjs` 里我踩过坑的几个配置：

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://ekegukeku64-blip.github.io',
  base: '/blog',              // 子路径部署
  trailingSlash: 'always',    // 统一尾部斜杠
  integrations: [
    sitemap(),
    mdx(),
    tailwind(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',  // 代码高亮主题
    },
  },
});
```

- `site`：必须填，用于生成 sitemap 和 canonical URL
- `base`：GitHub Pages 子路径部署时必须
- `trailingSlash`：设成 `'always'` 避免 404

## 部署到 GitHub Pages

用 GitHub Actions 自动部署。在 `.github/workflows/deploy.yml` 里配置：

```yaml
name: Deploy
on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

在仓库 Settings → Pages 里选 "GitHub Actions" 作为 Source 就行。

---

下一篇会讲怎么让博客好看起来：布局设计、样式系统、组件拆分。

> 这是「Astro 博客搭建系列」的第二篇。
