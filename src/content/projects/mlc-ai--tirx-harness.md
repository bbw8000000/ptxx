---
title: "mlc-ai/TIRx-harness"
owner: "mlc-ai"
name: "TIRx-harness"
fullName: "mlc-ai/TIRx-harness"
description: "An Open Compiler Harness for Agentic GPU Programming"
sourceUrl: "https://github.com/mlc-ai/TIRx-harness"
stars: 43
forks: 10
language: "Rust"
topics: []
license: "未标注"
homepage: "https://tirxharness.mlc.ai/docs/"
defaultBranch: "main"
snapshotDate: "2026-09-30"
pushedAt: "2026-09-29T19:13:39Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# TIRx Harness

[*图片：Documentation*](https://tirxharness.mlc.ai/docs/)
[*图片：Book*](https://mlc.ai/agentic-gpu-programming-for-mlsys/)
*图片：Related Repository: tirx-kernels*

**An Open Compiler Harness for Agentic GPU Programming**

Get Started | [Documentation](https://tirxharness.mlc.ai/docs/) | [Book](https://mlc.ai/agentic-gpu-programming-for-mlsys/) | [Blogpost](https://blog.mlc.ai/2026/09/29/tirx-harness-an-open-compiler-harness-for-agentic-gpu-programming)


## Overview

TIRx Harness is a compiler harness combining a minimal stable compiler
foundation, a knowledge base, tools, and a benchmark server to help agents
develop correct, fast GPU kernels.


  


TIRx Harness brings together:
* **TIRx-lite** for kernel authoring: a domain-specific language over the TIRx
  intermediate representation.
* **Compiler analysis**: check synchronization, memory races, and numerical
  behavior; inspect compiler output and generated GPU instructions.
* **[kcoral](https://kcoral.mlc.ai/)** for remote execution: keep your agent on
  one machine and run GPU work on another.

Skills guide the agent in using them, while workload contracts define
correctness and performance.

## Get Started

Install the released package from PyPI:

```bash
python -m pip install tirx-harness
```

To develop the harness, follow
[Build from source](https://tirxharness.mlc.ai/docs/installation.html#build-from-source)
for the build prerequisites, repository checkout, and native submodule setup.

See the [documentation](https://tirxharness.mlc.ai/docs/) for details:

- [Installation](https://tirxharness.mlc.ai/docs/installation.html): prerequisites, other installation methods, and agent skills
- [Quick Start](https://tirxharness.mlc.ai/docs/quick-start.html): optimize a kernel in your own project
- [Optimization Runs](https://tirxharness.mlc.ai/docs/optimization-runs.html): run a registered workload

The book [Agentic GPU Programming for MLSys](https://mlc.ai/agentic-gpu-programming-for-mlsys/)
explains the design behind the harness and walks through an optimization workflow.

## Contributing

- [Add a workload](https://tirxharness.mlc.ai/docs/development/add-workload.html): define a new optimization task
- [Contribute a kernel](https://tirxharness.mlc.ai/docs/development/contribute-kernel.html): publish a kernel produced by a run
- [Report and fix bugs](https://tirxharness.mlc.ai/docs/development/report-and-fix-bugs.html): reproduce and resolve a defect
