import { apiClient, getApiBaseUrl } from "./client";
import type {
  DownloadListResponse,
  DownloadStartResponse,
  DownloadStatus,
  DownloadStatusResponse,
  SupportedOptionsResponse,
  VideoFormat,
} from "./types";

export async function getOptions(): Promise<SupportedOptionsResponse> {
  const response = await apiClient.get<SupportedOptionsResponse>(
    "/api/v1/downloads/options",
  );
  return response.data;
}

export async function createDownload(body: {
  url: string;
  format: VideoFormat;
  quality: string;
}): Promise<DownloadStartResponse> {
  const response = await apiClient.post<DownloadStartResponse>(
    "/api/v1/downloads",
    body,
  );
  return response.data;
}

export async function getDownloadStatus(
  jobId: string,
): Promise<DownloadStatusResponse> {
  const response = await apiClient.get<DownloadStatusResponse>(
    `/api/v1/downloads/${jobId}`,
  );
  return response.data;
}

export async function listDownloads(params?: {
  page?: number;
  page_size?: number;
  status?: DownloadStatus;
}): Promise<DownloadListResponse> {
  const response = await apiClient.get<DownloadListResponse>(
    "/api/v1/downloads",
    { params },
  );
  return response.data;
}

export function getDownloadFileUrl(jobId: string): string {
  return `${getApiBaseUrl()}/api/v1/downloads/${jobId}/file`;
}

export async function cancelDownload(jobId: string): Promise<void> {
  await apiClient.delete(`/api/v1/downloads/${jobId}`);
}
