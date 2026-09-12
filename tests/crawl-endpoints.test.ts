import test from "node:test";
import assert from "node:assert/strict";
import { Route as RobotsRoute } from "../src/routes/robots[.]txt";
import { Route as SitemapRoute } from "../src/routes/sitemap[.]xml";
import { sanityClient } from "../src/integrations/sanity/client";
import { absoluteUrl } from "../src/lib/site";
import { serviceIndex } from "../src/lib/service-index";

const get = (route: unknown): Promise<Response> =>
  Promise.resolve(
    (
      route as { options: { server: { handlers: { GET: () => Response | Promise<Response> } } } }
    ).options.server.handlers.GET(),
  );

test("robots endpoint permits public search crawling and advertises the canonical sitemap", async () => {
  const response = await get(RobotsRoute);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type")!, /text\/plain/);
  const body = await response.text();
  assert.match(body, /^User-agent: \*\nAllow: \/\n/m);
  assert.match(body, /Disallow: \/api\//);
  assert.ok(body.includes(`Sitemap: ${absoluteUrl("/sitemap.xml")}`));
  assert.doesNotMatch(body, /^Disallow: \/\s*$/m);
});

test("sitemap endpoint includes services and published CMS URLs without duplicates or fabricated dates", async () => {
  const originalFetch = sanityClient.fetch;
  let query = "";
  sanityClient.fetch = (async (value: string) => {
    query = value;
    return [
      { slug: "a&b", updatedAt: "2026-09-01" },
      { slug: "a&b", updatedAt: "2026-09-01" },
      { slug: "article-without-date" },
    ];
  }) as typeof sanityClient.fetch;
  try {
    const response = await get(SitemapRoute);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type")!, /application\/xml/);
    const xml = await response.text();
    for (const service of serviceIndex)
      assert.ok(xml.includes(`<loc>${absoluteUrl(`/services/${service.slug}`)}</loc>`));
    assert.ok(query.includes("publishedAt <= now()"));
    assert.equal((xml.match(/<loc>/g) || []).length, 14);
    assert.equal((xml.match(/<lastmod>/g) || []).length, 1);
    assert.ok(xml.includes("/blog/a%26b</loc>"));
    assert.doesNotMatch(xml, /<loc>[^<]*\/(?:api|studio)\b/);
  } finally {
    sanityClient.fetch = originalFetch;
  }
});

test("a CMS failure returns a retryable uncached error instead of a misleading partial sitemap", async () => {
  const originalFetch = sanityClient.fetch;
  sanityClient.fetch = async () => {
    throw new Error("CMS unavailable");
  };
  try {
    const response = await get(SitemapRoute);
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("retry-after"), "300");
    assert.doesNotMatch(await response.text(), /<urlset/);
  } finally {
    sanityClient.fetch = originalFetch;
  }
});
