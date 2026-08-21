import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { WhyUs } from "@/components/home/WhyUs";
import { Portfolio } from "@/components/home/Portfolio";
import { Process } from "@/components/home/Process";
import { Stats } from "@/components/home/Stats";
import { Testimonials } from "@/components/home/Testimonials";
import { Pricing } from "@/components/home/Pricing";
import { FAQ_ } from "@/components/home/FAQ";
import { CTA } from "@/components/home/CTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Video Production Agency & Creation Company | ContentMesh" },
      {
        name: "description",
        content:
          "ContentMesh is a leading AI video production agency and creation company. We deliver high-converting AI video ads, UGC editing, 3D AI animation, and studio voiceovers for top brands.",
      },
      {
        name: "keywords",
        content:
          "ai video production agency, ai video creation company, ai video production service, ai video agency, ai video marketing agency, ai video editing agency, ai video ads agency, ai video content agency, ai video creation agency, best ai video production company, ai video animation company, ai video advertising services, ai video avatar service, ai video dubbing and translation services, best ai ugc video editors for marketing agencies, ai avatar creators for company onboarding videos, ai video production operations agency, ai powered video translation service",
      },
      { property: "og:title", content: "AI Video Production Agency & Creation Company | ContentMesh" },
      {
        property: "og:description",
        content:
          "Full-stack AI video production agency delivering cinematic commercial ads, UGC video marketing, and AI animation.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://contentmesh.ai/" },
    ],
    links: [{ rel: "canonical", href: "https://contentmesh.ai/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["Organization", "ProfessionalService"],
          name: "ContentMesh Studio",
          url: "https://contentmesh.ai",
          logo: "https://contentmesh.ai/Content_mesh_AI_video_production_agency.png",
          description:
            "Leading AI video production agency and AI creation company specializing in commercial ads, AI animation, voiceovers, and marketing video production.",
          sameAs: ["https://wa.me/923000000000"],
          serviceType: [
            "AI Video Production Service",
            "AI Video Ads Agency",
            "AI Animation Company",
            "UGC Video Editing Service",
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout heroSlot={<Hero />}>
      <Services />
      <WhyUs />
      <Portfolio />
      <Process />
      <Stats />
      <Testimonials />
      <Pricing />
      <FAQ_ />
      <CTA />
    </SiteLayout>
  );
}
