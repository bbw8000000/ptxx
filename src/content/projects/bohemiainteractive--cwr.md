---
title: "BohemiaInteractive/CWR"
owner: "BohemiaInteractive"
name: "CWR"
fullName: "BohemiaInteractive/CWR"
description: "Arma: Cold War Assault Remastered Source Code Repository."
sourceUrl: "https://github.com/BohemiaInteractive/CWR"
stars: 1197
forks: 173
language: "C++"
topics: []
license: "NOASSERTION"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-08-18T16:38:20Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Arma: Cold War Assault - Remastered

This repository holds the engine and game source code (codename *Poseidon*) behind *Arma: Cold War Assault* — the game first released in 2001 as *Operation Flashpoint: Cold War Crisis*. That release launched Bohemia Interactive and began the technology lineage that later grew into Real Virtuality, Arma, and Enfusion. The code has been modernized to C++20, built with CMake and Clang, with cross-platform support for Windows x64 and Linux x64.
Bohemia Interactive is releasing it to the community that has kept this game alive for more than two decades — to study it, build on it, fix it, and create from it. Three things are worth keeping separate:

**Source code (this repository)**

The engine and game executables, licensed under GPL-3.0-or-later with additional terms under Section 7. You may use, study, modify, and redistribute it, provided it stays GPL and you follow those terms.

**The name and brand**

"ARMA", "Operation Flashpoint", and the logos are *not* granted. The trademarks stay with their owners ("ARMA" is Bohemia Interactive's). A fork must be renamed and must not present itself as "Arma" or as an official Bohemia Interactive product.

**Game data (separate)**

Models, textures, sounds, missions, and voices. These are not in this repository and are not GPL; they ship separately under the APL-SA license. A free Demo is available on Steam.

In short: the code is free software, the name is not, and the game data comes separately. This license covers the source code only and grants no rights to the trademarks.


## Quick Start

```sh
cmake --preset win-x64-clang-rwdi
cmake --build build/win-x64-clang-rwdi
```

On GNU/Linux, use the matching `linux-x64-clang-rwdi` preset.

## Layout

- Apps - executable targets
- Engine - engine libraries and Rust Trident tooling
- Master server tools - Rust service and CLI crates
- Tests - test source trees; CI currently compiles them only
- `cmake/` - presets, toolchains, vcpkg triplets, and overlay ports
- `docker/` - container support for service and runtime environments
- `packages/` - ignored local game data staging area
- `resources/` - application icon resources
- `thirdparty/` - vendored third-party headers and sources

## Project Notes

- Contributing
- Credits
- Third-party notices
- Vendored dependencies

## License

The source in this repository is licensed under the **GNU General Public License
v3.0 *or later***, with additional terms under **Section 7** of the GPL. See `LICENSE` for the
full text.
This license does not grant you any right to use "ARMA" or any other Bohemia Interactive trademark.

The `thirdparty/` directory is **excluded** from the project's GPL
license: it contains vendored third-party code (glad, the RenderDoc API header)
under their own respective licenses — see `thirdparty/README.md`.
Dependencies pulled in via vcpkg (`vcpkg.json`) likewise remain under
their own licenses.

*"ARMA" is a registered trademark of BOHEMIA INTERACTIVE a.s. "OPERATION FLASHPOINT" is a registered trademark of Electronic Arts Inc.
See `LICENSE` for information concerning trademarks. This credits file is
informational and does not constitute any grant and/or waiver of rights.*

### Game data / assets — Arma Public License Share Alike (APL-SA)

Game data and assets (models, textures, sounds, missions, etc.) are **not part of
this repository** and are **not** covered by the GPL. They are released separately
by Bohemia Interactive under the **Arma Public License Share Alike (APL-SA)**:

- APL-SA license text: 

### Getting game data to run what you build

The compiled binaries need game data to run. You can obtain the **free Demo game
data** on Steam:

- *Arma: Cold War Assault Remastered* Demo on Steam: 

The full game data ships with the retail game. Whatever you do with assets is
governed by the APL-SA linked above; whatever you do with this source is governed by
the GPL with additional terms per Section 7 in `LICENSE`.


## Contributing

This is a **locked** repository: pull requests are not accepted here, and this
repository will not be continuously updated.
Issues are only for bugs in official Bohemia Interactive builds distributed on
Steam. For ideas, development builds, ports, and community work, fork the code or
join the community continuation. See `CONTRIBUTING.md` for more information.
