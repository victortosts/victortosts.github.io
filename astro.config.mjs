// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://victortosts.github.io',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light-high-contrast', dark: 'github-dark' },
      // Emit both palettes as CSS variables; the stylesheet picks one per data-theme.
      defaultColor: false,
      wrap: true,
    },
  },
})
