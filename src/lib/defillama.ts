import axios from 'axios';

const BASE_URL = 'https://coins.llama.fi';
const LLAMA_DEX_URL = 'https://api.llama.fi/dexs';

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

export interface DexOverviewItem {
  name: string;
  chain: string;
  tvlUsd?: number;
  volumeUsd1d?: number;
  volumeUsd7d?: number;
}

export async function getDexOverview(): Promise<DexOverviewItem[]> {
  try {
    const url = `${LLAMA_DEX_URL}`;
    const res = await axios.get(url, { timeout: 10_000 });
    const items = (res.data?.protocols || res.data || []) as any[];
    return items.map((p) => ({
      name: p?.name,
      chain: p?.chain,
      tvlUsd: p?.tvl ?? p?.tvlUsd,
      volumeUsd1d: p?.dailyVolume ?? p?.volumeUsd1d,
      volumeUsd7d: p?.weeklyVolume ?? p?.volumeUsd7d,
    }));
  } catch {
    return [];
  }
}
