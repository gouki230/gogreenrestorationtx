/**
 * Deterministic hash for template selection.
 * Ensures the same city always gets the same template variant,
 * but different cities get different variants.
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Select a template from an array based on a deterministic hash of the city slug.
 */
export function selectTemplate<T>(templates: T[], citySlug: string): T {
  const index = hashString(citySlug) % templates.length;
  return templates[index];
}

/**
 * Replace {city} and {county} placeholders in a template string.
 */
export function fillTemplate(template: string, city: string, county: string): string {
  return template.replace(/\{city\}/g, city).replace(/\{county\}/g, county);
}

/**
 * Generate a URL-safe slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Get characteristics-based conditional content sections.
 */
export function getConditionalContent(characteristics: string[]): string[] {
  const sections: string[] = [];

  if (characteristics.includes('humid-climate')) {
    sections.push('North Texas humidity is the single biggest driver of mold growth in DFW homes. Summer dew points routinely sit in the 70s, and every time that damp air meets an air-conditioned wall cavity, a cold supply duct, or a bathroom that vents into the attic instead of outside, it condenses. Mold only needs sustained moisture and about 48 hours, so surface mold behind a toilet or under a sink can establish itself long before anyone smells it. Controlling indoor humidity below 50 percent does more to prevent repeat mold growth than any single cleanup.');
  }

  if (characteristics.includes('storm-zone')) {
    sections.push('Spring storm season brings hail, straight-line winds, and tornado-alley downpours that open up roofs and window seals across the metroplex. The water intrusion itself is often minor and easy to miss — a stained ceiling corner, a damp attic rafter — but it feeds mold growth for weeks afterward. We trace storm-driven moisture back to the entry point, document it for your insurance claim, and dry the assembly out before mold takes hold rather than after.');
  }

  if (characteristics.includes('lakefront')) {
    sections.push('Properties near Lake Lewisville, Lake Ray Hubbard, Lake Grapevine, and Lake Lavon run higher ambient humidity year-round than inland DFW homes. Crawl spaces, boathouses, lower-level finished rooms, and anything built on a slab close to the waterline stay damp longer after a leak or a storm. These properties benefit from dehumidification and moisture monitoring as an ongoing measure, not just a one-time response.');
  }

  if (characteristics.includes('historic-district')) {
    sections.push('Historic properties need restoration that preserves original material rather than tearing it out. Plaster, old-growth wood trim, and original windows can often be dried and saved when the moisture source is addressed quickly, but they hide moisture far better than modern drywall does. We work carefully around period finishes and coordinate with local preservation requirements where they apply.');
  }

  if (characteristics.includes('newer-construction')) {
    sections.push('Newer DFW subdivisions bring their own moisture problems. Builder-grade plumbing fittings, water heaters, and HVAC condensate lines commonly start failing somewhere between year eight and year fifteen, and expansive North Texas clay soil shifts foundations enough to stress supply lines under the slab. Because these homes are tightly sealed, a slow leak has nowhere to dry out and mold follows quickly.');
  }

  if (characteristics.includes('luxury-homes')) {
    sections.push('Larger custom homes have more plumbing runs, more bathrooms, and more complex HVAC zoning, which simply means more places a leak can start and more square footage of finish at risk. Specialty materials — natural stone, custom millwork, engineered hardwood — need drying approaches matched to the material rather than a single generic process.');
  }

  if (characteristics.includes('older-buildings')) {
    sections.push('Many properties in this area were built decades ago with plumbing, electrical, and roofing systems that are approaching or past their expected lifespan. Cast iron sewer lines and galvanized supply pipes are common in DFW homes from the 1960s through the 1980s, and both fail slowly and out of sight. Our team is experienced with aging infrastructure and the hidden moisture that comes with it.');
  }

  if (characteristics.includes('dense') || characteristics.includes('urban')) {
    sections.push('In densely built areas, water damage and other restoration emergencies can quickly affect neighboring properties through shared walls, floors, and plumbing systems. Our rapid response team understands the urgency of containing damage in multi-unit and closely-spaced properties to minimize impact on the broader community.');
  }

  if (characteristics.includes('suburban')) {
    sections.push('Suburban DFW homes sit on expansive clay soil that swells and shrinks with the seasons. That movement is the most common cause of slab leaks in the metroplex, and a slab leak is one of the hardest water sources to spot because the first sign is often a warm spot on the floor or an unexplained jump in the water bill rather than visible water.');
  }

  return sections;
}

/**
 * Get nearby cities for internal linking, filtered by available cities.
 */
export function getNearbyCities(
  nearbySlugs: string[],
  allCities: { slug: string; name: string }[],
  limit: number = 5
): { slug: string; name: string }[] {
  const cityMap = new Map(allCities.map(c => [c.slug, c]));
  return nearbySlugs
    .filter(slug => cityMap.has(slug))
    .slice(0, limit)
    .map(slug => cityMap.get(slug)!);
}
