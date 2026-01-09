const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authRoutes = require('./routes/auth');
const { authenticateToken } = require('./middleware/auth');
require('dotenv').config({ path: '../.env.local' }); // Read from root .env.local

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors({
    origin: ['https://anhnq-lab.github.io', 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit for base64 images

const fs = require('fs');

// Serve static frontend files in production
if (isProduction) {
    const distPath = path.join(__dirname, '../dist');

    // Check if dist exists before serving
    if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        console.log(`Serving static files from: ${distPath} `);

        // SPA Fallback
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    } else {
        console.log('Dist folder not found, running in API-only mode');
        app.get('/', (req, res) => {
            res.send(`
                <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: #0066cc;">CIC BIM Hub API is Running!</h1>
                    <p>Hệ thống Backend đang hoạt động tốt.</p>
                    <p>Vui lòng truy cập giao diện chính tại: <a href="https://anhnq-lab.github.io/cic-ttb-web/">anhnq-lab.github.io/cic-ttb-web</a></p>
                </div>
            `);
        });
    }
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
let model;

if (process.env.GEMINI_API_KEY) {
    try {
        model = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log("Gemini AI Initialized");
    } catch (error) {
        console.error("Failed to initialize Gemini:", error);
    }
} else {
    console.warn("WARNING: GEMINI_API_KEY is not set. AI features will not work.");
}

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/projects', require('./routes/projects'));

// --- API ENDPOINTS ---

// 1. News API
app.get('/api/news', (req, res) => {
    db.all("SELECT * FROM news ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/news/:id', (req, res) => {
    db.get("SELECT * FROM news WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "News not found" });
        res.json(row);
    });
});

app.get('/api/news/:id/related', (req, res) => {
    // Get 3 latest news excluding current one
    db.all("SELECT * FROM news WHERE id != ? ORDER BY date DESC LIMIT 3", [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

// POST news - protected
app.post('/api/news', authenticateToken, (req, res) => {
    const { title, category, date, imageUrl, excerpt, content, author, videoUrl, audioUrl, attachments, metaTitle, metaDescription, keywords } = req.body;
    const attachmentsStr = attachments ? JSON.stringify(attachments) : null;
    const stmt = db.prepare("INSERT INTO news (title, category, date, imageUrl, excerpt, content, author, videoUrl, audioUrl, attachments, metaTitle, metaDescription, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    stmt.run([title, category, date, imageUrl, excerpt, content, author, videoUrl, audioUrl, attachmentsStr, metaTitle, metaDescription, keywords], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, ...req.body });
    });
    stmt.finalize();
});

// PUT news - protected
app.put('/api/news/:id', authenticateToken, (req, res) => {
    const { title, category, date, imageUrl, excerpt, content, author, videoUrl, audioUrl, attachments, metaTitle, metaDescription, keywords } = req.body;
    const attachmentsStr = attachments ? JSON.stringify(attachments) : null;
    const stmt = db.prepare("UPDATE news SET title=?, category=?, date=?, imageUrl=?, excerpt=?, content=?, author=?, videoUrl=?, audioUrl=?, attachments=?, metaTitle=?, metaDescription=?, keywords=? WHERE id=?");
    stmt.run([title, category, date, imageUrl, excerpt, content, author, videoUrl, audioUrl, attachmentsStr, metaTitle, metaDescription, keywords, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: req.params.id, ...req.body });
    });
    stmt.finalize();
});

// DELETE news - protected
app.delete('/api/news/:id', authenticateToken, (req, res) => {
    db.run("DELETE FROM news WHERE id=?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted", changes: this.changes });
    });
});

// 2. Library API
app.get('/api/library', (req, res) => {
    db.all("SELECT * FROM library ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/library', authenticateToken, (req, res) => {
    const { title, type, description, tag, image_url, link } = req.body;
    const stmt = db.prepare("INSERT INTO library (title, type, description, tag, image_url, link) VALUES (?, ?, ?, ?, ?, ?)");
    stmt.run([title, type, description, tag, image_url, link], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, ...req.body });
    });
    stmt.finalize();
});

app.put('/api/library/:id', authenticateToken, (req, res) => {
    const { title, type, description, tag, image_url, link } = req.body;
    const stmt = db.prepare("UPDATE library SET title=?, type=?, description=?, tag=?, image_url=?, link=? WHERE id=?");
    stmt.run([title, type, description, tag, image_url, link, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: req.params.id, ...req.body });
    });
    stmt.finalize();
});

app.delete('/api/library/:id', authenticateToken, (req, res) => {
    db.run("DELETE FROM library WHERE id=?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted", id: req.params.id });
    });
});

// 3. Tools API
app.get('/api/tools', (req, res) => {
    db.all("SELECT * FROM tools ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/tools', authenticateToken, (req, res) => {
    const { title, description, icon, link } = req.body;
    const stmt = db.prepare("INSERT INTO tools (title, description, icon, link) VALUES (?, ?, ?, ?)");
    stmt.run([title, description, icon, link], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, ...req.body });
    });
    stmt.finalize();
});

