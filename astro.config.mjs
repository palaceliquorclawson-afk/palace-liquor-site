// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.palaceliquorclawson.com',
  trailingSlash: 'ignore',
  // Inline the (small) stylesheet so pages render without an extra blocking request.
  build: { inlineStylesheets: 'always' },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') && !page.includes('/liquor-store') && !page.includes('/party-drinks') && !page.includes('/keg-rentals') && !page.endsWith('/holiday/') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
