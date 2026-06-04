import { CLUSTER_MAP } from './config.mjs';

/**
 * Inject internal links into a new article's content.
 * Links to: service+city page (money page), cluster hub, and sibling articles.
 */
export function injectLinks(article, existingArticles) {
  let content = article.content;
  const serviceSlug = article.service;
  const citySlug = article.city;
  const cluster = article.cluster;
  const cityName = article.cityName;

  const moneyPageUrl = `/${serviceSlug}/${citySlug}/`;
  const clusterHubUrl = `/resources/${cluster}/`;
  const cityPageUrl = `/locations/${getCityCountySlug(article)}/${citySlug}/`;

  // Find sibling articles (same city + service, different angle)
  const siblings = existingArticles.filter(
    a => a.city === citySlug && a.service === serviceSlug && a.slug !== article.slug
  );

  // Check if money page link is already in content (generator should have included it)
  if (!content.includes(moneyPageUrl)) {
    // Insert after first paragraph
    const firstBreak = content.indexOf('\n\n');
    if (firstBreak > -1) {
      const serviceName = getServiceName(serviceSlug);
      const linkText = `If you need professional [${serviceName.toLowerCase()} in ${cityName}](${moneyPageUrl}), our licensed team is available 24/7.`;
      content = content.slice(0, firstBreak) + '\n\n' + linkText + content.slice(firstBreak);
    }
  }

  // Add sibling article links before the last section
  if (siblings.length > 0) {
    const siblingLinks = siblings.slice(0, 3).map(s =>
      `- [${s.title}](/resources/${s.cluster}/${s.slug}/)`
    ).join('\n');

    const relatedSection = `\n\n## Related Articles\n\nLearn more about restoration services in ${cityName}:\n\n${siblingLinks}`;

    // Insert before the last ## heading or at the end
    const lastHeadingIndex = content.lastIndexOf('\n## ');
    if (lastHeadingIndex > content.length / 2) {
      content = content.slice(0, lastHeadingIndex) + relatedSection + content.slice(lastHeadingIndex);
    } else {
      content += relatedSection;
    }
  }

  // Add cluster hub link if not present
  if (!content.includes(clusterHubUrl)) {
    content += `\n\nFor more information, visit our [${article.clusterName.toLowerCase()} resources](${clusterHubUrl}).`;
  }

  return content;
}

/**
 * Update cross-links in existing articles when new articles are added.
 * Ensures sibling articles in the same city-service chain link to each other.
 */
export function updateCrossLinks(allArticles) {
  let updatedCount = 0;

  // Group articles by city+service
  const groups = {};
  for (const article of allArticles) {
    if (!article.city || !article.service) continue;
    const key = `${article.city}-${article.service}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(article);
  }

  // For each group, ensure cross-links exist
  for (const [key, group] of Object.entries(groups)) {
    if (group.length < 2) continue;

    for (const article of group) {
      const siblings = group.filter(a => a.slug !== article.slug);
      let modified = false;

      for (const sibling of siblings) {
        const siblingUrl = `/resources/${sibling.cluster}/${sibling.slug}/`;
        if (!article.content.includes(siblingUrl)) {
          // Check if we already have a Related Articles section
          if (article.content.includes('## Related Articles')) {
            // Add to existing section
            const relatedIdx = article.content.indexOf('## Related Articles');
            const nextSection = article.content.indexOf('\n## ', relatedIdx + 5);
            const insertPoint = nextSection > -1 ? nextSection : article.content.length;
            const newLink = `\n- [${sibling.title}](${siblingUrl})`;
            // Only add if not too many links already
            const existingLinks = (article.content.slice(relatedIdx, insertPoint).match(/\n- \[/g) || []).length;
            if (existingLinks < 5) {
              article.content = article.content.slice(0, insertPoint) + newLink + article.content.slice(insertPoint);
              modified = true;
            }
          }
        }
      }

      if (modified) updatedCount++;
    }
  }

  return updatedCount;
}

function getCityCountySlug(article) {
  // Determine county slug from city data - default to los-angeles-county
  return 'los-angeles-county'; // Will be overridden by actual data in pipeline
}

function getServiceName(serviceSlug) {
  const names = {
    'water-damage-restoration': 'Water Damage Restoration',
    'fire-smoke-damage-restoration': 'Fire & Smoke Damage Restoration',
    'mold-remediation': 'Mold Remediation',
    'sewage-backup-cleanup': 'Sewage Backup & Cleanup',
    'construction-remodeling': 'Construction & Remodeling',
  };
  return names[serviceSlug] || serviceSlug;
}
