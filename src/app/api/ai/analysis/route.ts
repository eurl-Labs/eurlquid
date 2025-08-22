import { NextRequest, NextResponse } from 'next/server';
import { queryGroqLLM } from '@/lib/groq';
import Groq from 'groq-sdk';

export async function POST(req: NextRequest) {
  try {
    const { userPrompt, systemPrompt } = await req.json();

    if (!userPrompt || !systemPrompt) {
      return NextResponse.json({ 
        error: 'userPrompt and systemPrompt are required' 
      }, { status: 400 });
    }

    console.log('🤖 Calling Groq AI...');

    // Enhanced prompt to ensure JSON response
    const enhancedSystemPrompt = `${systemPrompt}

CRITICAL: You MUST respond with ONLY valid JSON. No additional text, no explanations outside the JSON structure.
Your response must start with { and end with }. Do not include any text before or after the JSON.

If there are any errors or missing data, still respond with valid JSON following the required schema, but include appropriate error messages in the riskAlerts array.`;

    // Create Groq instance
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('Groq API key is missing');
    }

    const groq = new Groq({ apiKey });

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: enhancedSystemPrompt
        },
        {
          role: 'user', 
          content: userPrompt
        }
      ],
      model: 'llama-3.1-8b-instant', // Smaller model to reduce token usage
      temperature: 0.1, // Lower temperature for more consistent JSON output
      max_tokens: 1024, // Reduced max tokens
      response_format: { type: 'json_object' } // Force JSON response
    });

    const aiContent = response.choices[0]?.message?.content;
    
    if (!aiContent) {
      throw new Error('No response from AI');
    }

    // Validate JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiContent);
    } catch (parseError) {
      console.error('AI response is not valid JSON:', aiContent);
      // Return a fallback JSON response
      parsedResponse = {
        prediction: {
          timeframe: "1h",
          liquidityChange: 0,
          riskScore: 0.5,
          confidence: 0.1
        },
        advice: "Unable to analyze due to AI response format error. Please try again.",
        expectedSlippage: "Unknown",
        expectedSavingsUSD: 0,
        optimalRoute: [
          {dex: "UniswapV3", allocation: 1.0, status: "execute_now"}
        ],
        riskAlerts: [
          "AI analysis failed - using fallback recommendation",
          "Please retry the analysis"
        ],
        ContractAddress: ["0x0000000000000000000000000000000000000000"],
        explanation: {
          why: ["AI response format error occurred"],
          how: ["Using fallback safe routing to Uniswap V3"],
          assumptions: ["Minimal analysis due to AI parsing error"]
        }
      };
    }

    return NextResponse.json({
      success: true,
      raw: aiContent,
      parsed: parsedResponse,
      timestamp: new Date().toISOString(),
      source: 'groq-ai'
    });

  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    
    // Return structured error response
    return NextResponse.json({
      success: false,
      error: error.message,
      fallback: {
        prediction: {
          timeframe: "1h",
          liquidityChange: 0,
          riskScore: 0.8,
          confidence: 0.1
        },
        advice: "Analysis unavailable due to technical error. Proceed with caution.",
        expectedSlippage: "Unknown",
        expectedSavingsUSD: 0,
        optimalRoute: [
          {dex: "UniswapV3", allocation: 1.0, status: "execute_now"}
        ],
        riskAlerts: [
          `Technical error: ${error.message}`,
          "Consider retrying or using manual analysis"
        ],
        ContractAddress: ["0x0000000000000000000000000000000000000000"],
        explanation: {
          why: ["Technical error prevented full analysis"],
          how: ["Providing conservative fallback recommendation"],
          assumptions: ["High risk due to incomplete analysis"]
        }
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
