import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useSanity } from "@/integrations/sanity/useSanity";
import { homepageQuery } from "@/integrations/sanity/queries";
type Data = { ctaTitle?: string; ctaTitleAccent?: string; ctaSubtitle?: string };
export function CTA() {
  const data = useSanity<Data>(["sanity", "homepage", "cta"], homepageQuery, {});
  return (
    <section className="studio-section !pt-4">
      <div className="studio-cta-panel">
        <p className="eyebrow">The next frame is yours</p>
        <div className="mt-5 grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="section-title">
              {data.ctaTitle || "Have something"}
              <br />
              <span className="text-brand-blue">{data.ctaTitleAccent || "in mind?"}</span>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              {data.ctaSubtitle ||
                "A product to launch. A story to tell. A channel to build. Let’s turn the idea into a production plan."}
            </p>
          </div>
          <div className="lg:justify-self-end">
            <Link to="/contact" className="studio-button studio-button-orange">
              Tell us about your project <ArrowUpRight className="h-5 w-5" />
            </Link>
            <p className="mt-4 text-xs text-muted-foreground">
              No finished brief needed. Start with the idea.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
