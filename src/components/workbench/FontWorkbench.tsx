import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FileType2,
  Info,
  Layers,
  Loader2,
  RefreshCw,
  Scissors,
  Upload,
  X,
} from 'lucide-react';
import type { FontInfoOutput } from '../../../vendor/fntx-wasm/index';
import { translations, type Lang } from '../../i18n/translations';
import { fntxClient, type EngineStatus } from '../../lib/fntx-client';
import { formatBytes } from '../../lib/format-utils';
import { ConvertPanel } from './ConvertPanel';
import { InspectPanel } from './InspectPanel';
import { SubsetPanel } from './SubsetPanel';
import { TtcPanel } from './TtcPanel';

type TabKey = 'inspect' | 'subset' | 'convert' | 'ttc';

interface FontWorkbenchProps {
  lang: Lang;
}

export function FontWorkbench({ lang }: FontWorkbenchProps) {
  const t = translations[lang].workbench;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<TabKey>('inspect');
  const [engineStatus, setEngineStatus] = useState<EngineStatus>(() => fntxClient.getStatus());
  const [dragging, setDragging] = useState(false);

  const [activeFile, setActiveFile] = useState<{
    name: string;
    ext: string;
    data: Uint8Array;
  } | null>(null);
  const [fontInfo, setFontInfo] = useState<FontInfoOutput | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    return fntxClient.subscribeStatus(setEngineStatus);
  }, []);

  const loadFontFile = async (file: File) => {
    setError('');
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const data = new Uint8Array(await file.arrayBuffer());
    setActiveFile({ name: file.name, ext, data });
    setFontInfo(null);

    if (ext === 'ttc' || ext === 'otc') {
      setActiveTab('ttc');
      return;
    }

    try {
      const info = await fntxClient.inspect(data);
      setFontInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleClear = () => {
    setActiveFile(null);
    setFontInfo(null);
    setError('');
  };

  const statusBadge = {
    idle: {
      text: t.engine.idle,
      cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
      icon: null,
    },
    loading: {
      text: t.engine.loading,
      cls: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
    },
    ready: {
      text: t.engine.ready,
      cls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    },
    error: {
      text: t.engine.error,
      cls: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      icon: <AlertCircle className="h-3.5 w-3.5" />,
    },
  }[engineStatus];

  const tabs: Array<{ key: TabKey; label: string; icon: typeof Info }> = [
    { key: 'inspect', label: t.tabs.inspect, icon: Info },
    { key: 'subset', label: t.tabs.subset, icon: Scissors },
    { key: 'convert', label: t.tabs.convert, icon: RefreshCw },
    { key: 'ttc', label: t.tabs.ttc, icon: Layers },
  ];

  return (
    <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-950">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  setError('');
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition sm:text-sm ${
                  active
                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusBadge.cls}`}
        >
          {statusBadge.icon}
          <span>{statusBadge.text}</span>
        </span>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void loadFontFile(file);
        }}
        className={`mb-6 rounded-xl border-2 border-dashed p-5 transition ${
          dragging
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
            : 'border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".ttf,.otf,.woff,.woff2,.eot,.ttc,.otc"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void loadFontFile(file);
            e.target.value = '';
          }}
        />

        {!activeFile ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
            }}
            className="flex cursor-pointer flex-col items-center justify-center py-4 text-center"
          >
            <div className="mb-3 rounded-full bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Upload className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {t.dropzone.title}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.dropzone.subtitle}</p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <FileType2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t.dropzone.loaded}
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {activeFile.name}{' '}
                  <span className="font-normal text-slate-500">
                    ({formatBytes(activeFile.data.byteLength)})
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">{t.dropzone.sampleHint}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {t.dropzone.replace}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:border-slate-700 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-950/30"
              >
                <X className="h-3.5 w-3.5" />
                <span>{t.dropzone.clear}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="break-all">{error}</span>
        </div>
      )}

      {/* Active Panel */}
      {activeTab === 'inspect' && (
        <InspectPanel
          lang={lang}
          info={fontInfo}
          fileData={activeFile?.data ?? null}
          fileExt={activeFile?.ext ?? 'ttf'}
        />
      )}
      {activeTab === 'subset' && (
        <SubsetPanel
          lang={lang}
          fileName={activeFile?.name ?? 'font.ttf'}
          fileData={activeFile?.data ?? null}
          onError={setError}
        />
      )}
      {activeTab === 'convert' && (
        <ConvertPanel
          lang={lang}
          fileName={activeFile?.name ?? 'font.ttf'}
          fileData={activeFile?.data ?? null}
          onError={setError}
        />
      )}
      {activeTab === 'ttc' && (
        <TtcPanel
          lang={lang}
          activeFileName={activeFile?.name ?? 'collection.ttc'}
          activeFileData={activeFile?.data ?? null}
          onError={setError}
        />
      )}
    </section>
  );
}
