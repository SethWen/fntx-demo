import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import viteConfig from './vite.config.ts';

export default defineConfig({
  site: 'https://fntx.modone.me',
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', cn: 'zh-CN' },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', { path: 'cn', codes: ['zh', 'zh-CN'] }],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: viteConfig,
});
