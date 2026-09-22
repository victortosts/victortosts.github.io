# victortosts.github.io

Personal site — terminal-style developer page with a Markdown blog. Built with
[Astro](https://astro.build), static output, deployed to GitHub Pages.

## Commands

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the built output
npm run check    # astro check (types + templates)
```

## Where things live

| What | Where |
|---|---|
| Every CV fact on the page (roles, stack, education, links) | `src/data/site.ts` |
| Theme tokens and terminal primitives | `src/styles/global.css` |
| Page shell: head, theme script, nav, footer, palette | `src/layouts/Base.astro` |
| Blog posts | `src/content/blog/*.md` |
| Post schema | `src/content.config.ts` |
| Resume PDF | `public/resume/victor-tostes-resume.pdf` |

Content edits almost always mean editing `src/data/site.ts` — the `.astro` files are layout only.

## Publishing a post

Drop a Markdown file in `src/content/blog/`:

```md
---
title: 'Post title'
description: 'One line, used on the index, in OG tags and in the RSS feed.'
date: 2026-10-01
tags: ['node', 'observability']
draft: false
---
```

`draft: true` keeps a post visible in `npm run dev` and out of the production build.
The homepage shows the three most recent posts; `/blog` shows all of them; `/rss.xml`
is generated from the same list.

## Resume PDF

The hero and footer link to `/resume/victor-tostes-resume.pdf`. That file is served
publicly, so it should be a version **without** a phone number or plain email address —
`robots.txt` disallows `/resume/` and the links carry `rel="nofollow"`, but neither
stops someone who has the URL.

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds with
`withastro/action` and publishes to GitHub Pages.

One-time setup in the GitHub UI:

1. The repository must be named `victortosts.github.io` (a user site, served at the root).
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.

For a custom domain later: add `public/CNAME` containing the domain, and update `site`
in `astro.config.mjs`.
