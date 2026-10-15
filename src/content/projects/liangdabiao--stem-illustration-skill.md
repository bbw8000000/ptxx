---
title: "liangdabiao/stem-illustration-skill"
owner: "liangdabiao"
name: "stem-illustration-skill"
fullName: "liangdabiao/stem-illustration-skill"
description: "面向 STEM（科学、技术、工程、数学）领域的 AI 图像生成 Skill。  生成科研示意图、教学插图、技术架构图等概念性图像，覆盖生物医学、化学、物理、工程、数学 6 大学科。  功能特性 24 个场景模板：信号通路、实验流程、细胞结构、概念信息图、学术海报、机制图、质粒图、机器学习架构等 6 大学科适配：生命科学/医学/化学/物理/工程/数学 4 种风格变体：academic / textbook / infographic / 3d-render"
sourceUrl: "https://github.com/liangdabiao/stem-illustration-skill"
stars: 37
forks: 0
language: "Python"
topics: ["skill"]
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-07-21"
pushedAt: "2026-07-20T05:00:36Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# stem-illustration

面向 STEM（科学、技术、工程、数学）领域的 AI 图像生成 Skill。

生成科研示意图、教学插图、技术架构图等概念性图像，覆盖生物医学、化学、物理、工程、数学 6 大学科。

## 功能特性

- **24 个场景模板**：信号通路、实验流程、细胞结构、概念信息图、学术海报、机制图、质粒图、机器学习架构等
- **6 大学科适配**：生命科学/医学/化学/物理/工程/数学
- **4 种风格变体**：academic / textbook / infographic / 3d-render
- **统一生图脚本**：自动兼容 OpenAI 同步 API 和 apimart.ai 异步 API
- **学术诚信保护**：禁止用 AI 生成真实实验数据图

## 实际应用场景

下面展示 13 张实际生成的样例（按学科分组），覆盖 24 个场景模板中的 9 个。

### 数学（严格证明）

| 图 | 模板 | 说明 |
|---|---|---|
| *图片：Garfield 严格证明* | math-concept（**代码生成**） | **加菲尔德 1876 勾股定理证明**（matplotlib 严格版，数学验证 diff=0）。AI 生图无法保证几何严格性，本图用 scripts/generate_geometry.py 生成 |

### 生命科学

| 图 | 模板 | 说明 |
|---|---|---|
| *图片：MAPK-ERK 信号通路* | signaling-pathway | MAPK-ERK 信号通路（生物化学），3:4 垂直 |
| *图片：有丝分裂 6 阶段* | experimental-workflow | 有丝分裂 6 阶段（Nature 期刊风），16:9 |
| *图片：Mitosis 详细英文版* | experimental-workflow | Mitosis（M 期）— 详细英文版，含 Cytokinesis 和 6 阶段要点 |

### 化学

| 图 | 模板 | 说明 |
|---|---|---|
| *图片：阿司匹林合成* | chemistry-structure | 阿司匹林合成。⚠️ **反应路径有化学错误**（苯酚→苯酚钠→阿司匹林不是真实反应），仅作"AI 生图可能渲染错误反应路径"的反面教材 |

### 工程

| 图 | 模板 | 说明 |
|---|---|---|
| *图片：3 缸发动机* | machine-mechanism | 直列 3 缸发动机剖视图。3 活塞 120° 相位差 + 配气机构 + 油底壳 |

### 物理（浮力 4 主题）

| 图 | 模板 | 说明 |
|---|---|---|
| *图片：阿基米德原理* | physics-schematic | 阿基米德原理：F_浮 = G_排 = ρ_液·g·V_排，公式精准 |
| *图片：浮沉条件 3 状态* | physics-schematic | 浮沉条件：FLOATING / SUSPENDED / SINKING 3 状态对比 |
| *图片：轮船为什么能浮* | physics-schematic | 轮船为什么能浮：实心铁块 vs 空心铁船，平均密度对比 |
| *图片：饺子先沉后浮* | physics-schematic | 煮饺子时饺子先沉后浮 4 阶段：20°C→60°C→80°C→100°C，ρ 从 1.20→1.07→1.00→0.86 g/cm³ |

 

## 目录结构

```
stem-illustration/
├── SKILL.md                         # Skill 核心规则
├── README.md                        # 本文件
├── .env.example                     # 环境变量模板
├── .gitignore
├── scripts/
│   └── generate_image.py            # 复用自 ecom-details-image
└── references/
    └── templates/                   # 24 个场景模板
        ├── 01-signaling-pathway.json
        ├── 02-experimental-workflow.json
        ├── 03-cell-structure.json
        ├── 04-data-infographic.json
        ├── 05-academic-poster.json
        ├── 06-concept-infographic.json
        ├── 07-timeline.json
        ├── 08-comparison-matrix.json
        ├── 09-cross-section.json
        ├── 10-hub-spoke.json
        ├── 11-hierarchical-tree.json
        ├── 12-cyclic-flow.json
        ├── 13-multi-panel-figure.json
        ├── 14-plasmid-map.json
        ├── 15-machine-mechanism.json
        ├── 16-physics-schematic.json
        ├── 17-chemistry-structure.json
        ├── 18-math-concept.json
        ├── 19-graphical-abstract.json
        ├── 20-lab-safety.json
        ├── 21-educational-poster.json
        ├── 22-step-by-step.json
        ├── 23-architecture-diagram.json
        └── 24-bilingual-diagram.json
```

## 快速开始

### 1. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env，填入 IMG_BASE_URL / IMG_MODEL / IMG_API_KEY
```

### 2. 直接生图

```bash
# 异步模式（apimart.ai 推荐）
python scripts/generate_image.py --prompt-file ./prompt.txt --size 3:4 --resolution 2k

