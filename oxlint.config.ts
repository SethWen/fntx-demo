import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['react', 'typescript'],
  env: {
    browser: true,
    es2024: true,
  },
  ignorePatterns: ['dist', '.astro', 'node_modules', 'src/vendor'],
  rules: {
    'no-unused-vars': 'warn',
  },
});
