---
title: "0rangec3t/Black-cat"
owner: "0rangec3t"
name: "Black-cat"
fullName: "0rangec3t/Black-cat"
description: "Claude Code RedTeam Skill — Hypothesis-Driven Cognitive Architecture。一个假设-证据驱动的红队skill"
sourceUrl: "https://github.com/0rangec3t/Black-cat"
stars: 166
forks: 23
language: "Python"
topics: ["pentest", "pentest-tools", "red-team"]
license: "未标注"
defaultBranch: "master"
snapshotDate: "2026-08-02"
pushedAt: "2026-07-31T09:38:37Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Black cat


  


一只头戴女巫帽的魔法黑猫。
Claude code Redteam skill

## 做这个 Skill 的原因

最近一直在看自动化渗透相关，尝试性写了几个框架，但是最后效果都不太满意。相反，之前当玩具写的 Skill 放在 Claude Code 里面，效果却出乎意料地好。

本 Skill 主要使用**假设—证据驱动**，为了模仿人在真实场景下的渗透测试。

## 与市面上所有 pentest skill 的本质区别

市面上的 pentest skill 都是 **Pipeline（流水线）**：Recon → Scan → Exploit → Report。每个 phase 绑定固定工具，失败就跳到下一步，没有回边。

我们的设计是 **State Machine（状态机）**：RECON ⇄ ENUMERATE ⇄ VALIDATE。证伪、失败和新发现都可以回到前面的状态重新开始。横向移动成功后在新目标上重启 RECON。

| 维度 | 市面 skill | 本 skill |
|------|-----------|---------|
| 驱动方式 | Tool-first（到这个 phase 就该跑 nmap） | **Hypothesis-first**（看到什么信号 → 形成假设 → 验证） |
| 流程模型 | 单向 Pipeline | **有回边的 State Machine** |
| 失败处理 | 跳到下一步（sqlmap negative = 没有 SQLi） | **证伪产生新假设**（sqlmap negative = 大概率 ORM → 转查 Mass Assignment） |
| 证据 | 孤立截图 | **可追溯因果链** Observation → Reproduction → Impact |
| 目标切换 | 不支持 | **状态机重启**：进入新网段 → 新 RECON |
| 运行时追踪 | 无或分散文件 | **单一 JSONL Ledger**（hypothesis/evidence/verdict） |
| 上下文管理 | 全部加载 | **显式文件路由**，活跃技术目录默认 1 个、最多 2 个 |
| 清理义务 | 无 | **Artifact + Evidence** 追踪清理状态 |
| 决策记录 | 隐式 | **Verdict reason** 记录每个 Gate 的选择和理由 |
| 交付校验 | 无 | **`verify --report` 机器关口**：REPORT 前 confirmed 三角色闭环、无遗留 provisional |

## v1.1.0 更新内容

### 调整：授权 Gate 一次性确认

- 授权在**加载 skill 时确认一次**，此后整个会话不再重复确认；超出锁定范围或存在歧义的操作**默认先做**，仅在授权文档明确禁止时才不做。
- 消除了中途越界时的暂停询问流程，减少打断。

### 新增：provisional 裁决 + REPORT 机器关口

- `case_ledger.py verdict --status provisional`：只需 observation+reproduction 即可推进，「验证即 PoC」时不再要求先写完整证据链；impact 到 POST-EXPLOIT 补齐、confirmed 在此后追加。
- 新增 `case_ledger.py verify --report`：REPORT 前**机器校验**所有 confirmed 三角色闭环、无遗留 provisional，缺了直接报错。
- 黑板新增「已确认·待补影响」分组。

### 新增：黑板自动折叠

- 黑板超过 8000 字符时自动折叠已了结（暂缓）假设与过长的活跃证据列表，带「已折叠 N 条」标记，**不静默截断**；完整明细始终在 `case/evidence-validation.md`。
- 大规模多资产 case 不再因状态累积而溢出。

### 新增：运行时适配与工具降级

- SKILL.md 新增运行时小节：Unix 命令按平台映射到 Windows 等价（`Resolve-DnsName` / `curl.exe` / `Select-String` 等），工具缺失按「首选 → 替代 → 手动/API → 记录限制」降级链处理。
- 硬性规则：**禁止虚构命令输出**——工具未安装或执行失败时如实标注。

