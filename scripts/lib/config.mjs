import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..', '..');

export const PATHS = {
  root: ROOT,
  blogArticles: join(ROOT, 'src', 'data', 'blog-articles.json'),
  citiesLA: join(ROOT, 'src', 'data', 'cities-la-county.json'),
  citiesVentura: join(ROOT, 'src', 'data', 'cities-ventura-county.json'),
  services: join(ROOT, 'src', 'data', 'services.json'),
  generationState: join(ROOT, 'scripts', 'data', 'generation-state.json'),
  imageCatalog: join(ROOT, 'scripts', 'data', 'image-catalog.json'),
  imageOriginals: join(ROOT, 'public', 'images', 'blog', 'originals'),
  imageBlog: join(ROOT, 'public', 'images', 'blog'),
  cronLog: join(ROOT, 'scripts', 'data', 'cron.log'),
};

export const CLAUDE = {
  model: 'claude-sonnet-4-20250514',
  maxTokens: 4096,
  temperature: 0.7,
  batchSize: 10,
  batchDelayMs: 2000,
  maxRetries: 3,
};

export const CLUSTER_MAP = {
  'water-damage-restoration': { cluster: 'water-damage', clusterName: 'Water Damage' },
  'fire-smoke-damage-restoration': { cluster: 'fire-damage', clusterName: 'Fire & Smoke Damage' },
  'mold-remediation': { cluster: 'mold', clusterName: 'Mold' },
  'sewage-backup-cleanup': { cluster: 'sewage-plumbing', clusterName: 'Sewage & Plumbing' },
  'construction-remodeling': { cluster: 'home-restoration', clusterName: 'Home Restoration' },
};

export const INITIAL_ARTICLES_PER_COMBO = 3;
export const WEEKLY_ARTICLES_PER_CITY = 1;
export const ANGLES_PER_SERVICE = 10;
