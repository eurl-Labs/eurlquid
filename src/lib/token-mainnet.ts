export const MAINNET_TOKEN_ADDRESSES: Record<string, string> = {
  WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // Using a common address for native ETH
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  WSONIC: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // Using WETH as proxy
  PEPE: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
  PENGU: '0x6982508145454Ce325dDbE47a25d4ec3d2311933', // Using PEPE as proxy
  // Add other tokens if needed, for now, these are the ones from the price map
};

export function getMainnetAddress(symbol: string): string | null {
  return MAINNET_TOKEN_ADDRESSES[symbol.toUpperCase()] || null;
}
