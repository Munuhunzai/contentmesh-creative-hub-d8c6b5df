import notes from "@/content/portfolio-notes.json";

export type PortfolioCreativeNotes = {
  summary: string;
  direction: string;
  consideration: string;
};

// Editorial ideas supplement the published project record. They are not client
// briefs, production histories or evidence of campaign performance.
const notesBySlug = new Map<string, PortfolioCreativeNotes>(
  notes.map(([slug, summary, direction, consideration]) => [
    slug,
    { summary, direction, consideration },
  ]),
);

export function getPortfolioNotes(slug?: string) {
  return slug ? notesBySlug.get(slug) : undefined;
}

export function portfolioProjectType(item: {
  projectType?: string;
  client?: string;
  category?: string;
  description?: string;
}) {
  if (item.projectType) return item.projectType;
  if (/personal use|entertainment purposes/i.test(item.description || "")) {
    return ["AI Ads", "Product Videos", "UGC"].includes(item.category || "")
      ? "Concept study"
      : "Personal project";
  }
  return undefined;
}
