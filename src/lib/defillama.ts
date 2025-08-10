import axios from 'axios';

const BASE_URL = 'https://coins.llama.fi';

export interface PriceResult {
  coins: Record<string, { price: number; symbol: string; decimals?: number; confidence: number; timestamp: number }>;
}

// Chain name mapping used by DeFiLlama keys, e.g., 'ethereum:0xA0b869...' or 'arbitrum:0x...'
export function defillamaKey(chain: 'ethereum' | 'arbitrum' | 'base', address: string) {
  return `${chain}:${address.toLowerCase()}`;
}

export async function getPrices(keys: string[]): Promise<PriceResult> {
  const url = `${BASE_URL}/prices/current/${keys.join(',')}`;
  const res = await axios.get(url, { timeout: 10_000 });
  return res.data as PriceResult;
}
