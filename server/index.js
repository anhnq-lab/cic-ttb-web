const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
try {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
} catch (e) {
    console.warn("Dotenv load failed (expected in production if using Vercel env vars)");
}

const setupSecurity = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

console.log("Starting CIC Backend..."); // Debug log

// Middleware
app.use(cors({
    origin: ['https://anhnq-lab.github.io', 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-supabase-signature']
}));
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit for base64 images

// Apply Security Middleware (Helmet, Rate Limit)
setupSecurity(app);

// --- ROUTES ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/news', require('./routes/news'));
app.use('/api/library', require('./routes/library'));
app.use('/api/tools', require('./routes/tools'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/pricing', require('./routes/pricing'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/analytics', require('./routes/analytics'));

// Production Static Files & SPA Fallback
if (isProduction) {
    const fs = require('fs');
    const distPath = path.join(__dirname, '../dist');

    // Check if dist exists before serving
    if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        console.log(`Serving static files from: ${distPath} `);

        // SPA Fallback
        app.get('*', (req, res) => {
            if (req.path.startsWith('/api') || req.path.match(/\.(json|glb|gltf|bin|jpg|png|css|js|map|ico)$/)) {
                return res.status(404).json({ error: 'Resource not found' });
            }
            res.sendFile(path.join(distPath, 'index.html'));
        });
    } else {
        console.log('Dist folder not found, running in API-only mode');
        app.get('/', (req, res) => {
            res.send(`
                <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: #0066cc;">CIC BIM Hub API is Running!</h1>
                    <p>Hệ thống Backend (Refactored) đang hoạt động tốt.</p>
                    <p>Vui lòng truy cập giao diện chính tại: <a href="https://anhnq-lab.github.io/cic-ttb-web/">anhnq-lab.github.io/cic-ttb-web</a></p>
                </div>
            `);
        });
    }
}

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Server Error:", err);
    res.status(500).json({ error: "Internal Server Error", message: err.message, stack: isProduction ? null : err.stack });
});

// Start Server (Only if not running in Vercel/Serverless environment)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
        console.log(`Database: Supabase Connected`);
    });
}

module.exports = app;
