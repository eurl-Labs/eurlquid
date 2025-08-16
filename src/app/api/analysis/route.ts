import { NextRequest, NextResponse } from 'next/server';
import { theGraphQuery, queries } from '@/lib/thegraph';
import { getDexOverview, defillamaKey, getPrices } from '@/lib/defillama';
import { LIQUIDITY_ORACLE_SYSTEM_PROMPT } from '@/lib/prompts';
import { queryGroqLLM } from '@/lib/groq';

type Chain = 'ethereum';

// Basic known mainnet addresses for demo; extend later or plug token list
const TOKENS: Record<string, { chain: Chain; address: string; decimals: number; symbol: string }>
 = {
  ETH: { chain: 'ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, symbol: 'ETH' },
  WETH: { chain: 'ethereum', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18, symbol: 'WETH' },
  USDC: { chain: 'ethereum', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, symbol: 'USDC' },
  USDT: { chain: 'ethereum', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, symbol: 'USDT' },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fromToken = (body?.fromToken || 'USDC') as keyof typeof TOKENS;
    const toToken = (body?.toToken || 'ETH') as keyof typeof TOKENS;
    const amount = String(body?.amount || '0');

    const from = TOKENS[fromToken];
    const to = TOKENS[toToken];
    if (!from || !to) return NextResponse.json({ error: 'Unsupported token' }, { status: 400 });

    // Fetch DeFiLlama overview (cross-protocol context)
    let dexOverview: any[] = [];
    let uniOverview = null;
    let curveOverview = null;
    
    try {
      dexOverview = await getDexOverview();
      uniOverview = dexOverview.find(p => p.name?.toLowerCase().includes('uniswap v3'));
      curveOverview = dexOverview.find(p => p.name?.toLowerCase().includes('curve'));
    } catch (e: any) {
      console.log('DeFiLlama overview failed:', e?.message);
    }

  // Map ETH to WETH for Uniswap pool lookups
  const mapToUniAddress = (addr: string, sym: string) => sym === 'ETH' ? TOKENS.WETH.address : addr;
  const uniA = mapToUniAddress(from.address, from.symbol);
  const uniB = mapToUniAddress(to.address, to.symbol);
  // Fetch TheGraph data: Uniswap V3 pools for token pair (best-effort)
    let uniPools: any = null;
    try {
      uniPools = await theGraphQuery('uniswapV3Ethereum', queries.uniswapV3.poolsByTokens(uniA, uniB, 5), { first: 5 });
    } catch (e) {
      uniPools = { error: 'uniswapV3 query failed' };
    }

    // Fetch TheGraph data: Curve tokens (as Curve uses different schema)
    let curvePools: any = null;
    try {
      curvePools = await theGraphQuery('curveEthereum', queries.curve.tokens(10));
    } catch (e: any) {
      curvePools = { error: 'curve query failed', details: e?.message || 'unknown error' };
    }

    // Prices via DeFiLlama
    const priceKeys = [defillamaKey('ethereum', from.address === TOKENS.ETH.address ? TOKENS.WETH.address : from.address), defillamaKey('ethereum', to.address === TOKENS.ETH.address ? TOKENS.WETH.address : to.address)];
    let prices: any = null;
    try { prices = await getPrices(priceKeys); } catch { prices = null; }

    // Build unified user prompt payload
    const userPrompt = {
      pair: {
        from: { symbol: from.symbol, address: from.address, decimals: from.decimals },
        to: { symbol: to.symbol, address: to.address, decimals: to.decimals },
        amount,
        chain: from.chain,
      },
      prices: prices,
      defillama: {
        uniswap: uniOverview || null,
        curve: curveOverview || null,
      },
      thegraph: {
        uniswapV3: uniPools,
        curve: curvePools,
      },
      context: {
        notes: [
          'Prices from DeFiLlama coins endpoint can be added later',
          'Alchemy & mempool signals to be integrated later',
        ],
      },
      ask: 'Compare Curve vs Uniswap for this swap now and short-term; output JSON per schema',
    };

    // Send to AI
    try {
      const aiRes = await queryGroqLLM(LIQUIDITY_ORACLE_SYSTEM_PROMPT, JSON.stringify(userPrompt));
      const aiMessage = aiRes.choices?.[0]?.message?.content || '';
      let parsed: any = null;
      try { parsed = JSON.parse(aiMessage); } catch { /* return raw too */ }
      return NextResponse.json({ prompt: userPrompt, ai: { parsed, raw: aiMessage } });
    } catch (aiErr: any) {
      return NextResponse.json({ prompt: userPrompt, ai: { error: aiErr?.message || 'ai error' } }, { status: 502 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}
