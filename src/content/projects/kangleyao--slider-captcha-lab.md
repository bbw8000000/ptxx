---
title: "kangleyao/slider-captcha-lab"
owner: "kangleyao"
name: "slider-captcha-lab"
fullName: "kangleyao/slider-captcha-lab"
description: "阿里云滑块验证码自动求解：YOLO 识别 + 真人形态轨迹生成 + CDP 注入，单次通过率 90.9%"
sourceUrl: "https://github.com/kangleyao/slider-captcha-lab"
stars: 62
forks: 29
language: "Python"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-08"
pushedAt: "2026-09-07T15:28:38Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Slider Captcha Lab

阿里云滑块验证码（AliyunCaptcha）自动求解：YOLO 识别缺口 + 真人形态轨迹生成 + CDP 事件注入。

## 效果

单次通过率 78.4% → **90.9%**，风控拦截率 15.2% → **9.1%**（n=22）。

## 原理

真人拖滑块不是平滑曲线。用 30 条真人轨迹对比合成轨迹训练分类器，
AUC=1.000 完美可分——教科书式的平滑曲线全是机器指纹：

| 指纹 | 真人 | 平滑曲线 |
|---|---|---|
| 峰值速度位置 | 75% 进度（末端甩鞭） | 5~20%（前载爆发） |
| 峰值速度 | ~9700 px/s | ~1400 px/s |
| y 路径漂移 | 38px（手臂线性漂移） | 2px（小幅振荡） |
| 完全静止帧 | 4% | 0% |
| 松手前微动作 | 0 | 0.25（画蛇添足） |

真人形态是「**慢逼近 → 谷底犹豫 → 末端甩鞭 → 收尾**」，
本生成器按此重构（细节见 docs/轨迹形态理论.md 与 `human_track.py` 注释）。

*图片：真人 vs 平滑曲线机器人 速度-进度对比*

## 使用

```python
import asyncio
from playwright.async_api import async_playwright
from slider_cdp import solve, install_verdict_hook

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        ctx = await browser.new_context()
        page = await ctx.new_page()
        cdp = await ctx.new_cdp_session(page)
        await install_verdict_hook(page)
        await page.goto("https://your-site-with-captcha.com")
        # ... 触发滑块弹出 ...
        passed, meta = await solve(ctx, page, cdp)

asyncio.run(main())
```

## 文件

| 文件 | 说明 |
|---|---|
| `slider_cdp.py` | 求解库：识别 → 轨迹 → 注入 → 判定 |
| `human_track.py` | 轨迹生成器（核心算法） |
| `track_features.py` | 59 维形态特征 |
| `record_human_drag.py` | 真人轨迹采集 |
| `train_shape_scorer.py` / `shape_gap_diagnosis.py` | 人/机分类器诊断闭环 |
| `calib_cdp.py` | 位移响应模型标定（`piece.left = A·m + B·m²`） |

判定码：**T001** 通过 · **F001** 风控拦截 · **F015** 位置误差

## 安装

```bash
pip install -r requirements.txt
playwright install chromium
```

- `captcha-recognizer` 提供 YOLO 缺口识别（自带模型权重）
- 换站点时先用 `calib_cdp.py` 标定该站的位移响应系数（`slider_cdp.py` 顶部的 `A_CDP/B_CDP`）

## 免责

仅用于验证码可用性研究与自有环境的合规测试，使用者自行承担后果。

## 友情链接

[*图片：LINUX DO*](https://linux.do)
