import type { FontInfoOutput } from '../../../vendor/fntx-wasm/index';
import { translations, type Lang } from '../../i18n/translations';
import { formatBytes } from '../../lib/format-utils';
import { FontPreview } from './FontPreview';

interface InspectPanelProps {
  lang: Lang;
  info: FontInfoOutput | null;
  fileData: Uint8Array | null;
  fileExt: string;
}

export function InspectPanel({ lang, info, fileData, fileExt }: InspectPanelProps) {
  const t = translations[lang].workbench.inspect;

  if (!info || !fileData) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        {t.empty}
      </div>
    );
  }

  const rows: Array<{ label: string; value: string }> = [
    { label: t.familyName, value: info.familyName || '-' },
    { label: t.postscriptName, value: info.postscriptName || '-' },
    { label: t.unitsPerEm, value: String(info.unitsPerEm) },
    { label: t.glyphCount, value: info.glyphCount.toLocaleString() },
    { label: t.codepointCount, value: info.codepointCount.toLocaleString() },
    { label: t.outlineType, value: info.isTruetype ? t.truetype : t.cff },
    { label: t.fileSize, value: formatBytes(fileData.byteLength) },
  ];

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
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
        ))}
      </div>

      <FontPreview fontBytes={fileData} format={fileExt} lang={lang} />
    </div>
  );
}
