import { defineType, defineField } from "sanity";

export default defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "heroSlides",
      title: "Hero Slides",
      type: "array",
      description: "Add up to 5 slides. Each slide is a full-screen panel with a background image and optional YouTube video.",
      of: [
        {
          type: "object",
          name: "heroSlide",
          title: "Slide",
          fields: [
            defineField({
              name: "category",
              title: "Category Label",
              type: "string",
              description: 'Shown top-left in orange. e.g. "GENERATIVE ART" or "AI VIDEO"',
            }),
            defineField({
              name: "title",
              title: "Heading",
              type: "string",
              description: "Big bold uppercase heading shown bottom-left.",
            }),
            defineField({
              name: "videoFile",
              title: "Direct Video Upload (.mp4, .webm, .mov)",
              type: "file",
              options: {
                accept: "video/mp4,video/webm,video/quicktime,video/*",
                storeOriginalFilename: true,
              },
              description: "Upload a video file directly to play as the slide background video.",
            }),
            defineField({
              name: "youtubeUrl",
              title: "YouTube / Video URL (Alternative)",
              type: "url",
              description: "Or paste a YouTube or external video link (e.g. https://youtu.be/xxxxx).",
            }),
            defineField({
              name: "backgroundImage",
              title: "Background Image",
              type: "image",
              options: { hotspot: true },
              description: "Full-screen background image for this slide. Required for the slide to display properly.",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "category", media: "backgroundImage" },
          },
        },
      ],
    }),
    defineField({
      name: "heroDescription",
      title: "Company Description",
      type: "text",
      rows: 3,
      description: "Shown under the heading on every slide. Describe your company in 1–2 sentences.",
    }),
    defineField({
      name: "stats",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "value", type: "number" }),
          defineField({ name: "suffix", type: "string" }),
          defineField({ name: "label", type: "string" }),
        ],
      }],
    }),
    defineField({
      name: "whyUs",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", type: "string", description: "Lucide icon name, e.g. Zap, Award" }),
          defineField({ name: "title", type: "string" }),
          defineField({ name: "description", type: "text", rows: 2 }),
        ],
      }],
    }),
    defineField({ name: "ctaTitle", type: "string" }),
    defineField({ name: "ctaTitleAccent", type: "string" }),
    defineField({ name: "ctaSubtitle", type: "text", rows: 2 }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});

