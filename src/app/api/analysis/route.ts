import { NextRequest, NextResponse } from "next/server";
import { theGraphQuery, queries } from "@/lib/thegraph";
import {
  getDexOverview,
  getDexByName,
  defillamaKey,
  getPrices,
} from "@/lib/defillama";
import { LIQUIDITY_ORACLE_SYSTEM_PROMPT } from "@/lib/prompts";
import { queryGroqLLM } from "@/lib/groq";

type Chain = "ethereum";
const TOKENS: Record<
  string,
  { chain: Chain; address: string; decimals: number; symbol: string }
> = {
  ETH: {
    chain: "ethereum",
    address: "0x931753b7A1141d23066fb7a0785ab5c2c1522F43",
    decimals: 18,
    symbol: "ETH",
  },
  WETH: {
    chain: "ethereum",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
    symbol: "WETH",
  },
  USDC: {
    chain: "ethereum",
    address: "0x534dE6164d9314b44c8682Be8E41306A8a8cE2Ae",
    decimals: 6,
    symbol: "USDC",
  },
  USDT: {
    chain: "ethereum",
    address: "0xb13aF633516fe0d21BeB466C95fc34C3917BaAFb",
    decimals: 6,
    symbol: "USDT",
  },
  WBTC: {
    chain: "ethereum",
    address: "0x395eAc2CE4fFFcd578652D689A0eeCC608649200",
    decimals: 8,
    symbol: "WBTC",
  },
  WSONIC: {
    chain: "ethereum",
    address: "0xEc3a35b973e9cb9e735123a6e4Ba1b3D237A9F7F",
    decimals: 18,
    symbol: "WSONIC",
  },
  PEPE: {
    chain: "ethereum",
    address: "0xeC4671DdD18f88eF7076124895cf42E067f3D4C5",
    decimals: 18,
    symbol: "PEPE",
  },
  PENGU: {
    chain: "ethereum",
    address: "0x2b026284561AF82CC015e61d2ecB5b7653f36190",
    decimals: 18,
    symbol: "PENGU",
  },
  DPENGU: {
    chain: "ethereum",
    address: "0x2b0b61AE71d390E8874cE405f05291DD405407ED",
    decimals: 18,
    symbol: "DPENGU",
  },
  GOONER: {
    chain: "ethereum",
    address: "0x7cDaE08eFA988318feE67342a9CD06449D7651dB",
    decimals: 18,
    symbol: "GOONER",
  },
  ABSTER: {
    chain: "ethereum",
    address: "0xc7251A2D1bcCF362F6D333977B2817710Aa71707",
    decimals: 18,
    symbol: "ABSTER",
  },
  POLLY: {
    chain: "ethereum",
    address: "0xa83A7118481D3C5A2DDa8ac5F34c8b690Cb0a242",
    decimals: 18,
    symbol: "POLLY",
  },
};

async function fetchUniswapData(fromToken: string, toToken: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/thegraph/uniswap-v3-pools?first=5&fromToken=${fromToken}&toToken=${toToken}`
    );
    if (!response.ok) throw new Error("Uniswap fetch failed");
    return await response.json();
  } catch (error) {
    console.error("Uniswap data fetch error:", error);
    return null;
  }
}

async function fetchCurveData(fromToken: string, toToken: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/thegraph/curve-pools?first=5&fromToken=${fromToken}&toToken=${toToken}`
    );
    if (!response.ok) throw new Error("Curve fetch failed");
    return await response.json();
  } catch (error) {
    console.error("Curve data fetch error:", error);
    return null;
  }
}

async function fetchBalancerData(fromToken: string, toToken: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/thegraph/balancer-pools?first=5&fromToken=${fromToken}&toToken=${toToken}`
    );
    if (!response.ok) throw new Error("Balancer fetch failed");
    return await response.json();
  } catch (error) {
    console.error("Balancer data fetch error:", error);
    return null;
  }
}

async function fetch1inchData() {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/defillama/1inch`
    );
    if (!response.ok) throw new Error("1inch fetch failed");
    return await response.json();
  } catch (error) {
    console.error("1inch data fetch error:", error);
    return null;
  }
}

async function fetchPriceData(fromToken: string, toToken: string) {
  try {
    const tokenPriceMap: Record<string, string> = {
      WBTC: "ethereum:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      ETH: "ethereum:0x0000000000000000000000000000000000000000",
      WETH: "ethereum:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      USDC: "ethereum:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      USDT: "ethereum:0xdAC17F958D2ee523a2206206994597C13D831ec7",
      WSONIC: "ethereum:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      PEPE: "ethereum:0x6982508145454Ce325dDbE47a25d4ec3d2311933",
      PENGU: "ethereum:0x6982508145454Ce325dDbE47a25d4ec3d2311933",
    };

    const fromKey = tokenPriceMap[fromToken] || tokenPriceMap["USDC"];
    const toKey = tokenPriceMap[toToken] || tokenPriceMap["USDC"];

    const [fromPrice, toPrice] = await Promise.all([
      getPrices([fromKey]),
      getPrices([toKey]),
    ]);

    return {
      fromToken: {
        symbol: fromToken,
        price: fromPrice.coins[fromKey]?.price || 0,
      },
      toToken: {
        symbol: toToken,
        price: toPrice.coins[toKey]?.price || 0,
      },
    };
  } catch (error) {
    console.error("Price data fetch error:", error);
    return {
      fromToken: { symbol: fromToken, price: 0 },
      toToken: { symbol: toToken, price: 0 },
    };
  }
}

