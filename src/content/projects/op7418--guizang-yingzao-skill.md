---
title: "op7418/guizang-yingzao-skill"
owner: "op7418"
name: "guizang-yingzao-skill"
fullName: "op7418/guizang-yingzao-skill"
description: "🏯 Claude Code / Codex skill — transform Chinese architecture, cultural places & travel photos into art-directed editorial posters with GPT Image. 中国古建筑与在地文化照片 → 艺术指导海报"
sourceUrl: "https://github.com/op7418/guizang-yingzao-skill"
stars: 323
forks: 28
language: "Python"
topics: ["agent-skill", "ai-agent", "anthropic", "chinese-architecture", "chinese-culture", "claude-code", "claude-skill", "codex"]
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-05"
pushedAt: "2026-09-03T09:51:13Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

*图片：Yingzao 作品展示*

# Yingzao · 营造

把你拍下的建筑、街巷、店铺、器物与地方食物，转成真正经过艺术指导的编辑海报——不是给照片套滤镜，也不是把标题贴在空白处。

Yingzao 会先读照片的构图与身份，再选择一张兼容的主导参考，设计中文展示字与图文空间关系，最后把原图、参考与稀疏排版垫图一起交给图像模型完成整体重绘。主体处理、主动色场、地域材质和文字遮挡发生在同一个视觉世界里。

## 30 秒开始

```bash
npx skills add https://github.com/op7418/guizang-yingzao-skill --skill yingzao
```

安装后，在支持 Skills 与图像生成的 Agent 中直接说：

```text
用 $yingzao 把这张大同古城的照片做成一张 3:4 编辑海报。
地点与标题你根据我提供的信息决定，不需要原图对照拼图。
```

也可以把下面这段话发给你的 Agent，让它自行完成安装：

```text
请运行 `npx skills add https://github.com/op7418/guizang-yingzao-skill --skill yingzao` 安装 Yingzao。
安装完成后读取它的 SKILL.md，并先运行依赖检查；不要把仓库克隆到某个特定 Agent 的私有目录。
```

## 它会做什么

- 识别照片是正立面、仰视、对角、框景、局部构件还是环境叙事，并只修复一个真正影响画面的构图问题。
- 保护屋坡、飞檐、匾额、轮廓、不对称等身份锚点，不把真实建筑“优化”成另一栋楼。
- 在看参考图之前先提出主体、背景、图文互动与排版动作四域命题，避免参考越多、结果越平庸。
- 从内置 Recipe 与真实参考图中选择兼容方向，不把几十条风格词机械串进提示词。
- 设计展示字的宽窄、重心、笔画对比、收笔、字腔、节奏与表面媒介；小字可使用另一常规字族建立层级。
- 把主体语义抠取、移位、分区上材质，并让真实轮廓与标题、色形发生遮挡、共边或负形咬合。
- 多图“合一”时提取各图主体，在共享透视、光向、接触阴影和边缘语言中重建一个场景；只有明确要求组照时才保留照片矩形。
- 海报完成后，可按你的选择继续制作一张 3×3 视频分镜图和可直接交给视频模型的提示词。

## 使用示例

```text
用 $yingzao 做一张善化寺藻井海报。主体必须突出，文字不能侵入藻井核心纹样；你决定版式。
```

```text
用 $yingzao 把这五张同一家茶食店的夜景和食物融合成一张横版海报。
不要做五宫格，要像一个共同场景。
```

```text
用 $yingzao 做一张沙棘美式海报。可以从真实沙棘果实提取一个克制的字形或留白装饰，但不要撒满画面。
```

```text
用 $yingzao 做海报，完成后再把它扩展成 8 秒视频的九宫格分镜和视频提示词。
```

如果地点、殿名或历史信息不确定，可以先让 Agent 检索；Yingzao 只把已核实、照片可见或你确认过的信息写进海报。

## 工作方式

```text
照片预检与事实边界
        ↓
参考无关的四域创意命题
        ↓
Recipe 检索与一张主导参考
        ↓
设计语义编译 + 中文字形简报 + 带区域标记的稀疏排版垫图
        ↓
