import test from "node:test";
import assert from "node:assert/strict";
import { loadPortfolioPage, portfolioHead } from "../src/routes/portfolio_.$slug";
import { portfolioPages, portfolioEmbedUrl, portfolioVideoUrl } from "../src/lib/portfolio-pages";
import { sanityClient } from "../src/integrations/sanity/client";
import { absoluteUrl } from "../src/lib/site";
import { getServicePage } from "../src/lib/service-pages";

test("selected portfolio pages retain individual canonicals, truthful summaries and service destinations", async () => {
  const original = sanityClient.fetch;
  sanityClient.fetch = (async (_query: string, params: { slug: string }) => ({
    _id: "published",
    title: "Published project",
    slug: params.slug,
  })) as typeof sanityClient.fetch;
  try {
    const descriptions = new Set();
    for (const page of portfolioPages) {
      const head = portfolioHead(await loadPortfolioPage(page.slug));
      assert.equal(head.links?.[0].href, absoluteUrl(`/portfolio/${page.slug}`));
      descriptions.add(head.meta.find((m) => "name" in m && m.name === "description")?.content);
      assert.ok(getServicePage(page.serviceSlug));
      assert.match(head.scripts![0].children, /BreadcrumbList/);
      assert.doesNotMatch(head.scripts![0].children, /VideoObject|AggregateRating|uploadDate/);
    }
    assert.equal(descriptions.size, portfolioPages.length);
  } finally {
    sanityClient.fetch = original;
  }
});

test("unknown or unpublished projects are 404s; CMS failure remains a server error", async () => {
  const original = sanityClient.fetch;
  let calls = 0;
  sanityClient.fetch = (async () => {
    calls++;
    return null;
  }) as typeof sanityClient.fetch;
  try {
    await assert.rejects(
      loadPortfolioPage("not-selected"),
      (e: { isNotFound?: boolean }) => e.isNotFound === true,
    );
    assert.equal(calls, 0);
    await assert.rejects(
      loadPortfolioPage(portfolioPages[0].slug),
      (e: { isNotFound?: boolean }) => e.isNotFound === true,
    );
    const error = new Error("CMS unavailable");
    sanityClient.fetch = async () => {
      throw error;
    };
    await assert.rejects(loadPortfolioPage(portfolioPages[0].slug), (e) => e === error);
    assert.ok(
      portfolioHead().meta.some(
        (m) => "name" in m && m.name === "robots" && m.content === "noindex",
      ),
    );
  } finally {
    sanityClient.fetch = original;
  }
});

test("portfolio media embeds reject unsupported hosts and never request autoplay", () => {
  assert.equal(
    portfolioEmbedUrl("https://drive.google.com/file/d/abc_123/view?usp=sharing"),
    "https://drive.google.com/file/d/abc_123/preview",
  );
  assert.equal(
    portfolioEmbedUrl("https://youtu.be/abcdefghijk"),
    "https://www.youtube-nocookie.com/embed/abcdefghijk",
  );
  assert.equal(
    portfolioEmbedUrl("https://vimeo.com/123456"),
    "https://player.vimeo.com/video/123456",
  );
  for (const value of [
    "javascript:alert(1)",
    "http://drive.google.com/file/d/id/view",
    "https://drive.google.com.evil.test/file/d/id/view",
    "https://example.test/video.mp4",
    "garbage",
  ])
    assert.equal(portfolioEmbedUrl(value), undefined);
  assert.equal(
    portfolioVideoUrl("https://cdn.sanity.io/files/project/production/video.mp4"),
    "https://cdn.sanity.io/files/project/production/video.mp4",
  );
  assert.equal(portfolioVideoUrl("https://example.test/video.mp4"), undefined);
});

test("project content, concept disclaimers and conversion links render without browser JavaScript", async () => {
  const React = await import("react");
  const { renderToString } = await import("react-dom/server");
  const { createRootRoute, createRouter, createMemoryHistory, RouterProvider } =
    await import("@tanstack/react-router");
  const { QueryClient, QueryClientProvider } = await import("@tanstack/react-query");
  const { SanitySnapshot } = await import("../src/integrations/sanity/snapshot");
  const { PortfolioDetail } = await import("../src/routes/portfolio_.$slug");
  const page = portfolioPages[3];
  const project = {
    _id: "nike",
    slug: page.slug,
    title: "Nike",
    category: "Product Videos",
    description:
      "Created for entertainment purposes. Not affiliated with, endorsed by, or sponsored by Nike.",
    videoUrl: "https://drive.google.com/file/d/test_video/view",
  };
  const route = createRootRoute({
    component: () => React.createElement(PortfolioDetail, { page, project }),
  });
  const router = createRouter({
    routeTree: route,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  const client = new QueryClient();
  await router.load();
  try {
    const html = renderToString(
      React.createElement(
        QueryClientProvider,
        { client },
        React.createElement(
          SanitySnapshot,
          { data: {} },
          React.createElement(RouterProvider, { router }),
        ),
      ),
    );
    assert.match(html, /Not affiliated with, endorsed by, or sponsored by Nike/);
    assert.match(html, /Concept study/);
    assert.match(html, /Creative possibilities/);
    assert.match(html, /href="\/services\/ai-product-video-ads"/);
    assert.match(html, /href="\/contact\?reference=/);
    assert.match(html, /https:\/\/drive.google.com\/file\/d\/test_video\/preview/);
    assert.doesNotMatch(html, /autoplay=1|<dt[^>]*>Client<\/dt>|<h2[^>]*>Outcome<\/h2>/);
  } finally {
    client.clear();
  }
});
