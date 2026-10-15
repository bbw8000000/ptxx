---
title: "krixoko/diskstats"
owner: "krixoko"
name: "diskstats"
fullName: "krixoko/diskstats"
description: "Free Windows disk analyzer with interactive treemaps, duplicate detection, SMART/NVMe health and disk speed tests. Built with .NET and Avalonia. MIT licensed."
sourceUrl: "https://github.com/krixoko/diskstats"
stars: 51
forks: 0
language: "C#"
topics: []
license: "MIT"
homepage: "https://apps.microsoft.com/detail/9NP02X8BNMCT"
defaultBranch: "main"
snapshotDate: "2026-09-14"
pushedAt: "2026-09-13T20:55:16Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# DiskStats

### See where your disk space goes.

Find large files, explore your storage, check drive health, and measure disk speed.
Built for Windows. Free and open source.

*图片：MIT License*
*图片：Windows 10 / 11*
*图片：.NET 10*
*图片：Build and test*

**[Get it free from the Microsoft Store](https://apps.microsoft.com/detail/9NP02X8BNMCT)**

Features · Screenshots · Build · User guide · Contribute


*图片：DiskStats treemap showing the space used by a sample collection of videos, photos, downloads, music, documents, and projects*

**Your files, at a glance.** Scan a drive or folder, explore the results, and review
what you want to remove before confirming any deletion.

## Features

| | What you can do |
|---|---|
| **Explore your storage** | Switch between nine views: Treemap, Folders, Files, Sunburst, Flame, Bubbles, Mind Map, Top Sizes, and Age Map. |
| **Find what matters** | Sort the complete file table, filter by name, size, or age, and exclude folders from scanning. |
| **Understand real disk usage** | Compare logical file size with allocated space, including compressed files, sparse files, and hardlinks. |
| **Spot changes and duplicates** | Compare scans, monitor folders, and find identical files with content-based duplicate detection. |
| **Check drive health** | Read Windows health status and supported SMART/NVMe values: temperature, endurance used, operating hours, and error counters. |
| **Measure disk speed** | Run sequential, random, and mixed read/write tests with a **1 GiB test file**, including throughput, IOPS, and average access time. |
| **Clean up with control** | Review a clean-up list, confirm deletions, open items in Explorer, and export results as CSV. |

Version 1.2.0 includes file previews with **Space**, confirmed moves with Windows
progress and conflict handling, folder history from retained scans, and saved filter
presets. See the user guide for supported formats and behavior.

English and German · Light and dark themes · Local scan processing · No app account required

## Screenshots

Screenshots are captured from the actual app. File listings use a synthetic demo
folder; drive capacity, health readings, and benchmark results are illustrative.
They contain no personal files and are not performance claims.


  
    Find large filesSort files and folders by size and allocated space.
    Explore folder hierarchiesFollow the sunburst rings into your storage.
  
  
    
    
  
  
    Measure disk speedSequential, random, and mixed I/O with a 1 GiB file.
    Read drive healthWindows status and supported SMART/NVMe metrics.
  
  
    
    
  


See the largest files in dark mode

*图片：DiskStats Top Sizes view in dark mode, ranking the largest files in the demo folder*


## Get started

1. Install DiskStats from the **[Microsoft Store](https://apps.microsoft.com/detail/9NP02X8BNMCT)**.
2. Choose a drive or folder with **Browse** and let the scan finish.
3. Explore the treemap or switch to **Files** to sort and filter the results.
4. Use the **speedometer** or **heart/pulse** button in the upper-right corner for
   disk speed and drive health.
5. To remove files, add them to the clean-up list and review it before confirming.

The Store app includes its .NET runtime. Regular scans do not need administrator
rights. Some storage metrics depend on the device, driver, adapter, and permissions;
unsupported health readings are shown as **Not available**.

See the 1.2.0 release notes. Store rollout may lag behind GitHub releases.

## How it treats your data

- **Local processing:** DiskStats does not send scan data to an application server.
  Cloud and network folders may transfer data through their own providers.
- **Explicit clean-up:** Nothing is deleted automatically. Windows may ask for
  additional confirmation when an item cannot be moved to the Recycle Bin.
- **Read-only health checks:** No disk writes, device self-tests, or automatic
  elevation. A healthy status cannot guarantee that a drive will not fail.
- **Bounded speed tests:** Each run creates its own 1 GiB file, writes less than
  4.2 GiB in total, and removes the test file on completion or cancellation.

Read the user guide for benchmark methodology, NTFS/MFT permissions,
allocation and hardlink behavior, shortcuts, and local data retention.

## Build from source

Install the **.NET 10 SDK** on Windows, then run:

```powershell
git clone https://github.com/krixoko/diskstats.git
cd diskstats
dotnet build -c Release
dotnet test -c Release --no-build
dotnet run --project src/DiskStats.App -c Release
```


Create a Windows distribution or MSIX package

Create a self-contained Windows x64 build:

```powershell
dotnet publish src/DiskStats.App -c Release -r win-x64 --self-contained true -o publish
```

MSIX packaging additionally requires the **Windows SDK**:

```powershell
.\packaging\build.ps1 -Store
```

The manifest contains the official RINGPAPERS Store identity. Independent Store
submissions need their own product identity and matching signing configuration.
App and manifest versions must match. See Contributing for details.


## Project structure

| Path | Contents |
|---|---|
| `src/DiskStats.App` | Avalonia interface, charts, dialogs, and localization |
| `src/DiskStats.Core` | Scanning, analysis, clean-up, benchmarking, and drive health |
| `src/DiskStats.Bench` | Tools for local scan and memory measurements |
| `tests` | Core and Avalonia Headless tests |
| `packaging` | MSIX build, Store manifest, icons, and dependency notices |
| `docs` | User guide, architecture, screenshots, and release notes |

## Contribute

Bug reports, fixes, and improvements are welcome. Read the
contribution guide and architecture overview,
or open an issue.

For security reports, contact **kroxoko@gmail.com** privately. Remove personal
filenames, paths, and other private information from public logs and screenshots.

## License

DiskStats is licensed under the **MIT License**. You may use, modify,
and redistribute it, including commercially, while preserving the license and
copyright notices. This also applies to DiskStats' own code in the free Store app.

Third-party components retain their own licenses. Keep
THIRD-PARTY-NOTICES.md and the bundled
`licenses` directory with redistributed builds.
