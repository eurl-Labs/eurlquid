import axios from "axios";

const BASE_URL = "https://coins.llama.fi";
const LLAMA_PROTOCOLS_URL = "https://api.llama.fi/protocols";

export interface PriceResult {
  coins: Record<
    string,
    {
      price: number;
      symbol: string;
      decimals?: number;
      confidence: number;
      timestamp: number;
    }
  >;
}

export function defillamaKey(
  chain: "ethereum" | "arbitrum" | "base",
  address: string
) {
  return `${chain}:${address.toLowerCase()}`;
}

export async function getPrices(keys: string[]): Promise<PriceResult> {
  const url = `${BASE_URL}/prices/current/${keys.join(",")}`;
  const res = await axios.get(url, { timeout: 10_000 });
  return res.data as PriceResult;
}

export interface DexOverviewItem {
  name: string;
  chain: string;
  tvlUsd?: number;
  volumeUsd1d?: number;
  volumeUsd7d?: number;
  category?: string;
}

export async function getDexOverview(): Promise<DexOverviewItem[]> {
  const url = `${LLAMA_PROTOCOLS_URL}`;
  const res = await axios.get(url, { timeout: 10_000 });
  const items = (res.data || []) as any[];
  return items.map((p) => ({
    name: p?.name,
    chain: p?.chain || "Multi-Chain",
    tvlUsd: p?.tvl,
    volumeUsd1d: p?.volume1d,
    volumeUsd7d: p?.volume7d,
    category: p?.category,
  }));
}

export async function getDexByName(
  patterns: string[]
): Promise<Record<string, DexOverviewItem | null>> {
  const overview = await getDexOverview();
  const result: Record<string, DexOverviewItem | null> = {};

  patterns.forEach((pattern) => {
    const found = overview.find((p) =>
      p.name?.toLowerCase().includes(pattern.toLowerCase())
    );
    result[pattern] = found || null;
  });

  return result;
}
