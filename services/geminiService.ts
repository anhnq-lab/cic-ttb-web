// Gemini AI Service (Secure Backend Proxy)
import { GenerateContentResponse } from "@google/genai";
import { API_BASE_URL } from "./api";

export async function* sendMessageToGemini(message: string): AsyncGenerator<GenerateContentResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error(`Server Disconnect: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            // Yield chunk as if it were a GenerateContentResponse part
            yield {
                text: chunk,
                candidates: []
            } as unknown as GenerateContentResponse;
        }

    } catch (error) {
        console.error('Gemini API Error:', error);
        yield {
            text: 'Xin lỗi, đã xảy ra lỗi kết nối với máy chủ. Vui lòng báo quản trị viên.',
            candidates: []
        } as unknown as GenerateContentResponse;
    }
}
