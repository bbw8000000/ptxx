#!/usr/bin/env python3
"""生成 GitHub 每周精选草稿。

读取过去 7 天的日报，按质量筛选 Top 5-8 个项目，
生成带"💬 我的看法"占位区的草稿，用户手工填写观点后发布。

用法:
    python scripts/generate_weekly_picks.py          # 生成本周的精选
    python scripts/generate_weekly_picks.py --dry-run # 只打印不写入
"""

import html
import io
import os
import re
import sys
import urllib.parse
from datetime import datetime, timezone, timedelta

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

POSTS_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "content", "posts")
HERO_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "hero")

BJT = timezone(timedelta(hours=8))
today = datetime.now(BJT)
DRY_RUN = "--dry-run" in sys.argv


# ── Parse daily posts ─────────────────────────────────────────────


def parse_daily_post(filepath: str) -> list[dict]:
    """Extract project entries from a daily markdown file."""
    if not os.path.exists(filepath):
        return []

    with open(filepath, encoding="utf-8") as f:
        content = f.read()

    repos = []
    # Match: ### N. [owner/name](url) ... ⭐ **stars** stars · 语言: **lang**
    pattern = re.compile(
        r'###\s+\d+\.\s+\[([^\]]+)\]\(([^)]+)\).*?'
        r'>\s*(.*?)\s*\n\n'
        r'⭐\s+\*{0,2}([0-9.]+k?)\*{0,2}\s+stars\s*·\s*语言:\s*\*{0,2}([^*\n]+?)\*{0,2}(?:\s|$)',
        re.DOTALL,
    )

    for m in pattern.finditer(content):
        name = m.group(1)
        url = m.group(2)
        desc = m.group(3).strip()
        stars_str = m.group(4).replace("k", "000").replace(".", "")
        stars = int(float(stars_str))
        lang = m.group(5)
        repos.append({
            "name": name,
            "url": url,
            "description": desc or "暂无描述",
            "stars": stars,
            "language": lang,
        })

    return repos


def parse_stars(s: str) -> int:
    """'1.2k' -> 1200, '539' -> 539"""
    s = s.lower().replace(" ", "")
    if "k" in s:
        return int(float(s.replace("k", "")) * 1000)
    return int(s)


def quality_score(repo: dict) -> int:
    """Score a repo for weekly curation. Higher = more worth featuring."""
    score = 0
    desc = repo.get("description", "")
    lang = repo.get("language", "")
    stars = repo.get("stars", 0)
    name = repo.get("name", "")
    owner = name.split("/")[0].lower() if "/" in name else ""

    # ── Hard filters (auto-reject) ──

    garbage_langs = {"未知", "未", "", "中", "T", "J", "P", "?", "中文"}
    if lang in garbage_langs or len(lang) <= 1:
        score -= 10

    # Keyword-stuffed descriptions (comma-separated spam)
    if desc.count(",") > 8 and len(desc) > 100:
        score -= 8

    # Ad-like descriptions
    ad_patterns = [r"\d+%\s+(saving|cheaper|off)", r"(subscribe|follow)\s+(me|us)",
                   r"buy\s+(now|today)", r"\$\d+"]
    if any(re.search(p, desc.lower()) for p in ad_patterns):
        score -= 6

    # Pirate app stores, game cheats, cracked software
    junk_patterns = [
        "auto-", "crack", "keygen", "warez", "-bot", "roblox",
        "activator", "patcher", "sportsbook", "cheat", "cracked",
        "ipa-download", "ipa-install", "genshin-impact", "wuthering-waves",
        "pubg-cheat", "valorant-cheat", "fortnite-cheat",
        "onlyfans", "tinder-bot", "instagram-bot",
    ]
    if any(p in name.lower() for p in junk_patterns):
        score -= 10

    # Suspicious owner names (random-looking: mixed case + digits, consonant-heavy)
    owner_original = name.split("/")[0] if "/" in name else ""
    suspicious_owner = (
        # Mixed case alternation in original (e.g. "nnecrkvenuOX")
        bool(re.search(r'[a-z]+[A-Z]', owner_original))
        # Many digits
        or bool(re.search(r'[0-9]{5,}', owner_original))
        # All lowercase, long, consonant-heavy (random-looking)
        or (len(owner_original) >= 10
            and owner_original.islower()
            and sum(1 for c in owner_original.lower() if c in 'aeiou') <= 3
            and bool(re.search(r'[0-9]', owner_original)))
    )
    if suspicious_owner:
        score -= 5

    # ── Positive signals ──

    # Description quality (diminishing returns: caps at +2 for weekly picks)
    if len(desc) > 100:
        score += 2
    elif len(desc) > 60:
        score += 2
    elif len(desc) > 30:
        score += 1

    # Real programming languages
    real_langs = {"Python", "TypeScript", "JavaScript", "Go", "Rust", "Java",
                  "C++", "C", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Zig",
                  "R", "Shell", "Lua", "Dart", "Vue", "Svelte"}
    if lang in real_langs:
        score += 3

    # Star tiers (weekly picks favor proven projects more strongly)
    if stars >= 5000:
        score += 7
    elif stars >= 1000:
        score += 5
    elif stars >= 500:
        score += 4
    elif stars >= 200:
        score += 2
    elif stars >= 100:
        score += 1

    # Known organizations/creators — projects from credible sources
    known_orgs = {
        "vercel", "microsoft", "google", "meta", "anthropic", "openai",
        "cloudflare", "github", "apple", "amazon", "netflix", "spotify",
        "supabase", "shadcn", "tailwindlabs", "facebook", "airbnb",
        "hashicorp", "grafana", "elastic", "mongodb", "redis", "mozilla",
        "astral-sh", "browserbase", "langchain-ai", "nocodb", "appwrite",
        "expo", "pytorch", "tensorflow", "denoland", "bun",
    }
    if owner in known_orgs:
        score += 5

    # Clean repo name (not spam-looking)
    repo_name = name.split("/")[-1]
    if len(repo_name) < 30 and not re.search(r'[0-9]{4,}', repo_name):
        score += 1

    return score


