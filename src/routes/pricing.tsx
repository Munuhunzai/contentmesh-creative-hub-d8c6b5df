import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Pricing } from "@/components/home/Pricing";
import { FAQ_ } from "@/components/home/FAQ";
import { CTA } from "@/components/home/CTA";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "AI Video Production Pricing & Retainer Plans | ContentMesh" },
      {
        name: "description",
        content:
          "Transparent monthly pricing for AI video production services and editing retainers. Choose from Starter, Professional, or Enterprise custom AI video packages.",
      },
      {
        name: "keywords",
        content:
          "ai video production pricing, ai video agency retainers, ai video production cost, affordable ai video production",
      },
      {
        property: "og:title",
        content: "AI Video Production Pricing & Retainer Plans | ContentMesh",
      },
      {
        property: "og:description",
        content:
          "Transparent monthly retainers for AI video production, commercial ads, and animation.",
      },
      { property: "og:url", content: "https://contentmesh.ai/pricing" },
    ],
    links: [{ rel: "canonical", href: "https://contentmesh.ai/pricing" }],
  }),
  component: () => (
    <SiteLayout>
      <PageHero
        eyebrow="Transparent Pricing"
        title="AI Video Production Plans Built to Scale"
        desc="Straightforward monthly retainers with clear video deliverables, 48-hour priority turnaround options, and unlimited revisions."
      />
      <Pricing />
      <FAQ_ />
      <CTA />
    </SiteLayout>
  ),
});
