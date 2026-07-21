import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One folder = one project. Each folder holds an index.md (or index.mdx)
// plus its images. The entry id is the folder name, used as the URL slug.
const projects = defineCollection({
  loader: glob({
    pattern: '**/index.{md,mdx}',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.replace(/\/index\.(md|mdx)$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(), // one-liner for cards and meta description
      year: z.union([z.number(), z.string()]),
      tags: z.array(z.string()).default([]),
      cover: image().optional(), // thumbnail for the index grid
      type: z.enum(['case-study', 'custom', 'external']).default('case-study'),
      // custom: internal path (e.g. /work/fertility-fairness)
      // external: full URL
      href: z.string().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      // shown on the case-study detail page
      tools: z.array(z.string()).default([]),
      links: z
        .array(z.object({ label: z.string(), url: z.string() }))
        .default([]),
      // manual sort; falls back to year desc. Sveltia's number widget writes
      // `null` (not just omitting the field) when left blank, so accept that too.
      order: z
        .number()
        .nullable()
        .optional()
        .transform((v) => v ?? undefined),
    }),
});

// Singleton pages edited via the CMS. Currently just About.
const pages = defineCollection({
  loader: glob({ pattern: 'about.{md,mdx}', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().default('About'),
      photo: image().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      email: z.string().optional(),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog, pages };
