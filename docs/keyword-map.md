# Organic search keyword map — 12 September 2026

This extends the September 9 research. Priorities reflect service fit and the intent visible in sampled search results. They are not keyword-volume, difficulty or ranking measurements. No Search Console or paid keyword dataset was available. Variants listed together belong on one page, not separate near-duplicate pages.

| Priority | Keyword cluster | Intent | Destination | Approach |
| --- | --- | --- | --- | --- |
| P1 | AI video production agency; AI video production company | Hire a production partner | `/` | Agency positioning, selected work and service links |
| P1 | AI video production services | Compare capabilities | `/services` | Overview leading to individual production services |
| P1 | AI commercial video production; AI commercial production agency | Commission an ad or campaign | `/services/ai-commercial-video-production` | Creative direction, workflow and scoped deliverables |
| P1 | AI video ads agency; cinematic AI commercials | Buy managed creative production | Same commercial page | Human direction, campaign versions and work examples |
| P1 | AI product video ads; AI product video production | Commission product creative | `/services/ai-product-video-ads` | Accuracy, references, concepts and enquiry |
| P1 | ecommerce product video ads; AI product ads for brands | Buy ecommerce creative | Same product page | Product-specific requirements, not DIY-tool claims |
| P1 | faceless YouTube video production; faceless video editing service | Hire episode production | `/services/ai-youtube-video-production` | Updated search title, description and visible heading |
| P1 | AI YouTube video production; AI documentary video production | Buy narrated or cinematic episodes | Same YouTube page | Continuity, narration timing and pilot workflow |
| P2 | AI video production cost; AI commercial pricing | Compare budget and scope | Commercial page's cost FAQ initially | Confirm actual price data before publishing price ranges |
| P2 | AI product video from photos | Assess feasibility | Product page | Explain supplied assets and fidelity limits |
| P2 | AI video production timeline | Plan a launch | Commercial page's schedule FAQ | Scope-dependent answer, no invented turnaround promise |
| P2 | AI video vs traditional production | Compare approaches | Existing related CMS article | Review its evidence and overlap before expanding or replacing it |
| P2 | AI storyboard generator; script to storyboard | Use a planning tool | `/tools/storyboard-generator` | Keep tool intent distinct from done-for-you production |
| P2 | ContentMesh Studios; ContentMesh portfolio | Brand navigation | `/`, `/about`, `/portfolio` | Consistent identity and actual project evidence |
| P3 | AI video production Pakistan; AI video agency Hunza | Local partner discovery | Existing about/contact pages first | Confirm public business details before adding location markup or a local landing page |
| P3 | AI jewelry video ads; AI beauty product ads | Industry-specific purchase | Product page initially | Add approved specialist work before dedicated industry pages |

P1 means most directly aligned with existing services, not easiest to rank. P2 supports buyer decisions. P3 needs additional evidence or location validation.

## Search evidence and resulting decisions

- Broad agency queries surfaced specialist studios such as [The Dor Brothers](https://thedorbrothers.com/ai-video-production/), [Vimerse](https://vimerse.com/ai-video-production) and [AI Labster](https://www.ailabster.com/). Their result descriptions emphasize managed production and creative direction. This supports distinguishing ContentMesh's agency offering from a generator. Result presence is not a verified ranking position.
- Product-ad queries mixed production services with tools such as [Athana](https://athana.ai/product-video-ads) and [Pixiry](https://pixiry.com/en/). A visitor searching for a generator may want software rather than a quote. Keep the service page explicit about briefing and human production instead of promising instant generation.
- The inspected [Vynex faceless production page](https://vynex.ai/faceless-videos) describes formats, scope and delivery stages. This supports a clearer faceless-production title and visible narration section on ContentMesh's existing YouTube page. Its commercial promises and timelines were not adopted.
- Pakistan searches surfaced [Artx Films](https://artxfilms.com/ai-video-production/) and other national providers. The sampled results do not establish Hunza search demand. No local search volume is claimed.
- A result for Black Vertex's product-ad page returned 404 when opened. It was excluded from detailed competitor analysis; search snippets can be stale.

## Content priorities before adding more pages

1. Publish a product-ad case study with approved references and a clear account of what was generated versus composited. Link it from the product service page.
2. Publish an annotated YouTube pilot breakdown showing narration, storyboard choices and continuity decisions. Use original studio work with permission.
3. Review the existing cost article against current production experience. Separate software subscription costs from a managed service, cite any external comparisons and avoid unsupported savings percentages.
4. Confirm founder/author biographies and public business location. Add verified identities and profiles, not fabricated authority signals.

These are evidence-dependent editorial tasks, not completed publications. No additional generic AI blog posts were generated merely to increase page count.

## Test coverage and interpretation

The new endpoint tests execute the real robots and sitemap route handlers. They check public crawl permission, canonical sitemap declaration, service inclusion, CMS URL encoding, deduplication, truthful dates, exclusion of private URLs, and an uncached 503 with Retry-After when CMS retrieval fails. CMS responses are controlled fixtures; these tests do not prove that production is reachable from Google's network.

Existing tests cover matching canonical/social metadata, JSON-LD escaping, service discovery, published-content rendering, contact validation and CMS failure behavior. TypeScript, lint and a production build are run for the release. Live rendering is a separate verification step. Passing software tests does not establish indexing, organic rankings, leads or AI citations.

## Measurement required after domain connection

Verify the canonical property in Search Console, submit the sitemap, inspect representative URLs and record Google's selected canonical. Establish a 28-day baseline for the clusters above, separating branded/non-branded queries and service landing pages. Track qualified enquiries alongside clicks. Reassess based on observed impressions and conversions before buying tools or commissioning more content. No account-level measurements were available in this session.

## Official guidance used

- [Google Search Essentials](https://developers.google.com/search/docs/essentials): relevant wording in prominent places and accessible links.
- [Google title guidance](https://developers.google.com/search/docs/appearance/title-link): descriptive, concise titles; avoid repeated keyword variants.
- [Google crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable): normal links and meaningful anchor text.
- [Google helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): useful content and demonstrable experience.

The goal is qualified organic discovery. First-place rankings and a fixed timeframe cannot be established by this implementation or its tests.

## September 12 verification results

All 24 automated tests passed, including three new crawl-endpoint contract tests. TypeScript and the production build passed. The existing live YouTube service page rendered with one H1 and the expected canonical. A new direct robots request again returned a browser client block; a shell HTTP request timed out. Therefore live robots/sitemap reachability from crawlers remains unverified here. This is a test-environment limitation, not evidence that Google is blocked or that the site is indexed.

Subsequent independent Lighthouse verification on the production product-ad service page scored **91/100/100/100 mobile** and **100/100/100/100 desktop** (Performance/Accessibility/Best Practices/SEO). The expanded SEO checks passed successful HTTP status, crawlable links, valid robots.txt, valid canonical and no indexing block. This provides independent confirmation of the robots audit despite the direct-fetch limitation above; it does not prove sitemap correctness in production or actual index inclusion. The audit sampled one service page, not every URL.

- [Mobile report](https://pagespeed.web.dev/analysis/https-contentmesh-creative-hub-d8c6b5df-vercel-app-services-ai-product-video-ads/3mqoozec6h?form_factor=mobile)
- [Desktop report](https://pagespeed.web.dev/analysis/https-contentmesh-creative-hub-d8c6b5df-vercel-app-services-ai-product-video-ads/3mqoozec6h?form_factor=desktop)

PR #10 passed CI and merged as `47c27e09ec982b9bb86b679a8a465047eb9a6264`. The tested product-page content is unchanged by that keyword-title update.
