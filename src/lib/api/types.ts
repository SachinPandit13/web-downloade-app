export type DownloadStatus = "pending" | "processing" | "completed" | "failed";
export type VideoFormat = "MP4" | "WEBM" | "MP3" | "AAC";

export type FormatOption = {
  format_id: string;
  ext: string;
  type: "video" | "audio";
  height: number | null;
  width: number | null;
  fps: number | null;
  vcodec: string | null;
  acodec: string | null;
  abr: number | null;
  filesize: number | null;
  note: string | null;
};

export type AnalyzeResponse = {
  url: string;
  platform: string;
  platform_name: string;
  title: string;
  channel: string | null;
  channel_id: string | null;
  channel_avatar: string | null;
  thumbnail: string | null;
  description: string | null;
  duration_seconds: number | null;
  upload_date: string | null;
  view_count: number | null;
  like_count: number | null;
  is_live: boolean;
  formats: FormatOption[];
};

export type SupportedOptionsResponse = {
  video_formats: string[];
  audio_formats: string[];
  video_qualities: string[];
  audio_qualities: string[];
};

export type DownloadStartResponse = {
  job_id: string;
  status: DownloadStatus;
};

export type DownloadStatusResponse = {
  job_id: string;
  status: DownloadStatus;
  progress: number;
  speed_bytes_per_sec: number | null;
  eta_seconds: number | null;
  file_size_bytes: number | null;
  title: string | null;
  format: string;
  quality: string;
  error: string | null;
};

export type DownloadListItem = {
  job_id: string;
  title: string | null;
  channel: string | null;
  platform: string | null;
  thumbnail: string | null;
  format: string;
  quality: string;
  file_size_bytes: number | null;
  status: DownloadStatus;
  created_at: string | null;
  error: string | null;
};

export type DownloadListResponse = {
  items: DownloadListItem[];
  total: number;
  page: number;
  page_size: number;
};
