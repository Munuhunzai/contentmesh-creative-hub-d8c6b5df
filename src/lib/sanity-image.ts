/**
 * Optimizes image URLs from Sanity CDN, Unsplash, Google Drive, and external hosts
 * by converting high-res uploaded files into lightweight WebP/AVIF images.
 */
export function optimizeSanityImage(
  url: string | null | undefined,
  width = 800,
  quality = 75,
): string {
  if (!url) return "";

  // 1. Sanity CDN images
  if (url.includes("cdn.sanity.io")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}auto=format&w=${width}&q=${quality}`;
  }

  // 2. Unsplash images
  if (url.includes("images.unsplash.com")) {
    const baseUrl = url.split("?")[0];
    return `${baseUrl}?auto=format&fit=crop&w=${width}&q=${quality}`;
  }

  // 3. Google Drive / Google User Content thumbnails
  if (url.includes("googleusercontent.com") || url.includes("drive.google.com")) {
    const fileIdMatch =
      url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      url.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
      url.match(/\/d\/([a-zA-Z0-9_-]+)/);

    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}=w${width}-rw`;
    }
  }

  return url;
}
