import { optimizeSanityImage, getSanitySrcSet } from "@/lib/sanity-image";
import { seoHead, jsonLd, absoluteUrl, SOCIAL_IMAGE } from "@/lib/site";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { sanityClient } from "@/integrations/sanity/client";
import { blogPostBySlugQuery } from "@/integrations/sanity/queries";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Post = {
  _id: string;
  _updatedAt?: string;
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

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }): Promise<Post> => {
    const post = await sanityClient.fetch<Post | null>(blogPostBySlugQuery, { slug: params.slug });
    if (!post) throw notFound();
    return post;
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
    const head = seoHead(
      loaderData.title + " | ContentMesh",
      loaderData.excerpt ?? "AI video production insights from ContentMesh.",
      `/blog/${encodeURIComponent(loaderData.slug)}`,
      loaderData.coverUrl || SOCIAL_IMAGE,
      "article",
    );
    return {
      ...head,
      links: [
        ...(head.links || []),
        ...(loaderData.coverUrl
          ? [
              {
                rel: "preload",
                as: "image",
                href: optimizeSanityImage(loaderData.coverUrl, 1200, 65),
                imageSrcSet: getSanitySrcSet(loaderData.coverUrl, [480, 768, 1200], 65),
                imageSizes: "(min-width: 768px) 720px, calc(100vw - 48px)",
                fetchPriority: "high" as const,
              },
            ]
          : []),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: jsonLd({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: loaderData.title,
            description: loaderData.excerpt,
            image: loaderData.coverUrl || SOCIAL_IMAGE,
            datePublished: loaderData.publishedAt,
            dateModified: loaderData._updatedAt,
            mainEntityOfPage: absoluteUrl(`/blog/${encodeURIComponent(loaderData.slug)}`),
            author: {
              "@type": loaderData.author?.name ? "Person" : "Organization",
              name: loaderData.author?.name || "ContentMesh Studios",
            },
            publisher: { "@type": "Organization", name: "ContentMesh Studios", url: absoluteUrl() },
          }),
        },
      ],
    };
  },
  component: BlogPost,
  notFoundComponent: PostNotFound,
});

function normalizeArticleHeadings(blocks: PortableTextBlock[]): PortableTextBlock[] {
  let previousLevel = 1;
  return blocks.map((block) => {
    if (block._type !== "block" || !/^h[1-6]$/.test(block.style || "")) return block;
    const level = Math.min(Math.max(2, Number(block.style!.slice(1))), previousLevel + 1);
    previousLevel = level;
    return { ...block, style: `h${level}` };
  });
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h2 className="mt-12 mb-4 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        {children}
      </h2>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 font-display text-xl sm:text-2xl font-semibold text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 mb-2 font-display text-lg font-semibold text-foreground">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="mb-6 leading-relaxed text-foreground/90 text-base">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-accent pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 ml-6 list-disc space-y-2 text-foreground/90">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 ml-6 list-decimal space-y-2 text-foreground/90">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{children}</code>
    ),
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http") ? "_blank" : undefined;
      return (
        <a
          href={
            /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(value?.href || "") ? value.href : undefined
          }
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
            src={optimizeSanityImage(post.coverUrl, 1200, 65)}
            srcSet={getSanitySrcSet(post.coverUrl, [480, 768, 1200], 65)}
            sizes="(min-width: 768px) 720px, calc(100vw - 48px)"
            fetchPriority="high"
            alt={post.title}
            width={1200}
            height={675}
            loading="eager"
            decoding="async"
            className="mb-10 aspect-[16/9] w-full rounded-3xl object-cover"
          />
        )}
        <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
          {post.author?.photoUrl && (
            <img
              src={optimizeSanityImage(post.author.photoUrl, 64, 70)}
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
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                timeZone: "UTC",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          {post.body ? (
            <PortableText
              value={normalizeArticleHeadings(post.body)}
              components={portableTextComponents}
            />
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
        <div className="mt-14 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#040816] via-[#0E447F] to-[#082F59] p-6 sm:p-8 text-white shadow-2xl">
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
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#b83c0c] px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF5A1F]/30 transition-transform hover:scale-105 hover:bg-[#94310b]"
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
