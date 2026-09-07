import { seoHead } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Portfolio } from "@/components/home/Portfolio";
import { PageHero } from "@/components/layout/PageHero";
import { CTA } from "@/components/home/CTA";

export const Route = createFileRoute("/portfolio")({
  head: () =>
    seoHead(
      "AI Video Portfolio | ContentMesh Studios",
      "Explore AI commercials, product videos, animation and branded content produced by ContentMesh. Find a creative direction for your next project.",
      "/portfolio",
    ),
  component: () => (
    <SiteLayout>
      <PageHero
        eyebrow="AI Video Portfolio"
        title="Selected AI Video Production Work & Examples"
        desc="A curated showcase of recent commercial ads, AI animations, explainers, and social reels created for global clients."
      />
      <Portfolio />
      <CTA />
    </SiteLayout>
  ),
});
