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
        list: ["AI Ads", "Product Videos", "Animations", "Corporate", "Talking Head", "Reels", "Health & Wellness", "Science", "UGC"],
      },
    }),
    defineField({
      name: "featured",
      title: "Featured Portfolio Item",
      type: "boolean",
      initialValue: false,
      description: "Turn ON to display this item in the default 'Featured' tab on the portfolio grid.",
    }),
    defineField({ name: "client", type: "string" }),
    defineField({ name: "completionDate", type: "date" }),
    defineField({ name: "description", type: "text", rows: 4 }),
    defineField({ name: "thumbnail", type: "image", options: { hotspot: true } }),
    defineField({
      name: "videoUrl",
      type: "url",
      title: "Video Link — Google Drive / YouTube / Vimeo / MP4 (Recommended)",
      description: "⭐ Recommended for HD/4K videos: Upload to Google Drive (set access to 'Anyone with the link'), YouTube, or Vimeo, then paste the link here (e.g. https://drive.google.com/file/d/xxxx/view).",
    }),
    defineField({
      name: "videoFile",
      title: "Direct Video Upload (.mp4, .webm, .mov)",
      type: "file",
      options: {
        accept: "video/mp4,video/webm,video/quicktime,video/*",
        storeOriginalFilename: true,
      },
      description: "Direct upload for small video files (<50MB). Note: Requires CORS allowed in sanity.io/manage for embedded studio.",
    }),
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
