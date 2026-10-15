---
title: "Realaoleep/SigDeck"
owner: "Realaoleep"
name: "SigDeck"
fullName: "Realaoleep/SigDeck"
description: "Offline Ed25519 signing toolkit - sign files, verify signatures, exchange keys via QR. Pure-Python RFC 8032, scrypt passphrases, ASCII armor. Air-gapped signing playground."
sourceUrl: "https://github.com/Realaoleep/SigDeck"
stars: 52
forks: 2
language: "Python"
topics: ["air-gapped", "android", "cryptography", "ed25519", "offline", "qr-codes", "security", "signing"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-08-28"
pushedAt: "2026-08-27T18:06:07Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# SigDeck

*图片：ci-python*
*图片：license*
*图片：python*
*图片：air-gapped*

**Offline Ed25519 signing toolkit** - sign files, verify signatures, exchange
keys via QR. Fully air-gapped: a pure-Python RFC 8032 implementation, scrypt
passphrases, and ASCII armor. The signing playground for people who don't
trust their clipboard.

## Why this exists

I wanted a signing tool I could run on a machine with no network at all - no
pip downloads, no telemetry, no cloud. SigDeck is a single Python package with
a from-scratch Ed25519 core, a passphrase-wrapped secret key format, and QR
payloads for moving keys and signatures across an air gap.

## Layout

```
sigdeck/    the Python engine (pure stdlib: keys, sign, verify, armor, qr)
app/        minimal Android demo: scan QR keys, sign, verify
docs/       guides (getting started, formats, qr exchange, shortcuts)
examples/   end-to-end recipes (signing releases, qr verification)
```

## Quick start

```console
$ pip install -e .
$ sd keygen --out alice.key
$ sd pub alice.key --output alice.pub
$ sd sign release.tar.gz --key alice.key
$ sd verify release.tar.gz --sig release.tar.gz.sig --pub alice.pub
Verified
```

## The signing playground rules

- **Pure stdlib** - the whole engine uses `hashlib`, `hmac`, `base64`, `os`,
  `zlib`. Nothing to download, ever.
- **Ed25519 from scratch** - RFC 8032, test-vector verified (see tests).
- **Passphrase option** - secret keys can be sealed with scrypt
  (`hashlib.scrypt`) so a stolen key file is still useless.
- **QR exchange** - `SGDK1:` payloads carry public keys and signatures
  across air gaps (print, scan, done).

## Requirements

- Python 3.9+ (no third-party dependencies for the engine)
- Android Studio for the demo app

## Contributing

PRs welcome - see CONTRIBUTING.md. `make test` before push;
CI mirrors it.

## License

MIT - see LICENSE.
