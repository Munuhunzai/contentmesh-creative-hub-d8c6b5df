import { createFileRoute } from "@tanstack/react-router";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  service: z.string().min(1),
  budget: z.string().min(1),
  details: z.string().trim().min(10).max(2000),
  contactEmail: z.string().trim().optional().or(z.literal("")),
  _honey: z.string().max(0, "bot"), // honeypot — must be empty
});

const DEFAULT_TO = "waheed.sul00@gmail.com";
const FROM = "ContentMesh <onboarding@resend.dev>";

async function handlePost({ request }: { request: Request }) {
  try {
    const apiKey =
      process.env.RESEND_API_KEY ||
      process.env.VITE_RESEND_API_KEY ||
      (import.meta as any).env?.RESEND_API_KEY ||
      (import.meta as any).env?.VITE_RESEND_API_KEY;

    if (!apiKey) {
      return Response.json({ error: "Email service is not configured." }, { status: 503 });
    }

    // Parse body — accept both JSON and form-encoded
    let raw: Record<string, unknown> = {};
    const ct = request.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      raw = (await request.json()) as Record<string, unknown>;
    } else {
      const fd = await request.formData();
      fd.forEach((v, k) => {
        raw[k] = v;
      });
    }

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ error: "Invalid form data.", issues: parsed.error.issues }, { status: 400 });
    }

    const { name, email, company, service, budget, details, contactEmail } = parsed.data;

    // Dynamically determine target contact recipient
    const targetContactEmail =
      contactEmail && contactEmail.includes("@")
        ? contactEmail.trim()
        : process.env.CONTACT_EMAIL || process.env.VITE_CONTACT_EMAIL || DEFAULT_TO;

    const toList = Array.from(
      new Set([targetContactEmail, DEFAULT_TO].filter(Boolean))
    );

    const resend = new Resend(apiKey);

    const companyLine = company
      ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Company</td><td style="padding:6px 0;font-size:13px;font-weight:600">${company}</td></tr>`
      : "";

    // ── 1. Notification email HTML ──────────────────────────────────────────
    const notifyHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif">
  <div style="max-width:600px;margin:40px auto;background:#13131a;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)">
    <div style="background:linear-gradient(135deg,#FF5A1F,#0D4C92);padding:32px 40px">
      <p style="margin:0;color:rgba(255,255,255,0.7);font-size:12px;text-transform:uppercase;letter-spacing:0.12em">New Order / Project Enquiry</p>
      <h1 style="margin:8px 0 0;color:#fff;font-size:26px;font-weight:700">Contact Form Submission</h1>
    </div>
    <div style="padding:36px 40px">
      <table style="width:100%;border-collapse:collapse;color:#e5e7eb">
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Name</td><td style="padding:6px 0;font-size:13px;font-weight:600">${name}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Email</td><td style="padding:6px 0;font-size:13px;font-weight:600"><a href="mailto:${email}" style="color:#FF5A1F;text-decoration:none">${email}</a></td></tr>
        ${companyLine}
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Service</td><td style="padding:6px 0;font-size:13px;font-weight:600">${service}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Budget</td><td style="padding:6px 0;font-size:13px;font-weight:600">${budget}</td></tr>
      </table>
      <div style="margin-top:24px;background:#1e1e2e;border-radius:12px;padding:20px;border-left:3px solid #FF5A1F">
        <p style="margin:0 0 8px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.1em">Project Details</p>
        <p style="margin:0;color:#e5e7eb;font-size:14px;line-height:1.7;white-space:pre-wrap">${details}</p>
      </div>
      <div style="margin-top:28px;text-align:center">
        <a href="mailto:${email}?subject=Re: Your ContentMesh enquiry" style="display:inline-block;background:linear-gradient(135deg,#FF5A1F,#e04a14);color:#fff;text-decoration:none;padding:12px 28px;border-radius:999px;font-size:14px;font-weight:600">Reply to ${name}</a>
      </div>
    </div>
    <div style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center">
      <p style="margin:0;color:#4b5563;font-size:12px">ContentMesh Studio · Sent via Resend</p>
    </div>
  </div>
</body>
</html>`;

    // Try sending notification to all target emails first
    let notifyResult = await resend.emails.send({
      from: FROM,
      to: toList,
      replyTo: email,
      subject: `New enquiry from ${name} — ${service}`,
      html: notifyHtml,
    });

    // If Resend fails (e.g. because of unverified domain restriction in onboarding mode), retry sending directly to verified owner email
    if (notifyResult.error) {
      console.warn("Primary email dispatch warning, retrying fallback:", notifyResult.error);
      notifyResult = await resend.emails.send({
        from: FROM,
        to: [DEFAULT_TO],
        replyTo: email,
        subject: `New enquiry from ${name} — ${service}`,
        html: notifyHtml,
      });
    }

    // Try sending auto-reply to submitter (silently catch if Resend is in onboarding mode)
    try {
      const autoReplyHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif">
  <div style="max-width:600px;margin:40px auto;background:#13131a;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)">
    <div style="background:linear-gradient(135deg,#FF5A1F,#0D4C92);padding:32px 40px">
      <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700">We got your message ✦</h1>
    </div>
    <div style="padding:36px 40px;color:#e5e7eb">
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7">Hey <strong>${name}</strong>,</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7">Thanks for reaching out to <strong>ContentMesh</strong>. We've received your enquiry about <strong>${service}</strong> and will get back to you within one business day.</p>
      <p style="margin:0 0 32px;font-size:15px;line-height:1.7">In the meantime, feel free to browse our work or explore our services.</p>
      <div style="text-align:center">
        <a href="https://contentmesh.ai/portfolio" style="display:inline-block;background:linear-gradient(135deg,#FF5A1F,#e04a14);color:#fff;text-decoration:none;padding:12px 28px;border-radius:999px;font-size:14px;font-weight:600">View Our Work</a>
      </div>
    </div>
    <div style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center">
      <p style="margin:0;color:#4b5563;font-size:12px">ContentMesh Studio — AI-Powered Creative Production</p>
    </div>
  </div>
</body>
</html>`;

      await resend.emails.send({
        from: FROM,
        to: [email],
        subject: "We received your message — ContentMesh",
        html: autoReplyHtml,
      });
    } catch {
      /* ignore auto-reply errors in onboarding mode */
    }

    if (notifyResult.error) {
      console.error("Resend final notify error:", notifyResult.error);
      return Response.json({ error: "Failed to send email. Please check configuration." }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Contact handler error:", err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: handlePost,
    },
  },
});
