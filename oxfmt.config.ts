import { defineConfig } from 'oxfmt';

export default defineConfig({
  singleQuote: true,
  semi: true,
  printWidth: 100,
  ignorePatterns: ['dist', '.astro', 'node_modules', 'src/vendor', 'pnpm-lock.yaml'],
});
