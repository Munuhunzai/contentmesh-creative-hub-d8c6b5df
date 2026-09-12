import { seoHead, jsonLd, absoluteUrl, SITE_NAME } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Hero, type HomepageData } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { WhyUs } from "@/components/home/WhyUs";
import { Portfolio } from "@/components/home/Portfolio";
import { Process } from "@/components/home/Process";
import { Stats } from "@/components/home/Stats";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ_ } from "@/components/home/FAQ";
import { CTA } from "@/components/home/CTA";
import { optimizeSanityImage, getSanitySrcSet } from "@/lib/sanity-image";
import { ServiceLinks } from "@/components/layout/ServiceLinks";

export const Route = createFileRoute("/")({
  loader: async ({ parentMatchPromise }): Promise<HomepageData | null> => {
    const parent = await parentMatchPromise;
    return (parent.loaderData?.homepage as HomepageData | undefined) || null;
  },
  head: ({ loaderData }) => {
    const firstSlide = loaderData?.heroSlides?.[0];
    const firstImage = firstSlide?.backgroundImageUrl;

    return {
      ...seoHead(
        "AI Video Production Agency | ContentMesh Studios",
        "Human-directed AI commercials, product videos, animation and branded content. From your first brief to the final edit, built around your audience.",
        "/",
      ),
      links: [
        { rel: "canonical", href: absoluteUrl() },
        ...(firstImage
          ? [
              {
                rel: "preload",
                as: "image",
                href: optimizeSanityImage(firstImage, 1440, 75),
                imageSrcSet: getSanitySrcSet(firstImage, [640, 960, 1440, 1920], 75),
                imageSizes: "100vw",
                fetchPriority: "high" as const,
              },
            ]
          : []),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: jsonLd({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": absoluteUrl("/#organization"),
                name: SITE_NAME,
                url: absoluteUrl(),
                logo: absoluteUrl("/Content_mesh_AI_video_production_agency.png"),
                description:
                  "AI video production, animation, voiceovers and branded content guided by human creative direction.",
              },
              {
                "@type": "WebSite",
                "@id": absoluteUrl("/#website"),
                name: SITE_NAME,
                url: absoluteUrl(),
                publisher: { "@id": absoluteUrl("/#organization") },
                inLanguage: "en",
              },
            ],
          }),
        },
      ],
    };
  },
  component: Index,
});

function Index() {
  const loaderData = Route.useLoaderData();

  return (
    <SiteLayout heroSlot={<Hero initialData={loaderData} />}>
      <Portfolio featuredOnly />
      <Services compact />
      <ServiceLinks />
      <WhyUs />
      <Process />
      <Stats />
      <Testimonials />
      <FAQ_ />
      <CTA />
    </SiteLayout>
  );
}
