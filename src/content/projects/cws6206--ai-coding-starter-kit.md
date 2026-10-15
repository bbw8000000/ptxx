---
title: "CWS6206/ai-coding-starter-kit"
owner: "CWS6206"
name: "ai-coding-starter-kit"
fullName: "CWS6206/ai-coding-starter-kit"
description: "Kuratierte Agent Skills, Checklisten, Templates und Leitfäden für Schweizer Entwicklungsteams – direkt aus meinen Blog-Artikeln destilliert."
sourceUrl: "https://github.com/CWS6206/ai-coding-starter-kit"
stars: 171
forks: 13
language: "未知"
topics: []
license: "GPL-3.0"
homepage: "https://agentic-coding.ch/ressourcen"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-06-05T08:56:11Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# AI Coding Starter Kit

Ein kuratiertes Starter-Kit fuer moderne, agentische Softwareentwicklung mit Claude Code, Codex, Cursor und Gemini CLI.

Dieses Repository sammelt praxistaugliche Agent-Skills, Konfigurationsvorlagen und Sicherheits-Checklisten aus den Ressourcen von [agentic-coding.ch](https://agentic-coding.ch/ressourcen). Ziel ist ein schneller, aber sauber kontrollierter Einstieg in KI-gestuetzte Entwicklungsworkflows: planen, entwickeln, testen, reviewen und absichern.

Copyright by Dr. René Bäder (PhDs)

Lizenz: GNU General Public License v3.0 or later. Siehe LICENSE.

## Was ist drin?

- skills/ - kuratierte Agent-Skills mit Installationsbefehlen, Nutzen und Upstream-Links
- templates/ - CLAUDE.md-, OpenAI-, Gemini-, Gemma- und Security-Template-Quellen
- SECURITY.md - Review-Checkliste fuer Skills vor der Installation
- NOTICE - Quellen-, Copyright- und Drittanbieterhinweise
- LICENSE - GNU GPL v3.0

## Schnellstart

1. Waehle einen Skill aus der Tabelle oder aus skills/.
2. Pruefe Quelle, Lizenz und Maintainer des Upstream-Repositories.
3. Arbeite die Sicherheitspruefung in SECURITY.md durch.
4. Installiere den Skill zuerst in einem Testprojekt oder einer isolierten Umgebung.
5. Nutze den Skill erst produktiv, wenn Verhalten, Berechtigungen und Netzwerkzugriffe plausibel sind.

## Empfohlene Agent-Skills

| Skill | Fokus | Kompatibel mit | Installation |
| --- | --- | --- | --- |
| Planning with Files | persistente Aufgabenplanung | Claude Code, Codex, Cursor, Gemini CLI | `npx skills add OthmanAdi/planning-with-files` |
| Firecrawl | Web-Scraping und Browser-Automation | Claude Code, Codex, Cursor, Gemini CLI | `npx -y firecrawl-cli@latest init --all --browser` |
| Superpowers | strukturierter Entwicklungsworkflow | Claude Code, Codex, Cursor | `npx skills add pbakaus/impeccable --skill superpowers` |
| Vercel Web Design Guidelines | UI, UX und Accessibility | Claude Code, Codex, Cursor, Gemini CLI | `npx skills add vercel/agent-skills --skill web-design-guidelines` |
| Trail of Bits Security Audit | CodeQL, Semgrep, Security-Audits | Claude Code, Codex | `npx skills add trailofbits/agent-skills` |
| Composio | SaaS-Integrationen | Claude Code, Codex, Cursor | `npx skills add composiohq/skills` |
| Remotion Best Practices | programmatische Videos mit React | Claude Code, Codex, Cursor | `npx skills add remotion-dev/skills --skill remotion-best-practices` |
| WarpGrep | Codex Codebase-Suche | Codex | siehe Skill-Datei |
| gh-fix-ci | automatische CI-Fehlerkorrektur | Codex, Claude Code | `$skill-installer gh-fix-ci` |
| Gemini API Dev | Gemini-App-Entwicklung | Gemini CLI, Claude Code, Codex, Cursor | `npx skills add google-gemini/gemini-skills --skill gemini-api-dev --global` |
| Gemini Live API Dev | Echtzeit-Streaming mit Gemini Live API | Gemini CLI, Cursor | `npx skills add google-gemini/gemini-skills --skill gemini-live-api-dev --global` |

## Templates

Unter templates/ findest du Quellen fuer:

- CLAUDE.md Second Brain Template
- CLAUDE.md Security Testing Template
- CLAUDE.md Code Review Template
- CLAUDE.md Full-Stack Development Template
- ChatGPT / OpenAI Konfigurationstemplate
- Google Gemini Konfigurationstemplate
- Gemma 4 lokales Konfigurationstemplate
- Skill Security Review Checkliste

## Sicherheit

Agent-Skills koennen Shell-Befehle, Browser-Automation, Netzwerkzugriffe oder Dateisystemoperationen anstossen. Behandle sie deshalb wie produktive Entwickler-Tools:

- installiere keine ungeprueften Skills global
- pruefe `SKILL.md`, Installationsskripte und Dependencies
- teste zuerst ohne produktive Secrets
- dokumentiere Freigaben in regulierten Umgebungen
- entferne ungenutzte Skills wieder

Die vollstaendige Checkliste steht in SECURITY.md.

## Quelle

Die Skill- und Ressourcenliste basiert auf:

[Agentic Coding Ressourcen & Downloads](https://agentic-coding.ch/ressourcen)

Einzelne Drittanbieter-Skills bleiben Eigentum ihrer jeweiligen Upstream-Autorinnen und -Autoren und koennen eigene Lizenzen haben. Dieses Repository dokumentiert und kuratiert diese Quellen fuer einen einfacheren Einstieg.

## Lizenz

Dieses Starter-Kit steht unter der GNU General Public License v3.0 or later.

Copyright by Dr. René Bäder (PhDs)
