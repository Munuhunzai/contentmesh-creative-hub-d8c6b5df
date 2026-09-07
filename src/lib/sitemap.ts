export function escapeXml(value: string) {
  return value.replace(
    /[<>&"']/g,
    (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]!,
  );
}
export function buildSitemap(entries: Array<{ url: string; updatedAt?: string }>) {
  const seen = new Set<string>();
  const urls = entries
    .filter((entry) => !seen.has(entry.url) && seen.add(entry.url))
    .map((entry) => {
      const date = entry.updatedAt ? new Date(entry.updatedAt) : null;
      const lastmod =
        date && Number.isFinite(date.getTime()) ? `<lastmod>${date.toISOString()}</lastmod>` : "";
      return `<url><loc>${escapeXml(entry.url)}</loc>${lastmod}</url>`;
    });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("\n")}</urlset>`;
}
