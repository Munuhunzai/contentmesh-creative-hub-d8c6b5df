import { getPortfolioNotes } from "./portfolio-notes";

// Stable editorial selection: changing the homepage's featured flag must not remove a URL.
export const portfolioPages = [
  {
    slug: "men-shoes-ai-animation-3d-realistic",
    title: "Men's Footwear AI Video Concept",
    serviceSlug: "ai-product-video-ads",
    serviceLabel: "AI product video ads",
  },
  {
    slug: "ai-2d-animation-3d-kids-animation-realistic",
    title: "AI Anime Animation for Sami Uddin",
    serviceSlug: "ai-youtube-video-production",
    serviceLabel: "YouTube video production",
  },
  {
    slug: "zara-3d-2d-animation-ai-realistic",
    title: "Zara-Inspired AI Fashion Concept",
    serviceSlug: "ai-commercial-video-production",
    serviceLabel: "AI commercial video production",
  },
  {
    slug: "nike-3d-2d-animation-ai-realistic",
    title: "Nike-Inspired AI Product Video Concept",
    serviceSlug: "ai-product-video-ads",
    serviceLabel: "AI product video ads",
  },
] as const;

export function getPortfolioPage(slug?: string) {
  return portfolioPages.find((page) => page.slug === slug);
}

export function portfolioPageDescription(slug: string) {
  return (
    getPortfolioNotes(slug)?.summary || "Explore selected video work from ContentMesh Studios."
  );
}

export type PortfolioProject = {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  category?: string;
  client?: string;
  projectType?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  videoFileUrl?: string;
  brief?: string;
  approach?: string;
  deliverables?: string[];
  outcome?: string;
};

export const portfolioPageQuery = `*[_type == "portfolioItem" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, category, client, description, projectType,
  brief, approach, deliverables, outcome, "thumbnailUrl": thumbnail.asset->url,
  videoUrl, "videoFileUrl": videoFile.asset->url
}`;

// Only embed supported hosts. A CMS URL must not become an arbitrary frame source.
export function portfolioEmbedUrl(value?: string): string | undefined {
  if (!value) return;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return;
    if (["youtube.com", "www.youtube.com", "youtu.be"].includes(url.hostname)) {
      const id = url.hostname === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v");
      if (id && /^[\w-]{11}$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}`;
    }
    if (["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(url.hostname)) {
      const id = url.pathname.match(/^\/(?:video\/)?(\d+)\/?$/)?.[1];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    /* Missing or malformed media is rendered as a thumbnail. */
  }
}

export function portfolioVideoUrl(value?: string): string | undefined {
  if (!value) return;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return;
    if (
      url.protocol === "https:" &&
      ["cdn.sanity.io", "storage.googleapis.com"].includes(url.hostname)
    )
      return url.href;
  } catch {
    /* Invalid CMS media is not embedded. */
  }
}

// Drive's thumbnail endpoint is an image, not a video stream. Keep its original
// published link without attempting to embed a sign-in page or invent a stream.
export function portfolioOriginalUrl(value?: string): string | undefined {
  if (!value) return;
  if (portfolioVideoUrl(value) || portfolioEmbedUrl(value)) return value;
  try {
    const url = new URL(value);
    if (
      url.protocol === "https:" &&
      url.hostname === "drive.google.com" &&
      /^\/file\/d\/[\w-]+(?:\/|$)/.test(url.pathname)
    )
      return url.href;
  } catch {
    /* Invalid external links are not rendered. */
  }
}
