---
title: "ZihangDong/toolknit-desktop"
owner: "ZihangDong"
name: "toolknit-desktop"
fullName: "ZihangDong/toolknit-desktop"
description: "多功能工具箱 · 桌面端开源版 | 音视频/图片/PDF/AI 一站式处理"
sourceUrl: "https://github.com/ZihangDong/toolknit-desktop"
stars: 177
forks: 25
language: "JavaScript"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-08-02"
pushedAt: "2026-08-01T05:16:29Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

*图片：ToolKnit Banner*

# ToolKnit

### 多功能工具箱 · 桌面端开源版

**一个 exe 替代 20+ 在线工具网站,全部本地运行,文件不上传,隐私安全。**

English · 简体中文

*图片：Stars*
*图片：License: MIT*
[*图片：Platform*]()
[*图片：Tauri*](https://tauri.app)
*图片：Release*

### ☕ 如果 ToolKnit 帮到了你,欢迎支持作者继续维护

| 微信支付 | 支付宝 |
|:---:|:---:|
|  |  |

---

### 网页端(在线版,功能更全,免安装)

# [toolknit.com](https://toolknit.com)


---

## 简介

ToolKnit 是一个多功能桌面工具箱,把日常会用到的音视频处理、图片转换压缩、PDF/文档处理、AI 对话、文本工具等功能集成在一个应用里。所有文件处理全部本地完成,不上传服务器,隐私安全有保障。

> **这个桌面端是 ToolKnit 网页端的开源配套版本。**
> 网页端功能更完整、免安装、跨平台、即开即用,推荐优先使用:
> **[toolknit.com](https://toolknit.com)**

### 适合谁用?

- 不想把文件上传到各种在线工具网站的**隐私敏感用户**
- 希望一个软件搞定 PDF/图片/音视频/AI 的**效率工作者**
- 需要离线环境下处理文件的**学生/办公人群**
- 想学习 Tauri + 原生 JavaScript 桌面应用开发的**开发者**

## 路线图

- [x] v1.0: 开源纯净版
- [ ] v1.2: 自定义背景、默认保存路径、更多格式转换、CLI 支持
- [ ] 后续: 插件化、更多工具

欢迎提交 Issue 提建议!

## 功能特性

### 文档工具(Document Studio)

| 工具 | 说明 |
|------|------|
| PDF 合并 | 多个 PDF 合并为一个 |
| PDF 拆分 | 按页码拆分 PDF |
| PDF 旋转 | 旋转 PDF 页面 |
| PDF 加密 | 给 PDF 添加密码保护 |
| PDF 解密 | 解除 PDF 密码 |
| PDF 压缩 | 压缩 PDF 体积 |
| PDF 增强 | 增强 PDF 清晰度 |

### 图片工具(Pixel Lab)

| 工具 | 说明 |
|------|------|
| 图片转换 | 批量转换图片格式(JPG/PNG/WebP/BMP/GIF) |
| 图片压缩 | 压缩图片体积 |
| 图标生成 | 生成应用图标 |

### 音视频工具(Sound Studio)

| 工具 | 说明 |
|------|------|
| 音频转换 | 批量转换音频格式 |
| BPM 检测 | 检测音频节拍 |
| 音频裁剪 | 精确裁剪音频片段 |
| 音频提取 | 从视频提取音轨 |
| 视频转换 | 批量转换视频格式 |

### AI 工具

| 工具 | 说明 |
|------|------|
| AI 润色 | 智能润色文本 |
| AI 翻译 | 多语言翻译 |
| AI 文档 | 智能文档处理 |
| AI 表格 | 智能表格处理 |

> AI 工具支持 DeepSeek / OpenAI / 通义千问 / Moonshot,用户自行配置 API Key,数据直连模型厂商,不经第三方。

## 界面预览

*图片：ToolKnit 界面预览*

### 文本与小工具

| 工具 | 说明 |
|------|------|
| 颜色提取 | 从图片提取配色 |
| 文本统计 | 统计字数/行数 |
| 文本格式化 | 大小写转换等 |
| 打字测试 | 打字速度练习 |
| BMI 计算器 | 身体质量指数 |
| 时间戳计算 | Unix 时间戳转换 |

## 下载使用

### 方式一:下载安装包(推荐)

无需配置环境,直接下载编译好的安装包:

**前往 GitHub Releases 下载最新版**

### 方式二:从源码构建

适合开发者,可自行修改和编译。

#### 环境要求

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://www.rust-lang.org/) (stable)
- Windows 10+

#### 构建步骤

1. **克隆仓库**

   ```bash
   git clone https://github.com/ZihangDong/toolknit-desktop.git
   cd toolknit-desktop
   ```

2. **下载 ffmpeg.exe(必需)**

   由于 GitHub 单文件 100MB 限制,ffmpeg.exe 未包含在仓库中,需自行下载:

   - 下载地址:ffmpeg-master-latest-win64-gpl.zip
   - 解压后,将 `bin/ffmpeg.exe` 放到以下路径:

     ```
     toolknit-desktop/src-tauri/resources/ffmpeg/ffmpeg.exe
     ```

   - 目录结构应如下:

     ```
     toolknit-desktop/
     └── src-tauri/
         └── resources/
             └── ffmpeg/
                 └── ffmpeg.exe   ← 放在这里
     ```

3. **安装依赖并构建**

   ```bash
   npm install
   npm run tauri build
   ```

   构建完成后,安装包在 `src-tauri/target/release/bundle/` 目录下。

4. **开发模式运行**

   ```bash
   npm run tauri dev
   ```

## 关于网页端

ToolKnit 网页端([toolknit.com](https://toolknit.com))是功能更完整的在线版本:

- 免安装,浏览器即开即用
- 功能更丰富,持续更新
- 跨平台支持(Windows / macOS / Linux / 移动端)
- 无需配置环境

**[立即体验网页端](https://toolknit.com)**

## 技术栈

| 分类 | 技术 |
|------|------|
| 桌面框架 | [Tauri 2.x](https://tauri.app/)(Rust) |
| 前端 | 原生 JavaScript + [Vite](https://vitejs.dev/) |
| 音视频处理 | ffmpeg(内置打包,无需额外安装) |
| AI 模型 | DeepSeek / OpenAI / 通义千问 / Moonshot(用户自配 Key) |
| ML 模型 | whisper(语音识别)、yolov8(水印检测)(模型文件需自行下载) |

## Star 历史

感谢每一位 Star 支持者的鼓励! 🌟

*图片：Star History Chart*

## 开源协议

本项目基于 MIT License 开源,可自由使用、修改、分发。

## 链接

- 网页端:[toolknit.com](https://toolknit.com)
- 下载桌面端:GitHub Releases
- 问题反馈:GitHub Issues
- 赞助支持:[toolknit.com](https://toolknit.com)(页面底部)

---


**喜欢 ToolKnit?去 [toolknit.com](https://toolknit.com) 体验完整版!**

如果这个项目对你有帮助,欢迎 Star 支持

---

## 作者

- 中文名:董子航
- English Name:Zihang Dong
- GitHub:@ZihangDong
