---
title: "Vanszs/qwencloud-generator"
owner: "Vanszs"
name: "qwencloud-generator"
fullName: "Vanszs/qwencloud-generator"
description: " Automated QwenCloud account registration & API key harvester with multi-threading, TUI dashboard, proxy rotation, and Gmail OAuth"
sourceUrl: "https://github.com/Vanszs/qwencloud-generator"
stars: 291
forks: 78
language: "Python"
topics: ["account-generator", "api-key", "automation", "gmail", "harvester", "playwright", "proxy", "python"]
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-27T13:18:41Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

QwenCloud Generator


  🚀 Automated QwenCloud account registration & API key harvester with multi-threading, TUI dashboard, proxy rotation, and Gmail OAuth


  Features •
  Prerequisites •
  Setup •
  Usage •
  How It Works


---

## Features

- ⚡ **Multi-threaded** — Run N browsers concurrently (`-t N`)
- 🖥️ **TUI Dashboard** — Real-time worker status, progress bar, ETA, CPU/Mem
- 👻 **Invisible mode** — Headed browser on Xvfb virtual display (CF-safe)
- 🔄 **Proxy rotation** — Each account gets a unique proxy, no reuse
- 📧 **Gmail OAuth** — Multi-account Gmail token management for email verification
- 🎭 **Censor mode** — Mask emails and API keys in output (`-c`)
- 🔄 **Auto-resume** — Login existing accounts to harvest missed API keys
- 📊 **Scenario detection** — Auto-detects all page states (signup, login, OTP, dashboard, etc.)

## Prerequisites

| Requirement | Install |
|---|---|
| Python 3.11+ | [python.org](https://python.org) |
| Google Chrome | [google.com/chrome](https://google.com/chrome) |
| Xvfb | `sudo apt install xvfb` |
| Playwright | `pip install -r requirements.txt && playwright install chromium` |

## Setup

### 1. Clone & install
```bash
git clone https://github.com/Vanszs/qwencloud-generator.git
cd qwencloud-generator
pip install -r requirements.txt
playwright install chromium
```

### 2. Add proxies
Edit `proxy.txt` — one proxy per line:
```
username:password@host:port
```

### 3. Generate email list
```bash
python3 generate_email_list.py yourgmailuser -o email_list.txt
```

### 4. Set up Gmail OAuth

The script needs Gmail API access to read verification emails. Here's how to set it up:

#### 4a. Create Google Cloud credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (any name)
3. Go to **APIs & Services → Library** → search "Gmail API" → **Enable**
4. Go to **APIs & Services → Credentials** → **Create Credentials** → **OAuth client ID**
5. Application type: **Desktop app** → Create
6. Download the JSON file (`client_secret_*.json`)
7. Rename it to `client_secret.json` and place it in this folder

#### 4b. Authorize your Gmail account(s)

For each base Gmail account you want to use, you need to get an OAuth refresh token:

```bash
python3 gmail_auth.py
```

If you see `accounts: []` — that's normal! You haven't authorized any account yet.

To authorize, generate an OAuth URL for your Gmail:

```bash
python3 -c "
from gmail_auth import _default_client
import urllib.parse

client = _default_client()
url = f'https://accounts.google.com/o/oauth2/auth?client_id={client["client_id"]}&redirect_uri=http%3A//localhost%3A8085/callback&scope=https%3A//www.googleapis.com/auth/gmail.readonly&response_type=code&access_type=offline&prompt=consent&login_hint=yourname%40gmail.com'
print(url)
"
```

Replace `yourname@gmail.com` with your actual Gmail address.

1. Open the printed URL in your browser
2. Login with that Gmail account
3. Click **Allow** on the consent screen
4. You'll be redirected to `http://localhost:8085/callback?code=4/0Abc...`
5. Copy the full URL from the address bar
6. Exchange the code:

```bash
python3 -c "
from gmail_auth import exchange_code
exchange_code('yourname@gmail.com', '4/0Abc...')
print('Token saved!')
"
```

Replace `yourname@gmail.com` with the same Gmail, and `4/0Abc...` with the code from the URL.

Verify it worked:
```bash
python3 gmail_auth.py
# Should show: accounts: ['yourname@gmail.com']
```

Repeat for each Gmail account you want to use.

## Usage

### Register new accounts
```bash
# Single thread, browser visible
python3 run.py 10

# 5 threads, invisible (Xvfb)
python3 run.py 100 --headless -t 5

# 10 threads with censored output
python3 run.py 400 --headless -t 10 -c
```

### Resume existing accounts
```bash
python3 run.py 50 --headless -t 5 --resume
```

### Flags

| Flag | Description | Default |
|---|---|---|
| `N` | Target number of successful API keys | 5 |
| `--headless` | Run via Xvfb (invisible browser) | off |
| `--resume` | Resume already-registered accounts via login | off |
| `-t N` | Number of concurrent threads | 1 |
| `-c` | Censor emails/API keys in output | off |
| `--log` | Show full subprocess logs | off |
| `--self` | Run without proxy (use own IP) | off |
| `--nyx PROXY` | Use rotating proxy | — |

## How It Works

```
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
│  Email List  │───▶│  run.py      │───▶│ qwencloud_full.py│
│  (Gmail)     │    │  (Orchestrator)│    │  (Browser Auto)  │
└─────────────┘    │  -t N threads │    │  - Signup/Login   │
                   │  TUI Dashboard │    │  - OTP verify     │
┌─────────────┐    │  Proxy claim  │    │  - API key extract│
│  proxy.txt   │───▶│  Email claim  │    └─────────────────┘
└─────────────┘    └──────────────┘             │
                         │                      ▼
                   ┌──────────────┐      ┌─────────────┐
                   │  api_keys.txt│◀─────│ accounts.json│
                   └──────────────┘      └─────────────┘
```

1. Each thread claims a unique email + proxy (thread-safe)
2. Spawns `qwencloud_full.py` as subprocess (Playwright is not thread-safe)
3. Monitors subprocess output for progress updates → TUI
4. Parses `__RESULT__` JSON from stdout
5. Saves API keys to `api_keys.txt` and account data to `accounts.json`

## Files

| File | Purpose |
|---|---|
| `run.py` | Main orchestrator — threading, TUI, proxy/email claiming |
| `qwencloud_full.py` | Browser automation — signup, login, API key extraction |
| `gmail_auth.py` | Gmail OAuth multi-account token management |
| `generate_email_list.py` | Generate Gmail dot-variants |
| `logger.py` | Colored logging utilities |
| `tui.py` | Terminal UI dashboard (ANSI escape codes, no dependencies) |
| `run_hidden.sh` | Xvfb wrapper script |

## Notes

- Each browser instance gets 1 unique proxy — no reuse
- Gmail dot-variants work as separate QwenCloud accounts
- Stuck processes are killed after 30s of no output
- Total timeout per account: 300s
- Cloudflare requires headed browser (use `--headless` which runs Xvfb, not true headless)

## License

MIT — feel free to use, modify, and distribute.

---


  ⭐ Star if useful
