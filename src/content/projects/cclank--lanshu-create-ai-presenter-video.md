---
title: "cclank/lanshu-create-ai-presenter-video"
owner: "cclank"
name: "lanshu-create-ai-presenter-video"
fullName: "cclank/lanshu-create-ai-presenter-video"
description: "Provider-neutral Codex Skill for producing verified AI presenter videos from a script and an authorized presenter image."
sourceUrl: "https://github.com/cclank/lanshu-create-ai-presenter-video"
stars: 95
forks: 14
language: "Python"
topics: ["ai-video", "codex", "codex-skill", "digital-human", "video-generation"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-08-21"
pushedAt: "2026-08-20T13:40:14Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# lanshu-create-ai-presenter-video

*图片：Codex Skill*
*图片：Provider Neutral*
*图片：Validate Skill*
*图片：License: MIT*
[*图片：Python 3.9+*](https://www.python.org/)
[*图片：FFmpeg Required*](https://ffmpeg.org/)
*图片：GitHub stars*

一个面向 Codex 的通用数字人视频制作 Skill。输入主题或文案与授权人物图后，它会组织文案、配音、人物生成、口型校准、字幕与关键词动效、剪辑、渲染和质量验收。

它按能力选择当前环境可用的工具，项目源码不绑定服务商、模型名称或私有接口。

## 最少需要提供什么

1. 一个主题或一份完整文案。
2. 一张经过授权、包含清晰成年人物的参考图。

可选输入包括声音样本、屏幕录制、图片、B-roll、品牌素材、目标平台、时长、横竖屏、风格、水印和结尾引导。

## 安装

```bash
git clone https://github.com/cclank/lanshu-create-ai-presenter-video.git \
  ~/.codex/skills/lanshu-create-ai-presenter-video
```

安装后的 Skill 路径：

```text
~/.codex/skills/lanshu-create-ai-presenter-video
```

## 文件结构

```text
lanshu-create-ai-presenter-video/
├── SKILL.md
├── README.md
├── agents/
│   └── openai.yaml
├── assets/
│   └── job.template.json
├── references/
│   ├── generation.md
│   ├── editing.md
│   └── qa-recovery.md
└── scripts/
    ├── init_job.py
    ├── preflight.py
    └── finalize_delivery.sh
```

## 三份参考文档分别负责什么

- `generation.md`：输入检查、文案、声音、能力选型、付费生成、人物提示词与一致性。
- `editing.md`：时间轴、开场和结尾、字幕预设、人物侧关键词动效、封面与导出。
- `qa-recovery.md`：技术验收、人工验收和常见故障修复。

Codex 只在进入对应阶段时读取相关文档，减少上下文占用。

## 快速使用

在对话中直接说：

```text
使用 $lanshu-create-ai-presenter-video，把这份文案和人物图做成一条 16:9、30 秒、有实时字幕的数字人讲解视频。
```

也可以先初始化标准任务目录：

```bash
SKILL_DIR=~/.codex/skills/lanshu-create-ai-presenter-video

python3 "$SKILL_DIR/scripts/init_job.py" \
  --job-dir ~/Videos/my-presenter-video \
  --presenter-image ~/Pictures/presenter.png \
  --topic "视频主题" \
  --duration 60 \
  --aspect 9:16 \
  --rights-confirmed \
  --adult-presenter-confirmed
```

随后查看并补全 `job.json` 中的人工检查与远程上传许可，再运行：

```bash
python3 "$SKILL_DIR/scripts/preflight.py" ~/Videos/my-presenter-video/job.json
```

## 运行环境

- Codex 或兼容本地 Skill 的 Agent 环境。
- Python `3.9+`。
- `FFmpeg` 与 `ffprobe`。
- Bash、`jq`、`awk` 和 `sed`。
- 至少一种当前环境可调用的视频生成、语音生成与口型同步能力。

## 核心工作方式

```text
主题或文案 + 授权人物图
        ↓
锁定文案与完整配音
        ↓
低成本人物试片
        ↓
生成连续数字人主素材
        ↓
按同一条音频时间轴剪辑
        ↓
添加字幕、关键词动效和封面
        ↓
口型、人物、声音与画面验收
        ↓
输出母版、分享版和 QA 报告
```

完整配音是全片的时间基准。人物视频、字幕、镜头、关键词与转场都按照这条音频定位，可以减少口型漂移和片段衔接问题。

## 默认设置

- 竖屏 `9:16`、`1080×1920`、`30fps`。
- 主题生成的视频通常控制在 45–75 秒。
- 没有授权声音样本时使用合适的库存声音。
- 默认包含清晰开场、2–4 个内容节拍和简洁结尾。
- 音乐与商业引导按需求添加。
- 发布响度目标约为 `-16 LUFS`。

## 安全和成本边界

- 远程上传前确认图片使用权和成年人物状态。
- 克隆声音前确认声音授权。
- 首次付费生成前说明上传内容、生成时长、价格依据、试片方案和重试上限。
- 任务中断后优先查询已有任务 ID，避免重复扣费。
- 连续三个付费候选失败后停止并总结问题。

## 开源与隐私

- 仓库不保存 API 密钥、访问令牌、签名下载地址或用户素材。
- 任务级请求记录需要移除凭据与临时 URL 后再提交。
- 预检与交付报告只保存文件名，不写入开发者机器的绝对路径。
- 项目使用 MIT License，可以自由使用、修改和分发。

## 贡献

欢迎通过 Issue 提交使用反馈，也欢迎用 Pull Request 改进工作流、兼容性和质量检查。