# 同步模式（OpenAI 兼容）
python scripts/generate_image.py --prompt "..." --size 1024x1536 --quality high
```

### 3. 作为 Skill 加载

将本目录放到 LLM Agent 的 skills 目录下，Agent 会自动按 SKILL.md 规则工作：

- 收集最小输入（学科/图表类型/受众/术语/尺寸/语言）
- 匹配场景模板
- 输出视觉简报（含可执行 Prompt）
- 用户确认后调用 `generate_image.py`

## 24 个模板速查

| 触发词 | 模板 | 场景 |
|---|---|---|
| 信号通路, pathway, 机制图 | 01 | 信号通路/分子机制图 |
| 实验流程, workflow, 技术路线 | 02 | 实验流程/技术路线图 |
| 细胞结构, 解剖图, organelle | 03 | 细胞/解剖结构图 |
| 数据信息图, data infographic | 04 | 数据可视化信息图 |
| 学术海报, conference poster | 05 | 双语学术海报 |
| 概念图, concept infographic | 06 | 概念教育信息图 |
| 时间线, timeline, 科学史 | 07 | 科学史时间线 |
| 对比, 比较, comparison | 08 | 对比矩阵 |
| 截面, 剖视, cross-section | 09 | 截面/剖视图 |
| 中心辐射, hub spoke, 思维导图 | 10 | 中心辐射图 |
| 层级树, 分类树, taxonomy | 11 | 层级树/分类树 |
| 循环, cycle, 水循环 | 12 | 循环流程图 |
| 多子图, multi-panel, figure 1 | 13 | 多子图组合 |
| 质粒, plasmid, 载体 | 14 | 质粒图/分子结构图 |
| 机械, 装置, 爆炸图 | 15 | 机械/工程示意图 |
| 物理, 力学, 电路, schematic | 16 | 物理原理示意图 |
| 化学, 反应, 分子, synthesis | 17 | 化学结构/反应机理 |
| 数学, 几何, 函数, math | 18 | 数学概念可视化 |
| 图文摘要, graphical abstract | 19 | 论文图文摘要 |
| 实验室安全, lab safety | 20 | 实验室安全/操作规范 |
| 教学海报, classroom poster | 21 | 教学海报 |
| 步骤, step by step, protocol | 22 | 步骤说明图 |
| 架构图, 神经网络, architecture | 23 | 系统/算法架构图 |
| 双语, 中英对照, bilingual | 24 | 中英双语通用图 |

## 推荐尺寸

| 用途 | 比例 | 分辨率 |
|---|---|---|
| 期刊单栏图 | 4:3 | 2K |
| 期刊双栏图 | 16:9 | 2K |
| 垂直机制图（信号通路/树） | 3:4 | 2K |
| 学术海报（A0/A1） | 2:3 | 2K |
| PPT/幻灯片插图 | 16:9 | 2K |
| 正方形示意图 | 1:1 | 2K |
| 长流程横幅 | 21:9 | 2K |

## STEM Prompt 铁律（10 条）

1. **颜色用 hex 码**（`#10b981`、`#ef4444`、`#3b82f6`）
2. **方向显式声明**（`top-to-bottom`、`left-to-right`、`clockwise`）
3. **字体明确指定**（中文 SimHei/Microsoft YaHei；英文 Arial/Helvetica）
4. **术语标准化**（用 MAPK/ERK，不用"细胞信号"）
5. **分辨率和比例**（期刊图 4K，PPT 2K）
6. **否定清单**（禁止虚构数据/认证/相互作用）
7. **标注规范**（激活实线、抑制虚线 T 型、磷酸化红圈 P）
8. **中英混排**（`线粒体 (Mitochondria)`）
9. **多子图编号**（A/B/C/D 加粗左上角）
10. **期刊合规**（禁止 AI 生成真实实验数据图）

详见 SKILL.md。

## 使用示例

### 示例 1：生成一张 MAPK 信号通路图

**用户输入**：
> 帮我做一张 MAPK-ERK 信号通路图，期刊风格，垂直方向。

**Agent 响应**：
1. 匹配模板 `01-signaling-pathway.json`，变体 `academic`
2. 套用学科提示（生命科学）
3. 应用铁律 + 9 段 Prompt 结构
4. 输出视觉简报 + 完整 Prompt
5. 用户确认后调用：
   ```bash
   python scripts/generate_image.py --prompt-file ./prompt.txt --size 3:4 --resolution 2k
   ```

### 示例 2：生成整套论文 Figure

**用户输入**：
> 论文有 6 个子图（Figure 1A-F），需要做一套风格统一的期刊图。

**Agent 响应**：
1. 匹配 `13-multi-panel-figure.json` 或分别匹配各子图模板
2. **强制应用 Campaign Style Lock**（统一色板、字体、线宽、标注框）
3. 为每个子图分配不同角度/景别避免重复
4. 批量生图，确保风格一致

## 学术诚信

✅ **允许**：概念示意图、机制图、流程图、架构图、教学插图、海报

❌ **禁止**（AI 不能做的事）：
- 生成真实实验数据的统计图（散点/柱状/线图）→ 用 GraphPad/Origin/Python matplotlib
- 虚构 Western blot 条带、PCR 凝胶图、显微镜图像
- 虚构蛋白质相互作用、通路分支
- 虚构化学反应机理、电子转移方向

## 与 ecom-details-image 的关系

- **复用**：`scripts/generate_image.py`（统一 OpenAI/apimart 接口）
- **扩展**：24 个 STEM 场景模板、6 学科适配、学术诚信规则、Campaign Style Lock
- **差异**：比电商图更严格（术语准确、方向正确、期刊合规、不可虚构）

## License

参考父项目。

感谢佬友 ： https://linux.do
