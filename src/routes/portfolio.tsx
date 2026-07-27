import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Portfolio } from "@/components/home/Portfolio";
import { PageHero } from "@/components/layout/PageHero";
import { CTA } from "@/components/home/CTA";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "AI Video Production Portfolio & Examples | ContentMesh Agency" },
      {
        name: "description",
        content:
          "Browse our AI video production portfolio. Explore real commercial ads, UGC video marketing campaigns, AI avatar onboarding videos, 3D AI animations, and brand films.",
      },
      {
        name: "keywords",
        content:
          "ai video production portfolio, ai video agency work, ai video samples, ai video examples, ai commercial ads portfolio",
      },
      { property: "og:title", content: "AI Video Production Portfolio & Examples | ContentMesh Agency" },
      {
        property: "og:description",
        content: "A curated look at recent AI video ads, product videos, animations, corporate stories, and social reels.",
      },
      { property: "og:url", content: "https://contentmesh.ai/portfolio" },
    ],
    links: [{ rel: "canonical", href: "https://contentmesh.ai/portfolio" }],
  }),
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
