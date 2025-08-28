// DEX Aggregator Smart Contract ABIs for Sonic Blaze Testnet
// Contract Addresses:
// - UNISWAP: 0x50D1672685E594B27F298Ac5bFACa4F3488AAA9c
// - OneInch: 0xA9b3eD890229E575863514ef8464C0e6a771Bc58
// - Curve: 0x03a6FE06D6C0C7c9726Ecd079cD9283A37b4c178
// - Balancer: 0x2B778181dAB6Db356b00931a6c1833E1450f9655

export const SWAP_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountA",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountB",
        type: "uint256",
      },
    ],
    name: "LiquidityAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountA",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountB",
        type: "uint256",
      },
    ],
    name: "LiquidityRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenA",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenB",
        type: "address",
      },
    ],
    name: "PoolCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "address",
        name: "tokenIn",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenOut",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    name: "Swapped",
    type: "event",
  },
  {
    inputs: [],
    name: "FEE_DENOMINATOR",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SWAP_FEE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "poolId", type: "bytes32" },
      { internalType: "uint256", name: "amountA", type: "uint256" },
      { internalType: "uint256", name: "amountB", type: "uint256" },
    ],
    name: "addLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" },
    ],
    name: "createPool",
    outputs: [{ internalType: "bytes32", name: "poolId", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getPoolCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" },
    ],
    name: "getPoolId",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "poolId", type: "bytes32" },
      { internalType: "address", name: "tokenIn", type: "address" },
      { internalType: "uint256", name: "amountIn", type: "uint256" },
    ],
    name: "getQuote",
    outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "poolId", type: "bytes32" }],
    name: "getReserves",
    outputs: [
      { internalType: "uint256", name: "reserveA", type: "uint256" },
      { internalType: "uint256", name: "reserveB", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "pools",
    outputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" },
      { internalType: "uint256", name: "reserveA", type: "uint256" },
      { internalType: "uint256", name: "reserveB", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "poolId", type: "bytes32" },
      { internalType: "uint256", name: "amountA", type: "uint256" },
      { internalType: "uint256", name: "amountB", type: "uint256" },
    ],
    name: "removeLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "poolId", type: "bytes32" },
      { internalType: "address", name: "tokenIn", type: "address" },
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "amountOutMin", type: "uint256" },
    ],
    name: "swap",
    outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const DEX_CONTRACTS = {
  MAIN_POOL: "0x50D1672685E594B27F298Ac5bFACa4F3488AAA9c",
  UNISWAP: "0x50D1672685E594B27F298Ac5bFACa4F3488AAA9c",
  ONEINCH: "0xA9b3eD890229E575863514ef8464C0e6a771Bc58",
  CURVE: "0x03a6FE06D6C0C7c9726Ecd079cD9283A37b4c178",
  BALANCER: "0x2B778181dAB6Db356b00931a6c1833E1450f9655",
} as const;

export const DEX_NAME_TO_ADDRESS: Record<string, string> = {
  main: DEX_CONTRACTS.MAIN_POOL,
  uniswap: DEX_CONTRACTS.UNISWAP,
  oneinch: DEX_CONTRACTS.ONEINCH,
  curve: DEX_CONTRACTS.CURVE,
  balancer: DEX_CONTRACTS.BALANCER,
  uniswapv3: DEX_CONTRACTS.UNISWAP,
  "1inch": DEX_CONTRACTS.ONEINCH,
};

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

export function getDexContractAddress(dexName?: string): string {
  if (!dexName || dexName === "main") {
    return DEX_CONTRACTS.MAIN_POOL;
  }
  return DEX_NAME_TO_ADDRESS[dexName] || DEX_CONTRACTS.MAIN_POOL;
}

export function getPoolId(tokenA: string, tokenB: string): string {
  const { keccak256, encodePacked } = require("viem");
  const [sortedTokenA, sortedTokenB] = [
    tokenA.toLowerCase(),
    tokenB.toLowerCase(),
  ].sort();
  return keccak256(
    encodePacked(
      ["address", "address"],
      [sortedTokenA as `0x${string}`, sortedTokenB as `0x${string}`]
    )
  );
}
