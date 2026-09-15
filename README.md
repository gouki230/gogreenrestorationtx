# Go Green Restoration TX

Static site for **Go Green Restoration Texas** — Dallas-Fort Worth metroplex restoration company.

Sister project to [gogreenrestorationinc](https://github.com/gouki230/gogreenrestorationinc) (LA & Ventura Counties).

## Stack
- Astro 6.x static site generator
- Tailwind CSS 4.x
- Hosted on Cloudflare Pages
- Auto-deploys on push to `main`

## Production
- **Domain:** gogreenrestorationtx.com
- **Phone:** (469) 727-3217
- **GA4:** G-D00HT24X3E

## Licensing & mold scope (IMPORTANT)
- **No Texas mold remediation license.** Texas (TDLR) only allows non-licensed companies to clean up mold under **25 contiguous sq ft**. All mold copy is scoped to small-area cleanup + EPA Lead-Safe certification, and refers larger jobs to a TDLR-licensed remediator. Do **not** re-add "licensed mold remediation" claims.
- **No statewide TX restoration/GC license exists** — the old `License #TODO` / "CSLB" placeholders were California artifacts and have been removed site-wide. Trust language is now "Bonded & insured · IICRC- & EPA Lead-Safe certified."
- ✅ **`src/data/blog-articles.json` is fully DFW-localized** (750 articles, 30 DFW cities). The old LA dataset and its false California licensing claims are gone — zero CSLB references remain.
- ✅ **`scripts/` generation pipeline is DFW-localized too.** The system prompt, angle registry, city loader, and internal-link builder were LA carry-overs until Sept 2026; they now target DFW and carry explicit no-TX-license / TDLR-mold guardrails. Do not reintroduce license claims there.

## Pending TODOs (search for `TODO` in source)
- [x] Office street address(es) and postal code(s)
- [x] Contact form provider + lead capture
- [x] Expand city list — now 30 DFW cities under a single `dfw-metro` hub
- [ ] Google Tag Manager container ID (TX-specific) — `src/layouts/BaseLayout.astro`
- [ ] LeadConnector chat widget ID (TX-specific)
- [ ] Google Business Profile URL → footer social
- [ ] Real Google reviews once GBP is set up — `src/data/google-reviews.json` is placeholder
- [ ] Official EPA Lead-Safe Certified Firm logo — `src/components/TrustBadges.astro`
- [ ] Texas-relevant service photos (replace `/images/services/*.jpg` if needed)

## Weekly content automation
`.github/workflows/weekly-seo-content.yml` runs `scripts/seo-pipeline.mjs` every Monday.

**It has never successfully run on this repo.** Every scheduled run from 2026-06-08 through
2026-08-17 failed in ~20s because the pipeline still read `cities-la-county.json`, and GitHub then
auto-disabled the workflow for inactivity (`disabled_inactivity`). The path bug is fixed; to restart it:

```bash
gh workflow enable weekly-seo-content.yml
gh secret set ANTHROPIC_API_KEY
gh secret set GOOGLE_PLACES_API_KEY   # for scripts/fetch-reviews.mjs
gh workflow run weekly-seo-content.yml   # verify one manual run before trusting the schedule
```

No repo secrets are currently set, so the run will still fail at the generation step until both are added.

## Develop locally
```bash
npm install
npm run dev   # http://localhost:4321
npm run build # static build → ./dist
```

## Service Areas (30 cities, one `dfw-metro` hub)
All cities live in `src/data/cities-dfw-metro.json` and render under `/locations/dfw-metro/<city>/`.

- **Dallas County:** Dallas, Irving, Garland, Mesquite, Carrollton, Richardson, Grand Prairie, Coppell
- **Tarrant County:** Fort Worth, Arlington, Mansfield, Grapevine, Southlake, Keller, Colleyville, Bedford, Euless, Hurst, North Richland Hills
- **Collin County:** Plano, Frisco, McKinney, Allen, Prosper, Wylie
- **Denton County:** Lewisville, Denton, Flower Mound, The Colony
- **Rockwall County:** Rockwall
