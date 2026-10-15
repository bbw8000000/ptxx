---
title: "FLModel/flm"
owner: "FLModel"
name: "flm"
fullName: "FLModel/flm"
description: "Train and chat with a frozen language model coupled to the full retained MaleCNS fly connectome."
sourceUrl: "https://github.com/FLModel/flm"
stars: 68
forks: 13
language: "未知"
topics: []
license: "NOASSERTION"
defaultBranch: "main"
snapshotDate: "2026-09-16"
pushedAt: "2026-09-11T21:51:26Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

*图片：FLM — Fly Language Model. Talk to the fly.*

# FLM — Fly Language Model

A frozen language model with a trained readout of the **MaleCNS v1.0 fly connectome**: 166,700 retained nodes and 25,582,938 directed connections.

Token embeddings drive the full fixed graph. A **278,528-parameter adapter** reads its state and adjusts the next-token scores of **Liquid AI LFM2.5-1.2B-Instruct**. Only the adapter is trained. Language ability comes from the pretrained model; this does not mean a biological fly understands language.

This repository contains local training and inference. It needs no API key, account, web server, or hosted inference service.

## Train

Use **Python 3.12** on macOS or Linux. Apple Silicon uses MPS, NVIDIA GPUs use CUDA when supported by the installed PyTorch build, and CPU works too. Plan for several GB of downloads, at least 10 GB of free disk space, and preferably 16 GB or more RAM. CPU training is slower; runtime depends on hardware.

```sh
git clone https://github.com/nftechie/flm.git
cd flm
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

python scripts/download.py
python scripts/prepare_graph.py
python scripts/build_graph_kernel.py       # optional; needs cc/Clang/GCC
python scripts/train_conversation.py
```

Downloads are pinned to upstream revisions; the original connectome files are checked against SHA-256 hashes. The optional C kernel accelerates feature extraction without dropping nodes or edges. If no compiler is available, skip that step; the SciPy path implements the same recurrence.

Training uses 64 corpus conversations plus 32 original synthetic style examples. Validation selects the checkpoint; 24 separate test conversations evaluate it afterwards. A parameter-matched direct-input adapter is trained alongside the fly adapter as a control. These are development splits, not the separate three-seed confirmation study in the paper.

Outputs go to `runs/conversation-v2/`: adapter weights, checkpoint manifest, split selection, fitting curves, and evaluation results. A completed run is never overwritten. To train again, choose a new directory:

```sh
python scripts/train_conversation.py --output runs/my-run --device cpu
```

## Chat

```sh
python scripts/chat.py
python scripts/chat.py --prompt "Invent a tiny museum exhibit." --seed 42
python scripts/chat.py --run runs/my-run
```

Interactive commands: `/new` clears the conversation; `/quit` exits. Replies use the trained fly adapter and full retained graph. Chats stay in memory and do not update the weights. No pretrained FLM adapter is bundled: train once before chatting.

## Check

```sh
python -m unittest discover -s tests -p 'test_*.py'
python scripts/verify_graph_kernel.py      # after building the optional kernel
python scripts/evaluate_conversations.py
```

The checks cover graph direction, exact integer neuron IDs, independent batched states, learning, disconnection, and sampling. Conversational evaluation produces replies for manual rubric review; it is not an automatic claim of chat quality. One legacy-tokenizer check is skipped unless the optional 135M reference tokenizer has been downloaded with `scripts/download.py --legacy`.

## What the graph does

Each token drives `x = tanh(W @ (0.6*x + 0.4*input))`. `W[post, pre]` contains incoming-normalized anatomical contact counts. Seeded input/output projections connect token embeddings to the graph and pool its states. A bias-free readout adds a bounded correction to language-model logits.

These are abstract numerical states, not simulated action potentials. The model does not infer transmitter signs, dopamine, or biological time from the wiring. The graph and language backbone stay fixed during training; only the readout learns. Removing graph edges removes the residual exactly. Relabeling is an interface control, not proof that this topology beats arbitrary wiring.

The [paper](https://artificialscientific.com/papers/flies-are-all-you-need) describes a separate frozen study. Its matched direct-input control performed slightly better; it does **not** establish an advantage from fly anatomy. This repository provides the conversational model's training recipe, not the paper's private per-token results or fitted study artifacts.

## Sources and license

Original code and synthetic examples: **MIT**. Upstream weights and data retain their own terms; see THIRD_PARTY_NOTICES.md. Model weights, corpus downloads, connectome arrays, generated runs, and local environments are excluded from Git.
