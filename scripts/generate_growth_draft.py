#!/usr/bin/env python3
"""自动生成成长记录草稿模板，每天一篇。"""

import io
import os
import re
import subprocess
import sys
import tempfile
from datetime import datetime, timezone, timedelta

# Windows 终端编码兼容
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


def run_self_test() -> int:
    """把「主路径」完整跑一遍（写进临时目录），而不是只验证提前退出的分支。

    为什么需要：这个脚本有两条路径 —— 「当天已有草稿 → 提前 exit(0)」和
    「没有草稿 → 真正生成文件」。在本地手工验证时只走了前者，于是漏掉了一个
    NameError（写入时用的 filepath 变量被误删），它只在后者触发，
    结果定时任务直接在 CI 上炸掉。这个自检让两条路径都必须通过。

    用子进程 + 环境变量指向临时目录来做，因为脚本是顺序执行的顶层代码，
    不能在同一次运行里换目录再跑一遍。
    """
    with tempfile.TemporaryDirectory() as tmp:
        posts_dir = os.path.join(tmp, 'posts')
        hero_dir = os.path.join(tmp, 'hero')
        os.makedirs(posts_dir)
        os.makedirs(hero_dir)
        env = dict(
            os.environ,
            GROWTH_POSTS_DIR=posts_dir,
            GROWTH_HERO_DIR=hero_dir,
        )

        first = subprocess.run(
            [sys.executable, __file__],
            env=env,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
        )
        if first.returncode != 0:
            print('自检失败：主路径无法生成草稿')
            print(first.stdout)
            print(first.stderr)
            return 1

        produced = sorted(os.listdir(posts_dir))
        if len(produced) != 1:
            print(f'自检失败：期望生成 1 个草稿，实际 {len(produced)} 个 {produced}')
            return 1
        if not os.path.exists(os.path.join(hero_dir, 'growth-001.svg')):
            print('自检失败：没有生成封面 SVG')
            return 1

        # 再跑一次：同一天应当命中守卫，不重复生成
        second = subprocess.run(
            [sys.executable, __file__],
            env=env,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
        )
        if second.returncode != 0:
            print('自检失败：重复运行时退出码非 0')
            print(second.stderr)
            return 1
        if len(os.listdir(posts_dir)) != 1:
            print('自检失败：同一天重复生成了草稿（守卫未生效）')
            return 1

    print('Self-test passed: 主路径可写，且同一天不会重复生成。')
    return 0


if '--self-test' in sys.argv:
    sys.exit(run_self_test())

# 允许通过环境变量改写输出目录，供自检使用；正常运行走仓库内的默认路径。
POSTS_DIR = os.environ.get('GROWTH_POSTS_DIR') or os.path.join(
    os.path.dirname(__file__), '..', 'src', 'content', 'posts'
)
HERO_DIR = os.environ.get('GROWTH_HERO_DIR') or os.path.join(
    os.path.dirname(__file__), '..', 'public', 'hero'
)

# 北京时间
BJT = timezone(timedelta(hours=8))
today = datetime.now(BJT)
date_str = today.strftime('%Y-%m-%d')

# 查找当前最大编号
existing = []
for f in os.listdir(POSTS_DIR):
    m = re.match(r'growth-(\d+)\.md', f)
    if m:
        existing.append(int(m.group(1)))

# 今天是否已经有草稿：必须按 pubDate 判断，不能按编号判断。
#
# 原来的写法是先算 next_num = max + 1，再检查 growth-{next_num}.md 是否存在——
# 那个文件名就是刚刚算出来的新编号，按构造不可能已存在，于是条件恒为假，
# 「今日已生成」的守卫从来没生效过：每次运行都会新建一篇，同一天重跑一次
# （重试、手动 workflow_dispatch）就多出一篇 growth-xxx。
today_draft = None
for f in sorted(os.listdir(POSTS_DIR)):
    if not re.match(r'growth-\d+\.md', f):
        continue
    try:
        with open(os.path.join(POSTS_DIR, f), encoding='utf-8') as fh:
            head = fh.read(4000)
    except OSError:
        continue
    if re.search(rf'^pubDate:\s*{re.escape(date_str)}\s*$', head, re.M):
        today_draft = f
        break

if today_draft:
    print(f'今日草稿已存在: {today_draft}')
    exit(0)

next_num = max(existing, default=0) + 1
file_num = f'{next_num:03d}'
# 写入目标。注意这两个变量在下面「写入文件」处会用到，删守卫时别一起删掉。
filename = f'growth-{file_num}.md'
filepath = os.path.join(POSTS_DIR, filename)

