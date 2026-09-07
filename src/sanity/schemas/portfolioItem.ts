import { defineType, defineField } from "sanity";

export default defineType({
  name: "portfolioItem",
  title: "Portfolio Item",
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
      name: "category",
      type: "string",
      options: {
        list: [
          "AI Ads",
          "Product Videos",
          "Animations",
          "Corporate",
          "Talking Head",
          "Reels",
          "Health & Wellness",
          "Science",
          "UGC",
        ],
      },
    }),
    defineField({
      name: "featured",
      title: "Featured Portfolio Item",
      type: "boolean",
      initialValue: false,
      description:
        "Prioritise this item in the four-project homepage selection. The portfolio page still shows all work.",
    }),
    defineField({ name: "client", type: "string" }),
    defineField({ name: "completionDate", type: "date" }),
    defineField({
      name: "projectType",
      title: "Project type",
      type: "string",
      options: { list: ["Client project", "Concept study", "Personal project"] },
      description:
        "Choose the actual relationship. A concept study is not presented as commissioned client work.",
    }),
    defineField({
      name: "brief",
      title: "The brief",
      type: "text",
      rows: 3,
      validation: (r) => r.max(1200),
    }),
    defineField({
      name: "approach",
      title: "Creative approach",
      type: "text",
      rows: 3,
      validation: (r) => r.max(1800),
    }),
    defineField({
      name: "deliverables",
      type: "array",
      of: [{ type: "string" }],
      validation: (r) => r.max(12),
    }),
    defineField({
      name: "outcome",
      title: "Result",
      type: "text",
      rows: 3,
      description:
        "Include only outcomes you can verify and have permission to publish. Leave blank if unavailable.",
      validation: (r) => r.max(1200),
    }),
    defineField({ name: "description", type: "text", rows: 4 }),
    defineField({ name: "thumbnail", type: "image", options: { hotspot: true } }),
    defineField({
      name: "videoUrl",
      type: "url",
      title: "Video Link — Google Drive / YouTube / Vimeo / MP4 (Recommended)",
      description:
        "⭐ Recommended for HD/4K videos: Upload to Google Drive (set access to 'Anyone with the link'), YouTube, or Vimeo, then paste the link here (e.g. https://drive.google.com/file/d/xxxx/view).",
    }),
    defineField({
      name: "videoFile",
      title: "Direct Video Upload (.mp4, .webm, .mov)",
      type: "file",
      options: {
        accept: "video/mp4,video/webm,video/quicktime,video/*",
        storeOriginalFilename: true,
      },
      description:
        "Direct upload for small video files (<50MB). Note: Requires CORS allowed in sanity.io/manage for embedded studio.",
    }),
    defineField({
      name: "gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", type: "string" })],
        },
      ],
    }),
  ],
});
