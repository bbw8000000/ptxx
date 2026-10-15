#!/usr/bin/env python3
"""Create safe, static project metadata and README snapshots for the blog."""

import argparse
import base64
import json
import os
import re
import urllib.parse
import time
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta

MAX_README_CHARS = 50_000
RETRYABLE_HTTP_STATUS = {429, 500, 502, 503, 504}
POLICY_PATH = os.path.join(
    os.path.dirname(__file__), "..", "config", "project-safety.json"
)
PROJECT_LINK_RE = re.compile(
    r"https://github\.com/([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)/?$",
    re.IGNORECASE,
)

# 抓取失败时写进正文的占位句。用它来判断一份快照是不是「空壳」：
# 页面的集合来自日报正文里的链接，而快照只对当天 trending 列表抓取，
# 两个集合必然漂移，所以需要能识别出哪些仓库还没被真正补上。
SNAPSHOT_FALLBACK_MARKER = "当前仅保存了项目摘要"

# 有些被日报链接过的仓库后来在 GitHub 上被删掉了（首批 10 个里就有 4 个 404，
# 多是些加密货币骗局仓库被平台下架）。这些页面永远填不上内容，记下来跳过，
# 免得每次回填都白耗 API 调用。
SKIP_LIST_PATH = os.path.join(
    os.path.dirname(__file__), "..", "config", "projects-without-readme.json"
)

# 仓库改名/转手后，日报正文里留下的还是旧名字，而快照文件是按新名字建的。
# 把「旧名 -> 现行名」记在这里，让页面能把两边对上（否则卡片会一直指向 GitHub，
# 明明站内已经有可以读的 README 页面）。实测这批回填里 9 个候选全部是改名过。
ALIAS_PATH = os.path.join(
    os.path.dirname(__file__), "..", "config", "project-aliases.json"
)
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def load_aliases() -> dict[str, str]:
    if not os.path.exists(ALIAS_PATH):
        return {}
    try:
        with open(ALIAS_PATH, "r", encoding="utf-8") as handle:
            payload = json.load(handle)
    except (ValueError, OSError) as error:
        print(f"  Alias file unreadable, ignoring it: {error}")
        return {}
    aliases = payload.get("aliases") or {}
    return {
        str(old).lower(): str(new)
        for old, new in aliases.items()
        if old and new
    }


def save_renames(renames: dict[str, str]) -> None:
    """合并新发现的改名记录；只增不改，避免旧名字的映射被覆盖掉。"""
    merged = load_aliases()
    for old, new in renames.items():
        merged[old.lower()] = new
    payload = {
        "note": (
            "仓库改名或转手后的旧名到现行名映射。日报正文里记的是收录当时的名字，"
            "改过名的仓库需要靠这张表才能对上站内快照页。由 "
            "scripts/github_project_snapshot.py 在抓取时自动记录。"
        ),
        "aliases": {key: merged[key] for key in sorted(merged)},
    }
    os.makedirs(os.path.dirname(ALIAS_PATH), exist_ok=True)
    with open(ALIAS_PATH, "w", encoding="utf-8", newline="\n") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def load_skip_entries() -> list[dict]:
    if not os.path.exists(SKIP_LIST_PATH):
        return []
    try:
        with open(SKIP_LIST_PATH, "r", encoding="utf-8") as handle:
            payload = json.load(handle)
    except (ValueError, OSError) as error:
        print(f"  Skip list unreadable, ignoring it: {error}")
        return []
    entries = payload.get("projects")
    return entries if isinstance(entries, list) else []


def skipped_lookup(entries: list[dict]) -> set[str]:
    return {
        str(item.get("fullName", "")).lower()
        for item in entries
        if item.get("fullName")
    }


