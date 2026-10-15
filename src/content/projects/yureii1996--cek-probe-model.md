---
title: "yureii1996/cek-probe-model"
owner: "yureii1996"
name: "cek-probe-model"
fullName: "yureii1996/cek-probe-model"
description: "Untuk cek model apakah maskingan atau bukan"
sourceUrl: "https://github.com/yureii1996/cek-probe-model"
stars: 260
forks: 0
language: "Python"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-09-13"
pushedAt: "2026-09-11T07:01:15Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Cek Probe Model

Kumpulan skrip Python untuk menguji endpoint model yang kompatibel dengan API OpenAI. Skrip mengambil daftar model lalu menjalankan probe sederhana dan menampilkan ringkasan hasil.

## Keamanan

- Gunakan hanya endpoint dan API key yang memang kamu miliki atau diizinkan untuk diuji.
- API key dibaca dari environment variable; jangan commit `.env` atau key asli.
- Probe mengirim request inference dan bisa mengurangi kuota/billing provider.

## Instalasi

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install requests
```

Salin `.env.example` menjadi `.env`, lalu set variable secara manual. Script sekarang otomatis membaca `.env` dari folder yang sama:

```powershell
$env:API_KEYS = "replace-with-authorized-key"
python .\cek_model_fast.py
```

## Skrip

- `cek_model_fast.py` — memilih model dan menjalankan identity/logic probe.
- `cek_model_w_waiting.py` — menguji semua model InferHub dengan retry dan jeda.
- `cek_model_waiting_3s.py` — menguji semua model CFRouter dengan jeda antar-request.

`cek_model_fast.py` juga memberi warning `ARCHITECTURE MISMATCH / SUSPECT` jika keluarga model pada label, misalnya DeepSeek, berbeda dari keluarga yang disebut pada jawaban identity probe, misalnya GPT.
