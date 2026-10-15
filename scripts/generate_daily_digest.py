#!/usr/bin/env python3
"""自动生成 GitHub 每日精选博客文章。

从 GitHub Search API 获取最近热度最高的新建开源项目，
将正常项目与风险仓库分流，生成技术精选、风险观察和 SVG 封面图。

用法:
    python scripts/generate_daily_digest.py          # 生成今天的文章
    python scripts/generate_daily_digest.py --dry-run # 只打印不写入
    python scripts/generate_daily_digest.py --self-test # 本地过滤规则自测
"""

import html
import io
import json
import os
import re
import sys
import tempfile
import urllib.request
import urllib.parse
from datetime import datetime, timezone, timedelta
from unittest.mock import patch
from github_project_snapshot import (
    MIRROR_BLOCK_RE,
    is_safe_snapshot,
    sanitize_readme_markdown,
    write_project_snapshots,
)

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

POSTS_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "content", "posts")
HERO_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "hero")
PROJECTS_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "content", "projects")

BJT = timezone(timedelta(hours=8))
today = datetime.now(BJT)
date_str = today.strftime("%Y-%m-%d")

DRY_RUN = "--dry-run" in sys.argv
SELF_TEST = "--self-test" in sys.argv

# ── Spam detection ──────────────────────────────────────────────

SPAM_PATTERNS = [
    # Keyword-stuffed descriptions (repeated phrases)
    (r"(\b\w+\b).*\1.*\1.*\1.*\1.*\1", "keyword_stuffing"),
    # Crypto trading bots
    (r"(?i)(trading\s*bot|arbitrage\s*bot|sniper\s*bot|meme[\s-]*coin)",
     "crypto_bot"),
    # Pirated software / warez
    (r"(?i)(keygen|activator|crack|license\s*key|patcher|pre[\s-]*activated)",
     "warez"),
    # Roblox executors
    (r"(?i)(roblox\s*(script|execut|hub)|blox\s*fruit)",
     "roblox_executor"),
    # Game cheats, aimbots, ESP/wallhacks and similar repositories
    (r"(?i)(aimbot|wallhack|\bgod\s*mode\b|fly\s*hack|teleport\s*hack|"
     r"game\s*cheat|cheat\s*tool|hack\s*tool|internal\s*cheat|\besp\s+wall)",
     "game_cheat"),
    # Credential theft and packaged malware
    (r"(?i)(credential\s*stealer|token\s*grabber|password\s*stealer|"
     r"ransomware\s*(builder|source)|remote\s*access\s*trojan)",
     "malware"),
    # Fake QuickBooks / cracked desktop software
    (r"(?i)(quickbooks\s*desktop.*workflow|\b(lsfg|reiboot|tenorshare)\b)",
     "fake_desktop_soft"),
    # Crypto sportsbook / betting
    (r"(?i)(crypto\s*sportsbook|world\s*cup.*bet|betting\s*platform)",
     "crypto_betting"),
    # Stock/template spam with no real description
    (r"^(暂无描述)?$", "no_description"),
    # Description too short + suspicious name pattern
    (r"^[A-Z][a-z]+ [A-Z][a-z]+$", "suspicious_brief"),
    # "Professional" seed phrase / wallet "toolkit" (usually scams)
    (r"(?i)(seed\s*(phrase|generator)|mnemonic.*(generator|recovery|brute))",
     "crypto_scam"),
    # "Lossless Scaling" / game performance cracks
    (r"(?i)(lossless\s*scaling.*activator|frame\s*generation.*keygen)",
     "game_crack"),
]

SPAM_TOPIC_KEYWORDS = [
    "polymarket", "pumpfun", "pump-fun", "sportsbook",
    "trading-bot", "arbitrage", "sniper", "meme-coin",
    "keygen", "activator", "cracked", "warez",
    "roblox", "blox-fruit", "delta-exec",
    "aimbot", "wallhack", "game-cheat", "cheat-tool",
    "meccha-chameleon", "neverlose", "cs2-cheat",
    "seed-phrase", "mnemonic", "brute-force",
    "quickbooks", "lossless-scaling", "reiboot",
]

