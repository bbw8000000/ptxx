---
title: "Volumeyascoop/RbxForge"
owner: "Volumeyascoop"
name: "RbxForge"
fullName: "Volumeyascoop/RbxForge"
description: "CLI project generator for Roblox and Rojo"
sourceUrl: "https://github.com/Volumeyascoop/RbxForge"
stars: 97
forks: 96
language: "Python"
topics: ["cli", "luau", "python", "roblox", "rojo"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-21"
pushedAt: "2026-09-20T15:36:41Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# RbxForge

Command-line project generator for Roblox + [Rojo](https://rojo.space). Create a ready project in one command.

*图片：License: MIT*
*图片：Download*

## Download
**Latest release (rbxforge.exe)**

## Usage
```
rbxforge list
rbxforge new MyGame                  # game template
rbxforge new MyLib -t library
rbxforge new MyTool -t plugin -o C:\Projects
```

Templates: `game` (server/client/shared), `library`, `plugin`.

## Run from source
```
python -m rbxforge new MyGame
```

## Build your own exe
Run `build_exe.bat` (needs Python and PyInstaller). Output: `RELEASE/rbxforge.exe`.

## License
MIT, see LICENSE.
