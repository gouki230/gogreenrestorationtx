import { readFileSync } from 'fs';
import { PATHS } from './config.mjs';

let cachedCities = null;

export function loadAllCities() {
  if (cachedCities) return cachedCities;
  cachedCities = JSON.parse(readFileSync(PATHS.citiesDFW, 'utf-8'));
  return cachedCities;
}

export function loadServices() {
  return JSON.parse(readFileSync(PATHS.services, 'utf-8'));
}

export function getCityBySlug(slug) {
  return loadAllCities().find(c => c.slug === slug);
}
