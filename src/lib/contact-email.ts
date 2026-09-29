import { escapeHtml } from "@/lib/contact-schema";

const SITE_URL = "https://contentmeshai.com";
const LOGO_URL = `${SITE_URL}/Content_mesh_AI_video_production_agency.png`;

export function contactAcknowledgementEmail(name: string, service: string) {
  const safeName = escapeHtml(name);
  const safeService = escapeHtml(service);

  return {
    subject: "Thanks for reaching out to ContentMesh",
    text: `Hi ${name},\n\nThanks for contacting ContentMesh Studios. We’ve received your enquiry about ${service}. Our team will review your brief and get back to you soon.\n\nIf you’d like to add anything, reply to this email.\n\nContentMesh Studios\nhttps://contentmeshai.com`,
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>Thanks for contacting ContentMesh</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f3f6fa;font-family:Arial,Helvetica,sans-serif;color:#18334d;-webkit-text-size-adjust:100%;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">We’ve received your project enquiry and our team will be in touch soon.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f3f6fa;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;">
            <tr>
              <td style="height:6px;background-color:#ff5a1f;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td align="center" style="padding:30px 32px 20px;">
                <a href="${SITE_URL}" style="text-decoration:none;">
                  <img src="${LOGO_URL}" width="132" alt="ContentMesh Studios" style="display:block;width:132px;max-width:100%;height:auto;border:0;">
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 40px 40px;">
                <p style="margin:0 0 12px;color:#ff5a1f;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Enquiry received</p>
                <h1 style="margin:0 0 20px;color:#0d3f72;font-size:30px;line-height:1.2;font-weight:700;">Thanks for reaching out.</h1>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.65;">Hi ${safeName},</p>
                <p style="margin:0 0 20px;font-size:16px;line-height:1.65;">Thanks for contacting ContentMesh Studios. We’ve received your enquiry about <strong>${safeService}</strong>. Our team will review your brief and get back to you soon.</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:26px 0;background-color:#f3f6fa;border-left:4px solid #ff5a1f;border-radius:8px;">
                  <tr>
                    <td style="padding:16px 18px;font-size:14px;line-height:1.6;color:#43566a;">Want to add a detail or reference? Just reply to this email and it will reach our team.</td>
                  </tr>
                </table>
                <p style="margin:0;font-size:16px;line-height:1.65;">Talk soon,<br><strong style="color:#0d3f72;">ContentMesh Studios</strong></p>
                <p style="margin:28px 0 0;font-size:14px;line-height:1.6;"><a href="${SITE_URL}" style="color:#0d4c92;text-decoration:underline;">contentmeshai.com</a></p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 32px;background-color:#0d3f72;color:#d9e5f1;font-size:12px;line-height:1.6;">ContentMesh Studios · Human-directed AI video production</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}
