import { useQuery } from "@tanstack/react-query";
import { sanityClient } from "./client";

/**
 * Fetches a GROQ query and returns the data with a fallback when empty/missing.
 * Never suspends — safe to use anywhere; components stay renderable before
 * Sanity content is seeded.
 */
export function useSanity<T>(
  queryKey: readonly unknown[],
  query: string,
  fallback: T,
  params?: Record<string, unknown>,
): T {
  const { data } = useQuery<T>({
    queryKey,
    queryFn: async () => {
      try {
        const result = await sanityClient.fetch<T>(query, params ?? {});
        return result;
      } catch {
        return fallback;
      }
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: false,
    placeholderData: fallback as never,
  });

  const isEmpty =
    data == null ||
    (Array.isArray(data) && data.length === 0) ||
    (typeof data === "object" && !Array.isArray(data) && Object.keys(data as object).length === 0);

  return isEmpty ? fallback : (data as T);
}
