import test from "node:test";
import assert from "node:assert/strict";
import { Route as ContactRoute } from "../src/routes/api/contact";
import { Route as ChatRoute } from "../src/routes/api/chat";
import { Route as StoryboardRoute } from "../src/routes/api/generate-storyboard";
import { Route as ModifyRoute } from "../src/routes/api/assistant-modify";
const post = (route: unknown, path: string, body: unknown, token?: string): Promise<Response> =>
  (
    route as {
      options: {
        server: { handlers: { POST: (input: { request: Request }) => Promise<Response> } };
      };
    }
  ).options.server.handlers.POST({
    request: new Request(`https://contentmeshstudios.com${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "https://contentmeshstudios.com",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    }),
  });
test("contact validation and delivery failures never return a false success", async () => {
  const saved = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  try {
    assert.equal((await post(ContactRoute, "/api/contact", {})).status, 400);
    const response = await post(ContactRoute, "/api/contact", {
      name: "Sample Client",
      email: "client@example.test",
      service: "AI Video Production",
      budget: "Help me estimate",
      details: "A short product film for a launch.",
      _honey: "",
    });
    assert.equal(response.status, 503);
    assert.ok(!(await response.json()).ok);
  } finally {
    if (saved) process.env.RESEND_API_KEY = saved;
  }
});
test("contact delivery uses the verified ContentMesh sender by default", async () => {
  const savedKey = process.env.RESEND_API_KEY;
  const savedFrom = process.env.CONTACT_FROM_EMAIL;
  const savedFetch = globalThis.fetch;
  const sentEmails: Record<string, unknown>[] = [];
  process.env.RESEND_API_KEY = "re_test_key";
  delete process.env.CONTACT_FROM_EMAIL;
  globalThis.fetch = async (_input, init) => {
    sentEmails.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
    return Response.json({ id: "email_test_id" });
  };
  try {
    const response = await post(ContactRoute, "/api/contact", {
      name: "Sample Client",
      email: "client@example.test",
      service: "AI Video Production",
      budget: "Help me estimate",
      details: "A short product film for a launch.",
      _honey: "",
    });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).ok, true);
    assert.equal(sentEmails.length, 2);
    assert.equal(sentEmails[0].from, "ContentMesh <info@contentmeshai.com>");
    assert.equal(sentEmails[1].from, "ContentMesh <info@contentmeshai.com>");
    assert.deepEqual(sentEmails[1].to, ["client@example.test"]);
    assert.equal(sentEmails[1].subject, "Thanks for reaching out to ContentMesh");
    assert.match(String(sentEmails[1].html), /Content_mesh_AI_video_production_agency\.png/);
    assert.match(String(sentEmails[1].html), /Hi Sample Client/);
    assert.match(
      String(sentEmails[1].text),
      /We’ve received your enquiry about AI Video Production/,
    );
  } finally {
    globalThis.fetch = savedFetch;
    if (savedKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = savedKey;
    if (savedFrom === undefined) delete process.env.CONTACT_FROM_EMAIL;
    else process.env.CONTACT_FROM_EMAIL = savedFrom;
  }
});
test("a failed customer acknowledgement does not lose an enquiry already delivered to the studio", async () => {
  const savedKey = process.env.RESEND_API_KEY;
  const savedFrom = process.env.CONTACT_FROM_EMAIL;
  const savedFetch = globalThis.fetch;
  let sendCount = 0;
  process.env.RESEND_API_KEY = "re_test_key";
  delete process.env.CONTACT_FROM_EMAIL;
  globalThis.fetch = async () => {
    sendCount += 1;
    if (sendCount === 2) throw new Error("Mock acknowledgement network failure");
    return Response.json({ id: "internal_email_test_id" });
  };
  try {
    const response = await post(ContactRoute, "/api/contact", {
      name: "Sample Client",
      email: "client@example.test",
      service: "AI Video Production",
      budget: "Help me estimate",
      details: "A short product film for a launch.",
      _honey: "",
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, acknowledgementSent: false });
    assert.equal(sendCount, 2);
  } finally {
    globalThis.fetch = savedFetch;
    if (savedKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = savedKey;
    if (savedFrom === undefined) delete process.env.CONTACT_FROM_EMAIL;
    else process.env.CONTACT_FROM_EMAIL = savedFrom;
  }
});
test("AI routes validate authenticated requests without calling an AI provider", async () => {
  const keys = [
    "DEEPSEEK_API_KEY",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
  ] as const;
  const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  const savedFetch = globalThis.fetch;
  let authCalls = 0;
  for (const key of keys) delete process.env[key];
  globalThis.fetch = async (input) => {
    assert.equal(String(input), "https://accounts.example.test/auth/v1/user");
    authCalls++;
    return Response.json({ id: "test-user", email_confirmed_at: "2026-09-01T00:00:00Z" });
  };
  try {
    const chat = await post(ChatRoute, "/api/chat", {
      messages: [{ role: "user", content: "What is the price?" }],
    });
    assert.equal(chat.status, 200);
    assert.match((await chat.json()).reply, /quoted/);
    const valid = { script: "A short story with a clear scene.", numberOfScenes: 3 };
    assert.equal((await post(StoryboardRoute, "/api/generate-storyboard", valid)).status, 503);
    assert.equal(authCalls, 0);
    process.env.SUPABASE_URL = "https://accounts.example.test";
    process.env.SUPABASE_ANON_KEY = "test-public-key";
    assert.equal((await post(StoryboardRoute, "/api/generate-storyboard", valid)).status, 401);
    assert.equal(authCalls, 0);
    assert.equal(
      (await post(StoryboardRoute, "/api/generate-storyboard", valid, "test-token")).status,
      503,
    );
    assert.equal(
      (
        await post(
          StoryboardRoute,
          "/api/generate-storyboard",
          { script: {}, numberOfScenes: "many" },
          "test-token",
        )
      ).status,
      400,
    );
    assert.equal(
      (await post(ModifyRoute, "/api/assistant-modify", { userQuery: 123 }, "test-token")).status,
      400,
    );
    assert.equal(authCalls, 3);
  } finally {
    globalThis.fetch = savedFetch;
    for (const key of keys) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
});
