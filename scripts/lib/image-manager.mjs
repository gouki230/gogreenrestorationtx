import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { PATHS } from './config.mjs';

/**
 * Load image catalog from disk.
 */
export function loadImageCatalog() {
  if (!existsSync(PATHS.imageCatalog)) return [];
  return JSON.parse(readFileSync(PATHS.imageCatalog, 'utf-8'));
}

/**
 * Save image catalog to disk.
 */
export function saveImageCatalog(catalog) {
  writeFileSync(PATHS.imageCatalog, JSON.stringify(catalog, null, 2));
}

/**
 * Select the best image for an article from the catalog.
 * Prioritizes: matching tags > lower usage count > random
 */
export function selectImage(catalog, clusterSlug, serviceSlug) {
  if (catalog.length === 0) return null;

  // Score images by tag match and usage
  const scored = catalog.map(img => {
    let score = 0;
    const tags = img.tags || [];

    // Tag matching
    if (tags.some(t => clusterSlug.includes(t) || t.includes(clusterSlug.split('-')[0]))) score += 10;
    if (tags.some(t => serviceSlug.includes(t))) score += 5;
    if (tags.includes('restoration') || tags.includes('team') || tags.includes('equipment')) score += 2;

    // Prefer less-used images
    score -= (img.usageCount || 0) * 3;

    // Small random factor for variety
    score += Math.random() * 2;

    return { ...img, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0];
}

/**
 * Process an image for an article: copy, rename for SEO, and resize.
 * Returns the public URL path for the processed image.
 */
export async function processImage(image, articleSlug, clusterSlug, cityData) {
  if (!image) return { imagePath: null, imageAlt: null };

  const originalPath = join(PATHS.imageOriginals, image.path || image.originalName);
  if (!existsSync(originalPath)) {
    console.warn(`  Image not found: ${originalPath}`);
    return { imagePath: null, imageAlt: null };
  }

  const outputDir = join(PATHS.imageBlog, clusterSlug);
  mkdirSync(outputDir, { recursive: true });

  const ext = extname(image.originalName);
  const seoFilename = `${articleSlug}${ext}`;
  const outputPath = join(outputDir, seoFilename);
  const publicUrl = `/images/blog/${clusterSlug}/${seoFilename}`;

  try {
    const sharp = (await import('sharp')).default;

    // Resize and optimize
    await sharp(originalPath)
      .resize(1200, 630, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    // Try to geotag with EXIF data
    if (cityData?.lat && cityData?.lng) {
      try {
        await geotagImage(outputPath, cityData.lat, cityData.lng);
      } catch {
        // Geotagging is best-effort, don't fail the article
      }
    }

    // Increment usage count
    image.usageCount = (image.usageCount || 0) + 1;

    return { imagePath: publicUrl, imageAlt: image.description || `Restoration services in ${cityData?.name || 'your area'}` };
  } catch (err) {
    // Fallback: just copy the file
    console.warn(`  Sharp processing failed, copying original: ${err.message}`);
    copyFileSync(originalPath, outputPath);
    image.usageCount = (image.usageCount || 0) + 1;
    return { imagePath: publicUrl, imageAlt: image.description || '' };
  }
}

/**
 * Write GPS coordinates to image EXIF data.
 */
async function geotagImage(imagePath, lat, lng) {
  // Use sharp's metadata capabilities for basic EXIF
  // For full EXIF GPS writing, we'd need exiftool-vendored
  // For now, skip geotagging if exiftool isn't available
  try {
    const { exiftool } = await import('exiftool-vendored');
    await exiftool.write(imagePath, {
      GPSLatitude: lat,
      GPSLongitude: lng,
      GPSLatitudeRef: lat >= 0 ? 'N' : 'S',
      GPSLongitudeRef: lng >= 0 ? 'E' : 'W',
    });
  } catch {
    // exiftool-vendored not installed, skip geotagging silently
  }
}
