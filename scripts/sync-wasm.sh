#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEMO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC_DIR="${1:-$DEMO_ROOT/../fntx/crates/fntx-napi/dist}"
DEST_DIR="$DEMO_ROOT/src/vendor/fntx-wasm"

if [[ ! -f "$SRC_DIR/fntx.wasip1-browser.js" ]] || [[ ! -f "$SRC_DIR/fntx.wasm32-wasip1.wasm" ]]; then
  echo "Error: WASM artifacts not found in $SRC_DIR" >&2
  echo "Run 'npm run build:wasm' in ../fntx/crates/fntx-napi first." >&2
  exit 1
fi

mkdir -p "$DEST_DIR"
cp "$SRC_DIR/fntx.wasip1-browser.js" "$DEST_DIR/"
cp "$SRC_DIR/fntx.wasm32-wasip1.wasm" "$DEST_DIR/"
cp "$SRC_DIR/index.d.ts" "$DEST_DIR/"

echo "Synced fntx WASM artifacts to $DEST_DIR"
ls -lh "$DEST_DIR"
