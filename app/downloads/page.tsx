"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Download,
  XCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { listDownloads, getDownloadFileUrl, ApiError } from "@/src/lib/api";
import type { DownloadListItem } from "@/src/lib/api";
import { formatEta, formatSpeed } from "@/src/lib/formatters";
import { useDownloadJob } from "@/src/hooks/useDownloadJob";

const PLACEHOLDER_THUMB =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='90' fill='%23333'%3E%3Crect width='160' height='90'/%3E%3C/svg%3E";

function ActiveJobCard({
  job,
  onUpdate,
}: {
  job: DownloadListItem;
  onUpdate: () => void;
}) {
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
    <div className="glass rounded-2xl p-5">
      <div className="flex gap-4">
        <img
          src={job.thumbnail ?? PLACEHOLDER_THUMB}
          alt=""
          className="h-16 w-28 rounded-lg object-cover shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-medium truncate">
            {title ?? "Preparing download…"}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {job.format} · {job.quality}
            {job.platform ? ` · ${job.platform}` : ""}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold">
              {jobStatus === "completed" ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              ) : jobStatus === "failed" ? (
                <XCircle className="h-3.5 w-3.5 text-destructive" />
              ) : (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              )}
              {jobStatus}
            </span>
            <span className="font-mono text-muted-foreground">{progress}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full gradient-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          {isActive && (
            <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
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
        <Link
          href="/history"
          className="rounded-lg border border-border bg-white/5 px-3 py-2 text-xs font-medium hover:bg-white/10"
        >
          History
        </Link>
      </div>
    </div>
  );
}

export default function DownloadsPage() {
  const [jobs, setJobs] = useState<DownloadListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadActive = useCallback(async () => {
    try {
      const [pending, processing] = await Promise.all([
        listDownloads({ status: "pending", page_size: 50 }),
        listDownloads({ status: "processing", page_size: 50 }),
      ]);
      const merged = [...pending.items, ...processing.items].sort((a, b) => {
        const da = a.created_at ? new Date(a.created_at).getTime() : 0;
        const db = b.created_at ? new Date(b.created_at).getTime() : 0;
        return db - da;
      });
      setJobs(merged);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to load downloads",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadActive();
  }, [loadActive]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Active Downloads
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track in-progress downloads and save completed files.
          </p>
        </div>
        <Link
          href="/analyzer"
          className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-white glow-primary shrink-0"
        >
          New <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="mt-12 glass rounded-2xl p-12 text-center">
          <Download className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No active downloads.</p>
          <Link
            href="/analyzer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Start a download <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {jobs.map((job) => (
            <ActiveJobCard
              key={job.job_id}
              job={job}
              onUpdate={() => void loadActive()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
