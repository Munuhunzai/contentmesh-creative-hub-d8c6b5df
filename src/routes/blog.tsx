import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { ArrowUpRight, Clock, Sparkles } from "lucide-react";
import { useSanity } from "@/integrations/sanity/useSanity";
import { blogListQuery } from "@/integrations/sanity/queries";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog & Playbooks — ContentMesh" },
      { name: "description", content: "Playbooks, AI video experiments, creative strategy, and behind-the-scenes insights from ContentMesh." },
      { property: "og:title", content: "Blog & Playbooks — ContentMesh" },
      { property: "og:description", content: "Playbooks, AI experiments, and brand storytelling insights." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverUrl?: string | null;
  publishedAt?: string;
  tags?: string[];
  authorName?: string;
};

const GRADIENTS = [
  "linear-gradient(135deg, #06060a 0%, #0D4C92 60%, #FF5A1F 100%)",
  "linear-gradient(135deg, #111118 0%, #330055 50%, #FF7A00 100%)",
  "linear-gradient(135deg, #040d1a 0%, #003344 50%, #0D4C92 100%)",
  "linear-gradient(135deg, #1a0800 0%, #661a00 50%, #F6C244 100%)",
  "linear-gradient(135deg, #0d0d12 0%, #1e1e2d 50%, #FF5A1F 100%)",
  "linear-gradient(135deg, #08101a 0%, #0D4C92 50%, #00b4d8 100%)",
];

const FALLBACK: Post[] = [
  {
    _id: "1",
    slug: "state-of-ai-video-2026",
    title: "The 2026 State of AI Video: How Generative Models Changed Commercial Ads Forever",
    tags: ["Insights"],
    excerpt: "An in-depth analysis of how diffusion models, multi-modal generation, and synthetic actors are redefining brand production workflows.",
    publishedAt: "2026-07-20",
    authorName: "ContentMesh Studio",
  },
  {
    _id: "2",
    slug: "cut-ad-production-time",
    title: "How We Cut Commercial Production Cycles by 78% Without Sacrificing Craft",
    tags: ["Case Study"],
    excerpt: "A breakdown of our hybrid workflow combining AI generation with human motion graphics and professional color grading.",
    publishedAt: "2026-07-15",
    authorName: "Production Team",
  },
  {
    _id: "3",
    slug: "directors-guide-runway",
    title: "The Director's Field Guide to Prompting Runway & Midjourney in 2026",
    tags: ["Playbook"],
    excerpt: "Camera angles, lighting tokens, and movement prompts that yield cinema-grade plates every single time.",
    publishedAt: "2026-07-10",
    authorName: "Creative Director",
  },
  {
    _id: "4",
    slug: "human-sounding-voiceovers",
    title: "Crafting AI Voiceovers That Actually Sound Human: Dialects, Pacing & Emotion",
    tags: ["Craft"],
    excerpt: "How to eliminate synthetic voice artifacts using multi-layer audio processing and localized dialect tuning.",
    publishedAt: "2026-07-02",
    authorName: "Audio Engineering",
  },
  {
    _id: "5",
    slug: "brand-safe-ai-pipeline",
    title: "Building a Brand-Safe AI Pipeline for High-Compliance Enterprise Clients",
    tags: ["Ops"],
    excerpt: "Copyright, character consistency, and asset isolation strategies for regulated industries.",
    publishedAt: "2026-06-25",
    authorName: "Strategy Team",
  },
  {
    _id: "6",
    slug: "storyboards-still-win",
    title: "Why Traditional Storyboarding is More Essential in AI Video Production Than Ever",
    tags: ["Craft"],
    excerpt: "Prompting without a story arc leads to visual noise. Here is how we map narrative beats before model generation.",
    publishedAt: "2026-06-18",
    authorName: "Art Department",
  },
];

function Blog() {
  const posts = useSanity<Post[]>(["sanity", "blog", "list"], blogListQuery, FALLBACK);
  const list = posts.length > 0 ? posts : FALLBACK;

  const featured = list[0];
  const remaining = list.slice(1);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Studio Intel & Playbooks"
        title="Insights, Experiments & Case Studies"
        desc="Deep dives, field guides, and behind-the-scenes breakdowns from the frontier of AI video production."
      />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        {/* ── Featured Hero Article ── */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14 overflow-hidden rounded-[2.5rem] border border-border/80 bg-card shadow-xl transition-all hover:shadow-2xl"
          >
            <div className="grid gap-0 lg:grid-cols-12">
              {/* Media preview */}
              <div
                className="relative min-h-[300px] overflow-hidden lg:col-span-7 lg:min-h-[460px]"
                style={
                  featured.coverUrl
                    ? { background: `url(${featured.coverUrl}) center/cover` }
                    : { background: GRADIENTS[0] }
                }
              >
                {!featured.coverUrl && (
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="mesh-bg absolute inset-0 opacity-40 mix-blend-overlay" />
                    <Sparkles className="h-20 w-20 text-white/20" />
                  </div>
                )}
                {/* Badge */}
                <div className="absolute left-6 top-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-400 backdrop-blur-md border border-white/10">
                    <Sparkles className="h-3 w-3" /> Featured Story
                  </span>
                </div>
              </div>

              {/* Text content */}
              <div className="flex flex-col justify-between p-8 sm:p-12 lg:col-span-5">
                <div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                    {featured.tags?.[0] && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                        {featured.tags[0]}
                      </span>
                    )}
                    {featured.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(featured.publishedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-5 font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-3xl">
                    {featured.title}
                  </h2>

                  {featured.excerpt && (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {featured.excerpt}
                    </p>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-border/60 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    By {featured.authorName ?? "ContentMesh Team"}
                  </span>

                  <Link
                    to="/blog/$slug"
                    params={{ slug: featured.slug }}
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-105"
                  >
                    Read Story
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Remaining Posts Grid ── */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {remaining.map((p, i) => (
            <motion.article
              key={p._id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm transition-all hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl"
            >
              {/* Image / Gradient preview */}
              <div
                className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl"
                style={
                  p.coverUrl
                    ? { background: `url(${p.coverUrl}) center/cover` }
                    : { background: GRADIENTS[(i + 1) % GRADIENTS.length] }
                }
              >
                {!p.coverUrl && (
                  <div className="absolute inset-0 mesh-bg opacity-30 mix-blend-overlay" />
                )}
                <div className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-gray-900 opacity-0 shadow-md backdrop-blur-sm transition-all group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              {/* Meta & Title */}
              <div className="mt-5 flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 text-xs">
                    {p.tags?.[0] && (
                      <span className="rounded-full bg-orange-500/10 px-3 py-1 font-bold text-orange-500">
                        {p.tags[0]}
                      </span>
                    )}
                    <span className="text-muted-foreground text-[11px]">
                      {p.publishedAt
                        ? new Date(p.publishedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : p.excerpt}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {p.title}
                  </h3>

                  {p.excerpt && (
                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {p.excerpt}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {p.authorName ?? "ContentMesh"}
                  </span>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline"
                  >
                    Read Playbook <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
