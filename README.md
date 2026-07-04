# personal-website

A content-first personal site: projects, blog, about. Built with
[Astro](https://astro.build), deployed to GitHub Pages at
**https://zerisinyu.github.io/personal-website/**.

The one rule: **updating content never requires touching code.** A project is
a folder of markdown + images; a blog post is a single markdown file.

## Commands

```sh
npm install        # once
npm run dev        # local dev at http://localhost:4321/personal-website
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

Deployment is automatic: every push to `main` triggers
`.github/workflows/deploy.yml`, which builds the site and publishes it to
GitHub Pages.

> **One-time setup:** in the repo's *Settings → Pages*, set **Source** to
> **GitHub Actions**. Nothing else is needed.

## Adding a project

Projects live in `src/content/projects/`, one folder per project:

```
src/content/projects/
  my-new-project/
    index.md      ← frontmatter + body
    cover.png     ← thumbnail for the grid
    photo-1.jpg   ← any other images, referenced relatively in the body
```

Minimal `index.md`:

```yaml
---
title: My new project
summary: One line shown on the card and in search results.
year: 2026
tags: [data-viz]
cover: ./cover.png
---

Body in plain markdown. Images: ![caption](./photo-1.jpg)
```

That's it — copy a folder, drop in images, write, push.

### The three project types

Set `type` in the frontmatter to control what clicking the card does:

| type | behaviour | needs |
|---|---|---|
| `case-study` (default) | auto-rendered page at `/work/<folder-name>` | just the folder |
| `custom` | links to a hand-built page inside this site | `href: /work/my-page` + a page in `src/pages/work/my-page.astro` |
| `external` | links out to another site (opens a new tab) | `href: https://…` |

Other frontmatter knobs: `featured: true` puts it on the home page,
`draft: true` hides it, `order: 1` pins manual ordering (default is year,
newest first).

### Fancier layouts (optional)

Rename `index.md` to `index.mdx` and these components become available
without imports:

```mdx
<Figure src="./big.png" caption="A captioned, centred image" />
<Gallery columns={2}> ![a](./a.png) ![b](./b.png) </Gallery>
<TwoColumn>
  <div slot="left">Text…</div>
  <div slot="right">![chart](./chart.png)</div>
</TwoColumn>
<FullBleed>![wide](./wide.png)</FullBleed>
<Video src="/projects/demo.mp4" />
```

### GIFs and video

- **Static images** (png/jpg/webp): keep them in the project folder — they go
  through Astro's optimisation automatically.
- **GIFs**: do *not* route through the image pipeline (animation can be
  lost). Put them in `public/projects/` and reference with a plain
  `<img src="/personal-website/projects/demo.gif">` in the body.
- **Video (mp4)**: put in `public/projects/` and use the `<Video>` component
  (`.mdx` only) or a `<video>` tag.

## Writing a blog post

Drop a markdown file into `src/content/blog/`:

```yaml
---
title: Post title
date: 2026-07-04
summary: Optional one-liner for the list page and RSS.
---

Text.
```

Push, and it appears at `/blog/<file-name>` and in `/rss.xml`. Set
`draft: true` to keep it unpublished.

## Two editing workflows

**1. Local markdown (always works).** Write in Obsidian/Typora/VS Code, put
the file in the right folder, commit, push. The GitHub web editor also works
in a pinch — it supports drag-and-drop image upload.

**2. In the browser via Sveltia CMS.** A CMS is pre-configured at
`/personal-website/admin/` with Blog and Projects collections matching the
schemas above. Logging in requires a one-time OAuth setup:

1. Create a **GitHub OAuth app** (GitHub → Settings → Developer settings →
   OAuth Apps). Homepage URL: the site URL. Callback URL: your relay URL
   from step 2 + `/callback`.
2. Deploy an OAuth relay — Sveltia recommends
   [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth), a
   Cloudflare Worker you deploy for free. Give it the OAuth app's client
   ID/secret and your Pages domain as allowed origin.
3. Put the worker URL in `public/admin/config.yml` as `backend.base_url`.

Until that's done, use workflow 1. (Check the current
[Sveltia CMS docs](https://github.com/sveltia/sveltia-cms) — the auth story
occasionally improves.)

## Newsletter

RSS (`/rss.xml`) is the subscription channel for now. To deliver posts by
email, hook the feed into an RSS-to-email service (e.g.
[Buttondown](https://buttondown.com)) and swap its subscribe form into the
marked slots in `src/components/Footer.astro` and
`src/pages/blog/index.astro`.

## Changing the look

- **Site text** (name, tagline, meta description): `src/site.config.ts`
- **Design tokens** (colors, font variable, spacing, widths):
  `src/styles/global.css` — the font is one `--font-sans` variable plus one
  `@fontsource` import in `src/layouts/Base.astro`
- **About page**: `src/pages/about.astro` (currently placeholder text)

## Custom domain / renaming

The site is configured for a project repo (served under
`/personal-website/`). If you add a custom domain or rename the repo to
`zerisinyu.github.io`:

1. In `astro.config.mjs`, set `site` to the new URL and `base` to `'/'`.
2. In `public/admin/config.yml`, change `public_folder` to `/uploads`.
3. For a custom domain: add it under repo *Settings → Pages* and create the
   DNS records GitHub shows you (a `CNAME` file is managed automatically).
