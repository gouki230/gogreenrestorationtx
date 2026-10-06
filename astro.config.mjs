// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';
const expandedCities = JSON.parse(readFileSync(new URL('./src/data/cities-dfw-expanded.json', import.meta.url), 'utf8'));
const expandedCitySlugs = new Set(expandedCities.map(city => city.slug));
const compactTopics = JSON.parse(readFileSync(new URL('./src/data/compact-services.json', import.meta.url), 'utf8'));

// Authored hub/main overrides stay review-only until the final coordinated release.
const coreDraftPaths = new Set(readdirSync(new URL('./src/data/', import.meta.url))
  .filter(name => /^city-core-editorial-.*\.json$/.test(name))
  .flatMap(name => Object.keys(JSON.parse(readFileSync(new URL(`./src/data/${name}`, import.meta.url), 'utf8'))))
  .map(key => key.includes('/') ? `/${key}` : `/locations/dfw-metro/${key}`));

const release = JSON.parse(readFileSync(new URL('./src/data/expansion-release-manifest.json', import.meta.url), 'utf8'));
const releasedPaths = new Set([...release.corePaths, ...release.compactPaths, ...release.commercialPaths, ...release.commercialRegionalPaths].map(path => path.replace(/\/$/, '')));

// https://astro.build/config
export default defineConfig({
  site: 'https://gogreenrestorationtx.com',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [preact(), sitemap({
    filter: (page) => {
      const path = new URL(page).pathname.replace(/\/$/, '');
      if (['/thank-you', '/city-service-preview', '/commercial-expansion-preview'].includes(path)) return false;
      if (releasedPaths.has(path)) return true;
      if (process.env.COMPACT_CITY_PREVIEW === '1' && coreDraftPaths.has(path)) return false;
      // Existing audience owners are preview-overridden without changing production content.
      if (process.env.COMMERCIAL_CITY_PREVIEW === '1' && /^\/commercial\/(property-management-restoration|hoa-restoration-services)(\/|$)/.test(path)) return false;
      // Commercial expansion is review-only, including its regional draft owners.
      if (/^\/commercial\/(water-damage-restoration|mold-remediation|fire-damage-restoration|sewage-cleanup|apartment-water-damage-restoration|apartment-mold-remediation|condo-water-damage-restoration|fire-sprinkler-water-damage-cleanup)(\/|$)/.test(path)) return false;
      if (expandedCitySlugs.has(path.split('/').pop())) return false;
      return !compactTopics.some(topic => path.startsWith(`/${topic.slug}/`));
    },
    changefreq: 'weekly',
    priority: 0.7,
    serialize(item) {
      // Homepage — highest priority
      if (item.url === 'https://gogreenrestorationtx.com/') {
        item.priority = 1.0;
        item.changefreq = 'daily';
      }
      // Service pillar pages — high priority
      else if (item.url.match(/\/services\/[^/]+\/$/)) {
        item.priority = 0.9;
        item.changefreq = 'weekly';
      }
      // Service+City combo pages — high priority (money pages)
      else if (item.url.match(/\/(water-damage-restoration|fire-smoke-damage-restoration|mold-remediation|sewage-backup-cleanup|construction-remodeling)\/[^/]+\/$/)) {
        item.priority = 0.8;
        item.changefreq = 'weekly';
      }
      // City landing pages
      else if (item.url.match(/\/locations\/dfw-metro\/[^/]+\/$/)) {
        item.priority = 0.7;
        item.changefreq = 'weekly';
      }
      // Commercial pages
      else if (item.url.includes('/commercial/')) {
        item.priority = 0.7;
        item.changefreq = 'weekly';
      }
      // Blog articles
      else if (item.url.includes('/resources/')) {
        item.priority = 0.6;
        item.changefreq = 'weekly';
      }
      // Static pages
      else {
        item.priority = 0.5;
        item.changefreq = 'monthly';
      }
      return item;
    },
  })]
});
