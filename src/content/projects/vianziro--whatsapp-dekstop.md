---
title: "vianziro/Whatsapp-Dekstop"
owner: "vianziro"
name: "Whatsapp-Dekstop"
fullName: "vianziro/Whatsapp-Dekstop"
description: "Aplikasi Alternative WhatsApp Dekstop yang ultra-ringan, cepat, dan hemat memori untuk macOS, Windows, dan Linux, dibangun menggunakan bahasa pemrograman Go"
sourceUrl: "https://github.com/vianziro/Whatsapp-Dekstop"
stars: 40
forks: 2
language: "Go"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-08"
pushedAt: "2026-09-08T03:18:59Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# WhatsApp Desk

Aplikasi Desktop WhatsApp yang ultra-ringan, cepat, dan hemat memori untuk **macOS**, **Windows**, dan **Linux**, dibangun menggunakan bahasa pemrograman Go.

Aplikasi ini memanfaatkan webview engine bawaan sistem operasi (Apple WebKit di macOS, Microsoft Edge WebView2 di Windows, dan WebKitGTK di Linux). Tanpa beban runtime Electron yang berat, aplikasi ini menghemat gigabyte penyimpanan dan ratusan megabyte RAM.

---

## 📥 Unduh / Download

Installer dan biner siap pakai dapat diunduh langsung lewat tautan rilis di bawah ini:

| Sistem Operasi | Berkas Installer / Biner | Tipe Arsitektur | Format | Ukuran |
| :--- | :--- | :--- | :--- | :--- |
| **macOS** | 📥 **Download WhatsApp-Desk-macOS-Universal.dmg** | Universal (Apple Silicon M-Series & Intel) | Apple Disk Image (.dmg) | ~2.5 MB |
| **Windows** | 📥 **Download WhatsApp.exe** | 64-bit (x64) | Portabel / Standalone | ~5 MB |
| **Linux** | 📥 **Download WhatsApp-Desk-Linux-amd64.deb** | 64-bit (x86_64) | Debian Package (.deb) | ~3 MB |
| **Linux (Tarball)** | 📥 **Download WhatsApp-Desk-Linux-x64.tar.gz** | 64-bit (x86_64) | Portable Tarball (.tar.gz) | ~3 MB |

> Seluruh versi rilis, arsip `.zip`, dan catatan pembaruan dapat dilihat di halaman GitHub Releases.

---

## 🚀 Perbandingan Kebutuhan Sumber Daya

| Parameter | WhatsApp Desk | WhatsApp Resmi (Electron) |
| :--- | :--- | :--- |
| **Ukuran Berkas** | **~2.5 MB (macOS) / ~5 MB (Win)** | 470 MB – 900 MB+ |
| **Konsumsi RAM Fisik (RSS)** | **~35 MB (Core) / ~250–350 MB (Chat Aktif)** | 800 MB – 1.5 GB+ |
| **Engine Render** | Native OS (WebKit / WebView2 / WebKitGTK) | Bundled Chromium + Node.js |
| **Waktu Muat (Cold Start)** | **< 0.5 detik (Instan)** | 3 – 6 detik |
| **Beban CPU & Baterai** | Sangat Rendah (Hardware Accelerated) | Cenderung lebih boros daya |
| **Sesi Login** | Tersimpan di profil lokal terisolasi | Tersimpan di profil lokal |
| **Enkripsi Chat** | End-to-End resmi WhatsApp (Signal Protocol) | End-to-End resmi WhatsApp (Signal Protocol) |

---

## Fitur

