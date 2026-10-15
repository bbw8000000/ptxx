---
title: "d4ncboz/qoder-workflow"
owner: "d4ncboz"
name: "qoder-workflow"
fullName: "d4ncboz/qoder-workflow"
description: "Complete, end-to-end framework and high-performance OpenAI-compatible gateway for the Qoder ecosystem."
sourceUrl: "https://github.com/d4ncboz/qoder-workflow"
stars: 69
forks: 5
language: "Python"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-08-19"
pushedAt: "2026-08-18T04:36:55Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# ⚡ Qoder Workflow: Unified Suite & AI Gateway

> Comprehensive, modular framework and high-performance OpenAI-compatible gateway integrating all essential capabilities of the Qoder ecosystem.

---

## 🏗️ Unified 5-Stage Architecture

**Qoder Workflow** seamlessly integrates all functional modules into an end-to-end framework:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             UNIFIED QODER SUITE                                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  [Stage 1: Provisioner & Patcher] ──► [Stage 2: Harvester] ──► [Stage 3: Decrypt] │
│  (Auth, SSO & Machine Patcher)        (PAT Generator pt-*)     (AES-CBC Session) │
│                                                                        │         │
│                                                                        ▼         │
│  [Stage 5: OpenAI & Proxy Bridge] ◄── [Stage 4: COSY Claim Engine] ◄───┘         │
│  (REST API & 15 Top Models)           (Activity & Quota Check)                   │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Module Capabilities

1. **Provisioner & Desktop Patcher (`src/provisioner/` & `src/patcher/`):**
   * Multi-platform identity patching (macOS, Windows, Linux) for machine IDs, MAC addresses, and application states.
   * Google Workspace SSO handshake, mail verification flows, and account status initializations.
2. **PAT Harvester (`src/harvester/`):**
   * Automated REST generation of official 64-character Personal Access Tokens (`pt-*`).
3. **Session Decryptor (`src/decryptor/`):**
   * Isolated sandbox runner for Qoder CLI and cryptographic AES-CBC-128 extraction of `.auth/user` access tokens (`jt-*`).
4. **COSY Activity & Claim Engine (`src/claimer/`):**
   * Hardware machine binding (`Cosy-MachineToken`, `Cosy-MachineCode`) with dynamic GMT MD5 date-signatures (`cosy&war, war never changes&`) for quota inspection and activity eligibility scanning.
5. **OpenAI & Anthropic Proxy Gateway (`src/gateway/` & `src/proxy/`):**
   * Drop-in HTTP REST API server (`/v1/chat/completions` & `/v1/models`) supporting SSE streaming, fallback routing, and native model mappings for 15 top AI architectures.

---

## 🎯 Top Models Qoder PAT

Integrated model catalog available through the gateway:

| Model ID | Model Name | Upstream Architecture | Context Window | Category / Specialization |
|---|---|---|---|---|
| `qd/auto` | **Auto** | Auto Dynamic Routing | 128k | Dynamic multi-tier routing |
| `qd/ultimate` | **Opus 4.7** | Claude Opus 4.7 | 200k | Deep reasoning & complex architecture |
| `qd/performance` | **Sonnet 4.6** | Claude Sonnet 4.6 | 200k | High-speed coding & precision |
| `qd/efficient` | **Haiku 4.5** | Claude Haiku 4.5 | 128k | Token efficiency & lightweight tasks |
| `qd/lite` | **Lite** | Lite Engine | 64k | High throughput basic parsing |
| `qd/qmodel_38max` | **Qwen3.8-Max** | Qwen 3.8 Max | 128k | Advanced coding & mathematics |
| `qd/qmodel_latest` | **Qwen3.7-Max** | Qwen 3.7 Max | 128k | Flagship coding model |
| `qd/qmodel` | **Qwen3.7-Plus** | Qwen 3.7 Plus | 128k | General software engineering |
| `qd/kmodel_latest` | **Kimi-K3** | Moonshot Kimi K3 | 200k | Long-context & document analysis |
| `qd/kmodel` | **Kimi-K2.7-Code** | Moonshot Kimi K2.7 Code | 128k | Syntax & code refactoring |
| `qd/gm51model` | **GLM-5.2** | Zhipu GLM-5.2 | 128k | Analytical logic & reasoning |
| `qd/dmodel` | **DeepSeek-V4-Pro** | DeepSeek V4 Pro | 128k | Complex algorithms & deep logic |
| `qd/dfmodel` | **DeepSeek-V4-Flash** | DeepSeek V4 Flash | 64k | Low-latency response generation |
| `qd/mmodel` | **MiniMax-M3** | MiniMax M3 | 128k | Natural language dialogue & writing |
| `qd/cmodel` | **Fable 5** | Fable 5 | 128k | Technical writing & synthesis |

---

## 📂 Repository Structure

```text
qoder-workflow/
├── config/
│   ├── config.example.toml     # Engine TOML Configuration
│   ├── config.example.json     # Engine JSON Configuration
│   └── models.json             # 15 Top Models Catalog Definition
├── src/
│   ├── provisioner/            # Provisioning & SSO Handshake
│   ├── harvester/              # PAT Token Harvester API
│   ├── patcher/                # Multi-Platform Identity Patcher
│   ├── decryptor/              # AES-CBC CLI Session Decryptor
│   ├── claimer/                # COSY Signature & Claim Engine
│   ├── proxy/                  # OpenAI Model Router & Fallback
│   └── gateway/                # OpenAI REST API HTTP Server
├── test/
│   ├── test_decrypt.py         # Unit tests for AES decryption
│   ├── test_cosy_sign.py       # Unit tests for COSY MD5 signature
│   ├── test_patcher_router.py  # Unit tests for Patcher & Model Router
│   └── test_gateway.js         # Integration tests for OpenAI Gateway
├── main.py                     # Unified CLI Orchestrator
├── package.json                # Node.js Package Specification
├── README.md                   # Complete Documentation
└── LICENSE                     # MIT License
```

---

## 🚀 Quick Start

### 1. Launch OpenAI-Compatible API Gateway
```bash
git clone https://github.com/d4ncboz/qoder-workflow.git
cd qoder-workflow
npm start
```
The gateway starts listening on `http://localhost:20240`.

### 2. Test Model Routing via cURL
```bash
curl http://localhost:20240/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qd/ultimate",
    "messages": [
      {"role": "user", "content": "Hello world"}
    ],
    "stream": false
  }'
```

### 3. Run Verification & State Patcher via CLI
```bash
# Verify PAT & Check Live Quota
python3 main.py --action verify-pat --pat "pt-..."

# Scan Activity Eligibility
python3 main.py --action scan-eligibility --pat "pt-..."
```

---

## 🤝 Community & Support

* Community discussions, project updates, and ecosystem releases: **[BOZDROP CRYPTO](https://t.me/bozdrop)**.
* Support independent open-source development via **[SAWERIA](https://saweria.co/d4nnboz)**.

---

## 📄 License

Licensed under the MIT License © 2026 **D4NNBOZ**.
