---
title: "lesnolie/Tigris"
owner: "lesnolie"
name: "Tigris"
fullName: "lesnolie/Tigris"
description: "Tigris — tvOS 26 style launcher for Android TV: Liquid Glass dock, Top Shelf, glass Control Center, photo screensaver. Agent-installable."
sourceUrl: "https://github.com/lesnolie/Tigris"
stars: 110
forks: 7
language: "Kotlin"
topics: []
license: "MIT"
defaultBranch: "main"
snapshotDate: "2026-10-21"
pushedAt: "2026-10-21T04:03:06Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Tigris

把 Android TV 的桌面换成 tvOS 26 的样子：沉底的 Liquid Glass Dock、Top Shelf 式的顶部内容、毛玻璃控制中心、风景照片背景和相框屏保。

> 十二生肖开源系列第三个项目：虎。Tigris 是拉丁语和希腊语里的"老虎"。

**已在索尼 BRAVIA XR-55A80J（Android TV 12）上完整验证。** 其他品牌的电视，交给 AI Agent 按 AGENTS.md 安装和适配，见下文。

*图片：主屏幕*

## 效果图

| 顶部内容（Top Shelf） | 展开全部 App |
|---|---|
| *图片：顶部内容* | *图片：展开* |
| **控制中心** | **相框 / 屏保** |
| *图片：控制中心* | *图片：相框* |

## 让 AI Agent 帮你安装

把下面这句话和仓库链接发给 Codex、Claude Code 这类能执行命令的 Agent 即可：

> 按 https://github.com/lesnolie/Tigris 的 AGENTS.md 把 Tigris 装到我的电视上，电视 IP 是 192.168.x.x

Agent 会按 AGENTS.md 一步步完成：连接电视、安装、设为默认桌面、授权，以及索尼电视的额外配置。过程中电视上会弹出两三次确认框，需要你用遥控器点"允许"。

## 功能

- **主屏幕**：大号细体时钟和日期，5 列 16:9 圆角图标。选中时图标放大、倾斜并带投影。
- **编辑主屏幕**：长按图标进入编辑，用方向键把它拖到任意位置，拖进 Dock 就成了常用 App，和 iPhone、Apple TV 的排列方式一样。
- **删除 App，包括预装的**：长按菜单可以直接删除 App，连电视预装、系统设置里删不掉的也可以（`pm uninstall --user 0`，系统分区里的安装包还在）。删掉的预装 App 不再出现，也不会在后台运行；随时可以在"主屏幕设置 → 已删除的预装 App"里恢复。电视运行必需的组件（设置、电视播放器、输入源、桌面）不提供删除。
- **Liquid Glass Dock**：第一排 App 放在沉底的玻璃板上，下一排只露出上沿，按下键展开全部 App。玻璃的模糊、边缘折射和彩色高光在 CPU 上按当前背景预先算好（Android 12 没有运行时着色器），所以滚动时不额外占用 GPU。
- **顶部内容**：选中 Dock 里的部分 App 时，上半屏轮播它的内容：
  - 云视听小电视：哔哩哔哩热门视频
  - 斗鱼：正在直播的热门直播间

  内容来自这两个服务公开的网页接口，因为国内 App 基本不往 Android TV 的系统频道接口里写数据。
- **控制中心**（遥控器返回键或右上角按钮）：毛玻璃面板，选中的控件会照亮周围的玻璃。包括待机、关机、重启、释放内存、相框、设置，以及亮度、音量和 HDMI 输入源。
- **背景**：必应每日风景照，或 Wallhaven 本月热门二次元壁纸（只取全年龄），每天自动下载，可设置每 15 分钟到 1 天换一张；也可以选纯色渐变。相框屏保跟随所选的图源。
- **相框 / 屏保**：全屏轮播照片，画面缓慢平移缩放，时间文字会定时挪动位置，防止 OLED 烙印。可以手动打开，也可以设为系统屏保。
- **内存清理**：定时清理，电视待机时也会清理一次，保留名单可在设置中修改。

## 哪些功能所有电视都能用

