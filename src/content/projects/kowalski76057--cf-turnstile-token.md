---
title: "kowalski76057/cf-turnstile-token"
owner: "kowalski76057"
name: "cf-turnstile-token"
fullName: "kowalski76057/cf-turnstile-token"
description: "Scriptable Cloudflare Turnstile token CLI via the Peak API - sitekey discovery, solve, and token output for CI and automation."
sourceUrl: "https://github.com/kowalski76057/cf-turnstile-token"
stars: 63
forks: 2
language: "Python"
topics: ["anti-bot", "api-client", "automation", "captcha", "cli", "cloudflare", "cloudflare-turnstile", "developer-tools"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-03"
pushedAt: "2026-09-02T16:11:01Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Cloudflare Turnstile Token

> A scriptable command-line client for obtaining Cloudflare Turnstile tokens via
> the Peak API — built for CI pipelines, QA automation, and integration
> engineering where a headless, repeatable token flow is required.

Turnstile Token CLI reads a Turnstile sitekey directly from a page (or accepts
one explicitly), submits a solve task to the Peak API, and returns a valid
`cf-turnstile-response` token you can inject into a request or form. It has no
browser dependency, no interactive steps, and is designed to run anywhere a
plain Python 3.8+ runtime exists.

## Why

Cloudflare Turnstile walls stop headless and scripted clients with a `403` or a
widget they cannot pass. Standing up a real browser per token is slow, flaky,
and expensive at scale. A token API removes the browser entirely: hand the
service the sitekey and the target URL, and get back a token that submits like a
real visitor. Turnstile Token CLI wraps that API in a clean, scriptable
interface with automatic sitekey extraction, retries, and structured output.

## Features

- **Automatic sitekey extraction** — point it at any page and it finds the
  `data-sitekey` for you.
- **Zero browser dependency** — a single Python file, no Playwright/Selenium,
  no GUI, works on headless servers and CI runners.
- **Retry with backoff** — transient failures retry automatically.
- **Structured output** — plain token or JSON, ready to pipe into other tools.
- **Proxy-aware** — pass a proxy so the solve matches your crawl IP.
- **Action / cdata support** — matches Turnstile configurations that require
  them.

## Quick start

```console
$ export PEAK_API_KEY=pk_your_api_key
$ python cf_turnstile_token.py \
    --page https://example.com/protected \
    --url https://example.com/
sitekey: 0x4AAAAAAAxxxx
0.AgAAABBqzz...
```

Or with an explicit sitekey and a proxy:

```console
$ python cf_turnstile_token.py \
    --sitekey 0x4AAAAAAAxxxx \
    --url https://example.com/ \
    --proxy http://user:pass@1.2.3.4:8080
0.AgAAABBqzz...
```

JSON output for pipelines:

```console
$ python cf_turnstile_token.py \
    --page https://example.com/ \
    --url https://example.com/ \
    --output json
{
  "token": "0.AgAAABBqzz...",
  "success": true
}
```

## Installation

No dependencies beyond the Python standard library. Copy `cf_turnstile_token.py`
anywhere, or install as a module:

```console
$ pip install .
```

Then use the entry point:

```console
$ turnstile-token --page https://example.com/ --url https://example.com/
```

## How it works

1. **Sitekey discovery** — if `--page` is given, the tool fetches the page and
   extracts the first Turnstile `data-sitekey`.
2. **Solve request** — it POSTs a `turnstiletask` to the Peak API
   (`https://api.peak.fo/solve`) with the sitekey, target URL, and optional
   proxy/action/cdata.
3. **Token returned** — the response carries a `data.token` you submit as
   `cf-turnstile-response` (or the equivalent parameter your target expects).

The API contract is documented at [peak.fo/docs/turnstile](https://peak.fo/docs/turnstile).

## API reference

### `solve(api_key, sitekey, url, proxy=None, action=None, cdata=None, ...)`

| Argument   | Required | Description |
|------------|----------|-------------|
| `api_key`  | yes      | Peak API key (or `PEAK_API_KEY` env var). |
| `sitekey`  | yes      | Turnstile sitekey, e.g. `0x4AAAAAAAxxxx`. |
| `url`      | yes      | Target page URL — **must end with `/`**. |
| `proxy`    | no       | `http://user:pass@ip:port` to match your crawl IP. |
| `action`   | no       | Turnstile action value, when the site configures one. |
| `cdata`    | no       | Turnstile cdata value, when the site configures one. |
| `retries`  | no       | Automatic retries on transient failure (default `3`). |

Returns a `SolveResult` with `.token` and `.raw`. Raises `PeakError` on failure.

### `extract_sitekey(html)`

Scans a page body for the first Turnstile sitekey and returns it (or `None`).

## Examples

### Inside a Python script

```python
from turnstile_token_cli import solve, PeakError, extract_sitekey, read_page

html = read_page("https://example.com/protected")
sitekey = extract_sitekey(html)

try:
    result = solve("pk_...", sitekey, "https://example.com/")
    print(result.token)  # -> "0.AgAAABBqzz..."
except PeakError as exc:
    print(f"solve failed: {exc}")
```

### CI / shell

```bash
TOKEN=$(python cf_turnstile_token.py --page https://example.com/ --url https://example.com/)
curl -X POST https://example.com/submit \
  -H "cf-turnstile-response: $TOKEN" \
  -d "payload=..."
```

## Configuration

| Setting | Source |
|---------|--------|
| `PEAK_API_KEY` | environment variable, or `--api-key` |
| `--api-url` | override the solve endpoint (default `https://api.peak.fo/solve`) |
| `--retries` | number of retry attempts on transient failure |

## Powered by Peak

This package uses [Peak](https://peak.fo/?utm_source=github&utm_medium=readme&utm_campaign=packages&utm_content=cf-turnstile-token) to solve Turnstile.
- Solve Cloudflare Turnstile & the 5s challenge in about a second
- Pay only for successful solves - from $1 / 1,000
- Free API key, no card. Use code **`PEAKGH`** for bonus trial credit.

[Get your free API key](https://peak.fo/?utm_source=github&utm_medium=readme&utm_campaign=packages&utm_content=cf-turnstile-token) • [Docs](https://peak.fo/docs/turnstile?utm_source=github&utm_medium=readme&utm_campaign=packages&utm_content=cf-turnstile-token) • [Pricing](https://peak.fo/pricing?utm_source=github&utm_medium=readme&utm_campaign=packages&utm_content=cf-turnstile-token)

## License

MIT
