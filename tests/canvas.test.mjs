import assert from 'node:assert/strict'
import test from 'node:test'

import { canvasToBlob } from '../src/utils/canvas.ts'

test('resolves a canvas blob', async () => {
  const expected = new Blob(['image'], { type: 'image/png' })
  const canvas = { toBlob: (callback) => callback(expected) }

  assert.equal(await canvasToBlob(canvas), expected)
})

test('rejects when the browser cannot create a canvas blob', async () => {
  const canvas = { toBlob: (callback) => callback(null) }

  await assert.rejects(canvasToBlob(canvas), /BLOB_CREATION_FAILED/)
})
