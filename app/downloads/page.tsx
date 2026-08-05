"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { listDownloads, ApiError } from "@/src/lib/api";
import type { DownloadListItem } from "@/src/lib/api";
import {
  ActiveJobCard,
  DownloadsEmptyState,
  DownloadsHeader,
} from "@/src/components/downloads";

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
      <DownloadsHeader
        activeCount={jobs.length}
        loading={loading}
        onRefresh={() => void loadActive()}
      />

      {loading ? (
        <div className="mt-12 flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm">Loading active downloads…</p>
        </div>
      ) : jobs.length === 0 ? (
        <DownloadsEmptyState />
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
