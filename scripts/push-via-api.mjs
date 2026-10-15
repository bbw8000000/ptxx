// 当 `git push` 连不上 github.com:443 时，用 GitHub API 把本地提交推上去。
//
// 为什么需要它：这台机器到 github.com 的 HTTPS 时通时断（api.github.com 却一直正常）。
// 普通 `git push` 失败时会留下「提交在本地、线上没更新」的状态，而日报是自动部署的，
// 卡住就意味着读者看不到当天更新。这个脚本走 Git Data API（blobs → tree → commit →
// 更新 ref）绕过去，全程只依赖 gh 的凭据。
//
//   node scripts/push-via-api.mjs            推送 main 到 origin/main
//   node scripts/push-via-api.mjs --dry-run  只报告要推哪些提交
//
// 三个必须注意的点（都踩过）：
//
//  1. blob 要从 **git 对象库**读（`git cat-file blob <sha>`），不能读工作区文件。
//     仓库开了 core.autocrlf=true，工作区是 CRLF 而 git 里存的是 LF，读文件传上去
//     会得到完全不同的 blob。脚本会逐个校验上传后的 sha 与本地一致，不一致就中止。
//
//  2. tree 必须**整棵重建**。用 base_tree 只带变更路径是不行的：子目录下的条目不会
//     合并进已有子树（API 期望的是子树的 sha），结果会静默丢掉根目录以下的所有文件
//     —— 实测把 1328 个文件变成了 31 个。
//
//  3. commit 要用**原始元数据**重建（tree、parents、author/committer 名字邮箱时间、
//     完整 message）。commit 的 sha 是这些内容的纯函数，照抄才能得到同样的 sha，
//     本地和远端才不会分叉。脚本会校验重建出的 sha。
//
// 完成后远端就是一个内容完全一致、sha 也一致的提交链，之后网络恢复时普通 push 仍是
// fast-forward，不需要 force。

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const REPO = process.env.PUSH_REPO ?? 'bbw8000000/ptxx'
const BRANCH = process.env.PUSH_BRANCH ?? 'main'
const dryRun = process.argv.includes('--dry-run')

function git(args, input) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    input,
    maxBuffer: 256 * 1024 * 1024,
  })
}
function gitRaw(args) {
  return execFileSync('git', args, { maxBuffer: 256 * 1024 * 1024 })
}
function apiJson(args, payload) {
  const options = { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }
  if (payload !== undefined) options.input = JSON.stringify(payload)
  const output = execFileSync('gh', ['api', ...args], options)
  return JSON.parse(output || 'null')
}
function apiText(args) {
  return execFileSync('gh', ['api', ...args], { encoding: 'utf8' }).trim()
}

const localHead = git(['rev-parse', 'HEAD']).trim()
const remoteHead = apiText([`repos/${REPO}/git/ref/heads/${BRANCH}`, '--jq', '.object.sha'])

if (localHead === remoteHead) {
  console.log(`已同步（${localHead.slice(0, 7)}），无需推送`)
  process.exit(0)
}

// 远端必须是本地的祖先，否则说明历史分叉，不能盲目覆盖
const isAncestor = (() => {
  try {
    git(['merge-base', '--is-ancestor', remoteHead, localHead])
    return true
  } catch {
    return false
  }
})()

if (!isAncestor) {
  console.error('远端 HEAD 不是本地 HEAD 的祖先，历史已分叉 —— 拒绝自动推送，请人工处理')
  console.error(`  远端: ${remoteHead}`)
  console.error(`  本地: ${localHead}`)
  process.exit(1)
}

const commits = git(['rev-list', '--reverse', `${remoteHead}..${localHead}`])
  .trim()
  .split('\n')
  .filter(Boolean)
console.log(`要推送 ${commits.length} 个提交：${remoteHead.slice(0, 7)} → ${localHead.slice(0, 7)}`)
for (const sha of commits) {
  console.log(`  ${sha.slice(0, 7)}  ${git(['log', '-1', '--pretty=%s', sha]).trim()}`)
}
if (dryRun) {
  console.log('--dry-run：未推送')
  process.exit(0)
}

/** 用 git 原始格式重建 commit 对象并算出它的 sha（用于校验）。 */
function buildCommitObject(treeSha, parents, author, committer, message) {
  const identity =
    `author ${author.name} <${author.email}> ${author.date}\n` +
    `committer ${committer.name} <${committer.email}> ${committer.date}\n`
  let body = `tree ${treeSha}\n`
  for (const parent of parents) body += `parent ${parent}\n`
  body += identity
  body += `\n${message}`
  const header = Buffer.from(`commit ${Buffer.byteLength(body, 'utf8')}\0`, 'utf8')
  const sha = createHash('sha1')
    .update(Buffer.concat([header, Buffer.from(body, 'utf8')]))
    .digest('hex')
  return { body, sha }
}

/** ISO 时间 → git 的 "<unix 秒> <±HHMM>"。 */
function toGitDate(iso) {
  const date = new Date(iso)
  const seconds = Math.floor(date.getTime() / 1000)
  const offsetMinutes = -date.getTimezoneOffset()
  const sign = offsetMinutes < 0 ? '-' : '+'
  const absolute = Math.abs(offsetMinutes)
  return `${seconds} ${sign}${String(Math.floor(absolute / 60)).padStart(2, '0')}${String(absolute % 60).padStart(2, '0')}`
}

