# ContentMesh release notes

This change prepares the application for `https://contentmeshstudios.com`, the production domain selected by the owner. It does not configure DNS, deploy the Cloudflare Worker, submit a sitemap, or certify search rankings.

## Before merging to the connected production branch

1. **Rotate the exposed provider credentials.** The original repository embedded Resend and DeepSeek keys, including encoded copies. Those values have been removed from application code but remain in the existing Git history. Revoke them at the providers, then configure fresh secrets on the production Worker. Do not rewrite published Git history: this project syncs with Lovable.
2. Configure `RESEND_API_KEY` and `DEEPSEEK_API_KEY` as server secrets. Never prefix them with `VITE_`, commit them, or paste them into an issue. The app now fails honestly when credentials are absent: the enquiry form offers direct email, the studio assistant has a service-information fallback, and storyboard generation returns 503.
3. Configure `CONTACT_EMAIL` as the intended enquiry recipient. The preserved repository fallback is `waheed.sul00@gmail.com`. Set `CONTACT_FROM_EMAIL` to a sender on a domain verified in Resend. The default `onboarding@resend.dev` sender is suitable only for the provider's restricted onboarding mode. The frontend cannot override recipients, and no automatic visitor email is sent.
4. Bind `contentmeshstudios.com` to the existing Worker and verify its TLS certificate. Point `www` to the same application if used; requests to that hostname redirect to the apex domain. Keep the existing workers.dev deployment until the custom domain is confirmed working.
5. Verify published Sanity site settings, contact details, portfolio, testimonials, stats and blog posts. The public project/dataset configuration remains `ru6ynu80` / `production`, overridable through the existing `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` settings. CMS content is included in server HTML. Configure the real WhatsApp number in site settings; otherwise the button uses the existing contact email.
6. Add Cloudflare edge rate limits for the public AI and contact endpoints. The application includes bounded JSON input, same-origin checks and **per-process burst limits**, which are not a globally shared quota or a substitute for edge protection across Worker isolates. Confirm provider spending limits.

## What changed

- Clearer homepage hierarchy, consistent page headers, responsive navigation and service cards. The accepted sliding orange-border active navigation state remains, with separate orange and blue brand accents.
- Service details and portfolio media use keyboard-accessible modal behavior. Showcase playback can be paused and respects reduced-motion and page visibility. Service browsing no longer captures vertical scrolling or renders four copies of every item.
- Real CMS content renders in initial HTML, with shared client caching. Placeholder testimonials, team members, metrics, articles, social links and portfolio clients no longer appear as published evidence. Existing CMS records are preserved.
- The nonfunctional newsletter form is replaced with a project enquiry link. Contact inputs have labels, validation associations, useful autocomplete, accessible status, direct email/phone links and clear next steps.
- Canonical and social URLs use the confirmed domain. Published blog posts have canonical URLs and BlogPosting data. Missing articles throw a real route not-found response; CMS failures do not manufacture a missing article. Sitemaps include published CMS articles and real modification dates, escape XML and return a temporary failure instead of caching a partial article list during a CMS outage.
- Private Studio and API responses have noindex headers. YouTube privacy-enhanced embeds and Google Drive media hosts are allowed by the existing CSP.
- Contact delivery uses a server-owned recipient and escaped HTML. Public API requests have size/type checks, burst limits, bounded provider concurrency and timeouts. Client-supplied chat system messages are ignored.
- Fixed missing image imports, storyboard scene typing, dependency-lock installation errors and inaccurate estimated-runtime rounding.

## Verification

Run with Node 22.12+ (CI uses Node 24):

```sh
npm ci
npm run test
npm run typecheck
npm run lint
npm run build
```

The automated tests cover server-rendered CMS content, empty-content behavior, metadata, sitemap encoding, contact schema safety, request limits, malformed API inputs, and missing-secret failure states. They do not send emails or spend AI credits.

The production bundle builds locally. A cloud-browser inspection of the existing deployed homepage was completed before the changes. The modified pages have not had an interactive mobile/desktop browser pass because this environment could not reach the development preview. No Lighthouse score or live email/AI delivery result is claimed.

## Release acceptance

After the configuration above and deployment:

- Check the homepage, services, portfolio playback, an actual CMS article, contact, Studio and storyboard tool on desktop and mobile. Check keyboard focus, modal Escape/return focus, menu navigation and reduced motion.
- Send one approved test enquiry, verify delivery to the configured studio mailbox, and confirm the sender domain is verified. Run one approved storyboard request.
- Fetch `/robots.txt` and `/sitemap.xml` from the custom domain. Confirm every sitemap URL returns its intended content and canonical URL. Verify missing article/page responses return 404 and `/studio` returns noindex.
- Inspect the domain in Google Search Console and submit `https://contentmeshstudios.com/sitemap.xml`. Preserve the existing Google verification file. Request indexing for the homepage and primary service page, then monitor crawl and indexing reports.
- Run Lighthouse/PageSpeed on the deployed custom domain. Measure real field performance after sufficient traffic; local bundle checks cannot establish Core Web Vitals.

Google references: [canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) and [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap). Sitemap submission assists discovery; Google decides whether and when to index.
