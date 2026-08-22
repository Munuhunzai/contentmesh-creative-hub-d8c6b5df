import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { sanityClient } from "@/integrations/sanity/client";
import { blogPostBySlugQuery } from "@/integrations/sanity/queries";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverUrl?: string | null;
  body?: PortableTextBlock[];
  contentBlocks?: string[];
  publishedAt?: string;
  tags?: string[];
  author?: { name: string; role?: string; photoUrl?: string | null };
};

const FALLBACK_ARTICLES: Record<string, Post> = {
  "state-of-ai-video-2026": {
    _id: "1",
    slug: "state-of-ai-video-2026",
    title: "The 2026 State of AI Video: How Generative Models Changed Commercial Ads Forever",
    tags: ["Insights"],
    excerpt:
      "An in-depth analysis of how diffusion models, multi-modal generation, and synthetic actors are redefining brand production workflows.",
    publishedAt: "2026-07-20",
    author: { name: "ContentMesh Studio", role: "AI Video Agency" },
    contentBlocks: [
      "The landscape of commercial video production has undergone a fundamental transformation. What used to require multi-million dollar studio budgets, weeks of location shoots, and extensive post-production crews can now be assembled in days using high-speed AI video synthesis pipelines.",
      "In this deep-dive report, we analyze the core breakthroughs in generative diffusion models, multi-modal control, and synthetic actors that are enabling modern brands to dominate performance advertising in 2026.",
      "1. Multi-Modal Diffusion Models & Precision Motion Control\nEarly AI video generation was plagued by flickering, morphing artifacts, and unpredictable camera movements. In 2026, third-generation video foundation models have solved temporal consistency. Modern generative workflows allow directors to control camera dynamics, character consistency, and physics.",
      "2. Synthetic Actors & Regional Personalization\nTraditional commercial shoots required flying actors across cities or filming separate localized cuts for international markets. Today, generative AI and high-fidelity voice cloning allow brands to translate a single performance into 40+ languages with automatic lip-sync alignment.",
      "3. Cutting Production Cycles from 6 Weeks to 48 Hours\nWith an AI-first production pipeline, concepting and scripting takes 2 hours, AI scene generation takes 24 hours, and color grading and sound design takes 12 hours — delivering final masters in under 48 hours.",
      "4. Rapid Creative Testing for Performance Marketing\nWinning on platforms like Meta, TikTok, and YouTube Shorts requires continuous creative variation. Instead of betting your entire campaign budget on a single commercial cut, brands now produce 10 to 20 ad variations per week.",
      "Conclusion: Combining AI Speed with Human Craft\nWhile generative AI models handle frame rendering, human directorial vision, storytelling structure, color grading, and sonic mastering remain essential. The most successful brands of 2026 aren't replacing human agency teams — they are empowering them with AI tools to create cinematic work at unprecedented scale.",
    ],
  },
  "ai-avatar-creators-onboarding": {
    _id: "2",
    slug: "ai-avatar-creators-onboarding",
    title: "Best AI Avatar Creators for Company Onboarding & Corporate Training Videos in 2026",
    tags: ["Playbook"],
    excerpt:
      "How enterprise teams build realistic AI avatar videos to streamline internal training, support portals, and employee onboarding.",
    publishedAt: "2026-07-18",
    author: { name: "Strategy Team", role: "ContentMesh Strategy" },
    contentBlocks: [
      "Enterprise communication is undergoing a massive shift towards video-first documentation. Rather than sending static PDFs, leading companies are leveraging custom AI avatars to produce engaging onboarding videos.",
      "Key Benefits of AI Avatars for Corporate Training:\n- Instant updates without re-shooting\n- Multilingual voice translation in 40+ languages\n- Consistent brand representative across all training modules",
    ],
  },
  "cut-ad-production-time": {
    _id: "3",
    slug: "cut-ad-production-time",
    title: "How We Cut Commercial Production Cycles by 78% Without Sacrificing Craft",
    tags: ["Case Study"],
    excerpt:
      "A breakdown of our hybrid workflow combining AI video production with human motion graphics and professional color grading.",
    publishedAt: "2026-07-15",
    author: { name: "Production Team", role: "ContentMesh Post-Production" },
    contentBlocks: [
      "Speed is the ultimate leverage in modern digital advertising. In this case study, we share how ContentMesh optimized video production workflows to deliver commercial-grade ads in 3 days.",
    ],
  },
  "ai-video-translation-localization": {
    _id: "4",
    slug: "ai-video-translation-localization",
    title: "Enterprise AI Video Translation & Dubbing: Reaching Global Audiences in 40+ Languages",
    tags: ["Enterprise"],
    excerpt:
      "How to use AI voice cloning, localized accents, and automated lip-syncing to translate video ad campaigns globally.",
    publishedAt: "2026-07-12",
    author: { name: "Audio Engineering", role: "ContentMesh Sound Lab" },
    contentBlocks: [
      "Expanding brand campaigns across international markets used to require hiring localization agencies and voice actors. Learn how AI dubbing and lip-syncing simplifies global expansion.",
    ],
  },
  "directors-guide-runway": {
    _id: "5",
    slug: "directors-guide-runway",
    title: "The Director's Field Guide to Prompting Runway & Sora-Class Models in 2026",
    tags: ["Craft"],
    excerpt:
      "Camera angles, lighting tokens, and movement prompts that yield cinema-grade plates every single time.",
    publishedAt: "2026-07-08",
    author: { name: "Creative Director", role: "ContentMesh Studio" },
    contentBlocks: [
      "Mastering camera syntax and cinematic prompts for video foundation models. Discover the prompt structures used by commercial AI directors.",
    ],
  },
  "ai-ugc-video-editing-agencies": {
    _id: "6",
    slug: "ai-ugc-video-editing-agencies",
    title: "How Performance Marketing Agencies Use AI UGC Video Editors for High ROI Ad Drops",
    tags: ["Marketing"],
    excerpt:
      "A playbook for scaling short-form social reels and vertical-native video ads using automated editing pipelines.",
    publishedAt: "2026-07-01",
    author: { name: "Growth Team", role: "ContentMesh Growth" },
    contentBlocks: [
      "Short-form social media ads on TikTok and Meta require high-velocity creative testing. Learn how top performance agencies edit UGC videos at scale.",
    ],
  },
};

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }): Promise<Post | null> => {
    try {
      const post = await sanityClient.fetch<Post | null>(blogPostBySlugQuery, {
        slug: params.slug,
      });
      if (post) return post;
    } catch {
      /* fallback */
    }
    return FALLBACK_ARTICLES[params.slug] ?? null;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Article not found — ContentMesh" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return {
      meta: [
        { title: `${loaderData.title} — ContentMesh` },
        { name: "description", content: loaderData.excerpt ?? "ContentMesh article" },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.excerpt ?? "ContentMesh article" },
        ...(loaderData.coverUrl ? [{ property: "og:image", content: loaderData.coverUrl }] : []),
      ],
    };
  },
  component: BlogPost,
  notFoundComponent: PostNotFound,
});

