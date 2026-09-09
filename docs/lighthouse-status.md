# Lighthouse optimization status — 9 September 2026

Production: https://contentmesh-creative-hub-d8c6b5df.vercel.app/

Application revision: `9caa72415df084f40786c3deaca09ab0847efac1` (PR #8). Vercel deployment and the main-branch validate check both succeeded. Live article DOM confirms eager, high-priority responsive cover images.

**The target of 100 in every category across the entire website has not been achieved.** Results below are individual PageSpeed Insights Lighthouse runs, not field measurements or a repeated-run median. No CrUX data was available. Scores vary between runs.

## Latest measured results

Order: Performance / Accessibility / Best Practices / SEO.

| Page | Mobile | Desktop | Measurement |
| --- | --- | --- | --- |
| Homepage | 93 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | Sep 8, PR #7 |
| Portfolio | 93 / 100 / 100 / 100 | — | Sep 8, PR #7 |
| Contact | 91 / 100 / 100 / 100 | — | Sep 8, PR #7 |
| Services | 91 / 100 / 100 / 100 | — | Sep 8, PR #7 |
| About | 90 / 100 / 100 / 100 | — | Sep 8, PR #7 |
| Privacy | 94 / 100 / 100 / 100 | — | Sep 8, PR #7 |
| Terms | 92 / 100 / 100 / 100 | — | Sep 8, PR #7 |
| Storyboard generator | 89 / 100 / 100 / 100 | — | Before PR #7 |
| Blog index | 85 / 100 / 100 / 100 | 99 / 100 / 100 / 100 | Sep 9, PR #8 |
| Article: The Real Cost of AI Video vs. Hiring a Film Crew in 2025 | 86 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | Sep 9, PR #8 |

These are representative final checks, not a claim that all 36 audited URLs now have these scores. The earlier full audit attempt is retained in `lighthouse-intermediate.json`, including unsuccessful runs and measurements spanning deployments.

## Direct reports

- [Homepage mobile](https://pagespeed.web.dev/analysis/https-contentmesh-creative-hub-d8c6b5df-vercel-app/p2opee4izc?form_factor=mobile)
- [Homepage desktop](https://pagespeed.web.dev/analysis/https-contentmesh-creative-hub-d8c6b5df-vercel-app/p2opee4izc?form_factor=desktop)
- [Blog mobile](https://pagespeed.web.dev/analysis/https-contentmesh-creative-hub-d8c6b5df-vercel-app-blog/rts1yaq1d5?form_factor=mobile)
- [Blog desktop](https://pagespeed.web.dev/analysis/https-contentmesh-creative-hub-d8c6b5df-vercel-app-blog/rts1yaq1d5?form_factor=desktop)
- [Article mobile](https://pagespeed.web.dev/analysis/https-contentmesh-creative-hub-d8c6b5df-vercel-app-blog-the-real-cost-of-ai-video-vs-hiring-a-film-crew-in-2025/p0337c1flq?form_factor=mobile)
- [Article desktop](https://pagespeed.web.dev/analysis/https-contentmesh-creative-hub-d8c6b5df-vercel-app-blog-the-real-cost-of-ai-video-vs-hiring-a-film-crew-in-2025/p0337c1flq?form_factor=desktop)

## Changes shipped in PRs #5–#8

- Self-hosted fonts and inlined generated CSS removed external font CSS and the separate blocking stylesheet request. Fonts use optional display and preloads.
- Homepage video and contact map load on explicit interaction.
- Fixed low-contrast text, heading order and missing form-control labels.
- Replaced the public Sanity SDK query client with a small published-content HTTP client; preserved Studio behavior.
- Added eager, high-priority responsive blog covers and article cover preloads.

Before these fixes, homepage mobile measured 75 / 96 / 96 / 100; its latest confirmed measurement is 93 / 100 / 100 / 100. The image-priority change alone did not improve the final mobile score in these individual runs: the previously measured blog/article scores were 87/87, versus 85/86 now. It must not be described as a demonstrated overall performance increase.

## Remaining work and evidence

The latest article run measured FCP 2.205 s, LCP 3.376 s, TBT 0 ms, CLS 0 and Speed Index 4.675 s. Its LCP diagnostic reports 410 ms resource-load delay, 320 ms resource-load duration and 1,830 ms element-render delay. The blog diagnostic reports 130 ms resource-load delay, 220 ms resource-load duration and 1,920 ms element-render delay. Diagnostic subparts and simulated scoring metrics are different measurements and should not be added to reconstruct the score.

Remaining investigation should focus on a controlled rendering trace and repeatable mobile measurements before more code changes. The article does not have an opacity entrance animation; guessing that animation causes this delay would be incorrect. Lighthouse also identifies unused JavaScript and image-delivery savings. These are opportunities to investigate, not proof that deleting functionality will improve the score.

Validation: 19 automated tests passed, TypeScript passed, production build passed, and lint had zero errors (nine existing Fast Refresh warnings). PR #8 and merged-main CI passed.

The custom domain is not connected. SEO audit scores do not establish indexing or rankings. This verification covers Vercel production, not the legacy Cloudflare Workers deployment.
