// 判断一段正文是不是「主要不是中文」，以及为它准备翻译载荷。
//
// 用途：本站项目页的正文是各项目自己的 README，绝大多数是英文（实测 675 个有正文的
// 快照里 616 个、约 91% 以拉丁字母为主）。读者反馈「没有中文翻译」，而本站原有的
// 翻译控件依赖 Chrome 内置的 Translator API —— QQ/360/UC/Firefox/Safari 都用不了。
//
// 所以这些页面要两件事：一个不依赖任何 API 的静态提示（用浏览器整页翻译），
// 以及一份可以发给服务端生成中文摘要的正文载荷。两个判断都放在这里，便于单独测。
//
// 只看正文，不看 frontmatter；样本太短时不下结论（避免把一句英文提示当成外文正文）。
const MIN_SAMPLE = 200

export function isMostlyNonChinese(text: string): boolean {
  const body = text.trim()
  if (body.length < MIN_SAMPLE) return false
  const latin = (body.match(/[A-Za-z]/g) ?? []).length
  const han = (body.match(/[\u4e00-\u9fff]/g) ?? []).length
  // 汉字占非空白字符的比例低于三分之一，就认为主要不是中文
  const visible = (body.match(/\S/g) ?? []).length || 1
  return han / visible < 0.34 && latin > han
}

/** 送进翻译载荷的最大字符数。服务端还会再截一次（MAX_SOURCE_CHARS）。 */
export const SUMMARY_PAYLOAD_CHARS = 1500

/**
 * 快照开头那段站内说明不是项目内容，送给模型只会干扰。
 * 这些句子由本站的快照脚本写入，措辞稳定，所以按句过滤而不是按整段删。
 */
const SCAFFOLD_PATTERNS = [
  /本页保存的是公开项目资料快照[^。]*。/g,
  /阅读过程不需要连接 GitHub[^。]*。/g,
  /该项目已从 GitHub 下架[^。]*。/g,
  /下方为当时抓取的公开摘要[^。]*。/g,
]

/**
 * 把 Markdown 正文整理成一段纯文本，供服务端生成摘要。
 *
 * 只发给模型够读懂项目的开头部分：README 动辄上万字，而读者要的是「这个项目做什么」。
 * 同时剔除站内脚手架句子，否则模型会把「本页保存的是公开项目资料快照」也当成项目描述。
 */
export function buildSummaryPayload(body: string, maxChars = SUMMARY_PAYLOAD_CHARS): string {
  let text = body
  for (const pattern of SCAFFOLD_PATTERNS) text = text.replace(pattern, ' ')

  const plain = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^[>#*\-+]\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim()

  return plain.slice(0, maxChars)
}
