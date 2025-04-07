import { GoogleGenerativeAI } from "@google/generative-ai"
import { env } from "@/env";

const apiKey = env.GEMINI_API_KEY as string;
const gemini = new GoogleGenerativeAI(apiKey);

export default gemini