"""检查「日报里推荐过、且站内没有快照」的项目仓库是否还活着。

为什么需要这个：站内没有快照的项目，卡片只能直连 GitHub。但日报是从搜索结果里
挑「最近 24 小时涨星快」的仓库，其中相当一部分是刷榜的垃圾项目，事后会被 GitHub
删除或封号 —— 实测抽样 45% 已经 404。读者点过去撞死链，比不显示链接更糟。

判定结果写进 config/projects-gone.json，由以下两处消费：
  - src/components/home/HomeTechDaily.astro：死链不再做成可点击的 GitHub 按钮
  - src/app 项目页：改用同一份实测数据判断「原始仓库」链接是否可用

实现说明：走 REST（每个仓库一次 /repos/{owner}/{repo}）而不是 GraphQL 的 node-id
批量查询 —— 后者的 id 形式是 GitHub 内部的，拼出来的 id 一律 NOT_FOUND，没法用。
认证后 REST 限额是 5000 次/小时，而这里总共几百个仓库，够用；并发 8 路，约一分钟。

用法：
    python scripts/check_gone_projects.py                 # 检查并写入（有变化才写）
    python scripts/check_gone_projects.py --dry-run       # 只报告
    python scripts/check_gone_projects.py --limit 20      # 只查前 20 个（调试）
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = REPO_ROOT / "src" / "content" / "posts"
SNAPSHOT_DIR = REPO_ROOT / "src" / "content" / "projects"
OUTPUT_PATH = REPO_ROOT / "config" / "projects-gone.json"
WORKERS = 8

HEADING_RE = re.compile(r"^###\s+\d+\.\s+\[([^\]]+)\]\(([^)]+)\)\s*$", re.MULTILINE)
SNAPSHOT_LINK_RE = re.compile(r"projects/[^/]+/[^/]+/?$")
FULL_NAME_RE = re.compile(r'^fullName:\s*"([^"]+)"', re.MULTILINE)


def log(message: str) -> None:
    print(message, flush=True)


def token() -> str:
    value = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if value:
        return value.strip()
    # Fall back to the gh CLI's stored credential so this works locally too.
    try:
        return subprocess.run(
            ["gh", "auth", "token"], capture_output=True, text=True, check=True
        ).stdout.strip()
    except Exception:  # noqa: BLE001
        return ""


def load_snapshot_names() -> set[str]:
    names: set[str] = set()
    if not SNAPSHOT_DIR.exists():
        return names
    for path in SNAPSHOT_DIR.glob("*.md"):
        match = FULL_NAME_RE.search(path.read_text(encoding="utf-8", errors="replace"))
        if match:
            names.add(match.group(1).lower())
    return names


def collect_external_projects() -> dict[str, str]:
    """站内没有快照的项目 —— 这些只能在卡片上直连 GitHub。"""
    snapshot_names = load_snapshot_names()
    projects: dict[str, str] = {}

    for path in sorted(POSTS_DIR.glob("daily-*.md")):
        text = path.read_text(encoding="utf-8", errors="replace")
        for full_name, link in HEADING_RE.findall(text):
            if "/" not in full_name:
                continue
            # 站内快照链接 + 真有快照 = 卡片会跳站内，不需要这个检查
            if SNAPSHOT_LINK_RE.search(link) and full_name.lower() in snapshot_names:
                continue
            projects.setdefault(full_name, str(path.relative_to(REPO_ROOT)))

    return projects


def repo_exists(full_name: str, auth: str) -> bool | None:
    """True / False，None 表示这次没查出来（网络或限流），不要据此判定为死链。"""
    request = urllib.request.Request(
        f"https://api.github.com/repos/{full_name}",
        headers={
            "Authorization": f"bearer {auth}",
            "Accept": "application/vnd.github+json",
            "User-Agent": "blog-gone-project-check",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=30):
            return True
    except urllib.error.HTTPError as error:
        if error.code == 404:
            return False
        # 403/429 通常是限流，不能当成「仓库不存在」
        return None
    except Exception:  # noqa: BLE001
        return None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="只报告，不写文件")
    parser.add_argument("--limit", type=int, default=0, help="只检查前 N 个（调试）")
    args = parser.parse_args()

    projects = collect_external_projects()
    names = sorted(projects)
    if args.limit:
        names = names[: args.limit]
    log(f"站内无快照、需要直连 GitHub 的项目: {len(names)}")

    auth = token()
    if not auth:
        log("缺少 GitHub 凭据（GITHUB_TOKEN / GH_TOKEN / gh auth），跳过检查")
        return 0

    log(f"开始逐个检查（{WORKERS} 路并发）…")
    outcomes: dict[str, bool] = {}
    unknown: list[str] = []
    done = 0
    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        for name, result in zip(names, pool.map(lambda n: repo_exists(n, auth), names)):
            done += 1
            if result is None:
                unknown.append(name)
            else:
                outcomes[name] = result
            if done % 50 == 0 or done == len(names):
                log(f"  {done}/{len(names)}")

    gone = sorted(name for name, alive in outcomes.items() if not alive)
    log(f"\n仍然存在: {sum(1 for alive in outcomes.values() if alive)}")
    log(f"已不存在: {len(gone)}")
    if unknown:
        log(f"本次未能确认（限流/网络，已按「存在」处理）: {len(unknown)}")

    payload = {
        "checkedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "note": "仓库已从 GitHub 删除或转为私有；链接会 404，页面上不再做成可点击的按钮。",
        "projects": [{"fullName": name, "seenIn": projects[name]} for name in gone],
    }

    if args.dry_run:
        log("\n--dry-run：未写入文件")
        for name in gone[:20]:
            log(f"  {name}")
        return 0

    previous = {}
    if OUTPUT_PATH.exists():
        previous = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
    previous_names = {item["fullName"] for item in previous.get("projects", [])}
    if previous_names == set(gone) and previous.get("projects"):
        log("结果与现有配置一致，不重写文件")
        return 0

    OUTPUT_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    log(f"已写入 {OUTPUT_PATH.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
