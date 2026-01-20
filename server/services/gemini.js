const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '../.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
let model = null;

if (apiKey) {
    try {
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log("Gemini AI Initialized");
    } catch (error) {
        console.error("Failed to initialize Gemini:", error);
    }
} else {
    console.warn("WARNING: GEMINI_API_KEY is not set. AI features will not work.");
}

module.exports = { genAI, model };
