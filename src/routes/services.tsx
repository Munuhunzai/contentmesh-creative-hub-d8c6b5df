import { seoHead } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Services } from "@/components/home/Services";
import { WhyUs } from "@/components/home/WhyUs";
import { Process } from "@/components/home/Process";
import { CTA } from "@/components/home/CTA";
import { PageHero } from "@/components/layout/PageHero";
import { ServiceLinks } from "@/components/layout/ServiceLinks";

export const Route = createFileRoute("/services")({
  head: () =>
    seoHead(
      "AI Video Production Services | ContentMesh Studios",
      "AI video production, commercial ads, animation, voiceovers and video editing. Explore deliverables and discuss your project with ContentMesh.",
      "/services",
    ),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="AI Video Production Services"
        title="Full-Stack AI Video Production & Animation Services"
        desc="From AI video ads and avatar creation to commercial editing and motion graphics, we provide end-to-end creative video production services."
      />
      <ServiceLinks />
      <Services />
      <WhyUs />
      <Process />
      <CTA />
    </SiteLayout>
  );
}
