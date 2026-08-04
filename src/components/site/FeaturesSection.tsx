import {
  Sparkles,
  Zap,
  ShieldCheck,
  FileVideo,
  History,
  ListMusic,
  Captions,
  Smartphone,
} from "lucide-react";
import { FEATURES } from "@/src/lib/mockData";

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

export default function FeaturesSection() {
  return (
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
  );
}
