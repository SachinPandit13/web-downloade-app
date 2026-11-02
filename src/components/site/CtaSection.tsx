import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
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
  );
}
