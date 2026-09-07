import { seoHead } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";

export const Route = createFileRoute("/privacy")({
  head: () =>
    seoHead(
      "Privacy Policy | ContentMesh Studios",
      "How ContentMesh handles information you share through our website and project enquiry form.",
      "/privacy",
    ),
  component: () => (
    <SiteLayout>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        desc="This page is maintained by ContentMesh to answer common privacy questions about our services."
      />
      <article className="prose mx-auto max-w-3xl px-6 pb-24 text-foreground">
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            ContentMesh ("we", "us") respects your privacy. This policy describes what information
            we collect when you use our website and services, and how we use it.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Information we collect
          </h2>
          <p>
            We collect information you provide directly (name, email, project details) and basic
            analytics needed to operate the site.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">
            How we use information
          </h2>
          <p>
            To respond to inquiries, deliver services, improve the site, and communicate updates you
            opted into.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">Your choices</h2>
          <p>
            You can request access to, correction of, or deletion of your personal information at
            any time by emailing waheed.sul00@gmail.com.
          </p>
          <p className="text-xs">Last updated: {new Date().toLocaleDateString()}.</p>
        </div>
      </article>
    </SiteLayout>
  ),
});
