#!/usr/bin/env node
/**
 * Inventory photos dropped in photo-intake/ before any of them go near the site.
 *
 * Writes photo-intake/_manifest.json and prints a summary. Copies nothing,
 * publishes nothing, changes nothing outside photo-intake/.
 *
 * Flags the three things that actually matter for job photos:
 *   - GPS in EXIF, which is a customer's home address travelling with the file
 *   - exact duplicates, which phone libraries produce constantly
 *   - files too small or too dark to use
 */
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, extname, relative } from 'path';
import { createHash } from 'crypto';
import sharp from 'sharp';

const ROOT = process.cwd();
const INTAKE = join(ROOT, 'photo-intake');
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp', '.tif', '.tiff']);
const CLUSTERS = ['water-damage', 'fire-damage', 'mold', 'sewage-plumbing', 'home-restoration'];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || name.startsWith('_')) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (EXTS.has(extname(name).toLowerCase())) out.push(p);
  }
  return out;
}

// EXIF GPS IFD marker. Cheap presence check — we don't need to decode it,
// only to know the file is carrying location before anyone publishes it.
function hasGps(exifBuf) {
  if (!exifBuf) return false;
  for (let i = 0; i < exifBuf.length - 1; i++) {
    const tag = exifBuf.readUInt16LE(i);
    const tagBE = exifBuf.readUInt16BE(i);
    if (tag === 0x8825 || tagBE === 0x8825) return true;
  }
  return false;
}

const files = walk(INTAKE);
if (!files.length) {
  console.log('photo-intake/ is empty. Drop photos in and run this again.');
  process.exit(0);
}

const seen = new Map();
const rows = [];

for (const f of files) {
  const buf = readFileSync(f);
  const hash = createHash('sha1').update(buf).digest('hex').slice(0, 12);
  const rel = relative(INTAKE, f);
  const folder = rel.includes('/') ? rel.split('/')[0].toLowerCase() : '';

  let meta = {};
  let stats = null;
  try {
    const img = sharp(f, { failOn: 'none' });
    meta = await img.metadata();
    stats = await img.stats();
  } catch (err) {
    rows.push({ file: rel, hash, error: String(err.message).slice(0, 80) });
    continue;
  }

  // sharp reports pre-rotation dimensions; orientation 5-8 means the display
  // frame is swapped, which is how portrait phone shots arrive.
  const swapped = meta.orientation >= 5 && meta.orientation <= 8;
  const w = swapped ? meta.height : meta.width;
  const h = swapped ? meta.width : meta.height;
  const brightness = stats ? Math.round(stats.channels.reduce((a, c) => a + c.mean, 0) / stats.channels.length) : null;

  const flags = [];
  if (seen.has(hash)) flags.push(`duplicate-of:${seen.get(hash)}`);
  else seen.set(hash, rel);
  if (hasGps(meta.exif)) flags.push('GPS-IN-EXIF');
  if (w < 1200) flags.push(`low-res:${w}x${h}`);
  if (brightness !== null && brightness < 45) flags.push(`dark:${brightness}`);
  if (h > w) flags.push('portrait');

  rows.push({
    file: rel,
    hash,
    folderHint: CLUSTERS.includes(folder) ? folder : null,
    width: w,
    height: h,
    aspect: +(w / h).toFixed(2),
    bytes: buf.length,
    brightness,
    flags,
    // filled in after Claude views the photo
    cluster: CLUSTERS.includes(folder) ? folder : null,
    caption: null,
    tags: [],
    approved: null,
  });
}

writeFileSync(join(INTAKE, '_manifest.json'), JSON.stringify(rows, null, 2) + '\n');

const dupes = rows.filter(r => r.flags?.some(f => f.startsWith('duplicate-of')));
const gps = rows.filter(r => r.flags?.includes('GPS-IN-EXIF'));
const small = rows.filter(r => r.flags?.some(f => f.startsWith('low-res')));
const dark = rows.filter(r => r.flags?.some(f => f.startsWith('dark')));
const portrait = rows.filter(r => r.flags?.includes('portrait'));
const usable = rows.filter(r => !r.error && !r.flags?.some(f => f.startsWith('duplicate-of') || f.startsWith('low-res')));

console.log(`\n${rows.length} photos in photo-intake/\n`);
console.log(`  usable at first pass   ${usable.length}`);
console.log(`  exact duplicates       ${dupes.length}`);
console.log(`  carrying GPS in EXIF   ${gps.length}${gps.length ? '   <- customer addresses; stripped before publish' : ''}`);
console.log(`  under 1200px wide      ${small.length}`);
console.log(`  very dark              ${dark.length}`);
console.log(`  portrait orientation   ${portrait.length}`);

const byHint = {};
for (const r of rows) byHint[r.folderHint || '(unsorted)'] = (byHint[r.folderHint || '(unsorted)'] || 0) + 1;
console.log('\n  by folder hint:');
for (const [k, v] of Object.entries(byHint)) console.log(`    ${k.padEnd(20)} ${v}`);
console.log('\nWrote photo-intake/_manifest.json — tell Claude and it will caption from here.\n');
