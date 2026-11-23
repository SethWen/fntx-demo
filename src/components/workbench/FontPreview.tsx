import { useEffect, useId, useState } from 'react';
import { translations, type Lang } from '../../i18n/translations';

interface FontPreviewProps {
  fontBytes: Uint8Array | null;
  format?: string;
  lang: Lang;
}

const PREVIEWABLE_FORMATS = new Set(['ttf', 'otf', 'woff', 'woff2']);

export function FontPreview({ fontBytes, format = 'ttf', lang }: FontPreviewProps) {
  const t = translations[lang].workbench.preview;
  const uid = useId().replace(/:/g, '');
  const [customText, setCustomText] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(28);
  const [loadedFamily, setLoadedFamily] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSupported = PREVIEWABLE_FORMATS.has(format.toLowerCase());
  const sampleText = customText ?? t.placeholder;
  const activeFamily = fontBytes && isSupported ? loadedFamily : null;

  useEffect(() => {
    if (!fontBytes || !isSupported) {
      return;
    }

    let cancelled = false;
    const familyName = `fntx-preview-${uid}-${Date.now()}`;
    const copy = new Uint8Array(fontBytes);
    const blob = new Blob([copy]);
    const url = URL.createObjectURL(blob);
    const face = new FontFace(familyName, `url(${url})`);

    Promise.resolve()
      .then(() => {
        if (!cancelled) setLoading(true);
        return face.load();
      })
      .then((loaded) => {
        if (cancelled) return;
        document.fonts.add(loaded);
        setLoadedFamily(familyName);
      })
      .catch(() => {
        if (!cancelled) setLoadedFamily(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      document.fonts.delete(face);
      URL.revokeObjectURL(url);
    };
  }, [fontBytes, isSupported, uid]);

  if (!fontBytes) return null;

  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.title}</span>
        {isSupported && (
          <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>
              {t.sizeLabel}: {fontSize}px
            </span>
            <input
              type="range"
              min={14}
              max={64}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="accent-indigo-600"
            />
          </label>
        )}
      </div>

      {!isSupported ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{t.unsupported}</p>
      ) : (
        <>
          {loading && (
            <p className="mb-2 text-xs text-indigo-600 dark:text-indigo-400">{t.loading}</p>
          )}
          <textarea
            value={sampleText}
            onChange={(e) => setCustomText(e.target.value)}
            rows={3}
            style={{
              fontFamily: activeFamily ? `"${activeFamily}", sans-serif` : undefined,
              fontSize: `${fontSize}px`,
              lineHeight: 1.4,
            }}
            className="w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </>
      )}
    </div>
  );
}
