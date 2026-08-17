/**
 * Appends auto=format&w={width}&q={quality} to Sanity image CDN URLs
 * to convert high-res uploaded PNGs/JPEGs into lightweight WebP/AVIF images.
 */
export function optimizeSanityImage(url: string | null | undefined, width = 1200, quality = 80): string {
  if (!url) return "";
  if (!url.includes("cdn.sanity.io")) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}auto=format&w=${width}&q=${quality}`;
}
