
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

// ESM fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const SITE_URL = 'https://cic-bim-hub.vn';
const OUTPUT_PATH = resolve(process.cwd(), 'public/sitemap.xml');

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    // Don't exit, just generate static sitemap
}

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Static routes with metadata
const staticRoutes = [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/cic-platform', priority: 0.9, changefreq: 'weekly' },
    { path: '/dao-tao', priority: 0.9, changefreq: 'weekly' },
    { path: '/du-an', priority: 0.8, changefreq: 'weekly' },
    { path: '/admin', priority: 0.1, changefreq: 'monthly' } // Usually inhibit admin in sitemap, but keeping for completeness or removing? Better remove or set low priority.
];

async function fetchDynamicRoutes() {
    if (!supabase) return [];

    const routes = [];

    // 1. Fetch News
    try {
        const { data: news, error } = await supabase
            .from('news')
            .select('id, date')
            .order('date', { ascending: false });

        if (!error && news) {
            console.log(`Found ${news.length} news articles.`);
            news.forEach(item => {
                routes.push({
                    path: `/news/${item.id}`,
                    priority: 0.7,
                    changefreq: 'monthly',
                    lastmod: item.date // assuming date format matches or is parsable
                });
            });
        } else {
            console.warn('Error fetching news for sitemap:', error);
        }
    } catch (e) {
        console.warn('Exception fetching news:', e);
    }

    // 2. Fetch Training Courses
    try {
        const { data: courses, error } = await supabase
            .from('training_courses')
            .select('slug, created_at')
            .eq('is_active', true);

        if (!error && courses) {
            console.log(`Found ${courses.length} training courses.`);
            courses.forEach(course => {
                if (course.slug) {
                    routes.push({
                        path: `/dao-tao/${course.slug}`,
                        priority: 0.8,
                        changefreq: 'weekly',
                        lastmod: course.created_at ? course.created_at.split('T')[0] : undefined
                    });
                }
            });
        } else {
            console.warn('Error fetching courses for sitemap:', error);
        }
    } catch (e) {
        console.warn('Exception fetching courses:', e);
    }

    return routes;
}

/**
 * Generate XML sitemap
 */
async function generateSitemap() {
    console.log('🚀 Starting Sitemap Generation...');

    const dynamicRoutes = await fetchDynamicRoutes();
    const allRoutes = [...staticRoutes, ...dynamicRoutes];

    const stream = createWriteStream(OUTPUT_PATH);

    // XML header
    stream.write('<?xml version="1.0" encoding="UTF-8"?>\n');
    stream.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');

    // Write URLs
    allRoutes.forEach(route => {
        // Skip admin if desired, but here we explicitly requested it in staticRoutes[4].
        // Ideally remove admin from sitemap.
        if (route.path === '/admin') return;

        stream.write('  <url>\n');
        stream.write(`    <loc>${SITE_URL}${route.path}</loc>\n`);
        stream.write(`    <priority>${route.priority}</priority>\n`);
        stream.write(`    <changefreq>${route.changefreq}</changefreq>\n`);

        const lastmod = route.lastmod || new Date().toISOString().split('T')[0];
        stream.write(`    <lastmod>${lastmod}</lastmod>\n`);
        stream.write('  </url>\n');
    });

    // Close XML
    stream.write('</urlset>\n');
    stream.end();

    stream.on('finish', () => {
        console.log('✅ Sitemap generated successfully at:', OUTPUT_PATH);
        console.log(`📍 Total URLs: ${allRoutes.length - 1}`); // -1 for admin
    });

    stream.on('error', (err) => {
        console.error('❌ Error generating sitemap:', err);
        process.exit(1);
    });
}

// Run generator
generateSitemap();