def save_skip_entries(entries: list[dict], newly_dead: list[str]) -> None:
    merged: dict[str, dict] = {}
    for item in entries:
        name = str(item.get("fullName", ""))
        if name:
            merged[name.lower()] = {
                "fullName": name,
                "reason": str(item.get("reason") or "not-found"),
            }
    for name in newly_dead:
        merged.setdefault(name.lower(), {"fullName": name, "reason": "not-found"})

    payload = {
        "note": (
            "这些仓库已无法从 GitHub 取到（被删除或转为私有），站内无法生成 README 快照。"
            "回填时跳过，避免每次白耗 API 调用。"
        ),
        "projects": [merged[key] for key in sorted(merged)],
    }
    os.makedirs(os.path.dirname(SKIP_LIST_PATH), exist_ok=True)
    with open(SKIP_LIST_PATH, "w", encoding="utf-8", newline="\n") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)
        handle.write("\n")

with open(POLICY_PATH, "r", encoding="utf-8") as policy_file:
    PROJECT_SAFETY_POLICY = json.load(policy_file)

MIRROR_BLOCK_RE = re.compile(
    "|".join(
        f"(?:{pattern})"
        for pattern in PROJECT_SAFETY_POLICY["restrictedProjectPatterns"]
    ),
    re.IGNORECASE,
)

def safe_https_url(value: object, allow_github: bool = True) -> str:
    text = str(value or "").strip()
    try:
        parsed = urllib.parse.urlsplit(text)
    except ValueError:
        return ""
    if parsed.scheme != "https" or not parsed.hostname:
        return ""
    if not allow_github and parsed.hostname.lower() in {
        "github.com", "www.github.com", "raw.githubusercontent.com"
    }:
        return ""
    return urllib.parse.quote(text, safe="/:#?[]@!$&'*+,;=%")


def sanitize_readme_markdown(value: str) -> str:
    text = value.replace("\r\n", "\n").replace("\r", "\n").replace("\x00", "")
    text = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)
    text = re.sub(r"</?[A-Za-z][^>]*>", "", text, flags=re.DOTALL)
    text = re.sub(
        r"!\[([^\]]*)\]\((?:[^()]|\([^)]*\))*\)",
        lambda match: f"*图片：{match.group(1).strip()}*" if match.group(1).strip() else "",
        text,
    )
    text = re.sub(r"^\s*\[[^\]]+\]:\s*data:[^\n]+$", "", text,
                  flags=re.MULTILINE | re.IGNORECASE)

    def clean_link(match: re.Match) -> str:
        label = match.group(1).strip()
        url = match.group(2).strip().strip("<>")
        safe_url = safe_https_url(url, allow_github=False)
        return f"[{label}]({safe_url})" if safe_url else label

    text = re.sub(r"(?<!!)\[([^\]\n]+)\]\(([^)\n]+)\)", clean_link, text)
    text = re.sub(r"(?i)javascript\s*:", "blocked:", text)
    text = re.sub(r"\n{4,}", "\n\n\n", text).strip()
    text = text[:MAX_README_CHARS].rstrip()
    if text.count("```") % 2:
        text += "\n```"
    return text


def api_get(url: str, headers: dict, attempts: int = 3) -> dict:
    request = urllib.request.Request(url, headers=headers)
    for attempt in range(attempts):
        try:
            with urllib.request.urlopen(request, timeout=20) as response:
                return json.loads(response.read())
        except urllib.error.HTTPError as error:
            if error.code not in RETRYABLE_HTTP_STATUS or attempt == attempts - 1:
                raise
            delay = 2 ** attempt
        except (urllib.error.URLError, ConnectionError, TimeoutError):
            if attempt == attempts - 1:
                raise
            delay = 2 ** attempt
        print(f"  GitHub API retry in {delay}s: {url}")
        time.sleep(delay)

    raise RuntimeError(f"GitHub API failed without an error: {url}")


def fetch_readme(repo: dict, headers: dict) -> str:
    full_name = str(repo.get("full_name") or "")
    if not PROJECT_LINK_RE.match(f"https://github.com/{full_name}"):
        return ""
    path = urllib.parse.quote(full_name, safe="/")
    try:
        payload = api_get(f"https://api.github.com/repos/{path}/readme", headers)
        raw = base64.b64decode(payload.get("content") or "", validate=False)
        return sanitize_readme_markdown(raw.decode("utf-8", errors="replace"))
    except Exception as error:
        print(f"  README snapshot skipped for {full_name}: {error}")
        return ""


