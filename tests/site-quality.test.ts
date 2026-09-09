import test from "node:test";
import assert from "node:assert/strict";
import { contactSchema, escapeHtml } from "../src/lib/contact-schema";
import { buildSitemap } from "../src/lib/sitemap";
import { seoHead, jsonLd, whatsappUrl, SITE_URL } from "../src/lib/site";
import { guardRequest, readJson, RequestError } from "../src/lib/request-guard";
const valid = {
  name: "Sample Client",
  email: "client@example.test",
  service: "AI Video Production",
  budget: "Help me estimate",
  details: "A short product film for a launch.",
  _honey: "",
};
test("visitors cannot override the enquiry recipient", () => {
  const data = contactSchema.parse({
    ...valid,
    contactEmail: "other@example.test",
    to: "other@example.test",
  });
  assert.ok(!("contactEmail" in data));
  assert.ok(!("to" in data));
});
test("form rejects bots, invalid choices, and oversized fields", () => {
  for (const mutation of [
    { _honey: "bot" },
    { service: "anything" },
    { details: "a".repeat(2001) },
    { email: "invalid" },
    { name: " " },
  ])
    assert.equal(contactSchema.safeParse({ ...valid, ...mutation }).success, false);
});
test("untrusted text cannot break out of email HTML or JSON-LD", () => {
  assert.equal(escapeHtml('<script>"&'), "&lt;script&gt;&quot;&amp;");
  const payload = { headline: "</script><script>alert(1)</script>" };
  assert.ok(!jsonLd(payload).includes("</script>"));
  assert.deepEqual(JSON.parse(jsonLd(payload)), payload);
});
test("canonical and social metadata agree on the confirmed domain", () => {
  const head = seoHead("Production", "Description", "/services");
  assert.equal(head.links[0].href, `${SITE_URL}/services`);
  assert.equal(head.meta.find((m) => m.property === "og:url")?.content, head.links[0].href);
  assert.equal(head.meta.find((m) => m.name === "twitter:title")?.content, "Production");
});
test("sitemap escapes XML, deduplicates URLs and omits invalid dates", () => {
  const xml = buildSitemap([
    { url: "https://contentmeshstudios.com/blog/a?x=1&y=2", updatedAt: "2026-09-06" },
    { url: "https://contentmeshstudios.com/blog/a?x=1&y=2" },
    { url: "https://contentmeshstudios.com/", updatedAt: "invalid" },
  ]);
  assert.equal((xml.match(/<url>/g) || []).length, 2);
  assert.ok(xml.includes("&amp;y=2"));
  assert.ok(xml.includes("<lastmod>2026-09-06T00:00:00.000Z</lastmod>"));
  assert.equal((xml.match(/<lastmod>/g) || []).length, 1);
});
test("placeholder WhatsApp numbers do not produce broken links", () => {
  assert.equal(whatsappUrl("923000000000"), null);
  assert.equal(whatsappUrl(undefined), null);
  assert.equal(whatsappUrl("+92 312 3456789"), "https://wa.me/923123456789");
});
test("request guard rejects cross-origin requests and expires limits", () => {
  assert.throws(
    () =>
      guardRequest(
        new Request("https://contentmeshstudios.com/api/test", {
          headers: { origin: "https://elsewhere.test" },
        }),
      ),
    (e: unknown) => e instanceof RequestError && e.status === 403,
  );
  const req = new Request("https://contentmeshstudios.com/api/test-limit");
  guardRequest(req, 2, 100);
  guardRequest(req, 2, 100);
  assert.throws(
    () => guardRequest(req, 2, 101),
    (e: unknown) => e instanceof RequestError && e.status === 429,
  );
  assert.doesNotThrow(() => guardRequest(req, 2, 60101));
});
test("bounded JSON reader rejects malformed and oversized bodies", async () => {
  const req = (body: string) =>
    new Request("https://contentmeshstudios.com/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
  assert.deepEqual(await readJson(req('{"ok":true}')), { ok: true });
  await assert.rejects(
    readJson(req("{")),
    (e: unknown) => e instanceof RequestError && e.status === 400,
  );
  await assert.rejects(
    readJson(req(JSON.stringify("x".repeat(50))), 20),
    (e: unknown) => e instanceof RequestError && e.status === 413,
  );
});
