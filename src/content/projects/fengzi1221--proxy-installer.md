---
title: "FengZi1221/proxy-installer"
owner: "FengZi1221"
name: "proxy-installer"
fullName: "FengZi1221/proxy-installer"
description: "一个面向新手的 Windows 桌面工具，通过 SSH 连接 VPS，自动检测环境并部署 Hysteria2、VMess、VLESS Reality、Trojan、Shadowsocks 节点。全自动安装节点的工具，并且自动生成适用于小火箭/Clash Meta/Sing-Box/V2rayNG的订阅链接"
sourceUrl: "https://github.com/FengZi1221/proxy-installer"
stars: 201
forks: 28
language: "Go"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-04T19:27:10Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Proxy Installer

*图片：Platform*
*图片：Linux*
*图片：Protocols*
*图片：License*
*图片：Release*

Proxy Installer 是一款面向新手的 Windows 桌面 VPS 节点部署工具。它可以通过 SSH 连接 Linux VPS，自动检测服务器环境，并一键部署 Hysteria2、VLESS Reality、VMess、Trojan、Shadowsocks 等常见代理协议，同时生成适用于 Shadowrocket、Clash Meta / Mihomo、V2rayNG、sing-box 等客户端的订阅信息。

如果你正在寻找 **VPS 一键搭建节点工具**、**Hysteria2 Windows 部署工具**、**VLESS Reality 可视化安装器**、**Shadowrocket 订阅生成工具**、**Clash Meta 节点部署工具**、**sing-box 节点管理工具**，Proxy Installer 可以帮助你减少命令行操作，把连接、检测、部署、测速、日志和清理集中到一个轻量桌面应用里。

## 功能特性

- 通过 SSH 保存并连接 VPS，支持主机、端口、root 用户和密码配置
- 自动检测 Linux 发行版、内核、CPU、内存、硬盘、公网 IPv4、IPv6、NAT、虚拟化类型和常用工具状态
- 支持 Hysteria2、VLESS Reality、VMess、Trojan、Shadowsocks 多协议部署
- 支持内部端口和公网端口分离，适配 NAT VPS、端口转发 VPS 和普通公网 VPS
- 自动安装依赖、检测端口占用、写入 sing-box 配置、配置 nginx 订阅服务
- 生成 Shadowrocket、Clash Meta / Mihomo、V2rayNG、sing-box 等客户端可用的订阅链接
- 支持节点延迟测试、VPS 出口测速、通过节点代理测速和速度损耗对比
- 支持 IP 纯净度检测报告，可视化展示基础信息、风险信号、流媒体 / AI 服务、邮件 / 黑名单结果
- 支持部署进度条、实时日志、失败日志复制和错误定位
- 支持扫描本工具在 VPS 上留下的配置、订阅文件、服务和临时日志，并可选择性清理
- 支持 Windows 托盘后台运行，关闭窗口后可从右下角托盘恢复或退出
- 本地保存 SSH 配置和历史状态，避免每次重新添加服务器

## 支持协议

| 协议 | 适用场景 | 客户端兼容 |
| --- | --- | --- |
| VLESS Reality | 推荐协议，适合伪装 TLS 流量 | Shadowrocket、Clash Meta / Mihomo、V2rayNG、sing-box |
| Hysteria2 | UDP 传输，适合高延迟或丢包网络 | Shadowrocket、sing-box、Clash Meta / Mihomo |
| Trojan | 兼容性强，适合传统 TLS 节点 | Shadowrocket、Clash Meta / Mihomo、V2rayNG |
| Shadowsocks | 轻量通用，配置简单 | Shadowrocket、Clash Meta / Mihomo、V2rayNG、sing-box |
| VMess | 兼容旧版 V2Ray 客户端 | V2rayNG、Shadowrocket、Clash Meta / Mihomo |

## 支持的远程系统

Proxy Installer 面向带 systemd 的 Linux VPS，部署阶段会自动识别包管理器并安装必要依赖。

| 包管理器 | 常见发行版 |
| --- | --- |
| apt | Debian、Ubuntu |
| dnf | Fedora、Rocky Linux、AlmaLinux、RHEL |
| yum | CentOS、旧版 RHEL 系发行版 |
| pacman | Arch Linux |
| zypper | openSUSE |

> LXC、KVM、NAT VPS、IPv4 only、IPv6 only、双栈 VPS 的实际可用性取决于服务商网络、防火墙策略、系统源状态和目标地区网络质量。

## 下载与安装

前往 Releases 下载最新版安装包：

```text
proxy-installer-setup-amd64.exe
```

安装后默认目录：

```text
%LOCALAPPDATA%\proxy-installer\app
```

本地数据目录：

```text
%LOCALAPPDATA%\proxy-installer\data
```

常见数据会按用途拆分保存到 `profiles`、`reports`、`logs`、`cache`、`runtime` 等目录。

## 快速开始

