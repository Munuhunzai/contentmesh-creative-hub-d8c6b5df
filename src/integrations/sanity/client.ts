export const SANITY_PROJECT_ID =
  (import.meta.env?.VITE_SANITY_PROJECT_ID as string | undefined) ?? "ru6ynu80";
export const SANITY_DATASET =
  (import.meta.env?.VITE_SANITY_DATASET as string | undefined) ?? "production";
export const SANITY_API_VERSION = "2024-10-01";

// Public pages only read published content. Use the query HTTP API without
// shipping the editing/realtime SDK to every visitor. Studio keeps its own SDK.
export const sanityClient = {
  async fetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
    const url = new URL(
      `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`,
    );
    url.searchParams.set("query", query);
    url.searchParams.set("perspective", "published");
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(`$${key}`, JSON.stringify(value));
    }
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`Content request failed (${response.status})`);
    const payload = (await response.json()) as { result?: T; error?: unknown };
    if (payload.error || !Object.prototype.hasOwnProperty.call(payload, "result")) {
      throw new Error("Content response is invalid");
    }
    return payload.result as T;
  },
};
