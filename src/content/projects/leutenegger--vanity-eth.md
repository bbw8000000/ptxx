---
title: "Leutenegger/vanity-eth"
owner: "Leutenegger"
name: "vanity-eth"
fullName: "Leutenegger/vanity-eth"
description: "Offline vanity address generator for Bitcoin and Ethereum. CPU multi-process search with interactive CLI menu. Supports Legacy, Nested SegWit, Native SegWit, Taproot, and ETH (EIP-55)."
sourceUrl: "https://github.com/Leutenegger/vanity-eth"
stars: 801
forks: 90
language: "Python"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-08-21"
pushedAt: "2026-08-21T00:43:13Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# VanityKit

Offline vanity address generator for Bitcoin and Ethereum.

VanityKit searches for private keys whose corresponding addresses match a user-specified pattern (prefix, suffix, or substring). All key generation and address derivation run locally. The tool makes no network requests and contains no telemetry.

The implementation prioritises readability and auditability. It is intentionally slower than specialised C++ or GPU tools; use it when you want a simple, offline, inspectable workflow rather than maximum throughput.

## Supported address types

### Bitcoin

| Type              | Prefix example | Description                          |
|-------------------|----------------|--------------------------------------|
| Legacy P2PKH      | `1...`         | Original pay-to-public-key-hash      |
| Nested SegWit     | `3...`         | P2SH-wrapped P2WPKH                  |
| Native SegWit     | `bc1q...`      | Bech32 P2WPKH                        |
| Taproot key-path  | `bc1p...`      | Bech32m P2TR (key-path only)         |

### Ethereum

- Standard 20-byte addresses
- Optional EIP-55 mixed-case checksum output and matching

## Features

- Multi-process parallel search
- Live progress reporting (attempts, rate, elapsed time)
- Prefix, suffix and contains matching
- Case-sensitive option for Ethereum (useful for exact EIP-55 patterns)
- Rough difficulty estimation based on pattern length and alphabet size
- Private-key output in hex and WIF (Bitcoin)
- Independent verification helpers
- Self-contained Bech32 / Bech32m implementation (BIP-173 / BIP-350)
- No network access, no telemetry, no external key material

## Requirements

- Python 3.10 or later
- A machine you fully control (preferably offline when the resulting keys will hold real funds)

## Installation

```bash
git clone https://github.com/Leutenegger/vanity-kit.git
cd vanity-kit
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -e .
```

This installs the `vanity` command into the virtual environment.

### Dependencies

- coincurve (libsecp256k1 bindings)
- pycryptodome (Keccak-256)
- base58
- click
- tqdm

## Usage

```bash
# Ethereum address starting with "cafe"
vanity eth --prefix cafe

# Ethereum address ending with "dead", 8 worker processes
vanity eth --suffix dead --threads 8

# Ethereum with exact case matching and EIP-55 checksummed output
vanity eth --prefix Cafe --case-sensitive --checksum

# Bitcoin Legacy (starts with 1)
vanity btc --type legacy --prefix 1Love

# Bitcoin Nested SegWit (starts with 3)
vanity btc --type nested --prefix 3Love

# Bitcoin Native SegWit (starts with bc1q)
vanity btc --type segwit --prefix bc1qdead

# Bitcoin Taproot key-path (starts with bc1p)
vanity btc --type taproot --prefix bc1p --threads 6

# Substring anywhere in the address
vanity eth --contains dead
vanity btc --type segwit --contains cafe
```

At least one of `--prefix`, `--suffix` or `--contains` is required.

### Common options

| Option            | Description                                      |
|-------------------|--------------------------------------------------|
| `--prefix`, `-p`  | Required starting characters                     |
| `--suffix`, `-s`  | Required ending characters                       |
| `--contains`, `-c`| Required substring anywhere in the address       |
| `--threads`, `-t` | Number of worker processes (default 4)           |
| `--case-sensitive`| Exact case match (Ethereum only)                 |
| `--checksum`      | Print EIP-55 checksummed form (Ethereum only)    |

## Security

Vanity address generation creates private keys. Treat the process with the same care as any other key-generation tool.

1. Run the software only on a computer you fully control.
2. Prefer an air-gapped or offline environment when the resulting keys will hold real funds.
3. After a match is found, independently verify that the printed private key derives the printed address before transferring any value. The package provides `verify_eth_address` and `verify_btc_address` helpers for this purpose.
4. Never enter or paste private keys into websites, browser extensions, chat applications or untrusted software.
5. Longer patterns require exponentially more work. Four characters are usually practical on a modern multi-core CPU; six or more can take hours or days.
6. Clear terminal history and any temporary files after the session.

This project is independent open-source software. Review the source code before use. The author accepts no responsibility for loss of funds caused by incorrect usage, compromised machines, software defects, or any other reason.

See SECURITY.md for the full security policy.

## Performance notes

VanityKit uses pure-Python orchestration with the coincurve library for elliptic-curve operations. It is slower than dedicated C++ or GPU tools such as VanitySearch or vanitygen-plusplus. It is intended for short patterns and for situations where a simple, readable, offline implementation is preferred.

### Rough difficulty guidance

| Pattern length | Alphabet      | Approx. expected attempts |
|----------------|---------------|---------------------------|
| 3              | hex (16)      | ~4 000                    |
| 4              | hex (16)      | ~65 000                   |
| 5              | hex (16)      | ~1 000 000                |
| 6              | hex (16)      | ~16 000 000               |
| 4              | base58 (58)   | ~11 000 000               |
| 5              | base58 (58)   | ~650 000 000              |

Actual wall-clock time depends on CPU cores, clock speed, system load and the exact pattern.

## Development

```bash
pip install -e ".[dev]"
pytest -q
ruff check src tests
```

See CONTRIBUTING.md for contribution guidelines.

## Limitations

- Pure-Python search is slower than specialised native tools.
- Taproot support is limited to the basic key-path construction (no script-path trees).
- The difficulty estimator is an approximation that assumes a uniform distribution over the address alphabet.
- Nested SegWit and Taproot are provided for completeness; most users will use Legacy or Native SegWit for vanity purposes.

## Licence

MIT License. See LICENSE.

Copyright (c) 2026 Leutenegger

# End of VanityKit source tree
# Copyright (c) 2026 Leutenegger
# MIT License
