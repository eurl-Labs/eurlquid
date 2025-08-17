import { useCallback, useState } from 'react';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { SWAP_ABI, getDexContractAddress } from '@/contracts/abi/swap-abi';
import { TOKEN_ADDRESSES } from '@/contracts/tokens';
import { AVAILABLE_POOLS, findAvailablePool } from '@/config/pools';

// ERC20 ABI for approval
const ERC20_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export interface SwapParams {
  tokenInSymbol: string;
  tokenOutSymbol: string;
  amountIn: string;
  dexName?: string;
}

// Helper function to get token address by symbol
function getTokenAddressBySymbol(symbol: string): string {
  const upperSymbol = symbol.toUpperCase() as keyof typeof TOKEN_ADDRESSES;
  const address = TOKEN_ADDRESSES[upperSymbol];
  if (!address) {
    throw new Error(`Token address not found for: ${symbol}`);
  }
  return address;
}

export function useSwapContract() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // State management
  const [isApproving, setIsApproving] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const [swapError, setSwapError] = useState<string | null>(null);

  // Check token allowance
  const checkAllowance = useCallback(async (
    tokenAddress: string,
    spenderAddress: string
  ): Promise<bigint> => {
    if (!address || !publicClient) return BigInt(0);

    try {
      const allowance = await publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address, spenderAddress as `0x${string}`],
      });

      return allowance as bigint;
    } catch (err) {
      console.error('Failed to check allowance:', err);
      return BigInt(0);
    }
  }, [address, publicClient]);

  // Approve token spending
  const approveToken = useCallback(async (
    tokenAddress: string,
    spenderAddress: string,
    amount: bigint
  ) => {
    if (!walletClient || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsApproving(true);
      setApprovalError(null);
      
      // Check current allowance first
      const currentAllowance = await checkAllowance(tokenAddress, spenderAddress);
      
      if (currentAllowance >= amount) {
        setIsApproving(false);
        return;
      }

      const hash = await walletClient.writeContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spenderAddress as `0x${string}`, amount],
      });

      // Wait for transaction confirmation
      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        
        if (receipt.status === 'reverted') {
          throw new Error('Approval transaction reverted');
        }
      }

      setIsApproving(false);
    } catch (error) {
      setIsApproving(false);
      setApprovalError(error instanceof Error ? error.message : 'Approval failed');
      throw error;
    }
  }, [walletClient, address, checkAllowance, publicClient]);

  // Execute swap
  const executeSwap = useCallback(async (params: SwapParams) => {
    if (!walletClient || !address || !publicClient) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsSwapping(true);
      setSwapError(null);

      const { tokenInSymbol, tokenOutSymbol, amountIn, dexName = 'uniswap' } = params;
      
      // Get token addresses
      const tokenInAddress = getTokenAddressBySymbol(tokenInSymbol);
      const tokenOutAddress = getTokenAddressBySymbol(tokenOutSymbol);
      
      // Find available pool
      const pool = findAvailablePool(tokenInAddress, tokenOutAddress);
      if (!pool) {
        throw new Error(`No pool available for ${tokenInSymbol}/${tokenOutSymbol}`);
      }

      // Get contract address
      const contractAddress = getDexContractAddress(dexName);
      
      // Convert amount to BigInt with 18 decimals (all our tokens have 18 decimals)
      const amountInBigInt = parseUnits(amountIn, 18);

      // Step 1: Check and approve token if needed
      const currentAllowance = await checkAllowance(tokenInAddress, contractAddress);
      
      if (currentAllowance < amountInBigInt) {
        await approveToken(tokenInAddress, contractAddress, amountInBigInt);
      }

      // Step 2: Get quote before swap
      const quote = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: SWAP_ABI,
        functionName: 'getQuote',
        args: [pool.poolId as `0x${string}`, tokenInAddress as `0x${string}`, amountInBigInt],
      });

      const quotedAmount = formatUnits(quote as bigint, 18);

      // Step 3: Execute swap
      const swapHash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: SWAP_ABI,
        functionName: 'swap',
        args: [
          pool.poolId as `0x${string}`,
          tokenInAddress as `0x${string}`,
          amountInBigInt,
          BigInt(Math.floor(Number(quote) * 0.95)), // 5% slippage tolerance
        ],
      });

      // Wait for confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash: swapHash });
      
      if (receipt.status === 'reverted') {
        throw new Error('Swap transaction reverted');
      }

      setIsSwapping(false);
      return {
        hash: swapHash,
        expectedOutput: quotedAmount,
        pool: pool.name,
      };

    } catch (error) {
      setIsSwapping(false);
      setSwapError(error instanceof Error ? error.message : 'Swap failed');
      throw error;
    }
  }, [walletClient, address, publicClient, checkAllowance, approveToken]);

  // Get available pools for UI
  const getAvailablePools = useCallback(() => {
    return AVAILABLE_POOLS.map(pool => ({
      name: pool.name,
      tokenA: pool.tokenA,
      tokenB: pool.tokenB,
      poolId: pool.poolId,
      // Get token symbols from addresses
      tokenASymbol: Object.entries(TOKEN_ADDRESSES).find(([, addr]) => addr === pool.tokenA)?.[0] || 'UNKNOWN',
      tokenBSymbol: Object.entries(TOKEN_ADDRESSES).find(([, addr]) => addr === pool.tokenB)?.[0] || 'UNKNOWN',
    }));
  }, []);

  // Smart swap function that finds best route
  const smartSwap = useCallback(async (params: SwapParams) => {
    // For now, just use the direct pool if available
    // In the future, this could implement multi-hop routing
    return executeSwap(params);
  }, [executeSwap]);

  return {
    // Functions
    executeSwap,
    smartSwap,
    approveToken,
    checkAllowance,
    getAvailablePools,
    
    // State
    isApproving,
    isSwapping,
    approvalError,
    swapError,
    
    // Available pools
    availablePools: AVAILABLE_POOLS,
  };
}
