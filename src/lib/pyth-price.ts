// Pyth price fetching utilities
export interface PythPriceData {
  id: string;
  price: {
    price: string;
    conf: string;
    expo: number;
    publish_time: number;
  };
  ema_price: {
    price: string;
    conf: string;
    expo: number;
    publish_time: number;
  };
}

export interface PythResponse {
  binary: {
    encoding: string;
    data: string[];
  };
  parsed: PythPriceData[];
}

// Pyth Network price feed IDs
export const PYTH_PRICE_FEEDS = {
  ETH: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  WBTC: "0xc9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33", 
  PEPE: "0xd69731a2e74ac1ce884fc3890f7ee324b6deb66147055249568869ed700882e4",
  PENGU: "0xbed3097008b9b5e3c93bec20be79cb43986b85a996475589351a21e67bae9b61",
  DPENGU: "0xa98bfb9501a843d1c048fd51e71e403da89df1e996016fd692332f835bef5778",
  // WSONIC is now fetched from CoinGecko
  // USDC and USDT will be treated as $1 USD
} as const;

export type PythTokenSymbol = keyof typeof PYTH_PRICE_FEEDS;

// --- CoinGecko Price Fetching ---
async function fetchCoingeckoPrice(coingeckoId: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`
    );
    if (!response.ok) {
      throw new Error(`CoinGecko API error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data[coingeckoId] || !data[coingeckoId].usd) {
      throw new Error(`Price not found for ${coingeckoId} in CoinGecko response`);
    }
    return data[coingeckoId].usd;
  } catch (error) {
    console.error(`Error fetching CoinGecko price for ${coingeckoId}:`, error);
    // Return 0 as a fallback to prevent crashing the entire analysis
    return 0;
  }
}


// Convert Pyth price to readable format
export function formatPythPrice(priceData: PythPriceData): number {
  const price = parseInt(priceData.price.price);
  const expo = priceData.price.expo;
  return price * Math.pow(10, expo);
}

// Fetch price from Pyth API
export async function fetchPythPrice(tokenId: string): Promise<number> {
  try {
    const response = await fetch(
      `https://hermes.pyth.network/v2/updates/price/latest?ids[]=${tokenId}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: PythResponse = await response.json();
    
    if (!data.parsed || data.parsed.length === 0) {
      throw new Error("No price data found");
    }
    
    return formatPythPrice(data.parsed[0]);
  } catch (error) {
    console.error(`Error fetching price for token ${tokenId}:`, error);
    throw error;
  }
}

// Get token price in USD (with fallback for stablecoins)
export async function getTokenPriceUSD(symbol: string): Promise<number> {
  // Handle WSONIC with CoinGecko
  if (symbol === "WSONIC" || symbol === "SONIC") {
    return await fetchCoingeckoPrice('sonic-3');
  }

  // Handle stablecoins
  if (symbol === "USDC" || symbol === "USDT") {
    return 1.0;
  }
  
  // Handle ETH/WETH mapping
  const tokenSymbol = symbol === "ETH" ? "ETH" : symbol as PythTokenSymbol;
  
  // Check if we have price feed for this token
  const priceId = PYTH_PRICE_FEEDS[tokenSymbol];
  if (!priceId) {
    console.warn(`No Pyth price feed available for token: ${symbol}. Returning 0.`);
    return 0;
  }
  
  try {
    return await fetchPythPrice(priceId);
  } catch (error) {
    console.error(`Failed to fetch Pyth price for ${symbol}. Returning 0.`, error);
    return 0;
  }
}

// Calculate swap conversion rate
export async function calculateSwapRate(
  fromToken: string, 
  toToken: string, 
  fromAmount: number
): Promise<{ toAmount: number; fromPriceUSD: number; toPriceUSD: number }> {
  try {
    const [fromPriceUSD, toPriceUSD] = await Promise.all([
      getTokenPriceUSD(fromToken),
      getTokenPriceUSD(toToken)
    ]);
    
    // Avoid division by zero if a price is not available
    if (toPriceUSD === 0) {
      console.warn(`Price for toToken ${toToken} is zero, cannot calculate swap rate.`);
      return { toAmount: 0, fromPriceUSD, toPriceUSD };
    }

    // Calculate USD value of from amount
    const fromValueUSD = fromAmount * fromPriceUSD;
    
    // Calculate to amount based on USD value
    const toAmount = fromValueUSD / toPriceUSD;
    
    return {
      toAmount,
      fromPriceUSD,
      toPriceUSD
    };
  } catch (error) {
    console.error("Error calculating swap rate:", error);
    // Ensure the function returns a valid object even in case of unexpected errors
    return { toAmount: 0, fromPriceUSD: 0, toPriceUSD: 0 };
  }
}
