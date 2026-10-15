export function calcReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, '').replace(/[#*`>\-\[\]()!]/g, '')
  const cjkChars = (text.match(/[一-鿿㐀-䶿]/g) || []).length
  const latinWords = (text.match(/[a-zA-Z]+/g) || []).length
  const minutes = cjkChars / 400 + latinWords / 200
  return Math.max(1, Math.ceil(minutes))
}

export function calcWordCount(content: string): number {
  const text = content.replace(/<[^>]*>/g, '').replace(/[#*`>\-\[\]()!]/g, '')
  const cjkChars = (text.match(/[一-鿿㐀-䶿]/g) || []).length
  const latinWords = (text.match(/[a-zA-Z]+/g) || []).length
  return cjkChars + latinWords
}

export function formatWordCount(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}
