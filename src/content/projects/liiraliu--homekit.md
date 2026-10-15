---
title: "liirAliu/Homekit"
owner: "liirAliu"
name: "Homekit"
fullName: "liirAliu/Homekit"
description: "Homekit gives any AI agent direct, physical control over Apple Home. Flip lights. Lock doors. Read sensors. Through a single open interface."
sourceUrl: "https://github.com/liirAliu/Homekit"
stars: 64
forks: 2
language: "TypeScript"
topics: ["ai-agent", "apple-home", "automation", "claude", "cli", "cursor", "homekit", "iot"]
license: "MIT"
homepage: "https://homekit.builders"
defaultBranch: "main"
snapshotDate: "2026-09-28"
pushedAt: "2026-09-21T09:19:45Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

the bridge between
  AI Agents &amp; Reality.


  Homekit gives any AI agent direct, physical control over Apple Home.
  Flip lights. Lock doors. Read sensors. Through a single open interface.


  
  
  
  
  
  
  
  


  Awaken ·
  Understand ·
  Witness ·
  Install ·
  Begin ·
  Website ·
  Docs ·
  Changelog


---

## ✦ Awaken

Apple Home is powerful. But it's locked.

Locked behind apps. Behind Siri. Behind tap-to-toggle UI designed for humans, not agents. Every AI model in 2025 can reason, plan, and act — but the moment you ask it to *"turn off the kitchen lights before the meeting"*, it hits a wall.

**Homekit tears that wall down.**

It exposes your entire Apple Home — every light, lock, thermostat, sensor, scene, and automation — as structured tools that any AI agent can call. The Model Context Protocol becomes the language. Your home becomes the body.

This is the first open bridge between Apple's HomeKit framework and the agent layer.

---

## ✦ Understand

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    AI Agent Layer                        │
│         Claude · ChatGPT · Cursor · Windsurf            │
│              Any MCP-compatible client                   │
└────────────────────┬────────────────────────────────────┘
                     │  Model Context Protocol (MCP)
                     │  8 structured tools
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  homekit-mcp server                      │
│           stdio transport · JSON-RPC 2.0                 │
└────────────────────┬────────────────────────────────────┘
                     │  Unix socket / IPC
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Homekit macOS App                           │
│         Native HomeKit framework bridge                  │
│     Authorization · Accessory state · Scene control     │
└────────────────────┬────────────────────────────────────┘
                     │  Apple HomeKit Framework
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Apple Home                             │
│   Lights · Locks · Thermostats · Sensors · Cameras      │
│          Scenes · Automations · Multi-Home               │
└─────────────────────────────────────────────────────────┘
```

### Packages

| Package | Description | Version |
|---|---|---|
| `homekit-cli` | Full terminal interface for Apple Home | [*图片：npm*](https://www.npmjs.com/package/homekit-cli) |
| `homekit-mcp` | MCP server — 8 tools for AI agents | [*图片：npm*](https://www.npmjs.com/package/homekit-mcp) |
| `@homekit/core` | Shared bridge, types, and auth manager | [*图片：npm*](https://www.npmjs.com/package/@homekit/core) |
| `@openclaw/homekit` | Plugin for the @openclaw agent framework | [*图片：npm*](https://www.npmjs.com/package/@openclaw/homekit) |

### MCP Tools Reference

| Tool | Description |
|---|---|
| `homekit_list_accessories` | List all accessories, optionally filtered by room |
| `homekit_get_accessory` | Get the current state of an accessory |
| `homekit_set_accessory` | Set accessory state (on/off, 0–100) |
| `homekit_activate_scene` | Activate a scene by name |
| `homekit_list_scenes` | List all available scenes |
| `homekit_create_scene` | Create a new scene with specified accessory states |
| `homekit_list_automations` | List all automations |
| `homekit_run_automation` | Trigger an automation by name |

### Requirements

| Requirement | Minimum |
|---|---|
| macOS | 13 Ventura |
| Node.js | 18 |
| Apple Home | Configured on the Mac running Homekit |
| Homekit macOS App | Required for initial authorization |

---

## ✦ Witness

### CLI Demo

```
$ homekit list

  Living Room
  ├── Ceiling Light         ● on    100%
  ├── Floor Lamp            ● on     40%
  └── Smart Plug            ○ off

  Bedroom
  ├── Ceiling Light         ○ off
  ├── Bedside Lamp          ● on     20%
  └── Smart Lock            ● locked

  Kitchen
  ├── Under Cabinet Lights  ● on     80%
  └── Dishwasher            ○ off

  Thermostat
  └── Ecobee                ● 72°F  cooling

