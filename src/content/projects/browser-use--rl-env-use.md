---
title: "browser-use/rl-env-use"
owner: "browser-use"
name: "rl-env-use"
fullName: "browser-use/rl-env-use"
description: "Build RL environments for any domain from real cases that Browser Use agents mine from the web"
sourceUrl: "https://github.com/browser-use/rl-env-use"
stars: 112
forks: 6
language: "HTML"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-10-22"
pushedAt: "2026-10-21T04:32:02Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# rl-env-use

Introducing **rl-env-use**: RL environments for anyone and any domain.

Describe a skill in one line. Get a verified environment that frontier models do not saturate, and a hillclimbed prompt
for the model you train. Built on Anthropic's [Automating eval design and hillclimbing](https://claude.dev/blog/automating-eval-design-and-hillclimbing/)
workflow, with one change: the tasks are real cases that [Browser Use](https://browser-use.com) agents mine
from the web.

| Missions | Claude Code | Browser Use |
|----------|-------------|-------------|
| 8 x clinical trial results | 0 of 86 facts verified | **17 verified**, 4 complete cases |
| 6 x clinical trial results, same model both sides | 0 of 43 | **3 verified**, 2 complete cases |
| 8 x human genetic variants (UniProt, gnomAD, GTEx) | 6 of 82 | **40 verified** |

Get a Browser Use API key at [Browser Use Cloud](https://cloud.browser-use.com/?utm_campaign=rl-env-use&utm_source=github).

## What it does

- **Mines real cases**: Browser Use agents find the materials (a trial protocol, a 10-Q) and the outcome published later
- **Writes hard tasks**: gold answers computed by code, anything a frontier panel solves gets rewritten harder
- **Rejects bad tasks**: leaked answers, memorized outcomes, ambiguous prompts
- **Hillclimbs** a model's system prompt with a train/test split, a noise floor and paired confidence intervals
- **Exports** the dataset for an RL trainer, or serves it in code with `Env`

## Setup prompt

For Claude Code / Codex / OpenCode:

```text
Set up https://github.com/browser-use/rl-env-use for me.

Read install.md first to install this repo, register the skill, and set up the Browser Use and OpenRouter API keys - ask me to paste them when you need them. Then read SKILL.md for daily usage. After install, don't build anything on your own - just tell me it's ready and wait for me to name a skill.
```

Then ask:

> build me an RL environment for predicting whether a clinical trial met its primary endpoint, from its ClinicalTrials.gov registration

For humans:

```bash
rl-env-use create "predict whether a completed trial met its primary endpoint from its registered protocol; ClinicalTrials.gov" --budget 40
rl-env-use climb envs/ --model qwen-35b
```

## Results

The shipped example, `envs/trial-forecast`: 35 forecasts from 29 ClinicalTrials.gov trials whose
results were posted since July 2026, after the models' training data. Built for $72, $17 of it Browser Use.


A climbed Qwen 3.6 35B-A3B goes from 0.53 to 0.78 on tasks it never trained on (+0.25, 95% CI +0.07 to +0.45), level
with Opus 5.5. Always answering 50% scores 0.75, so most of the gain is calibration: the model stopped answering 0 or 1.
The climb kept 1 of 12 proposed edits (base-rate priors per question type); every round is in
`climb-qwen-35b/`.

## Manual install

Python 3.11+, optionally Node.js 18+ for the HTML reports.

```bash
git clone https://github.com/browser-use/rl-env-use ~/Developer/rl-env-use
cd ~/Developer/rl-env-use
uv venv && uv pip install -e '.[test]'
cp .env.example .env && $EDITOR .env    # BROWSER_USE_API_KEY, OPENROUTER_API_KEY
.venv/bin/python -m pytest -q           # offline, ~10 s
```

See `SKILL.md` for the full workflow and where every file is saved.

## License

MIT, see LICENSE.
