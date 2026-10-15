---
title: "0xwilliamortiz/ratchet"
owner: "0xwilliamortiz"
name: "ratchet"
fullName: "0xwilliamortiz/ratchet"
description: "Your agent reads the rules. This checks whether it followed them."
sourceUrl: "https://github.com/0xwilliamortiz/ratchet"
stars: 408
forks: 83
language: "JavaScript"
topics: ["ai-agents", "claude-code", "claude-code-plugin", "claude-skills", "code-quality", "developer-tools", "hooks", "llm"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-08-02"
pushedAt: "2026-07-31T20:31:05Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Ratchet

*Your agent reads the rules. This checks whether it followed them.*

*图片：license*
*图片：node*
*图片：tests*

A ratchet turns one way. Complexity in your codebase goes down or stays flat,
unless someone deliberately turns it the other way and writes down why.

---

## The problem

Every minimalism ruleset for coding agents is an open loop. You inject *prefer
the standard library, do not add dependencies, keep the diff small*, the model
reads it, and then nothing checks whether any of it happened.

Compliance is assumed. When the model drifts, which it does over a long
session, nobody finds out until review.

## What this does instead

The ruleset still goes in. But a `PostToolUse` hook reads every edit the agent
makes, measures it, and reports what it found back into the same session, while
the agent is still working.

```
you    add a date picker to the settings page

agent  [installs flatpickr, writes a wrapper component, adds a stylesheet]

hook   ratchet guard  ·  +71 -0 lines (net +71/150)  ·  2/3 new files  ·  1/1 new deps

       certain
         package.json:14        dep      new dependency flatpickr
                                         justify it against the stdlib and the platform, or drop it
         src/DatePicker.jsx:4   native   date picker component library
                                         
       likely
         src/DatePicker.jsx:22  wrapper  DatePicker only forwards to Flatpickr
                                         call it directly and delete the wrapper

agent  [reverts, ships ]
```

Nothing here depends on the model having felt persuaded by a system prompt.

---

## Install

```bash
git clone https://github.com/0xwilliamortiz/ratchet.git
cd ratchet
npm install -g .
```

Then once per repository you want watched:

```bash
cd your-project
ratchet
```

That is the whole setup. It registers the hooks, starts measuring, accepts
everything already in the code as a baseline, and opens the window:

```
ratchet is watching your-project

  hooks      C:\your-project\.claude\settings.json
  measuring  .ratchet\  (mark at 1284 lines)
  baseline   31 findings from before now accepted, only new ones fire
  window     opened ratchetui.exe
  plugin     C:\Users\you\ratchet

restart your agent so it picks the hooks up.
```

Restart your agent. Done.

**Requirements.** Node 20 or newer. Git on PATH for the measuring half; without
it the ruleset and the detectors still work, but the mark, the ledger and the
audit do not. On Windows, `hooks/ratchetui.exe` ships with the repository and
opens automatically.

`ratchet init` and `ratchet baseline` still exist for doing those steps alone.

---

## Modes

Not moods. Numbers a hook can compare against.

| Mode | New files | New deps | Net added lines | On overrun |
|------|-----------|----------|-----------------|------------|
| `advise` | 8 | 3 | 400 | findings only |
| `guard` | 3 | 1 | 150 | findings and budget warnings |
| `strict` | 1 | 0 | 60 | the edit is blocked |
| `off` | | | | nothing runs |

Default is `guard`. Switch mid-session with `/ratchet strict`, persist with
`/ratchet default advise`, or set `RATCHET_MODE`.

---

## What gets measured

Every `Edit`, `MultiEdit` and `Write` goes through the detectors.

| Tag | Detects |
|-----|---------|
| `dep` | A name that appeared in `package.json`, `requirements.txt`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `Gemfile` or `composer.json` and was not there before |
| `exists` | A new symbol whose normalised name already lives elsewhere in the repository, so `formatDuration` finds `format_duration` |
| `stdlib` | Hand-rolled versions of things the standard library ships |
| `native` | A dependency, or code, doing what the platform already does |
| `wrapper` | A function whose body only forwards to another function with the same arguments |
| `yagni` | An interface, abstract class or protocol with a single implementation |
| `validation` | A bespoke email regex, which is always wrong |
| `budget` | Running totals for new files, new dependencies and net added lines |

### Findings are graded

This is the difference between a tool people keep and one they mute.

| Grade | Means | Example |
|-------|-------|---------|
| `certain` | Parsed, not guessed | A dependency read out of a manifest |
| `likely` | Structural | A function that forwards and nothing else |
| `heuristic` | Shape matching on a regex | A manual group-by loop |

Output is grouped by grade. `strict` only blocks on `certain`.

### How the diff is read

Added lines are computed against the previous content rather than the whole
file, so the detectors only ever see what this session actually wrote. For an
`Edit` that is the replacement string; for a `Write`, the file against its
committed version. Manifests are always read whole, because a partial edit is
not parseable JSON or TOML.

Deletions count too, and the budget uses net lines. Removing fifty lines buys
you fifty. A session that ends smaller than it started is the tool working.

The symbol index is cached in the temp directory, keyed on file count plus
newest mtime. Cold it costs a few hundred milliseconds, warm about 4ms, and it
is capped at 3000 files.

---

## Turning a finding off

Two ways, and they mean different things.

**One line, for a reason you accept:**

```js
// ratchet-ignore: profiled, the clone is the hot path
const copy = JSON.parse(JSON.stringify(frame));
```

**A repository with history:**

```bash
ratchet baseline
```

Findings are fingerprinted by tag, path and shape rather than line number, so a
baseline survives reformatting and code moving down the file.

This is the whole point of the name. Existing debt is grandfathered. New debt
is not.

---

## The mark and the ledger

`.ratchet/mark.json` records an accepted size for the codebase: source lines,
source files, a date, and a written reason. Session start compares the repo to
the mark and says when it is above. Session end appends a row to
`.ratchet/ledger.jsonl`.

Raising the mark is deliberate and needs a sentence:

```bash
node scripts/accept-mark.js "vendored the parser until upstream ships the fix"
```

Read it all back with `ratchet report`:

```
complexity trend, last 3 sessions
─────────────────────────────────

  ▁█▆  18 to 22 lines

when        mode   added  removed  deps  flagged  repo
2026-07-31  guard     +3       -0     0        0  18 new
2026-07-31  guard     +5       -0     1        1  24 ▲ 6
2026-07-31  guard     +0       -2     0        0  22 ▼ 2

mark  14 lines, 8 lines above the mark
      reason: initial mark
```

Prompt-only tools refuse to report per-repo savings, and they are right to: the
version that was never written has no baseline to subtract from. But the
repository *before* the session is a real baseline, and the ledger is a real
record. No estimates, no invented percentages, just the trend.

---

## Marking a shortcut

```python
# ratchet: single global lock, split per account if write throughput matters
```

Ceiling, then trigger. `/ratchet-ledger` collects them and flags any that name
no trigger, since those are the ones that quietly become permanent.

---

## Commands

### Terminal

| Command | Does |
|---------|------|
| `ratchet` | Set up this repository: hooks, measuring, baseline, window |
| `ratchet --global` | Hooks for every project on this machine |
| `ratchet audit` | Scan the whole repository and list what to cut |
| `ratchet baseline` | Accept what exists today, flag only what is new |
| `ratchet report` | The measured trend from the ledger |
| `ratchet status` | What is installed and what has been measured |
| `ratchet doctor` | Drive every hook with real payloads and prove it works |
| `ratchet log` | What the hooks actually said during your real sessions |
| `ratchet ui` | Reopen the window, `--debug` to see why it will not open |
| `ratchet uninstall` | Remove the hooks and the session state |

`--dry-run` prints what would change and writes nothing.

### In your agent

| Command | Does |
|---------|------|
| `/ratchet [advise\|guard\|strict\|off]` | Set the budget, or report the current one |
| `/ratchet-review` | Over-engineering review of the current diff |
| `/ratchet-audit` | The same across the whole repository |
| `/ratchet-ledger` | Trend, mark, and every deferred shortcut |
| `/ratchet-accept` | Record a new mark with a reason |
| `/ratchet-help` | Reference card |

`stop ratchet` turns it off for the session. It has to be the whole message, so
asking the agent to "add a stop ratchet button" does not disable it mid-task.

---

## Configuration

`.ratchet/config.json`, per project and meant to be committed:

```json
{
  "mode": "guard",
  "budget": { "newFiles": 5, "newDeps": 1, "addedLines": 200 },
  "ignore": ["migrations", "generated"],
  "scanTests": false
}
```

Per-user defaults live in `~/.config/ratchet/config.json`.

Environment: `RATCHET_MODE`, `RATCHET_LOG`, `RATCHET_UI`, and
`RATCHET_SUBAGENT_MATCHER`, a case-insensitive regex tested against a
subagent's type so read-only search agents can be left out of the ruleset.

---

## What the budget never applies to

Validation at trust boundaries. Error handling on paths where failure loses
data. Security controls. Accessibility basics. Hardware calibration. Anything
the user explicitly asked for. One runnable check per piece of non-trivial
logic.

These are in the ruleset and out of scope for every detector. A review that
suggests deleting a smoke test has failed.

---

## Checking it works

`npm test` proves the code is correct. These two prove the loop is wired up on
your machine.

**`ratchet doctor`** builds a scratch repository, plants a file with three known
problems, drives the session, guard and report hooks as real subprocesses, and
prints the exact text your agent would have received.

```
  ok  session hook  injected the ruleset and the budget
  ok  guard hook    caught dep, native, exists in a planted file
  ok  report hook   summarised and wrote a ledger row
```

**`ratchet log --on`** then makes every hook append what it emitted to
`.ratchet/hook.log`. Work a normal session, then read it back with
`ratchet log`. That is the only way to see the real thing rather than a
simulation.

Both found real bugs on their first run. Doctor found that the symbol index
kept one file per name, and since `PostToolUse` fires *after* the write, the
file being edited was already in the index and masked the duplicate it was
supposed to find. The log found that the dependency counter was storing a whole
sentence instead of a package name, so the budget message read `drop moment
imported for date work`.

---

## The window

`hooks/ratchetui.exe` opens when you run `ratchet`, and `ratchet ui` reopens
it. Windows only. Nothing to configure.

It is launched through PowerShell's `Start-Process`, which returns as soon as
the app is running, so the app outlives the short-lived hook that started it.
The command travels as `-EncodedCommand` base64 rather than inline text,
because a real install path like `C:\Program Files (x86)\...` contains
characters `cmd.exe` would interpret before PowerShell ever saw them.

Nothing in that path hides a window. An earlier version passed
`-WindowStyle Hidden`, `windowsHide` and `detached`, meaning to hide the
PowerShell console, and hid the application instead. `Start-Process -PassThru`
returns a process id, so the launcher reports what actually happened rather
than assuming a spawn call that returned meant a window appeared.

The executable receives the repository root twice, as its first argument and as
its working directory, and reads:

| Path | Contains |
|------|----------|
| `%CLAUDE_CONFIG_DIR%\ratchet\*.json` | The newest file is the live session: `mode`, `addedLines`, `removedLines`, `newFiles`, `deps`, `findings` |
| `\.ratchet\ledger.jsonl` | One finished session per line |
| `\.ratchet\mark.json` | The accepted size |

Everything the window shows is also available as `ratchet report`,
`ratchet log` and `ratchet status`, which work everywhere.

---

## Limits worth knowing

**The detectors are regex and `git grep`, not a type checker.** They will
produce false positives. That is why the default reports rather than blocks,
why `strict` is opt-in, and why the ruleset tells the agent to push back on a
finding it disagrees with, out loud, rather than ignore it silently.

**`exists` compares normalised names.** It catches a genuinely duplicated
helper and also two unrelated functions that happen to share one. It excludes
names under five characters and a list of generic ones, and it is never graded
`certain`, because a shared name is not proof of duplication.

**Test files are not scanned at all.** A fixture is supposed to contain the bad
pattern being tested, and flagging it is how a tool teaches people to stop
reading it. `tests/`, `__tests__/`, `spec/`, `e2e/`, `fixtures/`, `*.test.*`,
`*.spec.*`, `*_test.go`, `test_*.py`, `conftest.py` and `*.stories.*` are
skipped in the audit and in the symbol index. Set `"scanTests": true` to
include them.

**There is no benchmark.** The line and dependency counts are real. The claim
that this makes code *better* is not measured here, and any number that said
otherwise should be treated the way you would treat any benchmark published by
the thing being benchmarked.

**Blocking depends on the host** honouring a `decision` field on `PostToolUse`.
Where it does not, the finding still arrives as context and the agent still
sees it.

---

## FAQ

**Do I still need a ruleset in the prompt?** It ships with one and injects it
automatically. The detectors are the half other tools do not have, but the
prose half still does most of the work on judgement calls a regex cannot see.

**Can I use it alongside a prompt-only tool?** Yes. They inject text, this
measures diffs. Nothing overlaps.

**Why not parse an AST instead of regex?** That needs tree-sitter or one parser
per language, which is exactly the kind of dependency this tool exists to
question. Grading findings honestly as `heuristic` solves the same problem for
the price of a word.

**It flagged something that was fine.** Say so to the agent and move on, or
suppress the line with `ratchet-ignore: reason`. Silently ignoring findings is
the failure mode; disagreeing out loud is not.

**Does it slow the agent down?** The guard runs per edit. The symbol index is
cached, so the warm cost is single-digit milliseconds.

**What if my repository has no git?** The ruleset and the detectors work. The
mark, the ledger and the audit read git and stay off until you run `git init`.

---

## Uninstall

```bash
ratchet uninstall
```

Removes the hooks from every settings file it finds, plus the session state and
the user config. It leaves `.ratchet/` in each repository alone, because that
is your ledger.

---

## Development

```bash
npm test
```

115 tests. The integration ones build throwaway git repositories, drive the
hooks as real subprocesses with real payloads, and assert on what comes back
out of stdout. The installer tests do the same against a scratch settings file.

Run it on every platform you care about before tagging a release. The first
build crashed on every Windows path, because the installer substituted an
absolute path into serialised JSON and `C:\Users\...` is not a valid escape
sequence. No amount of testing on Linux could have caught it, so
`tests/windows.test.js` now covers that class of bug from any machine.

Adding a detector? See CONTRIBUTING.md. The short version:
every detector needs two tests, one that fires and one lookalike that must not,
and the second matters more.

---

## Authors

0xwilliamortiz and Claude.

Every bug listed above was found by running the thing, not by reading it.

## License

MIT.
