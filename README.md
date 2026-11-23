# fntx-demo

Pure client-side Astro + React + WebAssembly font processing workbench powered by `fntx`.

## Development

```bash
# Sync latest WASM artifacts from ../fntx/crates/fntx-napi/dist
pnpm run sync:wasm

# Install dependencies
pnpm install

# Start local dev server
pnpm dev

# Build static site for Cloudflare Pages (outputs to dist/)
pnpm build
```

## AdSense Configuration

Copy `.env.example` to `.env` (or configure environment variables in Cloudflare Pages) and set `PUBLIC_ADSENSE_CLIENT` when ready to enable ad slots.
