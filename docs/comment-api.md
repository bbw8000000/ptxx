# 评论与账号 API

站点是静态的（GitHub Pages），评论与账号由一套自建的 Cloudflare Pages Functions + D1 API 提供，
目的是替换早期的 Firebase（国内访问不稳定）。前端调用方是 `src/lib/api.ts`。

## 为什么是两套部署

| 部分     | 位置                                                  | 由谁部署                           |
| -------- | ----------------------------------------------------- | ---------------------------------- |
| 静态站点 | GitHub Pages（base `/blog`）                          | `.github/workflows/deploy.yml`     |
| 评论 API | Cloudflare Pages 项目 `blog-api` + D1 `blog-comments` | `.github/workflows/deploy-api.yml` |

凭据用 `Authorization: Bearer <token>` 而不是 Cookie：站点在 `github.io`、API 在 `pages.dev`，
Cookie 属于第三方，会被 Safari ITP / Firefox TCP / Chrome 分区直接丢掉。用请求头顺带也消掉了 CSRF 面。

## 接口

| 方法   | 路径                    | 鉴权                   | 说明                             |
| ------ | ----------------------- | ---------------------- | -------------------------------- |
| POST   | `/api/auth/register`    | —                      | 注册并直接返回会话 token         |
| POST   | `/api/auth/login`       | —                      | 登录                             |
| POST   | `/api/auth/logout`      | 需登录                 | 吊销当前 token                   |
| GET    | `/api/auth/me`          | 需登录                 | 当前用户                         |
| POST   | `/api/auth/password`    | 需登录                 | 改密，并吊销**其他**设备上的会话 |
| GET    | `/api/comments?pageId=` | —                      | 某页面下已通过的评论             |
| POST   | `/api/comments`         | 需登录                 | 发表评论，落库为 `pending`       |
| DELETE | `/api/comments/:id`     | 需登录（本人或管理员） | 删除                             |
| PATCH  | `/api/comments/:id`     | 管理员                 | 改审核状态                       |
| GET    | `/api/admin/comments`   | 管理员                 | 审核列表，支持分页与搜索         |

### `GET /api/admin/comments` 的查询参数

| 参数     | 默认 | 说明                                                           |
| -------- | ---- | -------------------------------------------------------------- |
| `status` | 全部 | `approved` / `pending` / `rejected`                            |
| `q`      | —    | 在昵称、页面路径、正文里做 SQL `LIKE` 搜索（通配符按字面转义） |
| `limit`  | 50   | 上限 200                                                       |
| `offset` | 0    | 负数按 0 处理                                                  |

返回体：

```json
{
  "comments": [],
  "total": 1234,
  "limit": 50,
  "offset": 0,
  "counts": { "all": 1234, "approved": 1000, "pending": 200, "rejected": 34 }
}
```

`total` 是**当前筛选条件下**的总数（分页器要用），`counts` 是**全表**按状态计数（统计卡要用）。
这两个数字必须来自服务端：早期版本一次取回最多 500 条、在浏览器里过滤，超过 500 条时
统计和搜索都会静默失真。

## 长度口径

限制值按 **UTF-8 字节** 计算（沿用 Firestore `size()` 的语义），不是字符数。

前端另有一份常量在 `src/utils/textLimits.ts`：`functions/` 由 Cloudflare 单独打包，
不能从 `src/` 引入，所以两边各存一份，靠 `tests/text-limits.test.mjs` 断言它们始终相等。
早期前端用 `String.length` 把关（汉字算 1，字节算 3），结果 2000 个汉字的评论能通过前端、
再被后端以 400 拒掉。

## 环境变量与密钥

| 名称                    | 类型                 | 用途                                                  |
| ----------------------- | -------------------- | ----------------------------------------------------- |
| `PUBLIC_API_BASE`       | 仓库变量             | API 地址，构建时写入 `.env` 供 Astro 读取             |
| `PBKDF2_PEPPER`         | Pages secret         | PBKDF2 之前的 HMAC pepper，泄露即等于密码可离线爆破   |
| `PBKDF2_ITERATIONS`     | Pages secret（可选） | 默认 50000，受免费版 CPU 预算限制                     |
| `ALLOWED_ORIGINS`       | Pages secret（可选） | CORS 白名单，逗号分隔；留空用内置默认值               |
| `DEEPSEEK_API_KEY`      | Pages secret（可选） | `/api/translate` 生成中文摘要用的模型密钥             |
| `DEEPSEEK_MODEL`        | Pages secret（可选） | 默认 `deepseek-chat`                                  |
| `DEEPSEEK_BASE_URL`     | Pages secret（可选） | 默认 `https://api.deepseek.com`（OpenAI 兼容接口）    |
| `CLOUDFLARE_API_TOKEN`  | 仓库 secret          | **`Deploy API` 必需**，否则工作流会在 D1 迁移步骤失败 |
| `CLOUDFLARE_ACCOUNT_ID` | 仓库 secret          | 同上                                                  |

