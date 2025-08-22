// src/lib/groq.ts
import axios from "axios";
import Groq from "groq-sdk";

const GROQ_API_URL = (process.env.GROQ_API_URL ||
  "https://api.groq.com/openai/v1/chat/completions") as string;

export async function queryGroqLLM(systemPrompt: string, userPrompt: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Groq API credentials are missing. Please set GROQ_API_KEY"
    );
  }

  try {
    const groq = new Groq({ apiKey });
    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: userPrompt },
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: "openai/gpt-oss-20b",
      temperature: 0.2,
      max_tokens: 2048,
    });
    return completion;
  } catch (error) {
    console.error("Error in queryGroqLLM:", error);
    throw error;
  }
}

// Axios-based implementation
export async function queryGroqLLMWithAxios(
  systemPrompt: string,
  userPrompt: string
) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Groq API credentials are missing. Please set GROQ_API_KEY"
    );
  }

  const payload = {
    model: "openai/gpt-oss-20b",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
    max_tokens: 2048,
  };

  try {
    const response = await axios.post(GROQ_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Groq API error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    }
    throw error;
  }
}
