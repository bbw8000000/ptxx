---
title: "AnctyEnly453/abstract-algebra-promo"
owner: "AnctyEnly453"
name: "abstract-algebra-promo"
fullName: "AnctyEnly453/abstract-algebra-promo"
description: "抽象代数：结构之美 | Canvas/WebGL animation and procedural soundtrack"
sourceUrl: "https://github.com/AnctyEnly453/abstract-algebra-promo"
stars: 45
forks: 2
language: "HTML"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-29"
pushedAt: "2026-09-28T05:04:35Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# 抽象代数：结构之美

一部约 4 分 23 秒的抽象代数宣传片。画面由 HTML Canvas、WebGL 和 JavaScript 逐帧绘制；配乐与音效由 Python 合成。视频为 1920 × 1080、30 fps，包含中英双语字幕。

*图片：宣传片封面*

## 在线观看与文件

- 下载分享版 MP4（约 366 MB）
- 下载单文件 HTML 播放器（内嵌配乐；字体需要联网加载）
- 在本地打开 `promo.html` 也可以播放，需将 `music.mp3` 放在同一目录。

## 工程结构

| 文件 | 用途 |
| --- | --- |
| `promo.html` | 当前版本的动画与播放器源码 |
| `promo_v1.html` | 早期版本，保留供对照 |
| `music.py`、`cues.json` | 合成配乐、音效及时间点 |
| `e8.py`、`e8.json` | E8 根系及投影数据生成与参考数据 |
| `qr.py`、`qr.json` | 纠错码场景的数据生成与参考数据 |
| `build.py` | 将源码与 MP3 合成单文件 HTML |
| `export.mjs` | 用 Chrome/Edge 和 FFmpeg 逐帧导出 MP4 或检查帧 |
| `music.mp3` | 可直接播放的最终配乐 |

`e8.json` 和 `qr.json` 的数据已嵌入 `promo.html`；重新运行对应 Python 脚本会更新参考 JSON，不会自动改写动画源码。

## 重新生成

需要 Python 3、Node.js 22+、Chrome 或 Edge，以及在 `PATH` 中可用的 FFmpeg。字体由 Google Fonts 加载，因此播放和逐帧导出时需要网络连接。以下命令均在仓库根目录运行：

```powershell
python -m pip install -r requirements.txt
node export.mjs --cues cues.json
python music.py
python build.py
node export.mjs --workers 4 --crf 18
```

最后一步生成高码率母版 `抽象代数宣传片.mp4`。只想检查画面时可运行：

```powershell
node export.mjs --shots 5,60,150
```

检查帧会写入 `shots/`。`music.wav`、视频母版、分享版和检查帧属于大体积生成文件，不纳入 Git；分享版视频见 Release。

## 字体与发布说明

动画使用 Google Fonts 提供的 Noto Serif SC、Cinzel、Cormorant Garamond、Great Vibes 和 STIX Two Text。仓库未打包字体文件。代码与音乐由本工程生成；仓库未附加再许可声明。
