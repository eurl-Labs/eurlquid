import { TOKEN_ADDRESSES } from '@/contracts/tokens';

export interface PoolConfig {
  name: string;
  poolId: string;
  tokenA: string;
  tokenB: string;
}

// Production-ready pool configurations
// These pools have been verified to have liquidity and are ready for swapping
export const AVAILABLE_POOLS: PoolConfig[] = [
  {
    name: 'WBTC/USDT',
    poolId: '0x083828c23a4a388c8cf5eaab6c3482f851cb59a931f33986a35de3c918cd6571',
    tokenA: TOKEN_ADDRESSES.WBTC,
    tokenB: TOKEN_ADDRESSES.USDT,
  },
  {
    name: 'WETH/USDC',
    poolId: '0x097dab714135bb77d763a2c46940e92d30215d4b519a1606108abcbb262a655c',
    tokenA: TOKEN_ADDRESSES.WETH,
    tokenB: TOKEN_ADDRESSES.USDC,
  },
  {
    name: 'PEPE/USDT',
    poolId: '0xe13a819a2714c9c4dcc864a30ddb2de4ed766a3b7f8416cd0c28308e08fc7789',
    tokenA: TOKEN_ADDRESSES.PEPE,
    tokenB: TOKEN_ADDRESSES.USDT,
  },
  {
    name: 'WSONIC/PENGU',
    poolId: '0x88e82999197922da97431214fce800bf37c8ae015e5174e31c934d11f100ac7e',
    tokenA: TOKEN_ADDRESSES.WSONIC,
    tokenB: TOKEN_ADDRESSES.PENGU,
  },
  {
    name: 'WETH/WSONIC',
    poolId: '0x14e1dc0dd908a6219a9a6040fe08acf9d81552a0c3ee745576368e3588a6e197',
    tokenA: TOKEN_ADDRESSES.WETH,
    tokenB: TOKEN_ADDRESSES.WSONIC,
  },
  {
    name: 'WSONIC/PEPE',
    poolId: '0x50d6b263f568e9cd347bab3cbbca27eff5d1754bd2347a595abb6d33df7b96f2',
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
export function findAvailablePool(tokenA: string, tokenB: string): PoolConfig | null {
  return AVAILABLE_POOLS.find(pool => 
    (pool.tokenA === tokenA && pool.tokenB === tokenB) ||
    (pool.tokenA === tokenB && pool.tokenB === tokenA)
  ) || null;
}

/**
 * Get all available token pairs for the UI
 * @returns Array of token pair symbols
 */
export function getAvailableTokenPairs(): Array<{ from: string; to: string; poolName: string }> {
  return AVAILABLE_POOLS.map(pool => {
    // Get token symbols from addresses
    const tokenASymbol = Object.entries(TOKEN_ADDRESSES).find(([, addr]) => addr === pool.tokenA)?.[0] || 'UNKNOWN';
    const tokenBSymbol = Object.entries(TOKEN_ADDRESSES).find(([, addr]) => addr === pool.tokenB)?.[0] || 'UNKNOWN';
    
    return {
      from: tokenASymbol,
      to: tokenBSymbol,
      poolName: pool.name
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
  // Convert symbols to addresses if needed
  const addressA = TOKEN_ADDRESSES[tokenA.toUpperCase() as keyof typeof TOKEN_ADDRESSES] || tokenA;
  const addressB = TOKEN_ADDRESSES[tokenB.toUpperCase() as keyof typeof TOKEN_ADDRESSES] || tokenB;
  
  return !!findAvailablePool(addressA, addressB);
}
