// Token addresses on Sonic Blaze Testnet
// Updated with real contract addresses from the testnet - ALL MOCK TOKENS, NO NATIVE ETH
export const TOKEN_ADDRESSES = {
  WSONIC: '0x6e943f6BFb751512C68d7fB32dB4C3A51011656a', // Wrapped Sonic (mock)
  USDT: '0xEc3a35b973e9cb9e735123a6e4Ba1b3D237A9F7F', // Tether USD (mock)
  USDC: '0x534dE6164d9314b44c8682Be8E41306A8a8cE2Ae', // USD Coin (mock)
  WBTC: '0xBBc467639fbEeDF5ec1eDFfC7Ed22b4666Cdd4bA', // Wrapped Bitcoin (mock)
  WETH: '0x0e07bce15e5Ae4729eE24b6294Aef7bcB6c2a260', // Wrapped Ethereum (mock)
  PEPE: '0x06Cd2E8E04D0F5E2b062Ca02D7CE43Ef7BD0bbfE', // Pepe (mock)
  PENGU: '0x5aDc0e42E95E7E54b8Ab6c0D6Eb0a3d6D9fF70cb', // Pengu (mock)
  DARKPENGU: '0xB4dE3ea89c50e4A1c78eE3b583b5a45bD6Ac1234', // Dark Pengu (mock)
  GOONER: '0x92EeEd76021665B8D926069ecd9b5986c6c779fb', // Gooner (mock)
  ABSTER: '0xa989FAf5595228A42C701590515152c2aE0eaC39', // Abster (mock)
  POLLY: '0xee8ac0f86ae74d5d3d5e6aa8fDbdE8B61f9c51Ba', // Polly (mock)
} as const;

// Token decimals mapping (updated with real values - all mock tokens have 18 decimals)
export const TOKEN_DECIMALS = {
  WSONIC: 18,
  USDT: 18, // On Sonic testnet, mock USDT has 18 decimals
  USDC: 18, // On Sonic testnet, mock USDC has 18 decimals  
  WBTC: 18, // On Sonic testnet, mock WBTC has 18 decimals
  WETH: 18,
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
