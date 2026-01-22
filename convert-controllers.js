// Script to convert remaining controllers to ESM
import fs from 'fs';
import path from 'path';

const controllersDir = './server/controllers';
const files = ['analyticsController.js', 'contactController.js', 'libraryController.js', 'newsController.js', 'pricingController.js', 'settingsController.js', 'toolController.js'];

files.forEach(file => {
    const filePath = path.join(controllersDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace require statements
    content = content.replace(/const supabase = require\('\.\.\/supabase'\);/g, "import supabase from '../supabase.js';");
    content = content.replace(/const { model } = require\('\.\.\/services\/gemini'\);/g, "import { model } from '../services/gemini.js';");

    // Replace module.exports
    content = content.replace(/module\.exports = \{/g, "export {");
    content = content.replace(/module\.exports = /g, "export default ");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Converted: ${file}`);
});

console.log('All controllers converted to ESM!');
