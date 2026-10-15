---
title: "tamnd/ascii-gif"
owner: "tamnd"
name: "ascii-gif"
fullName: "tamnd/ascii-gif"
description: "Turn a terminal session into a good-looking animated GIF. A vhs wrapper with an attractive default look."
sourceUrl: "https://github.com/tamnd/ascii-gif"
stars: 163
forks: 3
language: "Go"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-29T12:33:56Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# ascii-gif

*图片：CI*
*图片：Release*
[*图片：Go Reference*](https://pkg.go.dev/github.com/tamnd/ascii-gif)
*图片：License*

Turn a terminal session into a good-looking animated GIF. You write the action,
`ascii-gif` supplies the window chrome, theme, and framing.

It wraps vhs as a Go library and prepends an
attractive default look, so a tape only carries the part you care about: the
commands, the typing, the pauses.

Install • Quickstart • Tapes • Library

## Install

```bash
go install github.com/tamnd/ascii-gif/cmd/ascii-gif@latest
```

`ascii-gif` drives two runtime tools the way vhs does: `ttyd` runs your commands
in a real terminal and `ffmpeg` encodes the frames. Install both, then check:

```bash
# macOS
brew install ttyd ffmpeg

ascii-gif doctor
```

## Quickstart

```bash
ascii-gif init demo          # write demo.tape you can edit
ascii-gif render demo.tape   # render demo.gif
```

A tape is a small script of terminal actions. The starter looks like this:

```tape
# A tape is a script. ascii-gif prepends the look, you write the action.
Type "echo hello from ascii-gif"
Enter
Sleep 2s
```

Render it to a GIF, choosing the output path:

```bash
ascii-gif render demo.tape -o out/hello.gif
```

## Tapes

A tape uses the vhs tape language: `Type`, `Enter`, `Sleep`, `Hide`/`Show`, and
more. See the vhs command reference for the
full set. `ascii-gif` adds the look for you, so you do not write the `Set`
header. The default look is a colored margin, a window bar, a rounded border,
and a readable theme and font.

Two flags change how the look is applied:

```
-o, --output     GIF path to write (default: the tape name with .gif)
    --no-preset  do not prepend the look; the tape stands on its own
-q, --quiet      suppress vhs progress output
```

Pass `--no-preset` when a tape carries its own `Set` header and you want full
control.

Read a tape from stdin with `-`:

```bash
echo 'Type "date"; Enter; Sleep 1s' | ascii-gif render -
```

## Library

The renderer is a small package you can call from Go. Give it a tape body and it
composes the look, runs vhs, and writes the GIF:

```go
import "github.com/tamnd/ascii-gif/asciigif"

err := asciigif.Render(ctx, `Type "echo hi"
Enter
Sleep 1s
`, asciigif.Options{Output: "hi.gif"})
```

`asciigif.CheckDeps` reports whether `ttyd` and `ffmpeg` are on PATH, which is
what `ascii-gif doctor` calls.

## Credit

The heavy lifting is vhs by Charm.
`ascii-gif` is a thin wrapper over a library-ized fork
of it that adds a default look and a smaller surface.

## License

MIT. See LICENSE.
