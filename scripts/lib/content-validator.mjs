/**
 * Validates generated article content quality.
 */

export function validateArticle(article) {
  const errors = [];

  // Check required fields
  if (!article.title) errors.push('Missing title');
  if (!article.slug) errors.push('Missing slug');
  if (!article.content) errors.push('Missing content');
  if (!article.description) errors.push('Missing description');

  if (!article.content) return { valid: false, errors };

  // Word count (600-1500)
  const words = article.content.split(/\s+/).length;
  if (words < 400) errors.push(`Too short: ${words} words (min 400)`);
  if (words > 2000) errors.push(`Too long: ${words} words (max 2000)`);

  // City name mentions (at least 2)
  if (article.cityName) {
    const cityMentions = (article.content.match(new RegExp(article.cityName, 'gi')) || []).length;
    if (cityMentions < 2) errors.push(`City mentioned only ${cityMentions} times (min 2)`);
  }

  // Heading count (at least 3 ## headings)
  const headings = (article.content.match(/^## /gm) || []).length;
  if (headings < 3) errors.push(`Only ${headings} headings (min 3)`);

  // Description length
  if (article.description && article.description.length > 200) {
    errors.push(`Description too long: ${article.description.length} chars (max 200)`);
  }

  return { valid: errors.length === 0, errors };
}
