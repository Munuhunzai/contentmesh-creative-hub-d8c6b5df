import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { sanityClient } from "@/integrations/sanity/client";
import { absoluteUrl } from "@/lib/site";
import { buildSitemap } from "@/lib/sitemap";
import { serviceIndex } from "@/lib/service-index";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const posts = await sanityClient.fetch<Array<{ slug: string; updatedAt?: string }>>(
            `*[_type == "blogPost" && defined(slug.current) && (!defined(publishedAt) || publishedAt <= now())]{"slug": slug.current, "updatedAt": _updatedAt}`,
          );
          const pages = [
            "/",
            "/services",
            "/portfolio",
            "/about",
            "/blog",
            "/contact",
            "/privacy",
            "/terms",
            "/tools/storyboard-generator",
          ].map((path) => ({ url: absoluteUrl(path) }));
          return new Response(
            buildSitemap([
              ...pages,
              ...serviceIndex.map((page) => ({ url: absoluteUrl(`/services/${page.slug}`) })),
              ...(posts || []).map((p) => ({
                url: absoluteUrl(`/blog/${encodeURIComponent(p.slug)}`),
                updatedAt: p.updatedAt,
              })),
            ]),
            {
              headers: {
                "Content-Type": "application/xml; charset=utf-8",
                "Cache-Control": "public, max-age=3600, stale-if-error=86400",
              },
            },
          );
        } catch {
          // Do not cache an incomplete sitemap that silently drops every CMS article.
          return new Response("Sitemap temporarily unavailable", {
            status: 503,
            headers: { "Retry-After": "300", "Cache-Control": "no-store" },
          });
        }
      },
    },
  },
});
