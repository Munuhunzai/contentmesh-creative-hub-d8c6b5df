import { defineType, defineField } from "sanity";

export default defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({ name: "cover", type: "image", options: { hotspot: true } }),
    defineField({
      name: "body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 1 (H1)", value: "h1" },
            { title: "Heading 2 (H2)", value: "h2" },
            { title: "Heading 3 (H3)", value: "h3" },
            { title: "Heading 4 (H4)", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
        },
        { type: "image", options: { hotspot: true } },
      ],
    }),
    defineField({ name: "author", type: "reference", to: [{ type: "teamMember" }] }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({
      name: "isFeatured",
      title: "Featured Article (Show at Top)",
      type: "boolean",
      description: "Toggle ON to feature this article at the top of the blog page.",
      initialValue: false,
    }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
  ],
  preview: { select: { title: "title", subtitle: "publishedAt", media: "cover" } },
});