### 调整：状态机分模式

- L2 状态表拆分 Focused / Engagement 两档：Focused 默认不建 ledger、≥1 个 Active 假设；Engagement ≥2 个、全部走 ledger。
- 解决单目标与多资产模式的产出要求矛盾（原「Focused 一个假设」与「ENUMERATE 至少 2 个 Active」冲突）。

### 新增：中文案件黑板

- 使用 `case/ledger.jsonl` 作为 hypothesis / evidence / verdict 的唯一机器真相源，保持 append-only，不再维护并行 tracker。
- Claude Code 通过 `.claude/settings.json` 的 `SessionStart` Hook，自动注入**已确认事实、已确认·待补影响（provisional）、活跃/暂缓假设和错误状态**。
- 每次写入后由 CLI 返回中文黑板增量，让 agent 在长会话和上下文压缩后仍能恢复当前判断。
- 自动生成 `case/evidence-validation.md`，作为可阅读、可审计的证据验证报告；该文件由 ledger 重建，不手工维护。
- 原始响应、日志和截图统一放入 `case/artifacts/`，ledger 只记录相对路径、SHA-256 和短摘要。

### 修复：黑板运行时稳定性

- 报告渲染改用唯一随机临时文件，避免并发运行互相覆盖。
- Windows 文件被短暂占用时自动重试替换，失败后清理残留 `.tmp` 文件。
- 报告内容没有变化时跳过重写，减少无意义的文件变更和 Hook 抖动。
- 非 UTF-8 或损坏的可视化报告可从 JSONL ledger 自动重建。
- 将 **Ledger Integrity** 与 **Report I/O** 错误分开报告，避免把渲染失败误判为证据链损坏。

### 新增：独立 Recon 技术目录

- 新增 `techniques/recon.md`，把信息收集从 Web 漏洞利用中拆出，减少单文件体积和无关上下文加载。
- 增加版本控制与备份泄露、Wayback/Common Crawl 历史 URL、被动 DNS、SPF/DMARC、ASN/BGP/C 段和邮件头源站定位。
- 增加国内 Recon 路径：ICP 备案反查、FOFA `fid` 聚类与蜜罐降噪、微信小程序、APP 静态提取、股权穿透和 ENScan_GO 聚合。

### 调整：Web 技术目录收敛

- `techniques/web.md` 只负责 Web/API 漏洞发现与利用，Recon 信号显式路由到 `techniques/recon.md`。
- 根 Skill 继续采用显式文件路由：默认只加载 1 个 technique，跨域任务最多加载 2 个，避免 Skill 随能力增长而臃肿。

### 从 v1.0.0 升级

- 保留仓库根目录的 `.claude/settings.json`，否则 Claude Code 不会在 `SessionStart` 自动加载案件黑板。
- 旧版 `engagement-tracker.md` 已由 `case/ledger.jsonl` 取代；可视化结果查看 `case/evidence-validation.md`。
- 不要手工编辑生成报告；需要恢复时运行 `python -X utf8 skills/pentest-redteam/scripts/case_ledger.py render case`。

## 架构

```
┌─────────────────────────────────────────────┐
│  SKILL.md（轻量核心）                        │
│  L1: 授权与硬约束                            │
│  L2: 有回边的 State Machine + Decision Gates │
│  L3: 信号 → 动作链                           │
├─────────────────────────────────────────────┤
│  7 个 technique 文件（显式文件路由）          │
│  信号→假设→验证→证实→证伪→升级               │
│  默认 1 个，最多 2 个                        │
├─────────────────────────────────────────────┤
│  case/ledger.jsonl (唯一机器真相源)          │
│  hypothesis → evidence → verdict             │
│  artifacts/ + 自动生成 evidence-validation.md│
└─────────────────────────────────────────────┘
```

### 文件结构

