---
title: "shishir0x/GoogleUnlimited"
owner: "shishir0x"
name: "GoogleUnlimited"
fullName: "shishir0x/GoogleUnlimited"
description: "Unlimited Google Photos auto-sync on Windows with Pixel original quality spoofing — native, portable, and zero-quota."
sourceUrl: "https://github.com/shishir0x/GoogleUnlimited"
stars: 79
forks: 11
language: "PowerShell"
topics: ["google-photos", "unlimited-storage"]
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-10-16"
pushedAt: "2026-10-16T00:57:06Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# GoogleUnlimited

> **Zero-Quota, Unlimited Google Photos Auto-Sync for Windows, macOS & Linux**  
> Native background watcher that automatically uploads photos and videos with **Google Pixel original quality unlimited backup** — without WSL, WSA, Android emulators, or Morphe crashes.


  


---

## Features

- **Unlimited Google Photos Backup**: Spoofs Google Pixel mobile upload API (`xob0t/gotohp`) so all uploaded photos and videos consume **0 bytes of Google Drive / Google One storage**.
- **Cross-Platform (Windows, macOS & Linux)**:
  - **Windows**: Native PowerShell engine with bundled portable `PSSQLite`.
  - **macOS**: Native Bash + `fswatch` engine supporting both Apple Silicon (M1-M4) and Intel Macs via universal binary.
  - **Linux**: Native POSIX Bash + `inotify-tools` engine for all major distributions (Ubuntu, Debian, Fedora, Arch).
- **Multi-OS Interoperability**: Windows, macOS, and Linux scripts share the exact same SQLite database schema (`gphotos.db`), with dual-key lookups (`path` + `filename|filesize`) to seamlessly prevent duplicate uploads on shared or external partitions.
- **Unified Clean Architecture (Zero Clutter)**:
  - **Windows**: `GoogleUnlimited.bat` provides an interactive menu or CLI commands (`watch`, `silent`, `status`, `logs`, `enable`, `disable`, `stop`).
  - **macOS & Linux**: `google-unlimited.sh` unified runner (`watch`, `status`, `logs`, `setup`, `enable`, `disable`, `stop`). Zero separate script clutter.
- **Real-Time Auto-Sync**: Monitors standard user folders instantly when files are downloaded or saved, with debounce protection for active downloads.
- **Embedded SQLite Tracking**: Tracks every upload in `gphotos.db` — zero duplicate re-uploads, crash-resilient with automatic retry queues.
- **Live Terminal Progress Bar**: Real-time dynamic progress bar, elapsed timer, and file size indicator.
- **Background Auto-Start**: 
  - **Windows**: 1-click startup installer or silent VBScript launcher (`StartPhotosWatcher.vbs`).
  - **macOS**: Native `launchd` LaunchAgent (`./google-unlimited.sh enable`).
  - **Linux**: Native user `systemd` service (`./google-unlimited.sh enable`).
- **Security Hardened**: Automatically locks credentials (`gotohp.config`) and database (`gphotos.db`) to `chmod 600` (owner-only), sanitizes all database queries, and handles macOS Gatekeeper quarantine flags.

---

## Directory Structure

```text
GoogleUnlimited/
│
├── Modules/
│   └── PSSQLite/             # Bundled portable SQLite engine for Windows PowerShell
│
├── gotohp-cli-x64.exe        # Windows 64-bit CLI uploader with Pixel spoofing
├── gotohp-x64.exe            # Windows desktop GUI for one-click Google OAuth sign-in
├── gotohp-cli_amd64          # Native Linux x86_64 ELF binary
│
│   # --- Windows ---
├── GoogleUnlimited.bat       # Unified Windows Manager (interactive menu + CLI commands)
├── StartPhotosWatcher.vbs    # Windows silent background launcher (zero window)
├── WatchAndUpload.ps1        # Core Windows PowerShell orchestrator
│
│   # --- macOS & Linux ---
├── google-unlimited.sh       # Unified Unix Manager (macOS & Linux runner, setup, status, startup)
│
├── .gitattributes            # Line ending preservation (LF on shell scripts & plists, CRLF on bat/ps1)
├── .gitignore                # Protects credentials, tokens, and personal databases
├── README.md                 # Documentation
└── reddit_showcase.jpg       # Showcase graphic
```

---

## Windows Setup & Usage

### 1. Download or Clone
```cmd
git clone https://github.com/shishir0x/GoogleUnlimited.git
```

