"use client";

import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";

export function DownloadsEmptyState() {
  return (
    <div className="mt-12 glass rounded-2xl p-12 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/5 border border-border/50">
        <Download className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-semibold text-lg">No active downloads</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
        There are currently no active downloads in progress. Analyze a video
        link to get started.
      </p>
      <Link
        href="/analyzer"
        className="mt-6 inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-white glow-primary hover:opacity-95 transition"
      >
        Start a download <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
