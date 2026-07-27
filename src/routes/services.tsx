import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Services } from "@/components/home/Services";
import { WhyUs } from "@/components/home/WhyUs";
import { Process } from "@/components/home/Process";
import { CTA } from "@/components/home/CTA";
import { PageHero } from "@/components/layout/PageHero";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "AI Video Production Services & AI Animation Agency | ContentMesh" },
      {
        name: "description",
        content:
          "Explore full-stack AI video production services: commercial AI video ads, custom AI animation, studio-grade AI voiceovers, AI avatar creation, and motion graphics for modern brands.",
      },
      {
        name: "keywords",
        content:
          "ai video production service, ai video advertising services, ai video avatar service, ai video animation company, ai video content agency, ai video editing services",
      },
      { property: "og:title", content: "AI Video Production Services & AI Animation Agency | ContentMesh" },
      {
        property: "og:description",
        content: "Explore full-stack AI video production services, commercial ads, AI animation, and voiceovers.",
      },
      { property: "og:url", content: "https://contentmesh.ai/services" },
    ],
    links: [{ rel: "canonical", href: "https://contentmesh.ai/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "AI Video Production Service",
          provider: {
            "@type": "Organization",
            name: "ContentMesh Studio",
          },
          areaServed: "Worldwide",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "AI Video Services",
            itemListElement: [
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Commercial Video Production" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Character & 3D Animation" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Voiceovers & Language Localization" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "UGC Video Editing & Motion Graphics" } },
            ],
          },
        }),
      },
    ],
  }),
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
      <Services />
      <WhyUs />
      <Process />
      <CTA />
    </SiteLayout>
  );
}
