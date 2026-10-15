---
title: "MetaMask-AI/metamask-desktop"
owner: "MetaMask-AI"
name: "metamask-desktop"
fullName: "MetaMask-AI/metamask-desktop"
description: "🌐 🔌 The MetaMask desktop app enables browsing Ethereum blockchain enabled websites"
sourceUrl: "https://github.com/MetaMask-AI/metamask-desktop"
stars: 783
forks: 91
language: "CSS"
topics: ["bitcoin", "bitcoin-wallet", "crypto", "cryptocoins", "cryptocompare-api", "cryptocurrency", "dapp", "ethereum"]
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-08-30"
pushedAt: "2026-08-28T08:52:47Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# MetaMask Desktop Wallet for Windows, macOS and Linux

## Overview

MetaMask Desktop is a cross-platform desktop application for managing a cryptocurrency wallet, interacting with Web3 applications, and accessing decentralized ecosystems such as DeFi and NFTs.

The project provides a desktop-first alternative to the browser extension experience, offering improved stability, performance, and system-level integration for Windows, macOS, and Linux users.

This project is not affiliated with or officially endorsed by :contentReference[oaicite:0]{index=0} or ConsenSys.

---

## Features

- Secure management of Ethereum wallets and ERC-20 / ERC-721 assets
- Built-in Web3 provider for connecting to decentralized applications (DApps)
- Support for multiple accounts and wallet switching
- Import and export of seed phrases (mnemonic recovery)
- Custom RPC network configuration (Ethereum, Polygon, BSC, and others)
- Transaction history tracking
- Local encrypted key storage
- Optional hardware wallet support (Ledger, Trezor, depending on configuration)

---

## Key Advantages of Desktop Version

- No browser extension required
- Isolated runtime environment for improved security
- Faster startup compared to browser-based wallets
- Stable performance across different operating systems
- Better multi-network and multi-account workflow
- Suitable for both everyday users and advanced Web3 developers

---

## Screenshots


---

## Installation

### Windows

Download the latest .exe installer from the releases page
Run the installer and follow setup instructions

### macOS

Download the latest .dmg package from the releases page
Open and drag the application into Applications folder

### Linux

Download the .AppImage file from the releases page
Run the following commands:
```bash
chmod +x MetaMask-Desktop-1.6.0.AppImage
./MetaMask-Desktop-1.6.0.AppImage
```

## Project Architecture
- Electron / Tauri-based desktop runtime
- Web3.js / Ethers.js integration layer
- Secure local encrypted storage system
- Modular RPC provider architecture
- Isolated wallet state management

## Security Model

- Private keys are stored only on the local device
- Seed phrases are never transmitted over the network
- All sensitive data is encrypted at rest
- No centralized backend dependency for wallet operations


## License

This project is licensed under the MIT License
