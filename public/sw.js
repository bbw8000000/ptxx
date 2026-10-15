/* 盘腿修仙 Service Worker（保守缓存策略）
 * 缓存版本：仅在缓存策略本身变更时递增；新版本激活后清理旧缓存。
 * 注意：不要按提交号自动递增。资源 URL（/_astro/*）已带内容哈希，
 * 一旦每次部署都换缓存名，activate 会把所有哈希资源一并清掉，
 * 返回访客就得重新下载全部资源——那是倒退，不是优化。
 * - 页面 / HTML：network-first（网络优先，网络失败再回退缓存）
 * - /_astro/* 与 /pagefind/* 静态资源：cache-first（缓存优先）
 * - 跨域请求（自建评论 API、外部资源）：不进入 Service Worker 缓存
 *
 * 每个分支都必须 resolve 出一个**真响应**：
 * respondWith(undefined) 会让浏览器抛 TypeError，页面直接显示 ERR_FAILED。
 * 之前页面分支写成 `cached || caches.match('./index.html')`，在网络失败且缓存未命中时
 * 正好解析成 undefined —— 用户遇到过一次「无法访问此页面 / ERR_FAILED」就是这个。
 * 现在统一用离线页兜底，并且取不到时再兜一层最小 HTML。
 */
const CACHE = 'blog-v2'

// 缓存条目上限。此前没有任何淘汰机制：访问过的页面与资源会一直留在缓存里，
// 长期使用会在移动端累积出可观占用（站点有 900+ 页面）。
const MAX_CACHE_ENTRIES = 400
// 低频修剪：每写入这么多次才检查一次，避免每次请求都遍历 keys()。
const TRIM_EVERY_WRITES = 40
let writesSinceTrim = 0

// 断网时给访客看的页面。构建时随 public/ 一起发布，这里预缓存一份。
const OFFLINE_URL = new URL('offline.html', self.location.href).href

self.addEventListener('install', () => {
  // 预缓存离线页，否则断网时它自己都取不到
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => caches.open(CACHE))
      .then((cache) => cache.add(new Request(OFFLINE_URL, { cache: 'reload' })))
      .catch(() => {})
      .then(() => self.clients.claim()),
  )
})

// 只缓存成功的 GET 响应（2xx），避免把错误页写进缓存。
// 也要排除重定向：GitHub Pages 会把 /blog/projects/a/b 302 到带斜杠的地址，
// 把 302 存下来会让用户反复被送到旧地址。
function shouldCache(response) {
  return Boolean(response) && response.ok && !response.redirected
}

async function putAndMaybeTrim(request, response) {
  const cache = await caches.open(CACHE)
  try {
    await cache.put(request, response)
  } catch {
    // 响应体已被消费或存储配额不足：缓存失败不该影响这次请求
    return
  }

  writesSinceTrim += 1
  if (writesSinceTrim < TRIM_EVERY_WRITES) return
  writesSinceTrim = 0

  const keys = await cache.keys()
  if (keys.length <= MAX_CACHE_ENTRIES) return
  // Cache.keys() 按插入顺序返回，从最旧的开始裁掉多余的条目。
  const excess = keys.length - MAX_CACHE_ENTRIES
  await Promise.all(keys.slice(0, excess).map((key) => cache.delete(key)))
}

/** 断网且没有缓存副本时的最后兜底。 */
async function offlineResponse(request) {
  try {
    const cached = await caches.match(OFFLINE_URL)
    if (cached) return cached
  } catch {
    // 缓存不可用，往下走最小兜底
  }
  const target = encodeURIComponent(request.url)
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>暂时连不上</title>` +
      `<body style="font-family:system-ui;padding:2rem;line-height:1.8">` +
      `<h1>暂时连不上这个页面</h1>` +
      `<p>浏览器打不开 <code>${target}</code>，本地也没有缓存副本。</p>` +
      `<p>检查网络后重新加载即可。</p></body>`,
    {
      status: 503,
      statusText: 'Offline',
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    },
  )
}

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  // 只处理同源请求；自建评论 API 与其他外部资源都是跨域，直接跳过、不缓存
  if (url.origin !== self.location.origin) return

  const isAsset = url.pathname.includes('/_astro/') || url.pathname.includes('/pagefind/')

  if (isAsset) {
    // 静态资源：缓存优先（快）。URL 带内容哈希，所以不会命中过期内容。
    event.respondWith(
      caches
        .match(request)
        .then((cached) => {
          if (cached) return cached
          return fetch(request).then((res) => {
            if (shouldCache(res)) {
              event.waitUntil(putAndMaybeTrim(request, res.clone()))
            }
            return res
          })
        })
        // 断网时曾经直接抛出，现在给出可用的兜底（503 而不是 TypeError）
        .catch(() => offlineResponse(request)),
    )
    return
  }

  // 页面：网络优先（始终最新），失败时依次回退「同页缓存」→「离线页」。
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (shouldCache(res)) {
          event.waitUntil(putAndMaybeTrim(request, res.clone()))
        }
        return res
      })
      .catch(async () => {
        const cached = await caches.match(request)
        if (cached) return cached
        return offlineResponse(request)
      }),
  )
})
