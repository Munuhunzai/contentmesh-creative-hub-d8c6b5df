# ContentMesh SEO research and action plan

**Site:** https://contentmeshai.com/  
**Audit date:** 30 September 2026  
**Working market:** English-speaking clients worldwide. No country-specific landing pages were invented.

## What the evidence says

The homepage is already indexed: Google Search Console URL Inspection returned **“URL is on Google / Page is indexed.”** The sitemap was successfully read on 29 September, with **39 discovered pages**. Discovery is not proof that all 39 are indexed. The overall indexing and performance reports were still processing, so there is no trustworthy query, click, impression or ranking baseline yet.

A direct HTTP crawl covered all 39 sitemap URLs, signup, a nonexistent page, the www address and the default Vercel hostname. Every sitemap URL returned 200 and a self-referencing production canonical. The nonexistent page returned a genuine 404. All 27 blog articles were present in server HTML. Titles were unique. The homepage H1 contains two text fragments within one heading, not two headings.

Two issues were confirmed: the storyboard page initially returned only 96 visible words including navigation/footer and no H1 while checking authentication; signup had a generic title and no indexing directive or canonical. The www hostname failed certificate validation. The default Vercel host already points search engines to the correct production canonical.

### Existing performance baseline

| Homepage lab report, 30 September | Mobile | Desktop |
|---|---:|---:|
| Performance | 83 | 95 |
| Accessibility | 100 | 100 |
| Basic SEO checks | 100 | 100 |
| Largest Contentful Paint | 3.8 s | 0.8 s |
| Cumulative Layout Shift | 0 | 0 |
| Total Blocking Time | 0 ms | 0 ms |

