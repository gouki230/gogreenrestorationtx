import articles from '../data/blog-articles.json';
import services from '../data/services.json';

// Select by subject and city, never by keyword similarity to an unrelated location.
const featuredGuideSlugs: Record<string, string[]> = {
  'water-damage-restoration': ['water-damage-emergency-first-24-hours-dallas', 'hidden-water-damage-warning-signs-plano', 'structural-drying-and-mold-prevention-frisco'],
  'fire-smoke-damage-restoration': ['first-steps-after-a-house-fire-dallas', 'smoke-soot-and-odor-removal-plano', 'structural-rebuild-after-fire-frisco'],
  'mold-remediation': ['preventing-mold-after-a-water-leak-dallas', 'spotting-small-mold-problems-early-plano', 'bathroom-and-shower-mold-cleanup-frisco'],
  'sewage-backup-cleanup': ['what-to-do-during-a-sewage-backup-dallas', 'common-causes-of-sewer-backups-plano', 'preventing-sewage-backups-frisco'],
  'construction-remodeling': ['reconstruction-after-major-damage-dallas', 'permits-and-code-compliance-plano', 'rebuild-timeline-and-cost-frisco'],
};

export function getPillarGuides(serviceSlug: string) {
  return (featuredGuideSlugs[serviceSlug] || []).map(slug => {
    const article = articles.find(a => a.slug === slug);
    if (!article) throw new Error(`Missing featured guide: ${slug}`);
    return article;
  });
}

export function getCityGuides(citySlug: string) {
  // One guide per service keeps the city overview useful without listing 25 posts.
  const orderedServices = [...services].sort((a, b) => Number(b.slug === 'mold-remediation') - Number(a.slug === 'mold-remediation'));
  return orderedServices.flatMap(service => {
    const cluster = service.relatedResources[0];
    const matches = articles.filter(a => a.cluster === cluster && a.slug.endsWith(`-${citySlug}`));
    const featured = getPillarGuides(service.slug).find(a => matches.some(m => m.slug === a.slug));
    const article = featured || matches[0];
    return article ? [{ ...article, serviceName: service.shortName }] : [];
  });
}
