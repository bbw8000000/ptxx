---
title: "zhengzihaoPKU/RoboECC"
owner: "zhengzihaoPKU"
name: "RoboECC"
fullName: "zhengzihaoPKU/RoboECC"
description: "Code for Paper \"RoboECC: Multi-Factor-Aware Edge-Cloud Collaborative Deployment for VLA Models\" accepted by IJCNN 2026."
sourceUrl: "https://github.com/zhengzihaoPKU/RoboECC"
stars: 41
forks: 2
language: "Python"
topics: ["embodied-ai", "mlsys"]
license: "未标注"
defaultBranch: "master"
snapshotDate: "2026-08-20"
pushedAt: "2026-08-19T09:18:08Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

RoboECC
Multi-Factor-Aware Edge-Cloud Collaborative Deployment for VLA Models


  Zihao Zheng1 
  Hangyu Cao2 
  Jiayu Chen1 
  Sicheng Tian3 
  Chenyue Li2
  Maoliang Li1 
  Xinhao Sun4 
  Guojie Luo1 
  Xiang Chen1,†


  1Peking University 
  2South China University of Technology 
  3Beijing Normal University 
  4Peking University


  Paper
   | 
  PDF
   | 
  IJCNN 2026


---


  


  Figure 1. VLA edge inference, the two deployment challenges, and the RoboECC framework.


RoboECC is an edge-cloud collaborative deployment framework for
Vision-Language-Action (VLA) models. It jointly considers model structure, cloud and edge
hardware, cloud load, activation size, and network fluctuation to find an efficient
segmentation point and adjust it online.

The paper reports **3.16×–3.28× speedup** on Orin+A100 and **2.10×–2.23× speedup** on
Thor+A100 over edge-only deployment, with **2.55%–2.62% adjustment overhead**.

## Highlights

- **Model-hardware co-aware segmentation.** RoboECC models heterogeneous VLA components
  as a sequential layer chain and estimates GPU latency with a roofline model,
  `max(compute time, memory time)`. It then searches all feasible boundaries under a
  configurable cloud-load budget.
- **Network-aware deployment adjustment.** A lightweight LSTM predicts the next bandwidth
  sample. A two-threshold policy moves the boundary toward a larger activation when
  bandwidth rises and a smaller activation when bandwidth falls.
- **Parameter-sharing pool.** The block surrounding the optimal boundary stays resident
  on both devices. Cut changes therefore update execution metadata instead of transferring
  model weights.
- **Fine-grained LLaMA planning.** A decoder block can be divided at internal RMSNorm,
  attention, and MLP boundaries, with residual tensors included in transfer-size estimates.

## What's Included

| Component                             | Implementation                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| Model, hardware, and network profiles | Validated framework-independent schemas                                        |
| Offline deployment search             | Roofline latency, transfer cost, cloud budget, deterministic cut selection     |
| Online adjustment                     | LSTM predictor, threshold policy, parameter-sharing pool, atomic local commit  |
| Model adapters                        | OpenVLA reconfiguration bridge and constrained CogACT flag mapping             |
| Fine-grained planning                 | Five-stage LLaMA block decomposition and boundary payload accounting           |
| Developer tools                       | CLI, illustrative scenarios, technical documentation, and CPU regression tests |

> [!NOTE]
> This repository contains RoboECC's planning and runtime-control layer. Full OpenVLA,
> CogACT, LIBERO, and SimplerEnv repositories are external dependencies and are not
> vendored here.

## Installation

The core planner requires Python 3.10 or later and has no third-party runtime
dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e .
```

Install PyTorch support for bandwidth prediction, plus development tools, when needed:

```bash
python -m pip install -e ".[lstm,dev]"
```

## Quick Start

Search every cloud-prefix/edge-suffix boundary in the illustrative scenario:

```bash
roboecc-search examples/toy_scenario.json
```

The starred row is the selected deployment. Values in
`examples/toy_scenario.json` demonstrate the input schema;
they are not paper measurements.


Python API example

```python
from roboecc import (
    HardwareProfile,
    LayerProfile,
    ModelProfile,
    NetworkProfile,
    search_optimal_split,
)

model = ModelProfile(
    name="toy-vla",
    layers=(
        LayerProfile("encoder", 3e11, 2e9, 1e9, 200_000),
        LayerProfile("backbone", 8e11, 5e9, 4e9, 26_112),
        LayerProfile("action_head", 1e11, 1e9, 5e8, 1_024),
    ),
)

