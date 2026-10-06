# Go Green TX mold SEO project brief

Updated October 1, 2026. This brief carries the business context, verified access, preliminary findings, and next steps into the local Codex project.

## Objective

Compete for first-place organic results for relevant mold removal and mold remediation searches, with Dallas and Collin County as the initial priority. Add Google Maps visibility measurement once Business Profile verification is complete. Measure qualified calls, inquiries, and booked jobs alongside rankings. First place is a target, not a guaranteed outcome.

## Business context

- Website: https://gogreenrestorationtx.com/
- Repository: https://github.com/gouki230/gogreenrestorationtx
- Address confirmed by the user through the website: 611 S State Hwy 78, Suite 133B, Wylie, TX 75098.
- Customers can visit the location; most work occurs at customers' properties.
- Wider service area: DFW. Initial priorities: Dallas and Collin County.
- Existing Collin County city records include Plano, Frisco, McKinney, Allen, Prosper, and Wylie. Additional cities require demand and service-coverage validation.
- User confirms a pending Texas Mold Remediation Contractor license. Confirm issue date, license number, and any applicable company licensing status before changing current service scope or making licensed-service claims.
- User reports Google Business Profile verification pending. Connector access alone does not prove verification.

## Business updates from this session

- User supplied three Google profile links for existing company locations: https://share.google/OsKMTrVF4uN7x1nXu, https://share.google/ZcsTnNpGL9HHc2Tvu, and https://share.google/eTddVuQB3a0WKNHAg. Browser redirects identify the first two as searches for Go Green Restoration Los Angeles with distinct Google entity IDs; the third as Go Green Restoration. Google presented CAPTCHA challenges, so profile addresses, ratings, review counts, and individual reviews remain unverified. Do not infer that the three links represent three confirmed operating offices or total their reviews before verification.

- User confirms the deployed Workiz form, inquiry delivery, and thank-you redirect work. The thank-you page and supplied Workiz embed were deployed with explicit deployment authorization; broader SEO changes remain proposals.
- Mold license is still pending; the user agrees to wait. Current scope restrictions remain in place until issued credentials and applicable company status are verified.
- User reports Texas job photos are available. Use the gitignored local photo-intake/ folder, grouped by job, with city, approximate date, actual work, image phase, and publication permission. Keep original customer details and GPS metadata out of published derivatives.
- User states Texas and California operate as the same company, Go Green Restoration Inc. Use the agreed company-wide heading “What Go Green Restoration customers say” with source links. A California heading is not required; do not relabel reviews as Texas projects. Do not imply Texas reviews or use California totals as a Texas location rating. User reports no public Texas reviews or public profiles yet; earlier connector access does not establish a verified public profile.
- User reports capability in mold removal, remediation, and sanitation, reliable coverage throughout DFW, and a realistic one-hour emergency arrival at the property (explicitly clarified by the user). These are owner-reported capabilities and timing, not a change in verified licensing scope or an unconditional arrival guarantee.
- User reports additional DFW offices are planned/opening. Only Wylie is presently confirmed; verify each new address, opening date, staffing, customer access, and hours before representing it as an operating office.

## Workspace status

Permanent local clone: /Users/reynaldoaquije/Projects/gogreenrestorationtx.

The repository is cloned and project notes are prepared. Registration as a local Codex sidebar project still requires the user to add this folder. Computer-use access to Codex itself was denied; no alternate UI-control mechanism was attempted.

Suggested project name: Go Green TX — Website & SEO. The existing conversation is in the separate Go Green Restoration ChatGPT project.

## Connected data

GitHub code access and Windsor access to the Texas Search Console property are confirmed. Windsor also exposes two Texas GA4 properties and a Texas Business Profile. Both GA4 properties return website activity and localhost activity; resolve intended measurement property, stream mapping, and duplicate collection before drawing conversion conclusions. Do not sum their results.

Search Console supports the site's existing visibility analysis. It does not provide total competitor keyword demand or a location-grid view of Maps rankings. Additional useful evidence includes competitor keyword/backlink exports, a local rank grid after verification, call tracking and lead outcomes, and genuine completed-job evidence.

DataForSEO is under consideration, not purchased or connected. Its official pricing is usage-based with a $50 minimum payment, and it publishes an official MCP integration. Start with a bounded keyword and competitor baseline before recurring collection. Relevant references: https://dataforseo.com/pricing and https://github.com/dataforseo/mcp-server-typescript. No matching plugin was returned by the available directory search; directory results are not exhaustive.

## Initial code findings

These findings come from a source review, not a completed runtime or indexing audit.

