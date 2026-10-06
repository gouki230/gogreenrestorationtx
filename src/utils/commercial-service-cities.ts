import originalCities from '../data/cities-dfw-metro.json';
import additionalCities from '../data/cities-dfw-expanded.json';

const cities = new Map<string, {slug: string; name: string}>();
for (const city of [...originalCities, ...additionalCities]) {
  if (!cities.has(city.slug)) cities.set(city.slug, {slug: city.slug, name: city.name});
}
export default [...cities.values()];
