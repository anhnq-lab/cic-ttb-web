// Vercel Serverless Function handler for Express app
// This file allows Vercel to run the Express backend as serverless functions

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load environment variables
import '../server/env.js';

// ESM __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import setupSecurity from '../server/middleware/security.js';
import authRouter from '../server/routes/auth.js';
import projectsRouter from '../server/routes/projects.js';
import aiRouter from '../server/routes/ai.js';
import newsRouter from '../server/routes/news.js';
import libraryRouter from '../server/routes/library.js';
import toolsRouter from '../server/routes/tools.js';
import contactsRouter from '../server/routes/contacts.js';
import pricingRouter from '../server/routes/pricing.js';
import settingsRouter from '../server/routes/settings.js';
import analyticsRouter from '../server/routes/analytics.js';
import trainingRouter from '../server/routes/training.js';
import adminRouter from '../server/routes/admin.js';

const app = express();

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
        if (!origin) return callback(null, true);
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

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Server Error:", err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Export handler for Vercel Serverless Functions
// Vercel requires a function handler, not the app directly
export default (req, res) => {
    // Handle the request with Express app
    app(req, res);
};
