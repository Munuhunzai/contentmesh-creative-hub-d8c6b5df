import { Link } from "@tanstack/react-router";
import { ArrowRight, Clapperboard, ShoppingBag, Youtube } from "lucide-react";
import { serviceIndex } from "@/lib/service-index";

export function ServiceLinks() {
  return (
    <section className="studio-section border-t border-border" aria-labelledby="production-guides">
      <p className="eyebrow">Plan your production</p>
      <h2 id="production-guides" className="section-title mt-3">
        Find the right video for your brief.
      </h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {serviceIndex.map((page, index) => {
          const Icon = [Clapperboard, ShoppingBag, Youtube][index % 3];
          return (
            <Link
              key={page.slug}
              to="/services/$slug"
              params={{ slug: page.slug }}
              className="service-guide-card group"
            >
              <div className="service-guide-top" aria-hidden="true">
                <Icon className="h-7 w-7" />
                <span>0{index + 1}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-brand-blue">{page.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{page.audience}</p>
              <span className="service-card-action">
                Explore the process{" "}
                <span className="service-card-arrow">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
