<div align="center">
  <img src="./public/favicon.svg" width="72" height="72" alt="fntx logo" />
  <h1>Fntx Web</h1>
  <p><strong>Pure Client-Side · Zero Server Uploads · WebAssembly-Powered Font Workbench</strong></p>
  <p>
    Live Demo: <a href="https://fntx.modone.me/"><strong>https://fntx.modone.me/</strong></a>
    (<a href="https://fntx.modone.me/cn/">中文版</a>)
  </p>
  <p>
    <strong>English</strong> | <a href="./README.zh-CN.md">简体中文</a>
  </p>
</div>

**Fntx Web** is a browser-based online font processing workbench powered by the [`fntx`](<>) Rust engine. All font parsing, subsetting, merging, and format conversion run strictly inside your browser's local **WebAssembly + Web Worker** sandbox—never uploading multi-megabyte font files to any server, delivering both high speed and complete privacy.

---

## Core Features

- **Multi-Source Subsetting & Plane Merging (Subset & Merge)**
  - Subset large CJK fonts (15 MB–30 MB) down to tens of kilobytes by inputting characters or Unicode codepoints.
  - Subset and merge **BMP (`00000–0FFFF`)** and **SIP supplementary (`20000–2FFFF`, etc.)** font sources into a single unified font.
  - Detailed `requested / covered / missing` coverage statistics and missing codepoint reporting.
  - Optional hinting and redundant table stripping for minimal web font payloads.
- **Full Local Format Conversion**
  - Convert in a single pass to **TTF, WOFF2, WOFF, OTF (quadratic TrueType outlines promoted to cubic CFF Béziers), EOT, and SVG**, with real-time compression ratio comparisons.
- **Lossless TTC Pack & Unpack**
  - Inspect `.ttc` TrueType Collection faces and shared-table deduplication statistics.
  - Extract individual or all faces as standalone SFNT fonts, or pack multiple fonts into a deduplicated `.ttc` collection.
- **Font Inspection & Live Preview**
  - View Family / PostScript names, UPM, glyph counts, codepoint coverage, and outline types at a glance.
  - Preview processed fonts in real time directly in the browser via the `FontFace` API.

---

## Product Highlights

- **100% Local Privacy**: Font bytes stay strictly in browser memory and never leave your device; works offline once loaded.
- **High-Performance WebAssembly**: Powered by the `fntx` Rust core running in a dedicated Web Worker so large font operations never block the UI.
- **Bilingual & Theme-Aware**: Full English (`/`) and Simplified Chinese (`/cn/`) support with flicker-free Light / Dark mode switching.
- **Built-in Guides**: Includes a Web/Desktop font format comparison (`/formats/`) and multi-source subsetting FAQ (`/guide/`).

---

## Tech Stack

- **Frontend**: Astro (SSG) + React (Interactive Workbench Islands) + TypeScript + Tailwind CSS
- **Compute Core**: `fntx` compiled to `wasm32-wasip1` for browser Web Workers
- **Hosting**: Cloudflare Pages

---

## Local Development & Deployment

```bash
# Install dependencies
pnpm install

# Start local dev server
pnpm dev

# Run checks (lint + format + tsc) and production build
pnpm check && pnpm build

# Deploy to Cloudflare Pages
pnpm deploy
```