```
.claude/settings.json            # SessionStart Hook：注入案件黑板
skills/pentest-redteam/
├── SKILL.md                     # L1+L2+L3 核心框架
├── techniques/
│   ├── web.md                   # Web漏洞发现 + 利用
│   ├── recon.md                  # 信息收集：通用资产发现 + 国内拓线（测绘引擎/小程序/APP/股权）
│   ├── ad.md                    # 内网三阶段：信息收集→OPSEC横向→提权维持
│   ├── cloud.md                 # 容器逃逸/K8s/IAM/Serverless
│   ├── evasion.md               # 免杀/EDR对抗/C2隐匿 + BOF开发 + Telemetry分散
│   ├── database.md              # MySQL/PG/MSSQL/Oracle/NoSQL
│   └── reversing.md             # APK/IPA/EXE/固件逆向
├── scripts/
│   └── case_ledger.py           # hypothesis/evidence/verdict + provisional + verify --report / render / blackboard
└── templates/
    ├── finding-report.md        # 单个 Finding 格式
    └── engagement-report.md     # 最终报告模板

case/
├── ledger.jsonl                 # 唯一机器真相源
├── evidence-validation.md       # 自动生成的可视化证据报告
└── artifacts/                   # 原始响应、日志、截图
```

## 攻击面覆盖

### 信息收集（recon.md）
**通用**
- CDN 绕过 + 内部主机名泄露（多引擎 SSL 证书/Favicon/CT 日志全量采样）
- JS Source Map 源码还原 + 端点提取（unwebpack-sourcemap → LinkFinder → SecretFinder）
- 企业拓线（GA/Hotjar 追踪 ID 反向查询 + ICP 备案反查 + CI/CD 制品扫描）
- 补充 Recon（版本控制/备份泄露 + Wayback/CommonCrawl 历史 URL + 被动 DNS 反查 + SPF/DMARC 关联 + ASN/C 段 + 邮件头找源站）
**国内特有**
- 测绘引擎进阶（ICP 备案号反查主体 + FOFA fid 聚类 + 蜜罐净化 + == / != / ip_ports 降噪 + body 找裸奔源站 + 测试环境定向）
- 企业拓线（微信小程序 wxapkg 反编译 + 七麦/点点 APP 反查与静态提取 + 天眼查股权穿透 + ENScan_GO 多维聚合）

### Web 渗透（web.md）
- API Fuzzing（Kiterunner 路由爆破 + HTTP Method 切换 + deprecated 端点）
- GraphQL 攻击面（Introspection / 别名过载 / 批处理 / 订阅劫持，跳过 DoS）
- 供应链攻击（6 生态依赖混淆 + CI/CD 审计 + Octoscan repo-jacking 检测）
- ORM Leaking（跨 Django/Prisma/Beego/Entity Framework/OData，比较操作符二分提取）
- 递归请求利用 RRE（多步骤 API 流程状态机遍历找鉴权缺口，DEF CON 33）
- Delimiter Smuggling（跨组件解析器分隔符语义差异走私，DEF CON 33）
- WAF 绕过 8 种策略（HPP/HPF/编码/正则逆向工程）
- 反序列化（Java/PHP/.NET 完整 Gadget 链）
- ★ Fastjson 1.x CVE-2026-16723（@JSONType 注解绕过，不需 AutoType/gadget/JNDI）
- ★ Fastjson 2.x（FNV-1a 哈希碰撞绕过，≤ 2.0.62，不做字符串等值验证）
- SSRF 完整升级链（8 种 IP 编码 + 盲 SSRF 转可见重定向链 + Redis 主从 RCE）
- SSTI 沙箱逃逸（44+ 引擎 Polyglot + 继承链遍历）
- XXE 7 种变体 + SAML Void Canonicalization 签名绕过
- JWT/SAML 认证绕过（算法混淆 + 空签名 + XSW1-XSW8）

### AD / 内网（三阶段：信息收集→OPSEC横向→提权维持）

**Phase 1 — 信息收集（零命令行，全部 BOF/原生 API）**：
- BloodHound CE v4.3+ 采集（含 AzureHound Entra ID + OpenGraph 跨平台）
- 15 条命令→API 映射表（GetExtendedTcpTable替代netstat、GetAdaptersAddresses替代ipconfig、LDAP直连替代net group 等）
- Ghost SPNs + Kerberos Reflection（CVE-2025-58726）+ lolol.farm 综合索引

