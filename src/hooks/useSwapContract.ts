import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { SWAP_ABI, getDexContractAddress, SwapParams } from '@/contracts/abi/swap-abi';
import { useState, useCallback } from 'react';
import { parseUnits, formatUnits } from 'viem';
import { 
  getPoolIdFromContract, 
  validatePool, 
  getSwapQuote, 
  getTokenAllowance,
  getTokenBalance 
} from '@/lib/contract-reader';

// ERC20 ABI for token approval
const ERC20_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// Hook for token approval
export function useTokenApproval() {
  const [isApproving, setIsApproving] = useState(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const { address } = useAccount();
  
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Check current allowance for a token
  const checkAllowance = useCallback(async (
    tokenAddress: string,
    spenderAddress: string
  ): Promise<bigint> => {
    if (!address) return BigInt(0);
    
    try {
      const allowance = await getTokenAllowance(tokenAddress, address, spenderAddress);
      return allowance;
    } catch (err) {
      console.error('Failed to check allowance:', err);
      return BigInt(0);
    }
  }, [address]);

  // Approve token spending
  const approveToken = useCallback(async (
    tokenAddress: string,
    spenderAddress: string,
    amount: bigint
  ) => {
    try {
      setIsApproving(true);
      setApprovalError(null);
      
      // Check current allowance first
      const currentAllowance = await checkAllowance(tokenAddress, spenderAddress);
      
      if (currentAllowance >= amount) {
        console.log('✅ Token already approved with sufficient allowance');
        setIsApproving(false);
        return true;
      }
      
      console.log(`🔄 Approving token ${tokenAddress} for ${spenderAddress}...`);
      console.log(`   Amount: ${amount.toString()}`);
      console.log(`   Current allowance: ${currentAllowance.toString()}`);
      
      writeContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spenderAddress as `0x${string}`, amount],
      });
      
    } catch (err: any) {
      setApprovalError(err.message || 'Token approval failed');
      setIsApproving(false);
    }
  }, [writeContract, checkAllowance]);

  // Reset states when approval is completed or failed
  if (isSuccess || error) {
    if (isApproving) {
      setIsApproving(false);
    }
  }

  return {
    approveToken,
    checkAllowance,
    isApproving: isApproving || isPending || isConfirming,
    isSuccess,
    error: approvalError || error?.message,
    hash
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
      
      console.log('💱 Executing swap on blockchain:', {
        contract: contractAddress,
        poolId: swapParams.poolId,
        tokenIn: swapParams.tokenIn,
        amountIn: swapParams.amountIn.toString(),
        amountOutMin: swapParams.amountOutMin.toString()
      });
      
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
  const { approveToken, checkAllowance, isApproving, isSuccess: isApprovalSuccess } = useTokenApproval();
  const { parseTokenAmount } = useTokenAmount();
  const { address } = useAccount();
  
  const performSwap = useCallback(async (
    dexName: string,
    tokenInAddress: string,
    tokenOutAddress: string,
    amountIn: string,
    minimumAmountOut: string,
    decimals: number = 18
  ) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    console.log(`🚀 Starting swap on ${dexName}:`, {
      tokenIn: tokenInAddress,
      tokenOut: tokenOutAddress,
      amountIn,
      minimumAmountOut,
    });

    try {
      const contractAddress = getDexContractAddress(dexName);
      const amountInBigInt = parseTokenAmount(amountIn, decimals);
      
      // Step 1: Get pool ID from contract
      console.log('🔍 Getting pool ID from contract...');
      const poolId = await getPoolIdFromContract(dexName, tokenInAddress, tokenOutAddress);
      console.log('✅ Pool ID:', poolId);

      // Step 2: Validate pool exists and has liquidity
      console.log('🏊 Validating pool...');
      const poolData = await validatePool(dexName, poolId);
      
      if (!poolData.exists) {
        throw new Error(`Pool does not exist for ${tokenInAddress}/${tokenOutAddress} on ${dexName}`);
      }
      
      if (poolData.reserveA === BigInt(0) || poolData.reserveB === BigInt(0)) {
        throw new Error(`Pool has insufficient liquidity on ${dexName}`);
      }
      
      console.log('✅ Pool validation successful:', {
        exists: poolData.exists,
        reserveA: poolData.reserveA.toString(),
        reserveB: poolData.reserveB.toString()
      });

      // Step 3: Get quote to verify expected output
      console.log('💰 Getting swap quote...');
      const quotedAmountOut = await getSwapQuote(dexName, poolId, tokenInAddress, amountInBigInt);
      const minAmountOutBigInt = parseTokenAmount(minimumAmountOut, decimals);
      
      if (quotedAmountOut < minAmountOutBigInt) {
        console.warn('⚠️ Quoted amount is less than minimum expected');
      }
      
      console.log('💡 Quote result:', {
        quotedAmountOut: quotedAmountOut.toString(),
        minAmountOut: minAmountOutBigInt.toString()
      });

      // Step 4: Check and approve token if needed
      console.log('🔍 Checking token approval...');
      const currentAllowance = await checkAllowance(tokenInAddress, contractAddress);
      
      if (currentAllowance < amountInBigInt) {
        console.log('⏳ Token approval required...');
        await approveToken(tokenInAddress, contractAddress, amountInBigInt);
        
        // Wait for approval to be confirmed
        console.log('⏳ Waiting for approval confirmation...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log('✅ Token already approved');
      }

      // Step 5: Execute the swap
      console.log('💱 Executing swap...');
      const swapParams: SwapParams = {
        poolId,
        tokenIn: tokenInAddress,
        amountIn: amountInBigInt,
        amountOutMin: minAmountOutBigInt
      };

      await executeSwap(dexName, swapParams);
      
    } catch (err: any) {
      console.error('Smart swap error:', err);
      throw err;
    }
  }, [executeSwap, approveToken, checkAllowance, parseTokenAmount, address]);

  return {
    performSwap,
    isSwapping: isSwapping || isApproving,
    isSuccess,
    error,
    hash,
    isApproving,
    isApprovalSuccess
  };
}