QUALITY_TOPICS = [
    "ai", "agent", "llm", "ml", "framework", "tool", "sdk",
    "rust", "python", "typescript", "go", "react", "vue",
    "cli", "api", "server", "database", "compiler",
    "language", "model", "inference", "training",
    "web", "browser", "editor", "vscode", "plugin",
    "open-source", "library", "utility",
]

RISK_REPORT_REASONS = {
    "warez",
    "roblox_executor",
    "game_cheat",
    "malware",
    "crypto_scam",
    "game_crack",
    "crypto_bot",
}

RISK_REASON_LABELS = {
    "warez": "破解或盗版软件",
    "roblox_executor": "游戏脚本执行器",
    "game_cheat": "外挂或作弊工具",
    "malware": "凭据窃取或恶意软件",
    "crypto_scam": "助记词或钱包风险",
    "game_crack": "游戏破解工具",
    "crypto_bot": "高风险加密交易工具",
}


def is_spam(repo: dict) -> tuple[bool, str]:
    """Check if a repo looks like spam/scam. Returns (is_spam, reason)."""
    name = repo.get("full_name", "").lower()
    desc = (repo.get("description") or "暂无描述").lower()
    topics = [t.lower() for t in repo.get("topics", [])]

    # 关键词模式要逐个字段检查：仓库名、描述、标签都算。
    #
    # 原来只拿 desc 去匹配，而 name 取出来根本没用 —— 于是名字里明写着
    # Discord-Token-Grabber-2026-Tool、描述却写得很正常的仓库一路放行，
    # 被当成「每日精选」推荐了出去（实测 165 个已被 GitHub 下架的不良仓库里，
    # 有 25 个名字明确命中规则却没被拦住）。
    #
    # 必须逐字段而不是拼接后匹配：SPAM_PATTERNS 里有 ^...$ 这类锚定模式
    # （如「描述为空」），拼成一个长串会让它们永远匹配不上。
    for pattern, reason in SPAM_PATTERNS:
        for field in (name, desc, *topics):
            if field and re.search(pattern, field):
                return True, reason

    # 复用 config/project-safety.json。这份规则此前只用于「阻断快照」，
    # 日报的推荐筛选完全没走它，导致两边标准不一致：同一个仓库
    # 快照被拦下、却仍然出现在推荐位。
    for field in (name, desc, *topics):
        if field and MIRROR_BLOCK_RE.search(field):
            return True, "project_safety_policy"

    # 命中两个强关键词就足够。原来要求累计 3 个，
    # 等于要求一个垃圾仓库在名字/描述/标签里同时踩中三个词，太宽松。
    spam_score = 0
    for kw in SPAM_TOPIC_KEYWORDS:
        if kw in name or kw in desc:
            spam_score += 1
        for t in topics:
            if kw in t:
                spam_score += 1

    if spam_score >= 2:
        return True, "topic_spam_accumulated"

    # Duplicate descriptions (exact match across repos)
    # handled at the collection level

    return False, ""


def repo_quality_score(repo: dict) -> int:
    """Higher score = more likely a quality project."""
    score = 0
    name = repo.get("full_name", "").lower()
    desc = (repo.get("description") or "").lower()
    lang = (repo.get("language") or "").lower()
    topics = [t.lower() for t in repo.get("topics", [])]
    stars = repo.get("stargazers_count", 0)

    # Bonus for having a real description
    if len(desc) > 30:
        score += 2
    # Bonus for quality topics
    for kw in QUALITY_TOPICS:
        if kw in name or kw in desc:
            score += 1
        for t in topics:
            if kw in t:
                score += 1
    # Bonus for real language
    if lang and lang != "未知":
        score += 1
    # Bonus for organic-looking star range
    if 30 <= stars <= 5000:
        score += 1

    return score


# ── GitHub API ──────────────────────────────────────────────────

