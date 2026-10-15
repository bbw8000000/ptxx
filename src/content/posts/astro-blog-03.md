---
title: "Astro 博客搭建 #3：样式系统与组件设计"
description: "用 Tailwind CSS 打造个人博客的视觉风格 — 设计系统、主题切换、组件拆分实战。"
pubDate: 2026-05-26
heroImage: "/hero/astro-blog-03.png"
category: 技术
tags: ["Astro", "CSS", "前端", "设计"]
---

框架选好了，项目搭好了，现在让它好看起来。

## 为什么用 Tailwind

写 CSS 有很多种方式。我选 Tailwind 的原因很简单：**不用起名字**。

给 class 起名是前端最痛苦的事情之一。`card-wrapper`、`card-container`、`card-box`…… 用 Tailwind 直接写 `class="rounded-xl border p-6"` 就完事了。

而且 Tailwind 的 utility class 是原子化的，不会出现样式覆盖的噩梦。

## 设计系统

先定义设计 token，不要到处写魔法值：

```css
/* src/styles/tokens.css */
:root {
  /* 颜色 */
  --color-surface: oklch(97% 0.01 80);
  --color-text: oklch(20% 0.02 260);
  --color-text-muted: oklch(45% 0.02 260);
  --color-accent: oklch(55% 0.2 25);
  --color-border: oklch(85% 0.01 80);

  /* 暗色主题 */
  --color-dark-surface: oklch(15% 0.01 260);
  --color-dark-text: oklch(90% 0.01 80);
  --color-dark-accent: oklch(65% 0.2 25);

  /* 排版 */
  --text-base: clamp(1rem, 0.92rem + 0.4vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.6vw, 1.35rem);
  --text-2xl: clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem);
  --text-4xl: clamp(2rem, 1.5rem + 2.5vw, 3.5rem);

  /* 间距 */
  --space-section: clamp(3rem, 2rem + 5vw, 8rem);

  /* 动画 */
  --duration-normal: 300ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

在 `tailwind.config.mjs` 里引用这些 token：

```js
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        accent: 'var(--color-accent)',
      },
    },
  },
};
```

## 主题切换

用 CSS 变量 + `class="dark"` 实现：

```js
// 切换主题
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// 初始化（放在 <head> 里，避免闪烁）
(function() {
  const theme = localStorage.getItem('theme') ?? 'dark';
  document.documentElement.classList.toggle('dark', theme === 'dark');
})();
```

关键：初始化脚本要放在 `<head>` 里，用 `<script is:inline>` 避免 Astro 的模块处理。这样页面加载时不会闪一下白色再变暗。

## 组件拆分

Astro 组件是 `.astro` 文件，分两部分：`---` 里是逻辑（JS/TS），下面是模板（HTML）。

我把博客拆成这些组件：

```
components/
├── Header.astro          # 顶部导航
├── Footer.astro          # 页脚
├── PostCard.astro        # 文章卡片（列表页用）
├── TagCloud.astro        # 标签云
├── Comment.astro         # 评论组件
├── BackToTop.astro       # 回到顶部按钮
├── ReadingProgress.astro # 阅读进度条
└── TOC.astro             # 目录导航
```

原则：**一个组件只做一件事**。超过 100 行就该考虑拆分。

### PostCard 示例

```astro
---
interface Props {
  title: string;
  description: string;
  pubDate: Date;
  slug: string;
  tags: string[];
}

const { title, description, pubDate, slug, tags } = Astro.props;
---

<a href={`/blog/${slug}/`} class="group block p-6 rounded-xl border border-border/40 hover:border-accent/40 transition-all">
  <time class="text-sm text-text-muted">{pubDate.toLocaleDateString('zh-CN')}</time>
  <h3 class="mt-2 text-lg font-semibold group-hover:text-accent transition-colors">{title}</h3>
  <p class="mt-1 text-sm text-text-muted line-clamp-2">{description}</p>
  <div class="mt-3 flex gap-2 flex-wrap">
    {tags.map(tag => <span class="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">{tag}</span>)}
  </div>
</a>
```

## 文章排版

Tailwind 有个 `@tailwindcss/typography` 插件，用 `prose` class 给 Markdown 内容自动排版：

```bash
npm install @tailwindcss/typography
```

```astro
<div class="prose prose-lg dark:prose-invert max-w-none">
  <Content />
</div>
```

然后可以覆盖默认样式：

```css
.prose h2 {
  @apply mt-12 mb-4 text-2xl font-bold;
}

.prose code {
  @apply px-1.5 py-0.5 rounded bg-accent/10 text-accent text-sm;
}
```

---

下一篇会讲进阶功能：搜索、评论、RSS、SEO 优化。

> 这是「Astro 博客搭建系列」的第三篇。
