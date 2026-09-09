import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { serviceIndex } from "@/lib/service-index";

export function ServiceLinks() {
  return (
    <section className="studio-section border-t border-border" aria-labelledby="production-guides">
      <p className="eyebrow">Plan your production</p>
      <h2 id="production-guides" className="section-title mt-3">
        Find the right video for your brief.
      </h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {serviceIndex.map((page) => (
          <Link
            key={page.slug}
            to="/services/$slug"
            params={{ slug: page.slug }}
            className="rounded-2xl border border-border bg-white p-6 transition-colors hover:border-brand-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
          >
            <h3 className="font-display text-xl font-bold text-brand-blue">{page.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{page.audience}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
              Process, deliverables & questions <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
