import type {
  BuildParams,
  ContainerFormat,
  EngineOptions,
  FontFormat,
  FontInfoOutput,
  FontSourceConfig,
  TtcInfoOutput,
} from '@/vendor/fntx-wasm/index';

type WasmModule = typeof import('@/vendor/fntx-wasm/fntx.wasip1-browser.js');

let wasmModulePromise: Promise<WasmModule> | null = null;

async function getWasm(): Promise<WasmModule> {
  if (!wasmModulePromise) {
    wasmModulePromise = import('@/vendor/fntx-wasm/fntx.wasip1-browser.js');
  }
  return wasmModulePromise;
}

export type WorkerRequestPayload =
  | { type: 'init' }
  | { type: 'detectFormat'; data: Uint8Array }
  | { type: 'toSfnt'; data: Uint8Array }
  | { type: 'loadFont'; data: Uint8Array }
  | { type: 'inspect'; data: Uint8Array }
  | { type: 'convert'; data: Uint8Array; format: FontFormat }
  | {
      type: 'build';
      sources: FontSourceConfig[];
      options?: EngineOptions;
      params: BuildParams;
    }
  | { type: 'inspectTtc'; data: Uint8Array }
  | { type: 'unpackTtcAt'; data: Uint8Array; index: number }
  | { type: 'unpackTtc'; data: Uint8Array }
  | { type: 'packTtc'; fonts: Uint8Array[] };

export type WorkerRequest = WorkerRequestPayload & { id: number };

export interface LoadedFontPayload {
  format: ContainerFormat;
  sfntData: Uint8Array | null;
  info: FontInfoOutput | null;
  ttcInfo: TtcInfoOutput | null;
}

export interface BuildOutputPayload {
  requested: number;
  covered: number;
  missing: number[];
  formats: FontFormat[];
  outputs: Array<{ format: FontFormat; data: Uint8Array }>;
}

export type WorkerResponse =
  | { id: number; ok: true; type: 'init' }
  | { id: number; ok: true; type: 'detectFormat'; result: ContainerFormat }
  | { id: number; ok: true; type: 'toSfnt'; result: Uint8Array }
  | { id: number; ok: true; type: 'loadFont'; result: LoadedFontPayload }
  | { id: number; ok: true; type: 'inspect'; result: FontInfoOutput }
  | { id: number; ok: true; type: 'convert'; result: Uint8Array }
  | { id: number; ok: true; type: 'build'; result: BuildOutputPayload }
  | { id: number; ok: true; type: 'inspectTtc'; result: TtcInfoOutput }
  | { id: number; ok: true; type: 'unpackTtcAt'; result: Uint8Array }
  | { id: number; ok: true; type: 'unpackTtc'; result: Uint8Array[] }
  | { id: number; ok: true; type: 'packTtc'; result: Uint8Array }
  | { id: number; ok: false; error: string };

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const req = event.data;
  try {
    const wasm = await getWasm();

    switch (req.type) {
      case 'init': {
        self.postMessage({ id: req.id, ok: true, type: 'init' } satisfies WorkerResponse);
        break;
      }
      case 'detectFormat': {
        const result = wasm.detectFormat(req.data);
        self.postMessage({
          id: req.id,
          ok: true,
          type: 'detectFormat',
          result,
        } satisfies WorkerResponse);
        break;
      }
      case 'toSfnt': {
        const result = wasm.toSfnt(req.data);
        self.postMessage(
          { id: req.id, ok: true, type: 'toSfnt', result } satisfies WorkerResponse,
          { transfer: [result.buffer] },
        );
        break;
      }
      case 'loadFont': {
        const format = wasm.detectFormat(req.data);
        let sfntData: Uint8Array | null = null;
        let info: FontInfoOutput | null = null;
        let ttcInfo: TtcInfoOutput | null = null;
        const transferables: ArrayBuffer[] = [];

        if (format === 'ttf' || format === 'otf') {
          info = wasm.inspect(req.data);
        } else if (format === 'woff' || format === 'woff2' || format === 'eot') {
          const unpacked = wasm.toSfnt(req.data);
          sfntData = unpacked;
          info = wasm.inspect(unpacked);
          if (unpacked.buffer instanceof ArrayBuffer) {
            transferables.push(unpacked.buffer);
          }
        } else if (format === 'ttc') {
          ttcInfo = wasm.inspectTtc(req.data);
        }

        const result: LoadedFontPayload = { format, sfntData, info, ttcInfo };
        self.postMessage(
          { id: req.id, ok: true, type: 'loadFont', result } satisfies WorkerResponse,
          { transfer: transferables },
        );
        break;
      }
      case 'inspect': {
        const result = wasm.inspect(req.data);
        self.postMessage({
          id: req.id,
          ok: true,
          type: 'inspect',
          result,
        } satisfies WorkerResponse);
        break;
      }
      case 'convert': {
        const result = wasm.convert(req.data, req.format);
        self.postMessage(
          { id: req.id, ok: true, type: 'convert', result } satisfies WorkerResponse,
          { transfer: [result.buffer] },
        );
        break;
      }
      case 'build': {
        const engine = wasm.FontEngine.create({
          sources: req.sources,
          options: req.options,
        });
        const built = engine.build(req.params);
        const outputs: Array<{ format: FontFormat; data: Uint8Array }> = [];
        const transferables: ArrayBuffer[] = [];

        for (const fmt of built.formats) {
          const bytes = built.font(fmt);
          if (bytes) {
            outputs.push({ format: fmt, data: bytes });
            transferables.push(bytes.buffer);
          }
        }

        const payload: BuildOutputPayload = {
          requested: built.requested,
          covered: built.covered,
          missing: built.missing,
          formats: built.formats,
          outputs,
        };

        self.postMessage(
          { id: req.id, ok: true, type: 'build', result: payload } satisfies WorkerResponse,
          { transfer: transferables },
        );
        break;
      }
      case 'inspectTtc': {
        const result = wasm.inspectTtc(req.data);
        self.postMessage({
          id: req.id,
          ok: true,
          type: 'inspectTtc',
          result,
        } satisfies WorkerResponse);
        break;
      }
      case 'unpackTtcAt': {
        const result = wasm.unpackTtcAt(req.data, req.index);
        self.postMessage(
          { id: req.id, ok: true, type: 'unpackTtcAt', result } satisfies WorkerResponse,
          { transfer: [result.buffer] },
        );
        break;
      }
      case 'unpackTtc': {
        const result = wasm.unpackTtc(req.data);
        self.postMessage(
          { id: req.id, ok: true, type: 'unpackTtc', result } satisfies WorkerResponse,
          { transfer: result.map((item: Uint8Array) => item.buffer) },
        );
        break;
      }
      case 'packTtc': {
        const result = wasm.packTtc(req.fonts);
        self.postMessage(
          { id: req.id, ok: true, type: 'packTtc', result } satisfies WorkerResponse,
          { transfer: [result.buffer] },
        );
        break;
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    self.postMessage({ id: req.id, ok: false, error: message } satisfies WorkerResponse);
  }
};
