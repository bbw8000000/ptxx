---
title: "ABTanjir/nba-2k27-cyberface-id-database"
owner: "ABTanjir"
name: "nba-2k27-cyberface-id-database"
fullName: "ABTanjir/nba-2k27-cyberface-id-database"
description: "NBA 2K27 cyberface ID database concept for Windows modding, covering player and roster lookup, source records, version matching and face-ID reference workflows."
sourceUrl: "https://github.com/ABTanjir/nba-2k27-cyberface-id-database"
stars: 43
forks: 0
language: "未知"
topics: []
license: "Apache-2.0"
defaultBranch: "main"
snapshotDate: "2026-09-14"
pushedAt: "2026-09-13T13:53:02Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# NBA 2K27 Cyberface ID Database

Look up player face IDs by roster and game version, record the source of each match, and avoid mixing NBA 2K27 with older ID lists.


English · Español · Português · Deutsch · Français · 简&#8288;体&#8288;中&#8288;文 · 繁&#8288;體&#8288;中&#8288;文 · 日&#8288;本&#8288;語 · 한&#8288;국&#8288;어


  


## Why this tool exists

Cyberface work usually starts with a player name and ends with an ID, folder path and roster check. The browser keeps those steps in one place and lets modders export only the records relevant to the roster they are editing.

## A complete first run

1. Open **NBA 2K27 Cyberface ID Database** and confirm the detected NBA 2K27 build or data source.
2. Select the input or profile, then configure **searchable player ID index** without changing the defaults that are not part of this test.
3. Review **rookie and roster filters** in the preview or status panel and correct any version, filter or detection warning.
4. Run one controlled action. Compare the visible result with the preview before changing a second setting.
5. Save the profile or export the result, keeping **mod-folder and export notes** available for recovery and comparison.

## Before you begin

- Keep **Player or roster filters** ready and confirm that it belongs to the intended NBA 2K27 profile or session.
- Note the current game/client build or data date before changing a profile.
- Choose where **CSV or copied ID** will be saved so the previous result is not overwritten.
- Use **searchable player ID index** in one short test first; keep the original save, profile or comparison beside it.

## Interface tour

- **01.** Roster search with team, class and status filters.
- **02.** Player table with cyberface ID and roster source.
- **03.** Selected record preview with the target file path.
- **04.** Copy ID action for one player without exporting the full table.
- **05.** Filtered export for a mod project or roster update.

## What it does

- **searchable player ID index.** Searches player names and IDs without forcing an exact spelling match.

- **rookie and roster filters.** Narrows the table by roster, team, class or record status.

- **mod-folder and export notes.** Copies one clean ID or exports the currently filtered records.

## At a glance

| Function | What you get |
|---|---|
| **Input** | Player or roster filters |
| **What you get** | Verified ID record |
| **Output** | CSV or copied ID |

## How to read the result

Use the ID together with its roster source and status. A matching player name is not enough when custom rosters reuse records or move players between teams. Export the filtered table only after opening one sample record and checking the target folder expected by the mod.

## Troubleshooting

> **Common failure pattern:** a cyberface loads on the wrong player.

### The wrong player receives a face

Check the roster source and player ID together; duplicate names can exist across roster sets.

### A player is missing

Remove team and rookie filters, then refresh the selected roster data.

### The exported path is wrong

Review the mod-folder root in the selected record before copying or exporting IDs.

## Data and recovery

The database does not need to alter roster files. Export filtered IDs into a separate mod workspace and keep the source roster label with the export.

Use automation and game-modification features only where the game rules and session type allow them.

## After a game update

- [ ] Refresh the roster source and note its date or version.
- [ ] Search one known player to confirm that IDs and teams still line up.
- [ ] Reapply roster, rookie and status filters after the refresh.
- [ ] Create a new export instead of overwriting the last verified ID list.

## Questions


Can I export the filtered ID list?

Yes. Apply roster or rookie filters, then export the visible records or copy one ID from the player inspector.


What information belongs in a compatibility report?

Record the exact game build, tool or data version, input used and observed result. Keep unknown fields marked unknown. A screenshot or a successful test in a different version is not evidence for the current build.


Is a working executable or script included?

The current repository contains documentation and an interface concept, not a verified working release. Compatibility notes and screenshots are not execution tests. Do not infer official authorship, supported builds or account protection from them.


## Built for

- Find a player ID
- Filter a roster update
- Prepare a mod-folder export

---


## Download

Review the documented scope and compatibility before choosing a release.


---
