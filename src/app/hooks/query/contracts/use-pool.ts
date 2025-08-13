import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { parseEther, formatEther, zeroAddress } from 'viem';
import { useState } from 'react';

export const DEX_AGGREGATORS = {
  Uniswap: {
    name: "Uniswap",
    address: "0xAF3097d87b080F681d8F134FBc649d87A5F84500" as `0x${string}`,
    logo: "/images/logo/uniLogo.svg.png",
  },
  OneInch: {
    name: "1inch",
    address: "0x9Fc1bBfa84B9041dd520BB533bBc2F8845537bBE" as `0x${string}`,
    logo: "/images/logo/1inchLogo.png",
  },
  Curve: {
    name: "Curve",
    address: "0x0c144C1CA973E36B499d216da6001D3822B15b57" as `0x${string}`,
    logo: "/images/logo/curveLogo.png",
  },
  Balancer: {
    name: "Balancer",
    address: "0xacC58C9D66c849B7877B857ce00212DD721BCab9" as `0x${string}`,
    logo: "/images/logo/balancerLogo.png",
  },
} as const;

export const POOL_TOKENS = {
  USDC: {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x534dE6164d9314b44c8682Be8E41306A8a8cE2Ae" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/usdcLogo.png",
  },
  USDT: {
    name: "Tether USD",
    symbol: "USDT",
    address: "0xEc3a35b973e9cb9e735123a6e4Ba1b3D237A9F7F" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/usdtLogo.png",
  },
  WBTC: {
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    address: "0xBBc467639fbEeDF5ec1eDFfC7Ed22b4666Cdd4bA" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/wbtcLogo.png",
  },
  WETH: {
    name: "Wrapped Ethereum",
    symbol: "WETH",
    address: "0x0e07bce15e5Ae4729eE24b6294Aef7bcB6c2a260" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/ethLogo.png",
  },
  WSONIC: {
    name: "Wrapped Sonic",
    symbol: "WSONIC",
    address: "0x6e943f6BFb751512C68d7fB32dB4C3A51011656a" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/sonicLogo.png",
  },
  PEPE: {
    name: "Pepe",
    symbol: "PEPE",
    address: "0x6EB23CA35D4F467d0d2c326B1E23C8BFDF0688B4" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/pepeLogo.png",
  },
  PENGU: {
    name: "Pudgy Penguins",
    symbol: "PENGU",
    address: "0x894a84F584D4b84697854Ba0a895Eb122e8791A9" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/penguLogo.png",
  },
  POLLY: {
    name: "Polly",
    symbol: "POLLY",
    address: "0xFD9bd8cfc9f6326A1496f240E83ff6717f960E20" as `0x${string}`,
    decimals: 18,
    logo: "/images/logoCoin/pollyLogo.jpg",
  },
} as const;

export const EXISTING_POOLS = {
  "WBTC/USDT": "0x083828c23a4a388c8cf5eaab6c3482f851cb59a931f33986a35de3c918cd6571",
  "WETH/USDC": "0x097dab714135bb77d763a2c46940e92d30215d4b519a1606108abcbb262a655c",
  "PEPE/USDT": "0xe13a819a2714c9c4dcc864a30ddb2de4ed766a3b7f8416cd0c28308e08fc7789",
  "WSONIC/PENGU": "0x88e82999197922da97431214fce800bf37c8ae015e5174e31c934d11f100ac7e",
  "WETH/WSONIC": "0x14e1dc0dd908a6219a9a6040fe08acf9d81552a0c3ee745576368e3588a6e197",
  "WSONIC/PEPE": "0x50d6b263f568e9cd347bab3cbbca27eff5d1754bd2347a595abb6d33df7b96f2",
} as const;

