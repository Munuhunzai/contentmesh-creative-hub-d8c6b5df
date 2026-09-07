import { seoHead } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";

export const Route = createFileRoute("/terms")({
  head: () =>
    seoHead(
      "Terms of Service | ContentMesh Studios",
      "Terms for using the ContentMesh website and commissioning creative production services.",
      "/terms",
    ),
  component: () => (
    <SiteLayout>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        desc="Please read these terms carefully before using our services."
      />
      <article className="mx-auto max-w-3xl px-6 pb-24">
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            By using ContentMesh services you agree to these terms. Project-specific terms are set
            out in individual statements of work.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">Services</h2>
          <p>
            We provide creative production services. Deliverables, timelines, and fees are defined
            per engagement.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Intellectual property
          </h2>
          <p>
            On full payment, final deliverables are transferred to the client per the applicable
            SOW. Underlying tools, models, and templates remain the property of their respective
            owners.
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground">Liability</h2>
          <p>
            Our aggregate liability is limited to fees paid in the twelve months preceding a claim.
          </p>
          <p className="text-xs">Last updated: {new Date().toLocaleDateString()}.</p>
        </div>
      </article>
    </SiteLayout>
  ),
});
