// Load environment variables first
import './env.js';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ESM __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import setupSecurity from './middleware/security.js';
import authRouter from './routes/auth.js';
import projectsRouter from './routes/projects.js';
import aiRouter from './routes/ai.js';
import newsRouter from './routes/news.js';
import libraryRouter from './routes/library.js';
import toolsRouter from './routes/tools.js';
import contactsRouter from './routes/contacts.js';
import pricingRouter from './routes/pricing.js';
import settingsRouter from './routes/settings.js';
import analyticsRouter from './routes/analytics.js';
import trainingRouter from './routes/training.js';
import adminRouter from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

console.log("Starting CIC Backend...");

// Middleware
// CORS: Allow requests from various origins
const allowedOrigins = [
    'https://anhnq-lab.github.io',
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    // Allow any vercel.app subdomain
    /^https:\/\/.*\.vercel\.app$/
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin matches allowed origins
        const isAllowed = allowedOrigins.some(allowed => {
            if (typeof allowed === 'string') {
                return origin === allowed;
            }
            if (allowed instanceof RegExp) {
                return allowed.test(origin);
            }
            return false;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            // In development, be more permissive
            if (process.env.NODE_ENV !== 'production') {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-supabase-signature']
}));
app.use(bodyParser.json({ limit: '10mb' }));

// Apply Security Middleware
setupSecurity(app);

// --- ROUTES ---
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/news', newsRouter);
app.use('/api/library', libraryRouter);
app.use('/api/tools', toolsRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/pricing', pricingRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/training', trainingRouter);
app.use('/api/admin', adminRouter);

// Production Static Files & SPA Fallback
if (isProduction) {
    const distPath = path.join(__dirname, '../dist');
    if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        console.log(`Serving static files from: ${distPath}`);
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
                    <p>Hệ thống Backend đang hoạt động tốt.</p>
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

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`Database: Supabase Connected`);
});

export default app;
