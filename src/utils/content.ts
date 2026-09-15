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

interface CityData {
  name: string;
  slug: string;
  county: string;
  population?: number;
  zips?: string[];
  neighborhoods?: string[];
  landmarks?: string[];
  nearbyCities?: string[];
  characteristics?: string[];
}

function listPhrase(items: string[], max = 3): string {
  const p = items.slice(0, max);
  if (p.length === 0) return '';
  if (p.length === 1) return p[0];
  if (p.length === 2) return `${p[0]} and ${p[1]}`;
  return `${p.slice(0, -1).join(', ')} and ${p[p.length - 1]}`;
}

/**
 * Build genuinely city-specific paragraphs for a service+city page.
 *
 * The service+city pages are generated from five templates, so before this the
 * only thing separating one city's page from another's was the city name and a
 * single commonIssues paragraph — pairwise text overlap ran 52-70%. This weaves
 * the per-city data we already hold (population, named neighborhoods and
 * landmarks, ZIP coverage, county, neighbors) into prose, and varies the
 * sentence construction by a hash of city+service so the same city does not
 * repeat itself across its five service pages either.
 */
export function getLocalContext(city: CityData, serviceName: string, serviceShort: string, servedSlugs: string[] = []): string[] {
  const out: string[] = [];
  const v = hashString(city.slug + serviceName);
  const pop = city.population ?? 0;
  const zips = city.zips ?? [];
  const hoods = city.neighborhoods ?? [];
  const marks = city.landmarks ?? [];
  const chars = city.characteristics ?? [];
  const svc = serviceShort.toLowerCase();

  const popText = pop >= 1_000_000 ? `roughly ${(pop / 1_000_000).toFixed(1)} million residents`
    : pop >= 100_000 ? `about ${Math.round(pop / 1000)},000 residents`
    : `just over ${Math.round(pop / 1000)},000 residents`;

  const scale = [
    `${city.name} has ${popText} spread across ${zips.length} ZIP code${zips.length === 1 ? '' : 's'} in ${city.county}, and our ${svc} crews cover all of them.`,
    `With ${popText} and ${zips.length} ZIP code${zips.length === 1 ? '' : 's'}, ${city.name} is one of the ${city.county} communities we respond to most often for ${svc}.`,
    `Our ${svc} response area in ${city.name} covers all ${zips.length} of its ZIP code${zips.length === 1 ? '' : 's'} and the ${popText} living in them, across ${city.county}.`,
  ][v % 3];
  const drive = zips.length > 12
    ? `A city this size means very different building stock from one side to the other, so the first thing we establish on a ${svc} call is which part of ${city.name} we are heading to and what that tells us about the construction.`
    : zips.length > 4
    ? `That footprint is compact enough that we can usually be on site quickly, which matters more for ${svc} than almost anything else we could promise.`
    : `${city.name} is small enough that we know its streets and its building stock well, and that familiarity shows up as faster, more accurate ${svc} work.`;
  out.push(`${scale} ${drive}`);

  if (hoods.length || marks.length) {
    const parts: string[] = [];
    if (hoods.length) {
      parts.push([
        `We work throughout ${listPhrase(hoods, 4)}${hoods.length > 4 ? `, plus the rest of ${city.name}` : ''}.`,
        `${listPhrase(hoods, 4)}${hoods.length > 4 ? ', plus neighboring areas,' : ''} are all inside our regular ${svc} route.`,
        `Most of our ${city.name} ${svc} work runs through ${listPhrase(hoods, 4)}${hoods.length > 4 ? ', plus the surrounding neighborhoods' : ''}.`,
      ][v % 3]);
    }
    if (marks.length) {
      parts.push([
        `If you are near ${listPhrase(marks, 2)}, you are well inside our service area.`,
        `We are regularly out around ${listPhrase(marks, 2)}.`,
        `Properties around ${listPhrase(marks, 2)} fall squarely in the area we cover.`,
      ][(v >> 3) % 3]);
    }
    out.push(parts.join(' '));
  }

  // How this city's specific character changes this specific service.
  const traits: Record<string, string> = {
    'lakefront': `${city.name}'s waterfront properties hold humidity far longer than inland homes, so ${svc} here almost always includes dehumidification and a follow-up moisture check rather than a single visit.`,
    'historic-district': `Older ${city.name} properties hide moisture behind plaster and original millwork, which means ${svc} has to be done in a way that dries and saves original material instead of tearing it out.`,
    'newer-construction': `Much of ${city.name} was built in the last twenty years, and builder-grade fittings, water heaters and condensate lines in that age range are exactly what we find behind most ${svc} calls here.`,
    'luxury-homes': `Larger ${city.name} homes carry more plumbing runs and more specialty finish, so ${svc} is less about square footage and more about matching the method to natural stone, custom millwork and engineered floors.`,
    'older-buildings': `A lot of ${city.name} housing dates from the 1960s to the 1980s, when cast iron sewer lines and galvanized supply pipe were standard. Both fail slowly and out of sight, and both turn up constantly in our ${svc} work here.`,
    'urban': `In the denser parts of ${city.name}, shared walls and stacked plumbing mean one unit's problem becomes three units' problem quickly, so containment is the first move on any ${svc} job.`,
    'suburban': `${city.name} sits on expansive North Texas clay that shifts through the seasons and stresses the lines under the slab, which is behind a large share of the ${svc} calls we take here.`,
    'storm-zone': `${city.name} takes the full force of spring hail and straight-line winds, and the ${svc} work that follows a storm usually starts days after the storm itself, once the damage finally shows indoors.`,
    'humid-climate': `Summer dew points in ${city.name} sit high enough that damp air condenses inside wall cavities and around cold ducts, which quietly feeds the conditions behind a lot of ${svc} work.`,
  };
  const hits = chars.map(c => traits[c]).filter(Boolean) as string[];
  if (hits.length) out.push(hits.join(' '));

  // Where this city sits relative to its neighbors, for dispatch context.
  // Only name cities we actually serve — nearbyCities lists some we do not.
  const near = (city.nearbyCities ?? [])
    .filter(sl => servedSlugs.length === 0 || servedSlugs.includes(sl))
    .map(sl => sl.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '));
  if (near.length) {
    out.push([
      `Because we also cover ${listPhrase(near, 3)}, our ${city.name} crews are usually already somewhere in this corner of ${city.county} rather than starting from across the metroplex.`,
      `${city.name} sits next to ${listPhrase(near, 3)}, all of which we serve, so there is normally a crew working nearby when a ${svc} call comes in.`,
      `We run ${city.name} alongside ${listPhrase(near, 3)}, which keeps response times short instead of routing everything through one distant depot.`,
    ][(v >> 5) % 3]);
  }

  return out;
}

/**
 * A short city-specific sentence to append to a process step.
 *
 * The six process steps are the largest identical block on every service+city
 * page. Giving each step a sentence drawn from this city's own data breaks up
 * that block with real local detail rather than reordered boilerplate.
 */
export function getStepContext(city: CityData, stepIndex: number, serviceShort: string): string {
  const hoods = city.neighborhoods ?? [];
  const zips = city.zips ?? [];
  const chars = city.characteristics ?? [];
  const v = hashString(city.slug + serviceShort + stepIndex);
  const hood = hoods.length ? hoods[v % hoods.length] : city.name;
  const svc = serviceShort.toLowerCase();

  const pool: string[] = [];
  if (chars.includes('older-buildings')) pool.push(`In older ${city.name} housing we budget extra time here, because cast iron and galvanized lines rarely fail in just one place.`);
  if (chars.includes('newer-construction')) pool.push(`In newer ${city.name} builds this step usually comes back to a builder-grade fitting or a condensate line rather than anything structural.`);
  if (chars.includes('lakefront')) pool.push(`Near the water this step takes longer, because ambient humidity in ${city.name} works against drying the whole time.`);
  if (chars.includes('urban')) pool.push(`In denser parts of ${city.name} such as ${hood}, we also check whether the neighboring unit is affected before we call this step finished.`);
  if (chars.includes('suburban')) pool.push(`On ${city.name}'s clay soil we check for slab movement at this stage, since that is where a surprising number of these jobs actually start.`);
  if (chars.includes('storm-zone')) pool.push(`After a ${city.name} hail event we run this step against the roof and window line first, because that is where the water got in.`);
  if (chars.includes('historic-district')) pool.push(`In historic ${city.name} properties we work around original material at this stage rather than opening walls by default.`);
  if (chars.includes('humid-climate')) pool.push(`${city.name} humidity means we verify this step with a meter rather than by eye.`);
  pool.push(`For a ${hood} property this is typically where we confirm the scope with you before going further.`);
  pool.push(`Across ${city.name}'s ${zips.length} ZIP code${zips.length === 1 ? '' : 's'}, this is the step that most often changes what the rest of the ${svc} job looks like.`);

  return pool[v % pool.length];
}

/**
 * Two extra FAQ entries built from this city's own data. These also widen the
 * FAQPage schema, which is otherwise identical on all thirty of a service's pages.
 */
export function getCityFaqs(city: CityData, serviceName: string, serviceShort: string, servedSlugs: string[] = []): { question: string; answer: string }[] {
  const hoods = city.neighborhoods ?? [];
  const zips = city.zips ?? [];
  const near = (city.nearbyCities ?? [])
    .filter(sl => servedSlugs.length === 0 || servedSlugs.includes(sl))
    .map(sl => sl.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '));
  const svc = serviceShort.toLowerCase();
  const faqs = [{
    question: `Which parts of ${city.name} do you cover for ${svc}?`,
    answer: `All of it. That means ${zips.length} ZIP code${zips.length === 1 ? '' : 's'}${zips.length ? ` — ${zips.slice(0, 6).join(', ')}${zips.length > 6 ? ' and the rest' : ''}` : ''}${hoods.length ? `, covering ${listPhrase(hoods, 4)}${hoods.length > 4 ? ', plus the surrounding neighborhoods' : ''}` : ''}. ${near.length ? `We also cover ${listPhrase(near, 3)}, so there is usually a crew working close by.` : ''}`.trim(),
  }];
  if (near.length) {
    faqs.push({
      question: `How quickly can you reach a ${city.name} property?`,
      answer: `We run ${city.name} together with ${listPhrase(near, 3)}, which means our crews are generally already somewhere in this part of ${city.county} rather than dispatching from across the metroplex. For ${svc} that matters more than almost anything else, because the damage keeps developing while you wait. Call and we will tell you honestly where the nearest crew is and when they can be at your door.`,
    });
  }
  return faqs;
}
