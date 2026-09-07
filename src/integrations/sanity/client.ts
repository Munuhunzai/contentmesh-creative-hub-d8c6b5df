import { createClient } from "@sanity/client";

export const SANITY_PROJECT_ID =
  (import.meta.env?.VITE_SANITY_PROJECT_ID as string | undefined) ?? "ru6ynu80";
export const SANITY_DATASET =
  (import.meta.env?.VITE_SANITY_DATASET as string | undefined) ?? "production";
export const SANITY_API_VERSION = "2024-10-01";

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true,
  timeout: 5000,
  maxRetries: 0,
  perspective: "published",
});
