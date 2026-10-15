// 提取式摘要 — 基于词频 + 位置 + 长度评分
// 纯客户端运行，无需外部 API

/** 简单的中文 + 英文句号分割 */
function splitSentences(text: string): string[] {
  const raw = text
    .replace(/\n{2,}/g, '\n')
    .replace(/\s+/g, ' ')
    .trim()
  // 按中文/英文句尾分割
  const parts = raw.split(/(?<=[。！？.!?\n])(?=\s*[一-鿿A-Za-z0-9"「『（(])/)
  return parts.map((s) => s.trim()).filter((s) => s.length > 8 && /[一-鿿]/.test(s)) // 至少含一个中文字符
}

/** 简单的中文停用词 */
const STOP_WORDS = new Set([
  '的',
  '了',
  '在',
  '是',
  '我',
  '有',
  '和',
  '就',
  '不',
  '人',
  '都',
  '一',
  '一个',
  '上',
  '也',
  '很',
  '到',
  '说',
  '要',
  '去',
  '你',
  '会',
  '着',
  '没有',
  '看',
  '好',
  '自己',
  '这',
  '他',
  '她',
  '它',
  '们',
  '那',
  '些',
  '什么',
  '怎么',
  '因为',
  '所以',
  '但是',
  '可以',
  '这个',
  '那个',
  '如果',
  '虽然',
  '然后',
  '而且',
  '或者',
  '还是',
  '因为',
  '所以',
  '已经',
  '时候',
  '进行',
  '通过',
  '使用',
  '以及',
  '对于',
  '关于',
  '其中',
  '可能',
  '应该',
  'the',
  'a',
  'an',
  'is',
  'are',
  'was',
  'were',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'and',
  'or',
  'but',
  'it',
  'its',
  'this',
  'that',
  'these',
  'those',
  'we',
  'you',
  'they',
  'he',
  'she',
])

function isStopWord(w: string): boolean {
  return STOP_WORDS.has(w.toLowerCase()) || w.length < 2
}

function tokenize(text: string): string[] {
  // 匹配中文字符或英文单词
  const tokens: string[] = []
  for (const m of text.matchAll(/[一-鿿]+|[a-zA-Z]\w*/g)) {
    tokens.push(m[0])
  }
  return tokens
}

interface SentenceScore {
  text: string
  score: number
  idx: number
}

export function summarize(text: string, maxSentences = 5): string[] {
  const sentences = splitSentences(text)
  if (sentences.length <= maxSentences) return sentences

  // 1. 统计词频（去掉停用词）
  const freq: Record<string, number> = {}
  for (const s of sentences) {
    for (const t of tokenize(s)) {
      if (!isStopWord(t)) freq[t] = (freq[t] || 0) + 1
    }
  }
  const maxFreq = Math.max(...Object.values(freq), 1)

  // 2. 评分每个句子
  const scored: SentenceScore[] = sentences.map((s, i) => {
    const tokens = tokenize(s)
    if (tokens.length === 0) return { text: s, score: 0, idx: i }

    // 词频分数
    const termScore = tokens.reduce((sum, t) => sum + (freq[t] || 0) / maxFreq, 0) / tokens.length

    // 位置分数（前 30% 权重更高）
    const posRatio = i / sentences.length
    const posScore = posRatio < 0.3 ? 1.0 - posRatio * 0.3 : 0.85

    // 长度分数（20-100 词最佳）
    const len = tokens.length
    const lenScore = len >= 15 && len <= 80 ? 1.0 : Math.max(0.3, 1 - Math.abs(len - 40) / 100)

    // 标题类句子（短句子、无句号结尾）加分
    const titleBonus = s.length < 30 && !s.endsWith('。') ? 0.15 : 0

    // 包含数字或引用的句子加分（通常包含重要信息）
    const refBonus = /[\d]+|["「『]/.test(s) ? 0.1 : 0

    const score = termScore * 0.5 + posScore * 0.2 + lenScore * 0.15 + titleBonus + refBonus
    return { text: s, score, idx: i }
  })

  // 3. 按分数排序，选 top N
  const top = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)

  // 4. 按原文顺序返回
  return top.sort((a, b) => a.idx - b.idx).map((s) => s.text.trim())
}