Sources: [mobile PageSpeed report](https://pagespeed.web.dev/analysis/https-contentmeshai-com/nqq1g52ud1?hl=en&form_factor=mobile), [desktop report](https://pagespeed.web.dev/analysis/https-contentmeshai-com/0vjg8np92g?hl=en&form_factor=desktop). These are existing same-day simulated measurements, not before/after proof of this update. No real-user Core Web Vitals dataset was available. Mobile LCP identified the hero description, with render delay; do not assume compressing images alone will fix it. Investigate a performance trace before changing the hero or loading strategy further.

## Search and competitor research

Queries researched included AI video production agency, AI commercial video production services, AI product video ads, AI video production cost, and script-to-storyboard generators. This was qualitative search-intent research; no paid keyword-volume or difficulty dataset was available. The order below reflects commercial relevance and fit, not invented traffic estimates.

| Audience / query cluster | Primary destination | Intent and positioning |
|---|---|---|
| AI video production agency / studio | Homepage | Hire a team; explain human direction and show relevant work |
| AI video production services | /services | Compare deliverables and choose a production route |
| AI commercial video production / AI commercials | /services/ai-commercial-video-production | Campaign brief, process, revisions, formats and examples |
| AI product video ads / ecommerce video production | /services/ai-product-video-ads | Product fidelity, platform formats and launch assets |
| Faceless YouTube video production / editing service | /services/ai-youtube-video-production | Script, narration, pacing and a repeatable channel workflow |
| AI storyboard prompt generator / script to storyboard | /tools/storyboard-generator | Useful public example, accurate capabilities, account and credit limits |
| AI video production cost | Existing pricing-breakdown blog article | Scope education that leads to a quote, not unsupported fixed prices |
| AI tools vs production agency | Existing tools-vs-full-service article | Help buyers decide whether they need a tool or a team |
| AI video quality / brand consistency | Existing quality-control article | Practical review guidance leading to relevant services |

### Lessons from relevant first-party pages

- [Open A to Z](https://www.openatoz.com/) presents video ads around specific buyer groups, visible work, formats, process and FAQs. **Application:** connect existing commercial/product service pages to work and useful buying guides. Its own performance claims were not independently verified or copied.
- [Real AI Video](https://www.realaivideo.com/) focuses on agency production and human direction. **Application:** make ContentMesh's role in the production process concrete; add white-label positioning only if it is actually offered.
- [Lemonlight's cost guide](https://www.lemonlight.com/blog/ai-video-production-cost/) addresses a decision buyers need before requesting proposals. **Application:** strengthen and maintain the existing ContentMesh cost article rather than publish another competing cost URL.
- [Screenweaver](https://www.screenweaver.ai/ai-storyboard-generator) shows what a storyboard tool produces. **Application:** add a public example and distinguish written scene prompts from rendered images or finished videos.

## Changes prepared in this update

1. Restore a substantive public storyboard landing page in the initial server HTML, including H1, an explicitly illustrative example, workflow, limitations, credit explanation, FAQs and links to services. Actual generation remains behind confirmed signup and the existing server quota.
2. Align the tool title, description and WebApplication data with its real text-planning capabilities.
3. Give signup a specific title, canonical and **noindex, follow**. Keep it crawlable so Google can read that directive; it remains absent from the sitemap.
4. Link the homepage and three service detail pages to existing cost, tool-vs-service and quality-control guides, plus the storyboard tool. Preserve established URLs and existing article content.
5. Make the homepage eyebrow identify the service as an AI video production agency and align the public contact fallback/Organization email with **info@contentmeshai.com**.
6. Add **www.contentmeshai.com → contentmeshai.com** as a Vercel 308 redirect. Verified with normal TLS validation: `/services?ref=seo` redirects to the same path and query and the destination returns 200.
7. Correct an existing root error-component type to accept the router's `unknown` error type; this resolves the cascading typecheck errors without changing runtime behavior.

These changes follow Google's guidance on [renderable JavaScript content](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [crawlable internal links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [canonical consolidation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), and [noindex directives](https://developers.google.com/search/docs/crawling-indexing/block-indexing). A sitemap assists discovery; it does not guarantee indexing or rankings. See [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Highest-value next content work

### First 30 days

- Establish Search Console baseline when reports finish processing: weekly clicks, impressions, CTR and average position by page/query. Separate branded ContentMesh queries from non-branded commercial queries and tool queries.
- Review the two cost articles for overlap: “How Much Does AI Video Production Cost?” and “The Real Cost … in 2025.” Update documented examples and dates only when substantively reviewed; consolidate only after checking impressions and incoming links.
- Review overlapping agency-selection articles (“What Makes a Leading…”, “What to Look for…”, and in-house-vs-outsourced). Give each a distinct buyer question; do not mass-delete or redirect without evidence.
- Add one real production case study with permission: brief, actual work, constraints, delivered formats, process images and outcomes supported by records. Label concept/spec work clearly. No fabricated client metrics or testimonials.
- Review blog claims such as “highest ROI,” “24 hours,” tool rankings and price ranges against sources or actual project records. Add a named, real reviewer with relevant experience. Generic volume content is a lower priority than evidence buyers can inspect.

### Days 31–60

- Expand the service cluster earning non-branded impressions. Update the existing page to answer those queries before creating additional URLs.
- Publish a second verified case study in the next strongest service category.
- Improve mobile LCP using a measured trace and compare repeated lab runs; use field data when available.
- Seek relevant earned links through approved client project credits, partner listings and original workflow demonstrations. No link purchases, bulk directory spam or unsolicited outreach sent in this task.

### Days 61–90

- Compare consecutive 28-day Search Console periods by landing page and query, accounting for low sample sizes.
- Investigate pages getting impressions but weak clicks; refine titles to match actual content and buyer intent.
- Measure qualified enquiries from organic landing pages and successful tool signups separately. Search Console cannot measure enquiries; confirm analytics/consent requirements before adding tracking.
- Consolidate genuinely redundant articles using evidence, permanent redirects and updated internal links.

## Success criteria and limitations

Primary business measure: qualified production enquiries from organic visitors. Secondary measures: non-branded clicks to the three service pages, useful tool signups, index coverage and engagement with actual portfolio work. Tool traffic alone is not evidence of qualified client demand.

No ranking, traffic or backlink growth is guaranteed. No paid campaigns, subscriptions or purchases were created. No automated recurring work has been scheduled. Real case studies, confirmed pricing and business credentials need the owner's evidence.

## Validation

Production build and TypeScript checks passed locally. Existing suite: **27/28 passed**. The one failure is an older API expectation for malformed unauthenticated storyboard requests (expected 400; the new signup gate returns 503 when Supabase is unconfigured in the test environment). The SEO changes do not alter that API; it is recorded rather than weakening authentication to satisfy an outdated test. Final live verification and indexing-submission results are recorded below after deployment.
