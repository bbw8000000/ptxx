---
title: "xdreizein666/getcontact-cli"
owner: "xdreizein666"
name: "getcontact-cli"
fullName: "xdreizein666/getcontact-cli"
description: "GetContact CLI adalah project Python untuk melakukan lookup nomor telepon lewat API GetContact, tanpa aplikasi Android dan tanpa browser."
sourceUrl: "https://github.com/xdreizein666/getcontact-cli"
stars: 459
forks: 110
language: "Python"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-08-23"
pushedAt: "2026-08-21T16:30:24Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# GetContact CLI

GetContact CLI adalah project Python untuk melakukan komunikasi dengan API GetContact melalui command-line interface (CLI), tanpa menggunakan aplikasi Android maupun browser.


Project ini dibuat sebagai **research dan learning project** untuk memahami bagaimana aplikasi mobile berkomunikasi dengan backend service serta bagaimana proses autentikasi dan request API bekerja.

## Features

Yang bisa dilakukan:

- melihat informasi sebuah nomor (nama yang ditampilkan oleh GetContact, jumlah tag, email jika tersedia)
- melihat daftar tag sebuah nomor berdasarkan data yang tersedia dari service
- mengecek sisa kuota pencarian akun
- melakukan lookup beberapa nomor sekaligus menggunakan file CSV
- menangani captcha ketika akun terkena rate limit (HTTP 403)
- membuat kredensial akun sendiri melalui proses verifikasi WhatsApp
- menyimpan beberapa akun dan berpindah antar akun

Setiap output perintah otomatis tersimpan ke folder `results/`.

---

## ⚠️ Disclaimer

Project ini adalah **independent research project** dan tidak berafiliasi, didukung, maupun berhubungan secara resmi dengan GetContact.

Tool ini dibuat untuk tujuan:
- pembelajaran teknis
- penelitian API communication
- eksplorasi bagaimana sebuah service bekerja

Pengguna bertanggung jawab penuh terhadap penggunaan tool ini.

Harap gunakan secara bertanggung jawab dan selalu menghormati:
- privasi pengguna lain
- peraturan yang berlaku
- Terms of Service dari layanan terkait

Project ini tidak ditujukan untuk:
- penyalahgunaan data pribadi
- pengumpulan data secara massal
- aktivitas yang merugikan pihak lain

---

## How It Works

Secara sederhana, flow kerja tool ini:

```
User Input
    |
    v
GetContact CLI
    |
    v
Authenticated API Request
    |
    v
GetContact Service
    |
    v
CLI Output
```

Semua proses dilakukan dari sisi client dan hasil response diproses secara lokal.

Project ini tidak menyediakan server pihak ketiga, database terpusat, maupun shared account.

---

## Credential & Account Safety

Tool ini membutuhkan kredensial akun milik pengguna sendiri.

Beberapa hal yang perlu diperhatikan:

- Jangan membagikan token/session credential kepada orang lain.
- Jangan commit file credential ke repository publik.
- Gunakan akun testing terpisah jika diperlukan.
- Jangan menyimpan credential di screenshot atau forum publik.

Credential adalah tanggung jawab masing-masing pengguna.

---

## Data & Privacy

Project ini tidak secara sengaja mengumpulkan atau menyimpan data pengguna pada server eksternal.

Namun, pengguna tetap perlu memperhatikan bahwa:

- folder `results/` dapat berisi informasi sensitif
- command history dapat menyimpan nomor yang pernah dicari
- hasil lookup harus diperlakukan secara bertanggung jawab

Jangan mendistribusikan informasi pribadi tanpa izin.

---

## Limitations

Perlu dipahami bahwa:

- API dapat berubah sewaktu-waktu.
- Akun dapat terkena pembatasan jika melakukan request berlebihan.
- Hasil yang diberikan bergantung pada availability service.
- Project ini bukan official client dari GetContact.

---

## Contributing

Pull request dan feedback sangat diterima.

Jika menemukan masalah security, harap jangan langsung mempublikasikan detail sensitif pada issue.

