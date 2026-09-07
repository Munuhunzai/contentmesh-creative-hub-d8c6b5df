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
import { Services } from "../src/components/home/Services";
import { Stats } from "../src/components/home/Stats";
import { Testimonials } from "../src/components/home/Testimonials";

async function render(data: Record<string, unknown>) {
  const client = new QueryClient();
  const route = createRootRoute({
    component: () =>
      React.createElement(
        React.Fragment,
        null,
        React.createElement(Hero),
        React.createElement(Services),
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
  assert.equal((html.match(/Explore service/g) || []).length, 12);
});
