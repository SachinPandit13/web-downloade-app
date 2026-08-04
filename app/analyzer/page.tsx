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
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [video, setVideo] = useState<AnalyzeResponse | null>(null);
  const [options, setOptions] = useState<SupportedOptionsResponse | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const {
    status: jobStatus,
    cancel,
    isActive,
  } = useDownloadJob(jobId, {
    enabled:
      phase === "downloading" || phase === "complete" || phase === "failed",
    onComplete: () => setPhase("complete"),
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
        url: video.url,
        format,
        quality,
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
  }, [video, format, quality]);

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
                      disabled={phase === "downloading" || phase === "complete"}
                      onClick={() => setQuality(q)}
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
                        disabled={
                          phase === "downloading" || phase === "complete"
                        }
                        onClick={() => setFormat(f as VideoFormat)}
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

              {phase === "ready" && (
                <button
                  type="button"
                  onClick={() => void startDownload()}
                  disabled={isStarting}
                  className="w-full rounded-xl gradient-primary py-3 text-sm font-semibold text-white glow-primary flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isStarting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Starting…
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" /> Download {format} ·{" "}
                      {quality}
                    </>
                  )}
                </button>
              )}

              {(phase === "downloading" ||
                phase === "complete" ||
                phase === "failed") && (
                <div className="glass rounded-2xl p-5 animate-scale-in">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold flex items-center gap-2">
                      {phase === "complete" ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : phase === "failed" ? (
                        <XCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      )}
                      {phase === "complete"
                        ? "Completed"
                        : phase === "failed"
                          ? "Failed"
                          : "Processing"}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {Math.min(100, Math.round(progress))}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full gradient-primary transition-all duration-300"
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                  {jobStatus?.error && phase === "failed" && (
                    <p className="mt-2 text-xs text-destructive">
                      {jobStatus.error}
                    </p>
                  )}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-muted-foreground">Speed</div>
                      <div className="mt-0.5 font-mono">
                        {phase === "complete"
                          ? "—"
                          : formatSpeed(jobStatus?.speed_bytes_per_sec)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">ETA</div>
                      <div className="mt-0.5 font-mono">
                        {phase === "complete"
                          ? "Done"
                          : formatEta(jobStatus?.eta_seconds)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Size</div>
                      <div className="mt-0.5 font-mono">
                        {formatBytes(jobStatus?.file_size_bytes)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {phase === "complete" && jobId && (
                      <a
                        href={getDownloadFileUrl(jobId)}
                        download
                        className="flex-1 text-center rounded-lg gradient-primary py-2 text-xs font-semibold text-white"
                      >
                        Save file
                      </a>
                    )}
                    {isActive && (
                      <button
                        type="button"
                        onClick={() => void handleCancel()}
                        className="flex-1 rounded-lg border border-border bg-white/5 py-2 text-xs font-medium hover:bg-white/10"
                      >
                        Cancel
                      </button>
                    )}
                    {phase === "failed" && (
                      <button
                        type="button"
                        onClick={() => {
                          setJobId(null);
                          setPhase("ready");
                        }}
                        className="flex-1 rounded-lg border border-border bg-white/5 py-2 text-xs font-medium hover:bg-white/10"
                      >
                        Try again
                      </button>
                    )}
                    {phase === "complete" && (
                      <Link
                        href="/history"
                        className="flex-1 text-center rounded-lg border border-border bg-white/5 py-2 text-xs font-medium hover:bg-white/10"
                      >
                        View history
                      </Link>
                    )}
                  </div>
                </div>
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
