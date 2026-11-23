// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://fntx.dev',
  integrations: [react(), sitemap()],
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      target: 'esnext',
    },
    worker: {
      format: 'es',
    },
    optimizeDeps: {
      exclude: ['@napi-rs/wasm-runtime', '@emnapi/runtime'],
    },
  },
});
