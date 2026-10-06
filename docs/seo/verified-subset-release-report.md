# Verified subset release — October 6, 2026

User authorized pausing new creation, publishing the already verified subset now, and resuming creation next week. This replaces the earlier all-or-nothing publication requirement. Publication is not completion of the remaining expansion.

## Approved scope

- 174 city hubs and 870 main service-city pages: 1,044 core pages.
- 2,328 compact subservice-city pages across 97 cities.
- 2,060 commercial city pages and 10 regional commercial topic owners.
- Two reviewed commercial overview replacements, existing approved regional service, homepage, project, review, real-estate and indexing changes.
- Exact expansion inventory: `verified-subset-url-inventory.txt`; source gate: `src/data/expansion-release-manifest.json`.
- Six unreviewed Royse City source drafts and all other unapproved general-city routes remain excluded from production and sitemaps. Remaining target work: 2,808 city pages, including those six drafts.

## Verification

- Ordinary production build: 6,251 HTML pages; no preview flags.
- Whole output scan: zero broken local links/assets, missing alt attributes, malformed JSON-LD, H1/canonical errors, missing approved sitemap URLs or leaked unapproved expansion routes. `release-technical-review.json`.
- General core technical checks: 1,044 pages, zero errors; compact technical checks: 2,328 pages, zero errors. Both verify production indexability and sitemap inclusion.
- All 3,372 general pages preserve exactly the marked substantive rendered text that passed full sibling/regional phrase comparisons and independent editorial review. `release-copy-preservation.json`.
- Commercial production audit: all 2,060 city pages pass phrase checks; 2,070 city/regional technical passes; no directory or manifest errors. `commercial-production-review.json`.
- Restored existing real Dallas/Arlington project photos and direct case-study links, plus the four approved FAQs and FAQ schema on the original 30 mold-city pages.
- Review excerpts reconfirmed against their linked public source pages by the release reviewer. Company-wide attribution retained; no Texas review aggregate invented.
- Pending own-license/partner-provider disclosure retained. No new city office or project claims. Homepage completion guarantee and overly categorical moisture wording corrected.
- Browser review at 390 × 844: Greenville compact extraction, Dallas mold, White Settlement commercial sprinkler and commercial property overview loaded images, readable content and no horizontal overflow; mobile navigation opened. H1, introductory copy, CTA and illustration ordering checked on shared templates. Desktop homepage content inspected.
- Private analytics remain outside the repository. No new form submission or lead was generated. Existing Workiz embed and telephone links retained.

## Schedule and deployment

New creation and hourly progress automations are paused. One-time resumption is scheduled for October 13, 2026 at 4:40 PM America/Chicago, restoring the existing recovery/review schedules. Remaining drafts are preserved.

Deployment and live verification are pending at this pre-deployment checkpoint. Follow the repository Cloudflare Pages workflow: an authorized push to main triggers deployment. Record the deployed commit and live evidence after completion.
