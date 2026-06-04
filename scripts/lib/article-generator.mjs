import Anthropic from '@anthropic-ai/sdk';
import { CLAUDE, CLUSTER_MAP } from './config.mjs';
import { getAngle, buildTitle, buildSlug } from './angle-registry.mjs';

let client = null;

function getClient() {
  if (!client) {
    client = new Anthropic();
  }
  return client;
}

const SYSTEM_PROMPT = `You are a content writer for Go Green Restoration Inc, a licensed (CA #1005708) eco-friendly restoration company serving Los Angeles and Ventura Counties. Write unique, informative blog articles that are genuinely useful to homeowners in the specified city.

RULES:
- Every paragraph must contain city-specific information — no generic filler
- Reference specific neighborhoods, landmarks, and local conditions naturally
- Mention Go Green Restoration once as the local expert (not a sales pitch)
- Write for homeowners, not industry professionals
- Use a helpful, authoritative tone
- Do NOT start with "When it comes to..." or similar cliches
- Do NOT use the word "crucial" or "comprehensive"
- Format: plain text with ## headings (no # h1). Use 4-6 ## sections.
- Length: 800-1200 words
- Return valid JSON only`;

export async function generateArticle(city, service, angleIndex, dryRun = false) {
  const angle = getAngle(service.slug, angleIndex);
  if (!angle) throw new Error(`Invalid angle ${angleIndex} for ${service.slug}`);

  const title = buildTitle(service.slug, angleIndex, city.name, city.characteristics);
  const slug = buildSlug(service.slug, angleIndex, city.slug);
  const clusterInfo = CLUSTER_MAP[service.slug];
  const moneyPageUrl = `/${service.slug}/${city.slug}/`;

  if (dryRun) {
    return {
      title,
      slug,
      cluster: clusterInfo.cluster,
      clusterName: clusterInfo.clusterName,
      description: `[DRY RUN] Article about ${service.name} in ${city.name}`,
      content: `## Dry Run Article\n\nThis is a placeholder for: ${title}\n\n## Local Context\n\n${city.commonIssues || 'No specific issues documented.'}\n\n## Our Process\n\nGo Green Restoration provides [${service.name.toLowerCase()} in ${city.name}](${moneyPageUrl}) with 24/7 emergency response.\n\n## Prevention Tips\n\nRegular maintenance is key for ${city.name} properties.\n\n## When to Call a Professional\n\nIf you notice damage, contact a licensed professional immediately.`,
      city: city.slug,
      cityName: city.name,
      service: service.slug,
      angle: angleIndex,
      image: null,
      imageAlt: null,
      generatedDate: new Date().toISOString().split('T')[0],
    };
  }

  const userPrompt = `Write a blog article with these specifications:

ARTICLE: ${title}
CITY: ${city.name}, CA (${city.county})
SERVICE: ${service.name}
FOCUS: ${angle.promptFocus}

CITY DATA:
- Population: ${city.population || 'N/A'}
- Neighborhoods: ${(city.neighborhoods || []).join(', ') || 'N/A'}
- Landmarks: ${(city.landmarks || []).join(', ') || 'N/A'}
- ZIP codes: ${(city.zips || []).join(', ') || 'N/A'}
- Characteristics: ${(city.characteristics || []).join(', ') || 'N/A'}
- Common local issues: ${city.commonIssues || 'N/A'}
- Nearby cities: ${(city.nearbyCities || []).join(', ') || 'N/A'}

LINKING REQUIREMENT:
Include this exact markdown link naturally in the article (within the first 2-3 paragraphs): [${service.name.toLowerCase()} in ${city.name}](${moneyPageUrl})

Return ONLY valid JSON with this exact structure (no markdown code fence):
{"title": "the article title", "description": "max 160 char meta description with city name", "content": "the full article content with ## headings"}`;

  const anthropic = getClient();
  let lastError = null;

  for (let attempt = 0; attempt < CLAUDE.maxRetries; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: CLAUDE.model,
        max_tokens: CLAUDE.maxTokens,
        temperature: CLAUDE.temperature,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const text = response.content[0].text.trim();
      // Try to extract JSON from the response
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        // Try to find JSON in the response
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          json = JSON.parse(match[0]);
        } else {
          throw new Error('No valid JSON in response');
        }
      }

      return {
        title: json.title || title,
        slug,
        cluster: clusterInfo.cluster,
        clusterName: clusterInfo.clusterName,
        description: json.description || `${service.name} in ${city.name}, CA. Professional restoration services from Go Green Restoration.`,
        content: json.content || '',
        city: city.slug,
        cityName: city.name,
        service: service.slug,
        angle: angleIndex,
        image: null,
        imageAlt: null,
        generatedDate: new Date().toISOString().split('T')[0],
      };
    } catch (err) {
      lastError = err;
      if (err?.status === 429) {
        const wait = Math.pow(2, attempt + 1) * 1000;
        console.log(`  Rate limited. Waiting ${wait / 1000}s...`);
        await new Promise(r => setTimeout(r, wait));
      } else {
        console.error(`  API error (attempt ${attempt + 1}): ${err.message}`);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  throw new Error(`Failed after ${CLAUDE.maxRetries} attempts: ${lastError?.message}`);
}
