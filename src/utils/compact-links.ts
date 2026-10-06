import pages from '../data/compact-services.json';
const owners: Record<string, string> = {
  'emergency-board-up-and-securing': 'F6',
  'content-cleaning-and-pack-out': 'F4',
  'frozen-and-burst-pipes-winter': 'W2',
  'appliance-and-water-heater-leaks': 'W3',
  'roof-and-ceiling-leak-water-damage': 'W9',
  'saving-floors-after-water-damage': 'W8',
  'toilet-overflow-cleanup': 'S2',
  'water-damage-emergency-first-24-hours': 'W1',
  'water-damage-storm-and-hail-flooding': 'W4',
  'structural-drying-and-mold-prevention': 'W7',
  'bathroom-and-shower-mold-cleanup': 'M1',
  'preventing-mold-after-a-water-leak': 'M3',
  'smoke-soot-and-odor-removal': 'F2',
  'kitchen-and-electrical-fire-recovery': 'F1',
};
export function compactOwnerForArticle(slug: string) {
  const match = Object.entries(owners).find(([prefix]) => slug.startsWith(`${prefix}-`));
  return match ? pages.find(page => page.id === match[1]) : undefined;
}

export function compactTopicsForArticle(slug: string) {
  if (slug.startsWith('attic-and-crawlspace-mold-basics-')) {
    return pages.filter(page => ['M5', 'M6'].includes(page.id));
  }
  const owner = compactOwnerForArticle(slug);
  return owner ? [owner] : [];
}
