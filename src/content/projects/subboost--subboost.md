---
title: "SubBoost/subboost"
owner: "SubBoost"
name: "subboost"
fullName: "SubBoost/subboost"
description: "Clash/Mihomo subscription conversion, enhancement, and management tool. Clash/Mihomo 订阅转换、增强和管理工具。通过 UI 可视化，一键实现链式代理、精确分流、防 DNS 泄露和多订阅聚合等高级功能。"
sourceUrl: "https://github.com/SubBoost/subboost"
stars: 882
forks: 161
language: "TypeScript"
topics: ["clash", "dns-leak-protection", "mihomo", "mihomo-config", "mihomo-rules", "proxy", "subscription-converter"]
license: "AGPL-3.0"
homepage: "https://subboost.org"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-24T13:19:15Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

SubBoost
  
    
    
    
    
    
  
  English | 中文


**SubBoost** is a **Clash/Mihomo subscription conversion, enhancement, and management** tool. It can convert airport subscriptions and self-hosted nodes into optimized aggregate subscriptions, then update them automatically. With the visual UI, you can configure advanced features such as **chained proxies, precise routing, DNS leak prevention, and multi-subscription aggregation** in one click.

## Highlights & Use Cases

- **Subscription conversion**: Import subscription links, YAML files, node links, and other common formats.
- **Node management**: Rename, delete, or configure listening ports for nodes in batches.
- **Node filtering**: Build `filtered proxy groups` with only selected nodes by source, region, and custom rules.
- **Chained proxies**: Configure chained proxies and `relay proxy groups` visually in one click.
- **Precise routing**: Enable more than 30 common proxy groups and over 2,000 remote rule sets.
- **Rule management**: Reorder rules for deeper customization by advanced users.
- **DNS leak prevention**: The default `basic and DNS configuration` helps prevent DNS leaks.
- **Automatic refresh**: Refresh subscriptions on a schedule and intelligently match nodes during refresh.

## Interface Preview


  


## Usage & Deployment

- Online entry: [No deployment required - direct access to the public service](https://subboost.org)
- Deployment docs: [One-click deployment - pulls an image to build, faster with lower requirements](https://docs.subboost.org/deploy/one-click)
- Deployment docs: [Advanced deployment - compiles from source, slower with higher requirements](https://docs.subboost.org/deploy/advanced)
- Configuration guide: [Clash configuration simple enough for a paramecium: configure precise routing and chained proxies from the UI in one click](https://ryanvan.com/t/topic/59?u=ryan)

## Development Notes

Developers can start a local development environment from source:

```bash
npm ci
npm run dev
```

Common checks:

```bash
npm run lint
npm run test:unit
npm run check:local-app
```

## Links

- Online entry: [https://subboost.org](https://subboost.org)
- Deployment docs: [https://docs.subboost.org](https://docs.subboost.org)
- Release announcements: docs/release-notes.md
- Changelog: [https://subboost.org/faq](https://subboost.org/faq)
- Community feedback: [LINUX DO](https://linux.do/) & [IDC Flare](https://idcflare.com/); thanks to everyone in the forums for the active discussion and feedback.

## Star History


 
   
   
   
 


## License

The public SubBoost source code is licensed under the GNU Affero General Public License v3.0 only.

If you modify SubBoost and provide it to users over a network, AGPL-3.0 requires you to offer those users the corresponding source code. The public source entry is SubBoost/subboost.

## Disclaimer

This project does not provide any proxy service and makes no guarantee about the availability or legality of third-party subscription content.