1. src/pages/services/index.astro substitutes “your” for city and county placeholders, producing broken service descriptions.
2. src/pages/services/[service].astro and src/pages/index.astro still use “Southern Texas.”
3. Homepage claims 500+ and 600+ reviews while its aggregateRating claims one 5-star review. src/data/google-reviews.json contains no reviews. Reconcile all claims against genuine evidence.
4. src/pages/locations/dfw-metro/[city].astro creates a LocalBusiness address in each service city. Represent the actual Wylie business and its service areas consistently.
5. BaseLayout contains GA4 initialization. No explicit successful-form or telephone-click events were found in the inspected source. Verify runtime and GA4 settings before concluding that conversions are untracked.
6. Sitemap configuration sets lastmod to build time for all pages. Investigate whether modification dates can reflect substantive content updates.
7. Existing content includes city/service templates and a large article dataset. Evaluate indexed pages, genuine differentiation, search intent, internal links, and competing pages before expanding output.

## Audit sequence

1. Validate measurement: GA4 property selection, production hostname filters, successful inquiry tracking, phone-click versus answered-call attribution.
2. Extract Search Console page/query/device/country trends and compare equal periods. Separate mold services from testing/inspection intent and branded searches. Respect anonymized-query and row limits.
3. Crawl production URLs and compare with source routes, sitemap, redirects, canonicals, structured data, and indexing evidence.
4. Research current competitors for mold removal/remediation in Dallas and priority Collin County cities. Compare intent, proof of experience, links, service offerings, and page quality; do not treat generic web-search ordering as a precise local rank tracker.
5. Build a keyword-to-page map and prioritized fixes, with expected business benefit, evidence, effort, and dependencies.
6. Prepare service-content updates for verified license issuance. Add authentic case studies and proof of work as supplied.
7. After Business Profile verification, measure Maps visibility at multiple locations, audit accurate categories/services/hours, and develop a genuine customer-review process.

## Needed from the business

- Expected issuance date for the Texas Mold Remediation Contractor license; company licensing status remains unconfirmed.
- User has none of the SEO/rank/call tracking tools discussed and is considering DataForSEO. Evaluate costs and connectivity before any purchase or paid API use.
- Completed mold projects by city, usable photos, accurate credentials, and customer testimonials with appropriate permission.
- Highest-value mold job types, typical job value, service capacity, and actual response coverage.

## Reference guidance

- Google local rankings depend on relevance, distance, and prominence: https://support.google.com/business/answer/7091
- Google states that no one can guarantee a number-one ranking: https://developers.google.com/search/docs/fundamentals/do-i-need-seo
- Texas distinguishes mold remediation contractor and company licensing: https://www.tdlr.texas.gov/mld/mldcontractor-apply.htm


## October 2, 2026 — owner facts and on-page implementation

This update supersedes earlier business-name and licensing-status notes above. The exact business name is Go Green Restoration TX Inc; contact email is info@gogreenrestorationtx.com. Rey Aquije and Yani Abohazira each have over 15 years of mold remediation and water restoration experience, as supplied by the owner. No professional titles or license numbers have been established.

The owner now reports the mold license is issued, but no number or verification link was available. Issuance and applicable company credentials remain unverified; retain the current service scope and route larger/out-of-scope inquiries to an appropriate licensed provider. Do not treat experience, EPA or IICRC credentials as proof of a Texas mold license.

The owner authorized the on-page improvement batch. Local implementation includes exact company naming; inclusive mold-inquiry copy with scope/referrals; differentiated Dallas, Plano, Frisco and McKinney content; project case studies; city-relevant resource links; homepage priority-city links; team content; and mobile asset/layout improvements. No production push is part of saving these changes.

Dallas kitchen/laundry: September 2026, leaking P-trap and laundry supply connections, containment and demolition/removal. Independent consultant/laboratory testing passed according to the owner; reports were not supplied. Arlington bathroom: August 2026, sink supply leak, containment, wall removal and cleanup, ready for reconstruction per owner. No independent clearance evidence supplied for Arlington. Existing photo permission covers publication; do not publish customer addresses.

Search Console query/page evidence for September 1–28 and overlap decisions are stored privately outside this repository. The snapshot does not justify mass article deletion or redirects. Separate the DFW process pillar, city service inquiry pages, factual case studies and informational guides. Reassess over equal post-publication periods; impressions are site visibility, not total market demand.

Verification: production build, metadata/canonical/internal-link checks for the changed page types, JSON-LD parsing, and mobile browser checks. Hero JPEG baseline 114,668 bytes; responsive WebP assets 73,412 bytes (1280px) and 30,286 bytes (640px). Decorative video is omitted on narrow screens, reduced-motion and data-saving preferences. No live Core Web Vitals improvement is claimed.


