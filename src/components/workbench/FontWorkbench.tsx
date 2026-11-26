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
import type { ContainerFormat, FontInfoOutput, TtcInfoOutput } from '@/vendor/fntx-wasm/index';
import { translations, type Lang } from '../../i18n/translations';
import { fntxClient, type EngineStatus } from '../../lib/fntx-client';
import { friendlyError } from '../../lib/error-utils';
import { formatBytes } from '../../lib/format-utils';
import { ConvertPanel } from './ConvertPanel';
import { InspectPanel } from './InspectPanel';
import { SubsetPanel } from './SubsetPanel';
import { TtcPanel } from './TtcPanel';

export type TabKey = 'inspect' | 'subset' | 'convert' | 'ttc';

interface ActiveFont {
  name: string;
  data: Uint8Array;
  format: ContainerFormat;
  sfntData: Uint8Array | null;
  info: FontInfoOutput | null;
  ttcInfo: TtcInfoOutput | null;
}

interface FontWorkbenchProps {
  lang: Lang;
  initialTab?: TabKey;
  syncTab?: boolean;
}

const TAB_KEYS: TabKey[] = ['inspect', 'subset', 'convert', 'ttc'];

export function FontWorkbench({
  lang,
  initialTab = 'inspect',
  syncTab = false,
}: FontWorkbenchProps) {
  const t = translations[lang].workbench;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [engineStatus, setEngineStatus] = useState<EngineStatus>(() => fntxClient.getStatus());
  const [dragging, setDragging] = useState(false);

  const [activeFile, setActiveFile] = useState<ActiveFont | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    return fntxClient.subscribeStatus(setEngineStatus);
  }, []);

  useEffect(() => {
    if (!syncTab) return;
    const requested = new URLSearchParams(window.location.search).get('tab');
    if (requested && TAB_KEYS.includes(requested as TabKey)) {
      setActiveTab(requested as TabKey);
    }
  }, [syncTab]);

  useEffect(() => {
    if (!syncTab) return;
    const url = new URL(window.location.href);
    if (activeTab === 'inspect') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', activeTab);
    }
    window.history.replaceState(null, '', url);
  }, [activeTab, syncTab]);

  const loadFontBytes = async (name: string, data: Uint8Array, nextTab?: TabKey) => {
    setError('');
    try {
      const loaded = await fntxClient.loadFont(data);
      const effectiveSfnt =
        loaded.sfntData ?? (loaded.format === 'ttf' || loaded.format === 'otf' ? data : null);

      setActiveFile({
        name,
        data,
        format: loaded.format,
        sfntData: effectiveSfnt,
        info: loaded.info,
        ttcInfo: loaded.ttcInfo,
      });

      if (loaded.format === 'ttc') {
        setActiveTab(nextTab ?? 'ttc');
      } else if (nextTab) {
        setActiveTab(nextTab);
      } else if (loaded.format === 'svg' || loaded.format === 'unknown') {
        setError(t.inspect.unsupportedNotice);
      }
    } catch (err) {
      setActiveFile(null);
      setError(friendlyError(err, lang));
    }
  };

  const loadFontFile = async (file: File) => {
    const data = new Uint8Array(await file.arrayBuffer());
    await loadFontBytes(file.name, data);
  };

  const handleClear = () => {
    setActiveFile(null);
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
      cls: 'bg-violet-500/12 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300',
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

  const formatBadgeText = (() => {
    if (!activeFile) return null;
    const fmt = activeFile.format.toUpperCase();
    if (activeFile.format === 'ttc' && activeFile.ttcInfo) {
      return `${fmt} · ${activeFile.ttcInfo.fontCount} ${lang === 'zh' ? '个字体' : 'faces'}`;
    }
    if (activeFile.info) {
      return `${fmt} · ${activeFile.info.isTruetype ? 'TrueType' : 'CFF'}`;
    }
    return fmt;
  })();

  return (
    <section className="qv-glass mx-auto max-w-5xl rounded-2xl border border-violet-950/10 p-5 sm:p-6 dark:border-violet-400/15">
      <h2 className="sr-only">{t.heading}</h2>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-violet-950/10 bg-white/45 p-1 backdrop-blur-md dark:border-violet-400/15 dark:bg-[#1b1734]/45">
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
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition sm:text-sm ${
                  active
                    ? 'bg-linear-to-r from-violet-600/20 to-sky-400/20 text-violet-950 shadow-xs ring-1 ring-violet-500/25 dark:from-violet-500/30 dark:to-sky-400/20 dark:text-white dark:ring-violet-400/30'
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
        className={`mb-6 rounded-xl border border-dashed p-5 transition ${
          dragging
            ? 'border-violet-500 bg-violet-500/10 dark:border-violet-400 dark:bg-violet-500/15'
            : 'border-violet-950/15 bg-white/35 dark:border-violet-400/20 dark:bg-[#1a1733]/35'
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
            <div className="mb-3 rounded-full bg-violet-500/12 p-3 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300">
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
              <div className="rounded-lg bg-violet-500/12 p-2.5 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300">
                <FileType2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{t.dropzone.loaded}</span>
                  {formatBadgeText && (
                    <span className="rounded-md bg-violet-500/12 px-2 py-0.5 text-[11px] font-semibold text-violet-700 dark:bg-violet-400/15 dark:text-violet-300">
                      {formatBadgeText}
                    </span>
                  )}
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
          format={activeFile?.format ?? null}
          info={activeFile?.info ?? null}
          fileData={activeFile?.data ?? null}
          sfntData={activeFile?.sfntData ?? null}
          onSwitchTab={setActiveTab}
        />
      )}
      {activeTab === 'subset' && (
        <SubsetPanel
          lang={lang}
          fileName={activeFile?.name ?? 'font.ttf'}
          fileData={activeFile?.data ?? null}
          sfntData={activeFile?.sfntData ?? null}
          format={activeFile?.format ?? null}
          fontInfo={activeFile?.info ?? null}
          onError={setError}
          onSwitchTab={setActiveTab}
        />
      )}
      {activeTab === 'convert' && (
        <ConvertPanel
          lang={lang}
          fileName={activeFile?.name ?? 'font.ttf'}
          fileData={activeFile?.data ?? null}
          sfntData={activeFile?.sfntData ?? null}
          format={activeFile?.format ?? null}
          fontInfo={activeFile?.info ?? null}
          onError={setError}
          onSwitchTab={setActiveTab}
        />
      )}
      {activeTab === 'ttc' && (
        <TtcPanel
          lang={lang}
          activeFileName={activeFile?.name ?? 'collection.ttc'}
          activeFileData={activeFile?.data ?? null}
          sfntData={activeFile?.sfntData ?? null}
          format={activeFile?.format ?? null}
          ttcInfo={activeFile?.ttcInfo ?? null}
          onError={setError}
          onUseFont={(name, bytes) => void loadFontBytes(name, bytes, 'inspect')}
        />
      )}
    </section>
  );
}
