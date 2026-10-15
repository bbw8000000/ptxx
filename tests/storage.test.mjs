import assert from 'node:assert/strict'
import test from 'node:test'

import { readJson, readJsonArray, readText, writeJson, writeText } from '../src/lib/storage.ts'

// localStorage 在隐私模式、存储被禁用、配额写满时都会抛异常。
// 博客只是存个字号和收藏，读失败应当退回默认值而不是让整段脚本挂掉。

const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')

function setStorage(value) {
  Object.defineProperty(globalThis, 'localStorage', { value, configurable: true, writable: true })
}

function restoreStorage() {
  if (original) Object.defineProperty(globalThis, 'localStorage', original)
  else delete globalThis.localStorage
}

function memoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial))
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear(),
    key: (index) => [...map.keys()][index] ?? null,
    get length() {
      return map.size
    },
  }
}

test('localStorage 不存在时读回默认值、写入返回 false，且不抛异常', () => {
  try {
    delete globalThis.localStorage
    assert.equal(readText('font_size', '16'), '16')
    assert.deepEqual(readJson('bookmarks', []), [])
    assert.deepEqual(readJsonArray('bookmarks'), [])
    assert.equal(writeText('font_size', '18'), false)
    assert.equal(writeJson('bookmarks', ['a']), false)
  } finally {
    restoreStorage()
  }
})

test('访问 localStorage 就抛异常时同样安全降级', () => {
  try {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('storage disabled')
      },
    })
    assert.equal(readText('font_size', '16'), '16')
    assert.deepEqual(readJson('bookmarks', []), [])
    assert.equal(writeText('font_size', '18'), false)
  } finally {
    restoreStorage()
  }
})

test('setItem 抛异常（配额写满）时写入返回 false', () => {
  try {
    setStorage({
      ...memoryStorage(),
      setItem() {
        throw new Error('QuotaExceededError')
      },
    })
    assert.equal(writeText('font_size', '18'), false)
    assert.equal(writeJson('bookmarks', ['a']), false)
  } finally {
    restoreStorage()
  }
})

test('正常读写可以往返', () => {
  try {
    setStorage(memoryStorage())
    assert.equal(writeText('font_size', '18'), true)
    assert.equal(readText('font_size', '16'), '18')
    assert.equal(writeJson('bookmarks', ['a', 'b']), true)
    assert.deepEqual(readJson('bookmarks', []), ['a', 'b'])
    assert.deepEqual(readJsonArray('bookmarks'), ['a', 'b'])
  } finally {
    restoreStorage()
  }
})

test('内容损坏时退回默认值而不是抛出', () => {
  try {
    setStorage(
      memoryStorage({
        bookmarks: '{ not json',
        // 被别的版本写成了对象——调用方会在 .filter/.includes 上炸掉
        other: '{"a":1}',
      }),
    )
    assert.deepEqual(readJson('bookmarks', []), [])
    assert.deepEqual(readJsonArray('bookmarks'), [])
    assert.deepEqual(readJsonArray('other'), [])
  } finally {
    restoreStorage()
  }
})
