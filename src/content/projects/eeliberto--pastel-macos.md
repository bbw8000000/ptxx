---
title: "EEliberto/Pastel-macOS"
owner: "EEliberto"
name: "Pastel-macOS"
fullName: "EEliberto/Pastel-macOS"
description: "一款用于安装 IPA 历史版本的工具，适用于获取旧版应用并自动捕获数据包。下载后，可直接通过 AirDrop 传输至 iPhone、iPad 上并安装并使用。"
sourceUrl: "https://github.com/EEliberto/Pastel-macOS"
stars: 1877
forks: 123
language: "Swift"
topics: []
license: "Apache-2.0"
defaultBranch: "main"
snapshotDate: "2026-09-28"
pushedAt: "2026-09-07T02:05:08Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

Pastel
  为 macOS 打造的原生 IPA 历史版本下载工具
  搜索 App、查找历史版本，并将 IPA 轻松传输到 iPhone 或 iPad。

  
    
    
    
    
  

  
    下载最新版
    ·
    提交问题
    ·
    源码构建
  


---

> [!IMPORTANT]
> **2026 年 8 月 31 日更新通知**
>
> Pastel 已尝试适配 Apple 最新的账户登录调整，当前登录协议与安全检查参考 majd/ipatool。20260831 是强制更新版本，请务必下载最新版。新的认证方式要求在真实的 Apple Silicon Mac 上运行；虚拟机环境仍然无法登录或下载 IPA。

## Pastel 能做什么

| 能力 | 说明 |
| --- | --- |
| App Store 搜索 | 浏览并搜索不同地区 App Store 中的 App |
| 历史版本查询 | 聚合多个版本来源，也支持手动输入 App ID 与版本 ID |
| Apple 账户匹配 | 根据账户所属地区自动选择商店，并在切换地区时匹配对应账户 |
| IPA 下载与管理 | 下载从 Apple 获取的 IPA，在 App 内查看文件及 App 图标 |
| 快速传输 | 通过系统分享菜单或 AirDrop 将 IPA 发送到 iPhone、iPad |
| 完整代理支持 | 遵循 macOS 的 HTTP、HTTPS、SOCKS5、`ALL_PROXY`、`NO_PROXY` 及系统排除项规则 |

## 主页面

在对应地区的 App Store 中搜索 App。Pastel 会根据所选 Apple 账户的地区自动选择商店，并在切换地区时匹配已登录的对应账户。


  


  


## 下载与管理

下载页面集中展示已经获取的 IPA 文件及对应 App 图标。选择分享按钮，即可通过 AirDrop 发送到 iPhone 或 iPad。


  


## 版本来源

Pastel 聚合 Timbrd、Agsy 与 Bilin 的版本 ID 信息，也可以直接从 Apple 账户获取 App 的版本记录。若账户从未拥有该免费 App，Pastel 会尝试先完成获取；付费 App 除外。

如果已经知道目标版本 ID，也可以直接手动输入并下载。


  


## 初次使用

1. 从 GitHub Releases 下载最新 DMG，并将 Pastel 拖入“应用程序”。
2. 打开 Pastel，前往“设置” → “Apple 账户”。
3. 添加 Apple 账户并按提示完成双重认证。
4. 登录成功后，Pastel 会识别账户所属地区并完成商店配置。

账户登录信息保存在系统 iCloud 钥匙串中。Pastel 的认证流程依赖 macOS 自带的 StoreServices，因此必须使用真实的 Mac，虚拟机环境不受支持。


  


## 系统要求

| 项目 | 要求 |
| --- | --- |
| 操作系统 | macOS 26 或更高版本 |
| 处理器 | Apple Silicon |
| 运行环境 | 真实 Mac，不支持虚拟机 |
| 网络 | 需要能够访问 Apple 服务；网络不稳定时建议使用代理 |

Pastel 采用 SwiftUI 构建，并适配 macOS 26 的 Liquid Glass。当前提供简体中文、繁体中文、日语、韩语和泰语界面。


  


## 源码构建

首次克隆后，先安装 Node.js 依赖：

```bash
cd NodeProject
npm install
cd ..
```

随后使用 Xcode 打开 `Pastel.xcodeproj` 并构建运行。

## 鸣谢

- Apple 登录协议与安全检查参考 majd/ipatool。
- 部分代码与实现原理参考 beer-psi/ipatool.ts。
- GSA 登录流程依赖 SideStore。
- Device GUID 逻辑参考 Lakr233/Asspp。
- 多语言翻译由 Claude 协助完成。

## 许可证

本项目采用 Apache License 2.0 开源许可证。

---


  如果 Pastel 对你有帮助，欢迎 Star 本项目；遇到问题请前往 GitHub Issues。
