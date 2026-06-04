#!/usr/bin/env node
/**
 * SEO Content Generation Pipeline
 *
 * Usage:
 *   node scripts/seo-pipeline.mjs --initial        Generate 3 articles per city-service (2,295 total)
 *   node scripts/seo-pipeline.mjs                   Weekly run: 153 articles (1 per city)
 *   node scripts/seo-pipeline.mjs --dry-run         Test without API calls
 *   node scripts/seo-pipeline.mjs --limit 5         Generate only 5 articles
 *   node scripts/seo-pipeline.mjs --dry-run --limit 5   Dry run with 5 articles
 */

import { readFileSync, writeFileSync } from 'fs';
import { PATHS, CLAUDE, CLUSTER_MAP, INITIAL_ARTICLES_PER_COMBO } from './lib/config.mjs';
import { loadAllCities, loadServices } from './lib/city-loader.mjs';
import { loadState, saveState, markGenerated, pickRandomAngles, getAvailableAngles } from './lib/state-manager.mjs';
import { generateArticle } from './lib/article-generator.mjs';
import { validateArticle } from './lib/content-validator.mjs';
import { injectLinks, updateCrossLinks } from './lib/linking-engine.mjs';
import { loadImageCatalog, saveImageCatalog, selectImage, processImage } from './lib/image-manager.mjs';
import { buildSite, gitCommitAndPush } from './lib/deploy.mjs';

// Parse CLI flags
const args = process.argv.slice(2);
const isInitial = args.includes('--initial');
const isDryRun = args.includes('--dry-run');
const limitIdx = args.indexOf('--limit');
const limit = limitIdx > -1 ? parseInt(args[limitIdx + 1]) : null;
const noBuild = args.includes('--no-build');
const noDeploy = args.includes('--no-deploy');

