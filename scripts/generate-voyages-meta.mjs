import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.resolve(process.cwd(), 'content/voyages');
const OUTPUT_FILE = path.resolve(process.cwd(), 'src/data/voyagesMeta.json');

export function generateVoyagesMeta() {
  const meta = {};
  if (fs.existsSync(CONTENT_DIR)) {
    const files = fs.readdirSync(CONTENT_DIR);
    for (const file of files) {
      if (!file.endsWith('.json') && !file.endsWith('.md')) continue;
      const filePath = path.join(CONTENT_DIR, file);
      const stat = fs.statSync(filePath);
      const slug = file.replace(/\.(json|md)$/, '');
      meta[slug] = {
        mtime: stat.mtimeMs,
        mtimeIso: stat.mtime.toISOString(),
        birthtime: stat.birthtimeMs || stat.ctimeMs || stat.mtimeMs
      };
    }
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(meta, null, 2), 'utf-8');
  console.log('Generated voyagesMeta.json for', Object.keys(meta).length, 'files');

  // Keep public/content/settings/hero_mobile.json in sync with content/settings/hero_mobile.json
  try {
    const srcHero = path.resolve(process.cwd(), 'content/settings/hero_mobile.json');
    const destHero = path.resolve(process.cwd(), 'public/content/settings/hero_mobile.json');
    if (fs.existsSync(srcHero)) {
      fs.mkdirSync(path.dirname(destHero), { recursive: true });
      fs.copyFileSync(srcHero, destHero);
      console.log('Synced hero_mobile.json to public/content/settings/');
    }
  } catch (err) {
    console.warn('Could not sync hero_mobile.json to public:', err);
  }
}

generateVoyagesMeta();
