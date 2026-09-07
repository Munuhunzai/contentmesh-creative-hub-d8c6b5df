import { createFileRoute } from "@tanstack/react-router";
import { Resend } from "resend";
import { contactSchema, escapeHtml } from "@/lib/contact-schema";
import { guardRequest, readJson, requestErrorResponse } from "@/lib/request-guard";
import { CONTACT_EMAIL } from "@/lib/site";

async function handlePost({ request }: { request: Request }) {
  try {
    guardRequest(request, 5);
    const parsed = contactSchema.safeParse(await readJson(request, 16_384));
    if (!parsed.success)
      return Response.json(
        { error: "Please check the highlighted form fields.", issues: parsed.error.issues },
        { status: 400 },
      );
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey)
      return Response.json(
        {
          error:
            "The enquiry form is temporarily unavailable. Please use the email link beside the form.",
        },
        { status: 503 },
      );
    const { name, email, company, service, budget, details } = parsed.data;
    // The recipient is server-controlled. Browser-supplied recipient fields are ignored.
    const to = process.env.CONTACT_EMAIL || CONTACT_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL || "ContentMesh <onboarding@resend.dev>";
    const text = `Name: ${name}\nEmail: ${email}\nCompany: ${company || "Not specified"}\nService: ${service}\nBudget: ${budget}\n\n${details}`;
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Project enquiry: ${service}`,
      text,
      html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#142c43"><h1 style="color:#0e447f">New ContentMesh project enquiry</h1><pre style="font-family:inherit;white-space:pre-wrap;line-height:1.7">${escapeHtml(text)}</pre></div>`,
    });
    if (error) {
      console.error("Contact delivery failed:", error.name);
      return Response.json(
        {
          error:
            "Your enquiry could not be delivered. Your details are still here; please retry or email us directly.",
        },
        { status: 502 },
      );
    }
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const response = requestErrorResponse(error);
    if (response) return response;
    console.error("Contact delivery unavailable");
    return Response.json(
      { error: "Your enquiry could not be sent. Please try again or email us directly." },
      { status: 500 },
    );
  }
}
export const Route = createFileRoute("/api/contact")({
  server: { handlers: { POST: handlePost } },
});