function createAnalysisPrompts(
  fromToken: string,
  toToken: string,
  amount: string,
  dexData: any,
  priceData: any
) {
  const systemPrompt = LIQUIDITY_ORACLE_SYSTEM_PROMPT;

  const fromPrice = priceData.fromToken.price;
  const toPrice = priceData.toToken.price;
  const inputAmount = parseFloat(amount);
  const inputValueUSD = inputAmount * fromPrice;
  const theoreticalOutputAmount =
    fromPrice > 0 && toPrice > 0 ? inputValueUSD / toPrice : 0;

  const userPrompt = `
SWAP ORDER DETAILS:
Trading Pair: ${fromToken}/${toToken}
Input Token: ${fromToken} (${TOKENS[fromToken]?.address || "N/A"}, ${
    TOKENS[fromToken]?.decimals || 18
  } decimals)
Output Token: ${toToken} (${TOKENS[toToken]?.address || "N/A"}, ${
    TOKENS[toToken]?.decimals || 18
  } decimals)
Amount to Swap: ${amount} ${fromToken}
Order Value: ${inputValueUSD.toFixed(2)} USD

PRICE & CALCULATION DATA:
${fromToken} Price: ${fromPrice.toFixed(6)} USD
${toToken} Price: ${toPrice.toFixed(6)} USD
Expected Output: ${theoreticalOutputAmount.toFixed(6)} ${toToken}
Exchange Rate: 1 ${fromToken} = ${(fromPrice / toPrice).toFixed(6)} ${toToken}
Order Size: ${
    inputValueUSD > 1000
      ? "Large (>$1000)"
      : inputValueUSD > 100
      ? "Medium ($100-$1000)"
      : "Small (<$100)"
  }
MEV Risk: ${
    inputValueUSD > 5000 ? "High" : inputValueUSD > 500 ? "Medium" : "Low"
  }

DEX DATA STATUS:
Uniswap V3: ${
    dexData.uniswap
      ? `✅ ${dexData.uniswap.data?.pools?.length || 0} pools`
      : "⚠️ Estimates only"
  }
Curve: ${
    dexData.curve
      ? `✅ ${dexData.curve.data?.pools?.length || 0} pools`
      : "⚠️ Estimates only"
  }
Balancer: ${
    dexData.balancer
      ? `✅ ${dexData.balancer.data?.pools?.length || 0} pools`
      : "⚠️ Estimates only"
  }
1inch: ${dexData.oneinch ? "✅ Live routing data" : "⚠️ Estimates only"}

ANALYSIS REQUIRED:
dexAnalysis: Calculate if ALL ${amount} ${fromToken} executed on each DEX individually
optimalRoute: Best allocation strategy across multiple DEXs
  `.trim();

  return { userPrompt, systemPrompt };
}

export async function POST(req: NextRequest) {
  try {
    const { fromToken, toToken, amount } = await req.json();

    if (!fromToken || !toToken || !amount) {
      return NextResponse.json(
        { error: "fromToken, toToken, and amount are required" },
        { status: 400 }
      );
    }

    if (!(fromToken in TOKENS) || !(toToken in TOKENS)) {
      return NextResponse.json({ error: "Unsupported token" }, { status: 400 });
    }

    // console.log("🔍 Step 1: Gathering DEX data...");
    const dexDataPromise = Promise.allSettled([
      fetchUniswapData(fromToken, toToken),
      fetchCurveData(fromToken, toToken),
      fetchBalancerData(fromToken, toToken),
      fetch1inchData(),
    ]);

    console.log("💰 Step 2: Gathering price data...");
    const priceDataPromise = fetchPriceData(fromToken, toToken);

    const [dexResults, priceData] = await Promise.all([
      dexDataPromise,
      priceDataPromise,
    ]);

    const dexData = {
      uniswap:
        dexResults[0].status === "fulfilled" ? dexResults[0].value : null,
      curve: dexResults[1].status === "fulfilled" ? dexResults[1].value : null,
      balancer:
        dexResults[2].status === "fulfilled" ? dexResults[2].value : null,
      oneinch:
        dexResults[3].status === "fulfilled" ? dexResults[3].value : null,
    };

    // console.log("📝 Step 3: Creating analysis prompt...");
    const { userPrompt, systemPrompt } = createAnalysisPrompts(
      fromToken,
      toToken,
      amount,
      dexData,
      priceData
    );

    // console.log("🤖 Step 4: Getting AI analysis...");
    const aiResponse = await fetch(`${req.nextUrl.origin}/api/ai/analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPrompt, systemPrompt }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI analysis failed: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();

    return NextResponse.json({
      success: true,
      input: { fromToken, toToken, amount },
      data: {
        dex: dexData,
        prices: priceData,
      },
      prompts: {
        system: systemPrompt,
        user: userPrompt,
      },
      ai: {
        raw: aiResult.raw || "",
        parsed: aiResult.parsed || null,
        success: aiResult.success || false,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        dexDataStatus: {
          uniswap: dexResults[0].status,
          curve: dexResults[1].status,
          balancer: dexResults[2].status,
          oneinch: dexResults[3].status,
        },
      },
    });
  } catch (e: any) {
    console.error("Analysis error:", e);
    return NextResponse.json(
      {
        error: e?.message || "Analysis failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
