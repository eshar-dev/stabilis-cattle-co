import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

// TODO: replace with the live domain before launch.
export default defineConfig({
  site: 'https://www.stabiliscattle.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  adapter: cloudflare(),
});