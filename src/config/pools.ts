import { TOKEN_ADDRESSES } from "@/contracts/tokens";

export interface PoolConfig {
  name: string;
  poolId: string;
  tokenA: string;
  tokenB: string;
}

export const AVAILABLE_POOLS: PoolConfig[] = [
  {
    name: "WBTC/USDT",
    poolId:
      "0xa2ccb2ebe696ef0f55e167981bfeaad4c2b1ea89e8d2e4587c156bbbb76ac179",
    tokenA: TOKEN_ADDRESSES.WBTC,
    tokenB: TOKEN_ADDRESSES.USDT,
  },
  {
    name: "WETH/USDC",
    poolId:
      "0x82aad9f7e0caad402621ced7927878763830bbcae5e05f1ee5c6f4f9c1756ac7",
    tokenA: TOKEN_ADDRESSES.WETH,
    tokenB: TOKEN_ADDRESSES.USDC,
  },
  {
    name: "PEPE/USDT",
    poolId:
      "0x40c9d8c057660d4d4ed27d2fb020eb0a8cd165ebd088b1d9ae4170be499adb53",
    tokenA: TOKEN_ADDRESSES.PEPE,
    tokenB: TOKEN_ADDRESSES.USDT,
  },
  {
    name: "WSONIC/PENGU",
    poolId:
      "0x9e4f549d4d845fe1cfa3fcfc16f002af3e0312233c6f63a4b5fd1cc0193bb719",
    tokenA: TOKEN_ADDRESSES.WSONIC,
    tokenB: TOKEN_ADDRESSES.PENGU,
  },
  {
    name: "WETH/WSONIC",
    poolId:
      "0xba6ca351bb6feff4fff5031c7375c8402a404e82bc0d9bed27ed8dce594182cf",
    tokenA: TOKEN_ADDRESSES.WETH,
    tokenB: TOKEN_ADDRESSES.WSONIC,
  },
  {
    name: "WSONIC/PEPE",
    poolId:
      "0x0ff135a26b5398efd3e2249cff88214d219cd8d224b917af6984bbc91487bdcb",
    tokenA: TOKEN_ADDRESSES.WSONIC,
    tokenB: TOKEN_ADDRESSES.PEPE,
  },
];

/**
 * Helper function to find available pool for token pair
 * @param tokenA First token address
 * @param tokenB Second token address
 * @returns Pool configuration if found, null otherwise
 */
export function findAvailablePool(
  tokenA: string,
  tokenB: string
): PoolConfig | null {
  return (
    AVAILABLE_POOLS.find(
      (pool) =>
        (pool.tokenA === tokenA && pool.tokenB === tokenB) ||
        (pool.tokenA === tokenB && pool.tokenB === tokenA)
    ) || null
  );
}

/**
 * Get all available token pairs for the UI
 * @returns Array of token pair symbols
 */
export function getAvailableTokenPairs(): Array<{
  from: string;
  to: string;
  poolName: string;
}> {
  return AVAILABLE_POOLS.map((pool) => {
    const tokenASymbol =
      Object.entries(TOKEN_ADDRESSES).find(
        ([, addr]) => addr === pool.tokenA
      )?.[0] || "UNKNOWN";
    const tokenBSymbol =
      Object.entries(TOKEN_ADDRESSES).find(
        ([, addr]) => addr === pool.tokenB
      )?.[0] || "UNKNOWN";

    return {
      from: tokenASymbol,
      to: tokenBSymbol,
      poolName: pool.name,
    };
  });
}

/**
 * Check if a token pair is supported
 * @param tokenA First token symbol or address
 * @param tokenB Second token symbol or address
 * @returns True if pair is supported, false otherwise
 */
export function isTokenPairSupported(tokenA: string, tokenB: string): boolean {
  const addressA =
    TOKEN_ADDRESSES[tokenA.toUpperCase() as keyof typeof TOKEN_ADDRESSES] ||
    tokenA;
  const addressB =
    TOKEN_ADDRESSES[tokenB.toUpperCase() as keyof typeof TOKEN_ADDRESSES] ||
    tokenB;

  return !!findAvailablePool(addressA, addressB);
}
