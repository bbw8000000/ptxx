---
title: "CWS6206/EasySSDTester"
owner: "CWS6206"
name: "EasySSDTester"
fullName: "CWS6206/EasySSDTester"
description: "Easy SSD Tester - Portable Windows 11 utility for checking SSD health, SMART data and simple sequential read/write performance."
sourceUrl: "https://github.com/CWS6206/EasySSDTester"
stars: 91
forks: 14
language: "PowerShell"
topics: []
license: "GPL-3.0"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-20T07:41:27Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Easy SSD Tester

Version 1.0 - 2026

Portable Windows 11 utility for checking SSD health, SMART data and simple sequential read/write performance.

## Start

Run `EasySSDTester.cmd`. No installation is required.
Execution is only possible with administrator rights.

For the most complete SMART output, place `smartctl.exe` from smartmontools in `Tools\smartctl.exe` next to the app, or make it available in `PATH`.

Without smartctl, the app still uses Windows storage information where available, but detailed wear counters may be limited.

## Features

- SSD/HDD/NVMe/SATA/USB drive overview
- Windows health and reliability counters
- Optional smartctl SMART/NVMe analysis
- Traffic-light style health verdict
- Manufacturer detection from model names
- Sequential read/write plausibility test
- HTML report export
- Portable execution on Windows 11

## Legal

Copyright by Dr. René Bäder (PhDs)

Easy SSD Tester is Freeware and kostenlos.

This project is distributed under the GNU General Public License v3.0. See `LICENSE`.

Third-party tool note: smartmontools is a separate project. If you bundle `smartctl.exe`, include the matching smartmontools license files from that project.
