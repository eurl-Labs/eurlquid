import { NextRequest, NextResponse } from 'next/server';
import { theGraphQuery, queries } from '@/lib/thegraph';
import { getDexOverview, getDexByName, defillamaKey, getPrices } from '@/lib/defillama';
import { LIQUIDITY_ORACLE_SYSTEM_PROMPT } from '@/lib/prompts';
import { queryGroqLLM } from '@/lib/groq';

type Chain = 'ethereum';

// Token mappings - including all tokens from TokenSelector as real tokens
// These addresses are treated as real tokens with Pyth price integration
const TOKENS: Record<string, { chain: Chain; address: string; decimals: number; symbol: string }>
 = {
  // Main tokens (mainnet addresses for reference, real tokens use Sonic addresses)
  ETH: { chain: 'ethereum', address: '0x0e07bce15e5Ae4729eE24b6294Aef7bcB6c2a260', decimals: 18, symbol: 'ETH' },
  WETH: { chain: 'ethereum', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18, symbol: 'WETH' },
  USDC: { chain: 'ethereum', address: '0x534dE6164d9314b44c8682Be8E41306A8a8cE2Ae', decimals: 6, symbol: 'USDC' },
  USDT: { chain: 'ethereum', address: '0xEc3a35b973e9cb9e735123a6e4Ba1b3D237A9F7F', decimals: 6, symbol: 'USDT' },
  
  // Additional tokens from TokenSelector (Sonic network addresses)
  WBTC: { chain: 'ethereum', address: '0xBBc467639fbEeDF5ec1eDFfC7Ed22b4666Cdd4bA', decimals: 8, symbol: 'WBTC' },
  WSONIC: { chain: 'ethereum', address: '0x6e943f6BFb751512C68d7fB32dB4C3A51011656a', decimals: 18, symbol: 'WSONIC' },
  PEPE: { chain: 'ethereum', address: '0x6EB23CA35D4F467d0d2c326B1E23C8BFDF0688B4', decimals: 18, symbol: 'PEPE' },
  PENGU: { chain: 'ethereum', address: '0x894a84F584D4b84697854Ba0a895Eb122e8791A9', decimals: 18, symbol: 'PENGU' },
  DPENGU: { chain: 'ethereum', address: '0x7DE89E03157F4866Ff5A4F04d3297e88C54bbdb8', decimals: 18, symbol: 'DPENGU' },
  GOONER: { chain: 'ethereum', address: '0x92EeEd76021665B8D926069ecd9b5986c6c779fb', decimals: 18, symbol: 'GOONER' },
  ABSTER: { chain: 'ethereum', address: '0xa989FAf5595228A42C701590515152c2aE0eaC39', decimals: 18, symbol: 'ABSTER' },
  POLLY: { chain: 'ethereum', address: '0xFD9bd8cfc9f6326A1496f240E83ff6717f960E20', decimals: 18, symbol: 'POLLY' },
};

// Helper functions for fetching DEX data
async function fetchUniswapData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/thegraph/uniswap-v3-pools?first=5`);
    if (!response.ok) throw new Error('Uniswap fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Uniswap data fetch error:', error);
    return null;
  }
}

async function fetchCurveData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/thegraph/curve-pools?first=5`);
    if (!response.ok) throw new Error('Curve fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Curve data fetch error:', error);
    return null;
  }
}

async function fetchBalancerData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/thegraph/balancer-pools?first=5`);
    if (!response.ok) throw new Error('Balancer fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Balancer data fetch error:', error);
    return null;
  }
}

async function fetch1inchData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/defillama/protocol/1inch`);
    if (!response.ok) throw new Error('1inch fetch failed');
    return await response.json();
  } catch (error) {
    console.error('1inch data fetch error:', error);
    return null;
  }
}

async function fetchPriceData(fromToken: string, toToken: string) {
  try {
    const [fromPrice, toPrice] = await Promise.all([
      getPrices([defillamaKey('ethereum', TOKENS[fromToken].address)]),
      getPrices([defillamaKey('ethereum', TOKENS[toToken].address)])
    ]);
    
    return {
      fromToken: {
        symbol: fromToken,
        price: fromPrice.coins[defillamaKey('ethereum', TOKENS[fromToken].address)]?.price || 0
      },
      toToken: {
        symbol: toToken,
        price: toPrice.coins[defillamaKey('ethereum', TOKENS[toToken].address)]?.price || 0
      }
    };
  } catch (error) {
    console.error('Price data fetch error:', error);
    return { fromToken: { symbol: fromToken, price: 0 }, toToken: { symbol: toToken, price: 0 } };
  }
}

