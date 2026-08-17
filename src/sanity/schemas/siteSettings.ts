import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", initialValue: "ContentMesh" }),
    defineField({ name: "tagline", type: "string" }),
    defineField({ name: "logo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number",
      type: "string",
      description: "Include country code, digits only. e.g. 923001234567 for +92 300 1234567",
    }),
    defineField({
      name: "socials",
      type: "object",
      fields: [
        defineField({ name: "instagram", type: "url" }),
        defineField({ name: "linkedin", type: "url" }),
        defineField({ name: "twitter", type: "url" }),
        defineField({ name: "youtube", type: "url" }),
      ],
    }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "address", type: "text", rows: 2 }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO Settings",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", title: "SEO Meta Title", type: "string" }),
        defineField({ name: "metaDescription", title: "SEO Meta Description", type: "text", rows: 2 }),
        defineField({ name: "ogImage", title: "SEO Social Sharing Image", type: "image" }),
      ],
    }),
  ],
  preview: { select: { title: "title" } },
});

