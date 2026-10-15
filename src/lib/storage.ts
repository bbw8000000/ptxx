// localStorage 的安全封装。
//
// 直接调 localStorage 有三个坑，而且都在真实浏览器里会发生：
//   1. 隐私模式 / 站点数据被禁用时，连读取属性本身都可能抛异常；
//   2. 配额写满时 setItem 抛 QuotaExceededError；
//   3. 存进去的东西可能是别的版本写的，JSON.parse 会抛。
// 站点是博客：读收藏、字号这类偏好失败不该让整段脚本挂掉，
// 所以这里读失败给默认值、写失败静默降级（功能退化，但不炸）。

function storage(): Storage | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    // 某些环境下访问 localStorage 这个属性本身就会抛
    return null
  }
}

export function readText(key: string, fallback = ''): string {
  try {
    return storage()?.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

export function writeText(key: string, value: string): boolean {
  try {
    const target = storage()
    if (!target) return false
    target.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function readJson<T>(key: string, fallback: T): T {
  const raw = readText(key, '')
  if (raw === '') return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

// 读一个「必须是数组」的键。存进去的结构如果被别的版本写坏，直接退回空数组，
// 免得调用方在 .filter / .includes 上炸掉。
export function readJsonArray<T>(key: string): T[] {
  const value = readJson<unknown>(key, [])
  return Array.isArray(value) ? (value as T[]) : []
}

export function writeJson(key: string, value: unknown): boolean {
  try {
    return writeText(key, JSON.stringify(value))
  } catch {
    return false
  }
}
