import test from "node:test";
import assert from "node:assert/strict";
import { sanityClient } from "../src/integrations/sanity/client";

test("public CMS queries preserve published perspective and safely encode parameters", async (t) => {
  t.mock.method(globalThis, "fetch", async (input: URL, init: RequestInit) => {
    assert.equal(input.hostname, "ru6ynu80.apicdn.sanity.io");
    assert.equal(input.searchParams.get("perspective"), "published");
    assert.equal(input.searchParams.get("$slug"), JSON.stringify("hello&perspective=drafts"));
    assert.ok(init.signal instanceof AbortSignal);
    return Response.json({ result: { title: "Published article" } });
  });
  assert.deepEqual(
    await sanityClient.fetch("*[_type == 'blogPost' && slug.current == $slug][0]", {
      slug: "hello&perspective=drafts",
    }),
    { title: "Published article" },
  );
});

test("missing CMS documents stay null and failed responses reject", async (t) => {
  const request = t.mock.method(globalThis, "fetch", async () => Response.json({ result: null }));
  assert.equal(await sanityClient.fetch("*[0]"), null);
  request.mock.mockImplementation(async () => new Response("Unavailable", { status: 503 }));
  await assert.rejects(sanityClient.fetch("*[0]"), /503/);
  request.mock.mockImplementation(async () => Response.json({ error: "Invalid query" }));
  await assert.rejects(sanityClient.fetch("*[0]"), /invalid/);
});