Silakan gunakan responsible disclosure agar masalah dapat ditinjau terlebih dahulu.

---

## Kebutuhan

Python 3.9 atau lebih baru, dan dua paket:

```bash
pip install requests cryptography
```

Sudah diuji di Windows (git-bash) dan Linux. Tidak ada langkah build, tidak ada file konfigurasi yang perlu diedit.

## Menjalankan

### Mode menu (untuk pemakaian sehari-hari)

```bash
python gtc.py
```

Tanpa argumen apa pun, program menampilkan daftar fitur bernomor:

```
Pilih fitur:
  1. Cari profil nomor        (nama pemilik)
  2. Cari tag nomor           (nama tersimpan orang lain)
  3. Sisa kuota akun
  4. Cari banyak nomor dari file CSV
  5. Buka blokir / captcha
  6. Lihat akun tersimpan
  7. Tambah akun baru (butuh WhatsApp)
  0. Keluar
```

Pilih nomornya, masukkan nomor HP target, hasil langsung tampil. Setelah selesai program kembali ke menu, jadi bisa melakukan beberapa pencarian berturut-turut tanpa mengetik ulang perintah. Kalau satu pencarian gagal — nomor salah format, kuota habis, jaringan putus — pesan errornya ditampilkan dan menu tetap hidup.

### Mode perintah (untuk scripting)

```bash
python gtc.py search 08123456789                  # profil
python gtc.py search 08123456789 -t tags          # daftar tag
python gtc.py search 08123456789 --json           # respons mentah
python gtc.py quota
python gtc.py batch nomor.csv --delay 2
python gtc.py cred list
```

Semua nomor dinormalkan ke format E.164 dengan asumsi Indonesia: `08…` menjadi `+628…`, `62…`
menjadi `+62…`, dan nomor yang sudah diawali `+` dibiarkan apa adanya.

## Perintah

| Perintah | Kegunaan |
| --- | --- |
| `search ` | Lookup satu nomor. `-t profile` (default) atau `-t tags`, `--json` untuk respons mentah. |
| `batch ` | Lookup semua nomor dalam CSV. `-o` untuk path keluaran, `--delay` jeda antar-permintaan (default 1.5 detik). |
| `quota` | Sisa kuota `search` dan `numberDetail`, plus tanggal reset. |
| `captcha` | Menampilkan captcha dan mengirim jawabannya. Dipakai saat akun diblokir sementara. |
| `generate ` | Mendaftarkan perangkat baru dan memverifikasinya lewat WhatsApp. Menyimpan hasilnya sebagai kredensial. |
| `cred list \| add \| use \| remove` | Mengelola kredensial tersimpan. |

Flag `-a/--account` berlaku untuk semua perintah dan memilih kredensial selain yang aktif.

### Format CSV untuk `batch`

Satu nomor per baris. Jika baris pertama mengandung header bernama `phone`, `phone_number`,
`phonenumber`, atau `nomor`, kolom itu yang dipakai; selain itu kolom pertama yang dibaca.

```csv
phone,nama
08123456789,Budi
081298765432,Siti
```

Hasilnya CSV dengan kolom `phone,status,displayName,tagCount,tags,error`. Satu nomor yang gagal tidak
menghentikan proses — barisnya ditandai `error` dan sisanya tetap jalan.

## Kredensial

Kredensial disimpan di `~/.config/gtc/credentials.json` dengan permission `600` di sistem POSIX.
Isinya token, `finalKey` hasil pertukaran Diffie-Hellman, dan `clientDeviceId` — tiga hal yang cukup
untuk memakai akun GetContact, jadi perlakukan file ini seperti password.

Menambahkan kredensial yang sudah dimiliki:

```bash
python gtc.py cred add akun1 --final-key  --token  --phone +628...
python gtc.py cred use akun1
```

Membuat yang baru dari nol:

```bash
python gtc.py generate 08123456789
```

