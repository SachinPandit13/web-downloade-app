"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/src/components/ui";

const links = [
  { to: "/", label: "Home" },
  { to: "/analyzer", label: "Analyzer" },
  { to: "/downloads", label: "Downloads" },
  { to: "/history", label: "History" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-strong border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-primary glow-primary">
              <Download className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-bold tracking-tight truncate">
              Video<span className="gradient-text">Vault</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const isActive =
                l.to === "/" ? pathname === "/" : pathname?.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  href={l.to}
                  className={
                    isActive
                      ? "px-3 py-2 text-sm font-medium text-foreground rounded-lg bg-white/5"
                      : "px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:text-foreground hover:bg-white/5 transition-colors"
                  }
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {/* <Link
              href="/analyzer"
              className="inline-flex items-center gap-2 rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-white glow-primary hover:opacity-95 transition"
            >
              Start Downloading
            </Link> */}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-border px-4 py-3 space-y-1 animate-fade-up">
            {links.map((l) => (
              <Link
                key={l.to}
                href={l.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            {/* <Link
              href="/analyzer"
              onClick={() => setOpen(false)}
              className="block mt-2 text-center rounded-lg gradient-primary px-4 py-2.5 text-sm font-semibold text-white"
            >
              Start Downloading
            </Link> */}
          </div>
        )}
      </div>
    </header>
  );
}
