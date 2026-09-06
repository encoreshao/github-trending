import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOPICS, getTopicSlug } from '../src/data/topics.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://github.ranbot.online';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

// Static app routes (see src/NewApp.jsx for the source of truth).
const STATIC_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/weekly', changefreq: 'daily', priority: '0.9' },
  { path: '/monthly', changefreq: 'weekly', priority: '0.8' },
  { path: '/topics', changefreq: 'weekly', priority: '0.7' },
  { path: '/demo', changefreq: 'monthly', priority: '0.6' },
  { path: '/subscribe', changefreq: 'monthly', priority: '0.5' },
];

const TOPIC_ROUTES = TOPICS.map((topic) => ({
  path: `/topics/${getTopicSlug(topic)}`,
  changefreq: 'weekly',
  priority: '0.6',
}));

const buildSitemap = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = [...STATIC_ROUTES, ...TOPIC_ROUTES]
    .map(
      ({ path: routePath, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${routePath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
};

await fs.ensureDir(path.dirname(OUTPUT_PATH));
await fs.writeFile(OUTPUT_PATH, buildSitemap());

console.log(`Sitemap written to ${path.relative(process.cwd(), OUTPUT_PATH)} (${STATIC_ROUTES.length + TOPIC_ROUTES.length} URLs)`);
