/**
 * Image Optimization Script
 * - Identifies placeholder images using picsum.photos
 * - Provides recommendations for WebP conversion
 * - Suggests lazy loading implementation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');

// Find all component and page files
function findFiles(dir, pattern = /\.(tsx?|jsx?)$/) {
    let results = [];
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);

        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            results = results.concat(findFiles(filepath, pattern));
        } else if (stat.isFile() && pattern.test(file)) {
            results.push(filepath);
        }
    }

    return results;
}

// Find placeholder images
function findPlaceholderImages() {
    const files = findFiles(projectRoot);
    const placeholders = [];

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
            if (line.includes('picsum.photos') || line.includes('pravatar.cc') || line.includes('unsplash.com')) {
                placeholders.push({
                    file: path.relative(projectRoot, file),
                    line: index + 1,
                    content: line.trim()
                });
            }
        });
    }

    return placeholders;
}

// Main execution
console.log('🔍 Scanning for placeholder images...\n');

const placeholders = findPlaceholderImages();

if (placeholders.length === 0) {
    console.log('✅ No placeholder images found!');
} else {
    console.log(`⚠️  Found ${placeholders.length} placeholder images:\n`);

    placeholders.forEach(({ file, line, content }) => {
        console.log(`📄 ${file}:${line}`);
        console.log(`   ${content}\n`);
    });

    console.log('\n📝 Recommendations:');
    console.log('1. Replace placeholder images with real assets');
    console.log('2. Convert images to WebP format for better compression');
    console.log('3. Add lazy loading with loading="lazy" attribute');
    console.log('4. Use responsive images with srcset for different screen sizes');
    console.log('');
    console.log('Example:');
    console.log('  <img');
    console.log('    src="/assets/image.webp"');
    console.log('    srcset="/assets/image-320w.webp 320w, /assets/image-640w.webp 640w"');
    console.log('    loading="lazy"');
    console.log('    alt="Description"');
    console.log('  />');
}

export { findPlaceholderImages };