def github_api_headers() -> dict:
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "blog-daily-digest",
    }
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def github_search(query: str, per_page: int = 30) -> list[dict]:
    url = f"https://api.github.com/search/repositories?{
        urllib.parse.urlencode({
            'q': query, 'sort': 'stars', 'order': 'desc',
            'per_page': per_page
        })
    }"
    req = urllib.request.Request(url, headers=github_api_headers())
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read())["items"]
    except Exception as e:
        print(f"  GitHub API error: {e}")
        return []


# ── Trending fetch ──────────────────────────────────────────────


def get_trending_repos() -> tuple[list[dict], list[dict]]:
    """Return quality projects and a separately isolated risk report list."""
    is_weekend = today.weekday() >= 5  # Saturday=5, Sunday=6

    if is_weekend:
        window_days = 3
        min_stars = 50
    else:
        window_days = 1
        min_stars = 30

    since = (today - timedelta(days=window_days)).strftime("%Y-%m-%d")
    query = f"created:>={since} stars:>={min_stars}"
    print(f"  Query: {query} (weekend={is_weekend}, window={window_days}d)")

    repos = github_search(query, per_page=30)

    # If results are thin, widen
    if len(repos) < 15:
        wider_since = (today - timedelta(days=window_days + 2)).strftime("%Y-%m-%d")
        query2 = f"created:>={wider_since} stars:>={max(min_stars - 20, 20)}"
        extra = github_search(query2, per_page=20)
        seen = {r["full_name"] for r in repos}
        for r in extra:
            if r["full_name"] not in seen:
                repos.append(r)

    # Filter spam
    filtered = []
    risk_repos = []
    seen_descs = {}
    for r in repos:
        spam, reason = is_spam(r)
        if spam:
            print(f"  Filtered: {r['full_name']} ({reason})")
            if reason in RISK_REPORT_REASONS:
                risk_item = dict(r)
                risk_item["_risk_reason"] = reason
                risk_repos.append(risk_item)
            continue
        # Deduplicate by description
        desc = (r.get("description") or "").strip()
        if desc and desc in seen_descs:
            print(f"  Filtered: {r['full_name']} (dup desc with "
                  f"{seen_descs[desc]})")
            continue
        if desc:
            seen_descs[desc] = r["full_name"]
        filtered.append(r)

    # Sort by quality score then stars, interleaved
    for r in filtered:
        r["_quality"] = repo_quality_score(r)
    filtered.sort(key=lambda r: (r["_quality"], r.get(
        "stargazers_count", 0)), reverse=True)

    risk_repos.sort(key=lambda r: r.get("stargazers_count", 0), reverse=True)
    return filtered[:10], risk_repos[:10]


# ── Formatting ──────────────────────────────────────────────────


def format_stars(n: int) -> str:
    if n >= 1000:
        return f"{n / 1000:.1f}k"
    return str(n)

MARKDOWN_SPECIALS_RE = re.compile(r"([\\*_{}\[\]()#+.!|])")
MARKDOWN_UNESCAPE_RE = re.compile(r"\\([\\*_{}\[\]()#+.!|])")

def sanitize_external_text(value: object, max_length: int = 1000) -> str:
    """Return one-line external text that cannot open Markdown or raw HTML."""
    text = html.unescape(str(value or ""))
    text = MARKDOWN_UNESCAPE_RE.sub(r"\1", text)
    text = "".join(ch if ord(ch) >= 32 else " " for ch in text)
    text = re.sub(r"\s+", " ", text).strip()
    text = text[:max_length]
    text = html.escape(text, quote=False)
    text = text.replace(chr(96), "\\" + chr(96))
    return MARKDOWN_SPECIALS_RE.sub(lambda match: "\\" + match.group(1), text)


def sanitize_external_url(value: object) -> str:
    """Allow only canonical HTTPS GitHub links in generated Markdown."""
    text = str(value or "").strip()
    try:
        parsed = urllib.parse.urlsplit(text)
    except ValueError:
        return ""
    if parsed.scheme != "https":
        return ""
    if parsed.hostname not in {"github.com", "www.github.com"}:
        return ""
    return urllib.parse.quote(text, safe="/:#?[]@!$&'*+,;=%")


