// src/lib/groq.ts
import axios from 'axios';
import Groq from 'groq-sdk';

const _GROQ_API_URL = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
const _GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!_GROQ_API_KEY) {
  throw new Error('Groq API credentials are missing.');
}
const GROQ_API_URL = _GROQ_API_URL as string;
const GROQ_API_KEY = _GROQ_API_KEY as string;

// Implementasi menggunakan SDK resmi Groq
export async function queryGroqLLM(systemPrompt: string, userPrompt: string) {
  console.log('Calling Groq API with SDK');
  console.log(`API Key length: ${GROQ_API_KEY?.length || 0} characters`);
  
  try {
    // Initialize Groq client
    const groq = new Groq({ apiKey: GROQ_API_KEY });
    
    // Create messages array with proper type casting
    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: userPrompt }
    ];
    
    console.log('Request payload:');
    console.log('- System prompt (first 100 chars):', systemPrompt.substring(0, 100) + '...');
    console.log('- User prompt length:', userPrompt.length);
    
    // Call Groq API using the official SDK
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile", // Updated to recommended model
      temperature: 0.2,
      max_tokens: 2048
    });
    
    console.log('Groq API response received');
    return completion;
  } catch (error) {
    console.error('Error in queryGroqLLM:');
    console.error('Error details:', error);
    throw error;
  }
}

// Alternative implementation using Axios directly
export async function queryGroqLLMWithAxios(systemPrompt: string, userPrompt: string) {
  console.log('Calling Groq API with Axios');
  console.log(`API Key length: ${GROQ_API_KEY?.length || 0} characters`);

  const payload = {
    model: 'llama-3.3-70b-versatile', // Updated to recommended model
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.2,
    max_tokens: 2048
  };
  
  console.log('Request payload first 500 chars:', JSON.stringify(payload).substring(0, 500) + '...');
  
  try {
    console.log(`Sending request to ${GROQ_API_URL}`);
    
    const response = await axios.post(
      GROQ_API_URL,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Groq API response received, status:', response.status);
    return response.data;
  } catch (error) {
    console.error('Error in queryGroqLLMWithAxios:');
    if (axios.isAxiosError(error)) {
      console.error('Groq API error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    } else {
      console.error('Unexpected error calling Groq:', error);
    }
    throw error;
  }
}
