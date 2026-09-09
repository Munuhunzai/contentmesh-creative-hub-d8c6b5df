# Google and AI search: research and implementation

Research date: 9 September 2026. Business: ContentMesh Studios, human-directed AI video production. Current production origin: `https://contentmesh-creative-hub-d8c6b5df.vercel.app`.

## Research scope and limits

Reviewed public search results for AI video production agencies, AI product video agencies, AI YouTube production services, AI video production costs and Pakistan-based providers. These are qualitative search-intent observations, not a location-controlled Google rank audit. No Search Console, keyword-volume subscription, backlink index or analytics account was connected. Search volume, keyword difficulty, current positions and revenue projections have not been invented. Search results also mix software, marketplaces and production agencies; the site should make its service business clear.

## Competitor observations

| Observed site | Evidence on its own website | Implication for ContentMesh |
| --- | --- | --- |
| [AiCandy](https://www.aicandy.be/) | Prominent cases, named brands, creative team and full/hybrid production positioning | Demonstrate craft with approved work and accountable people. Do not copy another company's client claims. |
| [Visual Best](https://www.visualbest.co/ai-video-production-services/) | Dedicated service page, examples, deliverable categories, white-label positioning and buyer FAQs | Give each distinct buyer need a useful landing page with a route to evidence and enquiry. |
| [Lemonlight](https://www.lemonlight.com/blog/ai-video-production-cost/) | A dedicated cost explanation separates production services from DIY subscriptions | Answer scope and cost questions, but publish ContentMesh prices only when the owner has confirmed them. |

These observations do not establish why a competitor ranks or that copying its structure will reproduce its results. Competitors' numerical claims have not been independently verified or adopted.

## Query-to-page map

Priority is based on business relevance and intent, not measured volume.

| Intent / example queries | Primary destination | Content decision |
| --- | --- | --- |
| Find an AI video production agency | `/` | Keep concise agency positioning and visible links into services and work. |
| Compare AI video production services | `/services` | Keep the broad capability hub and introduce permanent detail-page links. |
| Commission AI commercials / brand ads | `/services/ai-commercial-video-production` | Concept, approval process, production choices, versions, scope and rights questions. |
| Commission AI product ads / ecommerce videos | `/services/ai-product-video-ads` | Product fidelity, supplied assets, demonstrations and creative testing. Avoid confusion with videos explaining AI software. |
| Hire AI YouTube production / faceless video editing | `/services/ai-youtube-video-production` | Narration timing, character continuity, pilot episodes and recurring production scope. |
| Assess actual work | `/portfolio` | Existing published work; next priority is approved, detailed project evidence. |
| Plan a script visually | `/tools/storyboard-generator` | Useful tool linked from service briefs; distinct from an agency purchasing page. |

No duplicate city pages or keyword-swapped industry pages were created. Pakistan-specific landing pages should follow verified business location and evidence of serving that market, not keyword opportunity alone.

## Implemented

- Corrected canonical and social URLs to the connected production origin. `VITE_SITE_URL` provides one migration setting.
- Generated `robots.txt` from the same origin as the sitemap; retained public crawler access and private API exclusion. Existing Studio noindex responses remain in place.
- Added three original, server-rendered service pages with unique titles/descriptions, visible buyer answers, scoped deliverables and contact links carrying the selected service.
- Added crawlable internal links from the homepage, service hub and articles; linked the new pages to work, contact and the storyboard tool.
- Added matching Service and BreadcrumbList structured data; unified Organization/WebSite identity and article publisher references. No invented ratings, awards, author credentials or client results.
- Included new routes in the sitemap without fabricated modification dates.
- Kept navigation data separate from full editorial content to avoid loading all service copy into the homepage bundle. Added no third-party SEO widgets or analytics scripts.

## What AI visibility actually requires

[Google's AI features guidance](https://developers.google.com/search/docs/appearance/ai-features) says ordinary SEO fundamentals apply: accessible pages, useful visible text, internal links and structured data that agrees with the content. There is no special AI schema or required AI text file. Inclusion is not guaranteed. This implementation therefore does not add an `llms.txt` file as a supposed ranking shortcut.

[OpenAI crawler documentation](https://developers.openai.com/api/docs/bots) identifies OAI-SearchBot as the search-discovery crawler. [Perplexity's crawler documentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) identifies PerplexityBot for search results. The existing wildcard allow rule covers both. Robots permission is not evidence of an actual visit or citation; infrastructure restrictions require separate verification if crawler logs show failures. No training-related policy was changed as part of this work.

## Next steps that depend on real business assets or account access

1. Connect the custom domain to the verified deployment. Once HTTPS and content work there, set `VITE_SITE_URL=https://contentmeshstudios.com`, rebuild, and redirect the old production hostname to matching paths. Keep canonical, sitemap and internal references consistent. See [Google's canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
2. Verify the chosen property in Search Console and Bing Webmaster Tools. Submit the sitemap and inspect the homepage and three service URLs. Confirm Google-selected canonicals; a Lighthouse SEO score is not proof of indexing.
3. Publish three approved case studies: real brief, the studio's role, key creative decisions, final deliverables and evidence-backed results where available. Clearly label concept/spec work. Obtain client permission before naming clients or publishing private results.
4. Add a verified founder/author profile and connect only confirmed business profiles. Owner-supplied bios, portrait permissions and profile URLs are needed; do not invent credentials or social identities.
5. Audit the existing 27 CMS articles for evidence, accuracy, overlap and commercial relevance before expanding output. Prioritize an original annotated production breakdown, a product-fidelity example and a pilot-to-series workflow. Keep meaningful source notes and real update dates.

## Measurement plan

Record an initial 28-day baseline when account access exists. Review index coverage and canonical selection first; then non-brand impressions, clicks, query groups and qualified enquiries by landing page. Compare the next 28 days with the baseline, noting seasonality and site changes. Track AI referrals where visible; manually sample a fixed set of buyer questions and record date, platform and cited URLs without claiming that a small sample represents universal AI rankings. None of these measurements has been configured or collected in this change.

Validation before publishing: 21 tests passed, TypeScript passed and production build passed. Live deployment checks are performed after merge. Ranking growth requires observation over time; no first-place, indexing or AI-citation guarantee is made.
