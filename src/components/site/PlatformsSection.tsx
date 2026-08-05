import { CheckCircle2 } from "lucide-react";
import { PlatformIcon } from "@/src/components/site/PlatformIcon";
import { PLATFORMS } from "@/src/lib/mockData";

export default function PlatformsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-sm font-semibold text-accent">Supported platforms</p>
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
  );
}
