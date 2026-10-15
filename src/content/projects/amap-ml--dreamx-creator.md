---
title: "AMAP-ML/DreamX-Creator"
owner: "AMAP-ML"
name: "DreamX-Creator"
fullName: "AMAP-ML/DreamX-Creator"
description: "Democratizing Native Audio-Video Generation at 2K Resolution"
sourceUrl: "https://github.com/AMAP-ML/DreamX-Creator"
stars: 105
forks: 0
language: "未知"
topics: []
license: "Apache-2.0"
defaultBranch: "main"
snapshotDate: "2026-09-02"
pushedAt: "2026-09-01T03:41:26Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

DreamX-Creator 1.0: Democratizing Native Audio-Video Generation

DreamX Team


[*图片：arXiv*](https://arxiv.org/abs/2608.31106)
*图片：License*


-----

**DreamX-Creator 1.0** is a research framework for **native joint audio-video generation**. Given a first frame and a text prompt, its implemented base generator jointly models modality-specialized video and audio streams, using **Gated Cross-Modal Attention** and **Progressive Joint Training** to enable bidirectional audio-video interaction.

The broader system combines **Audio-Video Reinforcement Learning** with **Modality-Aware Multimodal Feedback** to improve visual and audio quality, semantic consistency, and fine-grained audio-video synchronization. **Autoregressive 1-Step 2K Refinement** then upgrades the generated video to high-quality 2K output while preserving content, motion, and audio-aligned timing.

## :fire: News

- **Sep 1, 2026:** Initialized the DreamX-Creator project repository with its overview and release roadmap.

## :calendar: Plan

- :heavy_check_mark: Initialize the DreamX-Creator project repository.
- :heavy_check_mark: Release the DreamX-Creator 1.0 technical report.
- [ ] Release validated model weights, inference code, configurations, and evaluation tools.

## :books: Citation

If you find DreamX-Creator useful in your research, please consider citing our technical report:

```bibtex
@misc{zhu2026dreamxcreatordemocratizingnativeaudiovideo,
  title={DreamX-Creator: Democratizing Native Audio-Video Generation at 2K Resolution},
  author={Jiashu Zhu and Yanhao Zheng and Ruitian Tian and Rujing Dang and Shen Zhang and Bingze Song and Jiachen Lei and Ruimin Lin and Jiahong Wu and Xiangxiang Chu},
  year={2026},
  eprint={2608.31106},
  archivePrefix={arXiv},
  primaryClass={cs.CV},
  url={https://arxiv.org/abs/2608.31106},
}
```

## :scroll: License

This project is licensed under the Apache License 2.0. See LICENSE for details.

## :sparkles: Acknowledgement

We would like to thank the Wan Team and the OpenMOSS Team for their outstanding open-source work on Wan and MOVA, respectively.
