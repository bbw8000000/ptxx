---
title: "midudev/spiderman-brand-new-day"
owner: "midudev"
name: "spiderman-brand-new-day"
fullName: "midudev/spiderman-brand-new-day"
description: "Web oficial española para la película Spiderman Brand New Day"
sourceUrl: "https://github.com/midudev/spiderman-brand-new-day"
stars: 32
forks: 12
language: "Astro"
topics: ["spiderman"]
license: "未标注"
homepage: "https://spidermanbrandnewday.es"
defaultBranch: "main"
snapshotDate: "2026-07-29"
pushedAt: "2026-07-28T20:57:50Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Spider-Man: Brand New Day

Web promocional de *Spider-Man: Brand New Day* ([spidermanbrandnewday.es](https://www.spidermanbrandnewday.es)): tráiler, sinopsis, vídeos y galería para el estreno en cines.

## Stack

- [Astro](https://astro.build) 7
- [Tailwind CSS](https://tailwindcss.com) 4
- [GSAP](https://gsap.com) (ScrollTrigger + SplitText)

Requiere Node.js `>=22.12.0` y [pnpm](https://pnpm.io).

## Desarrollo

```sh
pnpm install
pnpm dev
```

| Comando | Acción |
| :------ | :----- |
| `pnpm install` | Instala dependencias |
| `pnpm dev` | Servidor de desarrollo en `localhost:4321` |
| `pnpm build` | Build de producción en `./dist/` |
| `pnpm preview` | Previsualiza el build localmente |

## Estructura

```text
/
├── public/          # Fuentes, imágenes, vídeos y favicon
├── src/
│   ├── components/  # Hero, sinopsis, vídeos, galería, UI fija…
│   ├── data/        # Contenido editorial
│   ├── layouts/     # Layout base y SEO
│   ├── lib/         # Helpers (DOM, GSAP, loading)
│   ├── pages/       # Rutas
│   └── styles/      # Estilos globales
└── package.json
```