# 模板主题（随机挑一个方向，你也可以改成固定）
templates = [
    {
        'title': '今天学到了什么',
        'prompt': '今天有什么事情让你觉得"原来如此"？可以是技术上的、生活上的、或者人际关系上的。',
        'starter': '今天发生了一件事，让我重新想了想...',
    },
    {
        'title': '一个小失败',
        'prompt': '今天有没有什么没做好的事？不用大，小事也行。你是怎么面对的？',
        'starter': '本来以为今天会很顺利，结果...',
    },
    {
        'title': '和别人的一段对话',
        'prompt': '今天有没有谁说了一句话让你印象深刻？为什么？',
        'starter': '今天有人跟我说了一句话：「」。',
    },
    {
        'title': '坚持 vs 放弃',
        'prompt': '今天有没有想放弃什么？最后放弃了还是没放弃？为什么？',
        'starter': '今天我又想放弃了。',
    },
    {
        'title': '一个小进步',
        'prompt': '今天有没有什么事情比昨天做得好一点点？多小都行。',
        'starter': '说起来可能没什么大不了的，但今天我...',
    },
]

# 按日期轮换主题
template = templates[today.day % len(templates)]

# 生成草稿内容
content = f'''---
title: "成长记录 #{next_num}：{template['title']}"
description: "（写一句话概括今天的主题）"
pubDate: {date_str}
heroImage: "/hero/growth-{file_num}.svg"
category: 成长记录
tags: ["成长", "随笔"]
draft: true
---

（开头：用一两句话引入今天想聊的事。不用太正式，就像跟朋友说话一样。）

## （第一个小标题）

{template['starter']}

（把事情写清楚。发生了什么？你的感受是什么？）

## （第二个小标题）

（展开聊聊。为什么会这样？你想到了什么？有没有联想到以前的事？）

## （第三个小标题）

（收尾。这件事让你明白了什么？或者你还不确定，但想记下来。）

---

（结尾：一句话总结，或者留个开放的结尾。可以是对读者说的，也可以是对自己说的。）
'''

# 写入文件
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

# 插画风 SVG 封面
hue = (today.day * 47 + today.month * 13) % 360
hue2 = (hue + 40) % 360
title_text = f"成长记录 #{next_num}"
subtitle_text = template["title"]

