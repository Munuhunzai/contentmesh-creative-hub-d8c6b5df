const windows = new Map<string, { count: number; reset: number }>();
export class RequestError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

/** In-process burst protection; configure distributed edge limits for multi-instance production. */
export function guardRequest(request: Request, limit = 12, now = Date.now()) {
  const origin = request.headers.get("origin");
  if (
    (origin && origin !== new URL(request.url).origin) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    throw new RequestError("This request must come from our website.", 403);
  }
  const ip = request.headers.get("cf-connecting-ip") || "shared";
  const key = `${new URL(request.url).pathname}:${ip}`;
  for (const [key, value] of windows) if (value.reset <= now) windows.delete(key);
  const entry = windows.get(key) || { count: 0, reset: now + 60_000 };
  if (entry.count >= limit || (!windows.has(key) && windows.size >= 2000)) {
    throw new RequestError("Too many requests. Please try again in a minute.", 429);
  }
  entry.count++;
  windows.set(key, entry);
}

export async function readJson(request: Request, maxBytes = 32_768): Promise<unknown> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    throw new RequestError("Please send JSON data.", 415);
  }
  if (Number(request.headers.get("content-length")) > maxBytes)
    throw new RequestError("Request is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError("Request body is missing.", 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > maxBytes) {
        await reader.cancel();
        throw new RequestError("Request is too large.", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new RequestError("Request contains invalid JSON.", 400);
  }
}

export function requestErrorResponse(error: unknown) {
  if (!(error instanceof RequestError)) return null;
  return Response.json(
    { error: error.message },
    {
      status: error.status,
      headers: {
        "Cache-Control": "no-store",
        ...(error.status === 429 ? { "Retry-After": "60" } : {}),
      },
    },
  );
}