### Fitur Lintas Platform (Windows & macOS)
- **Sesi Login Persisten**: Data sesi (cookies, local storage, indexedDB) tersimpan di direktori profil khusus, sehingga tidak perlu melakukan scan QR code berulang kali setiap membuka aplikasi.
- **Mode Privasi (Anti-Intip)**: Tekan `Ctrl + Shift + P` (Windows) atau `Cmd + Shift + P` (macOS) untuk menyamarkan (*blur*) pesan, gambar, dan nama kontak. Arahkan kursor mouse ke pesan untuk membacanya sementara.
- **Always on Top (Pin Window)**: Tekan `Ctrl + Shift + T` / `Cmd + Shift + T` untuk menyematkan jendela WhatsApp agar selalu berada di barisan terdepan layar saat multitasking.
- **Mute Audio Cepat**: Tekan `Ctrl + Shift + M` / `Cmd + Shift + M` untuk mematikan atau membunyikan kembali audio notifikasi seketika.
- **Auto-Start saat Booting**: Tekan `Ctrl + Shift + S` / `Cmd + Shift + S` untuk mengatur agar aplikasi otomatis terbuka saat sistem operasi dinyalakan.
- **Reload & Hard Refresh**: Tekan `F5` / `Ctrl/Cmd + R` untuk memuat ulang obrolan, atau `Ctrl/Cmd + Shift + R` untuk hard refresh dan membersihkan cache antarmuka.
- **In-App Auto-Updater**: Memeriksa rilis terbaru GitHub secara otomatis di latar belakang dan menyediakan pintasan manual `Ctrl/Cmd + Shift + U`. Pengguna dapat memperbarui aplikasi langsung dari jendela obrolan hanya dengan satu klik tanpa perlu mengunduh ulang file installer.
- **Penyimpanan Unduhan Permanen & Kustom**: Berkas chat, dokumen, dan gambar disimpan secara permanen di luar aplikasi (default di folder `Downloads/WhatsApp Downloads`). Lokasi dapat diatur bebas lewat jendela Pengaturan (`Ctrl/Cmd + ,`) dengan dialog folder native dan pencegahan penimpaan file duplikat.
- **Floating HUD Feedback**: Setiap pergantian mode pintasan menampilkan indikator notifikasi minimalis langsung di dalam antarmuka.
- **Dukungan Media Penuh**: Mendukung perekaman voice note, pemutaran audio/video, serta akses mikrofon dan kamera untuk panggilan suara maupun video.
- **Pencegatan Link Eksternal**: Tautan situs web di dalam chat otomatis dibuka di browser default sistem (Chrome, Edge, Safari, dll.) tanpa mengganggu jendela WhatsApp.
- **Kontrol Zoom Tampilan**: Sesuaikan ukuran teks dan antarmuka dengan shortcut `Ctrl/Cmd +`, `Ctrl/Cmd -`, dan `Ctrl/Cmd 0`.
- **Proteksi Single-Instance**: Mencegah terbukanya dua jendela aplikasi yang sama secara bersamaan.

### Integrasi Sistem Windows
- **Microsoft Edge WebView2**: Menggunakan runtime WebView2 bawaan Windows 10/11 untuk kompatibilitas penuh dengan fitur web modern.
- **Dark Mode Title Bar**: Frame jendela gelap yang menyatu dengan tema antarmuka WhatsApp menggunakan integrasi Win32 Desktop Window Manager (DWM).
- **Windows Toast Notifications**: Menampilkan notifikasi native Windows saat ada pesan baru masuk.
- **Penyimpanan Profil**: Data sesi disimpan rapi di folder `%APPDATA%\WhatsAppDesktopLight\UserData`.
- **Portabel**: Berupa satu file executable mandiri (`WhatsApp.exe`) tanpa perlu proses instalasi yang rumit.

### Integrasi Sistem macOS
- **Apple WebKit (Cocoa)**: Menggunakan WKWebView native yang dioptimalkan untuk chip Apple Silicon (M1/M2/M3/M4) maupun prosesor Intel.
- **Universal Binary**: Satu berkas aplikasi langsung mendukung arsitektur Apple Silicon (arm64) dan Intel (x86_64) tanpa memerlukan emulasi Rosetta.
- **Badge Unread di Dock**: Menampilkan jumlah pesan yang belum dibaca langsung pada icon aplikasi di Dock macOS.
- **Perilaku Close-to-Hide**: Menutup jendela dengan `Cmd + W` atau tombol silang merah hanya menyembunyikan jendela ke latar belakang; notifikasi tetap aktif dan jendela dapat dibuka kembali secara instan lewat Dock. Keluar penuh dilakukan dengan `Cmd + Q`.
- **Menu Bar Cocoa Lengkap**: Mendukung shortcut standar macOS seperti `Cmd + C` (Copy), `Cmd + V` (Paste), `Cmd + X` (Cut), `Cmd + A` (Select All), dan `Cmd + Z` (Undo).
- **Memori Ukuran Jendela**: Posisi dan ukuran jendela terakhir disimpan dan dipulihkan otomatis saat dibuka kembali.

