---
title: "2025 年，为什么你应该学 Rust"
description: "从所有权到 WebAssembly，聊聊 Rust 的核心理念、应用场景和入门路径。"
pubDate: 2026-05-21
heroImage: "/hero/rust-guide-2025.png"
category: "技术"
tags: ["Rust", "编程语言", "系统编程", "WebAssembly"]
featured: false
---

Rust 连续多年蝉联 Stack Overflow "最受喜爱语言"榜首。微软、谷歌、亚马逊、Linux 内核都在用。它到底有什么魔力？

## 核心卖点：编译期内存安全

大多数语言的内存问题（空指针、数据竞争、悬垂引用）只能在运行时发现。Rust 把这些检查**提前到编译期** — 代码能编译通过，就意味着没有这类 bug。

没有垃圾回收器，性能媲美 C/C++，却不需要手动管理内存。这是 Rust 最本质的吸引力。

## 三个核心概念

### 所有权（Ownership）

每个值只有一个所有者。赋值即"移动"，原变量失效。

```rust
let s1 = String::from("hello");
let s2 = s1; // s1 的所有权转移到 s2
// println!("{}", s1); // 编译错误！s1 已失效
```

### 借用（Borrowing）

用 `&` 引用而不转移所有权。不可变引用可多个共存，可变引用同一时间只能有一个。

```rust
fn calculate_length(s: &String) -> usize {
    s.len() // 借用，不获取所有权
}

let s = String::from("hello");
let len = calculate_length(&s); // s 仍然可用
```

### 生命周期（Lifetimes）

编译器确保引用不会比数据活得更久。大多数情况自动推断，少数场景需手动标注 `'a`。

> 初学者建议：先跳过高级生命周期，把所有权和借用的基本规则吃透，能解决 90% 的编译错误。

## 主流应用场景

### 命令行工具

`ripgrep`、`fd`、`bat`、`eza` — 这些爆款工具都是 Rust 写的。单二进制分发，性能碾压 Python/Node 同类。

```bash
# 比 grep 快 10 倍的搜索
rg "pattern" --type rust

# 比 ls 好看的文件列表
eza --icons --tree
```

### WebAssembly

Rust 是 Wasm 编译的首选语言，适用于边缘计算（Cloudflare Workers）和浏览器高性能场景。

### 后端服务

Axum + Tokio 异步生态成熟，Discord、AWS、Dropbox 已在生产环境使用。

### 系统编程

Linux 内核已接纳 Rust 模块，嵌入式和游戏引擎（Bevy）也在快速增长。

## 推荐学习路径

1. **入门**：[The Rust Book](https://doc.rust-lang.org/book/) + [Rustlings](https://github.com/rust-lang/rustlings) 练习题，边读边练
2. **进阶**：[Zero To Production In Rust](https://zero2prod.com/) 用实战项目学后端开发
3. **社区**：[r/rust](https://reddit.com/r/rust)、[This Week in Rust](https://this-week-in-rust.org/) 周刊
4. **视频**：YouTube 搜 "Let's Get Rusty" 入门系列

## 实用建议

不要试图一次学完所有概念。先用 Rust 写一个 CLI 小工具（比如文件搜索、Markdown 转换器），在实战中理解所有权和错误处理。

遇到编译报错不要怕 — Rust 编译器的错误信息是所有语言中最友好的，认真读报错本身就是在学习。

```bash
# 初始化一个新项目
cargo new my-tool
cd my-tool
cargo run
```

> 最好的学习方式是造轮子。用 Rust 重写一个你用其他语言写过的小项目，收获最大。
