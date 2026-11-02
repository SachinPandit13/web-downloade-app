"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Clipboard,
  Loader2,
  Download,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Calendar,
  Music,
  Video as VideoIcon,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { PlatformIcon } from "@/src/components/site/PlatformIcon";
import { PLATFORMS } from "@/src/lib/mockData";
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

export default function HeroSection() {
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
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8 sm:pt-20">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
            7 platforms supported · 4K downloads
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]"
          >
            Download videos from <br className="hidden sm:block" />
            <span className="gradient-text-animated">
              your favorite platforms
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Paste any video link below to inspect metadata, pick your desired
            quality, and download directly.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={(e) => {
              e.preventDefault();
              void analyze();
            }}
            className="mt-8 mx-auto max-w-2xl"
          >
            <div className="gradient-border rounded-2xl p-1.5 flex flex-col sm:flex-row gap-1.5 shadow-2xl shadow-primary/10">
              <div className="flex-1 flex items-center gap-2.5 px-3.5">
                <Clipboard className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste a YouTube, TikTok, Instagram… URL"
                  className="w-full bg-transparent py-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={phase === "analyzing" || !url.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-white glow-primary transition cursor-pointer disabled:opacity-60 shrink-0"
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
            </div>
            {analyzeError && (
              <p className="mt-2.5 px-3 text-xs text-destructive text-left font-medium">
                {analyzeError}
              </p>
            )}
          </motion.form>

          {/* <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/analyzer"
              className="inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-white"
            >
              Start Downloading
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/5 px-5 py-2.5 text-sm font-medium hover:bg-white/10 transition"
            >
              Learn More <ChevronDown className="h-4 w-4" />
            </a>
          </div> */}
        </div>

        <AnimatePresence mode="wait">
          {phase === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 mx-auto max-w-3xl glass rounded-2xl p-6"
            >
              <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                Fetching video metadata from source…
              </div>
              <div className="mt-5 space-y-3">
                <div className="h-48 rounded-xl bg-foreground/5 shimmer-bg" />
                <div className="h-4 w-2/3 rounded bg-foreground/5 shimmer-bg mx-auto" />
                <div className="h-3 w-1/3 rounded bg-foreground/5 shimmer-bg mx-auto" />
              </div>
            </motion.div>
          )}

          {video &&
            (phase === "ready" ||
              phase === "downloading" ||
              phase === "complete" ||
              phase === "failed") && (
              <motion.div
                key="result"
                layout
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.4,
                  layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                }}
                className="mt-10 mx-auto max-w-5xl text-left"
              >
                <div className="glass rounded-3xl p-6 lg:p-8 shadow-2xl border border-border/80 space-y-6">
                  {/* Top Row: Thumbnail (Left) & Controls (Right) */}
                  <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] items-start">
                    <div className="relative aspect-video max-h-[220px] sm:max-h-[260px] w-full rounded-2xl overflow-hidden bg-black/40 border border-border/60 group">
                      <img
                        src={thumbnail}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      <span className="absolute bottom-3 right-3 rounded-lg bg-black/75 backdrop-blur-md px-2 py-0.5 text-xs font-mono text-white border border-white/10">
                        {formatDuration(video.duration_seconds)}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                          Quality
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
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
                              className={`rounded-xl border py-2 text-xs font-mono font-semibold transition cursor-pointer ${
                                quality === q
                                  ? "border-primary bg-primary/15 text-foreground glow-primary"
                                  : "border-border bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                              } disabled:opacity-50`}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                          Format
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                          {formats.map((f) => {
                            const Icon =
                              f === "MP3" || f === "AAC" ? Music : VideoIcon;
                            return (
                              <button
                                key={f}
                                type="button"
                                disabled={phase === "downloading" || isStarting}
                                onClick={() => {
                                  setFormat(f as VideoFormat);
                                  if (
                                    phase === "complete" ||
                                    phase === "failed"
                                  ) {
                                    setPhase("ready");
                                  }
                                }}
                                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 px-1 text-xs font-mono font-semibold transition cursor-pointer ${
                                  format === f
                                    ? "border-primary bg-primary/15 text-foreground glow-primary"
                                    : "border-border bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                                } disabled:opacity-50`}
                              >
                                <Icon className="h-3.5 w-3.5" /> {f}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {!AUDIO_FORMATS.has(format) && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Video Codec & Compatibility
                            </h3>
                            <span className="text-[10px] text-primary font-medium flex items-center gap-1">
                              <Sparkles className="h-3 w-3" /> H.264 Universal Mode
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              disabled={phase === "downloading" || isStarting}
                              onClick={() => {
                                setMode("compatible");
                                if (
                                  phase === "complete" ||
                                  phase === "failed"
                                ) {
                                  setPhase("ready");
                                }
                              }}
                              className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition cursor-pointer ${
                                mode === "compatible"
                                  ? "border-primary bg-primary/15 text-foreground glow-primary"
                                  : "border-border bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                              } disabled:opacity-50`}
                            >
                              <span className="text-xs font-semibold flex items-center gap-1 text-foreground">
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
                                if (
                                  phase === "complete" ||
                                  phase === "failed"
                                ) {
                                  setPhase("ready");
                                }
                              }}
                              className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition cursor-pointer ${
                                mode === "original"
                                  ? "border-primary bg-primary/15 text-foreground glow-primary"
                                  : "border-border bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
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

                      <div className="pt-2">
                        <AnimatePresence mode="wait" initial={false}>
                          {phase === "downloading" ? (
                            <motion.div
                              key="downloading-cta"
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.2 }}
                              className="relative overflow-hidden rounded-2xl border border-primary/40 bg-foreground/5 p-3 backdrop-blur-md"
                            >
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
                                      {formatSpeed(
                                        jobStatus?.speed_bytes_per_sec,
                                      )}{" "}
                                      · {formatEta(jobStatus?.eta_seconds)}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => void handleCancel()}
                                  className="rounded-xl bg-white/10 hover:bg-white/20 text-muted-foreground hover:text-foreground px-3 py-1.5 text-xs font-semibold transition cursor-pointer shrink-0"
                                >
                                  Cancel
                                </button>
                              </div>
                            </motion.div>
                          ) : phase === "complete" && jobId ? (
                            <motion.div
                              key="complete-cta"
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.2 }}
                              className="flex gap-2"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  if (jobId) triggerFileDownload(jobId);
                                }}
                                className="flex-1 rounded-2xl gradient-primary py-3 px-4 text-sm font-semibold text-white glow-primary flex items-center justify-center gap-2 shadow-xl hover:opacity-95 transition cursor-pointer"
                              >
                                <Download className="h-4.5 w-4.5" /> Save File Again ({format} · {quality})
                              </button>
                              <button
                                type="button"
                                onClick={() => void startDownload()}
                                disabled={isStarting}
                                title="Download again with current format/quality"
                                className="rounded-2xl border border-border/80 bg-white/5 px-4 py-3 text-xs font-medium text-foreground hover:bg-white/10 transition cursor-pointer shrink-0"
                              >
                                Re-download
                              </button>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="ready-cta"
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.2 }}
                            >
                              <button
                                type="button"
                                onClick={() => void startDownload()}
                                disabled={isStarting}
                                className={`w-full rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60 ${
                                  phase === "failed"
                                    ? "border border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/15"
                                    : "gradient-primary text-white glow-primary shadow-xl hover:opacity-95"
                                }`}
                              >
                                {isStarting ? (
                                  <>
                                    <Loader2 className="h-4.5 w-4.5 animate-spin" />{" "}
                                    Starting…
                                  </>
                                ) : phase === "failed" ? (
                                  <>
                                    <XCircle className="h-4.5 w-4.5 text-destructive" />{" "}
                                    Failed — Retry Download ({format} · {quality})
                                  </>
                                ) : (
                                  <>
                                    <Download className="h-4.5 w-4.5" /> Download{" "}
                                    {format} · {quality}
                                  </>
                                )}
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Video Title */}
                  <div className="pt-4 border-t border-border/60">
                    <h2 className="text-lg sm:text-xl font-bold leading-snug tracking-tight">
                      {displayTitle}
                    </h2>
                    <div className="mt-2 flex items-center gap-3">
                      {/* <img
                        src={channelAvatar}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover border border-border"
                      /> */}
                      {/* <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {video.channel ?? "Unknown channel"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {video.platform_name}
                        </p>
                      </div> */}
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-xs">
                      {/* <div className="rounded-xl bg-foreground/5 p-2.5 border border-border/50">
                        <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                          <Eye className="h-3.5 w-3.5 text-primary" /> Views
                        </div>
                        <div className="mt-1 font-mono font-semibold">
                          {formatViews(video.view_count)}
                        </div>
                      </div>
                      <div className="rounded-xl bg-foreground/5 p-2.5 border border-border/50">
                        <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                          <Clock className="h-3.5 w-3.5 text-accent" /> Duration
                        </div>
                        <div className="mt-1 font-mono font-semibold">
                          {formatDuration(video.duration_seconds)}
                        </div>
                      </div>
                      <div className="rounded-xl bg-foreground/5 p-2.5 border border-border/50">
                        <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                          <Calendar className="h-3.5 w-3.5 text-secondary" />{" "}
                          Posted
                        </div>
                        <div className="mt-1 font-mono font-semibold">
                          {video.upload_date
                            ? formatDate(video.upload_date)
                            : "—"}
                        </div>
                      </div>*/}
                    </div>

                    {/* {video.description && (
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {video.description}
                      </p>
                    )} */}
                  </div>
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 opacity-90">
          {PLATFORMS.map((p) => (
            <div
              key={p.id}
              className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted-foreground"
            >
              <PlatformIcon id={p.id} className="h-3.5 w-3.5" />
              {p.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