Perintah ini mendaftarkan perangkat palsu, menegosiasikan kunci enkripsi lewat Diffie-Hellman, lalu meminta verifikasi kepemilikan nomor melalui VerifyKit. Di tengah proses akan muncul sebuah link WhatsApp beserta kode; kirim pesan tersebut dari nomor yang bersangkutan, tunggu centang dua, baru tekan Enter. Kredensial hasilnya langsung tersimpan.

Lokasi penyimpanan bisa dipindah lewat `GTC_CONFIG_DIR`.

## Folder results

Setiap kali sebuah perintah dijalankan, apa yang tampil di layar juga ditulis ke `results/` dengan nama berpola waktu:

```
results/20260820-101307-search-08123456789.txt
results/20260820-100248-quota.txt
results/20260820-101512-batch.csv
```

Ekstensinya `.json` bila memakai `--json`. Perintah `batch` tanpa `-o` otomatis menulis CSV-nya ke sini juga. Path file yang tersimpan dicetak ke stderr, sehingga stdout tetap bersih dan aman di-pipe. Folder ini ada di `.gitignore` karena isinya data nomor telepon orang.

Ganti lokasinya dengan `GTC_RESULTS_DIR`. Belum ada rotasi atau penghapusan otomatis jika
foldernya membesar, bersihkan manual.

## Variabel lingkungan

| Variabel | Fungsi |
| --- | --- |
| `GTC_CONFIG_DIR` | Lokasi `credentials.json`. Default `~/.config/gtc`. |
| `GTC_RESULTS_DIR` | Lokasi keluaran. Default `results/` di samping `gtc.py`. |
| `GTC_NO_BANNER` | Diisi apa saja untuk menyembunyikan banner dan log startup. |

## Cara kerjanya

Klien ini meniru aplikasi Android GetContact 8.4.0. Setiap permintaan:

1. Payload JSON dienkripsi AES-256-ECB memakai `finalKey` milik akun, lalu dikirim sebagai
   `{"data": ""}`.
2. Header `x-req-signature` berisi HMAC-SHA256 dari `-` dengan kunci
aplikasi yang tetap.
3. Respons yang punya field `data` didekripsi dengan kunci yang sama sebelum di-parse.

`finalKey` sendiri lahir dari pertukaran Diffie-Hellman saat registrasi: klien mengirim kunci
publiknya, server membalas dengan miliknya, dan SHA-256 dari shared secret menjadi kunci AES-nya.
Parameter DH (`p = 900719898367`, `g = 7`) sudah tertanam di kode dan terverifikasi.

Dua endpoint dipakai untuk lookup, dan penamaannya menyesatkan: `/v2.8/search` mengembalikan **profil**, sementara `/v2.8/number-detail` mengembalikan **daftar tag**. Pemetaan ini pernah tertukar dan sekarang sudah diluruskan di `api_search()`.

Registrasi memakai VerifyKit (`api.verifykit.com`) sebagai penyedia verifikasi, dengan skema HMAC dan AES yang serupa tapi memakai kunci berbeda.

## Batasan

- Default negara adalah Indonesia (`COUNTRY = "id"`). Nomor luar negeri harus ditulis lengkap dengan
  `+kode negara`, dan sebagian respons mungkin tidak sesuai.
- Kuota pencarian mengikuti langganan akun. Habis kuota berarti error, bukan hasil kosong.
- Permintaan yang terlalu cepat memicu captcha. Naikkan `--delay` pada `batch`, dan pakai perintah
  `captcha` bila terlanjur kena.
- Kunci HMAC dan versi aplikasi bersifat statis. Kalau GetContact mengganti keduanya, konstanta di bagian atas `gtc.py` harus diperbarui.

## Notes

Alat ini mengakses API privat GetContact dengan menyamar sebagai klien resminya, yang hampir melanggar syarat layanan mereka. Data yang dikembalikan juga data pribadi orang lain. Pakai untuk nomor yang memang berhak Anda periksa, patuhi aturan perlindungan data yang berlaku, dan tanggung sendiri resikonya. Tidak ada afiliasi dengan GetContact dan pihak manapun. #DWYOR
