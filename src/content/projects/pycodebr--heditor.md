---
title: "pycodebr/heditor"
owner: "pycodebr"
name: "heditor"
fullName: "pycodebr/heditor"
description: "Creative vertical video editing skill for AI agents (Claude Code, Codex, OpenCode, Cursor, Hermes): named styles, creative mode, HyperFrames + voice-first mix."
sourceUrl: "https://github.com/pycodebr/heditor"
stars: 58
forks: 5
language: "Python"
topics: ["agent-skills", "ai-agents", "claude-code", "codex", "ffmpeg", "hyperframes", "motion-graphics", "opencode"]
license: "NOASSERTION"
defaultBranch: "main"
snapshotDate: "2026-10-14"
pushedAt: "2026-10-14T02:26:06Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# 🎬 heditor

**Skill de edição criativa de vídeos verticais para agentes de IA.**
Transforma uma gravação de alguém falando (aula, live, podcast, talking head) em um Reel/Short/TikTok 1080×1920 com motion graphics, legendas sincronizadas, efeitos sonoros e trilha emocional, em estilos nomeados, em **modo criativo** ou em **modo criativo com referência** ("no estilo GTA 6").

*图片：License: MIT*
*图片：Agent Skills*
*图片：Claude Code*
*图片：Codex*
*图片：OpenCode*
*图片：Hermes*
*图片：Cursor*

Feito pela PycodeBR · Felipe Azambuja · English below


---

## O que é

O **heditor** é um pacote de skill no padrão aberto `SKILL.md` (Agent Skills). Você instala no seu agente (Claude Code, Codex, OpenCode, Cursor, Hermes e outros) e passa a pedir edições como:

> "Edite este vídeo no estilo **podcast**."
> "Use o **modo criativo** neste corte e me surpreenda."
> "Modo criativo com referência de **GTA 6** neste trecho de 12:30 a 13:40."

O agente faz o trabalho inteiro, sempre localmente:

1. analisa a gravação e encontra o enquadramento de quem fala;
2. transcreve com tempo por palavra e escolhe um raciocínio completo de 30 a 70 s, sem inventar fala;
3. corta fala e câmera com precisão de quadro, encurta pausas e trata a voz;
4. desenha um mundo visual para aquele vídeo (DESIGN.md), com o roteiro de cenas e de som;
5. monta a composição em HTML + GSAP e renderiza com HyperFrames;
6. mixa com a voz sempre na frente (trilha e efeitos em segundo plano, −14 LUFS);
7. passa por verificações: lint, prévias revisadas por visão, testes, margem superior medida em pixels, loudness, true peak, transcrição do áudio final e folha de contato com 40 quadros.

O padrão de qualidade é alto: **cada vídeo ganha uma edição pensada para ele.** Um estilo é uma linguagem visual testada, nunca um molde a repetir.

## Estilos incluídos

| Estilo | Identidade |
|---|---|
| `cinema` | Uma metáfora visual por trecho da fala, troca de "mundo" nas viradas do argumento, câmera em cartão vivo, legendas cinéticas |
| `ruptura` | Abre com a frase mais forte, a própria câmera vira a metáfora e o fechamento é tipográfico |
| `impacto` | Layout organizado com picos coordenados de tipografia, som e zoom nas frases centrais |
| `game` | A tela vira um RPG retrô: HUD, legenda em caixa de diálogo, skill desbloqueada, inventário, tela de CONTINUE? |
| `thriller` | Fita de câmera de segurança: REC, batimento cardíaco, distorção líquida, apagão e reboot do sistema |
| `ide` | Gravação de tela de editor de código: webcam em bolha, legenda digitada como comentário e CTA no terminal |
| `aeroporto` | Torre de controle: radar, painel de partidas com letras que viram e legenda como transmissão de rádio |
| `chat` | App de mensagens claro: as frases chegam como mensagens, o bot responde e a câmera vira videochamada |
| `documentario` | Minidocumentário: faixas de cinema, grão de filme, capítulos em serifa e créditos finais |
| `podcast` | Talk show: cenário saturado, letreiro NO AR, onda sonora que reage à voz e legenda karaokê gigante |
| `missao` | Homenagem a jogo de mundo aberto: pôr do sol neon, vídeo vertical num app do "jogo", apresentação do personagem em imagem congelada, cartão de missão, rota no GPS, tela de atributos, MISSÃO CUMPRIDA e CTA no celular. Nasceu do pedido "modo criativo no estilo GTA 6" |

