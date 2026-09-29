import { createFileRoute } from "@tanstack/react-router";
import { Resend } from "resend";

const INBOX = "munu.hunzai092@gmail.com";
const BUSINESS_ADDRESS = "info@contentmeshai.com";

async function handlePost({ request }: { request: Request }) {
  const apiKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

  if (!apiKey || !webhookSecret) {
    console.error("Inbound email forwarding is missing server configuration");
    return Response.json({ error: "Webhook is not configured" }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  let event: ReturnType<typeof resend.webhooks.verify>;

  try {
    event = resend.webhooks.verify({
      payload: await request.text(),
      headers: {
        id: request.headers.get("svix-id") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
      },
      webhookSecret,
    });
  } catch {
    return Response.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type !== "email.received") return Response.json({ ok: true });

  const recipients = event.data.to.map((address) => address.toLowerCase());
  if (!recipients.includes(BUSINESS_ADDRESS)) return Response.json({ ok: true });

  const { error } = await resend.emails.receiving.forward({
    emailId: event.data.email_id,
    to: INBOX,
    from: `ContentMesh <${BUSINESS_ADDRESS}>`,
  });

  if (error) {
    console.error("Inbound email forwarding failed:", error.name);
    return Response.json({ error: "Email forwarding failed" }, { status: 502 });
  }

  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

export const Route = createFileRoute("/api/resend-inbound")({
  server: { handlers: { POST: handlePost } },
});
