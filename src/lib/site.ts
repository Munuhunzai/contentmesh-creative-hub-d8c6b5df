// Use the connected production origin until the custom domain is live.
// Set VITE_SITE_URL and rebuild when migrating; never derive canonicals from a preview host.
export const SITE_URL = new URL(
  import.meta.env?.VITE_SITE_URL || "https://contentmesh-creative-hub-d8c6b5df.vercel.app",
).origin;
export const SITE_NAME = "ContentMesh Studios";
export const CONTACT_EMAIL = "waheed.sul00@gmail.com";
export const SOCIAL_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/ffeef70c-e0bc-41b3-b08a-31faed939538";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).href;
}

export function seoHead(
  title: string,
  description: string,
  path: string,
  image = SOCIAL_IMAGE,
  type = "website",
) {
  const url = absoluteUrl(path);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: type },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function breadcrumbs(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function whatsappUrl(value?: string) {
  const number = value?.replace(/[^0-9]/g, "");
  return number && /^[1-9][0-9]{7,14}$/.test(number) && number !== "923000000000"
    ? `https://wa.me/${number}`
    : null;
}
