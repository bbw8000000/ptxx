---
title: "Web 性能优化实践"
description: "分享一些实用的 Web 性能优化技巧，帮助你的网站加载更快。"
pubDate: 2026-05-18
heroImage: "/hero/web-performance.png"
category: "技术"
tags: ["性能", "Web", "前端", "优化"]
---

网站性能直接影响用户体验和 SEO 排名。这篇文章分享一些经过验证的优化技巧。

## Core Web Vitals

Google 的 Core Web Vitals 是衡量用户体验的三个核心指标：

| 指标 | 含义 | 目标 |
|------|------|------|
| **LCP** | 最大内容绘制 | < 2.5s |
| **INP** | 交互到下一次绘制 | < 200ms |
| **CLS** | 累积布局偏移 | < 0.1 |

## 图片优化

图片通常是页面最大的资源：

```html
<!-- 使用现代格式 + 响应式 -->
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="描述" width="800" height="600" loading="lazy" />
</picture>
```

关键点：
- 始终指定 `width` 和 `height`，避免布局偏移
- 首屏图片用 `loading="eager"`，其余用 `loading="lazy"`
- 优先使用 AVIF > WebP > JPEG

## 字体优化

```css
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* 避免 FOIT */
}
```

- 最多使用 2 种字体
- 使用 `font-display: swap` 避免文字不可见
- 预加载关键字体

## JavaScript 优化

```javascript
// 动态导入 — 只在需要时加载
const module = await import('./heavy-module.js');

// 代码分割
const Component = React.lazy(() => import('./Component'));
```

- 删除未使用的代码（tree shaking）
- 延迟加载非关键脚本
- 使用 `defer` 或 `async`

## 缓存策略

```
# 静态资源 — 长期缓存
Cache-Control: public, max-age=31536000, immutable

# HTML — 协商缓存
Cache-Control: no-cache
```

## 总结

性能优化不是一次性工作，而是一个持续的过程。从测量开始，找到瓶颈，然后有针对性地优化。

记住：**不要过早优化，但也不要忽视明显的性能问题。**
