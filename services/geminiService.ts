// Gemini AI Service
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;

if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
}

const SYSTEM_PROMPT = `Bạn là trợ lý AI của CIC BIM Hub - Cổng thông tin pháp lý và công nghệ BIM hàng đầu Việt Nam. 
Bạn giúp người dùng tra cứu các văn bản pháp lý mới nhất về BIM (Nghị định 175/2024, Nghị định 111/2024, Thông tư 10/2024) 
và tư vấn lộ trình chuyển đổi số xây dựng. 
Hãy trả lời ngắn gọn, chính xác và thân thiện bằng tiếng Việt.`;

export async function* sendMessageToGemini(message: string): AsyncGenerator<GenerateContentResponse> {
    if (!ai) {
        // Return a mock response if no API key
        const mockResponse = {
            text: 'Xin lỗi, dịch vụ AI hiện đang được cấu hình. Vui lòng liên hệ Admin để được hỗ trợ.',
            candidates: []
        } as unknown as GenerateContentResponse;
        yield mockResponse;
        return;
    }

    try {
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.0-flash',
            contents: [
                { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\nCâu hỏi của người dùng: ' + message }] }
            ]
        });

        for await (const chunk of response) {
            yield chunk;
        }
    } catch (error) {
        console.error('Gemini API Error:', error);
        const errorResponse = {
            text: 'Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
            candidates: []
        } as unknown as GenerateContentResponse;
        yield errorResponse;
    }
}
