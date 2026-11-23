import { useState } from 'react';
import { Download, Loader2, RefreshCw } from 'lucide-react';
import type { FontFormat } from '../../../vendor/fntx-wasm/index';
import { translations, type Lang } from '../../i18n/translations';
import { fntxClient } from '../../lib/fntx-client';
import { downloadBytes, formatBytes, stripExtension } from '../../lib/format-utils';
import { FontPreview } from './FontPreview';

interface ConvertPanelProps {
  lang: Lang;
  fileName: string;
  fileData: Uint8Array | null;
  onError: (message: string) => void;
}

const FORMATS: FontFormat[] = ['woff2', 'ttf', 'otf', 'woff', 'eot', 'svg'];

export function ConvertPanel({ lang, fileName, fileData, onError }: ConvertPanelProps) {
  const t = translations[lang].workbench.convert;
  const [targetFormat, setTargetFormat] = useState<FontFormat>('woff2');
  const [busy, setBusy] = useState(false);
  const [output, setOutput] = useState<{ format: FontFormat; data: Uint8Array } | null>(null);

  const handleConvert = async () => {
    if (!fileData) return;
    setBusy(true);
    onError('');
    try {
      const converted = await fntxClient.convert(fileData, targetFormat);
      setOutput({ format: targetFormat, data: converted });
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  if (!fileData) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        {translations[lang].workbench.inspect.empty}
      </div>
    );
  }

  const ratioPct =
    output && fileData.byteLength > 0
      ? (((output.data.byteLength - fileData.byteLength) / fileData.byteLength) * 100).toFixed(1)
      : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <label className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-300">
            {t.targetFormat}
          </label>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setTargetFormat(fmt)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase transition ${
                  targetFormat === fmt
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={handleConvert}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span>{busy ? t.running : t.run}</span>
        </button>
      </div>

      {output && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t.originalSize}</div>
                <div className="font-semibold">{formatBytes(fileData.byteLength)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t.outputSize}</div>
                <div className="font-semibold">{formatBytes(output.data.byteLength)}</div>
              </div>
              {ratioPct !== null && (
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t.ratio}</div>
                  <div
                    className={`font-semibold ${
                      Number(ratioPct) <= 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {Number(ratioPct) > 0 ? `+${ratioPct}%` : `${ratioPct}%`}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                downloadBytes(output.data, `${stripExtension(fileName)}.${output.format}`)
              }
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-600 bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-indigo-500"
            >
              <Download className="h-3.5 w-3.5" />
              <span>
                {t.download} (.{output.format})
              </span>
            </button>
          </div>

          <FontPreview fontBytes={output.data} format={output.format} lang={lang} />
        </div>
      )}
    </div>
  );
}
