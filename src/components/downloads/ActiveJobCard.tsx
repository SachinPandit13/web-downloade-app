"use client";

import Link from "next/link";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { getDownloadFileUrl, ApiError } from "@/src/lib/api";
import type { DownloadListItem } from "@/src/lib/api";
import { formatEta, formatSpeed } from "@/src/lib/formatters";
import { useDownloadJob } from "@/src/hooks/useDownloadJob";

const PLACEHOLDER_THUMB =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='90' fill='%23333'%3E%3Crect width='160' height='90'/%3E%3C/svg%3E";

interface ActiveJobCardProps {
  job: DownloadListItem;
  onUpdate: () => void;
}

export function ActiveJobCard({ job, onUpdate }: ActiveJobCardProps) {
  const isActive = job.status === "pending" || job.status === "processing";
  const { status, cancel } = useDownloadJob(job.job_id, {
    enabled: isActive,
    onComplete: onUpdate,
    onFailed: onUpdate,
  });

  const progress = status?.progress ?? (job.status === "completed" ? 100 : 0);
  const jobStatus = status?.status ?? job.status;
  const title = status?.title ?? job.title;
  const speed = status?.speed_bytes_per_sec ?? null;
  const eta = status?.eta_seconds ?? null;
  const error = status?.error ?? job.error;

  const handleCancel = async () => {
    try {
      await cancel();
      onUpdate();
      toast.info("Download cancelled");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to cancel download",
      );
    }
  };

  return (
    <div className="glass rounded-2xl p-5 hover:border-primary/20 transition-colors">
      <div className="flex gap-4">
        <img
          src={job.thumbnail ?? PLACEHOLDER_THUMB}
          alt=""
          className="h-16 w-28 rounded-lg object-cover shrink-0 bg-white/5"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-medium truncate text-sm sm:text-base">
            {title ?? "Preparing download…"}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {job.format} · {job.quality}
            {job.platform ? ` · ${job.platform}` : ""}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold capitalize">
              {jobStatus === "completed" ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              ) : jobStatus === "failed" ? (
                <XCircle className="h-3.5 w-3.5 text-destructive" />
              ) : (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              )}
              {jobStatus}
            </span>
            <span className="font-mono text-muted-foreground">
              {Math.min(100, Math.round(progress))}%
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full gradient-primary transition-all duration-300"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          {isActive && (
            <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-muted-foreground font-mono">
              <span>Speed: {formatSpeed(speed)}</span>
              <span>ETA: {formatEta(eta)}</span>
            </div>
          )}
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {jobStatus === "completed" && (
          <a
            href={getDownloadFileUrl(job.job_id)}
            download
            className="flex-1 text-center rounded-lg gradient-primary py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition"
          >
            Save file
          </a>
        )}
        {isActive && (
          <button
            type="button"
            onClick={() => void handleCancel()}
            className="flex-1 rounded-lg border border-border bg-white/5 py-2 text-xs font-medium hover:bg-white/10 transition"
          >
            Cancel
          </button>
        )}
        <Link
          href="/history"
          className="rounded-lg border border-border bg-white/5 px-3 py-2 text-xs font-medium hover:bg-white/10 transition"
        >
          History
        </Link>
      </div>
    </div>
  );
}
