---
title: "vancyland/DataClaw0"
owner: "vancyland"
name: "DataClaw0"
fullName: "vancyland/DataClaw0"
description: "DataClaw: Agentic Tailoring Multimodal Data from Raw Streams — coming soon (code, weights, dataset & DataClaw-val upon acceptance)."
sourceUrl: "https://github.com/vancyland/DataClaw0"
stars: 115
forks: 4
language: "未知"
topics: ["data-tailoring", "dataset", "embodied-ai", "grpo", "gui-agents", "multimodal", "sft", "video-generation"]
license: "未标注"
homepage: "https://czjdsg.github.io/MakeAnyData/"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-24T05:58:52Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# DataClaw0: Agentic Tailoring Multimodal Data from Raw Streams

**Actively refining and structuring raw multimodal data to align with diverse user and downstream intents.**

[*图片：Paper*](https://arxiv.org/abs/2606.21337)
[*图片：Project Page*](https://czjdsg.github.io/MakeAnyData/)
[*图片：Hugging Face*](https://czjdsg.github.io/MakeAnyData/)
*图片：License*
*图片：Status*


> [!NOTE]
> The **code**, **model weights**, **dataset**, and the **DataClaw-val** benchmark will be **released upon paper acceptance**.
> In the meantime, read the method in the **[paper](https://arxiv.org/abs/2606.21337)** and explore the qualitative cases on the **[project page](https://czjdsg.github.io/MakeAnyData/)**.

---

## 📰 News

- **2026-06** — DataClaw v1 paper released on [arXiv](https://arxiv.org/abs/2606.21337) 📄
- **2026-06** — Project page with qualitative cases across five domains is live 🌐
- **Upcoming** — Code, weights, dataset, and the DataClaw-val benchmark will be released **upon acceptance** ⏳

---

## 🐾 Overview

Massive unstructured multimodal streams suffer from high **"data entropy,"** impeding both efficient human knowledge acquisition and high-quality AI post-training. Existing passive annotation paradigms — heavily reliant on heuristic rules or general VLMs — are costly, monotonous, and fail to unlock the deep procedural logic embedded in raw data.

**DataClaw** elevates data processing to a **learnable, high-order capability**. We propose a paradigm shift towards **Agentic Data Tailoring**: given a user intent or downstream objective, a 9B tailoring agent filters redundant signal from long videos, GUI traces, embodied trajectories, and editing sequences, then reorganizes the residual into **dense, verifiable, application-specific supervision**.

Key ideas:

- **Bottom-up Factual Anchors → Top-down Semantic Synthesis.** A two-stage pipeline grounds generative semantic synthesis in deterministic factual anchors, yielding a large-scale dataset spanning **five core physical and digital domains**.
- **SFT + rule-driven GRPO.** DataClaw-9B synergizes Supervised Fine-Tuning with Group Relative Policy Optimization to robustly align with complex refinement and tailoring intents.
- **Two deployment paradigms.** A single unified **Omni** model (DataClaw-O) or a panel of domain **Experts** (DataClaw-E).
- **DataClaw-val.** The first benchmark dedicated to data refinement, scoring outputs by JSON validity and schema-aware Field / Semantic / Sequence metrics.
- **Downstream post-training as the ultimate touchstone.** Validated on video generation, real-world VQA, and GUI navigation under volume-aligned training budgets.


DataClaw pipeline: bottom-up factual anchor extraction and top-down semantic synthesis, followed by training under the Omni and Expert paradigms, inference, and downstream utilization.


---

## 🎬 Qualitative Cases

Interactive case replays across five domains — daily life, education, GUI agents, embodied, and AIGC — with input videos and the agent's reasoning, are available on the **[project page →](https://czjdsg.github.io/MakeAnyData/)**

---

## 📊 Results (from the v1 paper)

**DataClaw-E** is the routed expert configuration; **DataClaw-O** is the unified omni model.

### DataClaw-val — structured-output quality (Field / Semantic / Sequence)

| Model | Field | Semantic | Sequence |
|---|:--:|:--:|:--:|
| Gemini-3.1-Pro | **98.12** | 73.85 | **58.50** |
| GPT-4o | 97.27 | **75.15** | 49.43 |
| **DataClaw-E (Ours)** | 97.53 | 74.94 | 48.86 |
| **DataClaw-O (Ours)** | 87.65 | 62.46 | 44.82 |

### Targeted Refinement — downstream SFT (same raw streams, same budget, only the annotator changes)

| Downstream task | Metric | SFT on Gemini-3.1-Pro | SFT on **DataClaw** |
|---|---|:--:|:--:|
| GUI navigation (AgentNet) | SSR ↑ / **TSR** ↑ | 39.5 / 14.2 | 38.2 / **15.6** |
| Action video gen (Ego4D) | **FVD** ↓ / **Contact mAP** ↑ | 295.4 / 48.5 | **288.6** / **51.2** |
| Spatio-temporal VQA (ReMoT) | Partial / **Overall** ↑ | 53.4 / 31.5 | 52.1 / **33.2** |

DataClaw-E matches frontier VLMs on schema quality and **leads on end-to-end downstream task success**. Full tables, ablations, scaling curves, and t-SNE diversity analysis are in the [paper](https://arxiv.org/abs/2606.21337).

---

## 🗺️ Release Roadmap

Everything below ships **upon paper acceptance** (v2).

- [x] 📄 Paper (v1) on arXiv
- [x] 🌐 Project page with qualitative cases & demos
- [ ] 🧩 Code — training (SFT + GRPO) and inference
- [ ] 🏋️ Model weights — DataClaw-O (Omni) & DataClaw-E (Experts)
- [ ] 📦 Dataset — five domains (daily life, education, embodied, GUI agents, AIGC)
- [ ] 📐 DataClaw-val benchmark + evaluation scripts
- [ ] 📝 Reproduction recipes for downstream SFT tasks

> ⭐ **Star / watch this repo** to be notified the moment the code and data drop.

---

## 📌 Citation

If you find DataClaw useful for your research, please consider citing:

```bibtex
@article{wan2026dataclaw,
  title   = {DataClaw0: Agentic Tailoring Multimodal Data from Raw Streams},
  author  = {Wan, Cong and Guo, Zeyu and Cai, Zijian and Li, Jiangyang and
             Dong, SongLin and Peng, Lin and Luo, Xiangyang and Ma, Zhiheng and Gong, Yihong},
  journal = {arXiv preprint arXiv:2606.21337},
  year    = {2026}
}
```

---

## 📬 Contact

Questions, collaboration, or follow-up? Open an issue or reach the authors via the contacts listed on the [paper](https://arxiv.org/abs/2606.21337).

## License

The license for the code and released artifacts will be announced together with the open-source release upon acceptance.