def snapshot_filename(full_name: str) -> str:
    owner, name = full_name.split("/", 1)
    return f"{owner.lower()}--{name.lower()}.md"
def is_safe_snapshot(repo: dict) -> bool:
    searchable = " ".join([
        str(repo.get("full_name") or ""),
        str(repo.get("description") or ""),
        " ".join(str(topic) for topic in (repo.get("topics") or [])),
    ])
    return MIRROR_BLOCK_RE.search(searchable) is None



def project_markdown(repo: dict, readme: str, snapshot_date: str) -> str:
    full_name = str(repo.get("full_name") or "")
    owner, name = full_name.split("/", 1)
    description = str(repo.get("description") or f"开源项目 {full_name} 的站内资料。")
    source_url = safe_https_url(repo.get("html_url")) or f"https://github.com/{full_name}"
    homepage = safe_https_url(repo.get("homepage"), allow_github=False)
    license_name = (repo.get("license") or {}).get("spdx_id") or "未标注"
    topics = [str(topic)[:80] for topic in (repo.get("topics") or [])[:8]]
    body = readme or f"## 项目简介\n\n{description}\n\n当前仅保存了项目摘要，完整 README 将在后续快照更新时补充。"

    fields = {
        "title": full_name,
        "owner": owner,
        "name": name,
        "fullName": full_name,
        "description": description,
        "sourceUrl": source_url,
        "stars": int(repo.get("stargazers_count") or 0),
        "forks": int(repo.get("forks_count") or 0),
        "language": str(repo.get("language") or "未知"),
        "topics": topics,
        "license": str(license_name),
        "homepage": homepage or None,
        "defaultBranch": str(repo.get("default_branch") or "main"),
        "snapshotDate": snapshot_date,
        "pushedAt": repo.get("pushed_at") or None,
    }
    frontmatter = "\n".join(
        f"{key}: {json.dumps(value, ensure_ascii=False)}"
        for key, value in fields.items()
        if value is not None
    )
    return (
        f"---\n{frontmatter}\n---\n\n"
        "> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。\n\n"
        f"{body}\n"
    )


