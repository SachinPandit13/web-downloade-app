import { apiFetch, getApiBaseUrl } from "./client";
import type {
  DownloadListResponse,
  DownloadStartResponse,
  DownloadStatus,
  DownloadStatusResponse,
  SupportedOptionsResponse,
  VideoFormat,
} from "./types";

export function getOptions(): Promise<SupportedOptionsResponse> {
  return apiFetch<SupportedOptionsResponse>("/api/v1/downloads/options");
}

export function createDownload(body: {
  url: string;
  format: VideoFormat;
  quality: string;
}): Promise<DownloadStartResponse> {
  return apiFetch<DownloadStartResponse>("/api/v1/downloads", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getDownloadStatus(
  jobId: string,
): Promise<DownloadStatusResponse> {
  return apiFetch<DownloadStatusResponse>(`/api/v1/downloads/${jobId}`);
}

export function listDownloads(params?: {
  page?: number;
  page_size?: number;
  status?: DownloadStatus;
}): Promise<DownloadListResponse> {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.page_size) search.set("page_size", String(params.page_size));
  if (params?.status) search.set("status", params.status);
  const qs = search.toString();
  return apiFetch<DownloadListResponse>(
    `/api/v1/downloads${qs ? `?${qs}` : ""}`,
  );
}

export function getDownloadFileUrl(jobId: string): string {
  return `${getApiBaseUrl()}/api/v1/downloads/${jobId}/file`;
}

export function cancelDownload(jobId: string): Promise<void> {
  return apiFetch<void>(`/api/v1/downloads/${jobId}`, {
    method: "DELETE",
  });
}
