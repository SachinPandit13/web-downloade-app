import { ChevronDown } from "lucide-react";
import { FAQS } from "@/src/lib/mockData";

export default function FaqSection() {
  return (
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
  );
}
