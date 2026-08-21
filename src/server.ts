import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy":
    "default-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: blob:; style-src 'self' 'unsafe-inline' https:; font-src 'self' https: data:; img-src 'self' data: blob: https:; media-src 'self' https: blob:; connect-src 'self' https: wss: blob:; frame-src 'self' https:; frame-ancestors 'self' https://*.sanity.io https://*.sanity.studio;",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function attachSecurityHeaders(response: Response): Response {
  const newHeaders = new Headers(response.headers);
  for (const [key, val] of Object.entries(SECURITY_HEADERS)) {
    if (!newHeaders.has(key)) {
      newHeaders.set(key, val);
    }
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const rawResponse = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(rawResponse);
      return attachSecurityHeaders(normalized);
    } catch (error) {
      console.error(error);
      const errResponse = new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
      return attachSecurityHeaders(errResponse);
    }
  },
};
