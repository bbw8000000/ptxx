---
title: "itshen/source-reading-methodology"
owner: "itshen"
name: "source-reading-methodology"
fullName: "itshen/source-reading-methodology"
description: "带 AI 精读大型开源仓库的方法论：四阶段流程、可复用模板、28 条踩坑清单，核心是让每个技术论断都可回溯到源码具体行"
sourceUrl: "https://github.com/itshen/source-reading-methodology"
stars: 70
forks: 6
language: "Python"
topics: ["agent-skills", "ai-agent", "ai-coding", "claude-code", "code-review", "documentation", "llm", "methodology"]
license: "MIT"
homepage: "https://xueai.app/?from=source-reading-methodology"
defaultBranch: "main"
snapshotDate: "2026-08-24"
pushedAt: "2026-08-23T08:44:23Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# source-reading-methodology

一套把陌生的大型仓库读成一门课的方法论。给要做同样事情的人用：选一个开源项目，带着 AI 精读它的源码，最后产出一份别人也能看懂、每句话都能验证的成果。

[*图片：样张*](https://itshen.github.io/source-reading-methodology/)
[*图片：课程站*](https://xueai.app/?from=source-reading-methodology)
[*图片：X*](https://x.com/luoxiaoshan_ai)
*图片：License*

**先看成品：[三章样张，在线试读](https://itshen.github.io/source-reading-methodology/)。** 这本书是按下面这套方法论产出的，原料在 `sample/chapters/`，用仓库里的 `book/build_book.py` 一条命令编出来。翻一下再决定要不要照着走一遍。


用这套方法论跑出来的完整成果，是 [小山学堂](https://xueai.app/?from=source-reading-methodology) 上的两门源码精读课：DeepSeek Harness 与 OpenAI Codex，合计 61 节。其中 Codex 那门的章节书稿有 1270 处带行号的源码引用，逐字节校验零编造。

---

## Quick Start：先让 AI 学会它

这套东西不是给你逐字读的，是给 AI 读的。你要做的只有两件：把它挂到 AI 能看见的地方，然后说一句人话。三种挂法，选一种。

### 一、装成 Agent Skill（推荐）

克隆下来软链进 skills 目录，之后你一提精读源码，AI 自动加载：

```bash
git clone https://github.com/itshen/source-reading-methodology.git
ln -sfn "$PWD/source-reading-methodology" ~/.cursor/skills/source-reading    # Cursor
ln -sfn "$PWD/source-reading-methodology" ~/.claude/skills/source-reading    # Claude Code
ln -sfn "$PWD/source-reading-methodology" ~/.agents/skills/source-reading    # 其它遵循 skills 约定的工具
```

用软链不用复制：`git pull` 之后 skill 跟着更新，也不会出现两份内容各自漂移。装完直接说：

> 帮我精读 `~/code/some-repo`，我想产出一门课

### 二、不装 skill，直接指给 AI 读

克隆到工作目录旁边，把这段发给 AI：

> 先完整读 `source-reading-methodology/SKILL.md`，然后按它的四阶段工作流和零幻觉铁律精读 `<仓库路径>`。动笔之前先告诉我你打算走哪几个阶段、产出什么形态。

### 三、连克隆都省了

给能联网的 AI 这段：

> 读 `https://raw.githubusercontent.com/itshen/source-reading-methodology/main/SKILL.md`，按它的规则精读 `<仓库 URL>`。

### 怎么判断 AI 真的读进去了

`SKILL.md` 是唯一入口，一份文件讲完整套流程，需要细节时 AI 会自己去读 `templates/` 和 `PITFALLS.md`。它的反应符合下面五条，说明走对了：

1. **先问清产出形态和规模再动手**。读懂一个模块和做一门 32 节的课，该走的阶段数完全不同
2. **动手第一件事是给目标仓库打 tag、记下 commit**。不锁版本，后面写的所有行号迟早失效，而且没人分得清是当初写错还是上游改了
3. **每段代码都带 `起始行:结束行:文件路径`**，贴出来的每一行你都能自己跳回去核对
4. **查不到的地方明说「未找到对应实现，检索关键词为 X、Y」**，宁可空着，也不填一个看起来合理的
5. **批量写之前先建校验器**。人工复核十万字的行号不现实

反过来，如果 AI 上来就甩章节大纲、代码块没有行号、或者一口答应你「三十二章我这就全写完」，它没按这套走，把 `SKILL.md` 重新发给它。

---

## 一句话内核

**让每一个技术论断都可回溯到源码的具体行。**

可回溯迫使你真的读到那一行，也让读者能自己验证。AI 辅助读码时幻觉几乎必然发生，它会根据文件名推测实现、根据常见模式补全细节、把注释当成代码行为陈述。一旦掺进去，整份成果的可信度就是零，因为读者无法分辨哪句是真的。

这套方法论里所有的规则，都是为了守住这一条。落到版面上是这样：


图是样张第 3 章的一处引用，声明 `codex-rs/core/src/session/turn.rs` 的 1368 到 1439 行。左侧行号栏是源文件里的真实行号，读者可以直接跳回仓库对照。中间两处省略之后的行只标 `·`：省略跳过了多少行只有源文件知道，宁可不显示，也不显示一个编出来的行号。头部的「第 1 / 3 段」点一下会按连续段依次高亮，让人看清哪几行在源文件里真的连在一起。

---

## 四个阶段

产出物分层，每一层的输入是上一层的输出。不要跳级。

```
阶段一  语料准备      锁版本、备对比语料、建检索脚本
   ↓
阶段二  大纲          回答「这门课要解答哪一个问题」+ 逐章源码锚点
   ↓
阶段三  章节书稿      八段结构，每处论断带行号，机器校验
   ↓
阶段四  成书          编成一本带封面封底的 HTML 书，可读、可查、可传
```

跳级的后果很具体：没有阶段一的版本锚点，阶段三写的行号三个月后全部失效；没有阶段二的锚点清单，阶段三的并行写作会互相重复又互相矛盾。

---

## 你自己要弄明白时，读什么

上面那三种挂法之后，跑流程是 AI 的事。你要搞清楚原理、或者想把这套改造成自己的，才需要往下读：

1. **`METHODOLOGY.md`**（315 行）方法论本体，每条规则都写了来由
2. **`PITFALLS.md`**（29 条）全部来自真实事故，不用背，卡住时来查
3. **`example/`** 同一章从大纲到成书的真实成品，拿不准该填到什么程度时对着它看

有两个节点值得你自己盯，AI 容易滑过去：**大纲最花时间也最决定成败**，它决定哪些内容进、哪些不进；**校验器必须在批量生产之前建好**，事后补等于没有。

### 各阶段对应的模板

| 阶段 | 模板 | 产出 |
|---|---|---|
| 二 · 大纲 | `templates/00-outline-template.md` | 一份带逐章源码锚点的大纲 |
| 三 · 章节书稿 | `templates/01-chapter-spec-template.md` | 每章一份 markdown，八段结构 |
| 四 · 成书 | `book/build_book.py` | 一本 HTML 书，封面加目录加正文加封底 |
| 四 · 课页（可选） | `templates/02-page-spec-template.md` | 每章一页可玩的课页 |
| 三、四通用 | `templates/style_scan.py` | 文风禁忌扫描，交付前跑一遍 |

文风扫描器可以直接用，零依赖：

```bash
python3 templates/style_scan.py path/to/chapters/
```

它把句式禁忌写成正则，扫描前剥掉代码块、行内代码和「」直接引用，避免源码字符被误判。只扫面向读者的正文，大纲和规范这类内部文档不在约束范围内。

阶段一没有模板，它是三件具体的事，在 `METHODOLOGY.md` 里有操作步骤：给主教材打 tag、备齐至少一个同类项目做对照、包一个 ripgrep 检索脚本。

### 派并行 Agent 之前

规范里每一处含糊都会变成 N 份不同的理解。派活时必须给全四样东西：填好的写作规范（一个文件，不要口头补充）、那一章的大纲条目、全部语料的绝对路径、校验命令加上「必须全绿才算交付」。

`METHODOLOGY.md` 的并行生产一节列了子 Agent 的四种典型偏差，规范里要提前堵。

---

## 目录

```
├── SKILL.md               AI 的唯一入口，一份文件讲完整套流程
├── AGENTS.md              克隆或 fork 之后 AI 自动读到的指引，指向 SKILL.md
├── METHODOLOGY.md         方法论本体，给人读，每条规则都写了来由
├── PITFALLS.md            29 条踩坑清单，分五类
├── templates/             三份可复用模板加一个文风扫描器
├── book/                  成书构建器：章节 markdown 编成 HTML 书
├── sample/                样张原料：三章书稿加一份构建配置
├── docs/                  样张构建产物，也是 GitHub Pages 的站点目录
└── example/               同一章从大纲到成书的真实成品，当尺子用
```

`book/` 是阶段四的实现，改一个 JSON 配置就能出书，用法见 `book/README.md`。

`sample/` 加 `docs/` 是那个[在线样张](https://itshen.github.io/source-reading-methodology/)的两端：前者是三章原料与配置，后者是编出来的书。想自己试构建器，直接拿这份配置跑：

```bash
pip install markdown
python3 book/build_book.py --config sample/book.config.json
```

`example/` 是一条纵向切片：同一章在阶段二、三、四各自的成品，包括大纲节选与成书截图。拿到空模板不知道填到什么程度时，对着它看。

---

## 这套方法论跑出来的实际结果

一个 Rust 单仓项目，90 多个 crate。口径写在括号里，避免同一个数出现两种算法。

| 项目 | 数量 |
|---|---|
| 章节书稿 | 32 章，正文 20.8 万汉字（不含代码块与图；连标点空白算 58.1 万字符） |
| 源码引用 | 1270 处带行号引用，逐字节校验零编造、零行号漂移 |
| 交互课页 | 32 页，371 处出处，校验问题 0 处 |
| 跨课互链 | 18 条（候选 64 张对比卡） |
| 并行 Agent | 分三批，每批 8 到 9 个 |

最后两行值得注意。互链候选 64 张最后只挂上 18 条，因为大量卡片拿闭源产品做对照、站内没有对应展开页，硬凑的链接比没有链接更糟。并行生产之所以能跑，靠的是先有逐字节校验器，人工复核十万字的行号不现实。

这类数字不能只写在 README 里，所以每本编出来的书都在封底自带一张逐章数据表和版本锚点，读者照着就能抽查：


上图是三章样张的封底，表里是这三章的实际数据，下面是被精读仓库的 commit 与 tag。这张表是一本书敢不敢让人查的凭证：行号对应哪个版本写清楚了，读者发现对不上，也能分辨是当初写错还是上游后来改了。

成品在 [xueai.app](https://xueai.app/?from=source-reading-methodology)，两门课的每一节都能直接看。

---

## 交流与关注


交流群
微信扫码入群


公众号
洛小山


X
@luoxiaoshan_ai


这套方法论出自 **小山学堂**，一个讲 AI 产品与 Agent 工程化的课程站。

- 在线课程：[xueai.app](https://xueai.app/?from=source-reading-methodology)
- X：[@luoxiaoshan_ai](https://x.com/luoxiaoshan_ai)
- GitHub：itshen

如果这份方法论帮到了你，欢迎给仓库点个 Star，也欢迎带着你自己的项目来群里聊聊卡在哪一步。


---

## License

MIT License · Copyright (c) 2026 米羊科技（上海）有限公司 (Miyang Tech (Shanghai) Co., Ltd.)

仓库里的章节书稿、截图与样张页面同样按 MIT 授权。被引用的 openai/codex 源码片段版权归原作者所有，引用用于教学说明。
