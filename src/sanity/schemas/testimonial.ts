import { defineType, defineField } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "authorName", type: "string", validation: (r) => r.required() }),
    defineField({ name: "authorRole", type: "string" }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "avatar", type: "image", options: { hotspot: true } }),
    defineField({
      name: "rating",
      type: "number",
      initialValue: 5,
      validation: (r) => r.min(1).max(5),
    }),
    defineField({
      name: "accentColor",
      type: "string",
      description: "Hex color for the avatar fallback swatch",
    }),
    defineField({ name: "order", type: "number", initialValue: 100 }),
  ],
  preview: { select: { title: "authorName", subtitle: "company" } },
});
