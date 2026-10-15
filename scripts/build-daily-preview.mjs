// 本地构建「任意一期日报」的预览页（src/pages/_daily-preview/）。
//
//   npm run preview:daily          构建并起本地服务器
//   npm run preview:daily -- 4322  换个端口
//
// 为什么要单独一个入口：这个页面默认不生成（生产构建里不该存在），
// 只有显式设置 DAILY_PREVIEW=1 时 getStaticPaths 才会产出它。
//
// 注意：它会**覆盖 dist/**。看完想回到正常产物，重新跑一次 `npm run build`。
import { spawn } from 'node:child_process'

const port = process.argv[2] ?? '4321'

function run(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: { ...process.env, ...env },
    })
    child.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} 退出码 ${code}`)),
    )
    child.on('error', reject)
  })
}

console.log('以 DAILY_PREVIEW=1 构建（只多出 _daily-preview 页面）…')
await run('npx', ['astro', 'build'], { DAILY_PREVIEW: '1' })

console.log('\n启动本地预览服务器，按 Ctrl+C 结束…')
await run('npx', ['astro', 'preview', '--port', port], {})
