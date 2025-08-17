// Token addresses on Sonic Blaze Testnet
// These are mock addresses for demonstration - replace with actual token addresses
export const TOKEN_ADDRESSES = {
  ETH: '0x0000000000000000000000000000000000000000', // Native token
  WETH: '0x1234567890123456789012345678901234567890',
  USDC: '0x2345678901234567890123456789012345678901', 
  USDT: '0x3456789012345678901234567890123456789012',
  WBTC: '0x4567890123456789012345678901234567890123',
  WSONIC: '0x5678901234567890123456789012345678901234',
  PEPE: '0x6789012345678901234567890123456789012345',
  PENGU: '0x7890123456789012345678901234567890123456',
  DARKPENGU: '0x8901234567890123456789012345678901234567',
  GOONER: '0x9012345678901234567890123456789012345678',
  ABSTER: '0x0123456789012345678901234567890123456789',
  POLLY: '0x1123456789012345678901234567890123456789'
} as const;

// Token decimals mapping
export const TOKEN_DECIMALS = {
  ETH: 18,
  WETH: 18,
  USDC: 6,
  USDT: 6,
  WBTC: 8,
  WSONIC: 18,
  PEPE: 18,
  PENGU: 18,
  DARKPENGU: 18,
  GOONER: 18,
  ABSTER: 18,
  POLLY: 18
} as const;

// Helper function to get token address
export function getTokenAddress(symbol: string): string {
  const address = TOKEN_ADDRESSES[symbol as keyof typeof TOKEN_ADDRESSES];
  if (!address) {
    throw new Error(`Token address not found for: ${symbol}`);
  }
  return address;
}

// Helper function to get token decimals
export function getTokenDecimals(symbol: string): number {
  const decimals = TOKEN_DECIMALS[symbol as keyof typeof TOKEN_DECIMALS];
  if (decimals === undefined) {
    throw new Error(`Token decimals not found for: ${symbol}`);
  }
  return decimals;
}

// Type for supported tokens
export type SupportedToken = keyof typeof TOKEN_ADDRESSES;
