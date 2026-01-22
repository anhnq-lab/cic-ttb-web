import { model } from '../services/gemini.js';

const generateContent = async (req, res) => {
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

        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        res.json(JSON.parse(jsonStr));
    } catch (error) {
        console.error("AI Generate Error:", error);
        res.status(500).json({ error: "Failed to generate content" });
    }
};

export { generateContent };
