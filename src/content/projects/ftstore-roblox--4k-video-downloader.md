---
title: "ftstore-roblox/4K-Video-Downloader"
owner: "ftstore-roblox"
name: "4K-Video-Downloader"
fullName: "ftstore-roblox/4K-Video-Downloader"
description: "4K Video Downloader — free open-source desktop tool for downloading videos from YouTube, Vimeo, Dailymotion, Facebook, Instagram, Twitter/X, and 100+ platforms. Supports resolutions up to 4K UHD (2160p) and 8K. Download entire YouTube playlists and channels, extract subtitles (SRT/VTT), convert to MP3/FLAC audio, and grab 360° and VR video. "
sourceUrl: "https://github.com/ftstore-roblox/4K-Video-Downloader"
stars: 0
forks: 0
language: "未知"
topics: ["4k", "4k-video-downloader", "8k", "batch-download", "dailymotion", "desktop-app", "dotnet", "facebook-video"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-07-14T23:28:16Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

---

## 🎬 About

**4K Video Downloader** is a powerful desktop application for downloading videos, playlists, channels, and subtitles from YouTube and 100+ other video hosting platforms. Supports resolutions from 360p all the way to **8K (4320p)** with HDR when available.

Convert videos to MP3 or FLAC on the fly, grab embedded subtitles in SRT/VTT format, and download entire YouTube channels with one click. Multithreaded download engine splits files into segments for maximum speed.

---

## 🌐 Supported Platforms

| Platform | Video | Audio | Playlist | Subtitles |
|----------|:-----:|:-----:|:--------:|:---------:|
| **YouTube** | ✅ | ✅ | ✅ | ✅ |
| **Vimeo** | ✅ | ✅ | ✅ | ✅ |
| **Dailymotion** | ✅ | ✅ | ✅ | ❌ |
| **Facebook** | ✅ | ✅ | ❌ | ❌ |
| **Instagram** | ✅ | ✅ | ❌ | ❌ |
| **Twitter/X** | ✅ | ✅ | ❌ | ❌ |
| **Twitch** (clips/VODs) | ✅ | ✅ | ❌ | ❌ |
| **Reddit** | ✅ | ✅ | ❌ | ❌ |
| **100+ others** | ✅ | ✅ | — | — |

---

## ✨ Features

- **Resolution up to 8K** — download in 360p, 720p, 1080p, 1440p, 2160p 4K, or 4320p 8K
- **HDR Support** — HDR10 and Dolby Vision when available
- **Playlist Download** — grab entire YouTube playlists with one URL
- **Channel Download** — subscribe to a channel and auto-download new uploads
- **Audio Extraction** — convert to MP3 (up to 320kbps) or lossless FLAC
- **Subtitle Download** — embedded and auto-generated subtitles as SRT or VTT
- **360° / VR Video** — download spherical and VR180 content
- **Proxy Support** — HTTP/SOCKS5 proxy for geo-restricted content
- **Multithreaded** — up to 8 parallel connections per download
- **Smart Mode** — save format preferences and apply to all future downloads
- **In-App Browser** — browse and download without leaving the app
- **Scheduled Downloads** — set time-based download schedules

---

## 📥 Download


  
    
  


  
    
  


---

## 🚀 How to Use

1. Download and install from the link above
2. Copy a video URL from your browser
3. Click **Paste Link** in the app
4. Choose quality, format, and output folder
5. Click **Download**

---

## 📁 Project Structure

```
├── src/
│   ├── Engine/
│   │   └── MultiThreadDownloader.cs
│   ├── Extractors/
│   │   ├── YouTubeExtractor.cs
│   │   └── GenericExtractor.cs
│   ├── Converters/
│   │   └── AudioConverter.cs
│   ├── Subtitles/
│   │   └── SubtitleParser.cs
│   └── UI/
│       └── DashboardView.cs
├── bin/
│   └── Release/
├── README.md
└── banner.svg
```

---


  YouTube is a trademark of Google LLC. All other trademarks belong to their respective owners. This project is independent and not affiliated with any listed platform.
