const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const supabase = require('./supabase');
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
            if (req.path.startsWith('/api')) {
                return res.status(404).json({ error: 'API endpoint not found' });
            }
            res.sendFile(path.join(distPath, 'index.html'));
        });
    } else {
        console.log('Dist folder not found, running in API-only mode');
        app.get('/', (req, res) => {
            res.send(`
                <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: #0066cc;">CIC BIM Hub API is Running!</h1>
                    <p>Hệ thống Backend (Supabase) đang hoạt động tốt.</p>
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
app.get('/api/news', async (req, res) => {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/api/news/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', req.params.id)
        .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "News not found" });
    res.json(data);
});

app.get('/api/news/:id/related', async (req, res) => {
    // Get 3 latest news excluding current one
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .neq('id', req.params.id)
        .order('date', { ascending: false })
        .limit(3);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

// POST news - protected
app.post('/api/news', authenticateToken, async (req, res) => {
    const { title, category, date, imageUrl, excerpt, content, author, videoUrl, audioUrl, attachments, metaTitle, metaDescription, keywords } = req.body;
    // Assume columns are TEXT, so we stringify JSON fields
    const attachmentsStr = attachments ? JSON.stringify(attachments) : null;

    const { data, error } = await supabase
        .from('news')
        .insert([{
            title, category, date, imageUrl, excerpt, content, author, videoUrl, audioUrl, attachments: attachmentsStr, metaTitle, metaDescription, keywords
        }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// PUT news - protected
app.put('/api/news/:id', authenticateToken, async (req, res) => {
    const { title, category, date, imageUrl, excerpt, content, author, videoUrl, audioUrl, attachments, metaTitle, metaDescription, keywords } = req.body;
    const attachmentsStr = attachments ? JSON.stringify(attachments) : null;

    const { data, error } = await supabase
        .from('news')
        .update({
            title, category, date, imageUrl, excerpt, content, author, videoUrl, audioUrl, attachments: attachmentsStr, metaTitle, metaDescription, keywords
        })
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// DELETE news - protected
app.delete('/api/news/:id', authenticateToken, async (req, res) => {
    const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Deleted", id: req.params.id });
});

// 2. Library API
app.get('/api/library', async (req, res) => {
    const { data, error } = await supabase
        .from('library')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/library', authenticateToken, async (req, res) => {
    const { title, type, description, tag, image_url, link } = req.body;
    const { data, error } = await supabase
        .from('library')
        .insert([{ title, type, description, tag, image_url, link }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

app.put('/api/library/:id', authenticateToken, async (req, res) => {
    const { title, type, description, tag, image_url, link } = req.body;
    const { data, error } = await supabase
        .from('library')
        .update({ title, type, description, tag, image_url, link })
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

app.delete('/api/library/:id', authenticateToken, async (req, res) => {
    const { error } = await supabase
        .from('library')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Deleted", id: req.params.id });
});

// 3. Tools API
app.get('/api/tools', async (req, res) => {
    const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/tools', authenticateToken, async (req, res) => {
    const { title, description, icon, link } = req.body;
    const { data, error } = await supabase
        .from('tools')
        .insert([{ title, description, icon, link }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

app.put('/api/tools/:id', authenticateToken, async (req, res) => {
    const { title, description, icon, link } = req.body;
    const { data, error } = await supabase
        .from('tools')
        .update({ title, description, icon, link })
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

app.delete('/api/tools/:id', authenticateToken, async (req, res) => {
    const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Deleted", id: req.params.id });
});

// 4. Contacts API
app.get('/api/contacts', async (req, res) => {
    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/contacts', async (req, res) => {
    const { name, email, phone, service, note, company } = req.body;
    const { data, error } = await supabase
        .from('contacts')
        .insert([{ name, email, phone, service, note, company }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

app.delete('/api/contacts/:id', authenticateToken, async (req, res) => {
    const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Deleted", id: req.params.id });
});

// 5. Pricing API
app.get('/api/pricing', async (req, res) => {
    const { data, error } = await supabase
        .from('pricing')
        .select('*');

    if (error) return res.status(500).json({ error: error.message });

    const parsedRows = data.map(r => ({
        ...r,
        features: r.features ? JSON.parse(r.features) : []
    }));
    res.json(parsedRows);
});

app.put('/api/pricing/:id', authenticateToken, async (req, res) => {
    const { name, price, period, description, features, ctaText, isPopular } = req.body;
    const featuresStr = JSON.stringify(features);

    const { data, error } = await supabase
        .from('pricing')
        .update({
            name, price, period, description, features: featuresStr, ctaText, isPopular: isPopular ? 1 : 0
        })
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// 6. Settings API
app.get('/api/settings', async (req, res) => {
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'general')
        .single();

    if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message }); // PGRST116 is no rows

    res.json(data ? JSON.parse(data.value) : {});
});

app.post('/api/settings', authenticateToken, async (req, res) => {
    const settings = JSON.stringify(req.body);
    const { error } = await supabase
        .from('settings')
        .upsert([{ key: 'general', value: settings }]);

    if (error) return res.status(500).json({ error: error.message });
    res.json(req.body);
});

// 7. Analytics API
app.get('/api/analytics/stats', async (req, res) => {
    try {
        const { count: newsCount, error: newsError } = await supabase.from('news').select('*', { count: 'exact', head: true });
        const { count: contactsCount, error: contactsError } = await supabase.from('contacts').select('*', { count: 'exact', head: true });
        const { count: libraryCount, error: libraryError } = await supabase.from('library').select('*', { count: 'exact', head: true });

        if (newsError || contactsError || libraryError) throw new Error("Database error");

        res.json({
            views: Math.floor(Math.random() * 5000) + 1000, // Mock views
            contacts: contactsCount || 0,
            news: newsCount || 0,
            library: libraryCount || 0
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/analytics/insight', async (req, res) => {
    if (!model) return res.json({ insight: "AI service not configured." });

    // Get summary of data to feed AI
    // Supabase doesn't support GROUP BY directly in JS client easily without Rpc or view
    // We will fetch all contacts and group in JS (assuming low volume < 1000)
    // Or, for scalability, create a View in Supabase later.
    // Given 60 users/low volume, retrieving 'service' column only is fine.

    const { data: contacts, error } = await supabase
        .from('contacts')
        .select('service');

    if (error) return res.status(500).json({ error: error.message });

    // Group by service
    const grouped = contacts.reduce((acc, curr) => {
        acc[curr.service] = (acc[curr.service] || 0) + 1;
        return acc;
    }, {});

    const rows = Object.entries(grouped).map(([service, count]) => ({ service, count }));

    try {
        const prompt = `Bạn là quản lý website.Dưới đây là thống kê lượt liên hệ theo dịch vụ: ${JSON.stringify(rows)}. Hãy đưa ra 3 dòng phân tích ngắn gọn và lời khuyên Marketing để tăng chuyển đổi.Trả về text thuần.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ insight: response.text() });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
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

// Start Server (Only if not running in Vercel/Serverless environment)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
        console.log(`Database: Supabase Connected`);
    });
}

module.exports = app;

