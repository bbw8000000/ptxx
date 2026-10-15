---
title: "jamespolyakov9829/captcha-api"
owner: "jamespolyakov9829"
name: "captcha-api"
fullName: "jamespolyakov9829/captcha-api"
description: "Captcha-solving API client - Cloudflare Challenge and Turnstile in one interface, with cost tracking and concurrent batch solves."
sourceUrl: "https://github.com/jamespolyakov9829/captcha-api"
stars: 263
forks: 37
language: "Python"
topics: ["api", "automation", "captcha", "captcha-api", "challenge", "cloudflare", "python", "turnstile"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-25T19:28:10Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# captcha-api

A dependency-free Python client and CLI for the [Clearance](https://clearance.sh/register?ref=UQ428VM) captcha-solving API.

One interface for both Cloudflare services that block automation - the Challenge (the "Just a moment." interstitial) and the Turnstile widget. It adds the parts a production integration needs: cost tracking so you know what a batch charges before it runs, concurrent batch solves on a thread pool, and the browser identity block so your replayed token actually clears.


&nbsp;

&nbsp;


- **Free credits on sign-up.** No card, no trial countdown.
- **$0.40 per 1,000** for both Cloudflare services. $0.00040 a solve.
- **451ms** average Turnstile solve, **1.3s** for the Challenge.
- **Failed solves are refunded** in full - you pay for tokens you received.
- **Cost tracking built in.** Know the bill before you run the batch.
- **No runtime dependencies.** Standard library only, Python 3.8+.

---

## Contents

- Pricing
- Why this exists
- Install
- Quickstart
- Cost tracking
- Concurrent batches
- Task types
- The response: a token and its identity
- The polling rhythm
- Error handling
- CLI reference
- FAQ

---

## Pricing

Two services, one price. Billed per solve, with no subscription and no minimum spend.

| Service | `task.type` | Price / 1,000 | Per solve | Avg solve |
| --- | --- | --- | --- | --- |
| **Cloudflare Turnstile** | `AntiTurnstileTask` | **$0.40** | $0.00040 | **451ms** |
| **Cloudflare Challenge** | `AntiCloudflareTask` | **$0.40** | $0.00040 | **1.3s** |

**Free credits on sign-up** - enough to run your first integration before you spend anything.

**Unlimited plans** are available for sustained volume - ask for pricing.

### How that compares

Published per-1,000 rates for Cloudflare Turnstile, gathered from each provider's own pricing page:

| Provider | Turnstile / 1,000 |
| --- | --- |
| **Clearance** | **$0.40** |
| CapMonster Cloud | $0.80 |
| CapSolver | $0.80 - $1.00 |
| Anti-Captcha | $1.50 |
| CaptchaSonic | $1.45 |
| 2Captcha | $1.45 - $1.99 |

At $0.40 that is roughly a third of what the field charges, without giving up solve time.


---

## Why this exists

Every captcha API gives you a token. Almost none of them tell you what it cost, and almost none of them handle a batch without you writing the concurrency yourself.

This package is built for the integration that runs at scale:

- **Know the bill first.** `estimate_cost(10000)` tells you the charge before a single task is submitted.
- **Track spend as you go.** `CostTracker` records every solve, refunds nothing, and summarises in one call.
- **Batch without threads.** `Solver.batch()` fans out across a pool and records per-URL results. One bad URL never kills the run.
- **Replay correctly.** Every result carries the browser identity - User-Agent, TLS handshake, HTTP/2 settings - so the token clears on the follow-up request instead of being thrown away.

---

## Install

```bash
pip install captcha-api
```

Or straight from source:

```bash
git clone https://github.com//captcha-api.git
cd captcha-api
pip install .
```

---

## Quickstart

Create an account to get your key - it takes about a minute and comes with **free credits**:


Then export the key from **Dashboard > Settings**:

```bash
export CLEARANCE_API_KEY="your_key_here"
```

### From the command line

```bash
captcha-api challenge --url https://example.com/login
captcha-api turnstile --url https://example.com/login --sitekey 0x4AAAAAAAxxxx
captcha-api estimate --count 10000
captcha-api balance
```

### As a library

```python
from captcha_api import Solver

solver = Solver.from_env()

# Cloudflare Challenge - returns a cf_clearance cookie
result = solver.challenge("https://example.com/login")
print(result.token)

# Cloudflare Turnstile - returns a cf-turnstile-response token
result = solver.turnstile("https://example.com/login", sitekey="0x4AAAAAAAxxxx")
print(result.token)

# What did that cost?
print(solver.tracker.summary())
```

### With curl

Two calls, no SDK, no browser:

```bash
curl -s https://api.clearance.sh/createTask \
  -H 'content-type: application/json' \
  -H 'x-private-key: YOUR_API_KEY' \
  -d '{"task": {"type": "AntiCloudflareTask", "websiteURL": "https://example.com/login"}}'
```

```bash
curl -s https://api.clearance.sh/getTaskResult \
  -H 'content-type: application/json' \
  -H 'x-private-key: YOUR_API_KEY' \
  -d '{"taskId": "YOUR_TASK_ID"}'
```

---

## Cost tracking

Two objects handle the money side.

### Estimate before you run

```python
from captcha_api import estimate_cost

est = estimate_cost(10000)
print(est.total)        # 4.0
print(est.as_dict())
```

From the shell:

```bash
captcha-api estimate --count 10000
```

```json
{ "count": 10000, "costPerSolve": 0.0004, "total": 4.0, "freeCreditsFirst": false }
```

### Track as you go

Every `Solver` carries a `CostTracker`. Successful solves add $0.00040 each. Failed solves are refunded and add nothing.

```python
solver = Solver.from_env()
solver.challenge("https://a.example/")
solver.challenge("https://b.example/")

print(solver.tracker.summary())
# {"solved": 2, "failed": 0, "totalCost": 0.0008, "avgCostPerSolve": 0.0004}
```

Batch runs feed the same tracker:

```python
results = solver.batch(urls, task_type=TASK_CHALLENGE, workers=8)
print(solver.tracker.summary())
```

---

## Concurrent batches

`Solver.batch()` fans out across a thread pool. One URL per call, per-URL error capture, results in input order.

```python
from captcha_api import Solver, TASK_TURNSTILE

solver = Solver.from_env()

urls = ["https://a.example/", "https://b.example/", "https://c.example/"]
results = solver.batch(urls, task_type=TASK_TURNSTILE, sitekey="0x4AAAAAAAxxxx", workers=8)

for r in results:
    if r["ok"]:
        print(r["url"], r["token"])
    else:
        print(r["url"], "failed:", r["error"])
```

A failure on one URL never aborts the batch. The tracker records every attempt so `summary()` reflects the whole run.

From the shell:

```bash
captcha-api batch targets.txt --kind turnstile --sitekey 0x4AAAAAAAxxxx --workers 8
```

---

## Task types

| Service | `task.type` | Required | Optional | Price | Avg solve |
| --- | --- | --- | --- | --- | --- |
| Cloudflare Challenge | `AntiCloudflareTask` | `websiteURL` | `proxy` | $0.40 / 1k | 1.3s |
| Cloudflare Turnstile | `AntiTurnstileTask` | `websiteURL`, `websiteKey` | `proxy`, `metadata.action` | $0.40 / 1k | 451ms |

`websiteURL` must be an absolute `http` or `https` URL, at most 2,048 characters.

Two field rules that catch people out:

- **`websiteKey` is required for Turnstile only.** The Challenge lane reads what it needs from the page itself.
- **`metadata.cdata` is rejected, not ignored.** Sending it produces `ERROR_INVALID_TASK_DATA`. Leave it out.

### Proxies

Every task accepts an optional proxy so the solve happens from your own exit IP:

```python
solver = Solver(key, proxy="http://user:pass@host:port")
```

This package also accepts `host:port:user:pass` and normalises it.

---

## The response: a token and its identity

A `ready` result carries:

| Field | Meaning |
| --- | --- |
| `token` | What you submit. For the Challenge this equals `cookies.cf_clearance`. |
| `user_agent` | The User-Agent the token was earned with. |
| `profile_id` | The browser profile that solved it. |
| `cookies` | Cookies to replay. |
| `headers` | Headers to replay alongside them. |
| `emulation` | The TLS and HTTP/2 fingerprint block. |
| `cost` | What this solve charged. |

The emulation block is what makes the replay work:

```json
"emulation": {
  "alpn": ["h2", "http/1.1"],
  "curves_list": "X25519MLKEM768:X25519:P-256:P-384",
  "key_shares": ["X25519MLKEM768", "X25519"],
  "min_tls_version": "1.2",
  "max_tls_version": "1.3",
  "permute_extensions": true,
  "http2": {
    "settings_order": [1, 2, 4, 6],
    "headers_pseudo_order": ["m", "a", "s", "p"]
  }
}
```

Send the follow-up request with **all** of it:

```python
result = solver.challenge(url)

final = get(
    url,
    headers={**result.headers, "User-Agent": result.user_agent},
    cookies=result.cookies,
    # ... and a TLS/HTTP2 stack configured from result.emulation
)
```

`result.identity` returns the three pieces together. A client that replays the cookie with a default HTTP library presents a different handshake, and the clearance is thrown away.

---

## The polling rhythm

Everything is asynchronous. `/createTask` returns an id immediately; `/getTaskResult` returns the solution once a node has produced it.

- Sleep about **500ms** after creating the task.
- Then poll every **200-300ms**.
- A result lives for **five minutes**, and **reading it does not consume it**. A retry after a dropped connection is free.
- After five minutes the id returns `ERROR_TASKID_INVALID`.

The `Solver` does all of this for you:

```python
result = solver.poll(task_id)
```

---

## Error handling

Seven codes cover everything the API can refuse or fail to do. Three are worth retrying, four are not.

Protocol errors arrive as **HTTP 200 with `errorId: 1`**. Branch on the body, check `errorId`, then switch on `errorCode`.

| `errorCode` | HTTP | Retry? | Meaning |
| --- | --- | --- | --- |
| `ERROR_KEY_DOES_NOT_EXIST` | 401 | no | The key is wrong or missing. |
| `ERROR_INVALID_TASK_DATA` | 200 | no | A required field is missing or rejected. |
| `ERROR_TASK_NOT_SUPPORTED` | 200 | no | Unknown `task.type`, or the service is disabled. |
| `ERROR_TASKID_INVALID` | 200 | no | No such id, or it is older than five minutes. |
| `ERROR_CAPTCHA_UNSOLVABLE` | 200 | **yes** | Attempted and failed. Refunded. |
| `ERROR_SERVICE_UNAVAILABLE` | 200 | **yes** | Did not answer in time, or maintenance. |
| `ERROR_NO_SLOT_AVAILABLE` | 503 | **yes** | No capacity. Nothing charged. Honour `Retry-After`. |

```python
from captcha_api import ApiError

try:
    result = solver.challenge(url)
except ApiError as exc:
    if exc.code == "ERROR_KEY_DOES_NOT_EXIST":
        ...                       # fix the key
    elif exc.retryable:
        ...                       # back off and try again
    else:
        raise
```

`Solver` applies exponential backoff to retryable codes and prefers `Retry-After` when the server sends one.

---

## CLI reference

```
captcha-api challenge --url URL
captcha-api turnstile --url URL [--sitekey KEY] [--action NAME]
captcha-api extract   --page URL
captcha-api estimate  --count N
captcha-api balance
captcha-api batch     FILE [--kind turnstile|challenge] [--sitekey KEY] [--workers N]
```

Global flags: `--api-key`, `--proxy`, `--timeout`, `--retries`, `--quiet`, `--verbose`, `--version`.

Exit codes: `0` success, `1` solve failed, `2` usage or credential problem.

---

## FAQ

**How much does a solve cost?**
**$0.40 per 1,000** - $0.00040 each - for both services. Failed solves are refunded.

**How fast is a solve?**
Turnstile averages **451ms**, Challenge about **1.3s**. Live figures on [clearance.sh/status](https://clearance.sh/status).

**Do I need a browser?**
No. Two REST calls, no SDK.

**How do I know what a batch will cost?**
`captcha-api estimate --count N` or `estimate_cost(n).total` before you run it. `solver.tracker.summary()` after.

**Can I run solves concurrently?**
Yes - `Solver.batch()` uses a thread pool. Set `--workers` on the CLI or `workers=` in Python.

**Why did my token fail even though the solve succeeded?**
Almost always the identity. Replay `result.headers`, `result.user_agent` and a stack configured from `result.emulation`.

**Is there a public status page?**
Yes - [clearance.sh/status](https://clearance.sh/status), no key needed, refreshes every 30 seconds.

---

## Start solving

Free credits on sign-up, no card required.


&nbsp;

&nbsp;

&nbsp;


---


  Captchas in 451ms. Priced before you run.
  Cloudflare Turnstile &amp; Challenge at $0.40 per 1,000 - cost tracking, concurrent batches, failed solves refunded.


  451ms avg &nbsp;&middot;&nbsp; $0.40 / 1K &nbsp;&middot;&nbsp; Free credits &nbsp;&middot;&nbsp; Failures refunded


  


## License

MIT - see LICENSE.

See CHANGELOG.md for release history, CONTRIBUTING.md for the ground rules, and SECURITY.md for private vulnerability reporting.

This is an unofficial client. Clearance is a separate service; see [clearance.sh](https://clearance.sh/register?ref=UQ428VM) for terms.
