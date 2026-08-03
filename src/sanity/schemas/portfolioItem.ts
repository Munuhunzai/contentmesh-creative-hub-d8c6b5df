import { defineType, defineField } from "sanity";

export default defineType({
  name: "portfolioItem",
  title: "Portfolio Item",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: ["AI Ads", "Product Videos", "Animations", "Corporate", "Explainers", "Reels"],
      },
    }),
    defineField({ name: "client", type: "string" }),
    defineField({ name: "completionDate", type: "date" }),
    defineField({ name: "description", type: "text", rows: 4 }),
    defineField({ name: "thumbnail", type: "image", options: { hotspot: true } }),
    defineField({
      name: "videoFile",
      title: "Direct Video Upload (.mp4, .webm, .mov)",
      type: "file",
      options: {
        accept: "video/mp4,video/webm,video/quicktime,video/*",
        storeOriginalFilename: true,
      },
      description: "Upload a video file directly (.mp4, .webm, .mov) instead of pasting a URL.",
    }),
    defineField({ name: "videoUrl", type: "url", description: "YouTube / Vimeo / mp4 URL (Alternative)" }),
    defineField({
      name: "gallery",
      type: "array",
      of: [{
        type: "image",
        options: { hotspot: true },
        fields: [defineField({ name: "alt", type: "string" })],
      }],
    }),
  ],
});
