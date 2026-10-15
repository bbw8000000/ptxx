---
title: "CircuitSavage/cloudflare-turnstile-reversed"
owner: "CircuitSavage"
name: "cloudflare-turnstile-reversed"
fullName: "CircuitSavage/cloudflare-turnstile-reversed"
description: "Cloudflare Turnstile challenge internals: the live request flow, the challenge bundle, and a capture toolkit."
sourceUrl: "https://github.com/CircuitSavage/cloudflare-turnstile-reversed"
stars: 76
forks: 6
language: "Python"
topics: ["anti-bot", "bot-detection", "captcha", "cf-clearance", "challenge", "cloudflare", "cloudflare-turnstile", "reverse-engineering"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-02"
pushedAt: "2026-09-01T15:50:12Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# cloudflare-turnstile-reversed

A sourced teardown of how Cloudflare Turnstile fingerprints and scores browsers, plus a live capture tool. Every claim is cited or tagged `[observed]` / `(inferred)` — no filler, no memory guesses.


Need it solved, not studied? Peak solves Cloudflare Turnstile and the 5s challenge via API — pay per success, from $1/1K, free key, no card. (reCAPTCHA coming soon.)


---

## Docs

- **docs/fingerprinting/** — the deep layer: 8 per-field teardowns (behavioral, automation-tells, canvas, WebGL, audio, device-coherence, TLS/HTTP2, IP/scoring/PoW), each cited and tagged confirmed/observed/inferred. Start at its index.
- docs/03-fingerprinting.md — the one-page fingerprinting overview (surface map; the `docs/fingerprinting/` set goes deeper per field).
- **docs/04-loader-internals.md** — concrete code from the real bundle: the `[native code]` hook-detection function, the `isTrusted` interaction gate, stack/timing telemetry, the endpoint builder.
- docs/01-challenge-flow.md — the live request flow (loader → versioned bundle → challenge-platform), captured.
- docs/02-widget-params.md — the widget parameters the bundle reads (`sitekey`, `cData`, `action`, `chlPageData`).

## Tool

`tools/capture.py` — pull the `sitekey` / `cData` / `action` off a page; `--solve` returns a token.

```bash
python tools/capture.py https://example.com/
PEAK_API_KEY=pk_your_key python tools/capture.py https://example.com/ --solve
```

## Scope

**Is:** a sourced map of the fingerprinting surface (which signals, collected where) and capture tooling. **Isn't:** a byte-level deobfuscation of the versioned bundle, the challenge-platform payload schema, or token construction — and not a token-forgery method, since tokens are single-use and validated server-side via siteverify.

## Legitimate use

Research and automation on data you are allowed to access. Respect each site's Terms of Service and `robots.txt`. No credential stuffing.

## License

MIT.