const portableTextComponents = {
  block: {
    h1: ({ children }: any) => (
      <h1 className="mt-12 mb-4 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="mt-10 mb-4 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="mt-8 mb-3 font-display text-xl sm:text-2xl font-semibold text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="mt-6 mb-2 font-display text-lg font-semibold text-foreground">{children}</h4>
    ),
    normal: ({ children }: any) => (
      <p className="mb-6 leading-relaxed text-foreground/90 text-base">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-6 border-l-4 border-accent pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="mb-6 ml-6 list-disc space-y-2 text-foreground/90">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="mb-6 ml-6 list-decimal space-y-2 text-foreground/90">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
    code: ({ children }: any) => (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{children}</code>
    ),
    link: ({ value, children }: any) => {
      const target = (value?.href || "").startsWith("http") ? "_blank" : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer nofollow" : undefined}
          className="font-medium text-accent underline underline-offset-4 hover:opacity-80"
        >
          {children}
        </a>
      );
    },
  },
};

function BlogPost() {
  const post = Route.useLoaderData();
  if (!post) throw notFound();

  return (
    <SiteLayout>
      <PageHero eyebrow={post.tags?.[0] ?? "Article"} title={post.title} desc={post.excerpt} />
      <article className="mx-auto max-w-3xl px-6 pb-24">
        {post.coverUrl && (
          <img
            src={optimizeSanityImage(post.coverUrl, 1200, 80)}
            alt={post.title}
            width={1200}
            height={675}
            loading="lazy"
            decoding="async"
            className="mb-10 aspect-[16/9] w-full rounded-3xl object-cover"
          />
        )}
        <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
          {post.author?.photoUrl && (
            <img
              src={optimizeSanityImage(post.author.photoUrl, 64, 80)}
              alt={post.author.name}
              width={32}
              height={32}
              loading="lazy"
              decoding="async"
              className="h-8 w-8 rounded-full object-cover"
            />
          )}
          {post.author?.name && (
            <span className="font-medium text-foreground">{post.author.name}</span>
          )}
          {post.publishedAt && (
            <span>
              ·{" "}
              {new Date(post.publishedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          {post.body ? (
            <PortableText value={post.body} components={portableTextComponents} />
          ) : post.contentBlocks ? (
            <div className="space-y-6 text-foreground/90 leading-relaxed whitespace-pre-line">
              {post.contentBlocks.map((block, idx) => (
                <p key={idx}>{block}</p>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">This article has no content yet.</p>
          )}
        </div>

        {/* ── End of Blog CTA Banner ── */}
        <div className="mt-14 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#040816] via-[#0E447F] to-[#FF5A1F] p-6 sm:p-8 text-white shadow-2xl">
          <div className="absolute inset-0 mesh-bg opacity-20 pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF5A1F] bg-white/10 px-3 py-1 rounded-full inline-block backdrop-blur-sm">
                Ready to Scale Your Visuals?
              </span>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold leading-tight">
                Ready to Scale Your Brand with Custom AI Video Production?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-white/80 leading-relaxed">
                Let ContentMesh build high-performing AI video ads, product showcases, animations,
                or custom avatars for your brand.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#FF5A1F] px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF5A1F]/30 transition-transform hover:scale-105 hover:bg-[#ff6e38]"
            >
              Get Our Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all articles
          </Link>
        </div>
      </article>
    </SiteLayout>
  );
}

function PostNotFound() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Not found"
        title="Article not found"
        desc="The post you're looking for isn't available."
      />
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to blog
        </Link>
      </div>
    </SiteLayout>
  );
}
