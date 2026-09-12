import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
} from "@tanstack/react-router";
import { SanitySnapshot } from "../src/integrations/sanity/snapshot";
import { Hero } from "../src/components/home/Hero";
import { Services, ServiceDescription } from "../src/components/home/Services";
import { Portfolio } from "../src/components/home/Portfolio";
import { Stats } from "../src/components/home/Stats";
import { Testimonials } from "../src/components/home/Testimonials";

async function render(data: Record<string, unknown>, compact = false) {
  const client = new QueryClient();
  const route = createRootRoute({
    component: () =>
      React.createElement(
        React.Fragment,
        null,
        React.createElement(Hero),
        React.createElement(Services, { compact }),
        React.createElement(Portfolio, { featuredOnly: compact }),
        React.createElement(Stats),
        React.createElement(Testimonials),
      ),
  });
  const router = createRouter({
    routeTree: route,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  await router.load();
  const html = renderToString(
    React.createElement(
      QueryClientProvider,
      { client },
      React.createElement(
        SanitySnapshot,
        { data },
        React.createElement(RouterProvider, { router }),
      ),
    ),
  );
  client.clear();
  return html;
}

test("published CMS content appears in server HTML before browser JavaScript", async () => {
  const html = await render({
    homepage: {
      heroDescription: "CMS production description",
      stats: [{ value: 24, label: "Published projects" }],
    },
    services: [
      {
        _id: "cms-service",
        title: "Custom production service",
        shortDescription: "CMS service details",
      },
    ],
    testimonials: [
      { _id: "review", authorName: "Published customer", quote: "Published customer feedback" },
    ],
  });
  for (const text of [
    "CMS production description",
    "Custom production service",
    "CMS service details",
    "Published projects",
    "Published customer feedback",
  ])
    assert.ok(html.includes(text), text);
  assert.equal((html.match(/<h1/g) || []).length, 1);
});
test("empty CMS state contains no invented client proof or duplicate service copies", async () => {
  const html = await render({});
  for (const text of ["Emily Jeff", "TheWebagency", "Client Satisfaction", "250+"])
    assert.ok(!html.includes(text), text);
  assert.equal((html.match(/role="tab"/g) || []).length, 12);
});

test("the full portfolio shows non-featured projects and never invents review ratings", async () => {
  const html = await render({
    portfolio: [
      { _id: "a", title: "Featured film", featured: true, category: "Films" },
      { _id: "b", title: "A second real project", featured: false, category: "Reels" },
    ],
    testimonials: [
      { _id: "r", authorName: "Actual reviewer", quote: "Real feedback without a rating" },
    ],
  });
  assert.ok(html.includes("Featured film"));
  assert.ok(html.includes("A second real project"));
  assert.ok(html.includes("All work"));
  assert.ok(!html.includes("Rated 5"));
  assert.ok(!html.includes("Go to review slide"));
});

test("homepage curation limits the work and service catalogue without dropping full-page content", async () => {
  const data = {
    portfolio: Array.from({ length: 6 }, (_, i) => ({
      _id: `p${i}`,
      title: `Published film ${i}`,
      featured: true,
    })),
  };
  const compact = await render(data, true);
  const full = await render(data);
  assert.equal((compact.match(/View project:/g) || []).length, 4);
  assert.equal((full.match(/View project:/g) || []).length, 6);
  assert.equal((compact.match(/role="tab"/g) || []).length, 3);
  assert.equal((full.match(/role="tab"/g) || []).length, 12);
});

test("service descriptions render Sanity blocks instead of invalid React children", () => {
  const html = renderToString(
    React.createElement(ServiceDescription, {
      value: [
        {
          _type: "block",
          _key: "b",
          style: "normal",
          markDefs: [],
          children: [
            { _type: "span", _key: "s", text: "A detailed production approach", marks: [] },
          ],
        },
      ],
    }),
  );
  assert.ok(html.includes("A detailed production approach"));
});

test("large portfolio collections render an initial page with access to more projects", async () => {
  const html = await render({
    portfolio: Array.from({ length: 30 }, (_, i) => ({ _id: `large${i}`, title: `Film ${i}` })),
  });
  assert.equal((html.match(/View project:/g) || []).length, 12);
  assert.ok(html.includes("Load more projects"));
});

test("unfinished CMS service descriptions use a useful enquiry fallback", () => {
  const html = renderToString(React.createElement(ServiceDescription, { value: "epwnofpewoco" }));
  assert.ok(!html.includes("epwnofpewoco"));
  assert.ok(html.includes("Discuss the creative direction"));
});
