---
title: "huacnlee/omarchy-mihoro"
owner: "huacnlee"
name: "omarchy-mihoro"
fullName: "huacnlee/omarchy-mihoro"
description: "Omarchy plugin to display Mihoro status."
sourceUrl: "https://github.com/huacnlee/omarchy-mihoro"
stars: 48
forks: 1
language: "QML"
topics: ["clash", "mihoro", "omarchy"]
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-08-18"
pushedAt: "2026-08-17T16:15:04Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Mihoro for Omarchy

An Omarchy bar panel for mihoro, the
Mihomo CLI client for Linux.


Use it to monitor your proxy, switch between Rule, Global, and Direct modes,
and manage your subscription.

## Requirements

- Omarchy
- The mihoro CLI

## Getting Started

Install mihoro:

```bash
curl -fsSL https://raw.githubusercontent.com/spencerwooo/mihoro/main/install.sh | sh
```

Initialize it and enter your subscription URL when prompted:

```bash
mihoro init
```

For TUN mode, grant mihomo the required capabilities and restart it:

```bash
sudo setcap cap_net_admin,cap_net_raw,cap_net_bind_service=+ep ~/.local/bin/mihomo
getcap ~/.local/bin/mihomo
systemctl --user restart mihomo.service
```

Install the Omarchy plugin:

```bash
omarchy plugin add https://github.com/huacnlee/omarchy-mihoro.git --enable
```

Remove the Omarchy plugin:

```bash
omarchy plugin remove mihoro.omarchy
```

If mihomo does not start, inspect its recent logs:

```bash
journalctl --user -u mihomo.service -n 30 --no-pager
```

## Development

```bash
./install.sh --no-restart
make test
make validate
```

## License

MIT. mihoro and mihomo are distributed separately under their own licenses.