def collect_weekly_repos(days: int = 7) -> list[dict]:
    """Read past N daily posts and collect all repos."""
    all_repos = []
    seen = set()

    for i in range(days):
        d = today - timedelta(days=i + 1)
        path = os.path.join(POSTS_DIR, f"daily-{d.strftime('%Y-%m-%d')}.md")
        repos = parse_daily_post(path)
        for r in repos:
            if r["name"] not in seen:
                seen.add(r["name"])
                all_repos.append(r)

    return all_repos


def pick_weekly_top(repos: list[dict], n: int = 8, min_score: int = 5) -> list[dict]:
    """Score repos, ensure language diversity, return top N."""
    if not repos:
        return []

    # Score and sort
    for r in repos:
        r["_score"] = quality_score(r)
    repos.sort(key=lambda r: (r["_score"], r.get("stars", 0)), reverse=True)

    # Pick with language diversity: at most 2 per language
    picked = []
    lang_count = {}
    for r in repos:
        if r["_score"] < min_score:
            continue
        lang = r.get("language", "")
        if lang_count.get(lang, 0) >= 2:
            continue
        picked.append(r)
        lang_count[lang] = lang_count.get(lang, 0) + 1
        if len(picked) >= n:
            break

    return picked


# ── Generate output ───────────────────────────────────────────────


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



def generate_weekly_post(repos: list[dict], week_start: str, week_end: str) -> str:
    entries = []
    for i, r in enumerate(repos, 1):
        name = sanitize_external_text(r.get("name"), 200)
        url = sanitize_external_url(r.get("url")) or "https://github.com"
        description = sanitize_external_text(r.get("description") or "暂无描述", 800)
        language = sanitize_external_text(r.get("language") or "未知", 80)
        entries.append(f"""## {i}. [{name}]({url})

> {description}

⭐ {format_stars(r['stars'])} stars · 语言: **{language}**

### 💬 我的看法

<!-- TODO: 写写你为什么觉得这个项目有意思？它在解决什么问题？你会用它做什么？ -->

---
""")

    body = "\n\n".join(entries)

    return f"""---
title: "GitHub 每周精选 ({week_start} ~ {week_end})"
description: "过去一周 GitHub 上最值得关注的 {len(repos)} 个开源项目，附个人见解。"
pubDate: {today.strftime('%Y-%m-%d')}
heroImage: "/hero/weekly-{week_end}.svg"
category: "每周精选"
tags: ["GitHub", "开源", "每周精选", "技术"]
featured: true
---

过去一周 GitHub 上新涌现的项目里，我挑了 {len(repos)} 个最值得关注的。不只是列项目，每个都加了我的个人看法。

<!--more-->

{body}

---

> 数据来源: GitHub Trending · 精选时间段: {week_start} ~ {week_end}
"""


