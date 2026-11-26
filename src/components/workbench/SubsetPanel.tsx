import { useState } from 'react';
import {
  AlertTriangle,
  Download,
  Layers,
  Loader2,
  Plus,
  RefreshCw,
  Scissors,
  Trash2,
} from 'lucide-react';
import type {
  ContainerFormat,
  FontFormat,
  FontInfoOutput,
  FontSourceConfig,
} from '@/vendor/fntx-wasm/index';
import type { BuildOutputPayload } from '../../workers/fntx.worker';
import { translations, type Lang } from '../../i18n/translations';
import { fntxClient } from '../../lib/fntx-client';
import { friendlyError } from '../../lib/error-utils';
import { downloadBytes, formatBytes, stripExtension } from '../../lib/format-utils';
import { FontPreview } from './FontPreview';
import type { TabKey } from './FontWorkbench';

interface SubsetPanelProps {
  lang: Lang;
  fileName: string;
  fileData: Uint8Array | null;
  sfntData: Uint8Array | null;
  format: ContainerFormat | null;
  fontInfo: FontInfoOutput | null;
  onError: (message: string) => void;
  onSwitchTab: (tab: TabKey) => void;
}

interface ExtraSource {
  id: number;
  name: string;
  startHex: string;
  endHex: string;
  data: Uint8Array;
}

const ALL_FORMATS: FontFormat[] = ['woff2', 'ttf', 'otf', 'woff', 'eot', 'svg'];

