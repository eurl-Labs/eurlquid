// Import filesystem and path modules for reading mock data
import fs from 'fs';
import path from 'path';

// GET endpoint for testing - will be triggered when you visit /api/groq in browser
export async function GET() {
  console.log('GET request received at /api/groq');
  
  try {
    // Load mock data from file
    const mockPath = path.resolve(process.cwd(), 'src/mock/liquidity_oracle_input.json');
    console.log('Loading mock data from:', mockPath);
    const mockData = fs.readFileSync(mockPath, 'utf-8');
    
    // Log the request data being sent to Groq
    console.log('Sending request to Groq with system prompt and mock data');
    
    // Make the actual request to Groq LLM API using SDK
    const groqRes = await queryGroqLLM(SYSTEM_PROMPT, mockData);
    console.log('Received response from Groq API');
    
    // Extract the AI-generated content
    const aiMessage = groqRes.choices?.[0]?.message?.content || '';
    let parsed: GroqLiquidityOracleResponse | null = null;
    let error = null;
    
    // Try to parse the response as JSON
    try {
      parsed = JSON.parse(aiMessage);
      console.log('Successfully parsed AI response as JSON');
    } catch (e) {
      error = 'AI response is not valid JSON';
      console.error('Failed to parse AI response:', e);
    }
    
    // Return full response details for inspection
    return NextResponse.json({
      parsed,
      raw: aiMessage,
      groqResponse: groqRes,
      error,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error in /api/groq endpoint:', err);
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
// src/app/api/groq/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { queryGroqLLM } from '@/lib/groq';
import { GroqLiquidityOracleResponse } from '@/types';

const SYSTEM_PROMPT = `You are LiquidityOracle AI, an advanced DeFi Liquidity Intelligence Assistant.  
Your role is to analyze real-time and predictive liquidity conditions across multiple DEXs and blockchains.  
You receive structured JSON data (user prompt) with token pair information, liquidity depth, volume, mempool signals, bridge flows, and market context.  

Your responsibilities:
1. Parse the provided data carefully.
2. Detect risks such as high slippage, whale movements, liquidity drain, MEV attacks, or unusual yield/governance changes.
3. Predict liquidity conditions for the next 15 minutes to 2 hours.
4. Generate clear, actionable recommendations for swap execution.
5. Provide transparent explanations for each prediction and recommendation.
6. Always output in valid JSON only, following the required schema.

Rules:
- Do NOT output text outside JSON.
- Always include an "explanation" object with reasons for risk score, liquidity prediction, and route advice.
- Confidence score must be between 0 and 1.
- Risk score must be between 0 and 1 (0 = no risk, 1 = critical risk).
- Advice should be concise, actionable, and derived from analysis.
- Include optimal route allocation among DEXs.

Output Format (must follow exactly):

{
  "prediction": {
    "timeframe": "1h",
    "liquidityChange": -0.22,
    "riskScore": 0.78,
    "confidence": 0.85
  },
  "advice": "Execute 60% on Curve now, wait 40% for Uniswap in 5 minutes",
  "expectedSlippage": "0.15%",
  "expectedSavingsUSD": 640,
  "optimalRoute": [
    {"dex": "Curve", "allocation": 0.6, "status": "execute_now"},
    {"dex": "UniswapV3", "allocation": 0.4, "status": "wait_5m"}
  ],
  "riskAlerts": [
    "Whale wallet 0xWhale123 may impact Uniswap liquidity in 2 minutes",
    "Uniswap V3 slippage risk increasing"
  ],
"ContractAddress" : [
"0xadajdajsdjsajd",
]
}`;

export async function POST(req: NextRequest) {
  console.log('POST request received at /api/groq');
  
  try {
    // Parse the JSON body from the request
    const body = await req.json();
    console.log('Request body received:', body);
    
    // Convert to string for sending to Groq
    const userPrompt = JSON.stringify(body);
    console.log('Sending request to Groq API...');
    
    // Make the actual request to Groq using SDK
    const groqRes = await queryGroqLLM(SYSTEM_PROMPT, userPrompt);
    console.log('Received response from Groq API');
    
    // Extract AI-generated content
    const aiMessage = groqRes.choices?.[0]?.message?.content || '';
    let parsed: GroqLiquidityOracleResponse | null = null;
    let error = null;
    
    // Try to parse as JSON
    try {
      parsed = JSON.parse(aiMessage);
      console.log('Successfully parsed AI response as JSON');
    } catch (e) {
      error = 'AI response is not valid JSON';
      console.error('Failed to parse AI response:', e);
    }
    
    // Return full response for inspection
    return NextResponse.json({
      parsed,
      raw: aiMessage,
      groqResponse: groqRes,
      error,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error in POST /api/groq:', err);
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
