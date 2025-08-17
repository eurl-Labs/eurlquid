// DEX Aggregator Smart Contract ABIs for Sonic Blaze Testnet
// Contract Addresses:
// - UNISWAP: 0xAF3097d87b080F681d8F134FBc649d87A5F84500
// - OneInch: 0x9Fc1bBfa84B9041dd520BB533bBc2F8845537bBE  
// - Curve: 0x0c144C1CA973E36B499d216da6001D3822B15b57
// - Balancer: 0xacC58C9D66c849B7877B857ce00212DD721BCab9

export const SWAP_ABI = [
  {"inputs":[],"name":"InsufficientAmount","type":"error"},
  {"inputs":[],"name":"InsufficientLiquidity","type":"error"},
  {"inputs":[],"name":"InsufficientReserves","type":"error"},
  {"inputs":[],"name":"InvalidToken","type":"error"},
  {"inputs":[],"name":"PoolAlreadyExists","type":"error"},
  {"inputs":[],"name":"PoolNotExists","type":"error"},
  {"inputs":[],"name":"SameToken","type":"error"},
  {"inputs":[],"name":"SlippageTooHigh","type":"error"},
  {"inputs":[],"name":"TransferFailed","type":"error"},
  {"inputs":[],"name":"ZeroAddress","type":"error"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"poolId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountB","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"liquidity","type":"uint256"}],"name":"LiquidityAdded","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"poolId","type":"bytes32"},{"indexed":false,"internalType":"address","name":"tokenA","type":"address"},{"indexed":false,"internalType":"address","name":"tokenB","type":"address"}],"name":"PoolCreated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"poolId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"address","name":"tokenIn","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountOut","type":"uint256"}],"name":"Swap","type":"event"},
  {"inputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"},{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPool","outputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"},{"internalType":"address","name":"user","type":"address"}],"name":"getLiquidityBalance","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getPoolCount","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"getPoolId","outputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"}],"stateMutability":"pure","type":"function"},
  {"inputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"},{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"}],"name":"getQuote","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"}],"name":"getReserves","outputs":[{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"address","name":"","type":"address"}],"name":"liquidityBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolIds","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"pools","outputs":[{"internalType":"contract IERC20","name":"tokenA","type":"address"},{"internalType":"contract IERC20","name":"tokenB","type":"address"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"},{"internalType":"uint256","name":"totalSupply","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"},{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"}],"name":"swap","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}
] as const;

// DEX Contract Addresses on Sonic Blaze Testnet
export const DEX_CONTRACTS = {
  UNISWAP: '0xAF3097d87b080F681d8F134FBc649d87A5F84500',
  ONEINCH: '0x9Fc1bBfa84B9041dd520BB533bBc2F8845537bBE',
  CURVE: '0x0c144C1CA973E36B499d216da6001D3822B15b57',
  BALANCER: '0xacC58C9D66c849B7877B857ce00212DD721BCab9'
} as const;

// Mapping DEX names to contract addresses
export const DEX_NAME_TO_ADDRESS: Record<string, string> = {
  'uniswap': DEX_CONTRACTS.UNISWAP,
  'oneinch': DEX_CONTRACTS.ONEINCH,
  'curve': DEX_CONTRACTS.CURVE,
  'balancer': DEX_CONTRACTS.BALANCER,
  // Aliases
  'uniswapv3': DEX_CONTRACTS.UNISWAP,
  '1inch': DEX_CONTRACTS.ONEINCH,
};

// Type definitions for better TypeScript support
export interface SwapParams {
  poolId: string;
  tokenIn: string;
  amountIn: bigint;
  amountOutMin: bigint;
}

export interface PoolInfo {
  tokenA: string;
  tokenB: string;
  reserveA: bigint;
  reserveB: bigint;
  totalSupply: bigint;
  exists: boolean;
}

export interface QuoteParams {
  poolId: string;
  tokenIn: string;
  amountIn: bigint;
}

// Helper function to get contract address by DEX name
export function getDexContractAddress(dexName: string): string {
  const normalizedName = dexName.toLowerCase();
  const address = DEX_NAME_TO_ADDRESS[normalizedName];
  
  if (!address) {
    throw new Error(`Unknown DEX: ${dexName}. Supported DEXs: ${Object.keys(DEX_NAME_TO_ADDRESS).join(', ')}`);
  }
  
  return address;
}

// Helper function to get pool ID for token pair
export function getPoolId(tokenA: string, tokenB: string): string {
  // This mimics the contract's getPoolId function
  // In a real implementation, you might want to call the contract directly
  const sortedTokens = [tokenA.toLowerCase(), tokenB.toLowerCase()].sort();
  return `0x${Buffer.from(sortedTokens.join('')).toString('hex')}`;
}
