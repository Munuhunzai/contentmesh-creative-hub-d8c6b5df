import { defineType, defineField } from "sanity";

export default defineType({
  name: "contactInfo",
  title: "Contact Information",
  type: "document",
  fields: [
    defineField({ name: "email", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "address", type: "text", rows: 2 }),
    defineField({ name: "hours", type: "string" }),
    defineField({ name: "mapEmbedUrl", type: "url" }),
    defineField({
      name: "formRecipient",
      type: "string",
      description: "Email to receive contact form submissions",
    }),
  ],
  preview: { prepare: () => ({ title: "Contact Information" }) },
});
