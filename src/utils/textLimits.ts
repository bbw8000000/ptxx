// 与 functions/_lib/validate.ts 对应的前端限制值。
//
// 后端按 UTF-8 字节计算长度（沿用 Firestore size() 的语义），而
// String.prototype.length 数的是 UTF-16 码元——一个汉字在 .length 里算 1，
// 按字节算却是 3。前端如果用 .length 把关，中文内容会先通过前端校验、
// 再被后端以 400 拒掉（2000 字中文 = 6000 字节）。
//
// tests/text-limits.test.mjs 会断言这里的数值与后端完全一致，
// 改了一边忘了另一边会让 CI 直接红掉。

const encoder = new TextEncoder()

export const PASSWORD_MIN_BYTES = 12
export const PASSWORD_MAX_BYTES = 200
export const DISPLAY_NAME_MAX_BYTES = 200
export const CONTENT_MAX_BYTES = 2000
export const PAGE_ID_MAX_BYTES = 512

export function utf8Length(value: string): number {
  return encoder.encode(value).length
}

// 给用户看的剩余额度提示：按字节算，并说明汉字占 3 字节。
export function describeByteLimit(value: string, maxBytes: number): string {
  return `${utf8Length(value)} / ${maxBytes} 字节`
}
