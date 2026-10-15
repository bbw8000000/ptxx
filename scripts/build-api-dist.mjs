// Cloudflare Pages needs a directory to deploy. This project exists only to
// serve the auth + comments API, so the static side is a stub plus a
// _routes.json that keeps Functions from being invoked for anything except
// /api/*.

import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const outDir = resolve(process.cwd(), '.pages-dist')

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

writeFileSync(
  resolve(outDir, 'index.html'),
  '<!doctype html><meta charset="utf-8"><title>blog-api</title>\n<p>blog-api serves /api/* only.</p>\n',
)

writeFileSync(
  resolve(outDir, '_routes.json'),
  `${JSON.stringify({ version: 1, include: ['/api/*'], exclude: [] }, null, 2)}\n`,
)

console.log(`build-api-dist: wrote ${outDir}`)
