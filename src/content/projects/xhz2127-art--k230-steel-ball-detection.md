---
title: "xhz2127-art/k230-steel-ball-detection"
owner: "xhz2127-art"
name: "k230-steel-ball-detection"
fullName: "xhz2127-art/k230-steel-ball-detection"
description: "YOLOv8 steel-ball detection demo for CanMV K230"
sourceUrl: "https://github.com/xhz2127-art/k230-steel-ball-detection"
stars: 30
forks: 1
language: "Python"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-07-24"
pushedAt: "2026-07-23T07:45:49Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# k230-steel-ball-detection
YOLOv8 steel-ball detection demo for CanMV K230

基于 YOLOv8 和 CanMV K230 的钢球目标检测示例。

仅初步测试，模型训练还不完善。后续会优化。

## 文件说明

- `main.py`：K230 端推理和显示程序
- `best.pt`：原始pt模型，可用于maixcam
- `best.kmodel`：转换后的 K230 模型

## 当前配置

- 摄像头画面：640 × 360
- 模型输入：320 × 320
- 类别：`ball`
- 置信度阈值：0.3
- 显示方式：LCD
- 摄像头编号：sensor_id=2

## 使用方法

1. 将 `main.py` 复制到 K230 存储卡根目录。
2. 将 `best.kmodel` 复制为：

   `/sdcard/best.kmodel`

3. 确保运行环境能够导入：

   - `libs.PipeLine`
   - `libs.YOLO`

4. 在 CanMV IDE 中运行 `main.py`。

## 注意

当前仓库没有包含 `libs` 模块。如果所使用的 CanMV 固件或示例环境没有提供这些模块，
需要另外复制对应的 `PipeLine.py`、`YOLO.py` 及其依赖文件。

## License

MIT License
