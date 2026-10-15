import assert from 'node:assert/strict'
import test from 'node:test'

import { serializeJsonForScript } from '../src/utils/safeJson.ts'

test('serializes script-closing text without creating a closing tag', () => {
  const payload = { title: '</script><script>alert(1)</script>' }
  const serialized = serializeJsonForScript(payload)

  assert.doesNotMatch(serialized, /<\/script/i)
  assert.deepEqual(JSON.parse(serialized), payload)
})

test('escapes JavaScript line separators and rejects unsupported values', () => {
  const separators = String.fromCharCode(0x2028, 0x2029)
  assert.equal(serializeJsonForScript(separators), '"\\u2028\\u2029"')
  assert.throws(() => serializeJsonForScript(undefined), /cannot be serialized/i)
})