LANG_COLORS = {
    "Python": "#3572A5", "JavaScript": "#f1e05a", "TypeScript": "#3178c6",
    "Go": "#00ADD8", "Rust": "#dea584", "Java": "#b07219",
    "C++": "#f34b7d", "C": "#555555", "Ruby": "#701516",
    "PHP": "#4F5D95", "Swift": "#F05138", "Kotlin": "#A97BFF",
    "Shell": "#89e051", "Lua": "#000080", "Zig": "#ec915c",
    "Dart": "#00B4AB", "Vue": "#41b883", "Svelte": "#ff3e00",
}


def generate_post(repos: list[dict]) -> str:
    repo_lines = []
    for i, repo in enumerate(repos, 1):
        name = sanitize_external_text(repo.get("full_name"), 200)
        desc = sanitize_external_text(repo.get("description") or "暂无描述", 800)
        stars = repo.get("stargazers_count", 0)
        lang = sanitize_external_text(repo.get("language") or "未知", 80)
        full_name = str(repo.get("full_name") or "")
        owner, repo_name = full_name.split("/", 1)
        url = f"../../projects/{urllib.parse.quote(owner)}/{urllib.parse.quote(repo_name)}/"
        topics = [sanitize_external_text(topic, 100) for topic in repo.get("topics", [])[:5]]

        topic_tags = " ".join(f"`{t}`" for t in topics) if topics else ""

        repo_lines.append(f"""### {i}. [{name}]({url})

> {desc}

⭐ **{format_stars(stars)}** stars · 语言: **{lang}** {topic_tags}""")

    repos_md = "\n\n".join(repo_lines)

    return f"""---
title: "GitHub 每日精选 {date_str}"
description: "今天 GitHub 上最火的开源项目，从 AI 工具到系统编程，每日精选不容错过。"
pubDate: {date_str}
heroImage: "/hero/daily-{date_str}.svg"
category: "技术日报"
tags: ["GitHub", "开源", "每日精选", "技术"]
featured: false
---

每天从 GitHub 挖掘最值得关注的新开源项目。这些项目在过去 24 小时内获得了大量 Star 关注，代表了社区的最新热点方向。

<!--more-->

{repos_md}

---

> 数据来源: GitHub Trending · 更新时间: {today.strftime("%Y-%m-%d %H:%M")} CST
"""


def generate_risk_post(repos: list[dict]) -> str:
    repo_lines = []
    for i, repo in enumerate(repos, 1):
        name = sanitize_external_text(repo.get("full_name"), 200)
        desc = sanitize_external_text(repo.get("description") or "暂无描述", 800)
        stars = repo.get("stargazers_count", 0)
        lang = sanitize_external_text(repo.get("language") or "未知", 80)
        reason = repo.get("_risk_reason", "unknown")
        reason_label = RISK_REASON_LABELS.get(reason, "需要人工复核")

        repo_lines.append(f"""### {i}. `{name}`

风险分类：**{reason_label}** · Star：**{format_stars(stars)}** · 语言：**{lang}**

> {desc}""")

    repos_md = "\n\n".join(repo_lines)

    return f"""---
title: "风险仓库观察 {date_str}"
description: "从 GitHub 热门项目中隔离出的外挂、破解与恶意软件风险记录，仅供安全观察。"
pubDate: {date_str}
category: "风险观察"
tags: ["GitHub", "风险观察", "安全"]
featured: false
draft: true
noindex: true
---

> **风险提示**：本页仅记录自动筛选结果，不代表推荐、安全认证或使用建议。页面不提供下载链接，请勿运行来源不明的代码。

> **误报说明**：自动规则可能误判。仓库名称与描述仅用于人工复核。

<!--more-->

{repos_md}

---

> 数据来源：GitHub Search API · 观察时间：{today.strftime("%Y-%m-%d %H:%M")} CST
"""


