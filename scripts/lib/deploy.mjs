import { execSync } from 'child_process';
import { PATHS } from './config.mjs';

/**
 * Build the Astro site to verify everything compiles.
 */
export function buildSite() {
  console.log('Building Astro site...');
  try {
    execSync('npx astro build', {
      cwd: PATHS.root,
      stdio: 'pipe',
      timeout: 600000, // 10 minutes for large builds
    });
    console.log('Build successful.');
    return true;
  } catch (err) {
    console.error('Build failed:', err.stderr?.toString() || err.message);
    return false;
  }
}

/**
 * Commit and push changes to git.
 */
export function gitCommitAndPush(articleCount, weekLabel) {
  const message = `content: add ${articleCount} SEO articles (${weekLabel})`;

  try {
    execSync('git add src/data/blog-articles.json scripts/data/ public/images/blog/', {
      cwd: PATHS.root,
      stdio: 'pipe',
    });
    execSync(`git commit -m "${message}"`, {
      cwd: PATHS.root,
      stdio: 'pipe',
    });
    execSync('git push origin main', {
      cwd: PATHS.root,
      stdio: 'pipe',
    });
    console.log(`Git: committed and pushed — "${message}"`);
    return true;
  } catch (err) {
    console.error('Git operation failed:', err.stderr?.toString() || err.message);
    return false;
  }
}
