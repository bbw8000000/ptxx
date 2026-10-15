---
title: "ringhyacinth/Meow-Generator"
owner: "ringhyacinth"
name: "Meow-Generator"
fullName: "ringhyacinth/Meow-Generator"
description: "A playful procedural 3D kitten generator built with Three.js."
sourceUrl: "https://github.com/ringhyacinth/Meow-Generator"
stars: 49
forks: 5
language: "JavaScript"
topics: ["3d", "cats", "generative-art", "interactive", "procedural-generation", "threejs", "vite", "webgl"]
license: "NOASSERTION"
homepage: "https://ringhyacinth.github.io/Meow-Generator/"
defaultBranch: "main"
snapshotDate: "2026-07-27"
pushedAt: "2026-07-26T23:59:10Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Meow Generator

**中文** · English · 日本語

一个可以捏体型、换花色、玩玩具、切换天气、尝试动作并生成收藏卡片的程序化 3D 小猫工具。

[在线体验](https://ringhyacinth.github.io/Meow-Generator/) · 反馈问题

非商业源码开放授权 · 商业使用与合作


*图片：Meow Generator 中文、日文与英文界面及小猫收藏卡片*

## 关于 Meow Generator

**Meow Generator** 由 **Simon_阿文（Simon Lee）** 与 **海辛（Ring Hyacinth）** 共同创作。每只小猫都由种子和可编辑参数程序化生成；相同种子可以重新生成相同的小猫体型、花色、姿势、玩具、垫子、收藏编号与稀有度。

项目采用本地优先的浏览器体验，不需要登录账号，也没有后端服务。

## 主要功能

- 基于 SDF 的程序化小猫身体，可调整头身比、圆润度、腿、耳朵、尾巴与毛发
- 11 种预设花色，以及自定义颜色和花纹参数
- 眼睛颜色、异瞳、瞳孔尺寸与泪眼形变
- 多种静态造型与轻微待机动作
- 实验性的 Motion 模式：19 根骨骼与 14 段动画
- 手绘感描边、三渲二明暗与可调排线阴影
- 可抓取和投掷的鱼、鸭子、毛线球、猫窝及其他物理玩具
- 晴天、阴天、雷雨、下雨与鱼雨场景
- GLB 模型导出与 PNG 小猫收藏卡片
- 实验性的 Codex 宠物导出交接
- 中文、英文、日文界面
- 桌面端与移动端布局

## 小猫收藏卡片

点击 **留影 PNG** 后，Meow Generator 会读取当前小猫的底色、主辅花纹色和眼睛颜色，为它生成专属的默认卡面。

每只小猫都会获得：

- 一个稳定的收藏编号，例如 `第 2902 张 / 9999`
- 一个由小猫种子稳定决定的 `R`、`SR` 或 `AR` 稀有度
- 一套从小猫自身颜色提取的默认卡面
- 可通过“换一个皮肤”切换的圆点、格纹、彩屑与波纹主题
- 印在导出 PNG 上的公开仓库地址，方便重新找到项目

## 导出给 Codex（Experimental）

点击 **🐾 导出给 Codex**，可以为当前小猫准备：

- 保存体型、花纹、眼睛与配色的参数 JSON
- 帮助确认最终外观的参考图 PNG
- 一段可直接复制给 Codex 的创建与安装指令
- 已验证的橘橘动作样机预览

这个入口只负责准备交接文件，不会自动打开或唤醒 Codex。请把 JSON、PNG 和复制的指令一起发送给 Codex；动作图集生成后，应先检查动作总览与左右方向，再安装为新的独立宠物，避免覆盖已有宠物。

## 本地运行

需要 Node.js 20.19+ 或 22.12+。

```bash
npm install
npm run dev
```

然后打开 。

生产构建：

```bash
npm run build
npm run preview
```

## 测试

```bash
npm run test:share
npm run test:fish-pick
npm run test:poke
npm run test:motion
```

Motion 测试覆盖 14 段动画、19 根骨骼、蒙皮权重、状态机输入与源动画采样。

## 操作方式

- 左键拖动：旋转摄影机
- 滚轮或触控板：缩放
- 右键拖动：平移
- 拖动玩具：抓取与投掷
- 拖动脸颊或后侧交互区：软体捏猫
- 拖动后颈：提起小猫
- Motion 模式：使用 `WASD` 或方向键；动作快捷键显示在 Motion 面板中

## 项目结构

- `src/sdf.js` — SDF 基础形状与 Surface Nets 网格生成
- `src/catBuilder.js` — 小猫结构、花色渲染与面部细节
- `src/coats.js` — 花色、眼睛与姿势定义
- `src/rug.js` — 基于种子的垫子与配色
- `src/toys.js` — Cannon-es 玩具物理与抓取
- `src/weather.js` — 天气、闪电、雨、云与落鱼
- `src/shareCard.js` — 收藏卡片主题与 PNG 生成
- `src/codexPetPreview.js` — Codex 宠物参数、参考图与指令导出
- `src/mesh2motion*.js` — 动作采样、重定向、骨骼与蒙皮
- `src/i18n.js` — 中文、英文与日文界面文案

应用没有后端。运行状态和导出文件只保留在浏览器或用户设备中；项目不包含数据分析或账号系统。

## 创作者

Meow Generator 由 Simon_阿文与海辛共同制作。

### Simon_阿文（Simon Lee）

- [Twitter / X](https://x.com/simonxxoo)
- [微博](https://weibo.com/u/1757693565)

### 海辛 / Ring Hyacinth

- [Twitter / X](https://x.com/ring_hyacinth)
- [Instagram](https://www.instagram.com/ringhyacinth/)

如需后续版本开发或合作申请，请联系 ringhyacinth@gmail.com。

## 素材、署名与授权

- 应用设计、程序化小猫系统、界面、原创视觉素材与生成式 BGM 由 Simon_阿文（Simon Lee）和海辛（Ring Hyacinth）为本项目共同制作。
- `src/mesh2motionClips.json` 中的精简猫科动作数据来自 [Mesh2Motion](https://mesh2motion.org/) 以 CC0 1.0 发布的狐狸 / 猫资产，详见 `third_party/mesh2motion/README.md`。
- Three.js、Cannon-es、Vite 及其依赖保留各自原有许可证。

除另行注明的第三方内容外，本项目采用 PolyForm Noncommercial License 1.0.0，以源码公开、非商业使用的方式发布。个人学习、研究、实验、爱好项目，以及符合协议定义的非商业组织，可以依照协议使用、修改和分发本项目。

商业使用不在该授权范围内。任何可能具有商业目的或预期商业应用的使用，以及品牌合作、定制开发、展览或内容授权，请先阅读商业使用与合作说明，并联系 ringhyacinth@gmail.com 取得单独的书面授权。

由于限制商业使用，这是一份非商业源码开放许可，不属于 OSI 批准的开源软件许可证。

## 当前状态

网页版仍是持续迭代中的创意工具原型，Motion 模块明确属于实验功能。极端体型参数、长时间 WebGL 运行与移动设备性能可能因设备而异。

欢迎提交可复现的问题和使用反馈。

## 灵感来源

*图片：Meow Generator 的灵感来源：躺在圆形猫抓板上的真实橘白小猫与周围的鱼玩具、编织地毯和猫咪用品*

Meow Generator 的灵感来自我们身边真实的小猫。它圆润的身体、蜷坐的姿态，以及猫抓板、鱼玩具、编织地毯与明亮配色，共同成为项目在造型、场景、玩具和色彩设计上的起点。
