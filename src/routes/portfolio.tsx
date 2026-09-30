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
      "Explore ContentMesh client animation and independent AI video concepts, with creative notes for commercials, product films and visual stories.",
      "/portfolio",
    ),
  component: () => (
    <SiteLayout>
      <PageHero
        eyebrow="AI Video Portfolio"
        title="The work speaks first."
        desc="Client work and independent creative studies. Explore commercials, product films and visual stories, with ideas for developing your next brief."
      />
      <Portfolio />
      <CTA />
    </SiteLayout>
  ),
});
