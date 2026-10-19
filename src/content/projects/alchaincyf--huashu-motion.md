---
title: "alchaincyf/huashu-motion"
owner: "alchaincyf"
name: "huashu-motion"
fullName: "alchaincyf/huashu-motion"
description: "让你的agent一键直出商业级产品宣传片：会作曲，能指着画面改。Commercial-grade launch films by your coding agent — point at the frame to change it."
sourceUrl: "https://github.com/alchaincyf/huashu-motion"
stars: 489
forks: 49
language: "JavaScript"
topics: ["agent-skills", "animation", "claude-code", "codex", "gsap", "launch-video", "motion-graphics", "skills"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-10-19"
pushedAt: "2026-10-18T12:59:04Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

**简体中文** | English


# huashu-motion

> *「一键直出商业级产品宣传片。」*

*图片：License: MIT*
[*图片：Agent Skills*](https://agentskills.io)
*图片：Runtime*

**让你的agent做动画、作曲，指着画面改。**

跟Claude Code、Codex这些agent说一句「给我的产品做个30秒的发布片」，
它会先读你的产品，给你三个方向挑，写出整支片子，自己写谱配乐，
然后在浏览器里打开一个编辑器等你。哪里不满意，在画面上点一下，写下要改什么，它就只改那一处。

```sh
npx skills add alchaincyf/huashu-motion
```

看效果 · 安装 · 能做什么 · 怎么做到的 · 背后的故事


---

## 看效果

这篇README里的每一段动画都是huashu-motion做的。上面那段取自它给自己做的53秒发布片，👉 下载完整发布片（MP4，带声音），下面Grok Bot、huashu-design、DeepSeek这几支的完整版也在同一个页面。

### 指着画面改


按C，在画面上点一下，写下要改什么。评论发过去的时候带着时间点、场景、点中的元素和它在源码里的位置，agent先把那一帧和你点的那一小块截图放大看一眼，再只改那一处，改完回一句人话，预览停在原来的位置刷新。每一版都留着，⌘Z随时撤回；标题、数字、颜色、停留时长这些会变成编辑器右边的输入框，自己改，不用等agent。

（这段里的编辑器和终端是照真实界面重建的，代码细节是示意；评论是真实提过的意见。）

### 先写谱，再拍片


做发布片用的是作曲家模式：agent按节奏单先写一份谱（ABC记谱法，纯文本的乐谱），谱里的标记对齐每个场景，再由三角钢琴、弦乐和鼓组的采样演奏出来（真乐器采样要先跑一次`om samples build`，不跑就用合成音色）；画面上每个东西落地的那一帧，再配一个音效。配乐全部在本机现场生成，不调用任何收费接口。

### 一天，二十支


16个镜头，来自同一天做的七支片子，按拍子切。


Grok Bot（粉丝自制，非官方）· 30秒：傍晚交代任务，夜里几个agent各干各的，早上7点手机上收到汇报。这段是汇报一张张送往Chief of Staff的那几拍。


huashu-design 3.0 · 一句提示词钉住不动，背后的风格按拍子换
小猫补光灯Pro · 八种补光色，一拍换一种


### 不依赖Opus：DeepSeek V4.1 Flash也能做


这支22秒的动效片，是把Claude Code背后的模型换成DeepSeek V4.1 Flash（1017版）做的。中间我给了三轮意见（比如加上DeepSeek的鲸鱼logo、删掉几个镜头），带配乐和音效，前后不到半小时，按当时的价格花了1块9毛5（缓存命中率99.4%）。统一的配色、贯穿全片的那颗圆点、卡在124BPM上的配乐，是skill带出来的，我一句都没提过。方法写进了skill，便宜的模型也能拍出像样的片子。

---

## 安装

### 方式一：跟你的agent说（推荐）

```
帮我安装huashu-motion这个skill（github.com/alchaincyf/huashu-motion），装好后跑一遍demo
```

### 方式二：一行命令

```sh
npx skills add alchaincyf/huashu-motion
```

skills会认出你在用的agent，把skill放进对应目录；要指定的话加`-a claude-code`、`-a codex`等参数。

Claude Code、Codex、WorkBuddy、Grok Bot、Muse、Dots等产品都能跑；它遵循[Agent Skills](https://agentskills.io)协议，支持skill的agent都能装。

### 方式三：克隆整个仓库


展开查看

```sh
git clone https://github.com/alchaincyf/huashu-motion.git
ln -s "$PWD/huashu-motion/skills/huashu-motion" ~/.claude/skills/huashu-motion   # Codex换成~/.codex/skills/
```

skill里的`bin/om`会直接调用仓库里的命令行工具，改仓库就是改skill，本机只有一份。


### 需要什么

- Node 22以上。
- Chrome（或Chromium、Edge）：截帧、检查、导出都用你电脑上已经装好的浏览器，不额外下载渲染器。
- FFmpeg：导出视频、合成配乐要用。
- 真乐器音色（可选）：想要三角钢琴、弦乐、鼓组，让agent跑一次`om samples build`，下载约55MB的免费采样（CC0和CC-BY授权）；不跑就用合成音色。
- 口播（可选）：macOS的系统音色不用装；想用Kokoro念中文稿，第一次用时会给出一行安装命令（要uv和Python 3.12，模型约325MB）；逐字对齐要装whisper-cli（`brew install whisper-cpp`）。

缺什么跑`om doctor`就知道，这些都可以直接让agent帮你装。目前只在macOS上实测过。Codex的沙箱会拦本地预览和浏览器，遇到时手动批准一下。

---

## 能做什么

装好以后，直接跟agent说：

| 你说 | 它做 |
|---|---|
| 「用huashu-motion给我的产品做一支30秒的发布片，官网是xxx.com」 | 先读产品，出三个方向的关键帧给你挑，写节奏单，再写片、作曲配乐，打开编辑器等你 |
| 「把data/funnel.csv做成30秒解说，讲清楚为什么注册率翻倍了」 | 按数据讲故事：先轴、后数据、只标一件事，数字变成可以直接改的输入框 |
| 「做一支发布片，要口播，用我自己的录音：voice.m4a」 | 逐字对齐，画面落在说到的那个词上，自动出字幕，配乐在说话时让位 |
| 「这条口播视频加个包装」 | 名字条、数字卡、关键词花字、章节卡，导出带透明通道的叠层，直接拖进剪映或Premiere |
| 「改成竖屏」 | 复制一份1080×1920的版本，重新排版的活儿进收件箱，接着改 |
| 「导出GIF」「要透明底」「做成网页分享」 | MP4、MOV（透明）、WebM、GIF；或者导出一个带播放器和源码的分享页 |

开工前，它会先读你以前的偏好和过去片子留下的经验；每支片子做完，再把你这次说过的话、在编辑器里提的评论收一遍，值得留下的记下来。你的偏好只存在你自己电脑上。

---

## 怎么做到的

### 一支片子就是一个`index.html`

画面用代码写，GSAP、Canvas、Three.js、SVG，浏览器能画的都能用；不调用视频生成模型，每一帧只由代码和时间决定。没有私有格式，片子就是一个网页，带走就能用。

```
你的agent ──写──▶ my-film/index.html ◀──盯着── om studio（浏览器里的编辑器）
    ▲                                              │
    └── om inbox --wait ◀── .om/inbox.jsonl ◀── 你在画面上点一下、写一句
```

### 导演规则，不是模板

skill最大的一块是导演方法：先读产品、找出它的气质，再选片子的结构和运动语言。这些规则来自实测，不是拍脑袋：

- 拿21支真实的发布片（Apple、Nothing、GoPro、Google、Vercel、Linear、Anthropic等），用FFmpeg逐支量切点、节拍、响度和能量曲线；
- 拆了142支高互动的发布片和动效片，按产品类型整理出20种运动语言，每种写清楚它在说什么、适合什么产品；
- 每支片子开工前先写一张节奏单：3秒内要有钩子，中段要有一次爆发，最响的那一下前面先停一拍。

颜色也量过：顶级发布片的颜色几乎都是找来的（品牌色、产品外壳和界面、实拍里的光），所以三个方向先从产品里找颜色，`om swatch`把色板和对比度摆出来看。

### 声音是片子的一半

- 作曲家模式：agent写谱，程序用真乐器采样演奏，谱里的场景标记对齐画面；仓库里带了三份有注释的示范谱。
- 兜底配乐：不想作曲，内置12类产品、每类3种配乐方向，按片子的种子挑，不喜欢可以重抽。
- 23种音效：落地、甩镜、打字、盖章、故障……写在动画落地的那一行代码上，导出时自动对上。
- 口播：系统音色念稿，或者用你自己的录音；逐字对齐，画面可以落在某个词上。

### 自己的渲染引擎

渲染、截帧、检查都直接驱动你电脑上的Chrome：按CPU核数开几个浏览器同时渲染（默认最多8个），配乐和画面并行编码，配乐没改就直接复用。一支30秒的片子，在我这台14核的Mac上大约12–15秒渲完；加运动模糊大约1到1.5分钟。

### 交付前有人挑错

- `om check`：渲染前查脚本、缺失的文件、违反规则的动画写法，再抽帧查被裁切、被盖住、对比度不够的字；
- `om qa`：查成片里一闪而过的单帧、没东西在动的空档、硬切和整片的运动曲线；
- skill要求agent交付前真的看帧、按正常速度看一遍，能派独立的agent冷审就派。

### 常用命令

平时都是agent在敲，想自己动手也可以：

| 命令 | 做什么 |
|---|---|
| `om new` · `om templates` | 新建项目，可以从10个模板起步 |
| `om studio` | 编辑器：实时预览、场景条、直接改值、在画面上留评论 |
| `om inbox --wait` · `om look` · `om done` | agent那一侧：接下一条评论、看你点的位置、回报改了什么 |
| `om sound` · `om voice` · `om samples` | 配乐和音效、口播、真乐器采样包 |
| `om check` · `om qa` · `om still` | 渲染前检查、成片检查、任意时刻截一帧 |
| `om render` · `om export html` · `om fork` | 导出、分享页、换画幅 |
| `om learn` · `om undo` · `om doctor` | 经验、撤回、环境检查 |

---

## 里面有什么

| | 数量 |
|---|---|
| 运动语言（每种写清楚它在说什么、适合什么、怎么做） | 20种，`skills/huashu-motion/references/library/` |
| 起步模板（发布会、财经图表、动态文字、白板、Vox拼贴、3Blue1Brown、Kurzgesagt、口播包装……） | 10个，`templates/` |
| 音效 | 23种 |
| 兜底配乐方向 | 12类产品 × 3种 |
| 示范谱 | 3份，`skills/huashu-motion/references/scores/` |
| 字体（中文500–900字重、衬线、展示字体） | 27款，`fonts/` |
| 方法文档（导演、节奏、颜色、声音、口播、产品演示、验收……） | `skills/huashu-motion/references/` |

```
huashu-motion/
├── skills/huashu-motion/   # skill本体：SKILL.md、方法文档、运动语言库、示范谱、经验
├── cli/                    # om命令行：新建、编辑器、收件箱、配乐、口播、检查、渲染、导出
├── runtime/                # 片子里用的OM.*小工具，和逐帧渲染的引擎
├── studio/                 # 浏览器里的编辑器
├── templates/              # 10个起步模板
├── fonts/                  # 随附的开源字体
├── examples/               # 样片（om demo打开的那支）
└── test/                   # 测试
```

---

## 诚实边界

- 它听不见。agent靠谱面、能量曲线和频谱图检查配乐，最后一耳朵还得是你的。
- 它不会凭空生成真人和实拍。画面全是代码画的；要真人、实拍，用你自己的素材，它负责合成和包装。
- 效果跟模型有关。我主要在Claude Code里用Opus 5.5；DeepSeek V4.1 Flash也能做得不错，但不同模型的品味差别是真实存在的。
- 要能跑命令的环境。预览和导出在本机跑，需要Node、Chrome和FFmpeg。

---

## 背后的故事

2026年10月8号，Anthropic发布了Claude Motion，让Claude用代码把报告、图表、产品讲解做成短动画，可以指着画面改，发布时只在Team和Enterprise上beta。

今年4月Claude Design出来的时候，我把它的核心能力逆向成了skill，就是后来的huashu-design。Motion发布以后，我让Claude Code开工，要求就一句：

> 我们的skill需要能够完整复刻claude motion的能力，并且要强很多！

第一天做出来的东西，我看着都很无聊：编辑器、版本管理、一百多项测试都有了，一个19秒的3D城市样片，运镜很平稳，也就代表着很平庸。让Claude自己把项目审一遍，它的结论是：做出了一个很会证明自己没撒谎的工程，却还没有一个让人想转发的作品。当天推倒重来。

后来真正花时间的，是让片子好看：去量真实的发布片，给配乐提「电影级别」的要求，把每一次「不酷」「无聊」「字体难看」都变成规则写回skill。最后它给自己做了一支发布片，就是这篇README最上面那段。

---

## 致谢

- 动画库[GSAP](https://gsap.com)（GSAP Standard License），随附字体均为SIL OFL 1.1开源字体，清单见`fonts/LICENSES.md`。
- 真乐器采样来自CC0和CC-BY授权的开源采样库，`om samples build`时从原处下载，不随仓库分发；口播用到Kokoro和whisper.cpp，第一次用时下载模型。详见THIRD_PARTY.md。
- 导演规则里量过、拆过的发布片和动效片，仓库只记测量出来的参数，不含它们的画面。
- `om demo`打开的样片用的是huashu-art-motion的绘画引擎。

---

## 关于作者

**花叔 Huashu** — AI Native Coder，独立开发者，代表作：小猫补光灯（AppStore 付费榜 Top1）

| | |
|:---|:---|
| 🌐 官网 | [bookai.top](https://bookai.top) · [huasheng.ai](https://www.huasheng.ai) |
| 𝕏 Twitter | [@AlchainHust](https://x.com/AlchainHust) |
| 📺 B站 | [花叔v](https://space.bilibili.com/14097567) |
| ▶️ YouTube | [@Alchain](https://www.youtube.com/@Alchain) |
| 📕 小红书 | [花叔](https://www.xiaohongshu.com/user/profile/5abc6f17e8ac2b109179dfdf) |
| 💬 公众号 | 微信搜「花叔」 |


## 许可证

代码和文档：MIT。随便用，随便改，随便造。

随附的第三方部分保留各自的许可：GSAP（GSAP Standard License）、字体（SIL OFL 1.1），见THIRD_PARTY.md。

例外：「豆子花叔」角色（`runtime/clip/lib/toon.js`里的角色绘制，以及它在storytime模板和示范片里的形象）是花叔的卡通形象，只用于本项目的示范，不随MIT授权用于其他用途。

---


**女娲** 造Skill。**huashu-design** 做设计。**艺术动画** 让画动起来。**huashu-motion** 让你的agent拍发布片。

MIT License © 花叔 Huashu


---


作者的其他项目 · also by 花叔

*图片：FanBox · Coding Agent 的驾驶舱*