---

## 📖 Panduan Instalasi & Cara Mengatasi Peringatan Keamanan

Karena aplikasi ini didistribusikan secara independen dan open-source (tanpa sertifikat berbayar Apple Developer ID $99/tahun atau Microsoft EV Code Signing yang mahal), sistem operasi mungkin menampilkan peringatan keamanan saat pertama kali dibuka. 

Berikut panduan instalasi dan solusi mudahnya di masing-masing sistem operasi:

---

### 🍏 Pengguna macOS

#### Langkah Instalasi:
1. Unduh berkas **WhatsApp-Desk-macOS-Universal.dmg**.
2. Klik ganda berkas `.dmg` tersebut untuk membukanya.
3. Seret (*drag and drop*) ikon **WhatsApp Desk** ke folder **Applications**.
4. Buka WhatsApp Desk dari Launchpad, folder Applications, atau Spotlight (`Cmd + Spasi`).

#### ⚠️ Solusi Error: *"WhatsApp" is damaged and can't be opened. You should move it to the Trash* atau *Unidentified Developer*

Jika Anda mengunduh lewat Safari atau Chrome, macOS Gatekeeper otomatis menempelkan atribut karantina (*quarantine attribute*). Ini **bukan** berarti berkasnya rusak, melainkan proteksi bawaan macOS untuk aplikasi dari luar App Store.

Pilih salah satu cara mudah di bawah ini untuk membukanya:

- **Cara 1: Lewat Klik Kanan (Paling Praktis, Tanpa Terminal)**:
  1. Buka folder **Applications** di Finder.
  2. **Klik Kanan (atau tahan tombol `Control` lalu klik)** pada ikon **WhatsApp Desk**.
  3. Pilih menu **Open**.
  4. Akan muncul dialog konfirmasi dengan tombol **Open** (bukan Move to Trash). Klik tombol **Open**.
  5. Aplikasi akan langsung terbuka, dan untuk seterusnya Anda bisa membukanya dengan klik kiri biasa.

- **Cara 2: Lewat Terminal (Hapus Quarantine Flag Sekali Saja)**:
  Buka aplikasi **Terminal**, salin dan jalankan perintah berikut:
  ```bash
  xattr -cr "/Applications/WhatsApp Desk.app"
  ```
  *(Atau jika berkas installer masih berada di folder Downloads: `xattr -cr ~/Downloads/"WhatsApp Desk.app"`)*

*Catatan: Mendukung macOS 11.0 (Big Sur) ke atas. Biner bersifat Universal, sehingga berjalan optimal secara native baik di Apple Silicon (M1/M2/M3/M4) maupun Mac berbasis Intel.*

---

### 🪟 Pengguna Windows

#### Langkah Instalasi:
1. Unduh berkas **WhatsApp.exe**.
2. Simpan berkas di folder yang Anda inginkan (misalnya `D:\Apps`, `Program Files`, atau Desktop).
3. Buat pintasan (*shortcut*) ke Desktop atau Start Menu jika diperlukan.
4. Klik ganda `WhatsApp.exe` untuk langsung menjalankannya (portabel tanpa perlu proses instalasi).

#### ⚠️ Mengatasi Peringatan Windows SmartScreen (*"Windows protected your PC"*):
1. Saat jendela biru SmartScreen muncul, klik tautan teks **"More info"** (*Info selengkapnya*).
2. Klik tombol **"Run anyway"** (*Tetap jalankan*).
3. Aplikasi akan langsung terbuka normal.

*Catatan: Memerlukan Microsoft Edge WebView2 Runtime (secara default sudah terpasang di Windows 10 update terbaru dan seluruh versi Windows 11).*

---

### 🐧 Pengguna Linux

#### Pilihan A: Menggunakan Paket Debian / Ubuntu (.deb)
```bash
sudo dpkg -i WhatsApp-Desk-Linux-amd64.deb
sudo apt-get install -f # pasang dependensi jika belum lengkap
```
Aplikasi akan otomatis terpasang dan muncul di Application Menu / App Launcher desktop Anda.

