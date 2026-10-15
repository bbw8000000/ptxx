---
title: "benlamiro/ShipGenAI"
owner: "benlamiro"
name: "ShipGenAI"
fullName: "benlamiro/ShipGenAI"
description: "🚀 50 production-ready Generative AI SaaS apps — brand them, ship them, keep 100% of the revenue. Stripe billing · Google OAuth · Vercel deploy · MIT licensed"
sourceUrl: "https://github.com/benlamiro/ShipGenAI"
stars: 274
forks: 31
language: "JavaScript"
topics: ["ai", "boilerplate", "generative-ai", "gpt", "image-generation", "machine-learning", "nextjs", "open-source"]
license: "MIT"
homepage: "https://shipgenai.site/"
defaultBranch: "main"
snapshotDate: "2026-09-27"
pushedAt: "2026-09-22T09:31:40Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# 🚀 ShipGenAI

### *50 production-ready Generative AI SaaS apps — brand them, ship them, keep 100% of the revenue.*


  shipgenai.site ·
  Quick Start ·
  Platforms ·
  Image ·
  Video ·
  Beauty & Fashion ·
  E-commerce


  
    
  
  
    
  
  
    
  
  


  
  
  
  
  


---

## 💡 What is ShipGenAI?

**[ShipGenAI](https://shipgenai.site/)** is a curated collection of **50 complete, production-ready AI SaaS products** you can launch under your own brand — this weekend.

Each app ships with:
- 💳 **Stripe checkout + webhooks** — credit-based billing, webhook confirmation, automatic credit deduction
- 🔐 **Google OAuth** — zero auth to build or maintain
- 🤖 **100+ AI models** via [MuAPI](https://muapi.ai) — swap models without touching app code; handles async polling, retries, and failover
- 🌐 **Vercel-ready** — one-click deploy to global CDN
- 🗄️ **Prisma + PostgreSQL** — users, credits, and job history out of the box
- 🆓 **MIT licensed** — sell it, white-label it, charge whatever you want

> **Explore all apps → [shipgenai.site](https://shipgenai.site/)**

---

## 💰 The Business Case

These are not demos or UI kits — they are **complete, sellable SaaS products**.

| | Example: AI Headshot Generator |
|---|---|
| **You charge users** | $29 for a pack of 10 headshots |
| **AI cost per pack** | ~$1.50 (via MuAPI) |
| **Your margin** | ~$27.50 per pack (~95%) |
| **At 100 customers/month** | ~$2,750 MRR |
| **At 500 customers/month** | ~$13,750 MRR |

> AI headshot tools charge $29–$49/pack. Virtual staging tools charge $29/image. Video clipping tools charge $49/month. Companies built on these exact ideas are doing **millions in revenue** — the open-source version is right here.

---

## 🚀 Quick Start

```bash
# 1. Clone the template you want
git clone https://github.com/SamurAIGPT/
cd 

# 2. Set up environment variables
cp .env.example .env
# Fill in: DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID/SECRET,
#          STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, MUAPI_API_KEY

# 3. Initialize DB and start
npx prisma db push && npm run dev
```

Or hit the **Deploy to Vercel** button in each template's README for instant live deployment.

---

## 📑 Table of Contents

- 🌐 Open-Source AI Platforms
- 🖼️ Image Generation
- 🎬 Video Generation
- 💄 Beauty & Fashion AI
- 🛒 E-commerce & Product Photography
- 🏠 Home & Real Estate AI
- 👤 Portrait & Avatar AI
- ✍️ Writing & Content
- 🤖 AI Agents & Chatbots
- 🎵 Audio & Voice
- 🔧 Platform Integrations

---

## 🌐 Open-Source AI Platforms

Full-stack platforms you can self-host or white-label. Leonardo AI charges $12–$60/mo. OpenArt charges $9–$57/mo. Krea charges $10–$35/mo. These open-source alternatives capture that same revenue with zero licensing fees.

| App | Description | Competing With | Stars |
|---|---|---|---|
| Open Generative AI · ↗ GitHub | Open-source AI image & video studio with 200+ models. No content filters. Self-hosted. | Leonardo AI ($60/mo), Krea ($35/mo) | ⭐ 20k+ |
| Free AI Social Media Scheduler · ↗ GitHub | Self-hostable AI social media scheduler with built-in content generation | Buffer ($18/mo), Hootsuite ($99/mo) | ⭐ 420 |
| Open AI Design Agent · ↗ GitHub | Autonomous multi-step AI design agent for creatives and brand kits | Lovart AI ($30/mo), Galileo AI ($50/mo) | ⭐ 807 |
| Open Poe AI · ↗ GitHub | Self-hosted multi-model AI chat — GPT, Claude, Gemini, Llama | Poe AI ($20/mo), ChatGPT Plus ($20/mo) | ⭐ 241 |

---

## 🖼️ Image Generation

**The market:** Midjourney makes est. $200M+/year. DALL·E powers ChatGPT Plus for 200M+ users. Aragon AI (just headshots) reportedly crossed $1M ARR. One niche image product = real income.

| Template | Description | Competing With | Demo |
|---|---|---|---|
| Nano Banana Generator · ↗ GitHub | Text-to-image and multi-image reference editing SaaS | Midjourney ($10–$30/mo), DALL·E ($15/mo) | [Demo](https://nano-banana-generator.vercel.app/) |
| AI Headshot Generator · ↗ GitHub | LinkedIn photos, team portraits, personal branding | Aragon AI ($29–$49/pack) — est. $1M+ ARR | [Demo](https://ai-headshot-generator.vercel.app/) |
| AI Logo Studio · ↗ GitHub | Text-to-logo and sketch-to-logo brand identity generator | Looka ($20–$80/logo), Brandmark ($25–$65/logo) | [Demo](https://ai-logo-studio.vercel.app/) |
| AI Meme Studio · ↗ GitHub | AI meme & viral short video generator with multiple models | Imgflip Pro ($10/mo), Supermeme ($19/mo) | [Demo](https://ai-meme-generator.vercel.app/) |
| Old Photo Restore · ↗ GitHub | Colorize, denoise, and repair damaged vintage photos | Remini (est. $100M+ revenue), MyHeritage ($50/yr) | [Demo](https://old-photo-restore.vercel.app/) |
| ClearMark AI · ↗ GitHub | Remove watermarks, logos, and text overlays using GPT Image 2 | Watermarkremover.io ($9.99/mo), HitPaw ($20/mo) | [Demo](https://clearmark-ai.vercel.app/) |

---

## 🎬 Video Generation

**The market:** Opus Clip hit $20M+ ARR. Runway raised $236M. The AI video tools market is projected at $2B+ by 2027. Clipping and short-form tools are the highest-demand entry point.

| Template | Description | Competing With | Demo |
|---|---|---|---|
| Seedance 2 Generator · ↗ GitHub | Text-to-video and multi-image reference video SaaS | Runway ($12–$76/mo), Kling ($10–$36/mo) | [Demo](https://seedance-2-generator.vercel.app/) |
| Veo Video Generator · ↗ GitHub | Text-to-video and image-to-video with Google Veo | Sora ($20/mo), Runway ($76/mo) | [Demo](https://veo4-video-generator.vercel.app/) |
| AI Kissing Video Generator · ↗ GitHub | Merge two portraits into a romantic AI video using Veo 3 & Gemini Omni | Reface ($4.99/mo) | [Demo](https://ai-kissing-video-generator-amber.vercel.app/) |
| AI Youtube Shorts Generator · ↗ GitHub | Auto-extract viral 9:16 shorts from long-form videos | Opus Clip ($15–$49/mo, est. $20M+ ARR) | — |
| AI Clipping Generator · ↗ GitHub | Auto-extract Reels and TikToks from YouTube videos | Opus Clip ($15–$49/mo), SubMagic ($20–$60/mo) | [Demo](https://ai-clipping-generator.vercel.app/) |
| AI Micro-Drama Generator · ↗ GitHub | Turn any idea into a complete short-form AI drama | Creatify ($39/mo), Synthesia ($22–$67/mo) | — |
| AI B-Roll Generator | Auto-generate relevant B-roll footage from scripts or transcripts | Storyblocks ($15/mo), Artlist ($16/mo) | — |
| Open AI UGC · ↗ GitHub | Generate AI UGC-style video ads with virtual creators | Arcads ($99–$299/mo), MakeUGC ($49/mo) | — |

---

## 💄 Beauty & Fashion AI

**The market:** ModiFace (acquired by L'Oreal for est. $68M) powers virtual try-ons for major retailers. YouCam makes $50M+/year. Beauty AI has some of the highest consumer willingness-to-pay.

| Template | Description | Competing With | Demo |
|---|---|---|---|
| TryOn AI · ↗ GitHub | Fit any garment onto any person photo | Botika ($99+/mo for brands), Lalaland.ai (enterprise) | [Demo](https://ai-tryon-smoky.vercel.app/) |
| AI Hairstyle Simulator · ↗ GitHub | Virtual hair makeover and color try-on | YouCam Hair ($30/yr), HairStyle.ai ($7.99/mo) | [Demo](https://ai-hair-style-simulator.vercel.app/) |
| AI Tattoo Try-On · ↗ GitHub | Preview tattoo designs on skin virtually | Ink Hunter (1M+ users), Tattoosmart ($4.99/mo) | [Demo](https://ai-tattoo-try-on.vercel.app/) |
| AI Professional Makeup · ↗ GitHub | Try on professional makeup looks with AI | YouCam Makeup ($30/yr), Perfect Corp (enterprise) | [Demo](https://ai-professional-makeup-generator.vercel.app/) |

---

## 🛒 E-commerce & Product Photography

**The market:** Photoroom raised $19M Series A and reportedly crossed $50M ARR. E-commerce sellers pay premium for anything that speeds up product listings — a high-LTV B2B niche.

| Template | Description | Competing With | Demo |
|---|---|---|---|
| Resale Photo Enhancer · ↗ GitHub | AI product photo studio for eBay, Poshmark, Depop sellers | Photoroom ($9.99–$79/mo, est. $50M+ ARR) | [Demo](https://resale-photo-enhancer.vercel.app/) |
| Amazon Product Studio · ↗ GitHub | Generate studio-quality product photos from reference images | Flair AI ($38/mo), Pebblely ($19/mo) | [Demo](https://amazon-product-studio.vercel.app/) |

---

## 🏠 Home & Real Estate AI

**The market:** Virtual staging companies charge $25–$75 per room. Rooomy raised $5M. Zillow reports staged homes sell 73% faster.

| Template | Description | Competing With | Demo |
|---|---|---|---|
| AI Virtual Staging · ↗ GitHub | Furnish empty rooms with photorealistic AI furniture | Rooomy ($25–$75/room), Stuccco ($29/room) | [Demo](https://ai-virtual-staging.vercel.app/) |
| AI Room Redesign · ↗ GitHub | Transform any room into a new style or aesthetic | Reimagine Home ($15/mo), AI Room Planner ($15/mo) | [Demo](https://ai-room-redesign.vercel.app/) |
| AI Room Declutter · ↗ GitHub | Transform messy rooms into photorealistic clean interiors | Virtually Staging Properties ($25/room) | [Demo](https://ai-room-declutter.vercel.app/) |
| AI Architecture Visualizer · ↗ GitHub | Turn floor plans into photorealistic 3D renders | Foyr Neo ($49/mo), Cedreo ($79/mo) | [Demo](https://ai-architecture-visualizer.vercel.app/) |

---

## 👤 Portrait & Avatar AI

**The market:** Lensa AI made $50M+ in a single month from the avatar feature launch. Avatar tools consistently rank among the highest-revenue consumer AI apps.

| Template | Description | Competing With | Demo |
|---|---|---|---|
| AI Character Studio · ↗ GitHub | Generate custom AI character portraits and chat with them | Character.ai (est. $200M+ ARR), Replika ($7.99/mo) | [Demo](https://ai-character-studio-beta.vercel.app/) |
| AI Profile Picture · ↗ GitHub | Generate stunning profile pictures with AI style transfer | PFPMaker ($10/mo), ProfilePicture.ai ($12/pack) | [Demo](https://ai-profile-picture.vercel.app/) |
| AI Baby Generator · ↗ GitHub | Predict what your baby will look like using two parent photos | BabyGenerator.io ($3.99/use), MakeMeBabies.com | [Demo](https://ai-baby-generator.vercel.app/) |
| AI Cartoon Generator · ↗ GitHub | Turn any photo into cartoon, anime, or illustrated style | ToonMe (40M+ users), Cartoon.ai ($9.99/mo) | [Demo](https://ai-cartoon-generator.vercel.app/) |

---

## ✍️ Writing & Content

**The market:** Jasper AI raised $125M at a $1.5B valuation. Copy.ai surpassed $10M ARR. WriteSonic crossed $10M ARR.

| Template | Description | Competing With | Demo |
|---|---|---|---|
| AI Blog Writer · ↗ GitHub | Long-form SEO blog posts with outline, research, and publish | Jasper ($49/mo), Writesonic ($19/mo) | [Demo](https://ai-blog-writer.vercel.app/) |
| AI Email Writer · ↗ GitHub | Cold emails, sequences, and reply drafting with AI | Lavender ($29/mo), Regie.ai ($39/mo) | [Demo](https://ai-email-writer.vercel.app/) |
| AI Resume Builder · ↗ GitHub | AI-powered resume creation, optimization, and tailoring | Teal ($29/mo), Kickresume ($10/mo) | [Demo](https://ai-resume-builder.vercel.app/) |
| AI Voice Cloner · ↗ GitHub | Clone any voice from a short sample and generate speech | ElevenLabs ($5–$99/mo, est. $80M+ ARR) | [Demo](https://ai-voice-cloner.vercel.app/) |
| AI Podcast Generator · ↗ GitHub | Turn any text or topic into a ready-to-publish podcast episode | Wondercraft ($29/mo), Podcastle ($14/mo) | [Demo](https://ai-podcast-generator.vercel.app/) |

---

## 🤖 AI Agents & Chatbots

**The market:** Intercom crossed $400M ARR. Drift was acquired for $800M. Enterprise chatbot market projected at $27B by 2030.

| Template | Description | Competing With | Demo |
|---|---|---|---|
| AI Customer Support · ↗ GitHub | Custom AI chatbot trained on your docs and website | Intercom ($74/mo), Drift (enterprise) | [Demo](https://ai-customer-support.vercel.app/) |
| AI Sales Agent · ↗ GitHub | Autonomous AI that qualifies leads and books meetings | 6sense (enterprise), Conversica (enterprise) | [Demo](https://ai-sales-agent.vercel.app/) |
| Open Poe AI · ↗ GitHub | Self-hosted multi-model AI chat — GPT, Claude, Gemini, Llama | Poe AI ($20/mo), ChatGPT Plus ($20/mo) | — |

---

## 🔧 Platform Integrations

| Template | Description | Stars |
|---|---|---|
| ChatGPT for Slack · ↗ GitHub | ChatGPT Slack bot with memory, file support, and team context | ⭐ 305 |
| ChatGPT for Discord · ↗ GitHub | Full ChatGPT bot for Discord with slash commands and threads | ⭐ 565 |
| ChatGPT for Teams · ↗ GitHub | Enterprise Microsoft Teams bot with GPT-4 and file parsing | ⭐ 104 |
| ChatGPT for Website · ↗ GitHub | Embeddable ChatGPT widget for any website | ⭐ 1.1k |

---

## 🛠️ Tech Stack

Every template in this collection uses the same proven stack:

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14+ (App Router), TypeScript, Tailwind CSS |
| **Auth** | NextAuth.js + Google OAuth |
| **Database** | PostgreSQL + Prisma ORM |
| **Payments** | Stripe Checkout + Webhooks |
| **AI Models** | [MuAPI](https://muapi.ai) — 100+ models, async polling, failover |
| **Deployment** | Vercel — one-click, global CDN |

---

## 🤝 Contributing

Found a new AI SaaS template worth adding? Open a PR! We welcome:
- New complete SaaS templates with billing + auth
- Improvements to existing template READMEs
- Additional niche categories

---

## 📄 License

MIT © [ShipGenAI](https://shipgenai.site/) — fork it, brand it, sell it, keep everything.

---


**Built for indie founders who want to ship fast and own their revenue.**


  


⭐ Star this repo to stay updated — new apps added regularly.