def generate_svg(repos: list[dict]) -> str:
    hue = (today.timetuple().tm_yday * 37) % 360
    hue2 = (hue + 45) % 360
    day_label = today.strftime("%m.%d")

    top3 = []
    for r in repos[:3]:
        short = r["name"]
        if len(short) > 18:
            short = short[:16] + ".."
        top3.append(short)

    top3_text = " · ".join(top3) if top3 else "Loading..."

    repo_lines_svg = []
    for i, r in enumerate(repos[:6]):
        y = 230 + i * 34
        name = r["name"][:20]
        stars = format_stars(r.get("stargazers_count", 0))
        lang = r.get("language") or "?"
        color = LANG_COLORS.get(lang, "#888")
        repo_lines_svg.append(f"""
    <circle cx="530" cy="{y - 4}" r="5" fill="{color}" opacity="0.8"/>
    <text x="545" y="{y}" font-family="system-ui, sans-serif" font-size="14"
          fill="white" opacity="0.9">{name}</text>
    <text x="780" y="{y}" font-family="system-ui, sans-serif" font-size="12"
          fill="white" opacity="0.5" text-anchor="end">⭐ {stars}</text>""")

    repos_svg = "\n".join(repo_lines_svg)

    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 506"
     width="900" height="506">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl({hue}, 60%, 18%)"/>
      <stop offset="100%" stop-color="hsl({hue2}, 50%, 12%)"/>
    </linearGradient>
  </defs>
  <rect width="900" height="506" rx="16" fill="url(#bg)"/>
  <circle cx="800" cy="50" r="120" fill="white" opacity="0.04"/>
  <circle cx="120" cy="460" r="80" fill="white" opacity="0.03"/>
  <rect x="120" y="30" width="100" height="28" rx="14"
        fill="hsl({hue}, 70%, 50%)" opacity="0.8"/>
  <text x="170" y="49" font-family="system-ui, sans-serif" font-size="12"
        font-weight="600" fill="white" text-anchor="middle">DAILY</text>
  <text x="130" y="110" font-family="system-ui, sans-serif" font-size="48"
        font-weight="700" fill="white" opacity="0.15">{day_label}</text>
  <text x="130" y="165"
        font-family="'Noto Serif SC', 'LXGW WenKai', Georgia, serif"
        font-size="36" font-weight="700" fill="white">GitHub 每日精选</text>
  <text x="130" y="210" font-family="system-ui, sans-serif" font-size="16"
        fill="white" opacity="0.6">{top3_text}</text>
  {repos_svg}
  <line x1="130" y1="466" x2="850" y2="466" stroke="white"
        stroke-width="1" opacity="0.1"/>
  <text x="130" y="490" font-family="system-ui, sans-serif" font-size="11"
        fill="white" opacity="0.3">github.com/trending · {date_str}</text>
