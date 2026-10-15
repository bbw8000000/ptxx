---
title: "d4ncboz/github-farm"
owner: "d4ncboz"
name: "github-farm"
fullName: "d4ncboz/github-farm"
description: "Production-grade, AI-Agent-friendly multi-platform OAuth harvesting and session management framework for AI Gateways."
sourceUrl: "https://github.com/d4ncboz/github-farm"
stars: 104
forks: 8
language: "Python"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-08-22"
pushedAt: "2026-08-20T03:30:59Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# ⚡ GitHub OAuth Multi-Platform Harvesting Framework

> Production-grade, AI-Agent-friendly automation framework for scalable identity generation, real-time IMAP OTP capture, and multi-platform OAuth token harvesting.

---

## 📖 Overview

**GitHub OAuth Harvester** is a modular automation framework designed for developer teams and AI Agents to securely streamline multi-platform OAuth session management. By combining RFC-compliant email aliasing, clean proxy enforcement, SSL IMAP listeners, and universal database ingestion, developers can systematically maintain API access across leading developer platforms.

---

## 🎯 Target Platforms & Allowance Matrix

| Platform | Authentication Flow | Currency / Unit Type | Welcome Allowance | Periodic Allocation | Portal & Signup |
|---|---|---|---|---|---|
| **Tabi AI** | GitHub OAuth | **USD Balance (`$`)** | **`$120.00 USD`** | **`+$5–$10 / Daily Check-in`** | [tabitoken.com](https://tabitoken.com/sign-up?aff=sn7K) |
| **GoRouter** | GitHub OAuth | **USD Balance (`$`)** | **`$70.00 USD`** | **`+$5–$10 / Daily Check-in`** | [gorouter.app](https://gorouter.app/sign-up?aff=ivjz) |
| **CodeBuddy Global** | GitHub Keycloak OIDC | **Usage Credits** | **`250 Bonus Credits`** | **`+100 Credits / Month`** | [codebuddy.ai](https://www.codebuddy.ai/profile/plans-usage) |

---

## 🛡️ Critical Network & Security Prerequisites

### 1. Mandatory Clean Proxy Rule
GitHub's Web Application Firewall (WAF) strictly monitors signup requests for anomaly patterns. To prevent instant account flagging or shadowbans:
* **Mandatory:** Use **Mobile 4G/5G (CGNAT)** or **Clean Residential ISP** proxies.
* **Prohibited:** Datacenter / Commercial hosting ASN proxies (Cloudflare, AWS, DigitalOcean) will immediately trigger WAF restrictions (`Access is temporarily restricted`).
* **Rule:** Allocate **1 clean IP per registration session**.

### 2. Google IMAP 16-Digit App Password Setup
To enable autonomous OTP retrieval without webmail interaction:
1. Enable **2-Step Verification** on your master Google account.
2. Navigate to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
3. Generate a dedicated app password (e.g. `GitHub Harvester`).
4. Provide the 16-character string (`abcdefghijklmnop`) in your configuration.

---

## 🤖 AI Agent Friendly Interface (`--json`)

This framework is built natively for AI Agents (Hermes, Codex, Claude Code). All CLI commands support the `--json` flag for machine-readable output:

```bash
# Generate 10 email aliases in JSON format
python3 main.py generate --user masteruser --domain gmail.com --count 10 --json

# Real-time OTP listener with JSON response
python3 main.py listen-otp --user master@gmail.com --password 16digitapppassword --json
```

---

## 🚀 Quick Start Guide

### 1. Configuration Setup
```bash
cp config/config.example.toml config/config.toml
```

### 2. Generate Email Variations
* **Gmail Dot-Trick:**
  ```bash
  python3 main.py generate --user dannboss --domain gmail.com --type dot --count 20
  ```
* **ProtonMail Plus-Addressing:**
  ```bash
  python3 main.py generate --user masterboz --domain proton.me --type plus --count 20
  ```

### 3. Real-Time OTP Capture
```bash
python3 main.py listen-otp --user your_email@gmail.com --password your_16_digit_app_password --timeout 120
```

### 4. Direct Session Injection to Local AI Gateway (9Router)
```bash
python3 main.py inject --platform codebuddy --token ""
```

---

## 🌐 Community & Official Support

* **Telegram Community:** [BOZDROP CRYPTO](https://t.me/bozdrop)
* **Project Support:** [SAWERIA](https://saweria.co/d4nnboz)

---

## 📄 License
Released under the **MIT License**. Author: **D4NNBOZ**.