Detalhes de cada um em `skills/heditor/references/styles/`.

## Modos

- **Estilo fixo:** "edite no estilo `aeroporto`". O agente aplica a linguagem do estilo, mas reconstrói as cenas a partir da fala do novo vídeo.
- **Modo criativo:** "modo criativo". O agente estuda o vídeo, gera de 6 a 8 conceitos de formato, pesquisa referências, escolhe o mais surpreendente que sirva à fala e constrói tudo sob medida, com mudanças na tela a cada 1,5–2 s e efeitos sonoros em cada ação. Veja `creative-mode.md`.
- **Modo criativo + referência:** "modo criativo no estilo GTA 6", "abertura de anime", "telejornal", "documentário de natureza". O agente pesquisa a paleta, a tipografia, o HUD, os movimentos e os sons da referência e cria uma homenagem com equivalentes licenciados, sem logos, marcas, personagens ou músicas protegidas.

Gostou de um resultado do modo criativo? Peça para salvar como estilo nomeado. A skill documenta como fazer isso em `adding-styles.md`.

## Instalação

### Opção 1: instalador (recomendado)

```bash
curl -fsSL https://raw.githubusercontent.com/pycodebr/heditor/main/install.sh | bash
```

O instalador detecta os agentes instalados (Claude Code, Codex, OpenCode, Cursor e Hermes), cria o link da skill em cada um e roda o `setup.sh`, que:

- instala o que faltar: ffmpeg, Node.js ≥ 18, Python 3.10–3.13, git e curl (via apt, brew, dnf ou pacman);
- cria o ambiente Python em `~/.heditor/venv` com faster-whisper, MediaPipe, Playwright, NumPy, Pillow e pytest;
- prepara o HyperFrames 0.8.147 e o Chrome de renderização;
- baixa fontes (OFL), GSAP, o modelo de rosto, o modelo de transcrição e a biblioteca de 18 trilhas e 85 efeitos (Mixkit);
- cria `~/.heditor/env.sh`, `~/.heditor/brand.json` e o comando `heditor`;
- roda o `heditor doctor`.

Opções: `--agent claude|codex|opencode|cursor|hermes|all`, `--copy` (copia em vez de criar link), `--no-audio`, `--no-setup`.

### Opção 2: Skills CLI (Vercel)

```bash
npx skills add pycodebr/heditor -g          # instala a skill nos agentes detectados
bash ~/.agents/skills/heditor/scripts/setup.sh   # ou o caminho onde a skill foi instalada
```

### Opção 3: manual

```bash
git clone https://github.com/pycodebr/heditor.git
cd heditor && bash install.sh --agent claude      # ou copie skills/heditor para a pasta de skills do seu agente
```

Na primeira vez que for usar, o agente roda `setup.sh` sozinho se o `heditor doctor` acusar falta de alguma ferramenta.

### Configure sua marca

Edite `~/.heditor/brand.json`:

```json
{
  "name": "Sua Marca",
  "handle": "@seuperfil",
  "logo": "/caminho/para/logo.png",
  "lang": "pt",
  "follow": "Seguir",
  "following": "Seguindo",
  "comment": "Conta nos comentários",
  "colors": { "bg": "#050a14", "bg2": "#081626", "accent": "#edc580", "accent2": "#7dd3fc", "alert": "#ff3d57", "ok": "#7dffb0" }
}
```

## Como usar

Converse com o seu agente:

```text
Edite /videos/aula-03.mp4 no estilo documentario. Use o trecho em que eu falo sobre transição de carreira.
Modo criativo: transforme o minuto 12 deste podcast em um Reel e me surpreenda.
Modo criativo com referência de telejornal para este vídeo sobre a notícia da semana.
Faça três cortes deste vídeo, cada um com um formato diferente.
```

Ou use o CLI diretamente:

```bash
. ~/.heditor/env.sh
heditor probe aula.mp4 5 60 300                 # quadros para achar quem fala
heditor transcribe aula.mp4 0 3600 qa/asr.json  # transcrição com tempo por palavra
heditor new cortes/c01 aula.mp4                 # prepare.py, build.py e DESIGN.md
heditor prepare cortes/c01                      # corta fala e câmera, já sem pausas mortas
heditor gaps cortes/c01                         # confere: nenhuma pausa > 0,45 s na fala montada
heditor words cortes/c01                        # palavras do corte montado
heditor produce cortes/c01 music:955 30         # composição + mixagem
heditor lint cortes/c01 && heditor preview cortes/c01 0.1,2,5,9,14,20 && heditor test cortes/c01
heditor render cortes/c01 && heditor finalize cortes/c01 c01-1080x1920.mp4 && heditor asr-check cortes/c01
```

## Requisitos

- Linux ou macOS (Windows via WSL2), 4 núcleos e 8 GB de RAM recomendados.
- Cerca de 1,5 GB em disco (ambiente Python, modelos e biblioteca de áudio).
- Um vídeo de 60 s leva de 5 a 15 min para renderizar em CPU comum.

## Estrutura

```
skills/heditor/
├── SKILL.md                     # instruções que o agente lê
├── references/                  # workflow, modo criativo, som, legendas, gates, estilos
│   └── styles/                  # um arquivo por estilo nomeado
├── scripts/
│   ├── setup.sh · doctor.py · fetch_assets.py · heditor (CLI)
│   └── reelkit/                 # kit Python: corte, legendas, página HyperFrames, mixagem, QA
├── templates/                   # prepare.py, build.py, DESIGN.md, brand.example.json
└── assets/catalog.json          # catálogo de trilhas e efeitos (baixados no setup)
```

## Licenças e créditos

- Código e documentação: MIT © PycodeBR.
- Renderização: HyperFrames (Apache-2.0, HeyGen). Animação: [GSAP](https://gsap.com) (licença standard gratuita). Transcrição: faster-whisper (MIT). Rosto: MediaPipe (Apache-2.0).
- Fontes: Google Fonts (SIL OFL 1.1). Ícones: [Lucide](https://lucide.dev) (ISC).
- Trilhas e efeitos: [Mixkit](https://mixkit.co/license/) (Free License). Os arquivos **não** estão neste repositório; o setup baixa cada um do CDN oficial para a sua máquina.
- Tabela completa em `references/licenses.md`.

O heditor não publica nada em redes sociais sozinho e não usa logos ou marcas de terceiros nos estilos de homenagem.

## Contribuindo

Issues e PRs são bem-vindos: novos estilos (com a ficha completa em `references/styles/`), correções do kit, suporte a outras plataformas. Veja CONTRIBUTING.md.

---

## English

**heditor** is an open Agent Skill (SKILL.md) that lets AI coding agents edit talking-head footage (classes, lives, podcasts) into vertical 1080×1920 Reels/Shorts/TikToks with motion graphics, word-synced captions, sound design and an emotional soundtrack.

- **Eleven named styles:** `cinema`, `ruptura`, `impacto`, `game`, `thriller`, `ide`, `aeroporto` (control tower), `chat`, `documentario`, `podcast`, `missao` (open-world game homage).
- **Creative mode:** the agent analyses the video, researches, invents a world for that specific speech and builds it with retention-focused motion and sound.
- **Creative mode + reference:** e.g. "creative mode in the style of GTA 6". The agent researches the reference and builds a licence-safe homage.
- **Pipeline:** word-timed ASR (faster-whisper), frame-accurate cuts, voice chain, HyperFrames (HTML + GSAP) composition, voice-first mix at −14 LUFS, and automatic QA (lint, vision-reviewed previews, tests, pixel safe-margin, loudness/true peak, ASR of the final mix, 40-frame contact sheet).

**Install:** `curl -fsSL https://raw.githubusercontent.com/pycodebr/heditor/main/install.sh | bash`, or `npx skills add pycodebr/heditor -g` followed by `bash /scripts/setup.sh`. Then edit `~/.heditor/brand.json` and ask your agent: *"edit this video in creative mode"*.

MIT © PycodeBR (Felipe Azambuja). Music and SFX are downloaded from Mixkit under its free licence and are not redistributed here.
