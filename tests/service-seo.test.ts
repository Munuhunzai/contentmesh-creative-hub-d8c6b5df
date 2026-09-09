import test from "node:test";
import assert from "node:assert/strict";
import { serviceIndex } from "../src/lib/service-index";
import { getServicePage, servicePages } from "../src/lib/service-pages";
import { absoluteUrl, breadcrumbs, seoHead } from "../src/lib/site";

test("every discoverable service resolves to substantive, unique content", () => {
  assert.equal(new Set(servicePages.map((page) => page.slug)).size, servicePages.length);
  assert.deepEqual(
    serviceIndex.map((page) => page.slug),
    servicePages.map((page) => page.slug),
  );
  for (const entry of serviceIndex) {
    const page = getServicePage(entry.slug)!;
    assert.equal(page.title, entry.title);
    assert.ok(page.sections.length >= 3);
    assert.ok(page.questions.length >= 3);
  }
  assert.equal(getServicePage("missing-service"), undefined);
});

test("canonical, social URL and breadcrumb destinations use the same configured origin", () => {
  const path = "/services/ai-product-video-ads";
  const head = seoHead("Product ads", "Description", path);
  const trail = breadcrumbs([
    { name: "Home", path: "/" },
    { name: "Product ads", path },
  ]);
  assert.equal(head.links[0].href, absoluteUrl(path));
  assert.equal(
    head.meta.find((meta) => "property" in meta && meta.property === "og:url")?.content,
    absoluteUrl(path),
  );
  assert.equal(trail.itemListElement[1].item, absoluteUrl(path));
  assert.equal(trail.itemListElement[1].position, 2);
  assert.equal(new URL(absoluteUrl(path)).search, "");
});
