---
title: "flatkey-ai/awesome-images"
owner: "flatkey-ai"
name: "awesome-images"
fullName: "flatkey-ai/awesome-images"
description: "Try flatkey.ai for 40% saving! Generate practical images ready for all your work needs!!!"
sourceUrl: "https://github.com/flatkey-ai/awesome-images"
stars: 842
forks: 1
language: "JavaScript"
topics: ["affordable-ai", "affordable-ai-platform", "ai-api", "gpt-image-2", "gpt-image-2-api", "gpt-image-2-prompts", "nano-banana", "nano-banana-pro"]
license: "未标注"
homepage: "https://flatkey.ai/use-case/image-buddy?utm_source=github&utm_medium=awesome_images"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-24T03:35:02Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Flatkey Image Prompt Library

English | 中文 | 日本語 | Español | Português | Tiếng Việt

Image Buddy is a commercial prompt library and CLI for generating useful marketing images with Flatkey.ai). Flatkey can be about 40% cheaper than common direct image API routes, and this repo makes it easier to turn that lower cost into usable product images, ads, avatars, app visuals, and ecommerce creatives.

Get API key: <[https://flatkey.ai](https://flatkey.ai?utm_source=github&utm_medium=awesome_images)>

## What You Get

- **Lower generation cost**: use Flatkey.ai for image generation, often around 40% cheaper than common direct API routes.
- **Commercial prompts that work**: templates are written for product, ecommerce, social ads, UI screenshots, avatars, posters, game assets, and edits.
- **Fast generation demo**: use `image-buddy web` to open a local demo gallery and generate images with a Flatkey key.
- **CLI-first workflow**: onboard once, then generate from a short sentence or a template hint.

## Includes

**Skill**: a copy-paste prompt for your AI agent. The agent installs and uses Image Buddy for you, backed by the CLI.

Paste this into your AI assistant:

```text
Install and use the Flatkey Image Buddy skill from https://github.com/flatkey-ai/awesome-images.
When I ask for an image, use image-buddy CLI with Flatkey. First run image-buddy onboard if needed, then generate the image from my short prompt or from a template hint. Do not stop at suggesting prompts.
```

**CLI**: one command-line tool for onboarding and generation.

- `image-buddy onboard`: save your Flatkey API key locally.
- `image-buddy generate --prompt "..."`: generate from a plain sentence.
- `image-buddy generate avatar-pack "地雷妹"`: generate from a template plus hint.
- `image-buddy web`: open the optional demo gallery.

## Quickstart

Generate an image with no local install:

```bash
npx @flatkey-ai/image-buddy onboard
npx @flatkey-ai/image-buddy generate --prompt "premium product hero image for an AI image API CLI"
```

Use a template with a short hint:

```bash
npx @flatkey-ai/image-buddy generate avatar-pack "地雷妹"
```

Open the optional web gallery:

```bash
npx @flatkey-ai/image-buddy web
```

No API key yet? Create one at . The CLI reads the saved key, `FLATKEY_IMAGE_API_KEY`, or `FLATKEY_API_KEY`.

## Why This Exists

- **Lower activation friction**: users start from proven templates instead of a blank prompt box.
- **Increase API conversion**: every template card sends users to Flatkey API key registration.
- **Cover common commercial use cases**: product marketing, ecommerce images, social ads, infographics, avatars, app screenshots, game assets, and image edits.
- **Support batch workflows**: templates use `{{variable}}` placeholders, so apps can replace values before sending final prompts to an API.
- **Work as marketing content**: useful as a prompt gallery, tutorial page, landing page, or onboarding resource.

## Included Templates

This library currently includes 12 high-frequency image prompt templates:

- Premium product hero visual
- White-background ecommerce main image
- UGC ad cover frame
- Liquid glass Bento infographic
- Founder quote card
- Consistent avatar pack
- App Store screenshot poster
- YouTube thumbnail
- Event poster key visual
- Game prop concept sheet
- Subject-preserving background replacement
- Fashion lookbook collage

Each template includes:

- Title and use case
- Category and recommended model
- Replaceable variables
- Full prompt text
- API use-case note
- Copy prompt button
- Flatkey API key registration link

The reusable templates are also exported as a reviewable, machine-readable catalog at `catalog/prompts.json`. Browse the generated industry index when you want to find a use case before opening the CLI gallery. The catalog is content-only; it is not a prompt-generation API.

## Demo Gallery

The web gallery ships with 20 generated demo images. These are included in the npm package and shown by `image-buddy web`.

| Product | Ecommerce | Social Ad | App |
|---|---|---|---|
| *图片：SaaS Hero Phone***SaaS Hero Phone** | *图片：Skincare Product***Skincare Product** | *图片：UGC Coffee Ad***UGC Coffee Ad** | *图片：Fitness App***Fitness App** |

| Poster | Infographic | Fashion | Game Asset |
|---|---|---|---|
| *图片：AI Agent Poster***AI Agent Poster** | *图片：Liquid Bento***Liquid Bento** | *图片：Streetwear Lookbook***Streetwear Lookbook** | *图片：Crystal Game Prop***Crystal Game Prop** |

| Food | Travel | Portrait | Real Estate |
|---|---|---|---|
| *图片：Dessert Hero***Dessert Hero** | *图片：Travel Map***Travel Map** | *图片：Cyber Portrait***Cyber Portrait** | *图片：Interior Render***Interior Render** |

| Entertainment | Education | Finance | Beauty |
|---|---|---|---|
| *图片：Music Cover***Music Cover** | *图片：Education Card***Education Card** | *图片：Finance Dashboard***Finance Dashboard** | *图片：Beauty Makeup***Beauty Makeup** |

| Architecture | Pet | Sports | Publishing |
|---|---|---|---|
| *图片：Architecture Model***Architecture Model** | *图片：Pet Brand***Pet Brand** | *图片：Sports Shoe***Sports Shoe** | *图片：Book Cover***Book Cover** |

## CLI Usage

Generate from plain English:

```bash
npx @flatkey-ai/image-buddy onboard
npx @flatkey-ai/image-buddy generate --prompt "premium product hero image for an AI image API CLI, clean SaaS style, teal accents, sharp commercial lighting"
```

Generate from a template:

```bash
npx @flatkey-ai/image-buddy onboard
npx @flatkey-ai/image-buddy generate avatar-pack "地雷妹"
```

For precise template control, pass variables explicitly:

```bash
npx @flatkey-ai/image-buddy generate premium-product-hero \
  --var "产品名称=Image Buddy" \
  --var "品牌调性=clean SaaS" \
  --var "核心卖点=one-command image generation" \
  --var "主色=teal" \
  --size 1536x1024
```

Template text after the id is used as a hint. Missing variables are filled from that hint, so users do not need to learn every `--var` name before generating.

`onboard` prompts for a Flatkey API key and saves it locally. If you do not have a key, get one at . The CLI also accepts `FLATKEY_IMAGE_API_KEY` or `FLATKEY_API_KEY`, calls Flatkey image generation, and saves images locally. No web server required.

`generate` defaults to Nano Banana through `router.flatkey.ai` because it works well for direct CLI generation. Use `--model gpt` when you explicitly want the OpenAI-compatible GPT Image 2 endpoint.

Browse templates from terminal:

```bash
npx @flatkey-ai/image-buddy list
npx @flatkey-ai/image-buddy show premium-product-hero
npx @flatkey-ai/image-buddy render premium-product-hero --var "产品名称=Image Buddy"
```

Optional web gallery:

```bash
npx @flatkey-ai/image-buddy web --port 5173
```

Source install before npm release:

```bash
npx github:flatkey-ai/awesome-images
```

Useful options:

```bash
npx @flatkey-ai/image-buddy web --port 5173
npx @flatkey-ai/image-buddy web --no-open
npx @flatkey-ai/image-buddy --help
```

Developer commands:

```bash
npm install
npm test
npm run build:catalog
npm run build
```

## User Flow

1. Run `npx @flatkey-ai/image-buddy generate ` or `npx @flatkey-ai/image-buddy generate --prompt "..."`.
2. Find a template by category or keyword.
3. Expand the template and copy the prompt.
4. Replace variables such as `{{product_name}}`, `{{core_benefit}}`, or `{{brand_color}}`.
5. Register a Flatkey API key at <[https://flatkey.ai](https://flatkey.ai?utm_source=github&utm_medium=awesome_images)>.
6. Run `image-buddy generate` to create and save images locally.


## Template Structure

All templates live in src/prompts.js.

Add a new template by appending an object:

```js
{
  id: "unique-template-id",
  title: "Template title",
  industry: "ecommerce-retail",
  category: "product",
  badge: "Hero",
  aspectRatio: "16:9",
  model: "gpt-image-2",
  apiUseCase: "Best-fit API use case.",
  description: "Template description.",
  variables: ["product_name", "core_benefit"],
  prompt: "Create a commercial hero image for {{product_name}}..."
}
```

Use `industry` for the business context and `category` for the visual production pattern. Keep the human-facing `description` separate from the model-facing `prompt`; details are documented in `docs/prompt-format.md`.

After adding templates, run:

```bash
npm test
```

The validator checks template count, categories, variables, prompt length, and Flatkey registration links.

## Release Publishing

Publishing runs from GitHub Releases.

1. Add an npm automation token to GitHub repository secrets as `NPM_PUBLISH_TOKEN`.
2. Create a GitHub Release with tag `v1.2.3` or `1.2.3`.
3. The workflow sets `package.json` and `package-lock.json` to that release version.
4. The workflow runs validation, build, and `npm publish --access public`.

## Star History

[*图片：Star History Chart*](https://www.star-history.com/#flatkey-ai/awesome-images&Date)
