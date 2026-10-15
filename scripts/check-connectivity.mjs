// 给用户自测用的连通性检查（保存下来，之后遇到「网页打不开」可直接跑）
//
//   node scripts/check-connectivity.mjs
//
// 逐层判断到底是「站点挂了」还是「本机到 github.io 不通」，避免两边互相猜。
const targets = [
  ['站点首页', 'https://ekegukeku64-blip.github.io/blog/'],
  ['报告里那一页', 'https://ekegukeku64-blip.github.io/blog/projects/odysseus-dev/odysseus/'],
  ['离线页', 'https://ekegukeku64-blip.github.io/blog/offline.html'],
  ['Service Worker', 'https://ekegukeku64-blip.github.io/blog/sw.js'],
  ['评论/翻译 API', 'https://blog-api-28t.pages.dev/api/translate'],
  ['GitHub API（对照）', 'https://api.github.com/zen'],
]

let failed = 0
for (const [label, url] of targets) {
  const started = Date.now()
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) })
    const body = await response.text()
    console.log(
      `  ✓ ${label.padEnd(18)} ${response.status}  ${Date.now() - started}ms  ${Math.round(body.length / 1024)}KB`,
    )
  } catch (error) {
    failed += 1
    console.log(`  ✗ ${label.padEnd(18)} ${error.name}: ${error.message}`)
  }
}

console.log(
  failed === 0
    ? '\n结论：站点与 API 都可达。浏览器打不开通常是本机网络/DNS/代理问题，或旧的 Service Worker 缓存。'
    : `\n结论：${failed} 个目标不可达。若只有 github.io 不通而 API 通，是本机到 GitHub Pages 的线路问题。`,
)
