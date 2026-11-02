"use client";

import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";

interface DownloadsHeaderProps {
  activeCount: number;
  loading: boolean;
  onRefresh: () => void;
}

export function DownloadsHeader({
  activeCount,
  loading,
  onRefresh,
}: DownloadsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Active Downloads
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {activeCount > 0
            ? `${activeCount} ${activeCount === 1 ? "download" : "downloads"} in progress`
            : "Track in-progress downloads and save completed files."}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/5 px-3.5 py-2.5 text-sm font-medium hover:bg-white/10 disabled:opacity-50 transition"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
        <Link
          href="/analyzer"
          className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-white glow-primary hover:opacity-95 transition"
        >
          New <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
