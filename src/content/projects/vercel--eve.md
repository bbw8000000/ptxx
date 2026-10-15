---
title: "vercel/eve"
owner: "vercel"
name: "eve"
fullName: "vercel/eve"
description: "The Open Framework for Building Agents"
sourceUrl: "https://github.com/vercel/eve"
stars: 5374
forks: 590
language: "TypeScript"
topics: ["agent", "framework", "harness", "javascript", "markdown", "sandbox", "typescript", "vercel"]
license: "Apache-2.0"
homepage: "https://eve.dev"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-26T18:02:26Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

eve


[eve](https://eve.dev/) is a filesystem-first framework for durable AI agents. Core agent capabilities live in
conventional locations, so projects are easier to inspect, extend, and operate.

## The filesystem is the authoring interface

A typical eve agent has this structure:

```text
my-agent/
└── agent/
    ├── agent.ts            # Optional: model and runtime config
    ├── instructions.md     # Required: the always-on system prompt
    ├── tools/              # Optional: typed functions the model can call
    │   └── get_weather.ts
    ├── skills/             # Optional: procedures loaded on demand
    │   └── plan_a_trip.md
    ├── channels/           # Optional: message channels (HTTP, Slack, Discord)
    │   └── slack.ts
    └── schedules/          # Optional: recurring cron jobs
        └── weekly_recap.ts
```

Read the [documentation](https://eve.dev/docs) for the full project layout and guides.

## Quick start

```bash
npx eve@latest init my-agent
```

This creates a new `my-agent` directory, installs its dependencies, initializes Git, and starts
the interactive terminal UI.

To start with another AI Gateway model, pass its model ID:

```bash
npx eve@latest init my-agent --model openai/gpt-5.6-terra
```

To add eve to an existing project, pass a path:

```bash
cd myapp
npx eve@latest init .
```

> [!NOTE]
> The `eve` package includes its full documentation, so coding agents can read it locally from
> `node_modules/eve/docs`.

### A minimal example

The generated project includes an `agent` directory. Replace `agent/instructions.md` with:

```md
You are a concise weather demo assistant. Tell users that the weather data is mocked.
```

Add a mock weather tool at `agent/tools/get_weather.ts`:

```ts
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Return mock weather data for a city.",
  inputSchema: z.object({ city: z.string().min(1) }),
  async execute({ city }) {
    return { city, condition: "Sunny", temperatureF: 72 };
  },
});
```

Choose the model in `agent/agent.ts`:

```ts
import { defineAgent } from "eve";

export default defineAgent({
  model: "spacexai/grok-4.7",
});
```

For a new scaffold, start the agent again:

```bash
npm run dev
```

That's a working agent. Add human-in-the-loop prompts, subagents, and schedules as needed.
Follow the [first-agent tutorial](https://eve.dev/docs/tutorial/first-agent) for a complete
walkthrough.

## Community

The eve community lives on GitHub Discussions,
where you can ask questions, share ideas, and show what you've built.

## Contributing

Contributions are welcome. See CONTRIBUTING.md to get the repo
running locally and land a change, and use
issues and
discussions to collaborate. By
participating, you agree to our Code of Conduct.

## Security

Please do not open public issues for security vulnerabilities. Instead, follow
SECURITY.md and report responsibly to
responsible.disclosure@vercel.com.

## Beta terms

eve is currently in beta and subject to the [Vercel beta terms](https://vercel.com/docs/release-phases/public-beta-agreement);
the framework, APIs, documentation, and behavior may change before general availability.