**Phase 2 — OPSEC 横向（零进程创建）**：
- PTH/PTT 通过原生 API（COM WMI/原生 SCManager/BOF WinRM）
- MSSQL Linked Server 链式横向 + Kerberos 反射横向 + RMM 工具滥用（LOLRMM）
- Windows Admin Center 反射 RPE（CVE-2026-26119）+ Dev Tunnels/LOT Tunnels

**Phase 3 — 提权与维持**：
- ADCS ESC14-17（altSecurityIdentities/Application Policy/安全扩展禁用/Certighost）
- BadSuccessor dMSA→域管（DEF CON 33）+ LSA 保护绕过（nanodump multilayered）
- AD 持久化 9 种 + Entra ID 混合持久化（EntraGoat 六大场景）+ AAD Connect 密码提取

### 云环境
- Copy Fail CVE-2026-31431 无特权容器逃逸
- 容器逃逸 11 种路径全集（CDK）
- badPods 五维风险分级
- K8s Admission Webhook 后门 + etcd 直接访问
- Shadow API Server 持久化
- IMDS 元数据探测 + IAM 权限枚举
- AWS IAM 信任策略后门 + sts:GetFederationToken 存活
- Lambda Serverless 后门（Extension 注入）
- Azure AD Connect 密码提取

### 免杀 / EDR 对抗

**工具链免杀开发（BOF + 原生 API）**：
- BOF 开发方法论（Dynamic Function Resolution/栈字符串/符号解析）
- 15 条命令→API 对照表（GetExtendedTcpTable/GetAdaptersAddresses/LDAP直连等）
- 4 种内网免杀模式（全BOF/.NET内存执行/间接syscall/LOL+参数混淆）
- 6 项内网免杀检查清单

**Telemetry 分散与进程拆分**：
- 进程分叉 + 操作拆分（Divide and Conquer——父子孙进程拆分注入链）
- 无线程进程注入（Entry Point Hijacking——修改PE入口点劫持执行流）
- SysWhispers4（Win11 24H2 + ARM64 + WoW64 全架构）

**内容免杀**：
- AI 免杀管线（Trae+Skills 迭代 + LLVM IR 混淆 + LLM 反推规则）
- Ankou Poly Engine + COFF Mixing
- AMSI WRITE RAID（零 VirtualProtect）+ AMSI 5 层复合 + ETW 完全禁用

**运行时对抗**：
- EDR-GhostLocker（AppLocker 反制 EDR）+ Kernel Callback Removal + BYOVD 终结链
- 硬件断点调用栈欺骗（hw-call-stack）+ SilentMoonwalk ROP 解同步
- Caro-Kann 两阶段绕过（EDR 扫描时机差）

**C2 隐匿**：
- Dev Tunnels C2（Ouroboros）+ 6 信道隐匿 + Cavern C2 7 层反分析

### 数据库
- MySQL Rogue Server 客户端攻击 + FEDERATED 链式横向
- MySQL general_log 写 Webshell + UNC Path NTLM 窃取
- PostgreSQL COPY PROGRAM RCE + PL/PythonU RCE
- MSSQL xp_cmdshell + OLE Automation + CLR 程序集 RCE
- MSSQL Linked Server 多级链式横向
- Oracle DBMS_SCHEDULER + TNS Poisoning
- MongoDB NoSQL 注入 + Redis 未授权 RCE 5 条路径

### 逆向
- Android 加固检测 + 脱壳（FART/FRIDA-DEXDump/Youpk）
- JNI/SO 层 Frida hook + 动态调试
- SSL Pinning 绕过 + 移动端 API 提取
- iOS 砸壳 + Keychain dump
- 二进制补丁 Diff 反推漏洞（Ghidriff + AutoPiff）
- .NET 反编译/反混淆（de4dot + dnSpy）
- 固件提取与解包（binwalk） + U-Boot 分析


## 使用方式

### 安装

将下面这句话发给 Claude Code：

> 帮我安装 https://github.com/0rangec3t/Black-cat

### 使用

在 Claude Code 中加载 skill：

```
/skill pentest-redteam
```

或直接在对话中描述目标，skill 会自动按信号匹配技术目录。

**授权声明**：本 skill 仅用于已明确授权的渗透测试。授权在加载 skill 时一次性确认，此后按锁定范围执行；超出授权范围的操作默认先做，仅在授权文档明确禁止时才不做。

## 未完待续......

## Star 趋势
