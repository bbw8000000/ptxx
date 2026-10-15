// Generate dist/robots.txt at build time from SITE_URL / BASE_PATH env vars.
import { writeFileSync } from 'node:fs'

const site = process.env.SITE_URL?.trim() || 'https://zilvd.icu'
const basePath = process.env.BASE_PATH?.trim() || '/'
const normalizedBase = basePath === '/' ? '' : `/${basePath.replace(/^\/+|\/+$/g, '')}`
const sitemapURL = `${site}${normalizedBase}/sitemap-index.xml`

writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL}\n`)
console.log(`[robots] generated ${sitemapURL}`)
