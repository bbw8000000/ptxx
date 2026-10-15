export function serializeJsonForScript(value: unknown): string {
  const json = JSON.stringify(value)
  if (json === undefined) {
    throw new TypeError('Value cannot be serialized to JSON')
  }

  return json
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
