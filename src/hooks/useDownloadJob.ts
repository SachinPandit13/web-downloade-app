"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  cancelDownload,
  getDownloadStatus,
  type DownloadStatusResponse,
} from "@/src/lib/api";

const POLL_INTERVAL_MS = 1500;
const TERMINAL_STATUSES = new Set(["completed", "failed"]);

type UseDownloadJobOptions = {
  enabled?: boolean;
  onComplete?: (status: DownloadStatusResponse) => void;
  onFailed?: (status: DownloadStatusResponse) => void;
};

export function useDownloadJob(
  jobId: string | null,
  options: UseDownloadJobOptions = {},
) {
  const { enabled = true, onComplete, onFailed } = options;
  const [status, setStatus] = useState<DownloadStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const callbacksRef = useRef({ onComplete, onFailed });
  callbacksRef.current = { onComplete, onFailed };

  const refresh = useCallback(async () => {
    if (!jobId) return null;
    try {
      const next = await getDownloadStatus(jobId);
      setStatus(next);
      setError(null);
      return next;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch job status";
      setError(message);
      return null;
    }
  }, [jobId]);

  useEffect(() => {
    if (!jobId || !enabled) {
      setStatus(null);
      setError(null);
      setIsPolling(false);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    const poll = async () => {
      const next = await refresh();
      if (cancelled || !next) return;

      if (next.status === "completed") {
        setIsPolling(false);
        if (timer) clearInterval(timer);
        callbacksRef.current.onComplete?.(next);
      } else if (next.status === "failed") {
        setIsPolling(false);
        if (timer) clearInterval(timer);
        callbacksRef.current.onFailed?.(next);
      }
    };

    setIsPolling(true);
    void poll();
    timer = setInterval(() => void poll(), POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      setIsPolling(false);
    };
  }, [jobId, enabled, refresh]);

  const cancel = useCallback(async () => {
    if (!jobId) return;
    await cancelDownload(jobId);
    await refresh();
  }, [jobId, refresh]);

  const isActive =
    status != null && !TERMINAL_STATUSES.has(status.status) && enabled;

  return {
    status,
    error,
    isPolling,
    isActive,
    refresh,
    cancel,
  };
}