## October 4, 2026 — partner fulfillment and marketing wording

Owner confirms Go Green’s own Texas mold license approval is still pending and reports appropriately licensed partner companies can receive larger/remediation jobs. This supersedes the October 2 owner report of issuance. Welcome inquiries of all sizes. Avoid repeated small-area disclaimers in acquisition copy; use a concise, visible provider disclosure and accurate structured data. Do not claim Go Green itself holds pending credentials or that referrals establish its own licensure. Identify provider and scope before work begins. Partner credentials have not been independently verified in this session.

## October 4, 2026 — compact keyword landing-page guide

Owner-specified rules for future compact keyword landing pages:
1. Include the target keyword in the URL, using readable hyphenated words.
2. Begin the page title with the target keyword, followed by a call to action and the brand: Keyword | Call to action | Go Green Restoration TX Inc. Do not shorten solely to meet a title-length target; search engines may truncate the displayed title.
3. Include the target keyword naturally in the meta description.
4. Include the target keyword in the H1 and a relevant H2.
5. Include the target keyword in the first relevant image’s alt text when it accurately describes the image. Do not invent a depicted location/project or keyword-stuff decorative images; decorative images retain empty alt text.
6. Include clear calls to action within the page.
7. Start the first paragraph with the target keyword, continuing into a natural sentence.
8. Keep each paragraph to 1–4 sentences.
9. Use bullet points for scannable information such as service details, steps, and what customers should prepare.
10. Use a neutral tone. Avoid sensationalism, superlatives, exaggerated urgency, and unsupported claims.
11. Make the text feel human-written: use natural phrasing, concrete details, varied sentence structure, and clear explanations. Avoid formulaic repetition, filler, and awkward keyword insertions.
12. On mobile, use this content order: page title/H1 → introductory paragraph → primary call to action → image → additional information. The image must not precede the introduction or primary CTA.

Research specific hiring scenarios, affected spaces, property types and urgency. Validate service fit, query intent, actual competing pages and overlap with existing URLs. Close variants usually belong on one useful page. No fixed word count, ranking guarantee, blanket city-page multiplication, or invented project evidence. Current partner-referral disclosure and pending Go Green licensure remain applicable.

## October 4, 2026 — compact keyword topical architecture

Proposed keyword ownership is recorded in docs/seo/compact-keyword-architecture.json: 32 clusters, 226 base phrases, 14 new topic-page candidates, 10 conditional topics requiring provider/capability confirmation, 3 section-only groups and 5 reused existing owners. Preserve existing main service pillars and service/city URLs. Group synonyms into useful H2 sections; no automatic page per keyword. Regional focused-topic URLs use /services/{topic}/ and city variants use /{topic}/{city}/. Broad city pages summarize services; focused city pages address the narrower hiring decision. Use self-referencing canonicals for genuinely distinct pages. Do not treat query overlap alone as proven cannibalization or automatically redirect existing articles.

The full private report and evidence are under /Users/reynaldoaquije/Private/GoGreenTX/seo/2026-10-04/topical-architecture.html. Associated private files map all 100 prior keyword candidates, 960 cluster/city planning rows and all 750 existing articles. City rows are a planning matrix, not approval to publish 960 pages or proof of demand. Only Dallas variants received fresh city-keyword volume checks in this batch. No landing pages or redirects were created or deployed as part of this architecture task. Existing pending partner-copy edits remain separate.


## October 4, 2026 — compact page implementation

Implemented the 14 approved regional topic pages locally, with the URL inventory in compact-pages-implementation.json. Added topic links to the services index, parent pillars and corresponding existing city-service pages; 165 matching articles link to their focused topic owner. The two real project pages also link to relevant mold topics. Slab-leak cleanup, drain backups, contaminated-material removal and fire reconstruction remain sections on existing pillars. No topic-city variants or conditional capability pages were generated.

Verification: 1,037-page production build, zero broken editorial links, all 14 titles/meta/H1/H2/opening paragraphs/image alt/canonicals/sitemap entries checked, plus desktop and 390px mobile template inspection. Changes are not deployed. Existing pending partner-fulfillment edits were retained.


## October 4, 2026 — previously conditional services confirmed

The owner confirmed capability for all ten previously conditional topics: AC leak water damage cleanup, crawl space water removal, attic mold remediation, crawl space mold remediation, mold contaminated contents cleaning, fire damaged debris removal, fire damaged contents cleaning, fire extinguisher residue cleanup, emergency board up after fire, and crawl space sewage cleanup. This resolves the capability gate for regional topic pages; it does not establish issued mold credentials, individual job scope, specialist-item recovery outcomes, or new operating locations. Existing pending-license and partner-provider wording remains applicable.