const MULTIPOOL_ABI = [
  {
    inputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" }
    ],
    name: "createPool",
    outputs: [{ internalType: "bytes32", name: "poolId", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "poolId", type: "bytes32" },
      { internalType: "uint256", name: "amountA", type: "uint256" },
      { internalType: "uint256", name: "amountB", type: "uint256" }
    ],
    name: "addLiquidity",
    outputs: [{ internalType: "uint256", name: "liquidity", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "tokenA", type: "address" },
      { internalType: "address", name: "tokenB", type: "address" }
    ],
    name: "getPoolId",
    outputs: [{ internalType: "bytes32", name: "poolId", type: "bytes32" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "poolId", type: "bytes32" }],
    name: "getReserves",
    outputs: [
      { internalType: "uint256", name: "reserveA", type: "uint256" },
      { internalType: "uint256", name: "reserveB", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

const ERC20_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
] as const;

export type TokenSymbol = keyof typeof POOL_TOKENS;
export type DexName = keyof typeof DEX_AGGREGATORS;

interface UsePoolReturn {
  // ✅ Fixed: Add dex parameter to createPool signature
  createPool: (tokenA: TokenSymbol, tokenB: TokenSymbol, dex: DexName) => Promise<void>;
  
  addLiquidity: (poolId: string, amountA: string, amountB: string, tokenA: TokenSymbol, tokenB: TokenSymbol, dex: DexName) => Promise<void>;

  approveToken: (tokenSymbol: TokenSymbol, amount: string, dex: DexName) => Promise<void>;
  
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  txHash: `0x${string}` | undefined;
  reset: () => void;
}

export function usePool(): UsePoolReturn {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { 
    writeContract, 
    data: txHash,
    error: writeError,
    reset: resetWrite
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess,
    error: receiptError 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // ✅ Fixed: createPool function implementation matches interface signature
  const createPool = async (tokenA: TokenSymbol, tokenB: TokenSymbol, dex: DexName) => {
    if (!address) {
      setError(new Error('Wallet not connected'));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const tokenAAddress = POOL_TOKENS[tokenA].address;
      const tokenBAddress = POOL_TOKENS[tokenB].address;
      const dexAddress = DEX_AGGREGATORS[dex].address;

      console.log('Creating pool:', {
        tokenA,
        tokenB,
        dex,
        tokenAAddress,
        tokenBAddress,
        dexAddress
      });

      await writeContract({
        address: dexAddress,
        abi: MULTIPOOL_ABI,
        functionName: 'createPool',
        args: [tokenAAddress, tokenBAddress],
      });

    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  };

  const addLiquidity = async (
    poolId: string, 
    amountA: string, 
    amountB: string, 
    tokenA: TokenSymbol, 
    tokenB: TokenSymbol, 
    dex: DexName
  ) => {
    if (!address) {
      setError(new Error('Wallet not connected'));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const parsedAmountA = parseEther(amountA);
      const parsedAmountB = parseEther(amountB);
      const dexAddress = DEX_AGGREGATORS[dex].address;

      console.log('Adding liquidity:', {
        poolId,
        amountA,
        amountB,
        tokenA,
        tokenB,
        dex,
        dexAddress,
        parsedAmountA: parsedAmountA.toString(),
        parsedAmountB: parsedAmountB.toString()
      });

      await writeContract({
        address: dexAddress,
        abi: MULTIPOOL_ABI,
        functionName: 'addLiquidity',
        args: [poolId as `0x${string}`, parsedAmountA, parsedAmountB],
      });

    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  };

  const approveToken = async (tokenSymbol: TokenSymbol, amount: string, dex: DexName) => {
    if (!address) {
      setError(new Error('Wallet not connected'));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const tokenAddress = POOL_TOKENS[tokenSymbol].address;
      const dexAddress = DEX_AGGREGATORS[dex].address;
      const parsedAmount = parseEther(amount);

      console.log('Approving token:', {
        tokenSymbol,
        amount,
        dex,
        tokenAddress,
        dexAddress,
        parsedAmount: parsedAmount.toString()
      });

      await writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [dexAddress, parsedAmount],
      });

    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setIsLoading(false);
    resetWrite();
  };

  const finalIsLoading = isLoading || isConfirming;
  const finalError = error || writeError || receiptError;

  return {
    createPool,
    addLiquidity,
    approveToken,
    isLoading: finalIsLoading,
    isSuccess,
    isError: !!finalError,
    error: finalError,
    txHash,
    reset,
  };
}