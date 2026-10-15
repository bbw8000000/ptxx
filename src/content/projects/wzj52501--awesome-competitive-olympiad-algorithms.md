---
title: "wzj52501/awesome-competitive-olympiad-algorithms"
owner: "wzj52501"
name: "awesome-competitive-olympiad-algorithms"
fullName: "wzj52501/awesome-competitive-olympiad-algorithms"
description: "Original algorithmic contest problems and lecture notes — NOIP to NOI & ACM-ICPC level"
sourceUrl: "https://github.com/wzj52501/awesome-competitive-olympiad-algorithms"
stars: 38
forks: 4
language: "C++"
topics: ["acm-icpc", "algorithms", "competitive-programming", "contest", "lecture-notes", "noi", "oi", "problem-setting"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-09"
pushedAt: "2026-09-09T02:49:56Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# awesome-competitive-olympiad-algorithms

简体中文

> A personally curated archive of **original algorithmic problems** and lecture
> notes — every problem authored and set by hand — spanning NOIP through NOI and
> ACM-ICPC level. Centered on the algorithmic craft shared by informatics
> olympiads and ACM-ICPC-style contests: design, analysis, and proof — not
> low-level implementation.

## About

This repository collects materials I created over years of competing and
problem setting in algorithm contests — **all original work**:

- **Lecture slides** — notes prepared for teaching sessions.
- **Original contest problems** — problems I set for the National Olympiad in
  Informatics (NOI), provincial team selection, and mock contests.

Difficulty ranges from NOIP all the way up to NOI and ACM-ICPC level.

Whether you aim for OI, ACM-ICPC, or simply want to study rigorous algorithm
design, I hope this archive offers something useful. **If it does, a star
would mean a lot — and would help more people discover it.**

Each problem is preserved with three artifacts:

- **statement** — the problem description
- **standard solution** — a reference C++ implementation
- **editorial** — the algorithm explained, with correctness and complexity

## Structure

```
.
├── Lectures/   Algorithm lecture slides and notes
└── Setter/     Original problems, grouped by contest
    ├── NOI/    National Olympiad in Informatics
    ├── BJTSC/  Beijing Team Selection Contest
    └── NOIP/   National Olympiad in Informatics in Provinces
```

| Directory | Contents |
|---|---|
| `Lectures/` | Lecture slides and notes on algorithms: data structures, graph theory, number theory, generating functions, and more. |
| `Setter/NOI/` | NOI problems and NOI-level mock contests. |
| `Setter/BJTSC/` | Beijing Team Selection Contests, including the joint provincial selection and related mock rounds. |
| `Setter/NOIP/` | NOIP-level mock contests. |

---

> **Note** — All lecture slides and editorials are written in Chinese.

## License

- **Code** (standard solutions / `.cpp`): MIT License
- **Content** (problem statements, editorials, lecture slides): CC BY-NC-SA 4.0

## Updates

- **upd0909**: Add 12 new lecture slides and the MIT License; complete the missing solutions for BJTSC Mock-1 and NOI Mock-1.