export function SubsetPanel({
  lang,
  fileName,
  fileData,
  sfntData,
  format,
  fontInfo,
  onError,
  onSwitchTab,
}: SubsetPanelProps) {
  const t = translations[lang].workbench.subset;
  const [text, setText] = useState('你好世界 fntx 0123456789');
  const [customName, setCustomName] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<FontFormat[]>(['woff2', 'ttf']);
  const [dropHinting, setDropHinting] = useState(true);
  const [legacyTableStrip, setLegacyTableStrip] = useState(true);
  const [strict, setStrict] = useState(false);
  const [extraSources, setExtraSources] = useState<ExtraSource[]>([]);
  const [busy, setBusy] = useState(false);
  const [resultState, setResultState] = useState<{
    source: Uint8Array;
    payload: BuildOutputPayload;
  } | null>(null);

  const result = resultState && resultState.source === fileData ? resultState.payload : null;
  const missingCodes = result
    ? result.missing.map((cp) => `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`)
    : [];
  const missingPreview = missingCodes.slice(0, 40);

  const toggleFormat = (fmt: FontFormat) => {
    setSelectedFormats((prev) =>
      prev.includes(fmt)
        ? prev.length > 1
          ? prev.filter((item) => item !== fmt)
          : prev
        : [...prev, fmt],
    );
  };

  const handleAddExtraSource = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const buf = new Uint8Array(await file.arrayBuffer());
    onError('');
    try {
      const loaded = await fntxClient.loadFont(buf);
      const sourceSfnt =
        loaded.sfntData ?? (loaded.format === 'ttf' || loaded.format === 'otf' ? buf : null);
      if (!sourceSfnt || !loaded.info?.isTruetype) {
        onError(t.extraSourceInvalid);
        return;
      }
      setExtraSources((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          name: file.name,
          startHex: '20000',
          endHex: '2FFFF',
          data: sourceSfnt,
        },
      ]);
    } catch (err) {
      onError(friendlyError(err, lang));
    }
  };

  const handleBuild = async () => {
    if (!sfntData) return;
    setBusy(true);
    onError('');
    try {
      const sources: FontSourceConfig[] = [
        {
          label: 'primary',
          start: 0x00000,
          end: 0x0ffff,
          data: sfntData,
        },
        ...extraSources.map((src, idx) => ({
          label: `extra-${idx + 1}`,
          start: Number.parseInt(src.startHex, 16) || 0,
          end: Number.parseInt(src.endHex, 16) || 0x10ffff,
          data: src.data,
        })),
      ];

      const built = await fntxClient.build(
        sources,
        {
          text,
          name: customName.trim() || undefined,
          formats: selectedFormats,
          dropHinting,
          legacyTableStrip,
          strict,
        },
        { dropHinting, legacyTableStrip },
      );
      if (fileData) {
        setResultState({ source: fileData, payload: built });
      }
    } catch (err) {
      onError(friendlyError(err, lang));
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

  const isCff = !fontInfo.isTruetype;

  const previewOutput =
    result?.outputs.find(
      (o) =>
        o.format === 'woff2' || o.format === 'ttf' || o.format === 'otf' || o.format === 'woff',
    ) ?? result?.outputs[0];

  const baseName = customName.trim() || `${stripExtension(fileName)}-subset`;

  return (
    <div className="space-y-5">
      {isCff && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300/70 bg-amber-50/80 p-3.5 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{t.cffWarning}</span>
          </div>
          <button
            type="button"
            onClick={() => onSwitchTab('convert')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/50 bg-white/80 px-3 py-1.5 font-medium text-amber-900 hover:bg-white dark:bg-amber-900/40 dark:text-amber-200"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{t.goToConvert}</span>
          </button>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
          {t.textLabel}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder={t.textPlaceholder}
          className="w-full rounded-xl border border-slate-200/80 bg-white/75 p-3 text-sm outline-none focus:border-violet-500 dark:border-violet-400/20 dark:bg-[#0d0b1a]/70"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
            {t.fontNameLabel}
          </label>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder={t.fontNamePlaceholder}
            className="w-full rounded-xl border border-slate-200/80 bg-white/75 px-3 py-2 text-sm outline-none focus:border-violet-500 dark:border-violet-400/20 dark:bg-[#0d0b1a]/70"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
            {t.formatsLabel}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_FORMATS.map((fmt) => {
              const active = selectedFormats.includes(fmt);
              return (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => toggleFormat(fmt)}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold uppercase transition ${
                    active
                      ? 'border-violet-600 bg-violet-600 text-white'
                      : 'border-slate-200/80 bg-white/70 text-slate-600 hover:border-violet-400 dark:border-violet-400/20 dark:bg-[#1a1733]/60 dark:text-slate-300'
                  }`}
                >
                  {fmt}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">{t.formatsHint}</p>
        </div>
      </div>

      <details className="rounded-xl border border-slate-200/80 bg-white/40 p-3.5 dark:border-slate-800 dark:bg-slate-900/30">
        <summary className="cursor-pointer text-xs font-medium text-slate-600 marker:text-violet-500 dark:text-slate-300">
          {t.advancedOptions}
        </summary>

        <div className="mt-3 space-y-4">
          <div className="flex flex-wrap gap-5 text-xs text-slate-600 dark:text-slate-300">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={dropHinting}
                onChange={(e) => setDropHinting(e.target.checked)}
                className="accent-violet-600"
              />
              <span>{t.dropHinting}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={legacyTableStrip}
                onChange={(e) => setLegacyTableStrip(e.target.checked)}
                className="accent-violet-600"
              />
              <span>{t.legacyTableStrip}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={strict}
                onChange={(e) => setStrict(e.target.checked)}
                className="accent-violet-600"
              />
              <span>{t.strictMode}</span>
            </label>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {t.extraSourcesTitle}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t.extraSourcesDesc}
                </div>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                <Plus className="h-3.5 w-3.5" />
                <span>{t.addSource}</span>
                <input
                  type="file"
                  accept=".ttf,.woff,.woff2,.eot"
                  className="hidden"
                  onChange={(e) => {
                    void handleAddExtraSource(e.target.files);
                    e.target.value = '';
                  }}
                />
              </label>
            </div>

            {extraSources.length > 0 && (
              <div className="mt-3 space-y-2">
                {extraSources.map((src) => (
                  <div
                    key={src.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                  >
                    <span className="max-w-[180px] truncate font-medium">{src.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{t.rangeStart}:</span>
                      <input
                        type="text"
                        value={src.startHex}
                        onChange={(e) =>
                          setExtraSources((prev) =>
                            prev.map((item) =>
                              item.id === src.id ? { ...item, startHex: e.target.value } : item,
                            ),
                          )
                        }
                        className="w-20 rounded border border-slate-200 px-2 py-1 font-mono dark:border-slate-700 dark:bg-slate-900"
                      />
                      <span className="text-slate-400">{t.rangeEnd}:</span>
                      <input
                        type="text"
                        value={src.endHex}
                        onChange={(e) =>
                          setExtraSources((prev) =>
                            prev.map((item) =>
                              item.id === src.id ? { ...item, endHex: e.target.value } : item,
                            ),
                          )
                        }
                        className="w-20 rounded border border-slate-200 px-2 py-1 font-mono dark:border-slate-700 dark:bg-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setExtraSources((prev) => prev.filter((item) => item.id !== src.id))
                        }
                        className="p-1 text-rose-500 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </details>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={busy || isCff || !text.trim()}
          onClick={handleBuild}
          className="qv-btn-primary inline-flex items-center gap-2 rounded-xl border border-violet-400/35 px-5 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scissors className="h-4 w-4" />}
          <span>{busy ? t.running : t.run}</span>
        </button>
      </div>

      {result && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div>
              <span className="text-slate-500 dark:text-slate-400">{t.coverage}: </span>
              <span className="font-semibold">
                {result.covered} / {result.requested}
              </span>
            </div>
            <div className="text-xs">
              <span className="text-slate-500 dark:text-slate-400">{t.missingCodepoints}: </span>
              {result.missing.length === 0 ? (
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {t.noneMissing}
                </span>
              ) : missingCodes.length > missingPreview.length ? (
                <details>
                  <summary className="cursor-pointer font-mono text-amber-600 dark:text-amber-400">
                    {missingPreview.join(', ')} … +{missingCodes.length - missingPreview.length}
                  </summary>
                  <div className="mt-1 max-h-40 overflow-auto font-mono text-amber-600 dark:text-amber-400">
                    {missingCodes.join(', ')}
                  </div>
                </details>
              ) : (
                <span className="font-mono text-amber-600 dark:text-amber-400">
                  {missingCodes.join(', ')}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {result.outputs.map((item) => (
              <button
                key={item.format}
                type="button"
                onClick={() => downloadBytes(item.data, `${baseName}.${item.format}`)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/75 px-3.5 py-2 text-xs font-medium text-slate-800 shadow-xs transition hover:border-violet-500 hover:text-violet-600 dark:border-violet-400/20 dark:bg-[#0d0b1a]/70 dark:text-slate-100"
              >
                <Download className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                <span className="uppercase">{item.format}</span>
                <span className="text-slate-400">({formatBytes(item.data.byteLength)})</span>
              </button>
            ))}
          </div>

          {previewOutput && (
            <FontPreview fontBytes={previewOutput.data} format={previewOutput.format} lang={lang} />
          )}
        </div>
      )}
    </div>
  );
}
