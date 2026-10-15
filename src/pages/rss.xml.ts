import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import type { APIContext } from 'astro'

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', ({ data }) => !data.draft && !data.noindex)
  const site = new URL(import.meta.env.BASE_URL, context.site!)
  return rss({
    title: '盘腿修仙',
    description: '一个关于技术、设计与生活的博客',
    site,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `${import.meta.env.BASE_URL}blog/${post.id}/`,
      })),
    stylesheet: `${import.meta.env.BASE_URL}rss-style.xsl`,
    customData: '<language>zh-CN</language>',
  })
}
