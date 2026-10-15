---
title: "m-novotny/memguard-rs"
owner: "m-novotny"
name: "memguard-rs"
fullName: "m-novotny/memguard-rs"
description: "Secure memory handling primitives for Rust — zeroization on drop, mlock-protected regions, constant-time comparison, and compile-time enforced memory safety boundaries"
sourceUrl: "https://github.com/m-novotny/memguard-rs"
stars: 127
forks: 2
language: "Rust"
topics: ["constant-time", "crypto", "cryptography", "embedded", "memory-management", "memory-safety", "mlock", "no-std"]
license: "Apache-2.0"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-07-22T20:39:34Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# memguard-rs

*图片：CI*
[*图片：Crates.io*](https://crates.io/crates/memguard-rs)
[*图片：Documentation*](https://docs.rs/memguard-rs/)
*图片：License*
[*图片：MSRV*](https://blog.rust-lang.org/2022/11/03/Rust-1.65.0.html)
*图片：no_std*

Secure memory handling primitives for Rust.

- **Zeroization on drop** — volatile-write memory clearing the compiler cannot optimize away
- **Memory locking** — `mlock`/`VirtualLock` to prevent secrets from being written to swap
- **Constant-time comparison** — timing side-channel resistant equality checks for secrets
- **Compile-time guarded regions** — const-generic memory regions with type-level size enforcement
- **`no_std` compatible** — core primitives work without an allocator
- **Zero dependencies** — no transitive dependency surface to audit

## Quick start

Add to your `Cargo.toml`:

```toml
[dependencies]
memguard-rs = "0.1"
```

### Wrapping a secret

```rust
use memguard_rs::Secret;

let mut key = Secret::new([0u8; 32]);

// Access the secret only within a closure
key.expose(|k| {
    println!("Key length: {}", k.len());
});

// Modify in place
key.expose_mut(|k| {
    k[0] = 0xFF;
});

// When `key` goes out of scope, its memory is zeroized via volatile writes
```

### Locking memory with mlock

```rust
use memguard_rs::Secret;

// Lock the secret's memory to prevent it from being written to swap
let key = Secret::new([0xAB; 32]).lock().unwrap();
assert!(key.is_locked());

// Memory is unlocked and zeroized when `key` is dropped
```

### Guarded memory regions

```rust
use memguard_rs::GuardedRegion;

// Create a 64-byte locked, zeroized-on-drop region
let mut region = GuardedRegion::<64>::new().unwrap();

// Write sensitive data
region.as_mut_slice().copy_from_slice(&[0xEF; 64]);

// Read it back
assert_eq!(region.as_slice()[0], 0xEF);

// When `region` drops, memory is zeroized and unlocked
```

### Constant-time comparison

```rust
use memguard_rs::ct_eq;

let stored_mac = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06];
let received_mac = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06];

// Compare without leaking timing information
if ct_eq(&stored_mac, &received_mac) {
    println!("MAC verified");
}
```

## Features

| Feature | Default | Description |
|---------|---------|-------------|
| `std`   | ✓ | Enables `std` support (implies `alloc`) |
| `alloc` | (via `std`) | Enables heap-allocated types (`SecretBox`) |
| `lock`  | ✓ | Enables `mlock`/`VirtualLock` memory locking |

### `no_std` usage

```rust
#![no_std]

use memguard_rs::{Secret, Zeroize};

fn verify_token(stored: &[u8; 16], received: &[u8; 16]) -> bool {
    let mut secret = Secret::new(*stored);
    let mut result = false;
    secret.expose(|s| {
        // constant-time comparison works in no_std
        result = memguard_rs::ct_eq(s, received);
    });
    result
}
```

## Safety

This crate uses `unsafe` in the following places:

- **Volatile writes** in `zeroize` — `core::ptr::write_volatile` is used to zero memory. The pointers are always valid, aligned, and within bounds.
- **FFI calls** in `mlock` — direct `extern "C"` / `extern "system"` declarations for `mlock`/`munlock` (Unix) and `VirtualLock`/`VirtualUnlock` (Windows). These are standard system calls with well-defined semantics.
- **ManuallyDrop** in `secret` — used to control the drop order: zeroize first, then drop the value. This prevents double-drops if zeroization panics.

No `unsafe` is exposed in the public API. All unsafe code is internal and encapsulated behind safe abstractions.

## MSRV

Minimum Supported Rust Version: **1.65**

The MSRV may be bumped in minor version releases. Pin a specific version in your `Cargo.toml` if you need a stable MSRV.

## License

Licensed under either of

- Apache License, Version 2.0 (LICENSE-APACHE or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license (LICENSE-MIT or http://opensource.org/licenses/MIT)

at your option.

## Contributing

Contributions are welcome. Please see CONTRIBUTING.md for guidelines.

### Help wanted

We have several issues tagged `good first issue` suitable for new contributors:

- #2 — Implement `Zeroize` for wider slice types
- #8 — Document drop order guarantee in `Secret`

All contributions are dual-licensed under the MIT and Apache 2.0 licenses.
