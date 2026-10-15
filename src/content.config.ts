import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().default('未分类'),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    noindex: z.boolean().default(false),
  }),
})

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    owner: z.string(),
    name: z.string(),
    fullName: z.string(),
    description: z.string(),
    sourceUrl: z.url(),
    stars: z.number().int().nonnegative().default(0),
    forks: z.number().int().nonnegative().default(0),
    language: z.string().default('未知'),
    topics: z.array(z.string()).default([]),
    license: z.string().default('未标注'),
    homepage: z.url().optional(),
    defaultBranch: z.string().default('main'),
    snapshotDate: z.coerce.date(),
    pushedAt: z.coerce.date().optional(),
  }),
})

export const collections = { posts, projects }
