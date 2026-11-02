"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Clipboard,
  Eye,
  Calendar,
  Clock,
  ArrowRight,
  Loader2,
  Download,
  CheckCircle2,
  Music,
  Video as VideoIcon,
  XCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  analyzeUrl,
  createDownload,
  getDownloadFileUrl,
  getOptions,
  ApiError,
} from "@/src/lib/api";
import type {
  AnalyzeResponse,
  DownloadMode,
  SupportedOptionsResponse,
  VideoFormat,
} from "@/src/lib/api";
import {
  formatBytes,
  formatDate,
  formatDuration,
  formatEta,
  formatSpeed,
  formatViews,
} from "@/src/lib/formatters";
import { useDownloadJob } from "@/src/hooks/useDownloadJob";

const PLACEHOLDER_THUMB =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' fill='%23333'%3E%3Crect width='640' height='360'/%3E%3C/svg%3E";

const AUDIO_FORMATS = new Set(["MP3", "AAC"]);

function AnalyzerContent() {
  const searchParams = useSearchParams();
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<
    "idle" | "analyzing" | "ready" | "downloading" | "complete" | "failed"
  >("idle");
  const [quality, setQuality] = useState("1080p");
  const [format, setFormat] = useState<VideoFormat>("MP4");
  const [mode, setMode] = useState<DownloadMode>("compatible");
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [video, setVideo] = useState<AnalyzeResponse | null>(null);
  const [options, setOptions] = useState<SupportedOptionsResponse | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const triggerFileDownload = useCallback((id: string) => {
    const fileUrl = getDownloadFileUrl(id);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const {
    status: jobStatus,
    cancel,
    isActive,
  } = useDownloadJob(jobId, {
    enabled:
      phase === "downloading" || phase === "complete" || phase === "failed",
    onComplete: (statusResp) => {
      setPhase("complete");
      if (statusResp?.job_id) {
        triggerFileDownload(statusResp.job_id);
        toast.success("Download complete! File saved.");
      }
    },
    onFailed: () => setPhase("failed"),
  });

  useEffect(() => {
    const paramUrl = searchParams.get("url");
    if (paramUrl) setUrl(paramUrl);
  }, [searchParams]);

  useEffect(() => {
    getOptions()
      .then(setOptions)
      .catch((err) => {
        toast.error(
          err instanceof ApiError
            ? err.message
            : "Failed to load download options",
        );
      });
  }, []);

  const qualities = useMemo(() => {
    if (!options) return [];
    return AUDIO_FORMATS.has(format)
      ? options.audio_qualities
      : options.video_qualities;
  }, [options, format]);

  const formats = useMemo(() => {
    if (!options) return ["MP4", "WEBM", "MP3", "AAC"] as VideoFormat[];
    return [
      ...options.video_formats,
      ...options.audio_formats,
    ] as VideoFormat[];
  }, [options]);

  useEffect(() => {
    if (qualities.length && !qualities.includes(quality)) {
      setQuality(qualities[0]);
    }
  }, [qualities, quality]);

  const analyze = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setPhase("analyzing");
    setAnalyzeError(null);
    setVideo(null);
    setJobId(null);

    try {
      const result = await analyzeUrl(trimmed);
      setVideo(result);
      setPhase("ready");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to analyze URL";
      setAnalyzeError(message);
      setPhase("idle");
      toast.error(message);
    }
  }, [url]);

  const startDownload = useCallback(async () => {
    if (!video) return;

    setIsStarting(true);
    try {
      const result = await createDownload({
        url: url.trim() || video?.url || "",
        format,
        quality,
        mode,
      });
      setJobId(result.job_id);
      setPhase("downloading");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to start download",
      );
    } finally {
      setIsStarting(false);
    }
  }, [video, format, quality, mode]);

  const handleCancel = useCallback(async () => {
    try {
      await cancel();
      setPhase("failed");
      toast.info("Download cancelled");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to cancel download",
      );
    }
  }, [cancel]);

  const progress = jobStatus?.progress ?? 0;
  const displayTitle = jobStatus?.title ?? video?.title ?? "Video";
  const thumbnail = video?.thumbnail ?? PLACEHOLDER_THUMB;
  const channelAvatar = video?.channel_avatar ?? PLACEHOLDER_THUMB;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          URL Analyzer
        </h1>
        <p className="mt-2 text-muted-foreground">
          Paste any supported video link to inspect its metadata and pick a
          download.
        </p>
      </div>

      <div className="mt-8 gradient-border rounded-2xl p-1.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void analyze();
          }}
          className="flex flex-col sm:flex-row gap-1.5"
        >
          <div className="flex-1 flex items-center gap-2 px-3">
            <Clipboard className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-transparent py-3 text-sm focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={phase === "analyzing" || !url.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-3 text-sm font-semibold text-white glow-primary disabled:opacity-60"
          >
            {phase === "analyzing" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing
              </>
            ) : (
              <>
                Analyze <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
        {analyzeError && (
          <p className="mt-2 px-3 text-sm text-destructive">{analyzeError}</p>
        )}
      </div>

      {phase === "analyzing" && (
        <div className="mt-8 glass rounded-2xl p-6 animate-fade-up">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Fetching metadata from source…
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-44 rounded-xl bg-white/5 shimmer-bg" />
            <div className="h-4 w-2/3 rounded bg-white/5 shimmer-bg" />
            <div className="h-3 w-1/3 rounded bg-white/5 shimmer-bg" />
          </div>
        </div>
      )}

      {video &&
        (phase === "ready" ||
          phase === "downloading" ||
          phase === "complete" ||
          phase === "failed") && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] animate-fade-up">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <span className="absolute bottom-3 right-3 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-white">
                  {formatDuration(video.duration_seconds)}
                </span>
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold leading-snug">
                  {displayTitle}
                </h2>
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={channelAvatar}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {video.channel ?? "Unknown channel"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {video.platform_name}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg bg-white/5 px-3 py-2">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Eye className="h-3 w-3" /> Views
                    </div>
                    <div className="mt-0.5 font-mono">
                      {formatViews(video.view_count)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/5 px-3 py-2">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3 w-3" /> Duration
                    </div>
                    <div className="mt-0.5 font-mono">
                      {formatDuration(video.duration_seconds)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/5 px-3 py-2">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3 w-3" /> Posted
                    </div>
                    <div className="mt-0.5 font-mono">
                      {video.upload_date ? formatDate(video.upload_date) : "—"}
                    </div>
                  </div>
                </div>
                {video.description && (
                  <p className="mt-4 text-sm text-muted-foreground line-clamp-4">
                    {video.description}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-semibold">Quality</h3>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {qualities.map((q) => (
                    <button
                      key={q}
                      type="button"
                      disabled={phase === "downloading" || isStarting}
                      onClick={() => {
                        setQuality(q);
                        if (phase === "complete" || phase === "failed") {
                          setPhase("ready");
                        }
                      }}
                      className={`rounded-lg border px-2 py-2 text-xs font-mono transition ${
                        quality === q
                          ? "border-primary bg-primary/15 text-foreground glow-primary"
                          : "border-border bg-white/5 text-muted-foreground hover:bg-white/10"
                      } disabled:opacity-50`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-semibold">Format</h3>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {formats.map((f) => {
                    const Icon = f === "MP3" || f === "AAC" ? Music : VideoIcon;
                    return (
                      <button
                        key={f}
                        type="button"
                        disabled={phase === "downloading" || isStarting}
                        onClick={() => {
                          setFormat(f as VideoFormat);
                          if (phase === "complete" || phase === "failed") {
                            setPhase("ready");
                          }
                        }}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                          format === f
                            ? "border-primary bg-primary/15 text-foreground glow-primary"
                            : "border-border bg-white/5 text-muted-foreground hover:bg-white/10"
                        } disabled:opacity-50`}
                      >
                        <Icon className="h-4 w-4" /> {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              {!AUDIO_FORMATS.has(format) && (
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">
                      Video Codec & Compatibility
                    </h3>
                    <span className="text-xs text-primary font-medium flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> H.264 Universal Mode
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={phase === "downloading" || isStarting}
                      onClick={() => {
                        setMode("compatible");
                        if (phase === "complete" || phase === "failed") {
                          setPhase("ready");
                        }
                      }}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition cursor-pointer ${
                        mode === "compatible"
                          ? "border-primary bg-primary/15 text-foreground glow-primary"
                          : "border-border bg-white/5 text-muted-foreground hover:bg-white/10"
                      } disabled:opacity-50`}
                    >
                      <span className="text-xs font-semibold text-foreground">
                        H.264 MP4 (Editor Ready)
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                        Converts AV1/HEVC/VP9 to H.264 for Premiere & DaVinci
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={phase === "downloading" || isStarting}
                      onClick={() => {
                        setMode("original");
                        if (phase === "complete" || phase === "failed") {
                          setPhase("ready");
                        }
                      }}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition cursor-pointer ${
                        mode === "original"
                          ? "border-primary bg-primary/15 text-foreground glow-primary"
                          : "border-border bg-white/5 text-muted-foreground hover:bg-white/10"
                      } disabled:opacity-50`}
                    >
                      <span className="text-xs font-semibold text-foreground">
                        Original Stream (Fastest)
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                        Direct raw download (AV1 / VP9 / HEVC)
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {phase === "downloading" ? (
                <div className="relative overflow-hidden rounded-xl border border-primary/40 bg-white/5 p-3 backdrop-blur-md">
                  {/* Animated Progress Bar Fill */}
                  <div
                    className="absolute inset-y-0 left-0 bg-primary/25 transition-all duration-300 pointer-events-none"
                    style={{
                      width: `${Math.min(100, Math.max(5, progress))}%`,
                    }}
                  />
                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                      <div className="min-w-0 text-xs">
                        <span className="font-semibold text-foreground">
                          Downloading… {Math.min(100, Math.round(progress))}%
                        </span>
                        <span className="text-muted-foreground ml-2 hidden sm:inline">
                          {formatSpeed(jobStatus?.speed_bytes_per_sec)} ·{" "}
                          {formatEta(jobStatus?.eta_seconds)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleCancel()}
                      className="rounded-lg bg-white/10 hover:bg-white/20 text-muted-foreground hover:text-foreground px-3 py-1.5 text-xs font-semibold transition cursor-pointer shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : phase === "complete" && jobId ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (jobId) triggerFileDownload(jobId);
                    }}
                    className="flex-1 rounded-xl gradient-primary py-3 px-4 text-sm font-semibold text-white glow-primary flex items-center justify-center gap-2 shadow-xl hover:opacity-95 transition cursor-pointer"
                  >
                    <Download className="h-4 w-4" /> Save File Again ({format} ·{" "}
                    {quality})
                  </button>
                  <button
                    type="button"
                    onClick={() => void startDownload()}
                    disabled={isStarting}
                    title="Download again with current format/quality"
                    className="rounded-xl border border-border bg-white/5 px-4 py-3 text-xs font-medium text-foreground hover:bg-white/10 transition cursor-pointer shrink-0"
                  >
                    Re-download
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => void startDownload()}
                  disabled={isStarting}
                  className={`w-full rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60 ${
                    phase === "failed"
                      ? "border border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/15"
                      : "gradient-primary text-white glow-primary shadow-xl hover:opacity-95"
                  }`}
                >
                  {isStarting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Starting…
                    </>
                  ) : phase === "failed" ? (
                    <>
                      <XCircle className="h-4 w-4 text-destructive" /> Failed —
                      Retry Download ({format} · {quality})
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" /> Download {format} ·{" "}
                      {quality}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
    </div>
  );
}

export default function AnalyzerPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-12 text-muted-foreground">
          Loading…
        </div>
      }
    >
      <AnalyzerContent />
    </Suspense>
  );
}
