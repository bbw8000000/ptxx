---
title: "CWS6206/EasySystemCleaner"
owner: "CWS6206"
name: "EasySystemCleaner"
fullName: "CWS6206/EasySystemCleaner"
description: "EasySystemCleaner Portable, original Windows 11 cleaning utility. Clean Windows temporary files, crash/error reports, thumbnail cache, browser caches and the Recycle Bin"
sourceUrl: "https://github.com/CWS6206/EasySystemCleaner"
stars: 122
forks: 40
language: "C#"
topics: []
license: "NOASSERTION"
defaultBranch: "main"
snapshotDate: "2026-07-26"
pushedAt: "2026-07-24T08:29:39Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# EasySystemCleaner

Portable, original Windows 11 cleaning utility. **Version 1.2 - 2026**

Copyright by Dr. René Bäder (PhDs). Freeware, licensed under the GNU GPL v3.0.

The original application icon is included in `Assets/EasySystemCleaner.ico` and is used by the executable.

## Functions

- Select and inspect clean-up locations before deletion
- Clean Windows temporary files, crash/error reports, thumbnail cache, browser caches and the Recycle Bin
- Stores selection and `EasySystemCleaner.log` next to the executable
- Command line: `EasySystemCleaner.exe /AUTO` (optional `/SHUTDOWN` after an automatic run)
- Publishes as a self-contained single Windows x64 executable

This is a clean-room implementation. It contains no code, visual assets, branding,
or cleaning databases from FluentCleaner. It deliberately does not offer registry
cleaning or misleading performance claims.

## Build portable release

```powershell
dotnet publish .\EasySystemCleaner.csproj -c Release -r win-x64
```

The portable executable is placed in `bin\Release\net8.0-windows\win-x64\publish`.

## Safety

Close browsers before cleaning browser caches. The tool only removes files from the
explicitly selected locations; review the analysis and keep backups of important data.
