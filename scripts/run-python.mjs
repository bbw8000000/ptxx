// Cross-platform Python launcher for the npm scripts.
//
// package.json used to call `py -3`, which only exists on Windows. macOS ships
// neither `py` nor a bare `python` (only `python3`), so `npm run daily` and
// `npm run weekly` could not run there at all.
//
//   node scripts/run-python.mjs scripts/generate_daily_digest.py [args...]
//
// Each candidate is probed by actually executing it rather than just looking for
// it on PATH: on Windows a bare `python` frequently resolves to the Microsoft
// Store stub, which exists as a file but is not a real interpreter. That is why
// the Windows order tries `py -3` first.

import { spawnSync } from 'node:child_process'

const CANDIDATES =
  process.platform === 'win32'
    ? [
        ['py', ['-3']],
        ['python', []],
        ['python3', []],
      ]
    : [
        ['python3', []],
        ['python', []],
      ]

const PROBE_TIMEOUT_MS = 5000

function findInterpreter() {
  for (const [command, prefix] of CANDIDATES) {
    const probe = spawnSync(command, [...prefix, '--version'], {
      stdio: 'ignore',
      timeout: PROBE_TIMEOUT_MS,
    })
    // A timed-out Store stub reports status null, which also fails this check.
    if (probe.status === 0) return { command, prefix, label: [command, ...prefix].join(' ') }
  }
  return null
}

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('usage: node scripts/run-python.mjs <script.py> [args...]')
  process.exit(2)
}

const interpreter = findInterpreter()
if (!interpreter) {
  console.error('run-python: no working Python 3 interpreter found.')
  console.error(`  tried: ${CANDIDATES.map(([c, p]) => [c, ...p].join(' ')).join(', ')}`)
  console.error('  install Python 3 (macOS: brew install python3), then retry.')
  process.exit(1)
}

const result = spawnSync(interpreter.command, [...interpreter.prefix, ...args], {
  stdio: 'inherit',
})

if (result.error) {
  console.error(`run-python: failed to run ${interpreter.label}: ${result.error.message}`)
  process.exit(1)
}

process.exit(result.status ?? 1)