/** 整棵重建一棵 tree，返回它的 sha；entries 是 "mode sha path" 列表。 */
function buildTree(prefix, entries, label) {
  const direct = []
  const subdirs = new Map()
  for (const entry of entries) {
    const rest = prefix ? entry.path.slice(prefix.length + 1) : entry.path
    const slash = rest.indexOf('/')
    if (slash === -1) {
      direct.push({ path: rest, mode: entry.mode, type: 'blob', sha: entry.sha })
    } else {
      const name = rest.slice(0, slash)
      if (!subdirs.has(name)) subdirs.set(name, [])
      subdirs.get(name).push(entry)
    }
  }
  for (const [name, children] of subdirs) {
    const childPrefix = prefix ? `${prefix}/${name}` : name
    direct.push({
      path: name,
      mode: '040000',
      type: 'tree',
      sha: buildTree(childPrefix, children, label),
    })
  }
  // git 的 tree 排序规则：目录按 "名字/" 参与比较
  direct.sort((a, b) => {
    const left = a.type === 'tree' ? `${a.path}/` : a.path
    const right = b.type === 'tree' ? `${b.path}/` : b.path
    return left < right ? -1 : left > right ? 1 : 0
  })
  const tree = apiJson([`repos/${REPO}/git/trees`, '--input', '-'], { tree: direct })
  process.stdout.write(`\r  ${label}: tree ${tree.sha.slice(0, 8)} (${direct.length} 项)          `)
  return tree.sha
}

/** 远端已有哪些 blob（按路径）。 */
function remoteBlobs(treeSha) {
  const map = new Map()
  const data = apiJson([`repos/${REPO}/git/trees/${treeSha}?recursive=1`])
  for (const entry of data.tree) if (entry.type === 'blob') map.set(entry.path, entry.sha)
  return map
}

for (const sha of commits) {
  // 从本地 git 读取这个提交的全部信息
  const treeSha = git(['rev-parse', `${sha}^{tree}`]).trim()
  const parents = git(['log', '-1', '--pretty=%P', sha]).trim().split(' ').filter(Boolean)
  const message = git(['log', '-1', '--pretty=%B', sha])
  const authorName = git(['log', '-1', '--pretty=%an', sha]).trim()
  const authorEmail = git(['log', '-1', '--pretty=%ae', sha]).trim()
  const authorDate = git(['log', '-1', '--pretty=%aI', sha]).trim()
  const committerName = git(['log', '-1', '--pretty=%cn', sha]).trim()
  const committerEmail = git(['log', '-1', '--pretty=%ce', sha]).trim()
  const committerDate = git(['log', '-1', '--pretty=%cI', sha]).trim()

  const entries = git(['ls-tree', '-r', sha])
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const match = /^(\d+) blob ([0-9a-f]+)\t(.+)$/.exec(line)
      if (!match) throw new Error(`无法解析 ls-tree 行: ${line}`)
      return { mode: match[1], sha: match[2], path: match[3] }
    })

  console.log(`\n提交 ${sha.slice(0, 7)}（${entries.length} 个文件）`)
  // 远端在「这个提交的父提交」那棵树上有哪些 blob —— 只上传缺的那些
  const known = remoteBlobs(git(['rev-parse', `${parents[0]}^{tree}`]).trim())
  const missing = entries.filter((entry) => known.get(entry.path) !== entry.sha)
  let uploaded = 0
  for (const entry of missing) {
    const content = gitRaw(['cat-file', 'blob', entry.sha])
    const blob = apiJson([`repos/${REPO}/git/blobs`, '--input', '-'], {
      content: content.toString('base64'),
      encoding: 'base64',
    })
    if (blob.sha !== entry.sha) {
      throw new Error(`blob sha 不一致（${entry.path}）：本地 ${entry.sha}，上传后 ${blob.sha}`)
    }
    uploaded += 1
    process.stdout.write(`\r  上传 blob ${uploaded}/${missing.length}          `)
  }
  if (missing.length) console.log('')

  const rebuiltTree = buildTree('', entries, 'tree')
  if (rebuiltTree !== treeSha) {
    throw new Error(`tree sha 不一致：本地 ${treeSha}，重建 ${rebuiltTree}`)
  }
  console.log('')

  const { body, sha: expectedSha } = buildCommitObject(
    rebuiltTree,
    parents,
    { name: authorName, email: authorEmail, date: toGitDate(authorDate) },
    { name: committerName, email: committerEmail, date: toGitDate(committerDate) },
    message,
  )
  if (expectedSha !== sha) {
    throw new Error(`重建的 commit sha 不一致：本地 ${sha}，重建 ${expectedSha}`)
  }

  git(['hash-object', '-t', 'commit', '-w', '--stdin'], body)
  const created = apiJson([`repos/${REPO}/git/commits`, '--input', '-'], {
    message,
    tree: rebuiltTree,
    parents,
  })
  if (created.sha !== sha) {
    throw new Error(`远端 commit sha 不一致：期望 ${sha}，得到 ${created.sha}`)
  }
  console.log(`  提交已建：${created.sha.slice(0, 7)}（与本地一致）`)
}

apiJson([`repos/${REPO}/git/refs/heads/${BRANCH}`, '-X', 'PATCH', '--input', '-'], {
  sha: localHead,
  // 远端 HEAD 已被移走（重写历史）时才需要 force；正常情况这里是 fast-forward
  force: !isAncestor,
})

// 本地对象库里可能缺这些 commit（如果它们本来是 API 建的），这里补上；
// 顺手把 origin/<branch> 对齐，避免 git status 显示分叉。
git(['update-ref', `refs/remotes/origin/${BRANCH}`, localHead])
console.log(`\n已推送：${remoteHead.slice(0, 7)} → ${localHead.slice(0, 7)}`)
