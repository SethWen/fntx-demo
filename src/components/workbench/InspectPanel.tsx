import { Layers } from 'lucide-react';
import type { ContainerFormat, FontInfoOutput } from '@/vendor/fntx-wasm/index';
import { translations, type Lang } from '../../i18n/translations';
import { formatBytes } from '../../lib/format-utils';
import { FontPreview } from './FontPreview';
import type { TabKey } from './FontWorkbench';

interface InspectPanelProps {
  lang: Lang;
  format: ContainerFormat | null;
  info: FontInfoOutput | null;
  fileData: Uint8Array | null;
  sfntData: Uint8Array | null;
  onSwitchTab: (tab: TabKey) => void;
}

export function InspectPanel({
  lang,
  format,
  info,
  fileData,
  sfntData,
  onSwitchTab,
}: InspectPanelProps) {
  const t = translations[lang].workbench.inspect;

  if (!fileData || !format) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        {t.empty}
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

  if (!info) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        {t.unsupportedNotice}
      </div>
    );
  }

  const basicRows: Array<{ label: string; value: string }> = [
    { label: t.familyName, value: info.familyName || '-' },
    { label: t.containerFormat, value: format.toUpperCase() },
    { label: t.codepointCount, value: info.codepointCount.toLocaleString() },
    { label: t.fileSize, value: formatBytes(fileData.byteLength) },
  ];

  const advancedRows: Array<{ label: string; value: string }> = [
    { label: t.postscriptName, value: info.postscriptName || '-' },
    { label: t.unitsPerEm, value: String(info.unitsPerEm) },
    { label: t.glyphCount, value: info.glyphCount.toLocaleString() },
    { label: t.outlineType, value: info.isTruetype ? t.truetype : t.cff },
  ];

  const previewBytes = sfntData ?? fileData;
  const previewFormat = info.isTruetype ? 'ttf' : 'otf';

  const renderRow = (row: { label: string; value: string }) => (
    <div
      key={row.label}
      className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/50"
    >
      <div className="text-xs text-slate-500 dark:text-slate-400">{row.label}</div>
      <div
        className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-slate-100"
        title={row.value}
      >
        {row.value}
      </div>
    </div>
  );

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{basicRows.map(renderRow)}</div>

      <details className="group mt-3 rounded-xl border border-slate-200/80 bg-white/40 p-3.5 dark:border-slate-800 dark:bg-slate-900/30">
        <summary className="cursor-pointer text-xs font-medium text-slate-600 marker:text-violet-500 dark:text-slate-300">
          {t.advancedParams}
        </summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {advancedRows.map(renderRow)}
        </div>
      </details>

      <FontPreview fontBytes={previewBytes} format={previewFormat} lang={lang} />
    </div>
  );
}
