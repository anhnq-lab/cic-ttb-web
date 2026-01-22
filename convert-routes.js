// Script to convert remaining routes to ESM
import fs from 'fs';
import path from 'path';

const routesDir = './server/routes';
const files = ['ai.js', 'analytics.js', 'contacts.js', 'library.js', 'news.js', 'pricing.js', 'settings.js', 'tools.js', 'training.js'];

files.forEach(file => {
    const filePath = path.join(routesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace require statements
    content = content.replace(/const express = require\('express'\);/g, "import express from 'express';");
    content = content.replace(/const router = require\('express'\)\.Router\(\);/g, "import express from 'express';\nconst router = express.Router();");
    content = content.replace(/const supabase = require\('\.\.\/supabase'\);/g, "import supabase from '../supabase.js';");
    content = content.replace(/const { authenticateToken } = require\('\.\.\/middleware\/auth'\);/g, "import { authenticateToken } from '../middleware/auth.js';");
    content = content.replace(/const { authenticateToken, isAdmin } = require\('\.\.\/middleware\/auth'\);/g, "import { authenticateToken, isAdmin } from '../middleware/auth.js';");

    // Replace module.exports
    content = content.replace(/module\.exports = router;/g, "export default router;");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Converted: ${file}`);
});

console.log('All routes converted to ESM!');
