import { fileURLToPath } from 'node:url';
import type { AstroUserConfig } from 'astro';
import tailwindcss from '@tailwindcss/vite';

export default {
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'esnext',
  },
  worker: {
    format: 'es',
  },
  optimizeDeps: {
    exclude: ['@napi-rs/wasm-runtime', '@emnapi/runtime'],
  },
} satisfies AstroUserConfig['vite'];