| 功能 | 任意 Android TV（Android 9+） | 需要本机调试授权 | 仅索尼 BRAVIA |
|---|:-:|:-:|:-:|
| 主屏幕、Dock、玻璃效果、投影 | ✅ | | |
| 顶部内容（B站 / 斗鱼） | ✅ 需要装对应的 TV 版 App | | |
| 风景 / 二次元背景、相框 | ✅ | | |
| 控制中心界面、时钟 | ✅ | | |
| 释放内存 | ✅ 只能清理缓存 | ✅ 彻底结束后台 App | |
| 删除预装 App | | ✅ | |
| 待机、关机、重启 | | ✅ | |
| 把相框设为系统屏保、空闲时长 | | ✅ | |
| 音量滑条 | ✅ Android 标准音量 | | ✅ 电视音量 |
| HDMI 输入源切换 | ✅ 大多数电视 | | ✅ 还能显示当前输入源 |
| 亮度（背光）滑条 | | | ✅ |

- **本机调试授权**：App 会连接电视自己的 adb（`127.0.0.1:5555`，基于 dadb）来执行系统命令。前提是电视在开发者选项里打开了"网络调试 / ADB 调试"。首次使用时电视会弹出"允许调试吗？"，勾选"始终允许"即可。这个机制在各品牌电视上都通用。
- **索尼**：电视有 BRAVIA IP 控制接口（`http://127.0.0.1/sony/`）时，亮度、音量和输入源都走这个接口。
- **TCL / 雷鸟国行固件**（社区在雷鸟 75R685C 上验证，#1）：系统没有注册标准输入源，输入源一栏会打开 TCL 自己的信号源选择器；"系统设置"打开 TCL 设置；没有可用的背光接口，亮度滑条隐藏。这类固件拒绝 `adb install`（`INSTALL_FAILED_VERIFICATION_FAILURE`），另一个第三方桌面保持启用时，冷启动后可能弹出桌面选择，用 `pm disable-user` 停用它即可。
- **其他品牌**：自动改用 Android 标准接口。音量用 `AudioManager`；输入源用 `TvInputManager` 列出 HDMI 口，再交给系统的电视播放器切换。Android 没有调背光的标准接口，所以亮度滑条会隐藏。用功放（ARC/eARC）时，标准音量调的可能是电视本身而不是功放。

### 国产电视（非原生 Android TV 系统）

小米、TCL、海信、创维等国产电视大多只认自家桌面：按主页键会回到自带桌面，待机时还会清理第三方 App。除了上面 TCL 的控制中心适配，我们没有这些电视，没法验证，所以 App 里没有内置对付它们的功能。AGENTS.md 里写了一套按"先温和、后强硬"排列的处理办法，全程不需要 root，也不卸载、不停用系统应用；Agent 会在你的电视上逐层尝试，哪一层管用就停在哪一层。

### 想兼容其他品牌电视

这三项都在 `TvControls.kt` 里：先试索尼接口，不行再用 Android 标准接口。要支持某个品牌自己的接口（比如背光），在这里加一个分支就行。

不会写代码也没关系。把下面这句话发给 Agent，它会按 AGENTS.md 的"适配"一节，在你的电视上查找可用的接口、改代码、编译、安装并验证：

> 按 https://github.com/lesnolie/Tigris 的 AGENTS.md 安装 Tigris，如果亮度/音量/输入源在我的电视上不能用，帮我适配。电视 IP 是 192.168.x.x

适配成功后，欢迎提交 PR，让同品牌的人都能用上。

## 手动构建和安装

需要 JDK 17 和 Android SDK（compileSdk 36）。也可以直接下载 Releases 里的 APK。

```sh
./gradlew assembleRelease
adb connect <电视IP>:5555
adb install -r app/build/outputs/apk/release/app-release.apk
adb shell cmd package set-home-activity com.leslie.tvhome/.HomeActivity   # 设为默认桌面
```

索尼电视要用亮度、音量和输入源，还需要注册一次 BRAVIA 客户端：

```sh
BODY='{"method":"actRegister","id":1,"version":"1.0","params":[{"clientid":"tvhome:1","nickname":"TVHome","level":"private"},[{"value":"yes","function":"WOL"}]]}'
curl -s http://<电视IP>/sony/accessControl -d "$BODY"              # 电视屏幕上会显示 4 位 PIN
curl -s -u ":" http://<电视IP>/sony/accessControl -d "$BODY"  # 用这个 PIN 完成注册
```

注册之后 App 会自动续期授权。客户端 ID 是固定的，只有你家局域网里的设备能用它，外网访问不到。

release 包使用 debug 签名，适合自己侧载。

## 许可

代码采用 MIT 许可证。第三方字体、图标和依赖的许可见 THIRD_PARTY_NOTICES.md。

本项目与 Apple、Sony、哔哩哔哩、斗鱼没有关联。截图中的封面、照片版权归各自作者所有。