### 2. Sign In to Google Photos (One-Time)
1. Double-click **`gotohp-x64.exe`** and click **Add Google account**.
2. Click **Open Google sign-in** and sign in with your Google account.
3. Sign in on the Google Embedded Setup page and click **I agree**.  
   *(Note: The page buffering indefinitely is completely normal and expected).*
4. Open browser Developer Tools (**F12**):
   - Go to **Application** tab (Chrome/Edge/Brave) or **Storage** tab (Firefox).
   - Under **Cookies**, click `https://accounts.google.com`.
   - Copy the value of the **`oauth_token`** cookie.
5. In `gotohp`, paste the token and click **Connect account**.
6. Once connected, your credentials are saved locally. Close the GUI.

### 3. Run on Windows
Double-click **`GoogleUnlimited.bat`** to open the interactive manager:
```text
==========================================================
  *  Google Unlimited Photos Auto-Sync (Windows)
==========================================================
  [1] Start Live Watcher (Interactive progress)
  [2] Start Background Watcher (Silent, zero window)
  [3] Check Backup Status
  [4] View Activity Logs
  [5] Enable Auto-Start on Windows Boot
  [6] Disable Auto-Start on Windows Boot
  [7] Stop Background Watcher
  [0] Exit
==========================================================
```

You can also run any action directly from the terminal or shortcuts:
```cmd
GoogleUnlimited.bat watch     # Live terminal watcher with progress bar
GoogleUnlimited.bat silent    # Silent background run (zero window)
GoogleUnlimited.bat status    # Check total uploads and retry queue
GoogleUnlimited.bat logs      # View last 30 sync activity logs
GoogleUnlimited.bat enable    # Enable auto-start on Windows boot
GoogleUnlimited.bat disable   # Disable auto-start on Windows boot
GoogleUnlimited.bat stop      # Stop any running background watcher
```

---

## macOS Setup & Usage

GoogleUnlimited runs natively on macOS (Apple Silicon M1/M2/M3/M4 & Intel) using `fswatch`, `sqlite3`, and the official universal Mach-O binary.

### 1. Clone the Repository
```bash
git clone https://github.com/shishir0x/GoogleUnlimited.git
cd GoogleUnlimited
```

