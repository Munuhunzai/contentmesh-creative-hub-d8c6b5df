import { defineType, defineField } from "sanity";

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "icon",
      type: "string",
      description: "Lucide icon name, e.g. Video, Wand2, Mic",
    }),
    defineField({ name: "shortDescription", type: "text", rows: 2 }),
    defineField({
      name: "longDescription",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "features",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "order", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