async function main() {
  console.log('=== Go Green SEO Content Pipeline ===');
  console.log(`Mode: ${isInitial ? 'INITIAL' : 'WEEKLY'} | Dry run: ${isDryRun} | Limit: ${limit || 'none'}`);
  console.log('');

  // Load data
  const cities = loadAllCities();
  const services = loadServices().filter(s => CLUSTER_MAP[s.slug]); // Only services with clusters
  const state = loadState();
  const imageCatalog = loadImageCatalog();

  // Load existing articles
  let articles = [];
  try {
    articles = JSON.parse(readFileSync(PATHS.blogArticles, 'utf-8'));
  } catch {
    articles = [];
  }

  console.log(`Cities: ${cities.length} | Services: ${services.length} | Existing articles: ${articles.length}`);
  console.log(`Image catalog: ${imageCatalog.length} images`);
  console.log('');

  // Build the generation queue
  const queue = buildQueue(cities, services, state, isInitial);
  const actualLimit = limit ? Math.min(limit, queue.length) : queue.length;

  console.log(`Queue: ${queue.length} articles to generate (processing ${actualLimit})`);
  console.log('');

  // Process in batches
  let generated = 0;
  let failed = 0;
  const batchSize = CLAUDE.batchSize;

  for (let i = 0; i < actualLimit; i += batchSize) {
    const batch = queue.slice(i, Math.min(i + batchSize, actualLimit));
    console.log(`--- Batch ${Math.floor(i / batchSize) + 1} (${batch.length} articles) ---`);

    for (const item of batch) {
      const { city, service, angleIndex } = item;
      const label = `${city.name} / ${service.shortName} / angle ${angleIndex}`;

      try {
        console.log(`  Generating: ${label}`);

        // 1. Generate article
        const article = await generateArticle(city, service, angleIndex, isDryRun);

        // 2. Validate
        const validation = validateArticle(article);
        if (!validation.valid) {
          console.warn(`  WARN: Validation issues for ${label}: ${validation.errors.join(', ')}`);
          // Still proceed if it's a dry run or minor issues
          if (!isDryRun && validation.errors.some(e => e.includes('Missing'))) {
            failed++;
            continue;
          }
        }

        // 3. Process image
        if (imageCatalog.length > 0) {
          const image = selectImage(imageCatalog, article.cluster, article.service);
          if (image) {
            const { imagePath, imageAlt } = await processImage(image, article.slug, article.cluster, city);
            article.image = imagePath;
            article.imageAlt = imageAlt;
          }
        }

        // 4. Inject internal links
        article.content = injectLinks(article, articles);

        // 5. Add to articles array
        articles.push(article);

        // 6. Mark as generated
        markGenerated(state, city.slug, service.slug, angleIndex, article.slug);

        generated++;
        console.log(`  OK: ${article.slug} (${article.content.split(/\s+/).length} words)`);
      } catch (err) {
        console.error(`  FAIL: ${label} — ${err.message}`);
        failed++;
      }
    }

    // Save progress after each batch
    saveState(state);
    writeFileSync(PATHS.blogArticles, JSON.stringify(articles, null, 2));
    console.log(`  Progress saved. Total: ${generated} generated, ${failed} failed.`);

    // Delay between batches (skip on last batch)
    if (i + batchSize < actualLimit) {
      console.log(`  Waiting ${CLAUDE.batchDelayMs / 1000}s...`);
      await new Promise(r => setTimeout(r, CLAUDE.batchDelayMs));
    }
  }

  // Cross-link update pass
  if (generated > 0) {
    console.log('\n--- Cross-link update pass ---');
    const updatedLinks = updateCrossLinks(articles);
    console.log(`Updated cross-links in ${updatedLinks} articles.`);

    // Save final state
    state.currentWeek = (state.currentWeek || 0) + 1;
    saveState(state);
    writeFileSync(PATHS.blogArticles, JSON.stringify(articles, null, 2));

    // Save image catalog (usage counts updated)
    if (imageCatalog.length > 0) {
      saveImageCatalog(imageCatalog);
    }
  }

  console.log(`\n=== Pipeline Complete ===`);
  console.log(`Generated: ${generated} | Failed: ${failed} | Total articles: ${articles.length}`);

  // Build
  if (!noBuild && generated > 0 && !isDryRun) {
    const buildOk = buildSite();
    if (!buildOk) {
      console.error('Build failed! Skipping deploy.');
      process.exit(1);
    }

    // Deploy
    if (!noDeploy) {
      const weekLabel = isInitial ? 'initial batch' : `week ${state.currentWeek}`;
      gitCommitAndPush(generated, weekLabel);
    }
  }
}

/**
 * Build the queue of articles to generate.
 */
function buildQueue(cities, services, state, isInitial) {
  const queue = [];

  if (isInitial) {
    // Initial: 3 articles per city-service combo
    for (const city of cities) {
      for (const service of services) {
        const angles = pickRandomAngles(state, city.slug, service.slug, INITIAL_ARTICLES_PER_COMBO);
        for (const angleIndex of angles) {
          queue.push({ city, service, angleIndex });
        }
      }
    }
  } else {
    // Weekly: 1 article per city, rotating through services
    const serviceIndex = (state.currentServiceIndex || 0) % services.length;
    const service = services[serviceIndex];

    for (const city of cities) {
      const available = getAvailableAngles(state, city.slug, service.slug);
      if (available.length === 0) {
        // All angles used for this combo, try next service
        for (let s = 0; s < services.length; s++) {
          const altService = services[(serviceIndex + s + 1) % services.length];
          const altAvailable = getAvailableAngles(state, city.slug, altService.slug);
          if (altAvailable.length > 0) {
            const randomAngle = altAvailable[Math.floor(Math.random() * altAvailable.length)];
            queue.push({ city, service: altService, angleIndex: randomAngle });
            break;
          }
        }
      } else {
        const randomAngle = available[Math.floor(Math.random() * available.length)];
        queue.push({ city, service, angleIndex: randomAngle });
      }
    }

    // Advance service rotation for next week
    state.currentServiceIndex = (serviceIndex + 1) % services.length;
  }

  // Shuffle queue for variety in processing order
  return queue.sort(() => Math.random() - 0.5);
}

main().catch(err => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
