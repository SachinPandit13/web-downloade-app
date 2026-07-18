"use client";

import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Clipboard,
  Sparkles,
  Zap,
  ShieldCheck,
  FileVideo,
  History,
  ListMusic,
  Captions,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import Particles from "@/src/components/site/Particles";
import { PlatformIcon } from "@/src/components/site/PlatformIcon";
import { PLATFORMS, FEATURES, FAQS } from "@/src/lib/mockData";
import Link from "next/link";

const featureIcons = {
  Sparkles,
  Zap,
  ShieldCheck,
  FileVideo,
  History,
  ListMusic,
  Captions,
  Smartphone,
} as const;

export default function Landing() {
  const [url, setUrl] = useState("");
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Particles />
        <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,oklch(0.62_0.205_280/0.25),transparent_60%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
              7 platforms supported · 4K downloads
            </div>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              Download videos from <br className="hidden sm:block" />
              <span className="gradient-text">your favorite platforms</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              Paste a video URL, choose quality and format, and download
              instantly. No bloat, no ads — just a fast, private, beautiful
              experience.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="mt-9 mx-auto max-w-2xl"
            >
              <div className="gradient-border rounded-2xl p-1.5 flex flex-col sm:flex-row gap-1.5 shadow-2xl shadow-primary/10">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Clipboard className="h-4 w-4 text-muted-foreground shrink-0" />
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste a YouTube, TikTok, Instagram… URL"
                    className="w-full bg-transparent py-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none"
                  />
                </div>
                <Link
                  href={
                    url.trim()
                      ? `/analyzer?url=${encodeURIComponent(url.trim())}`
                      : "/analyzer"
                  }
                  aria-disabled={!url.trim()}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-3 text-sm font-semibold text-white glow-primary transition ${
                    url.trim()
                      ? "hover:opacity-95"
                      : "opacity-50 pointer-events-none"
                  }`}
                >
                  Analyze <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Free for personal use. Respect creators' rights.
              </p>
            </form>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/analyzer"
                className="inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-white"
              >
                Start Downloading
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/5 px-5 py-2.5 text-sm font-medium hover:bg-white/10 transition"
              >
                Learn More <ChevronDown className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-3 opacity-90">
              {PLATFORMS.map((p) => (
                <div
                  key={p.id}
                  className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted-foreground"
                >
                  <PlatformIcon id={p.id} className="h-3.5 w-3.5" />
                  {p.name}
                </div>
              ))}
            </div>
          </div>

          {/* Download illustration card */}
          <div className="mt-20 mx-auto max-w-4xl animate-scale-in">
            <div className="gradient-border rounded-3xl p-2">
              <div className="rounded-[1.25rem] bg-surface/60 p-6 sm:p-8">
                <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] items-center">
                  <div className="aspect-video rounded-2xl overflow-hidden relative bg-black">
                    <img
                      src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1280&q=70"
                      alt="Preview"
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">
                        Mastering Framer Motion · 18:42
                      </span>
                      <span className="rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white font-mono">
                        4K
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Ready to download
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">
                      Mastering Framer Motion in 2026
                    </h3>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                        <span className="text-muted-foreground">Format</span>
                        <span className="font-mono">MP4</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                        <span className="text-muted-foreground">Quality</span>
                        <span className="font-mono">2160p · 4K</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                        <span className="text-muted-foreground">Size</span>
                        <span className="font-mono">412 MB</span>
                      </div>
                    </div>
                    <button className="mt-4 w-full rounded-xl gradient-primary py-2.5 text-sm font-semibold text-white glow-primary">
                      Download now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-accent">
            Supported platforms
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
            Works everywhere you watch
          </h2>
          <p className="mt-3 text-muted-foreground">
            From short-form to 4K cinema — VideoVault detects and optimizes
            automatically.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORMS.map((p, i) => (
            <div
              key={p.id}
              className="group glass rounded-2xl p-5 hover:bg-white/[0.06] transition animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div
                className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${p.gradient} shadow-lg`}
              >
                <PlatformIcon id={p.id} className="h-5 w-5 text-white" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <h3 className="font-semibold">{p.name}</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-success/15 text-success px-2 py-0.5 text-[10px] font-semibold">
                  <CheckCircle2 className="h-3 w-3" /> Supported
                </span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-28"
      >
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-accent">Features</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need, nothing you don't
          </h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => {
            const Icon =
              featureIcons[f.icon as keyof typeof featureIcons] ?? Sparkles;
            return (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl glass p-5 hover:-translate-y-1 transition animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition" />
                <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-28">
        <div className="text-center">
          <p className="text-sm font-semibold text-accent">FAQ</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
            Common questions
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group glass rounded-xl px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                <span className="font-medium">{f.q}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-28">
        <div className="gradient-border rounded-3xl p-1">
          <div className="rounded-[1.4rem] bg-surface/60 p-10 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to download in seconds?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Join thousands of creators using VideoVault every day.
            </p>
            <Link
              href="/analyzer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-white glow-primary"
            >
              Start Downloading <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
