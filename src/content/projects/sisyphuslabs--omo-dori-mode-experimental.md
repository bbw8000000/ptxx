---
title: "sisyphuslabs/omo-dori-mode-experimental"
owner: "sisyphuslabs"
name: "omo-dori-mode-experimental"
fullName: "sisyphuslabs/omo-dori-mode-experimental"
description: "Dori mode: an always-on messenger agent that launches, tracks and closes coding-agent sessions in herdr (skill + bun CLI). Experimental."
sourceUrl: "https://github.com/sisyphuslabs/omo-dori-mode-experimental"
stars: 54
forks: 55
language: "TypeScript"
topics: ["agents", "automation", "bun", "coding-agent", "dori", "herdr", "messenger-bot", "omo"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-10-08"
pushedAt: "2026-10-07T06:02:24Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

**English** · 简体中文 · 日本語 · 한국어


  


# omo-dori-mode-experimental

Dori mode turns one coding-agent session into an always-on messenger agent. You talk to a single bot on Telegram or Discord. The Dori hands each job to its own agent session in a herdr tab, keeps track of every session it started, and only closes one after the work is actually done: the PR merged, the issue closed, the version published.

It ships as a skill (`skills/dori-mode/SKILL.md` plus references) and a small bun + TypeScript CLI called `dori`. Experimental: expect rough edges.

## Install

```sh
curl -fsSL https://raw.githubusercontent.com/sisyphuslabs/omo-dori-mode-experimental/main/install.sh | bash
```

This clones the repo to `~/.dori/src`, links the skill into `~/.agents/skills/dori-mode`, puts `dori` on your PATH with `bun link`, and copies an example config to `~/.dori/config.json`. Set `SKILLS_DIR` if your agent loads skills from somewhere else.

Then open your agent inside herdr and say "Dori mode".

## Requirements

- [bun](https://bun.sh) 1.3 or newer, and git
- [herdr](https://herdr.dev), the terminal multiplexer the lanes run in
- a coding agent that loads skills (built for OmO; the agent command is configurable)
- `gh` (the GitHub CLI) for checking merged PRs and closed issues; `npm` for published versions
- agent-messenger for the bot itself

macOS gets the full host guard. On Linux, load and disk work, and memory and swap read as unknown.

## Naming your Dori

The first thing a Dori does is ask you what it should be called. "Dori" is fine. So is a name that ends in Dori, like ShipDori or WorkDori, which helps when you run more than one. It uses that name for the bot, for how it signs off, and for the mode, so next time "ShipDori mode" is all you have to say.

## Using Slack

If you pick Slack, the Dori asks one more question and waits for your answer:

- **User token**: it acts as a real member of your workspace. That takes a paid seat, which you pay for. It reads everything that member can see and can keep a green online dot.
- **Bot token**: it's a Slack app. There's no seat cost, but it only sees channels it's invited to, within the scopes you gave the app.

## How the Dori writes

It talks the way you do. If you write short, casual and lowercase, it answers short, casual and lowercase. It uses no emojis, in any language. When a reply has several parts, it sends a few short messages instead of one long block, each sent as soon as it's ready, with no artificial pauses. A single status that keeps changing is the exception: that stays one message, edited in place.

## Configuration

Everything lives in `~/.dori/config.json`, and every field is optional. The ones you will want to set:

| Field | What it is |
|---|---|
| `leadPane` | your Dori's own herdr pane (`herdr pane current`). Lanes report here. |
| `laneWorkspace` | the herdr workspace new lane tabs open in |
| `defaultCwd` | where lanes start, and the repo whose worktrees they own |
| `agentCommand` | how to start an agent, as an argv list with `{model}` and `{prompt}` |
| `hooks.threadReply`, `hooks.threadDone` | your messenger CLI, as argv lists with `{thread}` and `{text}`, so lanes can post progress and be marked done |

The rest (timings, thresholds, heavy-slot count) has sensible defaults. The full table is in `references/scripts.md`. `DORI_CONFIG`, `DORI_STATE_DIR` and `DORI_LEAD_PANE` override the file.

## Onboarding

On first setup, before it reads anything of yours, the Dori asks whether it may learn how you work: your tools, what you're working on and why, who you and your company are. Only if you say yes does it look at your tools, one at a time. For each one it says which integration it would use and what that reads, for example a CLI that reads Gmail and Calendar so it can watch your schedule, and asks before it touches it. Tools you decline are skipped and remembered.

Everything is read-only. It writes what it learns to memory as it goes and ends with a short summary of what it knows and what's still missing. The full process is in `references/onboarding.md`.

## Routing a request

The Dori decides on its own how to handle each message.

- Questions, status checks, lookups and small edits get answered directly, with no new session.
- Code that ends in a PR, multi-step work, and anything long or parallel gets a lane. If an idle lane already owns that repo, the work goes there instead.
- When the host is short on memory, disk or panes (`dori can-launch` says HOLD), nothing new opens. The work is queued and the Dori tells you why.
- New work gets a new thread. A follow-up goes back to its original thread, reopening the old session if its lane was closed. A quick question is answered where you asked it.

## The session registry

Every lane gets one JSON file under `~/.dori/state/lanes/`. It maps the messenger thread to the herdr pane, the pane to the agent's own session id, and records a status: `working`, `done-claimed`, `verified-done`, `not-done` or `closed`. Each change is kept in a history.

`dori sync` compares that against the panes that are actually running and tells you what drifted: a pane that went away, a session id that changed, a lane with no way to prove it's finished. It never deletes anything. Add `--write` and it saves the session ids it found.

## The 5-minute done flow

A lane says it's finished:

```sh
dori claim-done fix-login --evidence "merged acme/app#412 (a1b2c3d)"
```

The Dori sees `LANE_DONE_CLAIMED`, and the lane is told it closes in five minutes. You can push back in that window:

```sh
dori object-done fix-login --reason "the changelog entry is missing"
```

The reason goes straight to the lane, which keeps working and claims again later. If nobody objects, `dori watch` closes the lane once the window is up. Before it does, it reads every `Done =` signal live again, and it refuses if a worktree still has commits that never reached a remote or uncommitted tracked changes. Either one turns the claim back into not-done, with the reason. Restarting the watcher doesn't reset the clock.

### What counts as done

A lane's `Done =` line lists signals the watcher can check for itself:
- a PR merged;
- an issue closed;
- a package version published;
- for work that never ends in a PR (a local setup, a QA pass, a running service): a command that exits 0, a file with the expected hash or JSON field, or a URL that answers with the expected status and body.

```
Done = command ["bun","test"] stdout~" 0 fail"; file qa/report.json json:.passed=true; url http://localhost:3000/health body~"ready"
```

The watcher runs each check itself when it closes the lane, with no shell, and never takes the lane's word for it. A signal it can't parse is refused when the lane is launched. The full syntax is in `references/sessions.md`.

## Commands

| Command | What it does |
|---|---|
| `dori launch  ...` | write the lane footer into the brief, open a tab, start the agent, check for startup errors |
| `dori adopt  --pane ID ...` | register a lane that's already running |
| `dori sync [--write]` | registry against live panes, plus drift |
| `dori claim-done` / `object-done` / `close` | the done flow |
| `dori watch` | the auto-close watcher; run it as a persistent monitor |
| `dori freshness [--loop MIN]` | nudge lanes that went quiet, then post their last report to their thread |
| `dori dead-panes [--loop MIN]` | report agent panes that stopped |
| `dori guard [--loop MIN]` | alert on load, memory, disk and pane count |
| `dori heavy  -- ` | run a build or test suite only when a slot is free and load is low |

Text sent to a pane always goes as one argument, never through a shell string, and the CLI checks that Enter actually landed.

## Utilities

The CLI also carries the messenger pieces a Dori needs. You can import them as typed modules from `scripts/src/messenger/`.

| Command | What it does |
|---|---|
| `dori send slack\|telegram\|discord --to T --text X [--thread ID] [--edit ID]` | post or edit a message; rate limits are retried, and text containing `$(` is refused |
| `dori presence slack\|discord` | keep the account shown online (a Discord bot on the gateway, or a Slack user account through a web-client socket tickled every minute) |
| `dori transcribe ` | turn a voice note into text through your `hooks.transcribe` command |
| `dori can-launch` | tell whether there's room for another lane |
| `dori inbound slack [--loop MIN]` | catch everything addressed to the Dori on Slack: unread replies from the Threads view, new replies in any thread it posted in (even untagged ones), and DMs or channels with unread mentions |

The modules also cover a few things that have no command:
- Telegram: `sendMessageDraft` streaming that starts at "Thinking…", forum topics, and HTML tables.
- Discord: threads you can start, rename and archive.
- Slack: file uploads.
- `typingWhile`, which shows the typing indicator while a piece of work runs.

Every message the Dori posts on Slack records its thread, whichever helper sent it. A reply under a root it posted with a raw API call still reaches it, which is the case a plain message-event listener misses.

Tokens come from `DORI_SLACK_TOKEN` (with `DORI_SLACK_COOKIE` for a user token), `DORI_TELEGRAM_TOKEN` and `DORI_DISCORD_TOKEN`.

## Tests

There's no CI. Run the tests locally:

```sh
cd skills/dori-mode/scripts
bun install
bun test           # behaviour tests against fake herdr, git and gh
bunx tsc --noEmit  # typecheck
```

The tests never touch a real pane, repo or GitHub.

## License

MIT

## Migrate from OmOMeow

If you set up the older OmOMeow mode from the gist, your bot keeps working. Four changes turn it into a Dori.

1. **Pick a Dori name.** "Dori" on its own, or one that ends in Dori, like ShipDori or WorkDori. Tell your agent: "From now on your name is ShipDori and this is ShipDori mode." From then on, "ShipDori mode" is the keyword that turns it on, in place of "OmOMeow mode".
2. **Rename the bot and change its picture.**
   - Telegram: open @BotFather, send `/setname`, pick the bot and send the new name. Then send `/setuserpic`, pick the bot and send the new image. The default Dori picture is `skills/dori-mode/assets/dori-avatar.png`; use any image you like. A bot's name and picture can only be changed through BotFather.
   - Discord: in the Developer Portal, open your application. On the **Bot** page change the username and the icon, and on **General Information** change the app name and icon as well (the same default picture works), then save.
3. **Install this repo** with the one-line install above, and tell your agent "ShipDori mode". It picks up the skill and the `dori` CLI in place of the old pasted prompt.
4. **Run onboarding** if your OmOMeow never did. Just say "run onboarding".

Your existing threads, topics and memory stay as they are.
