// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import { unified } from '@astrojs/markdown-remark'
import sitemap from '@astrojs/sitemap'
import remarkInternalProjectLinks from './scripts/remark-internal-project-links.mjs'
import rehypeDemoteProjectHeadings from './scripts/rehype-demote-project-headings.mjs'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const site = process.env.SITE_URL?.trim() || 'https://zilvd.icu'
const requestedBase = process.env.BASE_PATH?.trim() || '/'
const base = requestedBase === '/' ? '/' : `/${requestedBase.replace(/^\/+|\/+$/g, '')}`
const projectSnapshotDirectory = resolve(process.cwd(), 'src', 'content', 'projects')
const mirroredProjects = existsSync(projectSnapshotDirectory)
  ? readdirSync(projectSnapshotDirectory)
      .filter((filename) => filename.endsWith('.md'))
      .map(
        (filename) =>
          readFileSync(resolve(projectSnapshotDirectory, filename), 'utf8').match(
            /^fullName:\s+"([^"]+)"$/m,
          )?.[1],
      )
      .filter(Boolean)
  : []
const publicProjectPaths = new Set(
  mirroredProjects.map((fullName) => {
    const [owner, repo] = String(fullName).split('/')
    return `${base === '/' ? '' : base}/projects/${owner}/${repo}/`
  }),
)

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname
        const isProjectDetail = /\/projects\/[^/]+\/[^/]+\/$/.test(pathname)
        return (
          !pathname.endsWith('/admin/') &&
          !pathname.endsWith('/bookmarks/') &&
          !pathname.endsWith('/risk-watch/') &&
          !pathname.includes('/blog/risk-daily-') &&
          (!isProjectDetail || publicProjectPaths.has(pathname))
        )
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Vite 默认把小于 4 KB 的资源内联成 base64 data URI。对字体来说这是纯浪费：
      // base64 本身是已压缩数据，gzip 几乎压不动，于是那些「这个站几乎用不到」的
      // 小分片（西里尔扩展、越南语、旗帜 emoji、生僻符号…）会被塞进**每个页面都要
      // 下载的阻塞 CSS**里。实测 5 个分片就让 CSS 多了 28.7 KB、gzip 后仍多 22.8 KB。
      //
      // 改成字体一律不内联：CSS 直接瘦下来，这些分片变成独立文件，而 @font-face 的
      // unicode-range 保证它们只在页面真的出现对应字符时才被请求。
      // 返回 undefined = 其它资源仍走 Vite 默认策略。
      assetsInlineLimit: (filePath) =>
        /\.(?:woff2?|ttf|otf|eot)$/i.test(filePath) ? false : undefined,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [[remarkInternalProjectLinks, { base }]],
      // 项目快照的 README 自带一级标题，会把页面变成两个 <h1>，这里整体降一级。
      rehypePlugins: [rehypeDemoteProjectHeadings],
    }),
    shikiConfig: {
      theme: 'one-dark-pro',
      wrap: true,
    },
  },
})
