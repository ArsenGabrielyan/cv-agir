import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY as string;
const gemini = new GoogleGenerativeAI(apiKey);

export default gemini