"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Clipboard } from "lucide-react";
import { motion } from "framer-motion";
import { PlatformIcon } from "@/src/components/site/PlatformIcon";
import { PLATFORMS } from "@/src/lib/mockData";

export default function HeroSection() {
  const [url, setUrl] = useState("");

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-6 sm:pt-12">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
            7 platforms supported · 4K downloads
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]"
          >
            Download videos from <br className="hidden sm:block" />
            <span className="gradient-text-animated">
              your favorite platforms
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Paste a video URL, choose quality and format, and download
            instantly. No bloat, no ads - just a fast, private, beautiful
            experience.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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
          </motion.form>

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
      </div>
    </section>
  );
}