</svg>'''


# ── Main ────────────────────────────────────────────────────────


def run_self_test():
    clean_repo = {
        "full_name": "demo/useful-cli",
        "description": "A practical open-source CLI for developer workflows.",
        "topics": ["cli", "developer-tool"],
        "language": "Python",
        "stargazers_count": 120,
    }
    cheat_repo = {
        "full_name": "demo/game-aimbot",
        "description": "Complete cheat tool with aimbot and wallhack features.",
        "topics": ["aimbot", "game-cheat"],
        "language": "Python",
        "stargazers_count": 80,
    }
    malicious_repo = {
        **clean_repo,
        "full_name": "demo/markdown-test",
        "description": '<img src=x onerror=alert(1)>\n### injected [unsafe](javascript:alert(1))',
        "html_url": "https://github.com/demo/markdown-test",
    }
    malicious_risk_repo = {
        **malicious_repo,
        "_risk_reason": "malware",
    }

    assert is_spam(clean_repo) == (False, "")
    blocked, reason = is_spam(cheat_repo)
    assert blocked and reason == "game_cheat"
    cheat_repo["_risk_reason"] = reason
    report = generate_risk_post([cheat_repo])
    assert "draft: true" in report
    assert "noindex: true" in report
    assert "[demo/game-aimbot](" not in report
    daily_report = generate_post([malicious_repo])
    restricted_daily_report = generate_post([cheat_repo])
    risk_report = generate_risk_post([malicious_risk_repo])
    assert "<img" not in daily_report and "<img" not in risk_report
    assert "\n### injected" not in daily_report
    assert "](javascript:" not in daily_report
    assert "&lt;img" in daily_report
    assert "../../projects/demo/game-aimbot/" in restricted_daily_report
    assert "https://github.com/demo/game-aimbot" not in restricted_daily_report
    cleaned_readme = sanitize_readme_markdown(
        '<script>alert(1)</script> [unsafe](javascript:alert(1)) ![x](data:image/svg+xml,test)'
    )
    assert "<script" not in cleaned_readme
    assert "javascript:" not in cleaned_readme
    assert "data:image" not in cleaned_readme
    with tempfile.TemporaryDirectory() as temp_dir:
        existing_path = os.path.join(temp_dir, "demo--useful-cli.md")
        with open(existing_path, "w", encoding="utf-8") as handle:
            handle.write("existing README snapshot")
        with patch("github_project_snapshot.fetch_readme", return_value=""):
            write_project_snapshots([clean_repo], temp_dir, {}, "2026-01-01")
        with open(existing_path, "r", encoding="utf-8") as handle:
            assert handle.read() == "existing README snapshot"

    assert is_safe_snapshot(clean_repo)
    assert not is_safe_snapshot(cheat_repo)

    print("  Self-test passed: clean and risk repositories are separated.")


def main():
    print(f"  GitHub Daily Digest ({date_str})")

    post_path = os.path.join(POSTS_DIR, f"daily-{date_str}.md")
    risk_path = os.path.join(POSTS_DIR, f"risk-daily-{date_str}.md")
    if os.path.exists(post_path) and os.path.exists(risk_path):
        print("  Today's daily and risk reports already exist, skipping.")
        return

    print("  Fetching trending repos...")
    repos, risk_repos = get_trending_repos()
    if not repos and not risk_repos:
        print("  No repositories found, skipping.")
        return

    print(f"  Selected: {len(repos)} quality, {len(risk_repos)} risk observations")
    for repo in repos:
        print(f"     {format_stars(repo['stargazers_count']):>6}  "
              f"{repo['full_name']}")
    for repo in risk_repos:
        print(f"     risk  {repo['full_name']} "
              f"({repo['_risk_reason']})")

    if DRY_RUN:
        if repos:
            print(f"\n  --- DRY RUN: daily-{date_str}.md ---")
            print(generate_post(repos)[:500])
        if risk_repos:
            print(f"\n  --- DRY RUN: risk-daily-{date_str}.md ---")
            print(generate_risk_post(risk_repos)[:700])
        print("  ...")
        return

    if repos:
        write_project_snapshots(
            repos,
            PROJECTS_DIR,
            github_api_headers(),
            date_str,
        )
    if repos and not os.path.exists(post_path):
        with open(post_path, "w", encoding="utf-8") as f:
            f.write(generate_post(repos))
        print(f"  Post: src/content/posts/daily-{date_str}.md")

        svg_path = os.path.join(HERO_DIR, f"daily-{date_str}.svg")
        os.makedirs(HERO_DIR, exist_ok=True)
        with open(svg_path, "w", encoding="utf-8") as f:
            f.write(generate_svg(repos))
        print(f"  SVG:  public/hero/daily-{date_str}.svg")

    if risk_repos and not os.path.exists(risk_path):
        with open(risk_path, "w", encoding="utf-8") as f:
            f.write(generate_risk_post(risk_repos))
        print(f"  Risk draft: src/content/posts/risk-daily-{date_str}.md")

    print(f"  Done! {len(repos)} quality projects; "
          f"{len(risk_repos)} isolated risk observations.")


if __name__ == "__main__":
    if SELF_TEST:
        run_self_test()
    else:
        main()
