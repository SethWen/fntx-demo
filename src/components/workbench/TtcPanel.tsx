import { useState } from 'react';
import {
  ArrowUpRight,
  Download,
  Layers,
  Loader2,
  Package,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import type { ContainerFormat, TtcInfoOutput } from '@/vendor/fntx-wasm/index';
import { translations, type Lang } from '../../i18n/translations';
import { fntxClient } from '../../lib/fntx-client';
import { downloadBytes, formatBytes, stripExtension } from '../../lib/format-utils';

interface TtcPanelProps {
  lang: Lang;
  activeFileName: string;
  activeFileData: Uint8Array | null;
  sfntData: Uint8Array | null;
  format: ContainerFormat | null;
  ttcInfo: TtcInfoOutput | null;
  onError: (message: string) => void;
  onUseFont: (name: string, data: Uint8Array) => void;
}

export function TtcPanel({
  lang,
  activeFileName,
  activeFileData,
  sfntData,
  format,
  ttcInfo: initialTtcInfo,
  onError,
  onUseFont,
}: TtcPanelProps) {
  const t = translations[lang].workbench.ttc;
  const isTtc = format === 'ttc';
  const [modeOverride, setModeOverride] = useState<{
    source: Uint8Array | null;
    mode: 'unpack' | 'pack';
  } | null>(null);
  const [busy, setBusy] = useState(false);

  const [ttcInfoState, setTtcInfoState] = useState<{
    source: Uint8Array;
    info: TtcInfoOutput;
  } | null>(null);
  const [unpackedState, setUnpackedState] = useState<{
    source: Uint8Array;
    faces: Uint8Array[];
  } | null>(null);
  const [packFiles, setPackFiles] = useState<Array<{ id: number; name: string; data: Uint8Array }>>(
    [],
  );
  const [packedTtc, setPackedTtc] = useState<Uint8Array | null>(null);

  const mode: 'unpack' | 'pack' =
    modeOverride && modeOverride.source === activeFileData
      ? modeOverride.mode
      : format && format !== 'ttc'
        ? 'pack'
        : 'unpack';

  const setMode = (next: 'unpack' | 'pack') => {
    setModeOverride({ source: activeFileData, mode: next });
  };

  const ttcInfo =
    ttcInfoState && ttcInfoState.source === activeFileData ? ttcInfoState.info : initialTtcInfo;
  const unpackedFaces =
    unpackedState && unpackedState.source === activeFileData ? unpackedState.faces : null;

  const handleInspectTtc = async () => {
    if (!activeFileData) return;
    setBusy(true);
    onError('');
    try {
      const info = await fntxClient.inspectTtc(activeFileData);
      setTtcInfoState({ source: activeFileData, info });
      setUnpackedState(null);
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const handleUnpackAll = async () => {
    if (!activeFileData) return;
    setBusy(true);
    onError('');
    try {
      const faces = await fntxClient.unpackTtc(activeFileData);
      setUnpackedState({ source: activeFileData, faces });
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const handleUnpackOne = async (index: number, isTruetype: boolean) => {
    if (!activeFileData) return;
    setBusy(true);
    onError('');
    try {
      const face = await fntxClient.unpackTtcAt(activeFileData, index);
      const ext = isTruetype ? 'ttf' : 'otf';
      downloadBytes(face, `${stripExtension(activeFileName)}-${index}.${ext}`);
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const handleUseOne = async (index: number, isTruetype: boolean) => {
    if (!activeFileData) return;
    setBusy(true);
    onError('');
    try {
      const face = await fntxClient.unpackTtcAt(activeFileData, index);
      const ext = isTruetype ? 'ttf' : 'otf';
      onUseFont(`${stripExtension(activeFileName)}-${index}.${ext}`, face);
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const handleAddPackFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onError('');
    const loaded: Array<{ id: number; name: string; data: Uint8Array }> = [];
    try {
      for (const file of Array.from(files)) {
        const raw = new Uint8Array(await file.arrayBuffer());
        const sfnt = await fntxClient.toSfnt(raw);
        loaded.push({
          id: Date.now() + Math.random(),
          name: file.name,
          data: sfnt,
        });
      }
      setPackFiles((prev) => [...prev, ...loaded]);
      setPackedTtc(null);
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleAddCurrentFont = () => {
    if (!sfntData) return;
    setPackFiles((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        name: activeFileName,
        data: sfntData,
      },
    ]);
    setPackedTtc(null);
  };

  const handlePack = async () => {
    if (packFiles.length < 2) return;
    setBusy(true);
    onError('');
    try {
      const ttc = await fntxClient.packTtc(packFiles.map((f) => f.data));
      setPackedTtc(ttc);
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode('unpack')}
          className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition ${
            mode === 'unpack'
              ? 'border-violet-600 bg-violet-600 text-white'
              : 'border-slate-200/80 bg-white/70 text-slate-700 hover:border-violet-400 dark:border-violet-400/20 dark:bg-[#1a1733]/60 dark:text-slate-200'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>{t.unpackMode}</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('pack')}
          className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition ${
            mode === 'pack'
              ? 'border-violet-600 bg-violet-600 text-white'
              : 'border-slate-200/80 bg-white/70 text-slate-700 hover:border-violet-400 dark:border-violet-400/20 dark:bg-[#1a1733]/60 dark:text-slate-200'
          }`}
        >
          <Package className="h-3.5 w-3.5" />
          <span>{t.packMode}</span>
        </button>
      </div>

      {mode === 'unpack' ? (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.unpackDesc}</p>

          {!activeFileData ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              {t.unpackDesc}
            </div>
          ) : !isTtc ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              {t.unpackNotTtc}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleInspectTtc}
                  className="qv-btn-primary inline-flex items-center gap-2 rounded-xl border border-violet-400/35 px-4 py-2 text-xs font-medium text-white transition disabled:opacity-60"
                >
                  {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{t.inspectBtn}</span>
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleUnpackAll}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span>{t.unpackAllBtn}</span>
                </button>
              </div>

              {ttcInfo && (
                <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-5">
                    <div>
                      <div className="text-slate-500">{t.version}</div>
                      <div className="font-semibold">
                        {ttcInfo.majorVersion}.{ttcInfo.minorVersion}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">{t.fontCount}</div>
                      <div className="font-semibold">{ttcInfo.fontCount}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">{t.totalTables}</div>
                      <div className="font-semibold">{ttcInfo.totalTables}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">{t.uniqueTables}</div>
                      <div className="font-semibold">{ttcInfo.uniqueTables}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">{t.sharedTables}</div>
                      <div className="font-semibold">{ttcInfo.sharedTables}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {ttcInfo.fonts.map((face, idx) => (
                      <div
                        key={idx}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                      >
                        <div>
                          <span className="mr-2 font-mono text-slate-400">#{idx}</span>
                          <span className="font-semibold">
                            {face.familyName || face.postscriptName || `Face ${idx}`}
                          </span>
                          <span className="ml-2 text-slate-500">
                            ({face.glyphCount} glyphs, {face.isTruetype ? 'TTF' : 'OTF'})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleUseOne(idx, face.isTruetype)}
                            className="inline-flex items-center gap-1 rounded-md border border-violet-300/60 bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-700 hover:bg-violet-500/20 dark:border-violet-400/25 dark:text-violet-300"
                          >
                            <ArrowUpRight className="h-3 w-3" />
                            <span>{t.useFaceBtn}</span>
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleUnpackOne(idx, face.isTruetype)}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 px-2.5 py-1 text-xs font-medium hover:border-violet-500 hover:text-violet-600 dark:border-violet-400/20 dark:hover:text-violet-300"
                          >
                            <Download className="h-3 w-3" />
                            <span>{t.unpackOneBtn}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {unpackedFaces && (
                <div className="flex flex-wrap gap-2">
                  {unpackedFaces.map((faceBytes, idx) => {
                    const ext = ttcInfo?.fonts[idx]?.isTruetype === false ? 'otf' : 'ttf';
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          downloadBytes(
                            faceBytes,
                            `${stripExtension(activeFileName)}-${idx}.${ext}`,
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/75 px-3 py-2 text-xs font-medium hover:border-violet-500 dark:border-violet-400/20 dark:bg-[#0d0b1a]/70"
                      >
                        <Download className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                        <span>
                          #{idx}.{ext} ({formatBytes(faceBytes.byteLength)})
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.packDesc}</p>

          <div className="flex flex-wrap gap-2.5">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-violet-950/20 bg-white/50 px-4 py-2.5 text-xs font-medium text-slate-700 hover:border-violet-400 dark:border-violet-400/25 dark:bg-[#1a1733]/50 dark:text-slate-200">
              <Upload className="h-4 w-4 text-violet-600 dark:text-violet-300" />
              <span>{t.packAddFiles}</span>
              <input
                type="file"
                multiple
                accept=".ttf,.otf,.woff,.woff2,.eot"
                className="hidden"
                onChange={(e) => {
                  void handleAddPackFiles(e.target.files);
                  e.target.value = '';
                }}
              />
            </label>

            {sfntData && (
              <button
                type="button"
                onClick={handleAddCurrentFont}
                className="inline-flex items-center gap-1.5 rounded-xl border border-violet-400/35 bg-violet-500/10 px-3.5 py-2.5 text-xs font-medium text-violet-700 hover:bg-violet-500/20 dark:text-violet-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>
                  {t.packAddCurrent} ({activeFileName})
                </span>
              </button>
            )}
          </div>

          {packFiles.length > 0 && (
            <div className="space-y-2">
              {packFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                >
                  <span className="truncate font-medium">
                    {file.name}{' '}
                    <span className="text-slate-400">({formatBytes(file.data.byteLength)})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPackFiles((prev) => prev.filter((item) => item.id !== file.id))
                    }
                    className="p-1 text-rose-500 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={busy || packFiles.length < 2}
              onClick={handlePack}
              className="qv-btn-primary inline-flex items-center gap-2 rounded-xl border border-violet-400/35 px-5 py-2.5 text-xs font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Package className="h-4 w-4" />
              )}
              <span>{t.packBtn}</span>
            </button>

            {packedTtc && (
              <button
                type="button"
                onClick={() => downloadBytes(packedTtc, 'packed.ttc')}
                className="inline-flex items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/12 px-4 py-2 text-xs font-medium text-violet-700 dark:bg-violet-400/15 dark:text-violet-300"
              >
                <Download className="h-3.5 w-3.5" />
                <span>
                  {t.download} packed.ttc ({formatBytes(packedTtc.byteLength)})
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