Added those ten pages locally using the compact page guide, bringing the total to 24. Updated the architecture capability records, related-service links, and relevant article links. City variants remain subject to the existing local-content criteria. No deployment is part of this change.


## October 4, 2026 — city drafts and uniqueness review

Owner selected all 30 existing cities for the 24 compact services (720 routes), then required at least 60% unique content and a Higgsfield-generated illustration. City routes are opt-in through COMPACT_CITY_PREVIEW=1 / npm run build:city-preview. Ordinary production builds omit all 720 city drafts; preview routes are noindex and excluded from XML sitemaps. A searchable local directory is available at /city-service-preview/.

The current shared-copy drafts DO NOT satisfy the new uniqueness requirement: the first audit passed 0 of 720. Do not call this content work complete or publish these drafts. Rewrite their body copy before promotion, retain supported facts, and avoid artificial synonym substitutions. scripts/audit-city-copy.py normalizes city names and measures five-word phrase reuse against same-service city siblings and the regional topic, excluding navigation, CTAs and provider disclosure. The percentage is an editorial proxy, not a Google or semantic originality score. Full results and the path inventory are in docs/seo/city-copy-review.json; directory scores are in src/data/city-copy-review-summary.json.

Higgsfield job 14c33d7f-5076-4fb0-bff6-ad8741a65a5e produced a general house-cutaway restoration illustration. Inspected and optimized local 1280/640 WebP derivatives are displayed on city drafts with an explicit illustration caption; no real-job or city-photo claim. Production and preview builds pass, zero broken editorial links in both modes, and all 720 route titles/canonicals/noindex/image/parent links and sitemap exclusions were checked. Unique editorial copy remains unfinished.


Owner wording preference: on compact city-service pages, omit Wylie-based positioning and office-address copy from the visible header, body, footer and metadata. Keep the actual organization address accurate in structured data and company/contact pages; never substitute an invented city office. Wylie remains the target place name on pages specifically serving Wylie.


Compact service opening-paragraph rule: write for a customer looking to hire. Begin with the target service keyword, describe concrete symptoms or the situation that brought them to the page, then explain the relevant help. Avoid opening with company availability or administrative instructions. Applied to all 24 topic openings and inherited by the 720 city drafts; this does not resolve the outstanding city-copy uniqueness requirement.


Owner approved affirmative service-process wording: explain what the team will record, communicate, and include, rather than instruct customers to ask a contractor. The emergency extraction paragraph now commits to recording progress and explaining status and prerequisites before repairs/reconstruction. Related ask/clarify language in compact service copy was rewritten without adding outcome guarantees.

Added relevant mold-concern sections with specific internal links, using same-city topic destinations in preview and regional destinations in production. Moisture-growth guidance links to EPA. Generated 24 Higgsfield service illustrations, one per topic reused across its regional page and 30 city drafts, optimized as responsive 1280/640 WebP assets and explicitly labeled illustrations. src/data/compact-service-images.json records asset paths and generation IDs. City uniqueness remains unfinished and drafts remain excluded from production.


Owner clarified that the homepage and shared branding should emphasize all DFW, not Wylie-based positioning. Shared header/footer tagline now says Serving All Dallas–Fort Worth. Homepage hero, metadata and badges use DFW-wide service wording. The actual office address remains accurate in contact details and structured data; no new city offices are implied. Homepage layout was preserved.


## October 4, 2026 — indexing remediation review

Reviewed Search Console exclusions through the authenticated UI; raw exports and URL-level decisions are private under /Users/reynaldoaquije/Private/GoGreenTX/seo/2026-10-04/. Do not commit those exports. Locally improved ten existing service-city pages using IndexingServiceCity and indexing-service-editorial.json; two existing city hubs using IndexingCityHub; the mold pillar; five resource hubs; and five retained resource articles. Added relevant existing Higgsfield illustrations with explicit captions. Shared article template removes Wylie-based positioning. No redirects, canonical changes, noindex changes, production push, or indexing requests were made. User intends to request recrawl manually after publication.

The private report separates improved commercial/navigation pages from informational city articles needing topic-ownership and factual review. Low exact-word overlap does not establish independent search intent or prove cannibalization. Avoid automatically redirecting those candidates. Production build and target-page canonical/H1/indexability/sitemap/image checks passed; internal-link audit found zero broken editorial links. Google live URL test confirmed the existing mold pillar is fetchable/indexable; this does not confirm indexing or deployment of the local edits.

