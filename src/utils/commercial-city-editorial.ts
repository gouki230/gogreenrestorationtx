import cities from './commercial-service-cities';
import manifest from '../data/expansion-release-manifest.json';
const releasedPaths = new Set<string>([...manifest.commercialPaths, ...manifest.commercialRegionalPaths]);
export const isCommercialPathReleased = (path: string) => releasedPaths.has(path);
export const isCommercialCityAvailable = (topic: string, city: string) => commercialPreview || isCommercialPathReleased(`/commercial/${topic}/${city}/`);

const files = import.meta.glob('../data/commercial-city-editorial*.json', {eager:true,import:'default'}) as Record<string,Record<string,Record<string,unknown>>>;
export const commercialPreview = import.meta.env.COMMERCIAL_CITY_PREVIEW === '1';
const limitValue = commercialPreview ? import.meta.env.COMMERCIAL_CITY_PREVIEW_LIMIT : undefined;
const limit = limitValue ? Number(limitValue) : undefined;
if (limit !== undefined && (!Number.isInteger(limit) || limit < 1 || limit > cities.length)) {
  throw new Error('COMMERCIAL_CITY_PREVIEW_LIMIT must select 1–206 cities.');
}
const selectedCities = limit === undefined ? undefined : new Set(cities.slice(0, limit).map(city => city.slug));
export const commercialCityCopies = Object.fromEntries(Object.values(files).flatMap(file => Object.entries(file).flatMap(([topic,entries]) => Object.entries(entries).filter(([city]) => !selectedCities || selectedCities.has(city)).map(([city,copy]) => [`${topic}/${city}`,copy]))));