function createAnalysisPrompts(fromToken: string, toToken: string, amount: string, dexData: any, priceData: any) {
  const systemPrompt = LIQUIDITY_ORACLE_SYSTEM_PROMPT;
  
  const userPrompt = `
Analysis Request:
- Swap: ${amount} ${fromToken} → ${toToken}
- From Price: $${priceData.fromToken.price}
- To Price: $${priceData.toToken.price}
- Expected Output Value: $${(parseFloat(amount) * priceData.fromToken.price).toFixed(2)}

IMPORTANT: Analyze ALL FOUR DEXs even if data is limited. Provide estimates for missing data.

DEX Data Status:
- Uniswap V3: ${dexData.uniswap ? `Available (${dexData.uniswap.data?.pools?.length || 0} pools)` : 'Limited data - use estimates'}
- Curve: ${dexData.curve ? `Available (${dexData.curve.data?.pools?.length || 0} pools)` : 'Limited data - use estimates'}  
- Balancer: ${dexData.balancer ? `Available (${dexData.balancer.data?.pools?.length || 0} pools)` : 'Limited data - use estimates'}
- 1inch: ${dexData.oneinch ? 'Aggregator data available' : 'DeFiLlama estimates only'}

Pool Information:
${dexData.uniswap ? `Uniswap V3: ${dexData.uniswap.data?.pools?.length || 0} pools with liquidity range` : 'Uniswap V3: Estimate based on token pair popularity'}
${dexData.curve ? `Curve: ${dexData.curve.data?.pools?.length || 0} stable/crypto pools` : 'Curve: Estimate stable pool characteristics'}
${dexData.balancer ? `Balancer: ${dexData.balancer.data?.pools?.length || 0} weighted/stable pools` : 'Balancer: Estimate multi-token pool behavior'}
${dexData.oneinch ? `1inch: Aggregation data available` : '1inch: Estimate aggregation benefits'}

REQUIREMENTS:
1. Provide dexAnalysis for ALL FOUR DEXs: uniswap, curve, balancer, oneinch
2. If data is limited, use reasonable estimates based on DEX characteristics
3. Include rate, status, slippage, liquidity, allocation for each DEX
4. Explain reasoning even for estimated data

Please provide a comprehensive analysis comparing all available DEX options for this swap.
  `.trim();

  return { userPrompt, systemPrompt };
}

export async function POST(req: NextRequest) {
  try {
    const { fromToken, toToken, amount } = await req.json();

    // Validate inputs
    if (!fromToken || !toToken || !amount) {
      return NextResponse.json({ error: 'fromToken, toToken, and amount are required' }, { status: 400 });
    }

    if (!(fromToken in TOKENS) || !(toToken in TOKENS)) {
      return NextResponse.json({ error: 'Unsupported token' }, { status: 400 });
    }

    // Step 1: Gather DEX data
    console.log('🔍 Step 1: Gathering DEX data...');
    const dexDataPromise = Promise.allSettled([
      fetchUniswapData(),
      fetchCurveData(), 
      fetchBalancerData(),
      fetch1inchData()
    ]);

    // Step 2: Gather price data
    console.log('💰 Step 2: Gathering price data...');
    const priceDataPromise = fetchPriceData(fromToken, toToken);

    // Wait for all data
    const [dexResults, priceData] = await Promise.all([dexDataPromise, priceDataPromise]);

    // Process DEX results
    const dexData = {
      uniswap: dexResults[0].status === 'fulfilled' ? dexResults[0].value : null,
      curve: dexResults[1].status === 'fulfilled' ? dexResults[1].value : null,
      balancer: dexResults[2].status === 'fulfilled' ? dexResults[2].value : null,
      oneinch: dexResults[3].status === 'fulfilled' ? dexResults[3].value : null,
    };

    // Step 3: Create structured prompt
    console.log('📝 Step 3: Creating analysis prompt...');
    const { userPrompt, systemPrompt } = createAnalysisPrompts(
      fromToken, 
      toToken, 
      amount, 
      dexData, 
      priceData
    );

    // Step 4: Get AI analysis
    console.log('🤖 Step 4: Getting AI analysis...');
    const aiResponse = await fetch(`${req.nextUrl.origin}/api/ai/analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userPrompt, systemPrompt })
    });

    if (!aiResponse.ok) {
      throw new Error(`AI analysis failed: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();

    // Return structured response
    return NextResponse.json({
      success: true,
      input: { fromToken, toToken, amount },
      data: {
        dex: dexData,
        prices: priceData
      },
      prompts: {
        system: systemPrompt,
        user: userPrompt
      },
      ai: {
        raw: aiResult.raw || '',
        parsed: aiResult.parsed || null,
        success: aiResult.success || false
      },
      metadata: {
        timestamp: new Date().toISOString(),
        dexDataStatus: {
          uniswap: dexResults[0].status,
          curve: dexResults[1].status, 
          balancer: dexResults[2].status,
          oneinch: dexResults[3].status
        }
      }
    });

  } catch (e: any) {
    console.error('Analysis error:', e);
    return NextResponse.json({ 
      error: e?.message || 'Analysis failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
