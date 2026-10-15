#!/usr/bin/env python3
"""生成「今日项目审核清单」，输出 Markdown 到标准输出。

在日报工作流里追加到 $GITHUB_STEP_SUMMARY，这样点开那次运行就能看到当天的
项目列表（按星数排序）和需要注意的地方 —— 目的是让「高星作品」每天有人过一眼，
而不是完全依赖自动筛选。

清单里会标出三类需要留意的项目：
  ⚠️ 没有 README 快照 —— 对「不能翻墙、不会用 GitHub」的读者等于没有内容
  ⚠️ 命中安全规则     —— 不该出现；出现说明筛选漏了，是 bug
  ⚠️ 星数偏低         —— 低于 --min-stars 时提示，可能不够「高质量」
"""

import argparse
import io
import json
import os
import re
import sys
from datetime import datetime, timedelta, timezone

# Windows 控制台默认是 GBK，打不出 ✅/⭐ 这类字符
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(SCRIPT_DIR, '..')
POSTS_DIR = os.path.join(ROOT, 'src', 'content', 'posts')
PROJECTS_DIR = os.path.join(ROOT, 'src', 'content', 'projects')
SAFETY_PATH = os.path.join(ROOT, 'config', 'project-safety.json')
RETIRED_PATH = os.path.join(ROOT, 'config', 'projects-without-readme.json')

BJT = timezone(timedelta(hours=8))
FALLBACK_MARKER = '当前仅保存了项目摘要'

# 推荐条目的标题行。链接有两种历史格式，见 parse_picks 的注释。
HEADING_RE = re.compile(
    r'^###\s+\d+\.\s+\[[^\]]+\]\('
    r'(?:https://github\.com/|(?:\.\./)+projects/)'
    r'([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)/?\)\s*$'
)


def load_restricted_pattern() -> re.Pattern | None:
    try:
        with open(SAFETY_PATH, encoding='utf-8') as handle:
            policy = json.load(handle)
    except (OSError, ValueError):
        return None
    patterns = policy.get('restrictedProjectPatterns') or []
    if not patterns:
        return None
    return re.compile('|'.join(f'(?:{p})' for p in patterns), re.IGNORECASE)


def load_retired() -> set[str]:
    try:
        with open(RETIRED_PATH, encoding='utf-8') as handle:
            payload = json.load(handle)
    except (OSError, ValueError):
        return set()
    return {
        str(item.get('fullName', '')).lower()
        for item in payload.get('projects', [])
        if item.get('fullName')
    }


def snapshot_state(full_name: str) -> str:
    """返回 ok / placeholder / missing"""
    owner, _, name = full_name.partition('/')
    path = os.path.join(PROJECTS_DIR, f'{owner.lower()}--{name.lower()}.md')
    if not os.path.exists(path):
        return 'missing'
    with open(path, encoding='utf-8') as handle:
        return 'placeholder' if FALLBACK_MARKER in handle.read() else 'ok'


def parse_stars(text: str) -> int:
    raw = text.strip().lower().replace(',', '')
    number = float(re.sub(r'[^\d.]', '', raw) or 0)
    return int(number * 1000) if 'k' in raw else int(number)


def parse_picks(post_text: str) -> list[dict]:
    """解析日报正文里的推荐条目。

    条目链接有两种历史格式，都要认：
      现在的：### 1. [owner/repo](../../projects/owner/repo/)
      早期的：### 1. [owner/repo](https://github.com/owner/repo)
    """
    picks = []
    current = None
    for line in post_text.split('\n'):
        heading = HEADING_RE.match(line)
        if heading:
            current = {
                'fullName': f'{heading.group(1)}/{heading.group(2)}',
                'description': '',
                'stars': 0,
                'language': '未知',
            }
            picks.append(current)
            continue
        if current is None:
            continue
        stars = re.search(r'\*\*\s*([\d.,]+k?)\s*\*\*\s*stars', line, re.IGNORECASE)
        if stars:
            current['stars'] = parse_stars(stars.group(1))
            language = re.search(r'语言:\s*\*\*([^*]+)\*\*', line)
            if language:
                current['language'] = language.group(1).strip()
            continue
        if line.startswith('> ') and not current['description']:
            # 跳过我们自己加的「已下架」标注行
            if '该项目已从 GitHub 下架' not in line:
                current['description'] = line[2:].strip()
    return picks


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--date', help='清单日期（北京时间），默认今天')
    parser.add_argument('--high-stars', type=int, default=500, help='视为「高星」的阈值')
    parser.add_argument('--min-stars', type=int, default=100, help='低于此值给出提示')
    args = parser.parse_args()

    date_str = args.date or datetime.now(BJT).strftime('%Y-%m-%d')
    post_path = os.path.join(POSTS_DIR, f'daily-{date_str}.md')

    print(f'## 今日项目审核清单 · {date_str}')
    print()

    if not os.path.exists(post_path):
        print(f'当天没有日报（`daily-{date_str}.md` 不存在），无需审核。')
        return 0

    with open(post_path, encoding='utf-8') as handle:
        picks = parse_picks(handle.read())

    if not picks:
        print('日报里没有解析到推荐条目。')
        return 0

    restricted = load_restricted_pattern()
    retired = load_retired()

    for pick in picks:
        pick['snapshot'] = snapshot_state(pick['fullName'])
        searchable = f"{pick['fullName']} {pick['description']}"
        pick['flagged'] = bool(restricted and restricted.search(searchable))
        pick['retired'] = pick['fullName'].lower() in retired

    picks.sort(key=lambda item: item['stars'], reverse=True)

    flagged = [p for p in picks if p['flagged']]
    no_snapshot = [p for p in picks if p['snapshot'] != 'ok']
    low_stars = [p for p in picks if p['stars'] < args.min_stars]

    high = [p for p in picks if p['stars'] >= args.high_stars]
    print(
        f'共 **{len(picks)}** 个项目，其中高星（≥{args.high_stars}）**{len(high)}** 个。'
    )
    if flagged:
        print(f'**⚠️ 命中安全规则：{len(flagged)} 个（下面标红，说明筛选漏了）**')
    if no_snapshot:
        print(f'⚠️ 没有可离线阅读的 README 快照：{len(no_snapshot)} 个')
    if low_stars:
        print(f'⚠️ 星数低于 {args.min_stars}：{len(low_stars)} 个')
    print()

    print('| 星数 | 项目 | 语言 | 快照 | 备注 |')
    print('| --- | --- | --- | --- | --- |')
    for pick in picks:
        marks = []
        if pick['flagged']:
            marks.append('**命中安全规则**')
        if pick['retired']:
            marks.append('已在 GitHub 下架')
        if pick['snapshot'] == 'missing':
            marks.append('无快照')
        elif pick['snapshot'] == 'placeholder':
            marks.append('快照为空壳')
        if pick['stars'] < args.min_stars and not marks:
            marks.append('星数偏低')
        star_text = f'{pick["stars"]:,}'
        if pick['stars'] >= args.high_stars:
            star_text = f'**{star_text}**'
        print(
            f'| {star_text} | [{pick["fullName"]}](https://github.com/{pick["fullName"]}) '
            f'| {pick["language"]} | {"✅" if pick["snapshot"] == "ok" else "❌"} '
            f'| {"、".join(marks)} |'
        )

    print()
    print('<details><summary>各项目简介</summary>')
    print()
    for pick in picks:
        description = pick['description'][:200] or '（无描述）'
        print(f'- **{pick["fullName"]}** — {description}')
    print()
    print('</details>')
    return 0


if __name__ == '__main__':
    sys.exit(main())
