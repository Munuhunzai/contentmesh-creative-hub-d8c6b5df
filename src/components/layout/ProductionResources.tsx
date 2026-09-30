import { Link } from "@tanstack/react-router";

const guides = [
  {
    slug: "how-much-does-ai-video-production-cost-a-realistic-pricing-breakdown",
    title: "What affects AI video production cost?",
    description: "Understand the scope before comparing production quotes.",
  },
  {
    slug: "ai-video-editing-tools-vs-full-service-ai-video-production-which-do-you-need",
    title: "A video tool or a production partner?",
    description: "Decide which parts of the workflow your team can manage.",
  },
  {
    slug: "ai-video-quality-control-how-to-make-sure-generated-content-stays-on-brand",
    title: "How to review AI video quality",
    description: "Plan checks for continuity, product detail and brand consistency.",
  },
];

export function ProductionResources() {
  return (
    <section
      className="studio-section border-t border-border"
      aria-labelledby="production-resources"
    >
      <p className="eyebrow">Before you commission a video</p>
      <h2 id="production-resources" className="section-title mt-3">
        Plan the scope, budget and review.
      </h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            to="/blog/$slug"
            params={{ slug: guide.slug }}
            className="rounded-2xl border border-border p-6 transition-colors hover:bg-slate-50"
          >
            <h3 className="text-lg font-semibold text-brand-blue underline underline-offset-4">
              {guide.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{guide.description}</p>
          </Link>
        ))}
      </div>
      <p className="mt-8 leading-7 text-muted-foreground">
        Already have a script?{" "}
        <Link
          to="/tools/storyboard-generator"
          className="font-semibold text-brand-blue underline underline-offset-4"
        >
          Try the AI storyboard prompt generator
        </Link>{" "}
        to plan shots before discussing your production brief.
      </p>
    </section>
  );
}