app.put('/api/tools/:id', authenticateToken, (req, res) => {
    const { title, description, icon, link } = req.body;
    const stmt = db.prepare("UPDATE tools SET title=?, description=?, icon=?, link=? WHERE id=?");
    stmt.run([title, description, icon, link, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: req.params.id, ...req.body });
    });
    stmt.finalize();
});

app.delete('/api/tools/:id', authenticateToken, (req, res) => {
    db.run("DELETE FROM tools WHERE id=?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted", id: req.params.id });
    });
});

// 4. Contacts API
app.get('/api/contacts', (req, res) => {
    db.all("SELECT * FROM contacts ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/contacts', (req, res) => {
    const { name, email, phone, service, note, company } = req.body;
    const stmt = db.prepare("INSERT INTO contacts (name, email, phone, service, note, company) VALUES (?, ?, ?, ?, ?, ?)");
    stmt.run([name, email, phone, service, note, company], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, ...req.body });
    });
    stmt.finalize();
});

app.delete('/api/contacts/:id', authenticateToken, (req, res) => {
    db.run("DELETE FROM contacts WHERE id=?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted", id: req.params.id });
    });
});

// 5. Pricing API
app.get('/api/pricing', (req, res) => {
    db.all("SELECT * FROM pricing", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Parse features JSON string to array
        const parsedRows = rows.map(r => ({
            ...r,
            features: r.features ? JSON.parse(r.features) : []
        }));
        res.json(parsedRows);
    });
});

app.put('/api/pricing/:id', authenticateToken, (req, res) => {
    const { name, price, period, description, features, ctaText, isPopular } = req.body;
    const featuresStr = JSON.stringify(features);
    const stmt = db.prepare("UPDATE pricing SET name=?, price=?, period=?, description=?, features=?, ctaText=?, isPopular=? WHERE id=?");
    stmt.run([name, price, period, description, featuresStr, ctaText, isPopular ? 1 : 0, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: req.params.id, ...req.body });
    });
    stmt.finalize();
});

// 6. Settings API
app.get('/api/settings', (req, res) => {
    db.get("SELECT value FROM settings WHERE key = 'general'", (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row ? JSON.parse(row.value) : {});
    });
});

app.post('/api/settings', authenticateToken, (req, res) => {
    const settings = JSON.stringify(req.body);
    db.run("INSERT OR REPLACE INTO settings (key, value) VALUES ('general', ?)", [settings], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json(req.body);
    });
});

// 7. Analytics API
app.get('/api/analytics/stats', (req, res) => {
    const stats = {};
    db.get("SELECT count(*) as count FROM news", (err, row) => {
        stats.news = row.count;
        db.get("SELECT count(*) as count FROM contacts", (err, row) => {
            stats.contacts = row.count;
            db.get("SELECT count(*) as count FROM library", (err, row) => {
                stats.library = row.count;
                res.json({
                    views: Math.floor(Math.random() * 5000) + 1000, // Mock views
                    contacts: stats.contacts,
                    news: stats.news,
                    library: stats.library
                });
            });
        });
    });
});

app.get('/api/analytics/insight', async (req, res) => {
    if (!model) return res.json({ insight: "AI service not configured." });

    // Get summary of data to feed AI
    db.all("SELECT service, count(*) as count FROM contacts GROUP BY service", [], async (err, rows) => {
        try {
            const prompt = `Bạn là quản lý website.Dưới đây là thống kê lượt liên hệ theo dịch vụ: ${JSON.stringify(rows)}. Hãy đưa ra 3 dòng phân tích ngắn gọn và lời khuyên Marketing để tăng chuyển đổi.Trả về text thuần.`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            res.json({ insight: response.text() });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
});

// 8. AI Generation API
app.post('/api/ai/generate', authenticateToken, async (req, res) => {
    const { prompt, type } = req.body;

    if (!model) {
        return res.status(503).json({ error: "AI service unavailable (Check API Key)" });
    }

    try {
        let systemPrompt = "";

        if (type === 'post') {
            systemPrompt = `Bạn là chuyên gia Content Marketing về BIM và Xây dựng.Hãy viết một bài viết chuẩn SEO, hấp dẫn về chủ đề sau.Trả về kết quả dưới dạng JSON với các trường: title(tiêu đề), excerpt(tóm tắt), content(nội dung HTML).Chủ đề: `;
        } else if (type === 'seo') {
            systemPrompt = `Bạn là chuyên gia SEO.Hãy tạo Meta Tags cho nội dung sau.Trả về JSON gồm: metaTitle, metaDescription, keywords(mảng).Nội dung: `;
        } else if (type === 'social') {
            systemPrompt = `Bạn là Social Media Manager.Hãy viết nội dung đăng Facebook, LinkedIn và Email Marketing cho bài viết sau.Trả về JSON gồm: facebook, linkedin, email.Bài viết: `;
        }

        const result = await model.generateContent(systemPrompt + prompt);
        const response = await result.response;
        const text = response.text();

        // Clean JSON formatting from AI response if markdown blocks exist
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        res.json(JSON.parse(jsonStr));
    } catch (error) {
        console.error("AI Generate Error:", error);
        res.status(500).json({ error: "Failed to generate content" });
    }
});

// SPA Fallback - Must be AFTER all API routes (Production only)
if (isProduction) {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
});