# 每个主题对应不同插画
illustrations = {
    '今天学到了什么': '''
    <!-- 灯泡插画 -->
    <g transform="translate(700, 100)">
      <circle cx="0" cy="0" r="50" fill="none" stroke="white" stroke-width="3" opacity="0.9"/>
      <path d="M-20,35 Q-20,55 0,55 Q20,55 20,35" fill="none" stroke="white" stroke-width="3" opacity="0.9"/>
      <line x1="-15" y1="55" x2="15" y2="55" stroke="white" stroke-width="2" opacity="0.7"/>
      <line x1="-12" y1="62" x2="12" y2="62" stroke="white" stroke-width="2" opacity="0.7"/>
      <!-- 光线 -->
      <line x1="0" y1="-65" x2="0" y2="-80" stroke="white" stroke-width="2" opacity="0.5"/>
      <line x1="45" y1="-45" x2="55" y2="-55" stroke="white" stroke-width="2" opacity="0.5"/>
      <line x1="-45" y1="-45" x2="-55" y2="-55" stroke="white" stroke-width="2" opacity="0.5"/>
      <line x1="60" y1="0" x2="75" y2="0" stroke="white" stroke-width="2" opacity="0.5"/>
      <line x1="-60" y1="0" x2="-75" y2="0" stroke="white" stroke-width="2" opacity="0.5"/>
    </g>''',
    '一个小失败': '''
    <!-- 破蛋插画 -->
    <g transform="translate(720, 140)">
      <ellipse cx="0" cy="0" rx="40" ry="50" fill="none" stroke="white" stroke-width="3" opacity="0.9" stroke-dasharray="8,6,20,6"/>
      <path d="M-15,-20 Q-5,-30 5,-20 Q15,-10 25,-20" fill="none" stroke="white" stroke-width="2" opacity="0.6"/>
      <!-- 裂缝 -->
      <path d="M-10,-10 L0,0 L-5,15 L10,25" fill="none" stroke="white" stroke-width="2.5" opacity="0.8"/>
      <!-- 星星碎片 -->
      <circle cx="45" cy="-30" r="3" fill="white" opacity="0.5"/>
      <circle cx="55" cy="-15" r="2" fill="white" opacity="0.4"/>
      <circle cx="35" cy="-45" r="2.5" fill="white" opacity="0.3"/>
    </g>''',
    '和别人的一段对话': '''
    <!-- 对话气泡插画 -->
    <g transform="translate(680, 100)">
      <!-- 左气泡 -->
      <rect x="0" y="0" width="100" height="60" rx="20" fill="none" stroke="white" stroke-width="3" opacity="0.9"/>
      <polygon points="20,60 35,80 40,60" fill="none" stroke="white" stroke-width="3" opacity="0.9"/>
      <!-- 右气泡 -->
      <rect x="80" y="70" width="110" height="55" rx="18" fill="none" stroke="white" stroke-width="2.5" opacity="0.7"/>
      <polygon points="170,70 180,50 160,70" fill="none" stroke="white" stroke-width="2.5" opacity="0.7"/>
      <!-- 文字线条 -->
      <line x1="25" y1="22" x2="75" y2="22" stroke="white" stroke-width="2" opacity="0.5"/>
      <line x1="25" y1="35" x2="60" y2="35" stroke="white" stroke-width="2" opacity="0.5"/>
      <line x1="105" y1="92" x2="165" y2="92" stroke="white" stroke-width="2" opacity="0.4"/>
      <line x1="105" y1="105" x2="145" y2="105" stroke="white" stroke-width="2" opacity="0.4"/>
    </g>''',
    '坚持 vs 放弃': '''
    <!-- 山路插画 -->
    <g transform="translate(680, 80)">
      <!-- 山 -->
      <path d="M0,180 L80,40 L160,180" fill="none" stroke="white" stroke-width="3" opacity="0.9"/>
      <!-- 路径 -->
      <path d="M20,160 Q60,120 50,90 Q40,60 80,40" fill="none" stroke="white" stroke-width="2.5" stroke-dasharray="6,4" opacity="0.7"/>
      <!-- 旗帜 -->
      <line x1="80" y1="40" x2="80" y2="10" stroke="white" stroke-width="2" opacity="0.9"/>
      <path d="M80,10 L105,18 L80,26" fill="white" opacity="0.6"/>
      <!-- 小人 -->
      <circle cx="30" cy="152" r="6" fill="none" stroke="white" stroke-width="2" opacity="0.7"/>
      <line x1="30" y1="158" x2="30" y2="172" stroke="white" stroke-width="2" opacity="0.7"/>
    </g>''',
    '一个小进步': '''
    <!-- 向上箭头插画 -->
    <g transform="translate(700, 80)">
      <!-- 阶梯 -->
      <path d="M0,180 L0,140 L50,140 L50,100 L100,100 L100,60 L150,60 L150,20" fill="none" stroke="white" stroke-width="3" opacity="0.9" stroke-linejoin="round"/>
      <!-- 箭头 -->
      <polygon points="150,10 165,30 150,25 135,30" fill="white" opacity="0.8"/>
      <!-- 小圆点装饰 -->
      <circle cx="25" cy="130" r="3" fill="white" opacity="0.4"/>
      <circle cx="75" cy="90" r="3" fill="white" opacity="0.4"/>
      <circle cx="125" cy="50" r="3" fill="white" opacity="0.4"/>
    </g>''',
}

illustration = illustrations.get(template['title'], illustrations['一个小进步'])

svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 350" width="900" height="350">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl({hue}, 65%, 60%)"/>
      <stop offset="100%" stop-color="hsl({hue2}, 55%, 45%)"/>
    </linearGradient>
  </defs>
  <!-- 背景 -->
  <rect width="900" height="350" rx="16" fill="url(#bg)"/>
  <!-- 装饰 -->
  <circle cx="780" cy="60" r="120" fill="white" opacity="0.06"/>
  <circle cx="100" cy="300" r="60" fill="white" opacity="0.04"/>
  <!-- 标签 -->
  <rect x="60" y="70" width="80" height="28" rx="14" fill="white" opacity="0.2"/>
  <text x="100" y="89" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="white" text-anchor="middle" opacity="0.9">GROWTH</text>
  <!-- 主标题 -->
  <text x="60" y="150" font-family="'Noto Serif SC', 'LXGW WenKai', Georgia, serif" font-size="44" font-weight="700" fill="white" letter-spacing="1">{title_text}</text>
  <!-- 副标题 -->
  <text x="60" y="210" font-family="system-ui, sans-serif" font-size="22" fill="white" opacity="0.8">{subtitle_text}</text>
  <!-- 序号 -->
  <text x="830" y="320" font-family="system-ui, sans-serif" font-size="14" fill="white" opacity="0.3" text-anchor="end">#{next_num}</text>
  <!-- 插画 -->
  {illustration}
</svg>'''

svg_path = os.path.join(HERO_DIR, f'growth-{file_num}.svg')
with open(svg_path, 'w', encoding='utf-8') as f:
    f.write(svg)

print(f'✅ 已生成草稿: src/content/posts/{filename}')
print(f'✅ 已生成封面: public/hero/growth-{file_num}.svg')
print(f'📝 主题: {template["title"]}')
print(f'💡 提示: {template["prompt"]}')
print(f'')
print(f'下一步：编辑 {filename}，把括号里的提示替换成你的真实内容。')
