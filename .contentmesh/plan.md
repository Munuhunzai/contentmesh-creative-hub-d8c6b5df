
## Stack note

This project is **TanStack Start** (not Next.js). The integration works the same way conceptually: a browser-side `@sanity/client`, GROQ queries, and Sanity Studio v3 mounted at `/studio`. Everything stays edge-compatible so it deploys to Vercel or Cloudflare unchanged.

## Which Sanity project?

Your account has two projects both named "ContentMesh":
- `2oyuu3aj` (created earlier)
- `ru6ynu80` (created a few minutes later)

I'll use **`ru6ynu80`** (the newer one) with dataset `production` unless you say otherwise. Reply "use 2oyuu3aj" to switch.

## 1. Packages

Add: `@sanity/client`, `@sanity/image-url`, `sanity`, `@sanity/vision`, `styled-components`, `react-is` (Studio peer deps).

## 2. Content schemas

Nine schema types under `src/sanity/schemas/`:

| Type | Kind | Key fields |
|---|---|---|
| `siteSettings` | singleton | title, tagline, logo, socials, contact email/phone/address, defaultSeo |
| `homepage` | singleton | heroTitle, heroSubtitle, heroCTA, statsBlocks, whyUsBlocks, ctaTitle/subtitle |
| `service` | collection | title, slug, icon, shortDescription, longDescription (portable text), features[], order |
| `portfolioItem` | collection | title, slug, category, client, completionDate, description, thumbnail, videoUrl, gallery[] |
| `testimonial` | collection | quote, authorName, authorRole, company, avatar, rating, order |
| `teamMember` | collection | name, role, bio, photo, socials, order |
| `faq` | collection | question, answer (portable text), category, order |
| `blogPost` | collection | title, slug, excerpt, cover, body (portable text), author→teamMember, publishedAt, tags[] |
| `contactInfo` | singleton | email, phone, address, hours, mapEmbedUrl, formRecipient |

Portable Text renders with `@portabletext/react`.

## 3. Sanity client + queries

- `src/integrations/sanity/client.ts` — configured client (`useCdn: true`, `apiVersion: "2024-10-01"`), reads `import.meta.env.VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` with hard-coded fallbacks so preview works out of the box.
- `src/integrations/sanity/image.ts` — `urlFor()` helper.
- `src/integrations/sanity/queries.ts` — one GROQ query per section (`homepageQuery`, `servicesQuery`, `portfolioQuery`, `testimonialsQuery`, `teamQuery`, `faqQuery`, `blogListQuery`, `blogPostBySlugQuery`, `siteSettingsQuery`, `contactQuery`).

## 4. Data-loading pattern

Each route loader primes TanStack Query: `context.queryClient.ensureQueryData({ queryKey, queryFn: () => sanityClient.fetch(query) })`. Components read with `useSuspenseQuery`. Every section component gets a **safe fallback** — if Sanity returns nothing (empty dataset), the existing hard-coded copy renders so the site is never blank before you seed content.

## 5. Rewired components (design untouched)

Home: `Hero`, `Stats`, `Services`, `WhyUs`, `Portfolio`, `Testimonials`, `Pricing` (kept static; not in scope), `FAQ`, `CTA`. Pages: `services.tsx`, `portfolio.tsx`, `about.tsx` (team + story), `blog.tsx` (list) + new `blog.$slug.tsx` (post), `contact.tsx` (contact info from Sanity, form unchanged), `Footer` (socials + contact from `siteSettings`).

All Liquid Glass styling, motion, and layout stay exactly as-is — only text/image sources change.

## 6. Studio at `/studio`

- `src/sanity/config.ts` — `defineConfig` with schemas + `visionTool`.
- `src/routes/studio.$.tsx` — splat route, `ssr: false`, renders `<Studio />` inside a `<ClientOnly>` wrapper (Studio uses browser APIs and can't SSR on Workers). Full-viewport, unaffected by site chrome.

## 7. Env vars & Vercel

Only two vars, both public (no secrets — Sanity project ID and dataset name are safe in the client):

```
VITE_SANITY_PROJECT_ID=ru6ynu80
VITE_SANITY_DATASET=production
```

Instructions I'll add to `README.md`:
1. Add both to Vercel → Project → Settings → Environment Variables (Production + Preview).
2. Add your Vercel domain + `http://localhost:*` under **sanity.io/manage → API → CORS origins** (I'll add the preview origin automatically via MCP).
3. `bun install && bun run dev`. Visit `/studio` to log in and publish content.

## 8. CORS

I'll call `add_cors_origin` for `http://localhost:8080`, the Lovable preview host, and `https://contentmesh-creative-hub.lovable.app` immediately. You add the Vercel prod URL yourself once deployed.

## 9. Out of scope (call out and skip)

- Contact form submission backend (form UI stays, no wiring change).
- Auth/roles for Studio (Sanity handles it via their login).
- Blog post rich content beyond portable text basics.

Say **go** and I'll build it, or tell me which project ID / dataset to use first.
