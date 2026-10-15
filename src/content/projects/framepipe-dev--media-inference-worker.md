---
title: "framepipe-dev/media-inference-worker"
owner: "framepipe-dev"
name: "media-inference-worker"
fullName: "framepipe-dev/media-inference-worker"
description: "Small client for media model inference"
sourceUrl: "https://github.com/framepipe-dev/media-inference-worker"
stars: 209
forks: 58
language: "Python"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-08-29"
pushedAt: "2026-08-26T04:00:49Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# media-inference-worker

Old test client from the media pipeline. The service account was still active
when I copied this, but I have no idea how much credit is left or when the key
will be rotated.

```bash
pip install -r requirements.txt
python generate.py qwen-image-3 "Editorial portrait, hard flash, 35mm grain"
```

Other endpoints and raw requests are in `RUNBOOK.md`.
