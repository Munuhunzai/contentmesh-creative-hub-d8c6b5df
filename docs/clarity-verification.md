# Clarity integration and verification

Project: yugwoztd8k. Production: https://contentmeshai.com.

Clarity is loaded asynchronously only after explicit analytics acceptance. Advertising storage remains denied. No third-party Clarity requests occur before acceptance. The consent choice expires after 180 days; blocked browser storage falls back to a session-only choice. Preview domains, CMS, API, auth/admin and tools routes are excluded. Navigating into an excluded route after recording triggers a reload to stop the recorder. All page text is masked, retaining layout/click/scroll information. No identify calls or personal-data custom events are sent.

CSP permits HTTPS Clarity subdomains under script-src/connect-src/img-src, and c.bing.com under connect-src/img-src, following Microsoft's endpoint guidance. Other restrictions are preserved.

## Release acceptance checks

1. Use a fresh browser on production. Before consent and after Reject analytics, confirm no clarity.ms script or collection requests and no _clck/_clsk cookies.
2. Accept analytics. Confirm exactly one asynchronous /tag/yugwoztd8k request and successful /collect requests, with no CSP violations. Browse portfolio/services, scroll and click a project; avoid submitting real personal information.
3. Reload and navigate between public pages: acceptance persists and no duplicate script is inserted. Check contact, portfolio video and navigation still function.
4. Open Privacy choices, reject, confirm recording stops after reload; revisit and confirm it stays disabled. Verify excluded routes do not load the recorder, including after a public-page SPA transition.
5. In the signed-in Clarity project, confirm this test session arrives and replay/heatmap clicks and scrolling are useful while text/input content is masked. Check the configured project URL, masking and retention settings. Reporting may take time; a successful network request alone does not prove dashboard ingestion.
6. Compare page responsiveness before/after acceptance. No analytics package is added to the main bundle; the vendor script remains optional and async.

## Investigation on 2026-10-19

Current main contained no tracking integration. Live HTTP 200 response had CSP without Clarity permissions. Dashboard session was expired, so project configuration and ingestion require authenticated verification. Local unit tests cover consent expiry, malformed consent, production host gating and excluded routes. Browser network/replay acceptance remains a separate release requirement.

References:
- https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-csp
- https://learn.microsoft.com/en-gb/clarity/setup-and-installation/cmp-integration-guide
- https://learn.microsoft.com/en-us/clarity/setup-and-installation/privacy-disclosure
