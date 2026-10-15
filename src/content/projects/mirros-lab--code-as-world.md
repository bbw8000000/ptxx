---
title: "MirroS-Lab/Code-as-World"
owner: "MirroS-Lab"
name: "Code-as-World"
fullName: "MirroS-Lab/Code-as-World"
description: "Code as World: Agentic Discovery of Executable World Representations for Physical Reasoning"
sourceUrl: "https://github.com/MirroS-Lab/Code-as-World"
stars: 84
forks: 0
language: "Python"
topics: []
license: "Apache-2.0"
homepage: "https://mirros-lab.github.io/code-as-world/"
defaultBranch: "main"
snapshotDate: "2026-08-28"
pushedAt: "2026-08-28T03:58:35Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

Code-as-World

  Agentic Discovery of Executable World Representations for
Physical Reasoning


  A world becomes intelligible to evolving intelligence when it can be represented, executed, and verified.


  
  
  
  


  


## Overview

Pixels are **evidence** of the physical world, not its **ontology**. A pixel-level observation records how the world appears at a particular moment and from a particular viewpoint, but does not directly specify what exists within it, how it is structured, or what governs its evolution.

**Code-as-World** introduces code as executable representations for the physical world and an agentic process for discovering them through iterative simulation and verification. In doing so, it turns raw abundant observations into reusable physical data: explicit states, dynamics, and mechanisms that capture not only what was seen, but the **underlying world that could have produced it**. This provides scalable physical supervision, enabling our models to achieve state-of-the-art performance on quantitative physical reasoning.

## News

- [2026/08/27] Code-as-World technical report released.
- [2026/08/27] [MirroS blog](https://mirros.ai/blog/representing-physical-world) and [Project page](https://mirros-lab.github.io/code-as-world) is live.


## Get started

The release includes local inference and QuantiPhy evaluation for
[Code-as-World-VL-4B](https://huggingface.co/MirroS-Lab/Code-as-World-VL-4B) and
[Code-as-World-VL-9B](https://huggingface.co/MirroS-Lab/Code-as-World-VL-9B),
plus a video-driven abstraction example.

### Installation

Use Python 3.10 or 3.11 on a CUDA host.

```bash
git clone https://github.com/MirroS-Lab/Code-as-World.git
cd Code-as-World
python -m venv .venv
source .venv/bin/activate
pip install -r requirements/inference.txt

hf download MirroS-Lab/Code-as-World-VL-4B --local-dir weights/4b
hf download MirroS-Lab/Code-as-World-VL-9B --local-dir weights/9b
```

Clone QuantiPhy and download its validation videos:

```bash
git clone https://github.com/Paulineli/QuantiPhy.git /path/to/QuantiPhy
hf download PaulineLi/QuantiPhy-validation \
  --repo-type dataset \
  --local-dir /path/to/QuantiPhy-validation
```

### QuantiPhy evaluation

Run the released evaluation directly from the Code-as-World repository:

```bash
python -m code_as_world.evaluation 4b \
  --input-csv /path/to/QuantiPhy/quantiphy_validation.csv \
  --video-dir /path/to/QuantiPhy-validation/validation_videos

python -m code_as_world.evaluation 9b \
  --input-csv /path/to/QuantiPhy/quantiphy_validation.csv \
  --video-dir /path/to/QuantiPhy-validation/validation_videos
```

Each run writes an evaluator-compatible prediction CSV, a single-run metric summary,
and the raw generations to `outputs/quantiphy/`. To evaluate both CSV files
with the official QuantiPhy evaluator:

```bash
pip install pandas
python /path/to/QuantiPhy/evaluator.py \
  outputs/quantiphy \
  outputs/quantiphy_metrics \
  --gt_file /path/to/QuantiPhy/quantiphy_validation.csv
```

### OpenAI-compatible serving

The checkpoints can also be exposed through the standard vLLM API:

```bash
CUDA_VISIBLE_DEVICES=0 vllm serve weights/4b \
  --served-model-name code-as-world-4b \
  --chat-template code_as_world/templates/qwen3_5_no_think.jinja \
  --chat-template-content-format openai \
  --default-chat-template-kwargs '{"enable_thinking":false}' \
  --max-model-len 4608 \
  --gpu-memory-utilization 0.90 \
  --media-io-kwargs '{"video":{"num_frames":16,"fps":-1,"video_backend":"openpangu"}}' \
  --mm-processor-kwargs '{"do_sample_frames":false}' \
  --mm-processor-cache-gb 0 \
  --generation-config vllm
```

For the 9B checkpoint, replace `weights/4b` and `code-as-world-4b` with
`weights/9b` and `code-as-world-9b`.

### Video-driven abstraction example

Install MuJoCo and run the bundled ballistic soccer case:

```bash
pip install -r requirements/simulation.txt
python -m code_as_world.simulation
```

The rendered video and trajectory are written to `outputs/simulations/`. Use
`python -m code_as_world.simulation --no-render` when only the trajectory is needed.

## TODO

- [x] Release Code-as-World-VL checkpoints and inference recipes
- [x] Technical report, project page, and blog release

## Acknowledgements

We sincerely thank the teams behind the following projects for making their work available to the community:

| Component | Projects |
|---|---|
| Physical simulation | MuJoCo |
| Visual perception and reconstruction | [SAM 3](https://arxiv.org/abs/2511.16719), [DA3](https://arxiv.org/abs/2511.10647), [VGGT-Omega](https://arxiv.org/abs/2605.15195), [SAM 3D](https://arxiv.org/abs/2511.16624) |
| Realistic video generation | [Wan](https://arxiv.org/abs/2503.20314), VACE |
| Quantitative evaluation | [QuantiPhy](https://quantiphy.stanford.edu/) |

_... and many other excellent open-source projects._

## Citation

If you find Code-as-World useful, please cite:

```bibtex
@article{mirros2026codeasworld,
  title   = {Code as Worlds: Agentic Discovery of Executable World Representations for Physical Reasoning},
  author  = {{MirroS Team}},
  journal = {arXiv preprint arXiv:2608.xxxxx},
  year    = {2026}
}
```
