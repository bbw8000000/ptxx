---
title: "lihaoyun6/ComfyUI-H3VAE_TRT"
owner: "lihaoyun6"
name: "ComfyUI-H3VAE_TRT"
fullName: "lihaoyun6/ComfyUI-H3VAE_TRT"
description: "Running ONNX/TRT version of the MiniMax-H3 VAE in ComfyUI, which increase speed by up to 1.7x"
sourceUrl: "https://github.com/lihaoyun6/ComfyUI-H3VAE_TRT"
stars: 74
forks: 5
language: "Python"
topics: []
license: "Apache-2.0"
defaultBranch: "main"
snapshotDate: "2026-09-02"
pushedAt: "2026-09-01T13:51:02Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# ComfyUI-H3VAE_TRT 
Running TensorRT version of the MiniMax-H3 VAE in ComfyUI, which can increase speed by up to 1.7x

## Preview


## Installation

#### Install the node:
```bash
cd ComfyUI/custom_nodes
git clone https://github.com/lihaoyun6/ComfyUI-H3VAE_TRT.git
python -m pip install -r ComfyUI-H3VAE_TRT/requirements.txt
```

## Usage 
### Download Models  
1. Download all 3 models -> [here](https://huggingface.co/lihaoyun6/MiniMax-H3-VAE-ONNX)  
2. Put them into `ComfyUI/models/vae`

### Nodes
- Please compile the TensorRT engine from onnx using the `MiniMax-H3 TRT VAE Compiler` node before first use..
- After successfully compiling the TRT Engines, you can use the `MiniMax-H3 TRT VAE Loader` node to load them.

## Credits
- ComfyUI @comfyanonymous
- MiniMax-H3 @MiniMax-AI
