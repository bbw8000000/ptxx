// 测试用的 D1 适配器：把 node:sqlite 的内存库包装成 Functions 里 D1Like 的形状，
// 这样路由处理函数可以原样运行，SQL 也是真的被 SQLite 解析和执行。
//
// 之所以要跑真库：重复的 ?N 占位符、LIKE ... ESCAPE 语法、LIMIT/OFFSET 边界
// 这些都无法靠类型检查或纯函数测试发现，只有真正 prepare + execute 才暴露。
import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'

const MIGRATION_URL = new URL('../../migrations/0001_init.sql', import.meta.url)

export function createD1(sqlite) {
  return {
    prepare(sql) {
      const statement = sqlite.prepare(sql)
      let bound = []
      const wrapper = {
        bind(...values) {
          bound = values
          return wrapper
        },
        async first() {
          return statement.get(...bound) ?? null
        },
        async all() {
          return { results: statement.all(...bound), success: true }
        },
        async run() {
          const info = statement.run(...bound)
          return { success: true, meta: { changes: Number(info.changes) } }
        },
      }
      return wrapper
    },
    async batch(statements) {
      return Promise.all(statements.map((statement) => statement.run()))
    },
  }
}

export function createTestDb() {
  const sqlite = new DatabaseSync(':memory:')
  sqlite.exec('PRAGMA foreign_keys = ON')
  sqlite.exec(readFileSync(MIGRATION_URL, 'utf8'))
  return { sqlite, env: { DB: createD1(sqlite) } }
}
