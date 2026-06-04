# Go Green Restoration TX

Static site for **Go Green Restoration Texas** — Dallas-Fort Worth metroplex restoration company.

Sister project to [gogreenrestorationinc](https://github.com/gouki230/gogreenrestorationinc) (LA & Ventura Counties).

## Stack
- Astro 5.x static site generator
- Tailwind CSS 4.x
- Hosted on Cloudflare Pages
- Auto-deploys on push to `main`

## Production
- **Domain:** gogreenrestorationtx.com
- **Phone:** (469) 727-3217
- **GA4:** G-D00HT24X3E

## Pending TODOs (search for `TODO` in source)
- [ ] Texas contractor / mold remediation license number
- [ ] Office street address(es) and postal code(s)
- [ ] Google Tag Manager container ID (TX-specific)
- [ ] LeadConnector chat widget ID (TX-specific)
- [ ] Contact form provider (sendajob / GoHighLevel / etc.)
- [ ] Google Business Profile URL → footer social
- [ ] Real Google reviews once GBP is set up
- [ ] Expand city list beyond the seed of 20 (Dallas + Tarrant counties)
- [ ] Texas-relevant service photos (replace `/images/services/*.jpg` if needed)

## Develop locally
```bash
npm install
npm run dev   # http://localhost:4321
npm run build # static build → ./dist
```

## Service Areas (seed)
- **Dallas County (10 cities):** Dallas, Plano, Frisco, McKinney, Allen, Irving, Garland, Mesquite, Carrollton, Richardson
- **Tarrant County (10 cities):** Fort Worth, Arlington, Mansfield, Grapevine, Southlake, Keller, Bedford, Euless, Hurst, North Richland Hills
