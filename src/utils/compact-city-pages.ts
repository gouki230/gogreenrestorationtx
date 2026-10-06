import cities, { cityExpansionPreview, isCompactPathReleased, resolveCityLink } from './service-area-cities';
import pages from '../data/compact-services.json';

export const compactCityPreview = cityExpansionPreview;
export function compactServiceUrl(slug: string, city?: string) {
  return city && cities.some(item => item.slug === city)
    ? resolveCityLink(`/${slug}/${city}/`) : `/services/${slug}/`;
}
export function compactCityPaths(slug: string) {
  const page = pages.find(item => item.slug === slug);
  if (!page) throw new Error(`Unknown compact service: ${slug}`);
  return cities.filter(city => compactCityPreview || isCompactPathReleased(`/${slug}/${city.slug}/`))
    .map(city => ({ params: { city: city.slug }, props: { page, city } }));
}
