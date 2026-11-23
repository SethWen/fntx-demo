import { defineConfig } from 'oxfmt';

export default defineConfig({
  singleQuote: true,
  semi: true,
  printWidth: 100,
  ignorePatterns: ['dist', '.astro', 'node_modules', 'vendor', 'pnpm-lock.yaml'],
});
