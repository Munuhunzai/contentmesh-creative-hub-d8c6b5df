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
            We collect information you provide directly (name, email, project details) and
            operational information needed to run the site. Optional analytics is described below.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">
            How we use information
          </h2>
          <p>
            To respond to inquiries, deliver services, improve the site, and communicate updates you
            opted into.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Optional Microsoft Clarity analytics
          </h2>
          <p>
            Only after you accept analytics, we use Microsoft Clarity to understand navigation,
            clicks and scrolling through heatmaps and session recordings, and improve our website.
            Clarity can collect device, browser and usage information and use cookies such as _clck
            and _clsk. We mask page text and form content in recordings and do not send names, email
            addresses or enquiry details through analytics events. Microsoft processes this
            information; see the{" "}
            <a className="underline" href="https://privacy.microsoft.com/privacystatement">
              Microsoft Privacy Statement
            </a>
            .
          </p>
          <p>
            Rejecting analytics keeps Clarity off. Advertising consent is not granted by this site.
            Use the Privacy choices button to accept or withdraw permission at any time. Your choice
            is stored in this browser for up to 180 days. Withdrawal stops future collection; it
            does not delete recordings already collected.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">Your choices</h2>
          <p>
            You can request access to, correction of, or deletion of your personal information at
            any time by emailing waheed.sul00@gmail.com.
          </p>
          <p className="text-xs">Last updated: October 19, 2026.</p>
        </div>
      </article>
    </SiteLayout>
  ),
});
