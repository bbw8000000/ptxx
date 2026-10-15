---
title: "chenkb98/voxweave"
owner: "chenkb98"
name: "voxweave"
fullName: "chenkb98/voxweave"
description: "Streaming speech language model plumbing: audio frames, turns, conversation schemas, batching, and adapters."
sourceUrl: "https://github.com/chenkb98/voxweave"
stars: 32
forks: 241
language: "Python"
topics: ["audio-language-model", "inference", "python", "speech", "streaming"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-10"
pushedAt: "2026-09-09T17:19:22Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# voxweave

*图片：CI*

Streaming speech language model plumbing: audio frames, turns, conversation schemas, batching, and adapters.

Chen Kaibin · 华南理工大学在读。项目关注音频生成和语音大模型研究中的可复现工具。

本仓库的 2025–2026 提交时间线为重建的演示数据，不代表实际开发日期。

## 快速开始

```sh
python -m venv .venv
.venv/bin/python -m pip install -r requirements-dev.txt
```

激活虚拟环境后运行：

```sh
voxweave demo
```

## 主要功能

PCM 解码、音频帧与对话轮次各有独立边界。离线后端只验证协议，真实模型通过显式接口注入。

| 内容 | 入口 |
| --- | --- |
| 使用与参数 | 使用文档 |
| 完整模块 API | API 索引 |
| 数据流与边界 | 架构 |
| 数值定义与参考 | 设计说明 |
| 可运行合成示例 | examples |

## 验证

```sh
make build
make test
make format-check
make lint typecheck
```

CI 覆盖 Python 3.11 和 3.12。开发工具版本由 requirements-dev.txt 固定。
测试包含空输入、无效值、往返转换、完整字段模式和公共接口契约。

## 范围

默认流程不需要 GPU、付费服务、模型权重或外部数据。音频示例与训练示例是合成基线，
不能用来宣称真实语音准确率或感知质量。PCM16 会量化并饱和削波；线性重采样没有抗混叠滤波。

MIT 许可。参与方式见 CONTRIBUTING。

## 可选模型接口

见上游模型适配器。默认验证不加载模型权重。
