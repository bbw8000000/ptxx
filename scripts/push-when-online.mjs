// 后台守望：网络恢复后自动 fetch + rebase + push。
//
// 这台机器到 github.com 的 HTTPS 会连续几分钟到几十分钟不通，而日报是自动部署的，
// 卡住就意味着读者看不到当天更新。这个脚本把「等网络」这件事从手动重试变成后台等待。
//
//   node scripts/push-when-online.mjs [--minutes 30]
//
// 每次尝试：fetch origin <branch> → rebase 到 origin/<branch> → push。
// rebase 是必要的：日报 bot 会往 main 推提交，本地提交必须叠在它上面才能 fast-forward。

import { execFileSync } from 'node:child_process'

const BRANCH = process.env.PUSH_BRANCH ?? 'main'
const minutesIndex = process.argv.indexOf('--minutes')
const minutes = minutesIndex === -1 ? 30 : Number(process.argv[minutesIndex + 1])
const deadline = Date.now() + minutes * 60 * 1000

function git(args, options = {}) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  })
}
function attempt() {
  try {
    git(['fetch', 'origin', BRANCH])
  } catch (error) {
    return {
      ok: false,
      step: 'fetch',
      message: String(error.stderr ?? error.message).split('\n')[0],
    }
  }
  try {
    // 只有在确实落后时才 rebase
    const behind = git(['rev-list', '--count', `HEAD..origin/${BRANCH}`]).trim()
    if (behind !== '0') {
      git(['rebase', `origin/${BRANCH}`])
    }
  } catch (error) {
    return {
      ok: false,
      step: 'rebase',
      message: String(error.stderr ?? error.message).split('\n')[0],
    }
  }
  try {
    git(['push', 'origin', BRANCH])
  } catch (error) {
    return {
      ok: false,
      step: 'push',
      message: String(error.stderr ?? error.message).split('\n')[0],
    }
  }
  return { ok: true }
}

let tries = 0
while (Date.now() < deadline) {
  tries += 1
  const result = attempt()
  const stamp = new Date().toISOString().slice(11, 19)
  if (result.ok) {
    const head = git(['rev-parse', 'HEAD']).trim()
    console.log(`${stamp}  推送成功（第 ${tries} 次尝试）HEAD=${head.slice(0, 7)}`)
    process.exit(0)
  }
  console.log(`${stamp}  第 ${tries} 次失败于 ${result.step}：${result.message}`)
  await new Promise((resolve) => setTimeout(resolve, 30000))
}

console.log(
  `等待 ${minutes} 分钟仍未成功，放弃（提交仍在本地，可稍后再跑 ` +
    `\`node scripts/push-when-online.mjs\`）`,
)
process.exit(2)
