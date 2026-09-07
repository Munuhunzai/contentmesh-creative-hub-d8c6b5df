# ContentMesh design and customer-experience review

Reviewed 7 September 2026. This is a refinement of the production-ready source merged in PR #3, not a claim that the website has a particular monetary value or conversion rate.

## Live review findings

The Cloudflare site at `https://contentmesh-creative-hub.waheed-sul00.workers.dev/` still serves the older design. Browser inspection of its homepage and portfolio showed the repeated service carousel, old hero/navigation labels, default Featured portfolio filter, and legacy footer. It does not serve the source merged in PR #3. Vercel's successful deployment status does not establish that Cloudflare updated.

The owner completed sign-in to the protected Vercel branch preview. The updated homepage, portfolio, service details and contact journey were then inspected in the browser. A temporary same-origin frame harness allowed responsive layout checks at 360, 390, 768 and 1024 pixels, alongside the full desktop browser. These are desktop-browser responsive checks, not physical-device tests. The temporary harness was removed after review.

Observed checks: showcase pause changed to play; project dialogs opened; Escape restored focus to the originating project; project and service references appeared in an editable contact brief; invalid enquiries focused the first missing field without sending mail; mobile navigation opened and routed correctly; portfolio pagination changed 12 of 67 entries to 24 of 67; filtering to Reels produced two entries. Inspected layouts did not show horizontal overflow. Google Drive fallback rendered its player; full playback across every third-party video is not certified.

The review found and fixed rich-text service descriptions being treated as strings, unfinished short service copy, an excessively long initial portfolio listing, and floating controls overlapping the mobile enquiry form. The contact page now omits those floating overlays.

## Refinements in this change

- A split editorial hero separates the message from the film, keeping the actual CMS showcase visible. The blue/orange brand is used consistently across type, controls and section transitions. Existing media pause, navigation, visibility and reduced-motion behavior is retained.
- The homepage leads with up to four selected projects, followed by three capabilities and a link to the full catalogue. The full portfolio opens on All work and displays category counts, so unfeatured projects are discoverable.
- Project previews use responsive image elements with explicit dimensions and lazy loading. Captions sit outside the images for reliable readability. Every card has a visible action; image-only projects are not misleadingly labelled as playable videos.
- A project or service reference carries into the contact form through a bounded search parameter. The visitor can edit the resulting brief before submitting. This does not submit an enquiry automatically.
- Sanity portfolio items have optional project type, brief, creative approach, deliverables and result fields. Existing documents remain valid. Unpopulated details are omitted. Concept/personal work can be labelled explicitly; results are never invented.
- The studio approach section replaces a stock photograph that was labelled as the ContentMesh team. Three production stages explain the client's review points without repeating six narrow cards.
- FAQ defaults answer practical buying questions without unsupported turnaround, savings or rights guarantees. Published CMS copy still takes precedence and needs the owner's editorial review.
- Testimonials are semantic, readable quotations. The former nonfunctional pagination and clickable-card behavior are removed. Ratings display only when supplied and valid; an unrated review no longer becomes five stars.
- Page headers, about copy, enquiry guidance and closing calls to action use a consistent voice. The accepted sliding navigation selection remains intact.

## Verification

The automated suite includes the existing API, SEO and server-rendering checks plus coverage for full versus curated portfolio visibility, compact versus full services, and honest testimonial ratings. TypeScript, ESLint and the production build are required before publishing the branch.

## Finish before calling this launch-ready

1. Deploy the verified candidate to the intended production host. Confirm the visible hero reads “Your story. Worth watching.” to distinguish it from the older Cloudflare version.
2. Supplement the completed responsive checks with physical iOS/Android testing and a production browser smoke test.
3. Check third-party media on production, including blocked/unavailable files and browser autoplay restrictions; verify reduced motion on a physical device.
4. Test real contact and AI delivery after replacement provider credentials are configured. Form validation and reference handoff were checked without sending messages.
5. Review published CMS content. Mark concept studies accurately, add a concise real brief and creative approach to priority projects, and publish only results and testimonials that can be substantiated.
6. Resolve the Cloudflare deployment gap, configure replacement provider credentials, and connect the intended custom domain. The launch requirements in `docs/RELEASE.md` still apply.
7. Measure the deployed production site with Lighthouse/PageSpeed and test real delivery only with the correct provider configuration. No updated Lighthouse score or conversion uplift is asserted here.