编译并锁定原图 / 参考 / 垫图 / 完整提示词
        ↓
同次整体 edit → 一次读图诊断 → 交付
        ↓
用户反馈后定向修改
        ↓
可选：3×3 视频分镜 + 视频提示词
```

高风格化任务固定使用三类视觉输入：校正原图负责身份，主导参考负责完整视觉机制，排版垫图负责文字范围、共同轴、动作区域与遮挡关系。所选 Recipe 会先编译成主体、背景、字体、互动四域的当前照片动作；这些动作一边写入最终 ImageGen 提示词，一边通过 `S1 / B1 / T1` 等标记指向垫图中的具体区域。调用前交接清单会检查每个启用 Token 是否真的进入模型输入，再把三张图和完整提示词一起锁定；`reinterpret` 标题使用字符槽而不是大号普通字体轮廓，避免把宋体垫图误当成最终字形。图像模型负责把它们融合，而不是照着网页排版重新渲染一遍。

## 生成前门控

Yingzao 只在调用图像模型之前做确定性检查：

- 照片适配、滚转与可安全补齐区域
- 事实与文字边界
- 主导参考和目标几何的兼容性
- 主体、背景、互动三个可见设计域
- Recipe Token 到模型动作与垫图标记的完整投递
- 字体 cmap 覆盖与 fallback
- 真实字面、共同轴、碰撞、禁穿区、竖排顺序与主体遮字契约

生成后会做一次低成本读图，检查主体处理、主动背景、字形、图文互动和主导参考机制是否真正可见，并把最明显的问题告诉你；不会因此自动重生成或消耗第二次额度。只有你提出反馈后才继续修改。局部字形或边缘问题基于当前成图编辑，主体、背景、主布局或图文关系等结构问题则回到原图重做方向。

## 适用范围

适合：

- 古建筑、历史街区、民居、园林与地方空间
- 文化店铺、暖光室内、手工器物与地方食物
- 旅行封面、单图编辑海报、多图共同场景
- 需要中文展示字设计和主体互动的视觉作品

不适合：

- 普通商品广告与电商主图
- 只想调曝光、祛痘、锐化或换天空的常规修图
- 没有真实地点或主体依据的虚构古建筑
- 只需要确定性拼图与后贴字、不需要图像模型参与的任务

## 运行要求

- 一个支持 Skills、读取本地图片并调用图像生成/编辑工具的 Agent
- Python 3.10+
- Pillow、NumPy、OpenCV 与 fontTools

首次使用先运行：

```bash
python3 yingzao/scripts/check_dependencies.py
```

如果当前 Python 缺包，脚本会自动寻找调用者目录中的兼容 `.venv`，不会向全局 Python 静默安装依赖。需要手动准备环境时：

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r yingzao/requirements.txt
```

## 目录

```text
yingzao/
├── SKILL.md                         # 入口与轻量主流程
├── agents/openai.yaml               # Skill 展示元数据
├── assets/
│   ├── readme-hero.webp             # README 作品墙
│   ├── reference-plates/            # 图像模型使用的主导参考
│   └── reference-thumbnails/        # 目录浏览用轻量预览
├── references/
│   ├── art-direction.md             # 字体、构图、材质与文化转译
│   ├── creative-brief.md             # 单方案生成前简报
│   ├── preflight-gates.md            # 高成本调用前的唯一门控真源
│   ├── image-generation-workflow.md  # 输入顺序、参数、提示词与反馈分流
│   └── video-storyboard.md           # 可选九宫格视频扩展
├── scripts/                          # 预检、扶正、Token、排版与拼图工具
└── tests/                            # 脚本回归测试
```

## 设计原则

规则不是越多越好。Yingzao 把程序用在它真正擅长的地方——测量、字体覆盖、碰撞、对齐、几何与输入交接；把图像模型留给语义抠取、空间重构、材质、光线和图文关系。生成前把方向和真实调用锁定，生成后只读图一次，再把修改决定交还给用户。

## 致谢

README 的安装与使用结构参考了 Guizang Social Card Skill。
