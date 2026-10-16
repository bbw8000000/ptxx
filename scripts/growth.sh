#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# 成长记录「规范省事」工作流（服务端一键脚本）
#
# 用法：
#   scripts/growth.sh new              生成今天的草稿（.md + 封面 SVG）
#   scripts/growth.sh list             列出所有草稿 / 已发布
#   scripts/growth.sh publish 038      把 growth-038 翻成已发布 → 推送 → 立即上线
#   scripts/growth.sh publish 038 --dry  只做本地改动，不提交/不推送/不部署（试跑）
#   scripts/growth.sh deploy           仅手动触发一次部署（平时每 10 分钟自动跑）
#
# 设计目标：把「编辑 md → 只提交这一个文件 → 推送 → 触发部署」这几步合成一条命令，
# 并且自动对齐远端最新，避免在 detached HEAD / 落后分支上手滑。
#
# 为什么不用 git push origin：origin 是加速镜像（只用于拉取），推送必须走 SSH 部署密钥。
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SRC="${PTXX_SRC:-/home/ubuntu/ptxx-src}"
POSTS="$SRC/src/content/posts"
PUBLIC="$SRC/public"
PUSH_REMOTE="git@github.com:bbw8000000/ptxx.git"
DEPLOY_UNIT="ptxx-deploy.service"
LOG="/home/ubuntu/ptxx-deploy.log"

cd "$SRC"

c() { printf '\033[36m%s\033[0m\n' "$*"; }
warn() { printf '\033[33m%s\033[0m\n' "$*"; }
ok() { printf '\033[32m%s\033[0m\n' "$*"; }
die() { printf '\033[31m错误：%s\033[0m\n' "$*" >&2; exit 1; }

git_ssh() { GIT_SSH_COMMAND="ssh -i ${HOME}/.ssh/ptxx_deploy -o IdentitiesOnly=yes" git "$@"; }

# 对齐远端最新（浅克隆），保留工作区改动。这样 HEAD 永远不会落后，push 一定是快进。
sync() {
  c "拉取远端最新 main …"
  git fetch --depth 1 origin main >>/dev/null 2>&1 || die "fetch 失败（网络/镜像问题）"
  git reset --mixed FETCH_HEAD >>/dev/null 2>&1
}

usage() { sed -n '2,14p' "$0" | sed 's/^# \{0,1\}//'; exit 1; }

# 把 038 / growth-038 / growth-038.md 解析成真实文件路径
resolve() {
  local q="$1" f
  q="${q#growth-}"; q="${q%.md}"
  f="$(ls "$POSTS"/growth-"$q".md 2>/dev/null | head -1 || true)"
  [ -n "$f" ] || f="$(ls "$POSTS"/growth-*"$q"*.md 2>/dev/null | head -1 || true)"
  [ -n "$f" ] || die "找不到匹配的成长记录：$1"
  basename "$f"
}

is_published() { grep -qm1 '^draft: *false' "$1"; }

cmd_new() {
  sync
  c "生成今天的成长记录草稿 …"
  node scripts/run-python.mjs scripts/generate_growth_draft.py 2>&1 | sed 's/^/  /'
  echo
  c "接下来：编辑 src/content/posts/growth-*.md 写正文，然后"
  c "        scripts/growth.sh publish <编号>"
}

cmd_list() {
  local f d t
  for f in $(ls "$POSTS"/growth-*.md 2>/dev/null | sort -V); do
    d="$(grep -m1 '^draft:' "$f" 2>/dev/null | awk '{print $2}' || true)"
    t="$(grep -m1 '^title:' "$f" 2>/dev/null | sed -E "s/^title: *[\"']?//; s/[\"']$//" || true)"
    [ -n "$d" ] || d="true"
    if [ "$d" = "true" ]; then
      printf '  草稿    %-18s %s\n' "$(basename "$f")" "$t"
    else
      printf '  已发布  %-18s %s\n' "$(basename "$f")" "$t"
    fi
  done
}

cmd_publish() {
  local arg="${1:-}" dry=""
  [ -n "$arg" ] || die "用法：scripts/growth.sh publish <编号> [--dry]"
  [ "${2:-}" = "--dry" ] && dry="1"

  sync

  local base; base="$(resolve "$arg")"
  local f="$POSTS/$base"

  if is_published "$f"; then
    warn "注意：$base 已经是已发布状态。"
  fi

  # 占位符提醒
  if grep -m1 '^title:' "$f" 2>/dev/null | grep -q '成长记录 #'; then
    warn "提醒：标题还是模板（成长记录 #N：…），建议改成真实的标题。"
  fi
  if grep -m1 '^description:' "$f" 2>/dev/null | grep -q '（'; then
    warn "提醒：description 还是占位符（…），建议写一句真话。"
  fi

  c "标记为已发布：$base"
  sed -i -E 's/^draft: *true *$/draft: false/' "$f"
  grep -q '^draft:' "$f" || sed -i '/^category:/a draft: false' "$f"

  if [ -n "$dry" ]; then
    ok "（试跑）已改 $base 为 draft:false，未提交/推送/部署。"
    return 0
  fi

  local hero relpath
  hero="$(grep -m1 '^heroImage:' "$f" | sed -E "s/^heroImage: *[\"']?([^\"']+)[\"']?.*/\1/" || true)"
  git add "$f"
  if [ -n "$hero" ] && [ -f "$PUBLIC$hero" ]; then
    git add "$PUBLIC$hero"
  elif [ -n "$hero" ] && [ ! -f "$PUBLIC$hero" ]; then
    warn "警告：封面 $hero 不存在于 public/，线上会 404。"
  fi

  git commit -m "content(growth): 发布 $base" >>/dev/null 2>&1 || true
  git rev-parse HEAD | sed 's/^/  提交 /'

  c "推送到 GitHub …"
  git_ssh push "$PUSH_REMOTE" HEAD:refs/heads/main 2>&1 | sed 's/^/  /' || die "推送失败"

  local sha; sha="$(git rev-parse HEAD)"
  c "触发部署并等待上线 …"
  sudo -n systemctl start "$DEPLOY_UNIT" || die "无法触发部署（sudo/服务名问题）"
  wait_deploy "$sha"
}

wait_deploy() {
  local sha="$1" cur i
  for i in $(seq 1 100); do
    cur="$(cat "$SRC/.last-deployed-sha" 2>/dev/null || true)"
    [ "$cur" = "$sha" ] && break
    sleep 3
  done
  if [ "$(cat "$SRC/.last-deployed-sha" 2>/dev/null || true)" = "$sha" ]; then
    ok "✅ 已上线：https://zilvd.icu/growth/"
    tail -1 "$LOG" 2>/dev/null | sed 's/^/  /' || true
  else
    warn "⚠️ 部署还没完成，服务器每 10 分钟会自动重试，稍后再看即可。"
    tail -2 "$LOG" 2>/dev/null | sed 's/^/  /' || true
  fi
}

cmd_deploy() {
  c "手动触发部署 …"
  sudo -n systemctl start "$DEPLOY_UNIT" || die "无法触发部署"
  wait_deploy "$(cat "$SRC/.last-deployed-sha" 2>/dev/null || echo none)"
}

case "${1:-}" in
  new)     cmd_new ;;
  list)    cmd_list ;;
  publish) shift; cmd_publish "$@" ;;
  deploy)  cmd_deploy ;;
  *)       usage ;;
esac
