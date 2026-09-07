import { optimizeSanityImage } from "@/lib/sanity-image";
import { Quote } from "lucide-react";
import { useSanity } from "@/integrations/sanity/useSanity";
import { testimonialsQuery } from "@/integrations/sanity/queries";
export type Testimonial = {
  _id: string;
  quote: string;
  authorName: string;
  authorRole?: string;
  company?: string;
  avatarUrl?: string | null;
  rating?: number;
};
export function Testimonials() {
  const data = useSanity<Testimonial[]>(["sanity", "testimonials"], testimonialsQuery, []);
  const list = data.filter((item) => item.quote?.trim() && item.authorName?.trim());
  if (!list.length) return null;
  return (
    <section className="studio-section border-t border-border" id="testimonials">
      <div className="studio-section-heading">
        <div>
          <p className="eyebrow">Client perspective</p>
          <h2 className="section-title mt-4">In their own words.</h2>
        </div>
      </div>
      <div className={`grid gap-6 ${list.length > 1 ? "md:grid-cols-2" : "max-w-4xl"}`}>
        {list.map((item) => (
          <figure key={item._id} className="flex flex-col border border-border bg-white p-7 sm:p-9">
            <div className="flex items-center justify-between gap-4">
              <Quote aria-hidden="true" className="h-7 w-7 text-accent" strokeWidth={1.5} />
              {typeof item.rating === "number" &&
                Number.isFinite(item.rating) &&
                item.rating >= 0 &&
                item.rating <= 5 && (
                  <span className="text-xs font-semibold text-brand-blue">
                    Rated {item.rating} / 5
                  </span>
                )}
            </div>
            <blockquote className="my-7 flex-1 font-display text-xl font-medium leading-relaxed tracking-tight">
              {item.quote}
            </blockquote>
            <figcaption className="flex items-center gap-4 border-t border-border pt-5">
              {item.avatarUrl ? (
                <img
                  src={optimizeSanityImage(item.avatarUrl, 120, 70)}
                  alt=""
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-blue/5 font-bold text-brand-blue"
                >
                  {item.authorName[0]}
                </span>
              )}
              <div>
                <p className="text-sm font-bold">{item.authorName}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {[item.authorRole, item.company].filter(Boolean).join(" / ")}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
