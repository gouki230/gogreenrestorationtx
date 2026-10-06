# Dallas and Collin County mold SEO audit and action plan

Prepared October 1, 2026 for gogreenrestorationtx.com. Audit and proposal only.

The first priorities are to restore inquiry delivery, correct unsupported trust and location claims, and establish reliable measurement. Then improve the existing mold service page and seven priority city pages. The repository already contains 750 articles, including 150 mold articles; another content batch is not the first intervention.

This document contains public-site findings and proposed work. Detailed Search Console and GA4 figures and exports are stored privately outside the repository. No website files, analytics settings, workflows, or production deployments were changed.

## Evidence and scope

Read AGENTS.md and docs/seo/project-brief.md. The local checkout and connected GitHub latest commit matched 02c818017a476148ab920f0a38e1bffe3746d633. Reviewed the service dataset, article inventory, layouts, route templates, contact form, robots source, and sitemap configuration.

Read the connected Texas Search Console property and both Texas GA4 properties through Windsor.ai for September 1–28 versus August 4–31, 2026. Segmented web search, query, page, device, country, mold versus testing/inspection wording, and brand variants. Checked GA4 production hostnames, streams, organic landing pages, and events without combining properties.

Production browser checks covered the homepage, contact page, mold service pillar, Dallas mold page, and Plano general location page. Browser HTML checks succeeded; direct HTTP checks returned 403. A browser request for robots.txt was blocked by the client. Consequently this is a sampled production audit, not a completed crawl, redirect audit, or Google indexing diagnosis.

## Confirmed site problems

| Priority | Finding and evidence | Proposed correction |
| --- | --- | --- |
| P0 | Live /contact/ form has no action endpoint; its script returns a call-us notice without sending. Source: src/pages/contact.astro:13. The page also advertises chat while BaseLayout has an empty chat widget ID. | Connect the approved Texas lead destination; verify receipt and failure behavior. Make contact copy match working channels. |
| P0 | Homepage displays 500+ reviews, 600+ reviews, and a zero-review widget. Live JSON-LD reports one review while containing three review objects. Source: src/pages/index.astro and src/data/google-reviews.json. | Obtain evidence for Texas-specific reviews and totals; remove unsupported claims and review markup if they cannot be substantiated. Do not import California reviews as Texas proof. |
| P0 | Live homepage includes generic “Licensed & Insured”; service copy calls the work “EPA Lead-Safe certified mold cleanup.” Dallas metadata promises air-quality testing and free inspection. | Identify the credential behind each claim. Separate lead certification from mold authorization. Verify what inspection/testing is actually offered and by whom; do not imply an unverified assessment service. Preserve current small-area restrictions. |
| P1 | Plano location JSON-LD creates “Go Green Restoration - Plano” with a Plano postal address. The shared location template repeats this pattern for other cities. Dallas service-city schema already uses the real Wylie provider. | Use one verified Wylie business entity with stable identifiers and city areaServed references; do not create city offices. Apply consistently across templates. |
| P1 | Live mold pillar says Southern Texas, “your your property,” and “my my area home.” Service index also substitutes “your” into city/county placeholders. | Write a dedicated DFW service introduction and grammatically valid generic process/FAQ text. Review every rendered service template, not only mold. |
| P1 | Live footer links Yelp to the Tarzana business. Other social identities, review videos, credentials, 8,500+ jobs, 15+ years, insurance-preference and arrival-time claims lack Texas evidence in the reviewed materials. | Verify ownership and attribution. Remove unsupported Texas implications; distinguish sister-company experience where accurate and relevant. Validate customer permission and photo provenance. |
| P2 | Sitemap configuration assigns new Date() as lastmod at every build. | Use substantive per-page modification dates or omit lastmod when unavailable. Avoid artificial freshness signals. |

The estimate form is an immediate conversion defect, independently of search rankings. Review inconsistencies are directly observable; this audit does not establish that every individual testimonial is fabricated.

