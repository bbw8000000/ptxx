---
title: "drJhonatan00/FaceGuard"
owner: "drJhonatan00"
name: "FaceGuard"
fullName: "drJhonatan00/FaceGuard"
description: "Enterprise-ready, privacy-first real-time face recognition authentication using client-side AI and a zero-dependency PHP flat-file storage engine."
sourceUrl: "https://github.com/drJhonatan00/FaceGuard"
stars: 32
forks: 0
language: "PHP"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-16"
pushedAt: "2026-09-15T18:00:09Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# FaceGuard

A lightweight, real-time biometric authentication system powered by client-side AI (`face-api.js`) and a minimal PHP backend storing vector embeddings in a flat `.txt` file database.


## Features

- **Real-Time Detection:** Live face tracking using `@vladmandic/face-api`.
- **Privacy & Privacy-First:** Face embeddings are processed locally in the browser; facial images are never sent to the server.
- **3-Second Hold Verification:** Requires continuous visual retention before granting access.
- **Automatic Anonymisation:** Real-time pixelation overlay for non-authorised faces.
- **KISS Backend:** Zero heavy database dependencies (MySQL/PostgreSQL) — uses safe concurrent flat-file I/O (`LOCK_EX`) in PHP.

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** PHP
- **Storage:** JSON Lines in `user.txt`

## How to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/drJhonatan00/FaceGuard.git
2. Serve the directory using a PHP local server:
   ```bash
   php -S localhost:8000
3. Open http://localhost:8000 in your browser and grant webcam permissions.

## License
MIT License
