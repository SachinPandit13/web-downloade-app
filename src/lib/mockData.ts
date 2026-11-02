export type Platform = {
  id: string;
  name: string;
  description: string;
  color: string;
  gradient: string;
};

export const PLATFORMS: Platform[] = [
  {
    id: "youtube",
    name: "YouTube",
    description: "Long-form videos, music & live streams",
    color: "#FF0033",
    gradient: "from-red-500 to-rose-600",
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Reels, stories & feed posts",
    color: "#E1306C",
    gradient: "from-fuchsia-500 via-pink-500 to-orange-400",
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Public videos & watch clips",
    color: "#1877F2",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    id: "tiktok",
    name: "TikTok",
    description: "Short-form vertical videos",
    color: "#00F2EA",
    gradient: "from-cyan-400 via-slate-50 to-pink-500",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    description: "Tweets with embedded media",
    color: "#FFFFFF",
    gradient: "from-slate-300 to-slate-600",
  },
  {
    id: "vimeo",
    name: "Vimeo",
    description: "High quality creator videos",
    color: "#1AB7EA",
    gradient: "from-sky-400 to-cyan-600",
  },
  {
    id: "dailymotion",
    name: "Dailymotion",
    description: "News, sports & entertainment",
    color: "#0066DC",
    gradient: "from-indigo-500 to-blue-700",
  },
];

export const QUALITIES = [
  "144p",
  "240p",
  "360p",
  "480p",
  "720p",
  "1080p",
  "1440p",
  "2160p",
] as const;
export const FORMATS = ["MP4", "WEBM", "MP3", "AAC"] as const;

export type DownloadStatus = "Pending" | "Processing" | "Completed" | "Failed";

export type DownloadItem = {
  id: string;
  title: string;
  channel: string;
  platform: string;
  thumbnail: string;
  format: string;
  quality: string;
  size: string;
  date: string;
  status: DownloadStatus;
};

const thumbs = [
  "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=640&q=70",
  "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=640&q=70",
  "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=640&q=70",
  "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=640&q=70",
  "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=640&q=70",
  "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=640&q=70",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=640&q=70",
  "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=640&q=70",
];

const titles = [
  "Mastering Framer Motion in 2026",
  "Sunset timelapse over Lisbon rooftops",
  "How I built a SaaS in 14 days",
  "Lo-fi beats to design to · 2hr mix",
  "Behind the scenes: launch week",
  "The future of edge computing",
  "Tokyo night drive · 4K HDR",
  "Why Rust is taking over backend",
];
const channels = [
  "Vercel",
  "Frame Studio",
  "Indie Hackers",
  "Lo-fi Girl",
  "Linear",
  "Fireship",
  "Tokyo Drift",
  "ThePrimeagen",
];
const platforms = [
  "YouTube",
  "Vimeo",
  "YouTube",
  "YouTube",
  "X (Twitter)",
  "YouTube",
  "Vimeo",
  "YouTube",
];
const statuses: DownloadStatus[] = [
  "Completed",
  "Completed",
  "Processing",
  "Completed",
  "Failed",
  "Pending",
  "Completed",
  "Completed",
];

export const DOWNLOAD_HISTORY: DownloadItem[] = Array.from(
  { length: 24 },
  (_, i) => ({
    id: `dl_${i + 1}`,
    title: titles[i % titles.length],
    channel: channels[i % channels.length],
    platform: platforms[i % platforms.length],
    thumbnail: thumbs[i % thumbs.length],
    format: ["MP4", "WEBM", "MP3"][i % 3],
    quality: ["1080p", "720p", "320kbps", "2160p"][i % 4],
    size: `${(((i * 37) % 400) + 30).toFixed(1)} MB`,
    date: new Date(1770000000000 - i * 86400000 * 1.3).toISOString(),
    status: statuses[i % statuses.length],
  }),
);

export const SAMPLE_VIDEO = {
  title: "Mastering Framer Motion in 2026 — Complete Guide",
  channel: "Vercel",
  channelAvatar:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&q=70",
  duration: "18:42",
  uploadDate: "Jun 2, 2026",
  views: "1.2M views",
  thumbnail:
    "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1280&q=80",
  description:
    "A deep dive into the new animation primitives, layout transitions, and gesture APIs.",
};

export const FEATURES = [
  {
    icon: "Sparkles",
    title: "High Quality Downloads",
    description: "Up to 4K 2160p with original audio fidelity preserved.",
  },
  {
    icon: "Zap",
    title: "Lightning Fast",
    description: "Distributed edge workers process your video in seconds.",
  },
  {
    icon: "ShieldCheck",
    title: "Secure & Private",
    description: "No tracking, no logs — your downloads stay yours.",
  },
  {
    icon: "FileVideo",
    title: "Multiple Formats",
    description: "MP4, WEBM, MP3, AAC — pick what fits your workflow.",
  },
  {
    icon: "History",
    title: "Download History",
    description: "Pick up exactly where you left off, on any device.",
  },
  {
    icon: "ListMusic",
    title: "Playlist Support",
    description: "Queue entire playlists and download in one click.",
  },
  {
    icon: "Captions",
    title: "Subtitle Support",
    description: "Grab captions in SRT or VTT alongside your video.",
  },
  {
    icon: "Smartphone",
    title: "Mobile Friendly",
    description: "Designed mobile-first — works beautifully on any screen.",
  },
];

export const FAQS = [
  {
    q: "Which platforms are supported?",
    a: "VideoVault supports YouTube, Instagram, Facebook, TikTok, X (Twitter), Vimeo and Dailymotion. We add new platforms every month based on community votes.",
  },
  {
    q: "What formats and qualities can I download?",
    a: "Video formats include MP4 and WEBM from 144p up to 4K 2160p. For audio-only we support MP3 and AAC up to 320kbps.",
  },
  {
    q: "How does the download process work?",
    a: "Paste a URL, hit Analyze, choose your preferred format and quality, then download. Our edge workers process the video and stream it directly to your device.",
  },
  {
    q: "Is my download history private?",
    a: "Yes. History is stored locally in your account and never shared. You can clear it anytime from Settings.",
  },
  {
    q: "Do I need an account?",
    a: "An account unlocks history, playlists and higher concurrent downloads — but basic single-video downloading works without signing up.",
  },
];
