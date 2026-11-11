"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import {
  Upload,
  FileVideo,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  Download,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import Header from "@/src/components/site/Header";
import Footer from "@/src/components/site/Footer";
import { useDownloadJob } from "@/src/hooks/useDownloadJob";
import {
  getDownloadFileUrl,
  uploadAndConvertVideo,
} from "@/src/lib/api/downloads";
import { ApiError } from "@/src/lib/api/client";
import { toast } from "sonner";

type ConversionPhase = "idle" | "selected" | "uploading" | "processing" | "complete" | "failed";

export default function ConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [phase, setPhase] = useState<ConversionPhase>("idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const triggerFileDownload = useCallback((id: string, fileName: string) => {
    const url = getDownloadFileUrl(id);
    const link = document.createElement("a");
    link.href = url;
    const stem = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
    link.download = `${stem}_h264.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const onJobComplete = useCallback(
    (status: { status: string; title?: string | null }) => {
      setPhase("complete");
      toast.success("Video converted to H.264 MP4 successfully!");
      if (jobId) {
        triggerFileDownload(jobId, status.title || file?.name || "video.mp4");
      }
    },
    [jobId, file, triggerFileDownload]
  );

  const onJobFailed = useCallback((error: string) => {
    setPhase("failed");
    setErrorMessage(error);
    toast.error(`Conversion failed: ${error}`);
  }, []);

  const { status: jobStatus } = useDownloadJob(
    phase === "processing" ? jobId : null,
    {
      onComplete: onJobComplete,
      onFailed: (s) => onJobFailed(s.error || "Conversion failed"),
    }
  );

  const handleFileDrop = useCallback((droppedFile: File) => {
    if (!droppedFile.type.startsWith("video/") && !/\.(mp4|mov|mkv|avi|webm|flv|wmv|ts|m4v|3gp)$/i.test(droppedFile.name)) {
      toast.error("Please select a valid video file.");
      return;
    }
    setFile(droppedFile);
    setPhase("selected");
    setErrorMessage(null);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileDrop(e.dataTransfer.files[0]);
    }
  };

  const startConversion = async () => {
    if (!file) return;
    setPhase("uploading");
    setErrorMessage(null);

    try {
      const res = await uploadAndConvertVideo(file);
      setJobId(res.job_id);
      setPhase("processing");
    } catch (err) {
      setPhase("failed");
      const msg = err instanceof ApiError ? err.message : "Failed to upload video for conversion";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isConverting = phase === "uploading" || phase === "processing";

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">

      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md glow-primary">
              <Sparkles className="h-3.5 w-3.5" /> Direct Video Converter
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Convert Any Video to <span className="gradient-text">H.264 MP4</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              Upload your AV1, HEVC (H.265), VP9, MOV, or MKV videos and convert them into universal H.264 MP4 format ready for Adobe Premiere Pro & DaVinci Resolve.
            </p>
          </div>

          {/* Upload Dropzone Container */}
          <div className="glass rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-white/10">
            {phase === "idle" || phase === "selected" ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer ${
                  isDragOver
                    ? "border-primary bg-primary/15 scale-[1.01] shadow-lg shadow-primary/20"
                    : file
                    ? "border-primary/60 bg-primary/5"
                    : "border-border/80 bg-white/5 hover:border-primary/50 hover:bg-white/10"
                }`}
              >
                <input
                  type="file"
                  accept="video/*,.mp4,.mov,.mkv,.avi,.webm,.flv,.wmv,.ts,.m4v,.3gp"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileDrop(e.target.files[0]);
                    }
                  }}
                  className="absolute inset-0 z-10 opacity-0 cursor-pointer"
                />

                {!file ? (
                  <div className="space-y-4">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/20 text-primary glow-primary">
                      <Upload className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-foreground">
                        Drag and drop your video file here, or{" "}
                        <span className="text-primary underline underline-offset-4">browse</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports AV1, HEVC, VP9, MOV, MKV, AVI, WEBM, MP4 (Up to 2GB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/20 text-primary glow-primary">
                      <FileVideo className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground truncate max-w-xs sm:max-w-md mx-auto">
                        {file.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Size: {formatSize(file.size)} • Type: {file.type || "Video Stream"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setPhase("idle");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Choose different file
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {/* Action CTA Button & Progress Bar */}
            {file && (
              <div className="space-y-4">
                <button
                  type="button"
                  disabled={isConverting}
                  onClick={
                    phase === "complete"
                      ? () => triggerFileDownload(jobId || "", file.name)
                      : startConversion
                  }
                  className={`group relative w-full overflow-hidden rounded-xl px-6 py-4 font-semibold text-white shadow-xl transition-all ${
                    phase === "complete"
                      ? "bg-emerald-600 hover:bg-emerald-500 glow-emerald"
                      : phase === "failed"
                      ? "bg-rose-600 hover:bg-rose-500"
                      : isConverting
                      ? "bg-primary/80 cursor-wait"
                      : "gradient-primary glow-primary hover:opacity-95 hover:scale-[1.005]"
                  } disabled:opacity-90`}
                >
                  {/* Inline Animated Progress Bar */}
                  {isConverting && (
                    <div
                      className="absolute inset-y-0 left-0 bg-white/20 transition-all duration-300 ease-out"
                      style={{
                        width: `${
                          phase === "uploading"
                            ? 25
                            : Math.max(jobStatus?.progress || 10, 30)
                        }%`,
                      }}
                    />
                  )}

                  <div className="relative z-10 flex items-center justify-center gap-2 text-base">
                    {phase === "uploading" ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> Uploading Video File...
                      </>
                    ) : phase === "processing" ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> Transcoding to H.264 MP4 ({jobStatus?.progress || 0}%)
                      </>
                    ) : phase === "complete" ? (
                      <>
                        <Download className="h-5 w-5" /> Download Converted H.264 MP4
                      </>
                    ) : phase === "failed" ? (
                      <>
                        <XCircle className="h-5 w-5" /> Retry H.264 Conversion
                      </>
                    ) : (
                      <>
                        Convert {file.name.substring(0, 20)}... to H.264 MP4 <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>

                {phase === "complete" && (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium backdrop-blur-md">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> Transcoded & Verified with ffprobe as 100% H.264 (AVC) MP4
                    </span>
                    <button
                      onClick={() => {
                        setFile(null);
                        setPhase("idle");
                        setJobId(null);
                      }}
                      className="underline font-semibold hover:text-emerald-300 ml-2 shrink-0"
                    >
                      Convert Another File
                    </button>
                  </div>
                )}

                {phase === "failed" && errorMessage && (
                  <div className="flex items-center gap-2 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-medium">
                    <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>Conversion Error: {errorMessage}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