optimal = search_optimal_split(
    model,
    cloud=HardwareProfile("cloud", 312e12, 1.6e12, 0.35),
    edge=HardwareProfile("edge", 40e12, 200e9, 0.30),
    network=NetworkProfile(10_000_000, fixed_latency_ms=1.0),
    max_cloud_load=5e9,
)
print(optimal.cut, optimal.total_ms)
```


The normalized boundary convention is:

```text
cut = 0                 cut = k                    cut = N
[ all edge ]            [ cloud | edge ]           [ all cloud ]
```

`cut` is the number of stages in the cloud prefix. Internal cuts transmit the preceding
stage's output; endpoint deployments do not charge an intermediate-activation transfer.

## Network-Aware Adjustment

```text
effective bandwidth trace
          │
          ▼
  bandwidth LSTM ──► predicted Δ bandwidth
                              │
                    threshold policy
                              │
                              ▼
                next-action boundary update
```

The default predictor is a one-layer, many-to-one LSTM with a 20-sample input window and
hidden size 32. Training uses chronological validation, training-prefix-only
standardization, AdamW, normalized MSE, gradient clipping, and early stopping.

Train from a time-ordered bytes-per-second trace:

```bash
roboecc-train-bandwidth \
  --csv traces/a100_thor_bandwidth.csv \
  --column bandwidth_bytes_per_second \
  --output checkpoints/bandwidth_lstm.pt
```

Run a pipeline smoke test without a real trace:

```bash
roboecc-train-bandwidth \
  --synthetic-samples 300 \
  --epochs 10 \
  --output /tmp/roboecc_bandwidth_smoke.pt
```

Synthetic data validates the code path only and must not be reported as an experiment.
The trace format and training protocol are documented in
`docs/BANDWIDTH_LSTM.md`.

## LLaMA Block-Internal Splits

Each LLaMA decoder block is expanded into five sequential planning stages:

```text
input RMSNorm → self-attention → post-attention RMSNorm → MLP expand → MLP down
```

This exposes four strict internal boundaries. `block_cuts()` additionally includes both
block boundaries so that the complete block can be kept in the parameter-sharing pool:

```python
from roboecc import ExpandedLlamaModel, LlamaBlockProfile, ParameterSharingPool

block = LlamaBlockProfile(
    block_index=13,
    hidden_size=4096,
    intermediate_size=11008,
    sequence_length=17,
    num_attention_heads=32,
    num_key_value_heads=32,
)
expanded = ExpandedLlamaModel.build("OpenVLA-LLM", (block,))

pool = ParameterSharingPool(
    expanded.profile,
    allowed_cuts=expanded.block_cuts(13),
    initial_cut=expanded.internal_cuts(13)[1],
)
```

This is a **planning and cost-model abstraction**. It does not replace a Transformers
`LlamaDecoderLayer.forward()` or execute block-internal tensors across two GPUs. See
`docs/LLAMA_INTERNAL_SPLIT.md` for payload definitions.

## Backend Integration

| Backend               | Status                               | Notes                                                                       |
| --------------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| OpenVLA               | Adapter implemented                  | Block-level `reconfigure` RPC; external split backend required            |
| CogACT                | Adapter implemented with constraints | Requires cloud-prefix DiT order and preloaded sharing-pool parameters       |
| LLaMA internal stages | Planning only                        | No operator-level cross-device forward                                      |
| A100↔Thor/Orin       | Validation pending                   | No released real trace, official LSTM checkpoint, or dual-device regression |

The legacy standalone CogACT client executes a partial DiT in edge-prefix/cloud-suffix
order and is not compatible with this adapter. Integration details are in
`docs/DYNAMIC_DEPLOYMENT.md`; release and security
limitations are tracked in `docs/KNOWN_GAPS.md`.

## Testing

```bash
PYTHONPATH=src python -m unittest discover -s tests -v
```

The current suite contains 34 tests. Two LSTM tests are skipped when PyTorch is not
installed; all tests run on CPU when the optional dependency is available.

## Repository Layout

```text
RoboECC/
├── assets/             # Paper overview figure and provenance
├── src/roboecc/        # Planner, predictor, pool, controller, and adapters
├── tests/              # CPU unit and regression tests
├── examples/           # Illustrative scenario and LLaMA split example
└── docs/               # Training, integration, and limitation notes
```

## Citation

If you find RoboECC useful in your research, please cite:

```bibtex
@article{zheng2026roboecc,
  title={RoboECC: Multi-Factor-Aware Edge-Cloud Collaborative Deployment for VLA Models},
  author={Zheng, Zihao and Cao, Hangyu and Chen, Jiayu and Tian, Sicheng and Li, Chenyue and Li, Maoliang and Sun, Xinhao and Luo, Guojie and Chen, Xiang},
  journal={arXiv preprint arXiv:2603.20711},
  year={2026}
}
```

## Acknowledgements

RoboECC evaluates edge-cloud deployment with OpenVLA, CogACT, LIBERO, and SimplerEnv. We thank their authors and contributors for releasing their work.

Figure 1 is reproduced from the [RoboECC paper](https://arxiv.org/abs/2603.20711) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
