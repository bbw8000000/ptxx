---
title: "XYZ-AI-Lab/AxisAgentic"
owner: "XYZ-AI-Lab"
name: "AxisAgentic"
fullName: "XYZ-AI-Lab/AxisAgentic"
description: "AxisAgentic: An Extensible Runtime and Trajectory-Collection Framework for Long-Horizon Agents."
sourceUrl: "https://github.com/XYZ-AI-Lab/AxisAgentic"
stars: 79
forks: 4
language: "Python"
topics: []
license: "Apache-2.0"
defaultBranch: "main"
snapshotDate: "2026-07-26"
pushedAt: "2026-07-24T17:35:52Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

English ·
    简体中文
  

  
    
    
    
    
    
  

  
    XYZ AI Lab ·
    Technical Report
  


AxisAgentic is an extensible runtime for long-horizon AI agents. It also collects the trajectories produced during execution. The runtime works with OpenAI-compatible endpoints and pluggable local model clients, and handles multi-turn execution, tool orchestration, context management, recovery, and benchmark evaluation. Each trace preserves the state visible to the model, so the same record can support recovery and replay, benchmark evaluation, or filtered SFT export.

Web Search and WideSearch are the current reference recipes. The same extension points can support domain, general-purpose, and coding agents. This repository does not include model weights.

## ✨ Core capabilities

- Append-only traces preserve runtime events and reconstruct the context visible to the model at any stage.
- Model clients, tools, orchestrators, datasets, evaluators, reward functions, and recipe policies are replaceable.
- Context budgets, compaction, rollback, retries, recovery, self-verification, and tool limits support long runs.
- Each task records traces, token and timing metrics, evaluation artifacts, and provenance for trajectory selection.
- SFT exporters replay runtime visibility markers, while rollout interfaces connect execution to external training systems.
- Strict YAML schemas and portable path schemes keep runs reproducible across environments.

## 🔁 From execution to learning

Every task writes an append-only trace. The trace is the common source for replay, evaluation, and trajectory collection. Selected trajectories can then be exported for external training.


  
  
  


Runtime markers record rollback, context compaction, and discard-all events. Replaying them reconstructs what the model saw at a given stage. Trace inspection and SFT export use the same rules, so supervised examples exclude hidden history and rolled-back actions.

Recipe exporters emit Swift Agent and related training formats with the source trace, task status, and optional metadata. The external training pipeline owns final correctness filters, loss masks, and optimization. AxisAgentic supplies the replay and export boundary so inference and training use the same interaction history.

## 🦅 Flagship reference: XYZ-Aquila

XYZ-Aquila is a search system built with AxisAgentic. Its recipe combines search and scraping with context management, recovery, evaluation, and state-faithful SFT export. The underlying interfaces also work with other model clients, tools, and task domains.

### 📊 Results

The [Aquila technical report](https://xyz-lab.ai/blogs/ai4ai-at-scale/) reports XYZ-Aquila-mini and XYZ-Aquila-pro across seven agentic benchmarks. The figure below reproduces the reported comparisons for six of them.

*图片：XYZ-Aquila benchmark results across six agentic search benchmarks*

*Metrics: BrowseComp, BrowseComp-ZH, LiveBrowseComp, and Humanity's Last Exam use LLM-judge accuracy; DeepSearchQA uses macro F1; WideSearch uses item-level F1 Max@4. See Evaluation and reproducibility for details.*

Some baseline values come from public reports with different harnesses, tools, judges, and evaluation dates. Treat the figure as a benchmark-level comparison rather than a controlled universal ranking.

## 🚀 Get started

AxisAgentic requires Python 3.12 or newer and an OpenAI-compatible model endpoint. Getting started covers installation, provider variables, recipe configuration, dry runs, replay, and SFT export. See Configuration for the full configuration reference.

```bash
git clone https://github.com/XYZ-AI-Lab/AxisAgentic.git
cd AxisAgentic
python3.12 -m venv .venv
source .venv/bin/activate
./setup_env.sh
source .envs/axis_agentic_env.sh
cp .env.example .envs/.env
```

After setting the provider and dataset values, validate the Web Search recipe without starting a run:

```bash
cp recipe/web_search/configs/default.yaml my-search-run.yaml
python -m recipe.web_search.runners.run_eval_config \
  --config my-search-run.yaml \
  --dry-run
```

## 📚 Documentation

- Documentation index
- Getting started
- Configuration
- Architecture
- Project structure
- Evaluation and reproducibility
- Recipes

## 🤝 Contributing

The contributing guide covers development setup and required checks. Contributors must follow the Code of Conduct. Report vulnerabilities through the security policy.

## 📜 License

Unless otherwise noted, AxisAgentic is licensed under the Apache License 2.0. See NOTICE for third-party attribution and licensing notes.

## 📝 Citation

If you use this codebase, please cite the software:

```bibtex
@software{wang2026axisagentic,
  author       = {Wang, Jinyu and Zhang, Yifei and {{XYZ Agentic Team}}},
  title        = {AxisAgentic: An Extensible Runtime and Trajectory-Collection Framework for Long-Horizon Agents},
  organization = {XYZ AI Lab},
  year         = {2026},
  url          = {https://github.com/XYZ-AI-Lab/AxisAgentic}
}
```
