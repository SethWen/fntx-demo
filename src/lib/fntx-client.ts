import type {
  BuildParams,
  ContainerFormat,
  EngineOptions,
  FontFormat,
  FontInfoOutput,
  FontSourceConfig,
  TtcInfoOutput,
} from '@/vendor/fntx-wasm/index';
import type {
  BuildOutputPayload,
  LoadedFontPayload,
  WorkerRequest,
  WorkerRequestPayload,
  WorkerResponse,
} from '../workers/fntx.worker';

export type EngineStatus = 'idle' | 'loading' | 'ready' | 'error';

type PendingTask = {
  resolve: (value: never) => void;
  reject: (reason: Error) => void;
};

class FntxClient {
  private worker: Worker | null = null;
  private nextId = 1;
  private pending = new Map<number, PendingTask>();
  private status: EngineStatus = 'idle';
  private listeners = new Set<(status: EngineStatus) => void>();

  getStatus(): EngineStatus {
    return this.status;
  }

  subscribeStatus(listener: (status: EngineStatus) => void): () => void {
    this.listeners.add(listener);
    listener(this.status);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private setStatus(next: EngineStatus): void {
    this.status = next;
    for (const listener of this.listeners) {
      listener(next);
    }
  }

  private ensureWorker(): Worker {
    if (!this.worker) {
      this.setStatus('loading');
      this.worker = new Worker(new URL('../workers/fntx.worker.ts', import.meta.url), {
        type: 'module',
      });
      this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const res = event.data;
        const task = this.pending.get(res.id);
        if (!task) return;
        this.pending.delete(res.id);

        if (res.ok) {
          this.setStatus('ready');
          if (res.type === 'init') {
            task.resolve(undefined as never);
          } else {
            task.resolve(res.result as never);
          }
        } else {
          task.reject(new Error(res.error));
        }
      };
      this.worker.onerror = (event) => {
        this.setStatus('error');
        const err = new Error(event.message || 'Worker execution failed');
        for (const task of this.pending.values()) {
          task.reject(err);
        }
        this.pending.clear();
      };
    }
    return this.worker;
  }

  private call<T>(request: WorkerRequestPayload): Promise<T> {
    const worker = this.ensureWorker();
    const id = this.nextId++;
    return new Promise<T>((resolve, reject) => {
      this.pending.set(id, {
        resolve: resolve as (value: never) => void,
        reject,
      });
      worker.postMessage({ ...request, id } as WorkerRequest);
    });
  }

  init(): Promise<void> {
    return this.call<void>({ type: 'init' });
  }

  detectFormat(data: Uint8Array): Promise<ContainerFormat> {
    return this.call<ContainerFormat>({ type: 'detectFormat', data });
  }

  toSfnt(data: Uint8Array): Promise<Uint8Array> {
    return this.call<Uint8Array>({ type: 'toSfnt', data });
  }

  loadFont(data: Uint8Array): Promise<LoadedFontPayload> {
    return this.call<LoadedFontPayload>({ type: 'loadFont', data });
  }

  inspect(data: Uint8Array): Promise<FontInfoOutput> {
    return this.call<FontInfoOutput>({ type: 'inspect', data });
  }

  convert(data: Uint8Array, format: FontFormat): Promise<Uint8Array> {
    return this.call<Uint8Array>({ type: 'convert', data, format });
  }

  build(
    sources: FontSourceConfig[],
    params: BuildParams,
    options?: EngineOptions,
  ): Promise<BuildOutputPayload> {
    return this.call<BuildOutputPayload>({ type: 'build', sources, params, options });
  }

  inspectTtc(data: Uint8Array): Promise<TtcInfoOutput> {
    return this.call<TtcInfoOutput>({ type: 'inspectTtc', data });
  }

  unpackTtcAt(data: Uint8Array, index: number): Promise<Uint8Array> {
    return this.call<Uint8Array>({ type: 'unpackTtcAt', data, index });
  }

  unpackTtc(data: Uint8Array): Promise<Uint8Array[]> {
    return this.call<Uint8Array[]>({ type: 'unpackTtc', data });
  }

  packTtc(fonts: Uint8Array[]): Promise<Uint8Array> {
    return this.call<Uint8Array>({ type: 'packTtc', fonts });
  }
}

export const fntxClient = new FntxClient();
