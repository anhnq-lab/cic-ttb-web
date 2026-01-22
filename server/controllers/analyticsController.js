import supabase from '../supabase.js';
import { model } from '../services/gemini.js';

const getStats = async (req, res) => {
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
};

const getInsight = async (req, res) => {
    if (!model) return res.json({ insight: "AI service not configured." });

    const { data: contacts, error } = await supabase
        .from('contacts')
        .select('service');

    if (error) return res.status(500).json({ error: error.message });

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
};

export {
    getStats,
    getInsight
};
