---
title: "MSNightmare/PrettyPrague"
owner: "MSNightmare"
name: "PrettyPrague"
fullName: "MSNightmare/PrettyPrague"
description: "GenDigital Avast Antivirus ZeroDay Elevation of Privileges Vulnerability"
sourceUrl: "https://github.com/MSNightmare/PrettyPrague"
stars: 72
forks: 22
language: "C"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-08-31"
pushedAt: "2026-08-30T16:48:28Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# PrettyPrague
GenDigital Avast Antivirus ZeroDay Elevation of Privileges Vulnerability

Another zeroday in an antimalware provider, I'm not sure but I believe this vulnerability affect other GenDigital products as well (such as AVG, Norton...)

For now the PoC is compatible with any version of Avast Antivirus.

The PoC will dump the SAM database by abusing a vulnerability in Avast Sandbox and spawn a full SYSTEM shell, at the time of writing this the PoC works with fully patched Avast Antivirus + Patched Windows 11 25H2
