---
title: "VAST-AI-Research/TripoSplat"
owner: "VAST-AI-Research"
name: "TripoSplat"
fullName: "VAST-AI-Research/TripoSplat"
description: "TripoSplat converts a single 2D image into high-quality and variable number of 3D Gaussians, developed by TripoAI."
sourceUrl: "https://github.com/VAST-AI-Research/TripoSplat"
stars: 1322
forks: 139
language: "Python"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-08-13T09:44:34Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# TripoSplat
TripoSplat converts a single 2D image into high-quality and variable number of 3D Gaussians, developed by [TripoAI](https://www.tripo3d.ai/). It can serve as a powerful pipeline tool for asset creation, AR/VR, game development, simulation environments, and beyond. This is the inference-only repo for TripoSplat. For the training code, see TripoSplat-Training.


|  |  |
|---|---|
|  |  |

## Highlights
- **High-quality, versatile generation** that handles a wide range of image styles.
- **Arbitrary Gaussian count** (up to 262,144) — trade off visual quality against rendering cost according to your need.
- **Minimal, readable code**: two files (`triposplat.py` and `model.py`), ~2,000 LOC total. Easy to customize and integrate into other ecosystems.
- **Near-zero dependencies**: no `transformers`, no `diffusers`, no version-conflict hell. Runs on any platform.
- **Official ComfyUI support**: drop the official workflow template into ComfyUI and start playing with TripoSplat right away.

## Quickstart
Download model weights to `ckpts/` from [HuggingFace](https://huggingface.co/VAST-AI/TripoSplat). 
```bash
# Use one of the following ways to download model weights.

# 1. Use HuggingFace CLI
hf download VAST-AI/TripoSplat --local-dir ckpts/

# 2. Use huggingface_hub
pip install huggingface_hub
python -c "from huggingface_hub import snapshot_download; snapshot_download(repo_id='VAST-AI/TripoSplat', local_dir='ckpts/')"

# 3. Use ModelScope CLI
pip install modelscope
modelscope download VAST-AI-Research/TripoSplat --local_dir ckpts/

# 4. Use modelscope Python SDK
pip install modelscope
python -c "from modelscope import snapshot_download; snapshot_download('VAST-AI-Research/TripoSplat', local_dir='ckpts/')"

# 5. Manual download from HuggingFace / ModelScope.
```

Setup the environment and run the example inference script.
```bash
# install torch and torchvision according to your environment
pip install numpy safetensors pillow tqdm
python run_example.py
```

The exported `.ply` / `.splat` files can be visualized in any 3D Gaussian
viewer — e.g. [SparkJS](https://sparkjs.dev) or
[SuperSplat](https://superspl.at/editor).


## Gradio Demo

```bash
pip install gradio
python run_gradio.py
```

## License
TripoSplat code and weight models are released under the MIT License.

## Citation
If you find TripoSplat useful, please cite:
```bibtex
@misc{yan2026generative3dgaussianslearned,
    title={Generative 3D Gaussians with Learned Density Control}, 
    author={Runjie Yan and Yan-Pei Cao and Peng Wang and Ding Liang and Yuan-Chen Guo},
    year={2026},
    eprint={2605.16355},
    archivePrefix={arXiv},
    primaryClass={cs.GR},
    url={https://arxiv.org/abs/2605.16355}, 
}
```
