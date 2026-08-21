import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import {
  SANITY_PROJECT_ID,
  SANITY_DATASET,
  SANITY_API_VERSION,
} from "@/integrations/sanity/client";

export default defineConfig({
  name: "contentmesh",
  title: "ContentMesh Studio",
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.listItem()
              .title("Homepage")
              .child(S.document().schemaType("homepage").documentId("homepage")),
            S.listItem()
              .title("Contact Information")
              .child(S.document().schemaType("contactInfo").documentId("contactInfo")),
            S.divider(),
            S.documentTypeListItem("service").title("Services"),
            S.documentTypeListItem("portfolioItem").title("Portfolio"),
            S.documentTypeListItem("testimonial").title("Testimonials"),
            S.documentTypeListItem("teamMember").title("Team"),
            S.documentTypeListItem("faq").title("FAQs"),
            S.documentTypeListItem("blogPost").title("Blog Posts"),
            S.documentTypeListItem("pricingPlan").title("Pricing Plans"),
          ]),
    }),
    visionTool({ defaultApiVersion: SANITY_API_VERSION }),
  ],
  schema: { types: schemaTypes },
});
