import { readFileSync } from 'fs';
import { PATHS } from './config.mjs';

let cachedCities = null;

export function loadAllCities() {
  if (cachedCities) return cachedCities;
  const la = JSON.parse(readFileSync(PATHS.citiesLA, 'utf-8'));
  const ventura = JSON.parse(readFileSync(PATHS.citiesVentura, 'utf-8'));
  cachedCities = [...la, ...ventura];
  return cachedCities;
}

export function loadServices() {
  return JSON.parse(readFileSync(PATHS.services, 'utf-8'));
}

export function getCityBySlug(slug) {
  return loadAllCities().find(c => c.slug === slug);
}
