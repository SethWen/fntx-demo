import { useState } from 'react';
import { Download, Info, Layers, Loader2, RefreshCw } from 'lucide-react';
import type { ContainerFormat, FontFormat, FontInfoOutput } from '@/vendor/fntx-wasm/index';
import { translations, type Lang } from '../../i18n/translations';
import { fntxClient } from '../../lib/fntx-client';
import { downloadBytes, formatBytes, stripExtension } from '../../lib/format-utils';
import { FontPreview } from './FontPreview';
import type { TabKey } from './FontWorkbench';

interface ConvertPanelProps {
  lang: Lang;
  fileName: string;
  fileData: Uint8Array | null;
  sfntData: Uint8Array | null;
  format: ContainerFormat | null;
  fontInfo: FontInfoOutput | null;
  onError: (message: string) => void;
  onSwitchTab: (tab: TabKey) => void;
}

const FORMATS: FontFormat[] = ['woff2', 'ttf', 'otf', 'woff', 'eot', 'svg'];

function isFormatDisabled(
  target: FontFormat,
  sourceFormat: ContainerFormat | null,
  fontInfo: FontInfoOutput | null,
): boolean {
  if (target === sourceFormat) return true;
  if (fontInfo && !fontInfo.isTruetype && target === 'eot') return true;
  return false;
}

export function ConvertPanel({
  lang,
  fileName,
  fileData,
  sfntData,
  format,
  fontInfo,
  onError,
  onSwitchTab,
}: ConvertPanelProps) {
  const t = translations[lang].workbench.convert;
  const [targetFormat, setTargetFormat] = useState<FontFormat>('woff2');
  const [busy, setBusy] = useState(false);
  const [outputState, setOutputState] = useState<{
    source: Uint8Array;
    format: FontFormat;
    data: Uint8Array;
  } | null>(null);

  const effectiveTarget = isFormatDisabled(targetFormat, format, fontInfo)
    ? (FORMATS.find((fmt) => !isFormatDisabled(fmt, format, fontInfo)) ?? targetFormat)
    : targetFormat;

  const output = outputState && outputState.source === fileData ? outputState : null;

  const handleConvert = async () => {
    if (!sfntData || !fileData) return;
    setBusy(true);
    onError('');
    try {
      const converted = await fntxClient.convert(sfntData, effectiveTarget);
      setOutputState({ source: fileData, format: effectiveTarget, data: converted });
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  if (!fileData || !format) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        {translations[lang].workbench.inspect.empty}
      </div>
    );
  }

  if (format === 'ttc') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-violet-300/60 bg-violet-500/5 py-10 text-center dark:border-violet-400/25">
        <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">{t.ttcNotice}</p>
        <button
          type="button"
          onClick={() => onSwitchTab('ttc')}
          className="qv-btn-primary inline-flex items-center gap-2 rounded-xl border border-violet-400/35 px-4 py-2 text-xs font-medium text-white"
        >
          <Layers className="h-4 w-4" />
          <span>{t.goToTtc}</span>
        </button>
      </div>
    );
  }

  if (!sfntData || !fontInfo) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        {t.unsupportedNotice}
      </div>
    );
  }

  const ratioPct =
    output && fileData.byteLength > 0
      ? (((output.data.byteLength - fileData.byteLength) / fileData.byteLength) * 100).toFixed(1)
      : null;

  return (
    <div className="space-y-5">
      {!fontInfo.isTruetype && (
        <div className="flex items-center gap-2 rounded-xl border border-sky-200/80 bg-sky-50/80 p-3 text-xs text-sky-800 dark:border-sky-500/30 dark:bg-sky-950/30 dark:text-sky-300">
          <Info className="h-4 w-4 shrink-0" />
          <span>{t.cffUnsupportedHint}</span>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <label className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-300">
            {t.targetFormat}
          </label>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((fmt) => {
              const disabled = isFormatDisabled(fmt, format, fontInfo);
              const isCurrent = fmt === format;
              return (
                <button
                  key={fmt}
                  type="button"
                  disabled={disabled}
                  onClick={() => setTargetFormat(fmt)}
                  className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase transition ${
                    disabled
                      ? 'cursor-not-allowed border-slate-200/60 bg-slate-100/70 text-slate-400 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-600'
                      : effectiveTarget === fmt
                        ? 'border-violet-600 bg-violet-600 text-white shadow-xs'
                        : 'border-slate-200/80 bg-white/70 text-slate-700 hover:border-violet-400 dark:border-violet-400/20 dark:bg-[#1a1733]/60 dark:text-slate-200'
                  }`}
                >
                  <span>{fmt}</span>
                  {isCurrent && (
                    <span className="text-[10px] font-normal opacity-80">
                      ({t.currentFormatTag})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          disabled={busy || isFormatDisabled(effectiveTarget, format, fontInfo)}
          onClick={handleConvert}
          className="qv-btn-primary inline-flex items-center gap-2 rounded-xl border border-violet-400/35 px-5 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
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
              className="qv-btn-primary inline-flex items-center gap-2 rounded-lg border border-violet-400/35 px-4 py-2 text-xs font-medium text-white transition"
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
