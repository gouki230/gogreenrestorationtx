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

  if (characteristics.includes('coastal') || characteristics.includes('beach-community')) {
    sections.push('Properties in coastal areas face unique challenges from salt air corrosion, marine moisture, and potential storm surge flooding. Our restoration team understands the specific needs of oceanfront and near-ocean properties, using corrosion-resistant materials and moisture-barrier techniques to ensure lasting repairs.');
  }

  if (characteristics.includes('wildfire-zone') || characteristics.includes('hillside')) {
    sections.push('Properties in hillside and wildfire-prone areas require specialized attention. Our team is experienced with post-fire restoration, including smoke damage remediation, structural assessment after fire exposure, and protection against post-fire mudslides and debris flows that often follow in subsequent rainy seasons.');
  }

  if (characteristics.includes('extreme-heat') || characteristics.includes('desert') || characteristics.includes('high-desert')) {
    sections.push('The extreme heat in this area puts significant strain on HVAC systems and building materials. Temperature swings between day and night cause expansion and contraction that can lead to cracks, leaks, and moisture intrusion. Our restoration services address the unique challenges of desert and high-heat environments.');
  }

  if (characteristics.includes('older-buildings')) {
    sections.push('Many properties in this area were built decades ago with plumbing, electrical, and roofing systems that are approaching or past their expected lifespan. Our restoration team is experienced with aging infrastructure, including galvanized pipes, older sewer lines, and vintage construction materials that require specialized handling.');
  }

  if (characteristics.includes('dense') || characteristics.includes('urban')) {
    sections.push('In densely built areas, water damage and other restoration emergencies can quickly affect neighboring properties through shared walls, floors, and plumbing systems. Our rapid response team understands the urgency of containing damage in multi-unit and closely-spaced properties to minimize impact on the broader community.');
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