Google excludes self-serving LocalBusiness/Organization reviews from review-star eligibility. Accurate testimonials can still help visitors, but aggregateRating should not be sold as a way to earn stars for this business's own pages. [Google review markup guidance](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)

Google recommends lastmod reflect the last significant update. [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

## What the connected data changes

Observed search visibility remains weak for the priority mold destinations, while general city pages and other services account for much of the site's visibility. Prioritize diagnostics and improvements on existing URLs before creating replacement mold-removal URLs. A missing Search Console row does not prove a URL is unindexed.

Overall impressions declined even while average position improved; query mix and very small click counts prevent a confident growth claim. The decline is not confined to mold. Do not diagnose a penalty or attribute it to a particular deployment from this evidence.

The two GA4 properties contain closely matching production activity plus development traffic. No successful-form or phone-specific event appears in the returned production events. Choose the authoritative property only after mapping the live measurement ID to the stream and checking destinations. Zero recorded key events cannot establish that the business received zero leads.

See the separate private baseline for figures, query-to-page examples, calculations, and connector limitations. Search Console measures this site's observed visibility, not total Dallas/Collin County demand. Search averages and generic web-search ordering are not local rank-tracker results.

## Competitor and content gaps

These are sampled pages discovered through searches for Dallas, Plano/McKinney/Collin County, and Frisco/Allen mold services on October 1. They are comparison candidates, not a verified ranking leaderboard. Claims below describe what competitors publish; their credentials, outcomes, and review authenticity were not independently audited.

| Competitor and market | Observed content | Gap to address |
| --- | --- | --- |
| [SERVPRO Northwest Dallas](https://www.servpro.com/locations/tx/servpro-of-northwest-dallas/services/mold-remediation) | A defined Dallas service area, displayed review count, moisture-source discussion, containment, material removal, drying, documentation, and an insurance caveat. | Put scope, steps, expected deliverables, and credible local proof together on the Dallas page. Existing Go Green process text needs better qualification and evidence, not simply more words. |
| [SERVPRO McKinney](https://www.servpro.com/locations/tx/servpro-of-mckinney/services/mold-remediation) | Local building context, named operators, process detail, and explicit separation of remediation from independent testing. | Explain the actual team's role and when independent assessment is needed. Use verified project facts to distinguish McKinney content. |
| [FDP Frisco](https://www.fdpmoldremediation.com/frisco-tx/) | A dedicated Frisco service destination, contact details, certification claims, and dated reviews with links to external review entries. | Make credentials and reviews traceable. Present actual service coverage from Wylie without copying dispatch-point or office claims. |
| [Plano Mold Remediation Pros](https://planomoldremediation.com/) | Mold-focused local copy, direct call prompts, and FAQ coverage of identification, testing, and Collin County service coverage. | Answer the visitor's next-step questions on the existing Plano page. Avoid copying unverified medical or testing claims. |

Go Green already covers moisture control, cleanup steps, symptoms, prevention after leaks, and the small-area rule. The useful gaps are more specific:

- **Service choice:** clarify what the business can take on now, what requires referral, and what changes only after verified licensing. Distinguish an estimate/moisture check from licensed assessment or clearance.
- **Cost and timeline:** explain supported cost drivers, access needs, removal versus rebuilding, and what an estimate includes. Add ranges or turnaround promises only with business evidence.
- **Experience:** add genuine, consented Texas project summaries with city, moisture source, permitted scope, work performed, and documented result. Remove EXIF and identifying customer details from published photos.
- **Completion and prevention:** explain what documentation the customer receives and what verification is appropriate to the job; do not promise clearance testing or permanent prevention without support.
- **Local usefulness:** explain real coverage and practical logistics for Dallas and the six Collin County cities. Generic neighborhood lists are insufficient proof of local experience.
- **Editorial trust:** identify a qualified reviewer for regulated or health-related content, cite authoritative sources, and reconcile all matching FAQ schema. Do not present generated illustrations as completed jobs.

No competitor backlink export or paid keyword-volume tool was used. Relative domain authority, link gaps, and market-size estimates remain unknown. A later bounded competitor referring-domain review can prioritize legitimate local associations, suppliers, and community coverage; no purchased placements or outreach were performed.

## Keyword and page ownership

Retain the current routes. Each city page should own both removal and remediation variants when its service language accurately reflects the authorized scope. Do not create a second near-duplicate /mold-removal/city/ set.

| Search intent | Existing destination | Proposed role |
| --- | --- | --- |
| DFW mold cleanup/removal and Collin County coverage | /services/mold-remediation/ | Main service explanation, scope, process, credentials, estimate details, and links to city pages. Include Collin County coverage without a county-office claim. |
| Mold removal/remediation Dallas | /mold-remediation/dallas/ | Priority Dallas destination. Keep small-area scope explicit until license verification. |
| Mold removal/remediation Plano | /mold-remediation/plano/ | Priority Collin destination; contextual link from the existing Plano location page. |
| Mold removal/remediation McKinney | /mold-remediation/mckinney/ | Priority Collin destination with verified local facts and a distinct useful brief. |
| Mold removal/remediation Wylie | /mold-remediation/wylie/ | Clearly explain actual business location and service scope. |
| Mold removal/remediation Frisco, Allen, Prosper | /mold-remediation/frisco/, /allen/, /prosper/ | Existing destinations, refreshed as real evidence and coverage are confirmed. All three shorthand routes share the /mold-remediation/ prefix. |
| Mold testing or inspection | Existing relevant /resources/mold/ articles | Educational explanation and accurate next step. Do not promise testing merely to capture these searches. |
| Texas small-area cleanup rule | Existing Dallas and Plano rule articles | Review against current TDLR guidance and link to the service scope. Evaluate duplicate regional articles before selecting one primary explainer. |
| Cost, duration, assessment versus remediation | Initially sections within the mold pillar | Validate usefulness and query evidence before creating separate articles. |
| General restoration in each city | /locations/dfw-metro/city/ | Broad service-area page with a clear contextual link to its mold destination. |

Suggested first content pilot: the pillar plus Dallas, Plano, McKinney, and Wylie. Dallas is the explicit business priority; the Collin selection uses existing site visibility, the real base, and manageable scope—not estimated market volume. Refresh Frisco, Allen, and Prosper next. Business capacity and genuine project evidence can change this order.

Internal-link pattern: relevant water-damage/prevention article → correct mold city page → service pillar/contact; general city page → its mold city page; pillar → priority city pages. Audit existing links before adding more; many are already templated. Improve context and prominence rather than adding another indiscriminate city-link grid.

Cannibalization is not established. Some nonpriority queries reach general location pages or informational articles. Compare query-by-page performance and indexing before considering consolidation. Do not delete or noindex all low-impression articles.

## Prioritized implementation backlog

Effort estimates are planning estimates: small is up to one working day, medium is two to three days, large is a staged week or more. They exclude waiting for business evidence and approvals. Owners are proposed roles.

| Order | Action and business benefit | Owner and effort | Dependency and acceptance criterion |
| --- | --- | --- | --- |
| 1 P0 | Repair inquiry delivery and contact-channel copy so visitors can reach the business. | Developer + business owner; small/medium | Confirm Texas recipient and endpoint. Approved test inquiry reaches the destination; validation and failure states work; phone fallback remains visible. |
| 2 P0 | Correct unsupported license, review, photo, and performance claims to restore credibility. | Owner + editor; medium | Evidence register for each credential/review/result; remove unsupported claims, reconcile rendered text and JSON-LD, keep existing mold restrictions. |
| 3 P0 | Establish reliable lead measurement. | Analytics implementer; medium | Map measurement ID, streams, destinations; preserve history; one intended page_view; successful inquiry event once after acceptance; phone-click separate from answered call; no personal data in GA4. |
| 4 P1 | Resolve priority URL indexing and canonical questions before expanding content. | SEO + developer; medium | Inspect pillar and seven city URLs in GSC; record index status, selected canonical, crawl date and exclusions. Check live HTTP/HTTPS, www/apex, slash variants, status, redirects, robots, sitemap membership, mobile render and internal links. |
| 5 P1 | Correct Wylie entity representation and obvious template defects. | Developer + editor; small/medium | All sampled schemas use verified Wylie premises; no invented city office; rendered services contain no Southern Texas or broken substitutions. |
| 6 P1 | Improve pillar and four-page pilot to answer qualified visitors' questions. | Editor + owner; large | Accurate scope, actionable estimate details, truthful cost/timeline guidance, appropriate proof and contextual links. Review before implementation. |
| 7 P2 | Add genuine case evidence and refresh remaining three priority city pages. | Owner + editor; medium/large | Usable consented Texas materials, stripped metadata, verified outcomes and credentials. Never substitute generated photos for local jobs. |
| 8 P2 | Review the 150 mold articles and broader inventory for intent overlap and weak claims. | SEO + subject reviewer; large | URL inventory with keep/improve/consolidate decisions based on content, indexing, clicks and links; redirects mapped before any consolidation. Keep automated expansion paused pending review. |
| 9 P2 | Complete Business Profile and local authority work. | Owner + SEO; medium plus external wait | Verified profile; accurate Wylie identity, categories, services and hours; genuine review requests; baseline local grid and citation consistency. Connector access is not verification. |
| 10 P3 | Improve sitemap dates and performance issues confirmed by measurement. | Developer; small/medium | Meaningful lastmod or omission; baseline and post-change mobile/Core Web Vitals evidence. No speculative speed work or image-count target. |

Proposed sequencing: days 1–7 for P0 and indexing diagnosis; days 8–30 for the content pilot and template corrections; days 31–60 for evidence-backed expansion and selective article improvement; days 61–90 for evaluation and local-authority work. This is a work schedule, not a ranking forecast.

## Licensing dependency

The user reported a pending Texas Mold Remediation Contractor license on October 1. Issue date and applicable company licensing remain unverified. Do not broaden scope because an application is pending or because EPA Lead-Safe certification appears on the site.

Before any licensed-service rewrite, verify the issued credential, legal holder, active status, company requirements, and permitted operational scope. TDLR distinguishes contractor and company licensing. Its FAQs also explain that the small-area exemption is not a blanket exemption for a licensed MRC and that assessment and remediation cannot generally be performed by the same person on the same project. This means future license issuance requires a process/content review, not a simple replacement of “small-area” with “licensed.” [TDLR contractor requirements](https://www.tdlr.texas.gov/mld/mldcontractor-apply.htm), [TDLR mold FAQs](https://www.tdlr.texas.gov/mld/mldfaq.htm)

Current text uses “larger than 25” in places despite describing a less-than-25 scope elsewhere. The review should resolve boundary wording and applicable exemptions against TDLR guidance; do not expand the company's current scope to exactly 25 square feet.

## Measurement and release gates

Primary business outcomes: qualified organic calls and inquiries, booked mold jobs, and eventual job value. Secondary measures: production organic landing sessions, successful inquiry rate after validated tracking, mold-query clicks and impressions, intended landing pages, and priority URL index status. Report branded, nonbranded service, and testing/inspection groups separately.

Compare equal 28-day periods and annotate releases. With the current small sample, do not declare success from one additional click, isolated average positions, or a short-term percentage jump. Evaluate the pilot after enough post-indexing observation; qualified lead outcomes take precedence over article count.

Before a future implementation release: review the diff, validate rendered scope and schema, verify recipient routing and event behavior, inspect mobile contact paths, and check priority canonicals/links. Production deployment needs separate authorization; pushes to main automatically deploy. No push or deployment is part of this audit.

## Remaining inputs

The business should provide issued-license evidence when available; applicable company status; verified credentials; approved Texas lead destination; genuine reviews and project photographs with permission; actual response coverage and capacity; and highest-value job types. Analytics admin access or stream screenshots can resolve measurement mapping. GSC URL Inspection and a controlled production crawl remain required to distinguish indexing, canonical, and content-quality causes.

Do not purchase keyword data, enable recurring publishing, or undertake bulk content removal from this plan alone.