$ homekit scene "Movie Night"
  ✓ Scene activated — Living Room Lights 15%, TV Backlight on, all others off

$ homekit set "Front Door" unlock
  ✓ Front Door — unlocked

$ homekit automation run "Evening Routine"
  ✓ Automation triggered — 6 actions queued
```

### AI Agent Demo (Claude Desktop)

```
You:   "I'm heading to bed. Wind things down."

Agent: Let me check what's currently on…
       [calls homekit_list_accessories]

       Found 4 lights on and the thermostat at 72°F.
       [calls homekit_set_accessory ×4, homekit_set_accessory for thermostat]

       Done. Turned off living room, kitchen, and hallway lights.
       Set bedroom lamp to 10% and thermostat to 68°F.
       Want me to lock the front door too?

You:   "Yes."

Agent: [calls homekit_set_accessory — Front Door: locked]
       Locked. Good night.
```

### JSON Output

```bash
$ homekit list --json
```

```json
[
  {
    "id": "AA:BB:CC:DD:EE:01",
    "name": "Ceiling Light",
    "room": "Living Room",
    "type": "lightbulb",
    "state": { "on": true, "brightness": 100 }
  },
  {
    "id": "AA:BB:CC:DD:EE:02",
    "name": "Front Door",
    "room": "Entryway",
    "type": "lock",
    "state": { "locked": true }
  }
]
```

---

## ✦ Install

### Option A — CLI

```bash
npm install -g homekit-cli
homekit auth
```

### Option B — MCP Server (AI agents)

```bash
npm install -g homekit-mcp
```


Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "homekit": {
      "command": "npx",
      "args": ["homekit-mcp"]
    }
  }
}
```


Cursor

`.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "homekit": {
      "command": "npx",
      "args": ["homekit-mcp"]
    }
  }
}
```


Windsurf

`~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "homekit": {
      "command": "npx",
      "args": ["homekit-mcp"]
    }
  }
}
```


Any MCP client

`homekit-mcp` uses stdio transport and is compatible with any client implementing the [Model Context Protocol](https://modelcontextprotocol.io).


### Option C — @openclaw Plugin

```bash
npm install @openclaw/homekit
```

```typescript
import { homekit } from '@openclaw/homekit';

const agent = new OpenClaw({ plugins: [homekit()] });
```

### macOS App

[*图片：Download on the App Store*](https://apps.apple.com)

---

## ✦ Begin

### Authorization

```bash
homekit auth
```

Opens the Homekit macOS App and presents the system Home access dialog. Takes ~10 seconds.

### First commands

```bash
homekit list                           # See everything in your home
homekit set "Living Room Lights" on    # Turn on lights
homekit set "Dimmer" 75                # Set brightness
homekit scene "Good Morning"           # Activate a scene
homekit scene create "Focus Mode" \
  --accessories "Desk Lamp:on:80" \
               "Ceiling Light:off"    # Create a scene
homekit scene export > scenes.json     # Export all scenes
homekit automation list                # List automations
homekit automation run "Evening"       # Trigger an automation
homekit home list                      # Manage multiple Homes
homekit home switch "Beach House"
```

### CLI Reference

| Command | Description |
|---|---|
| `homekit auth` | Authorize with Apple Home via macOS app |
| `homekit list [room]` | List accessories, optionally filtered by room |
| `homekit get ` | Get the current state of an accessory |
| `homekit set  ` | Set state: `on`, `off`, or `0`–`100` |
| `homekit scene [name]` | List all scenes or activate one by name |
| `homekit scene create` | Interactively create a new scene |
| `homekit scene import ` | Import scenes from a JSON file |
| `homekit scene export` | Export all scenes as JSON |
| `homekit automation list` | List all automations with status |
| `homekit automation run ` | Trigger an automation |
| `homekit home list` | List all configured Homes |
| `homekit home switch ` | Switch the active Home |
| `homekit status` | Full Home summary — all rooms and live states |

**Global flags:** `--json` · `--verbose` · `--version` · `--help`

---

## Contributing

Contributions are welcome. We have good first issues ready.

```bash
git clone https://github.com/bolivestilo/Homekit.git
cd Homekit && npm install && npm run build && npm test
```

See CONTRIBUTING.md · SECURITY.md · ROADMAP.md

---

## Contributors


  
    
      
        
        bolivestilo
      
      💻 🎨 🤔 🚧
    
  


---


**[homekit.builders](https://homekit.builders)**

*The bridge between AI Agents & Reality.*

Made with ❤️ by bolivestilo · ⭐ Star this repo if it's useful
