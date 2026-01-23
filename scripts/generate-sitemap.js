import { createWriteStream } from 'fs';
import { resolve } from 'path';

// Configuration
const SITE_URL = 'https://cic-bim-hub.vn';
const OUTPUT_PATH = resolve(process.cwd(), 'public/sitemap.xml');

// Static routes with metadata
const staticRoutes = [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/cic-platform', priority: 0.9, changefreq: 'weekly' },
    { path: '/dao-tao', priority: 0.8, changefreq: 'weekly' },
    { path: '/du-an', priority: 0.8, changefreq: 'weekly' },
];

// Dynamic routes (will be populated from database in production)
// For now, we'll use placeholder IDs
const dynamicRoutes = [
    // News articles (example IDs)
    { path: '/news/1', priority: 0.7, changefreq: 'monthly' },
    { path: '/news/2', priority: 0.7, changefreq: 'monthly' },
    { path: '/news/3', priority: 0.7, changefreq: 'monthly' },
];

/**
 * Generate XML sitemap
 */
function generateSitemap() {
    const stream = createWriteStream(OUTPUT_PATH);

    // XML header
    stream.write('<?xml version="1.0" encoding="UTF-8"?>\n');
    stream.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');

    // Static routes
    staticRoutes.forEach(route => {
        stream.write('  <url>\n');
        stream.write(`    <loc>${SITE_URL}${route.path}</loc>\n`);
        stream.write(`    <priority>${route.priority}</priority>\n`);
        stream.write(`    <changefreq>${route.changefreq}</changefreq>\n`);
        stream.write(`    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`);
        stream.write('  </url>\n');
    });

    // Dynamic routes
    dynamicRoutes.forEach(route => {
        stream.write('  <url>\n');
        stream.write(`    <loc>${SITE_URL}${route.path}</loc>\n`);
        stream.write(`    <priority>${route.priority}</priority>\n`);
        stream.write(`    <changefreq>${route.changefreq}</changefreq>\n`);
        stream.write(`    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`);
        stream.write('  </url>\n');
    });

    // Close XML
    stream.write('</urlset>\n');
    stream.end();

    stream.on('finish', () => {
        console.log('✅ Sitemap generated successfully at:', OUTPUT_PATH);
        console.log(`📍 Total URLs: ${staticRoutes.length + dynamicRoutes.length}`);
    });

    stream.on('error', (err) => {
        console.error('❌ Error generating sitemap:', err);
        process.exit(1);
    });
}

// Run generator
generateSitemap();
