import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { SWAP_ABI, getDexContractAddress, SwapParams, PoolInfo, QuoteParams } from '@/contracts/abi/swap-abi';
import { useState, useCallback } from 'react';
import { parseUnits, formatUnits } from 'viem';

// Hook for reading pool information
export function usePoolInfo(dexName: string, poolId: string) {
  const contractAddress = getDexContractAddress(dexName);
  
  const { data, isError, isLoading, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SWAP_ABI,
    functionName: 'pools',
    args: [poolId as `0x${string}`],
  });

  return {
    poolInfo: data as PoolInfo | undefined,
    isLoading,
    isError,
    refetch
  };
}

// Hook for getting quote (price estimation)
export function useSwapQuote(dexName: string, quoteParams: QuoteParams | null) {
  const contractAddress = getDexContractAddress(dexName);
  
  const { data, isError, isLoading, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SWAP_ABI,
    functionName: 'getQuote',
    args: quoteParams ? [
      quoteParams.poolId as `0x${string}`,
      quoteParams.tokenIn as `0x${string}`,
      quoteParams.amountIn
    ] : undefined,
    query: {
      enabled: !!quoteParams
    }
  });

  return {
    amountOut: data as bigint | undefined,
    isLoading,
    isError,
    refetch
  };
}

// Hook for executing swap
export function useSwap() {
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);
  
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const executeSwap = useCallback(async (dexName: string, swapParams: SwapParams) => {
    try {
      setIsSwapping(true);
      setSwapError(null);
      
      const contractAddress = getDexContractAddress(dexName);
      
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: SWAP_ABI,
        functionName: 'swap',
        args: [
          swapParams.poolId as `0x${string}`,
          swapParams.tokenIn as `0x${string}`,
          swapParams.amountIn,
          swapParams.amountOutMin
        ],
      });
    } catch (err: any) {
      setSwapError(err.message || 'Swap failed');
      setIsSwapping(false);
    }
  }, [writeContract]);

  // Reset loading state when transaction is confirmed or failed
  if (isSuccess || error) {
    if (isSwapping) {
      setIsSwapping(false);
    }
  }

  return {
    executeSwap,
    isSwapping: isSwapping || isPending || isConfirming,
    isSuccess,
    error: swapError || error?.message,
    hash
  };
}

// Hook for getting pool reserves
export function usePoolReserves(dexName: string, poolId: string) {
  const contractAddress = getDexContractAddress(dexName);
  
  const { data, isError, isLoading, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SWAP_ABI,
    functionName: 'getReserves',
    args: [poolId as `0x${string}`],
  });

  return {
    reserves: data as [bigint, bigint] | undefined,
    reserveA: data?.[0],
    reserveB: data?.[1],
    isLoading,
    isError,
    refetch
  };
}

// Hook for getting pool count
export function usePoolCount(dexName: string) {
  const contractAddress = getDexContractAddress(dexName);
  
  const { data, isError, isLoading, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SWAP_ABI,
    functionName: 'getPoolCount',
  });

  return {
    poolCount: data as bigint | undefined,
    isLoading,
    isError,
    refetch
  };
}

// Utility hook for handling token amounts and decimals
export function useTokenAmount() {
  const parseTokenAmount = useCallback((amount: string, decimals: number = 18): bigint => {
    return parseUnits(amount, decimals);
  }, []);

  const formatTokenAmount = useCallback((amount: bigint, decimals: number = 18): string => {
    return formatUnits(amount, decimals);
  }, []);

  return {
    parseTokenAmount,
    formatTokenAmount
  };
}

// Main hook that combines everything for easy swap execution
export function useSmartSwap() {
  const { executeSwap, isSwapping, isSuccess, error, hash } = useSwap();
  const { parseTokenAmount } = useTokenAmount();
  
  const performSwap = useCallback(async (
    dexName: string,
    tokenInAddress: string,
    tokenOutAddress: string,
    amountIn: string,
    minimumAmountOut: string,
    decimals: number = 18
  ) => {
    try {
      // Calculate pool ID (this would typically come from the UI or be fetched)
      const poolId = `0x${Buffer.from([tokenInAddress, tokenOutAddress].sort().join('')).toString('hex')}`;
      
      const swapParams: SwapParams = {
        poolId,
        tokenIn: tokenInAddress,
        amountIn: parseTokenAmount(amountIn, decimals),
        amountOutMin: parseTokenAmount(minimumAmountOut, decimals)
      };

      await executeSwap(dexName, swapParams);
    } catch (err: any) {
      console.error('Smart swap error:', err);
      throw err;
    }
  }, [executeSwap, parseTokenAmount]);

  return {
    performSwap,
    isSwapping,
    isSuccess,
    error,
    hash
  };
}
