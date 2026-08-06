import { Download, GitBranchIcon, X } from "lucide-react";
import Link from "next/link";

const cols = [
  {
    title: "Product",
    links: [
      ["Analyzer", "/analyzer"],
      ["Downloads", "/downloads"],
      ["History", "/history"],
      ["Profile", "/profile"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Documentation", "/"],
      ["API access", "/"],
      ["Changelog", "/"],
      ["Status", "/"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy Policy", "/"],
      ["Terms of Service", "/"],
      ["Cookies", "/"],
      ["Contact", "/"],
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-[2fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary">
                <Download className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display text-lg font-bold">
                Video<span className="gradient-text">Vault</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              The fastest way to download videos from the platforms you love.
              Built for creators, developers and power users.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href="#"
                className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-white/5 transition"
                aria-label="GitHub"
              >
                <GitBranchIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-white/5 transition"
                aria-label="Twitter"
              >
                <X className="h-4 w-4" />
              </a>
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold text-foreground">
                {c.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 VideoVault. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with care on the edge.
          </p>
        </div>
      </div>
    </footer>
  );
}
