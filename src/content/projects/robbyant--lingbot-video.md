---
title: "Robbyant/lingbot-video"
owner: "Robbyant"
name: "lingbot-video"
fullName: "Robbyant/lingbot-video"
description: "Scaling Mixture-of-Experts Video Pretraining for Embodied Intelligence"
sourceUrl: "https://github.com/Robbyant/lingbot-video"
stars: 962
forks: 49
language: "Python"
topics: ["image-to-video", "lingbot-video", "video-generation", "world-models"]
license: "Apache-2.0"
homepage: "https://technology.robbyant.com/lingbot-video"
defaultBranch: "master"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-17T18:21:43Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# LingBot-Video

**🌐 [Project Page](https://technology.robbyant.com/lingbot-video)** | **🤗 [Hugging Face](https://huggingface.co/collections/robbyant/lingbot-video)** | **🤖 [ModelScope](https://www.modelscope.cn/collections/Robbyant/LingBot-Video)** | **📄 [Paper](https://arxiv.org/abs/2607.07675)** | **⚖️ License** | **💬 WeChat 微信 Group**

**📘 English Usage**: English Documentation \
**📕 中文使用文档**: 中文文档

We are excited to introduce **LingBot-Video**, the first open-source large-scale MoE (Mixture-of-Experts) video generation model dedicated to embodied intelligence. As a top-tier video model, LingBot-Video is designed to bridge the gap between video synthesis and physical world understanding.

## 🔥 Key Highlights

* **🚀 Efficient MoE Architecture**: Scaled from scratch; balanced between capacity and cost with **~3x** faster inference.
* **📦 Data Engine**: Trained on massive web videos integrated with **70,000+ hours** of embodied data.
* **⚖️ Multi Reward System**: Rewarded for **high aesthetics**, **physical rationality**, and **task completion**.
* **⚡ Few-Step Student Sampling**: DMD-distilled checkpoints (t2v and ti2v) for 8-step video generation, on both the diffusers and SGLang engines.

## 🎬 Video Demos


   


## 🔥 Latest News

- Sept 18, 2026: ⚡ We release the 8-step DMD student model for LingBot-Video.
- Aug 5, 2026: 🎉 We release the RBench evaluation for LingBot-Video.
- July 9, 2026: 🎉 We release the technical report, code, models, rewriters for LingBot-Video.

## 📦 Model Download

| Model Name | Components | Tasks | Download |
| --- | --- | --- | --- |
| ⚡ LingBot-Video-Dense | Dense (1.3B) | T2I, T2V, TI2V | 🤗 [Huggingface](https://huggingface.co/robbyant/lingbot-video-dense-1.3b) &nbsp; 🤖 [ModelScope](https://www.modelscope.cn/models/Robbyant/lingbot-video-dense-1.3b) |
| 💪 LingBot-Video-MoE | MoE (30B-A3B) + Refiner | T2I, T2V, TI2V, Refinement | 🤗 [Huggingface](https://huggingface.co/robbyant/lingbot-video-moe-30b-a3b) &nbsp; 🤖 [ModelScope](https://www.modelscope.cn/models/Robbyant/lingbot-video-moe-30b-a3b) |
| ⚡ LingBot-Video-MoE-DMD | MoE (30B-A3B), 8-step distilled student | T2V, TI2V | 🤗 [Huggingface](https://huggingface.co/robbyant/lingbot-video-moe-dmd-30b-a3b) &nbsp; 🤖 [ModelScope](https://www.modelscope.cn/models/Robbyant/lingbot-video-moe-dmd-30b-a3b) |
| 📝 LingBot-Video-Rewriter-Base | Qwen3.6-27B official | Prompt rewriter (Expand) | 🤗 [Huggingface](https://huggingface.co/Qwen/Qwen3.6-27B) &nbsp; 🤖 [ModelScope](https://www.modelscope.cn/models/Qwen/Qwen3.6-27B) |
| 📝 LingBot-Video-Rewriter-Adapter | Qwen3.6-27B LoRA | Prompt rewriter (Json) | 🤗 [Huggingface](https://huggingface.co/robbyant/lingbot-video-rewriter-lora) &nbsp; 🤖 [ModelScope](https://www.modelscope.cn/models/Robbyant/lingbot-video-rewriter-lora) |

## 📦 Evaluation Download

| Dataset Name | Benchmark | Download |
| --- | --- | --- |
| 📊 LingBot-Video-RBench | RBench 🌐 [webpage](https://dagroup-pku.github.io/ReVidgen.github.io/) 🏆 [leaderboard](https://huggingface.co/spaces/DAGroup-PKU/RBench-Leaderboard) | 🤗 [Huggingface](https://huggingface.co/datasets/robbyant/lingbot-video-rbench) |

## 🚀 Quick Start

### 🛠️ Installation

The root `requirements.txt` includes the recommended PyTorch build for LingBot-Video inference.

```bash
git clone https://github.com/Robbyant/lingbot-video
cd lingbot-video

python -m venv .venv
source .venv/bin/activate
python -m pip install -U pip

# Base requirements cover direct DiT inference and rewriter --backend transformers.
pip install -r requirements.txt
pip install -e .
```

> **💡 Rewriter deployment**: the bundled rewriter uses the single-process
> `transformers` backend. For higher throughput, deploy the VLM yourself and call
> it through an OpenAI-compatible API. Preserve the two-stage semantics: step 1
> must use the base VLM without the rewriter LoRA, while step 2 must use the same
> base VLM with the rewriter LoRA enabled. This can be implemented with two
> endpoints, or with one server that can select the adapter per request. See
> [vLLM](https://docs.vllm.ai) / [SGLang](https://docs.sglang.ai) official docs.
> Details in Prompt Preparation.

Install the optional SGLang dependencies only when using SGLang Diffusion or the
fused / FP8 MoE runtime:

```bash
python -m pip install --no-deps -r requirements-sglang.txt
```

Recommended runtime versions:

| Package | Version |
| --- | --- |
| `Python` | `>=3.10` |
| `torch` | `2.12.0.dev20260220+cu130` (recommended) |
| `torchvision` | `0.26.0.dev20260220+cu130` (recommended) |
| `transformers` | `5.8.1` |
| `diffusers` | `0.39.0` |
| `peft` | `0.19.1` |
| `json_repair` | `>=0.30` |
| `decord` | `>=0.6.0` |
| `safetensors` | `>=0.4.5` |

### 🎬 Inference

#### ⚡ DMD: 8-step T2V and TI2V

Use the **DMD-distilled MoE checkpoint** with `--scheduler dmd_student`,
**8 steps**, **guidance scale 1.0**, and **shift 3.0**. The default examples
produce **121 frames at 832 × 480 and 24 fps**, without a refiner.

`MODEL_DIR` must be a downloaded **local model root**, containing
`model_index.json`, `transformer/`, `text_encoder/`, `processor/`, `vae/`, and
`scheduler/`. Its `transformer/` must contain the DMD student weights.
A transformer-only export is not sufficient.

Start with the structured prompts and matching first frame already bundled in
this repository:

```bash
export MODEL_DIR=""

# T2V: bundled structured prompt.
bash scripts/single-gpu/run_moe_dmd_t2v.sh

# TI2V: bundled structured prompt and its matching first-frame image.
bash scripts/single-gpu/run_moe_dmd_ti2v.sh
```

The scripts accept `MODEL_DIR`, `PROMPT_JSON`, `IMAGE` (TI2V), `OUT_DIR`,
`SEED`, `HEIGHT`, `WIDTH`, `BACKEND`, and `PYTHON_BIN` environment overrides.
For example, to use your own prepared TI2V input:

```bash
MODEL_DIR="" \
PROMPT_JSON="prompt.json" IMAGE="first_frame.png" OUT_DIR="outputs/dmd_ti2v" \
  bash scripts/single-gpu/run_moe_dmd_ti2v.sh
```

Or call the unified runner directly:

```bash
python scripts/inference.py \
  --backend diffusers --model_dir "$MODEL_DIR" \
  --mode t2v --prompt_json assets/cases/t2v/example_1/prompt.json \
  --output outputs/dmd_t2v.mp4 \
  --scheduler dmd_student --steps 8 --guidance_scale 1 --shift 3 \
  --height 480 --width 832 --duration 5 --num_frames 121 --fps 24 \
  --seed 42 --transformer_dtype bf16 --text_encoder_dtype bf16 --vae_dtype fp32
```

For TI2V, replace the mode and prompt with `--mode ti2v
--prompt_json assets/cases/ti2v/example_1/prompt.json` and add
`--image assets/cases/ti2v/example_1/first_frame.png`.

For new plain-language prompts, follow Prompt Preparation
and use the same first frame for rewriting and TI2V generation. At DMD guidance
scale 1.0, the examples do not need an Auto Negative step. The existing ordinary
MoE scripts use a different scheduler and guidance recipe; use the DMD scripts
above for student checkpoints.

The single-GPU 5-second examples were checked on a GPU with about 140 GiB of
memory, using BF16 DiT/text encoder and FP32 VAE. Observed PyTorch peak allocated
memory was about 82 GiB; this is not a minimum-memory specification. Start with
the 5-second recipe. See the DMD guide for
sampling and precision details.

#### 🧭 Recommended Inference Workflow

LingBot-Video DiT inference is designed to consume structured JSON captions,
not casual natural-language prompts. The recommended public workflow is:

1. Rewrite the user's plain prompt with
   Prompt Rewriter.
   For TI2V, pass the same first frame to the rewriter.
2. Run Auto Negative by
   default to prune the negative prompt for this specific caption.
3. Run the unified inference runner with `--prompt_json` and select direct
   diffusers or SGLang Diffusion through `--backend`.

Backend choices:

- `diffusers`: direct diffusers reference path.
- `sglang`: SGLang Diffusion path. If the optional SGLang package is not
  installed, it automatically falls back to direct diffusers and prints a
  warning. Install `requirements-sglang.txt` to enable the SGLang runtime.

For multi-GPU inference, add `--enable_fsdp_inference` to shard the base DiT and
refiner DiT on GPU. This reduces GPU memory pressure after loading, but each
rank still constructs the transformer on host memory before FSDP sharding; make
sure the machine has enough system RAM for large MoE checkpoints. Add
`--enable_vlm_fsdp_inference` independently when Qwen3-VL also needs GPU-memory
sharding; see the inference performance benchmark
for the complete Dense/MoE speed, memory, and exactness matrix.

```bash
# Model root (released Dense or MoE package) and rewriter weights.
export MODEL_DIR=""
export REWRITER_BASE_MODEL=""
export REWRITER_ADAPTER=""

python rewriter/inference.py --backend transformers --mode t2v \
  --prompt "" --duration 5 --output prompt.json

# Recommended Auto Negative block. If skipped, remove --negative_prompt_json from
# the DiT inference command.
python rewriter/auto_negative.py --backend transformers --mode t2v \
  --caption prompt.json --output negative.json

export BACKEND=diffusers  # or: sglang

python scripts/inference.py \
  --backend "$BACKEND" \
  --model_dir "$MODEL_DIR" \
  --run_refiner \
  --mode t2v \
  --prompt_json prompt.json \
  --negative_prompt_json negative.json \
  --output "/base.mp4" \
  --refiner_output "/refined.mp4" \
  --height 480 \
  --width 832 \
  --fps 24 \
  --steps 40 \
  --refiner_steps 8 \
  --guidance_scale 3 \
  --refiner_guidance_scale 3 \
  --shift 3 \
  --refiner_shift 3 \
  --transformer_dtype bf16 \
  --text_encoder_dtype bf16 \
  --vae_dtype fp32 \
  --refiner_vae_dtype fp32 \
  --refiner_vae_tiling \
  --refiner_vae_tile_height 384 \
  --refiner_vae_tile_width 640 \
  --refiner_vae_tile_stride_height 288 \
  --refiner_vae_tile_stride_width 480 \
  --release_base_before_refiner \
  --reuse_condition_features
```

For 1080p refiner output, refiner VAE tiling is enabled by default with
`384x640` tiles and `288x480` strides. This is a memory-saving 25% overlap
setting. Use `--no-refiner_vae_tiling` only when decode memory is already
comfortable and you prefer faster VAE decode.

Ready-to-run scripts are provided for single-GPU and multi-GPU inference. Set
your environment and model path first:

```bash
source .venv/bin/activate
export PYTHON_BIN=python
export DENSE_MODEL_DIR=""
export MOE_MODEL_DIR=""
```

Single-GPU scripts use direct diffusers and sequential CFG by default to reduce
peak memory. They run base generation only.

```bash
MODEL_DIR="$DENSE_MODEL_DIR" ./scripts/single-gpu/run_dense_t2i.sh
MODEL_DIR="$DENSE_MODEL_DIR" ./scripts/single-gpu/run_dense_t2v.sh
MODEL_DIR="$DENSE_MODEL_DIR" ./scripts/single-gpu/run_dense_ti2v.sh

MODEL_DIR="$MOE_MODEL_DIR" ./scripts/single-gpu/run_moe_t2i.sh
MODEL_DIR="$MOE_MODEL_DIR" ./scripts/single-gpu/run_moe_t2v.sh
MODEL_DIR="$MOE_MODEL_DIR" ./scripts/single-gpu/run_moe_ti2v.sh
```

Multi-GPU no-refiner scripts use the same inference arguments as the single-GPU
scripts, plus CP8 and FSDP:

```bash
MODEL_DIR="$DENSE_MODEL_DIR" ./scripts/multi-gpus-no-refiner/run_dense_t2i_fsdp_cp8.sh
MODEL_DIR="$DENSE_MODEL_DIR" ./scripts/multi-gpus-no-refiner/run_dense_t2v_fsdp_cp8.sh
MODEL_DIR="$DENSE_MODEL_DIR" ./scripts/multi-gpus-no-refiner/run_dense_ti2v_fsdp_cp8.sh

MODEL_DIR="$MOE_MODEL_DIR" ./scripts/multi-gpus-no-refiner/run_moe_t2i_fsdp_cp8.sh
MODEL_DIR="$MOE_MODEL_DIR" ./scripts/multi-gpus-no-refiner/run_moe_t2v_fsdp_cp8.sh
MODEL_DIR="$MOE_MODEL_DIR" ./scripts/multi-gpus-no-refiner/run_moe_ti2v_fsdp_cp8.sh
```

Multi-GPU refiner scripts use CP8 + FSDP + sequential CFG by default. They
release the base pipeline before refiner execution and enable refiner VAE
tiling for 1080p decode. The scripts default to direct diffusers; set
`BACKEND=sglang` externally when you want to exercise SGLang Diffusion. MoE
multi-GPU T2V/TI2V scripts additionally run the refiner.

```bash
MODEL_DIR="$DENSE_MODEL_DIR" ./scripts/multi-gpus/run_dense_t2i_fsdp_cp8.sh
MODEL_DIR="$DENSE_MODEL_DIR" ./scripts/multi-gpus/run_dense_t2v_fsdp_cp8.sh
MODEL_DIR="$DENSE_MODEL_DIR" ./scripts/multi-gpus/run_dense_ti2v_fsdp_cp8.sh

MODEL_DIR="$MOE_MODEL_DIR" ./scripts/multi-gpus/run_moe_t2i_fsdp_cp8.sh
MODEL_DIR="$MOE_MODEL_DIR" ./scripts/multi-gpus/run_moe_t2v_refiner_fsdp_cp8.sh
MODEL_DIR="$MOE_MODEL_DIR" ./scripts/multi-gpus/run_moe_ti2v_refiner_fsdp_cp8.sh
```

All scripts accept the same environment overrides, such as `PROMPT_JSON`,
`IMAGE`, `OUT_DIR`, `HEIGHT`, `WIDTH`, `STEPS`, `GUIDANCE_SCALE`, `SHIFT`,
`SEED`, `FPS`, `BACKEND`, and `PYTHON_BIN`. Refiner scripts also accept
`REFINER_HEIGHT`, `REFINER_WIDTH`, `REFINER_STEPS`,
`REFINER_GUIDANCE_SCALE`, `REFINER_SHIFT`, `REFINER_T_THRESH`, and
`REFINER_SIGMA_TAIL_STEPS`. MoE scripts default to grouped expert execution
(`LINGBOT_MOE_EXPERT_BACKEND=grouped_mm`).

See English Docs or 中文文档 for the
detailed prompt rewrite, auto-negative, TI2V, base-only/refiner, distributed
SGLang, and speed-first FP8 workflows.

## 📊 Benchmarks

The complete Dense/MoE inference matrix covers Single GPU, CP8, DiT FSDP,
VLM FSDP, Direct Diffusers, SGLang Adapter Exact, and MoE FP8 expert:
Performance Benchmark /
推理性能与显存报告.

### 🏛️ Public Benchmark

As of July 9th, 2026, LingBot-Video ranks top in [RBench Leaderboard](https://huggingface.co/spaces/DAGroup-PKU/RBench-Leaderboard).

| Models | Open-source | Avg. | Manip. | Spatial | Multi-entity | Long-hor. | Reasoning | Single arm | Dual arm | Quadruped | Humanoid |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **LingBot-Video (Ours)** | ✅ | **0.620** | **0.578** | 0.643 | 0.444 | **0.634** | 0.505 | 0.636 | 0.639 | **0.758** | 0.689 |
| Cosmos3 Super | ✅ | 0.581 | 0.487 | 0.642 | 0.444 | 0.591 | 0.395 | 0.615 | 0.623 | 0.739 | 0.691 |
| LongCat-Video | ✅ | 0.437 | 0.372 | 0.310 | 0.220 | 0.384 | 0.186 | 0.586 | 0.576 | 0.681 | 0.621 |
| Wan 2.2 A14B | ✅ | 0.507 | 0.381 | 0.454 | 0.373 | 0.501 | 0.330 | 0.608 | 0.582 | 0.690 | 0.648 |
| HunyuanVideo 1.5 | ✅ | 0.460 | 0.442 | 0.316 | 0.312 | 0.438 | 0.364 | 0.513 | 0.526 | 0.634 | 0.595 |
| Wan 2.6 | ❌ | 0.607 | 0.546 | **0.656** | 0.479 | 0.514 | **0.531** | **0.666** | **0.681** | 0.723 | 0.667 |
| Seedance 1.5 pro | ❌ | 0.584 | 0.577 | 0.495 | **0.484** | 0.570 | 0.470 | 0.648 | 0.641 | 0.680 | **0.692** |
| Veo 3 | ❌ | 0.563 | 0.521 | 0.508 | 0.430 | 0.530 | 0.504 | 0.634 | 0.610 | 0.689 | 0.637 |

*Note: **Bold** indicates the best performance, and underline indicates the second best.*

### 🔬 Internal Benchmark

Our internal evaluation comprehensively assesses both **Text-to-Video (T2V)** and **Text-to-Image-to-Video (TI2V)** capabilities for open-source models across two dimensions: **Quality Scores** (Motion, Prompt Following, Visual Consistency, Aesthetics) and **Domain Scores** (Human Interaction, Physics, Robot, Egocentric, Navigation).


  
    
      
      (a) T2V Quality Score
    
    
      
      (b) T2V Domain Score
    
  
  
    
      
      (c) TI2V Quality Score
    
    
      
      (d) TI2V Domain Score
    
  


## ⚖️ License
This project is licensed under the Apache 2.0 License. Please refer to the LICENSE file for the full text, including details on rights and restrictions.

## 📚 Citation
If you find this work useful for your research, please cite our paper:

```bibtex
@article{lingbot-video,
  title = {Scaling Mixture-of-Experts Video Pretraining for Embodied Intelligence},
  author = {Shuailei Ma and Jiaqi Liao and Xinyang Wang and Jingjing Wang and Chaoran Feng and Zijing Hu and Chong Bao and Zichen Xi and Yuqi Gan and Weisen Wang and Yanhong Zeng and Qin Zhao and Zifan Shi and Wei Wu and Hao Ouyang and Qiuyu Wang and Shangzhan Zhang and Jiahao Shao and Yipengjing Sun and Liangxiao Hu and Lunke Pan and Nan Xue and Kecheng Zheng and Yinghao Xu and Xing Zhu and Yujun Shen and Ka Leong Cheng},
  journal={arXiv preprint arXiv:2607.07675},
  year = {2026}
}
```
