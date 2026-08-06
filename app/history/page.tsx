"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Pause,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import {
  listDownloads,
  getDownloadFileUrl,
  ApiError,
  type DownloadStatus,
} from "@/src/lib/api";
import type { DownloadListItem } from "@/src/lib/api";
import {
  capitalizeStatus,
  formatBytes,
  formatDate,
  type DisplayStatus,
} from "@/src/lib/formatters";

const PAGE_SIZE = 10;

const statusStyles: Record<
  DisplayStatus,
  { bg: string; color: string; Icon: typeof CheckCircle2 }
> = {
  Completed: { bg: "bg-success/15", color: "text-success", Icon: CheckCircle2 },
  Processing: { bg: "bg-primary/15", color: "text-primary", Icon: Loader2 },
  Pending: { bg: "bg-white/5", color: "text-muted-foreground", Icon: Pause },
  Failed: {
    bg: "bg-destructive/15",
    color: "text-destructive",
    Icon: AlertCircle,
  },
};

const PLACEHOLDER_THUMB =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='90' fill='%23333'%3E%3Crect width='160' height='90'/%3E%3C/svg%3E";

const API_STATUS_MAP: Record<DisplayStatus, DownloadStatus | undefined> = {
  Pending: "pending",
  Processing: "processing",
  Completed: "completed",
  Failed: "failed",
};

export default function HistoryPage() {
  const [q, setQ] = useState("");
  const [platform, setPlatform] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<DownloadListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const apiStatus =
        status !== "all" ? API_STATUS_MAP[status as DisplayStatus] : undefined;
      const response = await listDownloads({
        page,
        page_size: PAGE_SIZE,
        status: apiStatus,
      });
      setItems(response.items);
      setTotal(response.total);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to load history",
      );
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const filtered = useMemo(() => {
    let arr = items.filter(
      (d) =>
        (d.title ?? "").toLowerCase().includes(q.toLowerCase()) ||
        (d.channel ?? "").toLowerCase().includes(q.toLowerCase()),
    );
    if (platform !== "all") {
      arr = arr.filter((d) => d.platform === platform);
    }
    arr = [...arr].sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return sortDesc ? db - da : da - db;
    });
    return arr;
  }, [items, q, platform, sortDesc]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const platforms = Array.from(
    new Set(items.map((d) => d.platform).filter(Boolean)),
  ) as string[];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Download History
          </h1>
          <p className="mt-2 text-muted-foreground">
            {filtered.length} shown · {total} total downloads
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadHistory()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mt-8 glass rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 rounded-lg bg-white/5 border border-border px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search downloads…"
            className="w-full bg-transparent py-2.5 text-sm focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="rounded-lg bg-white/5 border border-border px-3 py-2 text-sm focus:outline-none"
          >
            <option value="all">All platforms</option>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg bg-white/5 border border-border px-3 py-2 text-sm focus:outline-none"
          >
            <option value="all">All statuses</option>
            {(["Completed", "Processing", "Pending", "Failed"] as const).map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ),
            )}
          </select>
          <button
            type="button"
            onClick={() => setSortDesc((s) => !s)}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            <ArrowUpDown className="h-3.5 w-3.5" /> Date {sortDesc ? "↓" : "↑"}
          </button>
        </div>
      </div>

      <div className="mt-6 glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Video</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">
                  Platform
                </th>
                <th className="text-left px-4 py-3 font-semibold">Format</th>
                <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">
                  Quality
                </th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-16 text-center text-sm text-muted-foreground"
                  >
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((d) => {
                  const displayStatus = capitalizeStatus(d.status);
                  const s = statusStyles[displayStatus];
                  const Icon = s.Icon;
                  return (
                    <tr
                      key={d.job_id}
                      className="border-t border-border hover:bg-white/[0.03] transition"
                      title={d.error ?? undefined}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={d.thumbnail ?? PLACEHOLDER_THUMB}
                            alt=""
                            className="h-10 w-16 rounded object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {d.title ?? "Untitled"}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {d.channel ?? "—"} ·{" "}
                              {formatBytes(d.file_size_bytes)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                        {d.platform ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {d.format}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs hidden sm:table-cell">
                        {d.quality}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                        {formatDate(d.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.bg} ${s.color}`}
                        >
                          <Icon
                            className={`h-3 w-3 ${displayStatus === "Processing" ? "animate-spin" : ""}`}
                          />{" "}
                          {displayStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {d.status === "completed" && (
                          <a
                            href={getDownloadFileUrl(d.job_id)}
                            download
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                          >
                            <Download className="h-3.5 w-3.5" /> Save
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-16 text-center text-sm text-muted-foreground"
                  >
                    No downloads match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => p - 1)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-white/5 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-white/5 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
