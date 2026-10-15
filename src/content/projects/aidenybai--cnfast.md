---
title: "aidenybai/cnfast"
owner: "aidenybai"
name: "cnfast"
fullName: "aidenybai/cnfast"
description: "25× faster drop-in replacement for `cn`"
sourceUrl: "https://github.com/aidenybai/cnfast"
stars: 1187
forks: 14
language: "TypeScript"
topics: ["clsx", "cn", "tailwindcss"]
license: "MIT"
homepage: "https://cn.aidenybai.com"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-01T23:41:38Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

> [!NOTE]
> Check out `cn` by [shadcn](https://ui.shadcn.com/) for an even _**faster**_ `cn` package. `cnfast` will no longer be maintained in favor of `cn`. I recommend you go use that package instead!

# cnfast

[*图片：version*](https://npmjs.com/package/cnfast)
[*图片：downloads*](https://npmjs.com/package/cnfast)

Fast drop-in replacement for `tailwind-merge` + `clsx`.

cnfast runs [**25× faster**](https://cn.aidenybai.com/) than `tailwind-merge` + `clsx` across 58 real-world repositories, with byte-identical output. Same API, no code changes.

```ts
import { cn } from "cnfast";

cn("px-2 py-1", isActive && "px-4", { "text-red-500": hasError });
// "py-1 px-4 text-red-500"
```

## Install

```bash
npm install cnfast
```

Migrate an existing `clsx`, `classnames`, or `tailwind-merge` project in one command:

```bash
npx cnfast migrate
```

On a shadcn/ui project, add or replace your `cn` utility through the registry. This rewrites `lib/utils.ts` to re-export cnfast and installs the package:

```bash
npx shadcn@latest add aidenybai/cnfast/cn
```

## Usage

Swap the shadcn/ui `cn` helper for cnfast:

```ts
// before
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// after
export { cn } from "cnfast";
```

cnfast also exports `clsx`, `twMerge`, and `twJoin`.

## Development

```bash
ni
nr build
nr test
```

## License

MIT