> `PBKDF2_PEPPER` 缺失时注册/登录会返回 500。`CLOUDFLARE_API_TOKEN` 缺失时
> `Deploy API` 会失败，而 `functions/**` 的改动不会上线——注意线上 API 仍然可用，
> 所以这个问题不会自己暴露出来。
>
> `DEEPSEEK_API_KEY` 缺失时 `/api/translate` 返回 503，项目页上的「中文摘要」块会显示
> 「摘要暂时拿不到」并提示改用浏览器整页翻译 —— 站点本身照常构建和访问，不会因此报错。

### `/api/translate`（中文摘要）

项目页正文是各项目自己的 README，实测 675 个有正文的快照里 616 个（91%）以英文为主。
读者点开页面时，前端把正文开头（约 1500 字）发给这个接口，服务端调模型生成中文摘要。

| 设计点   | 做法                                                                |
| -------- | ------------------------------------------------------------------- |
| 缓存     | 键是**源文本的 sha256** + 目标语言 + 模型，存 D1 `translations` 表  |
| 限流     | 每 IP 每分钟 20 次、每天 300 次；**命中缓存不计入限流**（详见下文） |
| 输入上限 | 服务端只取前 2000 字，长 README 不按全文计费                        |
| 鉴权     | 不需要登录 —— 受众正是「不会用 GitHub、也不会用浏览器翻译」的读者   |
| 密钥     | 只存在 Cloudflare secret 里，绝不下发到前端                         |

缓存按**文本**而不是仓库名做键：同一段文字会出现在项目页、日报卡片和历史日报里，
按文本缓存才能保证全站只付费翻译一次（实测重复请求从 749ms 降到 23ms）。

命中缓存不计限流是刻意的：热门项目的同一段文字会被很多读者请求，如果计数，
先到的读者会把后面的人限死，而这个请求其实一分钱不花。

## 一次性初始化

```bash
npx wrangler d1 create blog-comments          # 把打印出的 id 填进 wrangler.toml
npx wrangler pages project create blog-api
npx wrangler pages secret put PBKDF2_PEPPER --project-name blog-api
npx wrangler pages secret put DEEPSEEK_API_KEY --project-name blog-api   # 可选：中文摘要
gh secret set CLOUDFLARE_API_TOKEN            # 在 Cloudflare 后台创建 token 后填入
gh secret set CLOUDFLARE_ACCOUNT_ID
```

第一个管理员需要手工写入（没有 UI，也没有邮箱验证）：

```bash
npx wrangler d1 execute blog-comments --remote \
  --command "INSERT OR IGNORE INTO admins (user_id, created_at, note) SELECT id, $(date +%s)000, '' FROM users WHERE email_lower = '你的邮箱'"
```

这条语句在邮箱未注册时会静默插入 0 行，执行后请自行确认 `changes` 不为 0。

## 本地开发

```bash
npm run build:api        # 生成 .pages-dist 静态壳
npm run api:dev          # wrangler pages dev，默认 http://localhost:8788
```

本地 pepper 放在 `.dev.vars`（已被 gitignore）：

```text
PBKDF2_PEPPER=本地随便一个长字符串
```

同时把站点的 `.env` 里 `PUBLIC_API_BASE` 指到 `http://localhost:8788`。

## 已知缺口

- **没有找回密码**。这需要邮件服务商（Resend、Cloudflare Email Workers 等），本项目没有接入。
  目前能做的是登录后改密（`POST /api/auth/password`），改密会吊销其他会话。
- **`GET /api/comments` 没有限流**。它是公开只读接口，用 D1 计数器给它限流意味着每次读都要写一次库，
  得不偿失；真需要的话应该在 Cloudflare 边缘配速率限制，或给响应加 CDN 缓存。
  写接口（注册 / 登录 / 评论 / 改密）都有限流，评论创建同时按账号与 IP 计。
- **PBKDF2 迭代数 50000** 低于 OWASP 建议的 600k，原因是免费版 CPU 预算
  （600k 会触发 Error 1102）。迁移到付费计划后应通过 `PBKDF2_ITERATIONS` 提高，
  登录时的透明 rehash 会自动升级已有账号。
- **迁移过来的老评论无法由作者删除**：那批行的 `user_id` 为 NULL，只保留 `legacy_uid`，
  归属判定只看 `user_id`。