### 2. One-Command Setup
Make executable and run setup (auto-installs `fswatch` via Homebrew and downloads the universal binary):
```bash
chmod +x google-unlimited.sh
./google-unlimited.sh setup
```
*(If Homebrew is not installed, install it with: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`)*

### 3. Sign In (One-Time)
1. Open the Google Embedded Setup sign-in page:  
   👉 **[https://accounts.google.com/embedded/setup/v2/android](https://accounts.google.com/embedded/setup/v2/android)**
2. Sign in with your Google account and click **I agree** *(buffering indefinitely is normal)*.
3. Press **Option + Command + I** (or right-click → **Inspect**) to open Developer Tools:
   - Go to **Application** tab → **Cookies** → `https://accounts.google.com`.
   - Copy the value of the **`oauth_token`** cookie.
4. In your terminal, run:
   ```bash
   ./google-unlimited.sh creds add ""
   ```

*(Alternatively: If you already signed in on Windows or Linux, simply copy `gotohp.config` into this directory).*

### 4. Run on macOS
Run `./google-unlimited.sh` to launch the interactive manager or pass commands directly:
```bash
./google-unlimited.sh watch      # Live interactive watcher with progress
./google-unlimited.sh enable     # Auto-start on macOS login via launchd
./google-unlimited.sh disable    # Disable macOS launchd auto-start
./google-unlimited.sh status     # View total uploads and pending retries
./google-unlimited.sh logs       # View recent activity logs
./google-unlimited.sh stop       # Stop background watcher instances
```

---

## Linux Setup & Usage

GoogleUnlimited runs natively on any Linux distribution (Ubuntu, Debian, Fedora, Arch Linux, openSUSE, etc.) using `inotify-tools`, `sqlite3`, and the native Linux `gotohp` binary.

### 1. Clone the Repository
```bash
git clone https://github.com/shishir0x/GoogleUnlimited.git
cd GoogleUnlimited
```

### 2. One-Command Setup
Run setup to auto-install dependencies (`inotify-tools`, `sqlite3`, `curl`):
```bash
chmod +x google-unlimited.sh
./google-unlimited.sh setup
```

### 3. Sign In (One-Time)

#### Option A: Retrieve `oauth_token` via Browser
1. In any web browser, open the Google Embedded Setup sign-in page:  
   👉 **[https://accounts.google.com/embedded/setup/v2/android](https://accounts.google.com/embedded/setup/v2/android)**
2. Sign in with your Google account and click **I agree**.  
   *(The screen may stay loading/buffering indefinitely; this is expected).*
3. Press **F12** (or right-click → **Inspect**) to open browser Developer Tools:
   - Click the **Application** tab (Chrome / Brave / Edge) or **Storage** tab (Firefox).
   - In the left sidebar, expand **Cookies** → click `https://accounts.google.com`.
   - Find the cookie named **`oauth_token`** and copy its full value.
4. In your Linux terminal, run:
   ```bash
   ./google-unlimited.sh creds add ""
   ```
5. Verify your active account:
   ```bash
   ./google-unlimited.sh creds list
   ```

#### Option B: Copy from Windows / macOS (Fastest for Dual-Boot / Shared Drives)
If you already signed in on another OS:
Simply copy the generated `gotohp.config` file into your Linux project directory:
```bash
cp /path/to/GoogleUnlimited/gotohp.config ~/GoogleUnlimited/
```
The Linux watcher will detect `gotohp.config` and authenticate automatically.

### 4. Run on Linux
Run `./google-unlimited.sh` in your terminal to open the interactive manager:
```text
==========================================================
  *  GoogleUnlimited - Unix Manager (Linux)
==========================================================
  [1] Start Live Watcher (Foreground)
  [2] Check Backup Status
  [3] View Activity Logs
  [4] Run Setup & Dependency Installer
  [5] Enable Auto-Start on Boot (Linux systemd)
  [6] Disable Auto-Start on Boot
  [7] Stop Background Watcher
  [0] Exit
==========================================================
```

Or pass any command directly:
```bash
./google-unlimited.sh watch      # Interactive terminal with live progress
./google-unlimited.sh enable     # Auto-start on boot via systemd user service
./google-unlimited.sh disable    # Disable systemd startup service
./google-unlimited.sh status     # View upload statistics and retry queue
./google-unlimited.sh logs       # View recent activity logs with colors
./google-unlimited.sh stop       # Terminate background watcher
```

---

## Monitored Folders (Dynamic Resolution)

The watcher monitors standard user directories across all operating systems:
- `Downloads`
- `Pictures`
- `Desktop`
- `Documents`
- `Music`
- `Movies` *(macOS)* / `Videos` *(Windows & Linux)*

On Windows, directories are dynamically resolved via Windows Shell API & Registry (handling custom drive paths and OneDrive redirection). On macOS and Linux, standard user directories are automatically resolved.

### Supported File Extensions
- **Images**: `.jpg`, `.jpeg`, `.png`, `.heic`, `.webp`, `.gif`, `.dng`
- **Videos**: `.mp4`, `.mov`, `.mkv`, `.avi`

---

## Privacy & Security

- **Strict Permission Hardening**:
  - `gotohp.config` (OAuth token) is strictly locked down to `chmod 600` (readable/writable only by the owner).
  - `gphotos.db` (upload history) is locked to `chmod 600`.
  - Binaries are locked to `chmod 700`.
  - macOS Gatekeeper quarantine attributes (`com.apple.quarantine`) are stripped during setup to ensure clean execution.
- **Input Sanitization**: All SQLite queries escape single quotes and validate numeric bounds to prevent SQL injection across all platforms.
- **Direct Connections Only**: Every API request and media upload connects directly from your machine to official Google Photos endpoints (`photoslibrary.googleapis.com`). No intermediate or third-party servers are involved.
- **Local Credentials**: Authentication tokens and config files stay strictly on your local machine.
- **Git Protection**: The `.gitignore` file excludes:
  - Database files (`gphotos.db`, `*.db`, `*.db-wal`, `*.db-shm`)
  - Personal config files and tokens (`gotohp.config`, `*.config`, `*.token`)
  - Log files and temporary cache
  Your personal file history and login tokens are **never** committed or pushed to Git.
- **Zero Telemetry**: No tracking, analytics, or external telemetry of any kind.

---

## Troubleshooting & Issues

If you encounter any bugs, unexpected behavior, or need help:
- Run `./google-unlimited.sh status` (macOS/Linux) or `GoogleUnlimited.bat status` (Windows) to check queue and database status.
- Run `./google-unlimited.sh logs` (macOS/Linux) or `GoogleUnlimited.bat logs` (Windows) to inspect error details.
- Please submit an issue on the GitHub repository:  
  👉 **Report an Issue on GitHub**

---

## License & Credits

- Core Pixel upload engine powered by `xob0t/gotohp`.
- Windows SQLite integration powered by `PSSQLite`.
