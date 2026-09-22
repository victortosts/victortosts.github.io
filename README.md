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

## The blog is currently switched off

There are no posts yet, so the blog is unpublished. Nothing was deleted — the content
collection, the list page, the post page, the RSS route and `PostList.astro` are all intact.

Two things turn it back on:

1. `features.blog = true` in `src/data/site.ts` — restores the nav link, the hero link, the
   footer RSS link, the two command-palette entries, the `<link rel="alternate">` feed tag,
   the `#writing` section on the homepage and the `ls ~/blog | wc -l` line in the hero rotator.
2. Drop the `_` prefix from `src/pages/_blog/` and `src/pages/_rss.xml.ts`. Astro ignores
   anything under `src/pages/` that starts with `_`, which is what keeps `/blog` and
   `/rss.xml` from being built at all rather than merely unlinked.

The `#writing` section itself lives in `src/pages/index.astro` and was removed with the rest;
re-add it between `#open-source` and `#education`:

```astro
<Section id="writing" label="writing" cmd="ls" args="-lt ~/blog">
  <PostList posts={posts} empty="nothing published yet — first post is on the way." />
  <p class="more" data-reveal><a href="/blog" class="dim">~/blog →</a></p>
</Section>
```

…along with `{ id: 'writing', label: 'writing' }` in `sections[]`.

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