def generate_weekly_svg(repos: list[dict], week_end: str) -> str:
    day_num = today.timetuple().tm_yday
    hue = (day_num * 37) % 360

    top_names = " · ".join(r["name"][:18] for r in repos[:4])

    repo_lines_svg = []
    for i, r in enumerate(repos[:6]):
        y = 230 + i * 34
        color = {
            "Python": "#3572A5", "JavaScript": "#f1e05a", "TypeScript": "#3178c6",
            "Go": "#00ADD8", "Rust": "#dea584", "Java": "#b07219",
            "C++": "#f34b7d", "C": "#555", "Shell": "#89e051",
        }.get(r.get("language", ""), "#888")
        repo_lines_svg.append(f"""
    <circle cx="530" cy="{y - 4}" r="5" fill="{color}" opacity="0.8"/>
    <text x="545" y="{y}" font-family="system-ui, sans-serif" font-size="14"
          fill="white" opacity="0.9">{r['name'][:22]}</text>
    <text x="780" y="{y}" font-family="system-ui, sans-serif" font-size="12"
          fill="white" opacity="0.5" text-anchor="end">⭐ {format_stars(r.get('stars', 0))}</text>""")

    repos_svg = "\n".join(repo_lines_svg)

    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 506" width="900" height="506">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl({hue}, 60%, 18%)"/>
      <stop offset="100%" stop-color="hsl({(hue + 45) % 360}, 50%, 12%)"/>
    </linearGradient>
  </defs>
  <rect width="900" height="506" rx="16" fill="url(#bg)"/>
  <circle cx="800" cy="50" r="120" fill="white" opacity="0.04"/>
  <rect x="120" y="30" width="100" height="28" rx="14" fill="hsl({hue}, 70%, 50%)" opacity="0.8"/>
  <text x="170" y="49" font-family="system-ui, sans-serif" font-size="12"
        font-weight="600" fill="white" text-anchor="middle">WEEKLY</text>
  <text x="130" y="110" font-family="system-ui, sans-serif" font-size="48"
        font-weight="700" fill="white" opacity="0.15">{week_end}</text>
  <text x="130" y="165" font-family="'Noto Serif SC', 'LXGW WenKai', Georgia, serif"
        font-size="36" font-weight="700" fill="white">GitHub 每周精选</text>
  <text x="130" y="210" font-family="system-ui, sans-serif" font-size="16"
        fill="white" opacity="0.6">{top_names}</text>
  {repos_svg}
  <line x1="130" y1="466" x2="850" y2="466" stroke="white" stroke-width="1" opacity="0.1"/>
  <text x="130" y="490" font-family="system-ui, sans-serif" font-size="11"
        fill="white" opacity="0.3">github.com/trending · {today.strftime('%Y-%m-%d')} · Weekly Picks</text>
</svg>'''


# ── Main ───────────────────────────────────────────────────────────


def main():
    week_end = today.strftime("%Y-%m-%d")
    week_start = (today - timedelta(days=7)).strftime("%Y-%m-%d")

    print(f"  GitHub Weekly Picks ({week_start} ~ {week_end})")

    all_repos = collect_weekly_repos(days=7)
    print(f"  Found {len(all_repos)} repos from past 7 days")

    if not all_repos:
        print("  No daily posts found. Need at least one daily post to generate weekly picks.")
        return

    picks = pick_weekly_top(all_repos, n=8)
    print(f"  Picked top {len(picks)}:")
    for r in picks:
        print(f"     {format_stars(r['stars']):>6}  {r['name']}  ({r['language']})")

    if DRY_RUN:
        print(f"\n  --- DRY RUN: weekly-{week_end}.md ---")
        print(generate_weekly_post(picks, week_start, week_end)[:500])
        return

    post_path = os.path.join(POSTS_DIR, f"weekly-{week_end}.md")
    with open(post_path, "w", encoding="utf-8") as f:
        f.write(generate_weekly_post(picks, week_start, week_end))
    print(f"  Post: src/content/posts/weekly-{week_end}.md")

    svg_path = os.path.join(HERO_DIR, f"weekly-{week_end}.svg")
    os.makedirs(HERO_DIR, exist_ok=True)
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(generate_weekly_svg(picks, week_end))
    print(f"  SVG:  public/hero/weekly-{week_end}.svg")

    print(f"\n  下一步：编辑 weekly-{week_end}.md，把每个「💬 我的看法」的 TODO 替换成你的真实观点。")


if __name__ == "__main__":
    main()
