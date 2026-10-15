import { canvasToBlob } from './canvas'

const DB_NAME = 'mogi-drafts'
const DB_VERSION = 1
const STORE_NAME = 'images'
const MAX_DRAFTS = 10

export interface Draft {
  id: string
  blob: Blob
  thumbnail: string // data URL, small
  createdAt: number
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveDraft(canvas: HTMLCanvasElement): Promise<Draft> {
  const db = await openDB()
  const count = await countDrafts()
  if (count >= MAX_DRAFTS) {
    throw new Error('DRAFT_FULL')
  }

  const blob = await canvasToBlob(canvas)

  // 生成缩略图
  const thumb = document.createElement('canvas')
  thumb.width = 120
  thumb.height = Math.round((canvas.height / canvas.width) * 120)
  const ctx = thumb.getContext('2d')!
  ctx.drawImage(canvas, 0, 0, thumb.width, thumb.height)
  const thumbnail = thumb.toDataURL('image/jpeg', 0.6)

  const draft: Draft = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    blob,
    thumbnail,
    createdAt: Date.now(),
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(draft)
    tx.oncomplete = () => resolve(draft)
    tx.onerror = () => reject(tx.error)
  })
}

export async function getAllDrafts(): Promise<Draft[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).getAll()
    req.onsuccess = () => {
      const drafts = (req.result as Draft[]).sort((a, b) => b.createdAt - a.createdAt)
      resolve(drafts)
    }
    req.onerror = () => reject(req.error)
  })
}

export async function getDraft(id: string): Promise<Draft | undefined> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).get(id)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function deleteDraft(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function countDrafts(): Promise<number> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).count()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export function formatTime(ts: number): string {
  const d = new Date(ts)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${month}月${day}日 ${h}:${m}`
}
