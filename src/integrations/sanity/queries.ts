// GROQ queries. Each is safe against missing datasets (returns null / []).

export const siteSettingsQuery = /* groq */ `*[_type == "siteSettings"][0]{
  title, tagline, "logoUrl": logo.asset->url,
  whatsappNumber, socials, email, phone, address, defaultSeo
}`;

export const homepageQuery = /* groq */ `*[_type == "homepage"][0]{
  heroDescription,
  heroSlides[]{
    category, title, youtubeUrl,
    "videoFileUrl": videoFile.asset->url,
    "backgroundImageUrl": backgroundImage.asset->url
  },
  stats[]{ value, suffix, label },
  whyUs[]{ icon, title, description },
  ctaTitle, ctaTitleAccent, ctaSubtitle
}`;

export const servicesQuery = /* groq */ `*[_type == "service"] | order(order asc){
  _id, title, "slug": slug.current, icon, shortDescription,
  longDescription, features
}`;

export const portfolioQuery = /* groq */ `*[_type == "portfolioItem"] | order(completionDate desc){
  _id, title, "slug": slug.current, category, featured, client, completionDate,
  description, "thumbnailUrl": thumbnail.asset->url, videoUrl,
  "videoFileUrl": videoFile.asset->url,
  gallery[]{ "url": asset->url, alt }
}`;

export const testimonialsQuery = /* groq */ `*[_type == "testimonial"] | order(order asc){
  _id, quote, authorName, authorRole, company,
  "avatarUrl": avatar.asset->url, rating, accentColor
}`;

export const teamQuery = /* groq */ `*[_type == "teamMember"] | order(order asc){
  _id, name, role, bio, "photoUrl": photo.asset->url, socials
}`;

export const faqQuery = /* groq */ `*[_type == "faq"] | order(order asc){
  _id, question, answer, category
}`;

export const blogListQuery = /* groq */ `*[_type == "blogPost" && defined(publishedAt)] | order(publishedAt desc){
  _id, title, "slug": slug.current, excerpt,
  "coverUrl": cover.asset->url, publishedAt, tags,
  "authorName": author->name
}`;

export const blogPostBySlugQuery = /* groq */ `*[_type == "blogPost" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, excerpt,
  "coverUrl": cover.asset->url, body, publishedAt, tags,
  "author": author->{ name, role, "photoUrl": photo.asset->url }
}`;

export const contactQuery = /* groq */ `*[_type == "contactInfo"][0]{
  email, phone, address, hours, mapEmbedUrl, formRecipient
}`;

export const pricingQuery = /* groq */ `*[_type == "pricingPlan"] | order(order asc){
  _id, name, price, isCustomPrice, description, featured, features, ctaLabel, ctaUrl
}`;