#### Pilihan B: Menggunakan Tarball Portabel (.tar.gz)
```bash
tar -xzf WhatsApp-Desk-Linux-x64.tar.gz
cd dist_linux
chmod +x whatsapp-desk
./whatsapp-desk
```

---

## Pintasan Keyboard

| macOS | Windows | Fungsi |
| :--- | :--- | :--- |
| `Cmd + Shift + P` | `Ctrl + Shift + P` | Toggle Mode Privasi (blur pesan & media di tempat umum) |
| `Cmd + Shift + T` | `Ctrl + Shift + T` | Toggle Always on Top (pin jendela agar selalu di barisan depan) |
| `Cmd + Shift + M` | `Ctrl + Shift + M` | Toggle Mute audio notifikasi obrolan |
| `Cmd + Shift + S` | `Ctrl + Shift + S` | Toggle buka otomatis saat komputer menyala (Auto-Start) |
| `Cmd + R` / `F5` | `Ctrl + R` / `F5` | Reload percakapan WhatsApp |
| `Cmd + Shift + R` | `Ctrl + Shift + R` | Hard refresh (memuat ulang & membersihkan cache) |
| `Cmd + Shift + U` | `Ctrl + Shift + U` | Memeriksa dan memasang pembaruan aplikasi (In-App Updater) |
| `Cmd + ,` | `Ctrl + ,` | Membuka jendela Pengaturan (Lokasi Unduhan & Info Pintasan) |
| `Cmd + Shift + D` | `Ctrl + Shift + D` | Membuka folder penyimpanan unduhan di Finder / File Explorer |
| `Cmd + Shift + H` | `Ctrl + Shift + H` | Menampilkan kembali panduan fitur & pintasan |
| `Cmd + +` / `Cmd + =` | `Ctrl + +` / `Ctrl + =` | Memperbesar ukuran tampilan (Zoom In) |
| `Cmd + -` | `Ctrl + -` | Memperkecil ukuran tampilan (Zoom Out) |
| `Cmd + 0` | `Ctrl + 0` | Mengembalikan ukuran tampilan ke default (100%) |
| `Cmd + C` / `Cmd + V` | `Ctrl + C` / `Ctrl + V` | Menyalin / menempel teks atau media |
| `Cmd + W` | `Alt + F4` | Menyembunyikan jendela ke background (aplikasi tetap aktif) |
| `Cmd + Q` | `Alt + F4` | Menutup aplikasi secara penuh |

---

## 🔒 Keamanan & Privasi Data

- **Tanpa Server Perantara (Direct to Meta)**: Aplikasi ini memuat langsung antarmuka resmi WhatsApp Web (`https://web.whatsapp.com`) dari server Meta. Tidak ada server relai, proksi, analitik pihak ketiga, atau backend perantara yang terlibat.
- **Enkripsi Penuh (End-to-End)**: Percakapan dienkripsi secara end-to-end menggunakan protokol Signal resmi bawaan WhatsApp pada sisi browser.
- **Penyimpanan Terisolasi**: Kredensial akun dan data cache disimpan di direktori data lokal pengguna:
  - **macOS**: `~/Library/Application Support/WhatsAppDesk/UserData/`
  - **Windows**: `%APPDATA%\WhatsAppDesk\UserData\`
  - **Linux**: `~/.config/whatsapp-desk/`
- **Kode Sumber Terbuka (Open Source)**: Seluruh logika aplikasi ditulis secara transparan di repositori ini dan dapat diaudit secara bebas oleh siapa pun.

---

## 📦 Distribusi Biner Resmi

Untuk performa optimal, integritas file, dan kemudahan penggunaan, pengguna disarankan langsung mengunduh biner rilis resmi yang sudah dikompilasi dan dikemas pada tabel Unduh / Download di atas. Versi rilis telah diuji stabilitasnya untuk lingkungan macOS (Apple Silicon & Intel), Windows 10/11, dan Linux.

---

## Lisensi

Proyek ini dilisensikan di bawah MIT License.

---

## Penafian (Disclaimer)

Proyek ini merupakan perangkat lunak independen dan tidak berafiliasi, disponsori, atau didukung secara resmi oleh WhatsApp atau Meta Platforms, Inc. WhatsApp adalah merek dagang terdaftar milik Meta Platforms, Inc.