def write_project_snapshots(repos: list[dict], output_dir: str,
                            headers: dict, snapshot_date: str) -> list[str]:
    os.makedirs(output_dir, exist_ok=True)
    written = []
    for repo in repos:
        full_name = str(repo.get("full_name") or "")
        if not PROJECT_LINK_RE.match(f"https://github.com/{full_name}"):
            continue
        if not is_safe_snapshot(repo):
            print(f"  Project snapshot blocked by safety policy: {full_name}")
            continue
        path = os.path.join(output_dir, snapshot_filename(full_name))
        readme = fetch_readme(repo, headers)
        if not readme and os.path.exists(path):
            print(
                f"  Existing snapshot preserved after README fetch failure: {full_name}"
            )
            continue
        with open(path, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(project_markdown(repo, readme, snapshot_date))
        written.append(path)
        print(f"  Project snapshot: {full_name}")
    return written


def repos_from_post(path: str) -> list[str]:
    with open(path, "r", encoding="utf-8") as handle:
        content = handle.read()
    return list(dict.fromkeys(
        f"{owner}/{name}"
        for owner, name in re.findall(
            r"https://github\.com/([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)\)?",
            content,
        )
    ))


def has_real_snapshot(output_dir: str, full_name: str) -> bool:
    path = os.path.join(output_dir, snapshot_filename(full_name))
    if not os.path.exists(path):
        return False
    with open(path, "r", encoding="utf-8") as handle:
        return SNAPSHOT_FALLBACK_MARKER not in handle.read()


def missing_snapshot_repos(posts_dir: str, output_dir: str,
                           skip: set[str] | None = None) -> list[str]:
    """按时间顺序列出「被日报链接过、但站内没有真实 README 快照」的仓库。

    从最早的日报开始，所以每批回填补的都是被链接最久、空得最久的那些。
    skip 里的仓库已知在 GitHub 上不存在，直接略过。
    """
    skipped = skip or set()
    ordered: list[str] = []
    seen: set[str] = set()
    for filename in sorted(os.listdir(posts_dir)):
        if not filename.endswith(".md") or filename.startswith("risk-daily-"):
            continue
        for full_name in repos_from_post(os.path.join(posts_dir, filename)):
            key = full_name.lower()
            if key in seen or key in skipped:
                continue
            seen.add(key)
            if not has_real_snapshot(output_dir, full_name):
                ordered.append(full_name)
    return ordered


def main() -> None:
    parser = argparse.ArgumentParser()
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--from-post")
    source.add_argument("--repo", action="append", default=[])
    source.add_argument(
        "--missing-snapshots",
        action="store_true",
        help="回填：扫描全部日报，补齐没有真实 README 快照的仓库",
    )
    parser.add_argument("--posts-dir", default=os.path.join(
        os.path.dirname(__file__), "..", "src", "content", "posts"))
    parser.add_argument("--output", default=os.path.join(
        os.path.dirname(__file__), "..", "src", "content", "projects"))
    parser.add_argument("--limit", type=int, default=10)
    args = parser.parse_args()

    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "blog-project-snapshot",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    repos = []
    skip_entries: list[dict] = []
    newly_dead: list[str] = []
    renames: dict[str, str] = {}
    if args.missing_snapshots:
        skip_entries = load_skip_entries()
        pending = missing_snapshot_repos(
            args.posts_dir, args.output, skipped_lookup(skip_entries)
        )
        print(f"缺少真实 README 快照的仓库：{len(pending)} 个"
              f"（另有 {len(skip_entries)} 个已知无源，跳过）；"
              f"本批处理前 {min(args.limit, len(pending))} 个（从最早的日报开始）")
        requested_repos = pending
    else:
        requested_repos = args.repo or repos_from_post(args.from_post)

    for full_name in requested_repos[:args.limit]:
        path = urllib.parse.quote(full_name, safe="/")
        try:
            repo = api_get(f"https://api.github.com/repos/{path}", headers)
            repos.append(repo)
            # 仓库改名/转手后，用旧名字请求也能拿到数据，但返回的 full_name 是新名字
            # （GitHub 会 301 重定向）。这个差异必须记下来：日报里写的是旧名字，
            # 而快照文件是按新名字建的，不记的话卡片永远匹配不上站内页。
            canonical = str(repo.get("full_name") or "")
            if canonical and canonical.lower() != full_name.lower():
                renames[full_name] = canonical
                print(f"  Renamed: {full_name} -> {canonical}")
        except urllib.error.HTTPError as error:
            if error.code == 404:
                newly_dead.append(full_name)
                print(f"  Repo no longer exists (404): {full_name}")
            else:
                print(f"  Project metadata skipped for {full_name}: {error}")
        except Exception as error:
            print(f"  Project metadata skipped for {full_name}: {error}")

    bjt = timezone(timedelta(hours=8))
    written = write_project_snapshots(repos, args.output, headers,
                                      datetime.now(bjt).strftime("%Y-%m-%d"))

    if renames:
        save_renames(renames)
        print(f"已记录 {len(renames)} 个改名/转手的仓库到 "
              f"{os.path.relpath(ALIAS_PATH, REPO_ROOT)}")

    if args.missing_snapshots:
        if newly_dead:
            save_skip_entries(skip_entries, newly_dead)
            print(f"已记录 {len(newly_dead)} 个 404 仓库到 "
                  f"config/projects-without-readme.json")
        still = missing_snapshot_repos(
            args.posts_dir, args.output, skipped_lookup(load_skip_entries())
        )
        print(f"\n回填结果：写入 {len(written)} 个，仍缺 {len(still)} 个")


if __name__ == "__main__":
    main()
