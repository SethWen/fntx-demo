import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import viteConfig from './vite.config.ts';

export default defineConfig({
  site: 'https://fntx.modone.me',
  integrations: [react(), sitemap()],
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: viteConfig,
});
