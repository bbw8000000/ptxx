---
title: "Git 实用技巧：日常开发中的救命操作"
description: "整理一些日常开发中最常用的 Git 技巧，从撤销操作到分支管理，帮你少走弯路。"
pubDate: 2026-05-20
heroImage: "/hero/git-tips.png"
category: "技术"
tags: ["Git", "工具", "效率", "教程"]
featured: false
---

Git 用久了，总会遇到一些"完了"的时刻。这篇文章整理一些日常开发中最实用的 Git 操作，帮你化险为夷。

## 撤销：最常见的"救命"操作

### 撤销最后一次提交（保留修改）

```bash
git reset --soft HEAD~1
```

提交信息写错了？代码还没改完不小心提交了？这个命令撤销提交但保留所有修改，让你重新来过。

### 撤销工作区的修改

```bash
# 撤销单个文件
git checkout -- filename.js

# 撤销所有修改
git checkout -- .
```

> 警告：这个操作不可逆。修改会永久丢失，确保你真的不需要这些改动。

### 暂存当前工作（切换分支时救命）

```bash
# 暂存
git stash

# 恢复
git stash pop

# 查看暂存列表
git stash list
```

正在写功能 A，突然要修 bug B？`git stash` 把当前工作藏起来，切回来再 `pop` 恢复。

## 分支：清晰的工作流

### 创建并切换到新分支

```bash
git checkout -b feature/new-login
# 或者用更新的语法
git switch -c feature/new-login
```

### 删除已合并的本地分支

```bash
# 删除已合并的分支
git branch --merged | grep -v "\*\|main" | xargs git branch -d
```

项目做久了，本地会堆积一堆已合并的分支。这条命令批量清理。

### 查看分支的最近提交

```bash
git log --oneline --graph --all -20
```

用图形化的方式看最近 20 条提交，分支关系一目了然。

## 日志：找到你想要的

### 搜索提交内容

```bash
# 搜索提交信息
git log --grep="fix login"

# 搜索代码变更
git log -S "functionName"
```

`git log -S` 是代码考古利器 — 找某个函数是什么时候被加进来的。

### 查看某个文件的历史

```bash
git log --follow -p -- filename.js
```

`--follow` 会追踪文件重命名，`-p` 显示每次的 diff。

## 高级但实用

### 交互式暂存（精确提交）

```bash
git add -p
```

一个文件改了多处，只想提交其中一部分？`-p` 让你逐块选择要暂存的修改。

### 修改最后一次提交

```bash
git commit --amend
```

提交后发现漏了文件，或者提交信息有 typo？`--amend` 直接修改最后一次提交。

### 找回误删的分支

```bash
# 查看所有操作记录
git reflog

# 恢复到某个提交
git checkout -b recovered-branch HEAD@{2}
```

`git reflog` 是最后的安全网。几乎所有"误删"都能通过它找回。

## 别名：少打字

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.last 'log -1 HEAD --stat'
git config --global alias.unstage 'reset HEAD --'
```

在 `~/.gitconfig` 里加这些，以后 `git st` 就够了。

## 写在最后

Git 的命令很多，但日常用到的其实就那几个。把上面这些练熟，90% 的场景都能从容应对。

> 遇到 Git 问题不要慌，先 `git status` 看看当前状态，再决定下一步。
