# First SEO implementation review

Prepared locally on branch `codex/texas-mold-seo-updates`. Not deployed.

## Changes

- Added six owner-authorized photos from the Arlington bathroom and Dallas kitchen mold remediation jobs. Gallery and mold service overview show both; the matching city pages show only that city's job. Captions describe visible work without claiming clearance, dates, or before/after results.
- Created responsive WebP derivatives with EXIF, XMP, and IPTC metadata stripped. Originals remain outside tracked website assets.
- Expanded mold service information for Dallas and Collin County: current small-area scope, estimates versus assessment/testing, estimate factors, emergency arrival target, and internal service-area links.
- Preserved the existing less-than-25-contiguous-square-feet service restriction while issued licensing remains unverified.
- Removed conflicting homepage review counts, unsupported rating schema, and unsourced testimonial content. Used the agreed company-wide review heading and the owner's three Google profile links. Individual review text, counts, and profile details still require verification.
- Corrected DFW wording and broken service-card descriptions. Replaced city office structured data with service-area data referencing the actual Wylie business.
- Removed guaranteed insurance compensation and blanket guarantee wording in the shared city template. Clarified contact response wording.

## Validation

- Production build passed: 1,021 HTML pages.
- JSON-LD parsed across every generated page.
- Confirmed Dallas/Arlington photo assignments, new internal link targets, image assets, and Wylie-only postal addresses in location-page schema.
- Confirmed homepage/reviews have no aggregate rating or obsolete 500+/600+ totals.
- Confirmed Workiz embed and thank-you noindex remain present; no new live form submission was made.
- Verified all 12 responsive image files have no EXIF/XMP/IPTC metadata (about 900 KB combined).
- Inspected Dallas desktop photo layout and mobile gallery; all six gallery images loaded and mobile document had no horizontal overflow.
- Git whitespace check passed.

## Remaining priorities

1. Confirm intended GA4 property and production-only measurement; verify successful inquiry and telephone events before reporting conversions.
2. Audit the larger resource article collection for unsupported credential/service claims, repetition, and search-intent overlap. This round does not certify every existing article or every sitewide claim.
3. Verify issued mold credentials before expanding scope, and verify Business Profile status before local-profile changes.
4. Obtain verified individual review sources and additional project facts before adding quotations or richer case studies.
5. Review this local implementation before production deployment.
