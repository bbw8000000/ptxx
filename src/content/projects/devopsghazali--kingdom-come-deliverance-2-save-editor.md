---
title: "devopsghazali/kingdom-come-deliverance-2-save-editor"
owner: "devopsghazali"
name: "kingdom-come-deliverance-2-save-editor"
fullName: "devopsghazali/kingdom-come-deliverance-2-save-editor"
description: "Kingdom Come: Deliverance 2 save editor concept for Windows, covering slot and inventory inspection, character stats, separate backups, format checks and restoration tests."
sourceUrl: "https://github.com/devopsghazali/kingdom-come-deliverance-2-save-editor"
stars: 41
forks: 0
language: "未知"
topics: []
license: "Apache-2.0"
defaultBranch: "main"
snapshotDate: "2026-09-14"
pushedAt: "2026-09-13T14:55:17Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Kingdom Come: Deliverance 2 Save Editor

Inspect save slots, inventory fields and character stats using a separate backup. Confirm format support and a successful restore before keeping an edited save.


English · Español · Português · Deutsch · Français · 简&#8288;体&#8288;中&#8288;文 · 繁&#8288;體&#8288;中&#8288;文 · 日&#8288;本&#8288;語 · 한&#8288;국&#8288;어


  


## Why this tool exists

KCD2 saves carry character, inventory and slot metadata that should stay consistent after an edit. The editor previews original and proposed values, validates the result and keeps a restore timeline for the exact slot.

## What it does

### 01 · slot detection and backups

Creates a timestamped snapshot before the selected slot is opened for editing.

### 02 · stats and inventory inspection

Shows original and proposed values together before anything is written.

### 03 · restore and save-integrity checks

Validates the result and restores an earlier snapshot from the same screen.

## Interface tour

- **01.** Save slot sidebar with date, playtime and backup state.
- **02.** Stats and inventory inspection tabs.
- **03.** Before-and-after values for every proposed edit.
- **04.** Save integrity result before the write action.
- **05.** Restore timeline scoped to the selected slot.

## At a glance

| Function | What you get |
|---|---|
| **Input** | Selected save slot |
| **What you get** | Validated before/after preview |
| **Output** | Backup and edited slot |

## Built for

- Inspect a save slot
- Preview controlled edits
- Roll back after a bad sync

## How to read the result

The before-and-after view should explain every planned write. A valid integrity check confirms structure, not whether the chosen value makes sense for the current quest or progression state. Make related changes as a small group, load the slot, then create a new snapshot before the next group.

## Before you begin

- Keep **Selected save slot** ready and confirm that it belongs to the intended Kingdom Come: Deliverance II profile or session.
- Note the current game/client build or data date before changing a profile.
- Choose where **Backup and edited slot** will be saved so the previous result is not overwritten.
- Use **slot detection and backups** in one short test first; keep the original save, profile or comparison beside it.

## Data and recovery

Every write should begin with a timestamped snapshot. Keep the original slot, the edited slot and the validation result until the game loads and saves cleanly.

Use automation and game-modification features only where the game rules and session type allow them.

## A complete first run

1. Open **Kingdom Come: Deliverance 2 Save Editor** and confirm the detected Kingdom Come: Deliverance II build or data source.
2. Select the input or profile, then configure **slot detection and backups** without changing the defaults that are not part of this test.
3. Review **stats and inventory inspection** in the preview or status panel and correct any version, filter or detection warning.
4. Run one controlled action. Compare the visible result with the preview before changing a second setting.
5. Save the profile or export the result, keeping **restore and save-integrity checks** available for recovery and comparison.

## After a game update

- [ ] Create a new snapshot before opening a save written by the updated game.
- [ ] Let the game load and close the slot once before editing it.
- [ ] Change one related field group and run integrity validation.
- [ ] Keep local and cloud synchronization paused until the edited slot is verified.

## Troubleshooting

> **Common failure pattern:** the edited save is missing from the load menu.

### The edited slot is missing

Restore the snapshot, verify the slot path and compare cloud synchronization before writing again.

### The game rejects the save

Undo the last field group and run integrity validation after each smaller change.

### Values return after launch

Check whether the game or cloud copy rewrote the local slot and resolve the newer timestamp first.

## Questions


Can I get the original save back?

Yes. Every write starts from a named snapshot. Select the snapshot in the restore timeline and validate it before replacing the edited slot.


What should I verify before editing a save?

Keep an untouched copy outside the game’s save folder. Confirm the editor supports the exact format, then test loading a restored copy before keeping changes. A backup does not prove format compatibility.


Is a working executable or script included?

The current repository contains documentation and an interface concept, not a verified working release. Compatibility notes and screenshots are not execution tests. Do not infer official authorship, supported builds or account protection from them.


---


## Download

Review the documented scope and compatibility before choosing a release.


---
