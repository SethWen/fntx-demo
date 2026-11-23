import type {
  BuildParams,
  FontFormat,
  FontInfoOutput,
  FontSourceConfig,
  EngineOptions,
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
  | { type: 'inspect'; data: Uint8Array }
  | { type: 'convert'; data: Uint8Array; format: FontFormat }
  | {
      type: 'build';
      sources: FontSourceConfig[];
      options?: EngineOptions;
      params: BuildParams;
    }
  | { type: 'inspectTtc'; data: Uint8Array }
  | { type: 'sfntFromTtc'; data: Uint8Array; index: number }
  | { type: 'sfntsFromTtc'; data: Uint8Array }
  | { type: 'ttcFromSfnts'; fonts: Uint8Array[] };

export type WorkerRequest = WorkerRequestPayload & { id: number };

export interface BuildOutputPayload {
  requested: number;
  covered: number;
  missing: number[];
  formats: FontFormat[];
  outputs: Array<{ format: FontFormat; data: Uint8Array }>;
}

export type WorkerResponse =
  | { id: number; ok: true; type: 'init' }
  | { id: number; ok: true; type: 'inspect'; result: FontInfoOutput }
  | { id: number; ok: true; type: 'convert'; result: Uint8Array }
  | { id: number; ok: true; type: 'build'; result: BuildOutputPayload }
  | { id: number; ok: true; type: 'inspectTtc'; result: TtcInfoOutput }
  | { id: number; ok: true; type: 'sfntFromTtc'; result: Uint8Array }
  | { id: number; ok: true; type: 'sfntsFromTtc'; result: Uint8Array[] }
  | { id: number; ok: true; type: 'ttcFromSfnts'; result: Uint8Array }
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
      case 'sfntFromTtc': {
        const result = wasm.sfntFromTtc(req.data, req.index);
        self.postMessage(
          { id: req.id, ok: true, type: 'sfntFromTtc', result } satisfies WorkerResponse,
          { transfer: [result.buffer] },
        );
        break;
      }
      case 'sfntsFromTtc': {
        const result = wasm.sfntsFromTtc(req.data);
        self.postMessage(
          { id: req.id, ok: true, type: 'sfntsFromTtc', result } satisfies WorkerResponse,
          { transfer: result.map((item: Uint8Array) => item.buffer) },
        );
        break;
      }
      case 'ttcFromSfnts': {
        const result = wasm.ttcFromSfnts(req.fonts);
        self.postMessage(
          { id: req.id, ok: true, type: 'ttcFromSfnts', result } satisfies WorkerResponse,
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
