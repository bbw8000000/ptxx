---
title: "GordenSun/GordenSuperPPTSkills"
owner: "GordenSun"
name: "GordenSuperPPTSkills"
fullName: "GordenSun/GordenSuperPPTSkills"
description: "AI PPT赛道终结者，史上最最最强 PPT Skill！！！  使用GPT生成豪华的图片格式PPT，然后转换为完全可编辑的PPTX文件。"
sourceUrl: "https://github.com/GordenSun/GordenSuperPPTSkills"
stars: 2017
forks: 171
language: "Python"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-07T16:26:51Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Gorden Super PPT Skills（技能包）

AI PPT赛道终结者，史上最最最强 PPT Skill！！！

使用GPT生成豪华的图片格式PPT，然后转换为**完全可编辑**的PPTX文件。

Skill全流程已拆成 **3 个独立技能**，可以拆分使用和优化：

| 技能 | 作用 | 输入 → 输出 |
|---|---|---|
| **GordenImagePPTGen** | 生成「图片格式的 PPT」 | 主题/内容 → 每页 .png + 图片型 .pptx |
| **GordenImage2PPTX** | 把「图片 PPT / 图片」还原成可编辑 pptx | 图片 → 可编辑 .pptx（背景+骨架+图标+文本 四层） |
| **GordenSuperPPTSkill** | 打包编排前两者，依次执行 | 主题/内容 → 图片型 PPT + 可编辑 pptx |

- 只要做图片版 PPT → **GordenImagePPTGen**
- 只把图片转可编辑 → **GordenImage2PPTX**
- 一键"先出图再转可编辑" / 未指定 → **GordenSuperPPTSkill**（A→B 串联）

## 效果展示
1、GordenImagePPTGen（Gorden的图片PPT生成技能）生成图片格式的PPT

*图片：GordenImagePPTGen 生成的图片格式 PPT 示例*

2、GordenImage2PPTX（Gorden的图片转PPTX技能）把图片转换为完全可编辑的PPTX文件

*图片：GordenImage2PPTX 转换后的可编辑 PPTX 示例*

## 如何使用
仅限Codex使用。

第1步：把Github仓库地址发给Codex让他安装技能；

第2步：按需使用。GPT 5.5模型，推理强度选"中"即可。
如果只生成图片格式PPT，提示词：
```
使用GordenImagePPTGen技能，生成一个N页的PPT，内容为XXX，要求PPT要求豪华、信息密度高、排版复杂
```

如果只想**把图片PPT转换成可编辑的PPTX文件**，提示词：
```
把当前文件夹里的XXX.png，使用GordenImage2PPTX，还原成可编辑的PPT，必须严格遵循技能步骤
```

说明：
本技能仅适用于Codex，因为必须使用GPT生成图片和GPT的视觉能力，理论上Opus+GPT生图接口也可以实现，但是本技能没有做专门的适配。

图片转可编辑PPTX文件，比较费额度，转换1张图片大概耗费Plus订阅5小时额度的10%。

框架图默认是整体的一张图，也支持拆分成一个个独立的框架模块图，提示词里明确告诉Codex即可。

## 原理讲解
核心使用的是GPT的生图能力和视觉解析能力。
大致步骤是：依次提取PPT图片的背景图、框架图、图标和装饰图、文本。最后在PPT里按坐标拼装起来。当然为了实现完美的效果，做了很多细节验证和约束规则。
使用过程中，你能看到GPT生成的过程图片。

### 背景图

*图片：图片转 PPTX 过程中的背景图*

### 框架图

*图片：图片转 PPTX 过程中的框架图*

### 图标和装饰

*图片：图片转 PPTX 过程中的图标和装饰*


## 安装（给AI看的）

每个技能目录都是**自包含**的（自带 `scripts/` 与 `references/`）。按需复制：

```bash
# Codex（按需选装其一/全部）
cp -R GordenImagePPTGen   "${CODEX_HOME:-$HOME/.codex}/skills/GordenImagePPTGen"
cp -R GordenImage2PPTX    "${CODEX_HOME:-$HOME/.codex}/skills/GordenImage2PPTX"
cp -R GordenSuperPPTSkill "${CODEX_HOME:-$HOME/.codex}/skills/GordenSuperPPTSkill"
```

> GordenSuperPPTSkill 依赖另两个技能，请与它们一起安装（同一 skills 目录/仓库）。最省事：把整个仓库一起复制过去。

## 依赖

```bash
pip3 install python-pptx pillow numpy
```

图像生成后端按运行时自动解析（Codex 用内置 `imagegen`），见各技能 `references/runtime-notes.md`。

## 目录结构（本文件夹 = 可整体复制给其他 Agent）

```
GordenSuperPPTSkills/
├── README.md                  ← 本文件（总入口）
├── GordenImagePPTGen/         ← 功能A：出图片 PPT（自带 scripts/ references/ 参考图/）
├── GordenImage2PPTX/          ← 功能B：图片→可编辑 pptx（自带 scripts/ references/）
└── GordenSuperPPTSkill/       ← 编排 A→B（自带 references/，调用上面两个技能）
```

每个技能目录均**自包含**。把整个 `GordenPPTSuperSkills/` 复制到目标 Agent 的 skills 目录即可使用。


## 致谢与版权
- 可以商用，**必须标明Github出处，或标记出作者@Gorden Sun**
- 如果你想加入PPT Skill交流群，可以加我微信duge360
- 感谢 [LinuxDO](https://linux.do) 社区的支持
