# ContentMesh design and customer-experience review

Reviewed 7 September 2026. This is a refinement of the production-ready source merged in PR #3, not a claim that the website has a particular monetary value or conversion rate.

## Live review findings

The Cloudflare site at `https://contentmesh-creative-hub.waheed-sul00.workers.dev/` still serves the older design. Browser inspection of its homepage and portfolio showed the repeated service carousel, old hero/navigation labels, default Featured portfolio filter, and legacy footer. It does not serve the source merged in PR #3. Vercel's successful deployment status does not establish that Cloudflare updated.

The existing Vercel branch preview redirects this browser to Vercel sign-in. The working local server starts on loopback, but is not reachable by the cloud browser; binding the advertised preview hostname is unavailable in this execution environment. Therefore no updated-page mobile, desktop, keyboard or media-playback browser pass is claimed.

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

1. Open the updated branch preview with an authorised Vercel session, or deploy the candidate to the connected Cloudflare environment. Confirm the visible hero reads “Your story. Worth watching.” to distinguish it from the older live version.
2. Check widths of 360, 390, 768, 1024 and 1440 pixels. Review long CMS titles/descriptions and both populated and empty states. Confirm no horizontal overflow or clipped controls.
3. With keyboard and touch, check the navigation menu, selected-state slide, portfolio filters, project dialog, Escape/focus return, FAQ, media controls and reduced-motion preference.
4. Open a project, choose “Create something like this”, and confirm the reference reaches the contact form and remains editable. Verify that closing the project releases scroll locking.
5. Review published CMS content. Mark concept studies accurately, add a concise real brief and creative approach to priority projects, and publish only results and testimonials that can be substantiated.
6. Resolve the Cloudflare deployment gap, configure replacement provider credentials, and connect the intended custom domain. The launch requirements in `docs/RELEASE.md` still apply.
7. Measure the deployed production site with Lighthouse/PageSpeed and test real delivery only with the correct provider configuration. No updated Lighthouse score or conversion uplift is asserted here.
