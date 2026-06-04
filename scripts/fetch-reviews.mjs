#!/usr/bin/env node
/**
 * Fetches Google reviews from Places API and saves to a JSON data file.
 * Run before build: node scripts/fetch-reviews.mjs
 *
 * Requires: GOOGLE_PLACES_API_KEY environment variable or pass as arg.
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, '..', 'src', 'data', 'google-reviews.json');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyBoiFNxxlbruQyVApxjOSw2hz7l1L2LW9s';
const PLACE_IDS = [
  'ChIJkXmiK2mZwoARAXGAlukG2Yc', // Go Green Restoration Los Angeles
];

async function fetchReviews(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK') {
    console.error(`Failed to fetch place ${placeId}: ${data.status}`);
    return null;
  }
  return data.result;
}

async function main() {
  console.log('Fetching Google reviews...');
  const allReviews = [];
  let totalRating = 0;
  let totalCount = 0;

  for (const placeId of PLACE_IDS) {
    const result = await fetchReviews(placeId);
    if (!result) continue;

    console.log(`  ${result.name}: ${result.rating} stars (${result.user_ratings_total} reviews)`);
    totalRating = result.rating;
    totalCount += result.user_ratings_total;

    for (const review of (result.reviews || [])) {
      allReviews.push({
        author: review.author_name,
        authorPhoto: review.profile_photo_url,
        rating: review.rating,
        text: review.text,
        relativeTime: review.relative_time_description,
        time: review.time,
      });
    }
  }

  // Sort by most recent
  allReviews.sort((a, b) => b.time - a.time);

  const output = {
    rating: totalRating,
    totalReviews: totalCount,
    reviews: allReviews,
    fetchedAt: new Date().toISOString(),
  };

  writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
  console.log(`Saved ${allReviews.length} reviews to ${OUTPUT}`);
}

main().catch(console.error);
