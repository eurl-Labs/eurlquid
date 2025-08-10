// src/lib/groq.ts
import axios from 'axios';


const _GROQ_API_URL = process.env.GROQ_API_URL;
const _GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!_GROQ_API_URL || !_GROQ_API_KEY) {
  throw new Error('Groq API credentials are missing.');
}
const GROQ_API_URL = _GROQ_API_URL as string;
const GROQ_API_KEY = _GROQ_API_KEY as string;

export async function queryGroqLLM(systemPrompt: string, userPrompt: string) {
  const response = await axios.post(
    GROQ_API_URL,
    {
      model: 'llama-3-70b-8192',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 2048
    },
    {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
}
