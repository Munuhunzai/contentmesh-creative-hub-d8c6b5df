import { test } from "node:test";
import assert from "node:assert/strict";
import { analyticsAllowed, storedAnalyticsChoice } from "../src/lib/analytics-policy";

test("analytics requires affirmative consent on the production public site", () => {
  for (const choice of [null, "rejected", "yes"])
    assert.equal(analyticsAllowed("contentmeshai.com", "/", choice), false);
  assert.equal(analyticsAllowed("contentmeshai.com", "/portfolio", "accepted"), true);
  assert.equal(analyticsAllowed("preview.vercel.app", "/", "accepted"), false);
  for (const path of [
    "/studio",
    "/studio/desk",
    "/api/contact",
    "/tools/storyboard-generator",
    "/auth/callback",
  ]) {
    assert.equal(analyticsAllowed("contentmeshai.com", path, "accepted"), false);
  }
});
test("invalid, expired and future consent defaults to no tracking", () => {
  const now = 180 * 86400000;
  for (const raw of [
    null,
    "broken",
    "{}",
    JSON.stringify({ value: "accepted", at: 0 }),
    JSON.stringify({ value: "accepted", at: now + 1 }),
  ])
    assert.equal(storedAnalyticsChoice(raw, now), null);
  assert.equal(
    storedAnalyticsChoice(JSON.stringify({ value: "accepted", at: now - 1 }), now),
    "accepted",
  );
  assert.equal(
    storedAnalyticsChoice(JSON.stringify({ value: "rejected", at: now - 1 }), now),
    "rejected",
  );
});
