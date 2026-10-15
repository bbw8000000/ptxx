---
title: "TwoSevenOneT/EDRChoker"
owner: "TwoSevenOneT"
name: "EDRChoker"
fullName: "TwoSevenOneT/EDRChoker"
description: "A tool uses the QoS Policy (Pacer.sys) to throttle Endpoint Detection and Response (EDR) agents from connecting to the server."
sourceUrl: "https://github.com/TwoSevenOneT/EDRChoker"
stars: 314
forks: 50
language: "C#"
topics: []
license: "未标注"
defaultBranch: "master"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-13T02:55:46Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# EDRChoker

EDRChoker uses **Policy-based Quality of Service (QoS)** to set hard bandwidth caps (throttling) on Endpoint Detection and Response (EDR) agents, causing them to always time out - effectively blocking them. 

**The rules take effect immediately and persist after the target reboots Windows.**

EDRChoker relies on Windows' **pacer.sys** driver.

### Command Line Syntax

**EDRChoker.exe `**

_To create QoS Policy for all process name in ListFile - Each line per process_

**EDRChoker.exe**

_To remove all installed QoS Policy_

## Links

[EDRChoker: Choking The Telemetry Stream to Bypass Defenses](https://www.zerosalarium.com/2026/06/edrchoker-choking-telemetry-stream-block-edr.html)

### Some EDR/Antivirus have been successfully tested

- **Elastic Defend**
- **Microsoft Defender for Endpoint (MDE)**
- **Tanium Threat Response Agent (EDR)**
- **Trendmicro Deep Security Agent**
- **Hurukai (HarfangLab EDR)**
- **Cortex XDR**
- ...
- _Please contact me if you successfully test it against any other EDR._

## Demo Video

Youtube EDRChoker: [https://youtu.be/hj05mT-45bo](https://youtu.be/hj05mT-45bo)


## 🐦 Enjoying my work? Support the journey by following me on X

[*图片：Twitter Follow*](https://x.com/TwoSevenOneT)

## Author:

[Two Seven One Three](https://x.com/TwoSevenOneT)
