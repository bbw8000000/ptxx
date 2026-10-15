import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

// public/sw.js 是唯一的离线兜底，但它在浏览器里跑、平时没人测。这里用一个最小的
// Service Worker 环境把它加载起来，直接调用它的 fetch 处理器，检查**返回值是不是一个
// 真响应**。
//
// 为什么必须测这一条：respondWith(undefined) 会让浏览器抛 TypeError，页面直接变成
// ERR_FAILED。用户已经遇到过一次「无法访问此页面 / ERR_FAILED」，而代码里
// `cached || caches.match('./index.html')` 恰好会在网络失败 + 两个缓存都未命中时
// 解析成 undefined。

const SOURCE = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8')

/** 搭一个最小可用的 SW 全局环境，返回 handlers 与可控的缓存/网络桩。 */
function createWorker({ cached = new Map(), network } = {}) {
  const listeners = new Map()
  const putCalls = []

  const cache = {
    put: async (request, response) => {
      putCalls.push({ url: typeof request === 'string' ? request : request.url, response })
      cached.set(typeof request === 'string' ? request : request.url, response)
    },
    keys: async () => [...cached.keys()],
    delete: async (key) => cached.delete(key),
  }

  const sandbox = {
    self: {
      addEventListener: (type, handler) => listeners.set(type, handler),
      skipWaiting: () => {},
      clients: { claim: async () => {} },
      location: { origin: 'https://example.com', href: 'https://example.com/blog/sw.js' },
    },
    caches: {
      open: async () => cache,
      keys: async () => ['blog-v2'],
      delete: async () => true,
      match: async (request) => {
        const key = typeof request === 'string' ? request : request.url
        return cached.get(key)
      },
    },
    fetch: async (request) => {
      const url = typeof request === 'string' ? request : request.url
      return network(url)
    },
    Response: globalThis.Response,
    URL: globalThis.URL,
    console,
  }

  vm.createContext(sandbox)
  vm.runInContext(SOURCE, sandbox)

  /** 触发 fetch 事件，返回 respondWith 收到的 Promise。 */
  async function dispatch(url, { method = 'GET' } = {}) {
    const handler = listeners.get('fetch')
    let captured
    handler({
      request: { url, method },
      respondWith: (value) => {
        captured = value
      },
      waitUntil: () => {},
    })
    return captured === undefined ? undefined : await captured
  }

  return { dispatch, putCalls, cached }
}

function okResponse(body = 'ok') {
  const response = new Response(body, { status: 200 })
  Object.defineProperty(response, 'redirected', { value: false })
  return response
}

function redirectResponse() {
  return Response.redirect('https://example.com/elsewhere', 302)
}

test('页面在线时走网络并缓存', async () => {
  const worker = createWorker({ network: async () => okResponse('page') })
  const response = await worker.dispatch('https://example.com/blog/projects/a/b/')
  assert.ok(response instanceof Response, 'respondWith 必须收到真响应')
  assert.equal(await response.text(), 'page')
})

test('页面离线且缓存命中时返回缓存', async () => {
  const cached = new Map([['https://example.com/blog/x/', okResponse('cached-page')]])
  const worker = createWorker({
    cached,
    network: async () => {
      throw new TypeError('Failed to fetch')
    },
  })
  const response = await worker.dispatch('https://example.com/blog/x/')
  assert.ok(response instanceof Response)
  assert.equal(await response.text(), 'cached-page')
})

// 这一条就是线上 ERR_FAILED 的根因：网络失败 + 缓存未命中
test('页面离线且无缓存时，必须返回离线页而不是 undefined', async () => {
  const worker = createWorker({
    network: async () => {
      throw new TypeError('Failed to fetch')
    },
  })
  const response = await worker.dispatch('https://example.com/blog/never-cached/')
  assert.ok(
    response instanceof Response,
    'respondWith(undefined) 会让浏览器抛 TypeError 并显示 ERR_FAILED',
  )
  assert.equal(response.status, 503)
})

test('资源请求离线时也不抛错，而是给出可用的兜底', async () => {
  const worker = createWorker({
    network: async () => {
      throw new TypeError('Failed to fetch')
    },
  })
  const response = await worker.dispatch('https://example.com/blog/_astro/app.abc123.js')
  assert.ok(response instanceof Response, '资源分支也必须返回响应，不能抛错')
})

test('资源命中缓存时不再请求网络', async () => {
  let fetched = 0
  const cached = new Map([['https://example.com/blog/_astro/app.abc123.js', okResponse('code')]])
  const worker = createWorker({
    cached,
    network: async () => {
      fetched += 1
      return okResponse('fresh')
    },
  })
  const response = await worker.dispatch('https://example.com/blog/_astro/app.abc123.js')
  assert.equal(await response.text(), 'code')
  assert.equal(fetched, 0, '缓存优先分支不该再打网络')
})

test('跨域请求不拦截', async () => {
  const worker = createWorker({ network: async () => okResponse('api') })
  const response = await worker.dispatch('https://blog-api-28t.pages.dev/api/comments')
  assert.equal(response, undefined, '跨域请求应当直接放行（respondWith 不被调用）')
})

test('非 GET 请求不拦截', async () => {
  const worker = createWorker({ network: async () => okResponse('x') })
  const response = await worker.dispatch('https://example.com/blog/x/', { method: 'POST' })
  assert.equal(response, undefined)
})

test('重定向响应不写入缓存', async () => {
  const worker = createWorker({ network: async () => redirectResponse() })
  await worker.dispatch('https://example.com/blog/no-slash')
  assert.equal(worker.putCalls.length, 0, '302 被缓存后会反复把用户送到旧地址')
})
