# ContentMesh quality audit — 14 September 2026

Assessment: the site is not yet at a top-tier bespoke studio standard. Budget is not a measurable quality score. Strong art direction, substantive content, reliable interactions and measured performance matter more than decorative effects.

## Evidence and limits

Reviewed main commit a3e9025b45fe495057d278726b81b2e6f5485b13: shared navigation/footer/layout, homepage hero/services/portfolio, About, Contact, Blog, service and portfolio routes, root error handling, and entry points for the storyboard and legal pages. Findings also reference the earlier session's live screenshots. This is a repository-led audit, not a new complete visual audit: public page retrieval failed and no local execution/browser environment is available. No fresh Lighthouse scores, mobile screenshots, search rankings or API delivery claims are made.

## Changes in this pass

- Services: replace CMS position-based icon assignment with service-type matching; use relevant descriptions when CMS text is incomplete; preserve published features.
- Portfolio: surface published briefs/descriptions on cards without inventing results.
- Hero: wait for playback before timed rotation, suspend rotation during buffering, preserve playback choice during navigation, and reserve space beside controls for chat.
- Chat: 20-second timeout, accurate assistant label, Escape close and focus return, conversation announcements, larger controls, shrinkable input.
- Blog: exclude entries without usable slugs, replace misleading empty-catalogue reset with a service link, and make grid content initially visible.
- About: compact identity treatment when portraits are missing; readable full bios.
- Footer: direct links to existing service pages and larger social targets.

## Remaining launch-quality work

1. Publish three substantial case studies with real poster images, a clear brief, ContentMesh's exact role, production decisions, deliverables, and verifiable results where available. Mark concept work honestly. These facts cannot be inferred from project titles.
2. Finish CMS service entries with precise descriptions and agreed deliverables. Fallback text is resilience, not a substitute for authored content.
3. Add an optimized poster to each hero slide and supply compressed web video variants. Missing posters still leave a color fallback before playback. No imagery or video encodes were fabricated here.
4. Connect the final domain, verify the public enquiry address, and use a branded mailbox when available. Publish approved founder/team portraits.
5. Inspect 360px, 390px, 768px and wide desktop layouts, 200% zoom, keyboard paths, reduced motion and Safari/Firefox/Chrome. Check crops, video loading, focus and chat overlap over real content.
6. Run mobile/desktop Lighthouse across homepage, portfolio, services, service articles, blog, contact and the storyboard tool. Verify contact and AI delivery using authorized test messages and actual configured credentials.
7. Give the substantial storyboard application its own functional pass. Have the owner review legal pages against actual operations; this pass does not certify them.

## Validation

Two SSR regressions cover reordered/sparse service descriptions and published project context. GitHub's existing quality workflow runs tests, TypeScript, lint and production build. CI outcomes are recorded on the pull request. A successful build does not establish visual quality or Lighthouse scores.
