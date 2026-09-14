import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://smartorga.ma';
const CONTENT_DIR = path.resolve(process.cwd(), 'content/voyages');
const OUTPUT_FILE = path.resolve(process.cwd(), 'public/sitemap.xml');

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function generateSitemap() {
  const today = getTodayDate();
  const urls = [
    {
      loc: `${BASE_URL}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      loc: `${BASE_URL}/#sejours`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.9'
    },
    {
      loc: `${BASE_URL}/#about`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${BASE_URL}/#why-us`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${BASE_URL}/#faq`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7'
    }
  ];

  // Scan voyages if folder exists
  if (fs.existsSync(CONTENT_DIR)) {
    const files = fs.readdirSync(CONTENT_DIR);
    for (const file of files) {
      if (!file.endsWith('.json') && !file.endsWith('.md')) continue;

      const filePath = path.join(CONTENT_DIR, file);
      const stat = fs.statSync(filePath);
      const lastmod = stat.mtime.toISOString().split('T')[0];
      const slug = file.replace(/\.(json|md)$/, '');

      // Check if voyage is archived
      let isArchived = false;
      try {
        if (file.endsWith('.json')) {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          if (content.archived) isArchived = true;
        }
      } catch (e) {
        // ignore parse error
      }

      if (!isArchived) {
        urls.push({
          loc: `${BASE_URL}/?voyage=${encodeURIComponent(slug)}`,
          lastmod: lastmod || today,
          changefreq: 'weekly',
          priority: '0.8'
        });
      }
    }
  }

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  fs.writeFileSync(OUTPUT_FILE, xmlContent.trim() + '\n', 'utf-8');
  console.log(`[SEO] Generated sitemap.xml with ${urls.length} URLs at ${OUTPUT_FILE}`);
}

generateSitemap();