1. 打开 Proxy Installer
2. 在 VPS 管理页面添加 SSH 配置
3. 点击连接并查看 VPS 状态检测结果
4. 在节点部署页面选择 VPS、协议、端口和高级配置
5. 点击开始部署，等待进度条完成
6. 部署成功后查看订阅信息，并导入 Shadowrocket、Clash Meta / Mihomo、V2rayNG 或 sing-box
7. 在测速中心进行延迟测试、出口测速、节点测速和 IP 纯净度检测

## IP 纯净度与测速

Proxy Installer 内置面向 VPS 节点场景的 IP 检测报告，重点展示以下信息：

- 公网 IPv4 / IPv6
- ASN、ISP、国家和城市
- Proxy、Hosting、Mobile、住宅 IP、广播 IP 等风险信号
- Netflix、YouTube、Disney+、TikTok、Reddit、OpenAI、ChatGPT 等流媒体和 AI 服务连通性
- Gmail、Outlook、Yahoo、iCloud、QQ Mail、Mail.ru 等邮件连通性
- DNSBL 黑名单、SMTP 25、WARP、Cloudflare 边缘信息等网络特征

测速中心支持两类对比：

- VPS 直连出口测速，用于判断服务器本身带宽
- 通过节点代理测速，用于判断部署后的真实速度损耗

## NAT 与 IPv6 支持

Proxy Installer 支持内部端口和公网端口独立配置，适合以下场景：

- NAT VPS 只有转发端口
- 公网端口和容器内部端口不一致
- IPv6 only VPS
- IPv4 出口异常但 IPv6 可用的 VPS
- 双栈 VPS 需要同时监听 IPv4 和 IPv6

部署前建议确认服务商控制台安全组、防火墙和端口转发规则已经放行对应 TCP / UDP 端口。

## 维护与清理

维护清理页面会扫描本工具可能部署或写入的内容，包括：

- `/etc/proxy-installer`
- `/var/www/proxy-installer`
- `/etc/nginx/conf.d/proxy-installer.conf`
- `/etc/sing-box/config.json`
- sing-box systemd service
- 部署过程中的临时日志

普通清理会尽量只删除 Proxy Installer 自己创建的目录、订阅文件、nginx 片段和临时日志。深度清理会额外尝试移除 sing-box 二进制和 systemd service，请在确认该 VPS 没有其他业务依赖 sing-box 后再使用。

## 本地数据与隐私

Proxy Installer 是本地桌面工具，不依赖中心化账号系统。SSH 配置、测速报告、部署日志和运行缓存默认保存在本机：

```text
%LOCALAPPDATA%\proxy-installer\data
```

请只在可信电脑上保存 VPS 密码。发布 issue、提交日志或向他人求助时，请先检查并删除敏感信息，例如服务器密码、私钥、订阅 token、真实域名和不希望公开的 IP 地址。

## 从源码构建

本项目使用 Wails、Go、React 构建 Windows 桌面应用。

```bash
git clone https://github.com/FengZi1221/proxy-installer.git
cd proxy-installer

cd frontend
npm install
cd ..

wails dev
```

构建生产版本：

```bash
wails build
```

如果需要生成 Windows 安装包，请在 Windows 环境安装 Wails、Go、Node.js 和 NSIS 后执行项目内的打包脚本。

## 常见问题

### GitHub 或 sing-box 下载失败怎么办？

部分 VPS 的 IPv4、IPv6、DNS 或到 GitHub 的路由可能异常。Proxy Installer 会先进行网络探测，并在远端下载失败时尝试由本机下载 sing-box 后上传到 VPS。如果仍然失败，请复制部署日志进行排查。

### 部署失败后会留下残留吗？

部署中断可能会留下临时日志、部分配置文件或已安装依赖。可以进入维护清理页面扫描本工具痕迹，并按协议或项目选择性清理。

### 支持非 root 用户吗？

当前主要面向新手的一键部署流程，默认使用 root 或具备完整 sudo 权限的用户。普通用户可能无法安装依赖、写入 systemd service、配置 nginx 或开放防火墙端口。

### 这是 VPN 客户端吗？

不是。Proxy Installer 主要用于连接 VPS、检测环境、部署代理节点、生成订阅和进行测速。实际客户端仍然是 Shadowrocket、Clash Meta / Mihomo、V2rayNG、sing-box 等工具。

## 适用关键词

VPS 节点部署、VPS 一键脚本、Hysteria2 安装器、VLESS Reality 部署、VMess 节点、Trojan 节点、Shadowsocks 节点、Shadowrocket 订阅、Clash Meta 订阅、Mihomo 订阅、V2rayNG 节点、sing-box 图形化、Linux VPS 检测、IP 纯净度检测、VPS 测速工具、NAT VPS 端口转发、IPv6 VPS 节点、Windows VPS 管理工具。

## 免责声明

Proxy Installer 仅用于服务器运维学习、个人网络环境测试和合法合规的自有 VPS 管理。使用者应遵守所在地法律法规、云服务商条款和目标网络服务规则。因不当使用造成的风险由使用者自行承担。

## 开源协议

本项目基于 MIT License 开源。
