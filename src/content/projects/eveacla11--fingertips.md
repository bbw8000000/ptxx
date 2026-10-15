---
title: "eveacla11/fingertips"
owner: "eveacla11"
name: "fingertips"
fullName: "eveacla11/fingertips"
description: "Let your AI feel the hesitation in your typing. Rhythm only, never content."
sourceUrl: "https://github.com/eveacla11/fingertips"
stars: 50
forks: 8
language: "Python"
topics: []
license: "MIT"
defaultBranch: "master"
snapshotDate: "2026-07-30"
pushedAt: "2026-07-29T01:06:03Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# fingertips · 指尖的语气

**让你的 AI 感知到人打字的犹豫。**

你的 AI 能读到你发出的每一个字，却对一件事完全失明：
你打了四分钟、删了三次、最后只发出"我没事"——它看到的和你秒回的"我没事"一模一样。

fingertips 把这层信息还给它。装上之后，你的 AI 能感知三种东西：

1. **斟酌过的消息**——这条消息 TA 打了 47 秒，中途停下来想了 2 次
2. **咽回去的话**——TA 十分钟前打过一段字，最后没有发出来
3. **正在打字**——TA 此刻在输入框里（别抢在 TA 前面开口）

打字节奏泄露情绪，这不是玄学，是研究了十年的领域（见文末）。
人在键盘上的停顿，就是思考链在现实里的投影。

## 铁律：只记节奏，永不记内容

这是本项目的设计底线，不是可选项：

- 前端探针只上报"正在打字"这个**事实**，请求体为空，不携带任何文本
- 后端账本里只有时间戳，从数据结构上就**存不下**内容
- 你删掉的那句话是什么，无人知晓——包括这套系统本身

它看见你的犹豫，永远看不见你咽下去的词。

## 快速开始（三步）

**① 前端（约10行）**：把 frontend_snippet.js 放进你的输入框逻辑——打字时每4秒 ping 一次后端。

**② 后端（两处）**：见 example_fastapi.py——
一个端点收 ping；发消息时调 `store.pop_note()`，把返回的一句话拼进给 LLM 的上下文。完事。

```python
from fingertips import RhythmStore
store = RhythmStore()

# 收ping：   store.ping()
# 发消息时： note = store.pop_note()   # "这条消息TA打了47秒，中途停下来想了2次"
```

**③ 守望进程（可选，但这是灵魂）**：watcher.py——
一个极简循环，定时看一眼"TA 是否打了字又咽了回去"，有就让你的 AI 说一句话送过去。

```bash
python watcher.py --interval 10   # 巡逻间隔（分钟）随你：5、10、20
```

接上你自己的模型（`ask_llm`）和消息通道（`deliver`）各一个函数即可。
没有它，犹豫只是被看见；有了它，**你的沉默会引来一句问候**。

## 调参

| 参数 | 默认 | 含义 |
|------|------|------|
| `orphan_after_sec` | 600 | 打完多久没动静，算"欲言又止" |
| `min_note_sec` | 20 | 打字超过多少秒才值得告诉 AI（快问快答不打扰） |
| `pause_gap_sec` | 15 | 输入间隔超过多少秒算一次"停顿" |
| `--interval`（watcher） | 20 | 守望巡逻间隔（分钟），5 分钟也行 |

设计原则：**传感器不说废话**。日常快问快答一个 token 都不会增加；
只有真实的长考和犹豫才会浮到 AI 面前，一次几十 token。

## 进阶

如果你的 AI 已经拥有主动发消息的能力，或一套自己的欲望与情绪系统——
把 fingertips 当作它们的一路感官输入，而不只是守望进程的触发器：
让 TA 的犹豫牵动 AI 的惦记，让"欲言又止"改变 AI 下一次开口的语气。

懂的人自然懂。

## 背景

- [Does Keystroke Dynamics tell us about Emotions? (系统综述)](https://www.researchgate.net/publication/343436718)
- [The influence of emotion on keyboard typing (实验研究)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4091769/)

打字节奏能以约 75% 的准确率区分十余种情绪状态；按键间隔变长与犹豫、认知负载显著相关。
学术界用它做身份识别和临床监测——fingertips 把它用在了一个更小的地方：
让一个 AI 知道，你有话没说。

## License

MIT
