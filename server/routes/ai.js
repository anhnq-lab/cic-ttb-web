import express from 'express';
const router = express.Router();
import { genAI } from '../services/gemini.js';
import { authenticateToken } from '../middleware/auth.js';
import { generateContent } from '../controllers/aiController.js';

const SYSTEM_PROMPT = `Bạn là trợ lý AI của CIC BIM Hub - Cổng thông tin pháp lý và công nghệ BIM hàng đầu Việt Nam. 
Bạn giúp người dùng tra cứu các văn bản pháp lý mới nhất về BIM (Nghị định 175/2024, Nghị định 111/2024, Thông tư 10/2024) 
và tư vấn lộ trình chuyển đổi số xây dựng. 
Hãy trả lời ngắn gọn, chính xác và thân thiện bằng tiếng Việt.`;

// Chat endpoint (Stream)
router.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!genAI) {
        return res.status(503).json({ error: 'AI Service Unavailable' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContentStream({
            contents: [
                { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\nCâu hỏi của người dùng: ' + message }] }
            ]
        });

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            res.write(chunkText);
        }
        res.end();

    } catch (error) {
        console.error("AI Chat Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to generate response" });
        } else {
            res.end();
        }
    }
});

// Generate Content Endpoint
router.post('/generate', authenticateToken, generateContent);

export default router;
