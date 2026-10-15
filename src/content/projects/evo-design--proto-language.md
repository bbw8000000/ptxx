---
title: "evo-design/proto-language"
owner: "evo-design"
name: "proto-language"
fullName: "evo-design/proto-language"
description: "A high-level programming language for generative biology"
sourceUrl: "https://github.com/evo-design/proto-language"
stars: 203
forks: 24
language: "Python"
topics: ["generative-biology"]
license: "MIT"
homepage: "https://proto.evodesign.org/docs/language/introduction"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-17T20:54:45Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Proto Language

*图片：Proto Tools*

*图片：Checks*
*图片：Unit Tests*
*图片：License: MIT*
[*图片：Docs*](https://proto.evodesign.org/docs/language/introduction)
[*图片：bioRxiv*](https://www.biorxiv.org/content/10.64898/2026.06.22.733870)
*图片：Modal*
[*图片：Arc Institute blog*](https://arcinstitute.org/news/proto)

> [!NOTE]
> **Have a design pipeline you would like to see in Proto?** We will help you express it in the optimization language, integrate the tools it needs, and get the PRs up so it can be showcased in our repo or UI. New constraints, generators, and optimizers are welcome as pull requests too; see CONTRIBUTING.md.
>
> [Contact us](https://forms.gle/8PiYPDiuf3YfNxxH8) and let us know how we can help!

Welcome! This repository contains the open-source implementation of `proto-language`, a Python package for designing biological sequences (DNA, RNA, and proteins) through constraint-based optimization. A design is specified as a set of constraints, and the framework runs a propose–score–refine loop to search for sequences that satisfy them, drawing on a large suite of computational biology and biological AI tools to score candidates.

`proto-language` is built on top of the proto-tools execution layer, so each computationally intensive tool (structure predictors, protein language models, inverse folding, sequence and structure aligners, gene annotation, and more) runs in its own automatically managed, isolated environment. 

Proto-language is open source under an MIT license. Contributions are welcome!

## Setup

### Step 1: Install the package

The package requires Python 3.10 or later and pip:

```bash
pip install git+https://github.com/evo-design/proto-language.git
```

System tools that standalone tool environments require in order to build (git, curl, gcc, make, cmake) are automatically provisioned on first use through proto-tools' shared **foundation environment**, so no manual setup is necessary.

> [!NOTE]
> A direct PyPI install (`pip install proto-language`) is planned.

> [!NOTE]
> Contributors should instead use the editable installation described in CONTRIBUTING.md.

### Step 2: Configure storage (optional)

All persistent data (model weights, tool environments, micromamba) is stored under `PROTO_HOME`, which defaults to `~/.proto/` and is inherited from proto-tools.

To customize the storage location (recommended for laboratory and HPC environments):

```bash
# Add to your shell profile:
export PROTO_HOME=/path/to/your/proto_home
```

To override only the model-weights location, set `export PROTO_MODEL_CACHE=/path/to/shared/weights`. See `notes/filesystem.md` for all options.

### Step 3: Gated model access (optional)

Some generators and constraints load gated models (for example ESM3, AlphaGenome, and AlphaFold3) that require accepting a license and authenticating with HuggingFace. Set `HF_TOKEN` in the environment after accepting each model's terms. See `proto-tools/README.md` for the full procedure and the list of gated models.

### Step 4: Remote compute (optional) 

Tools can execute in remote containers on [Modal](https://modal.com) instead of on your own machine, so a program can reach more GPUs than are installed locally. Deployments ship with proto-tools, so hosting one is a single command.

Setup lives in the tool layer, in the separate evo-design/proto-tools repository:

- Modal setup guide — account setup, deploying a tool, and costs.
- Step 4 of the proto-tools README — the same step in context.

To run an optimization remotely without deploying the full catalog, opt in at the program level:

```python
program.run(device="modal")
```

Models and tools that require modal compute will be deployed automatically upon the first run of your
program.

> [!TIP]
> Setup is complete. See the Quickstart to run a program from end to end.

## Quickstart

Working programs are provided under `examples/`:

- **`examples/scripts/`** — runnable Python programs, ranging from a minimal end-to-end example (`toy.py`) to broader workloads.
- **`examples/jsons/`** — declarative JSON program definitions (the `optimization_stages` schema). These illustrate program structure and are not loaded by a Python consumer.

## Architecture

The framework is built around seven primitives in `proto_language/core/` — three data containers, three pluggable interfaces, and one orchestrator:

- **`Sequence`** — a typed string (DNA, RNA, or protein) together with optional logits, a folded structure, and namespaced metadata. The atomic unit of design.
- **`Segment`** — a single design region. It holds the proposal `Sequence`s for that region and the surviving result `Sequence`s after scoring.
- **`Construct`** — an ordered list of `Segment`s that concatenate into a full biological construct (for example, a promoter plus a coding region; a multi-chain protein; or a designed gene).
- **`Constraint`** *(registered via `@constraint`)* — scores a `Sequence` against a target property, returning a score and namespaced metadata, and may optionally provide gradients.
- **`Generator`** *(registered via `@generator`)* — proposes new `Sequence`s for a `Segment`.
- **`Optimizer`** *(registered via `@optimizer`)* — a search strategy that drives the propose–score–refine loop.
- **`Program`** — the top-level orchestrator. It owns the `Construct` and composes one or more `Optimizer` stages.

All three pluggable interfaces share a `BaseConfig` Pydantic configuration pattern and declare parameters with `ConfigField`.

### The optimization loop

`Program.run()` iterates through its optimizer stages. Each stage performs the following steps:

1. The `Optimizer` requests proposal `Sequence`s from its `Generator` for one or more `Segment`s.
2. Each `Constraint` evaluates the proposals and records its score and metadata on the proposal `Sequence`s.
3. The `Optimizer` aggregates the constraint scores and selects survivors. These become the `Segment`'s result `Sequence`s and feed into the next iteration, or the next stage.

When the program finishes, `Program.export(path=...)` writes a directory containing tables for sequences, constraints, constructs, and optimization steps, a FASTA file, and an `assets/` sidecar directory.

## Development & Contributing

See CONTRIBUTING.md for developer setup, code style, testing, and agent conventions.

## Citation

If you use Proto in your research, please cite our preprint:

> Merchant AT, Guo D, Viggiano B, Brennan-Almaraz LE, Hur E, Mai T, Yin P, King SH, Ashley E, Hie BL. **A high-level programming language for generative biology with Proto.** *bioRxiv* (2026). doi: [10.64898/2026.06.22.733870](https://doi.org/10.64898/2026.06.22.733870)

```bibtex
@article{Merchant2026.06.22.733870,
  author = {Merchant, Aditi T and Guo, Daniel and Viggiano, Ben and Brennan-Almaraz, Lucas Emmanuel and Hur, Evelyn and Mai, Tina and Yin, Peter and King, Samuel H and Ashley, Euan and Hie, Brian L},
  title = {A high-level programming language for generative biology with Proto},
  elocation-id = {2026.06.22.733870},
  year = {2026},
  doi = {10.64898/2026.06.22.733870},
  publisher = {Cold Spring Harbor Laboratory},
  URL = {https://www.biorxiv.org/content/10.64898/2026.06.22.733870},
  journal = {bioRxiv}
}
```

## Acknowledgements

Thank you to  Modal
for sponsoring the compute used to develop and test remote execution, and for making it
straightforward to host the tools a program runs.

Thank you to  Stanford University
and the  Arc Institute
for supporting this work's development.

Thank you to everyone who has contributed to `proto-language`. Contributions of every size are
welcome — see CONTRIBUTING.md to get started.
