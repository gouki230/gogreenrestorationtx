// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://gogreenrestorationinc.com',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [preact(), sitemap({
    changefreq: 'weekly',
    lastmod: new Date(),
    priority: 0.7,
    serialize(item) {
      // Homepage — highest priority
      if (item.url === 'https://gogreenrestorationinc.com/') {
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
      else if (item.url.match(/\/locations\/(los-angeles|ventura)-county\/[^/]+\/$/)) {
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