import existingCities from '../data/cities-dfw-metro.json';
import additionalCities from '../data/cities-dfw-expanded.json';
import services from '../data/services.json';
import compactServices from '../data/compact-services.json';
import releaseManifest from '../data/expansion-release-manifest.json';

export const cityExpansionPreview = import.meta.env.COMPACT_CITY_PREVIEW === '1';
const existingSlugs = new Set(existingCities.map(city => city.slug));
const coreReleased = new Set(releaseManifest.corePaths);
const compactReleased = new Set(releaseManifest.compactPaths);
const commercialReleased = new Set(releaseManifest.commercialPaths);
const serviceSlugs = new Set(services.map(service => service.slug));
const compactSlugs = new Set(compactServices.map(service => service.slug));
const normalizePath = (path: string) => `/${path.split('/').filter(Boolean).join('/')}/`;
export function isCorePathReleased(path: string) { return coreReleased.has(normalizePath(path)); }
export function isCompactPathReleased(path: string) { return compactReleased.has(normalizePath(path)); }
export function isCorePathPublished(path: string) {
  const normalized = normalizePath(path);
  if (coreReleased.has(normalized)) return true;
  const parts = normalized.split('/').filter(Boolean);
  return (parts.length === 2 && serviceSlugs.has(parts[0]) && existingSlugs.has(parts[1]))
    || (parts.length === 3 && parts[0] === 'locations' && parts[1] === 'dfw-metro' && existingSlugs.has(parts[2]));
}
export function isCorePathAvailable(path: string) { return cityExpansionPreview || isCorePathPublished(path); }
export const expandedCities = additionalCities.filter(city => !existingSlugs.has(city.slug)).map(city => ({
  ...city,
  countySlug: 'dfw-metro', type: 'incorporated',
  // Empty values intentionally avoid inventing geographic or local-property facts.
  zips: [], neighborhoods: [], landmarks: [], characteristics: [], nearbyCities: [],
  lat: null, lng: null, population: null, commonIssues: '', draft: true,
}));
export const allServiceAreaCities = [...existingCities, ...expandedCities];
const allCitySlugs = new Set(allServiceAreaCities.map(city => city.slug));
export function isExpandedCity(slug: string) { return expandedCities.some(city => city.slug === slug); }

/** Keep links to unavailable city drafts on their published regional destination. */
export function resolveCityLink(href: string) {
  if (!href.startsWith('/') || href.startsWith('//') || cityExpansionPreview) return href;
  const match = href.match(/^([^?#]*)([?#].*)?$/)!;
  const path = normalizePath(match[1]);
  const suffix = match[2] || '';
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 3 && parts[0] === 'locations' && parts[1] === 'dfw-metro' && allCitySlugs.has(parts[2])) {
    return (isCorePathPublished(path) ? path : '/locations/dfw-metro/') + suffix;
  }
  if (parts.length === 2 && allCitySlugs.has(parts[1])) {
    if (serviceSlugs.has(parts[0])) return (isCorePathPublished(path) ? path : `/services/${parts[0]}/`) + suffix;
    if (compactSlugs.has(parts[0])) return (compactReleased.has(path) ? path : `/services/${parts[0]}/`) + suffix;
  }
  if (parts.length === 3 && parts[0] === 'commercial' && allCitySlugs.has(parts[2])) {
    return (commercialReleased.has(path) || existingSlugs.has(parts[2]) ? path : `/commercial/${parts[1]}/`) + suffix;
  }
  return href;
}
const releasedCitySlugs = new Set([...coreReleased, ...compactReleased].map(path => path.split('/').filter(Boolean).at(-1)));
const serviceAreaCities = cityExpansionPreview ? allServiceAreaCities : [
  ...existingCities, ...expandedCities.filter(city => releasedCitySlugs.has(city.slug)),
];
export default serviceAreaCities;