DFW expansion preview now contains 206 incorporated municipalities with city hubs, five main-service variants and 24 compact-service variants per city. All expansion-only routes remain noindex and excluded from normal production builds. The latest compact body-copy audit passed the 96 bespoke Dallas/Plano/Frisco/McKinney drafts, with 4,848 still failing the 60% uniqueness requirement. The wider content task is not complete and must not be described as publish-ready.


## October4,2026 — real-estate transaction pages

Owner authorized one DFW real-estate hub and three focused regional pages: /real-estate/, /services/mold-remediation-before-closing/, /services/water-damage-repair-before-closing/, /services/pre-listing-mold-removal/. These own agent coordination, under-contract mold, under-contract water repairs and pre-listing mold intent respectively. Existing mold pillar retains general estimate intent; do not add a competing generic estimate page. Commercial/general-city agents should link to these owners when relevant, not automatically duplicate transaction-intent city pages. No city variants or production deployment authorized in this implementation.

Use prompt response, clear scope, realistic milestones, owner-authorized communication and progress records. Keep arrival, estimate, completion and independent clearance timing separate. No promised closing date or transaction acceptance. Tenant communication follows the hiring party’s approved instructions; necessary safety/access information stays accurate. Workiz remains unchanged; contact-page guidance explains what to put in the existing message field and that document sharing is arranged separately. Do not claim uploads or new CRM fields exist.


## October 4, 2026 — final deployment authorized

User explicitly instructed: “When everything is finish Make a final revision and publish the site.” This authorizes production deployment after both general-city and commercial expansions are complete and the final integrated review passes. Root task coordinates release; child/commercial tasks must not independently publish partial batches. Final review includes all pending approved homepage, reviews, real-estate and indexing improvements, as well as completed expansion content. Verify useful distinct content, supported claims, current partner disclosure, images/alt, mobile layout, link integrity, canonical/indexability/sitemaps and production build. Promote completed drafts intentionally; keep preview directories excluded. Deploy using the documented repository workflow, verify the live result and then stop completed-work automations. This explicit instruction supersedes earlier audit-only/no-deployment restrictions for the final release, not for unfinished batch publishing.

## October 4, 2026 — core city editorial review pipeline

Hub and five main-service rewrites use `src/data/city-core-editorial-{city}.json`, merged by `src/utils/city-core-editorial.ts`. Keys are city slug for hubs and service/city for main pages. The CityCoreEditorial component renders these only in COMPACT_CITY_PREVIEW; ordinary production retains existing owners. Authored overrides remain noindex and excluded from preview sitemaps pending the coordinated final release. Do not treat route existence as editorial completion.

Dallas hub and five main services have six reviewed drafts with problem-led copy, generated service illustrations, topic/service/blog links, scoped estimates and provider disclosure. Owner-reported Dallas project results remain attributed to Go Green’s owner. Separate core phrase audit and metadata/link/isolation reports are `city-core-copy-review.json` and `city-core-verification.json`. The six drafts passed current checks and 390px mobile inspection; phrase scores must be rerun as more sibling content is added. The subsequent Plano, Fort Worth and Arlington batches bring the reviewed core scope to24drafts (4hubs,20main-service pages), with202hubs and1010main-service pages remaining. Current counts and queued assignments are maintained in city-expansion-progress.json.

## October 5, 2026 — concurrent editorial verification

Core verification accepts a pre-build source manifest (`--manifest`) so city files saved during an audit are not misclassified as failures in an older rendered snapshot. Counts must intersect rendered phrase passes, technical checks and production isolation; newer source is pending until rebuilt. Customer-facing copy must not discuss keyword ownership, search intent, page architecture or cannibalization. Nine worker paragraphs were corrected to useful scheduling/provider guidance; internal ownership remains documentation only. The latest counts are in city-expansion-progress.json, not older narrative checkpoints.

## October 6, 2026 — pause creation and release verified subset

The user instructed: “Can we pause the Creation. Publish what we have” and “and resume next week?” This supersedes the previous all-or-nothing publication gate. Stop new editorial creation until October 13, 2026 at 4:40 PM America/Chicago. Publish the already verified subset after integrated production checks, retaining all unfinished drafts outside production and sitemaps. The explicit release manifest contains 1,044 core city pages, 2,328 compact city pages and 2,060 commercial city pages; Royse City's six unverified records remain excluded. Existing approved regional, homepage, project, review, real-estate and indexing changes remain included in the release review. Root coordinates deployment and live verification. Creation and hourly-review automations are paused, with one-time resumption scheduled; future work must preserve released routes and finish the remaining inventory.
