'use client';

import { useQuery } from '@apollo/client';
import { useAccount } from 'wagmi';
import { GET_USER_TRADING_HISTORY, GET_TRADING_BY_DEX_AND_TRADER } from '@/lib/queries';
import { SwapsResponse } from '@/types/history';

export function useUserTradingHistory(selectedDex?: string, limit: number = 50) {
  const { address, isConnected } = useAccount();
  
  // Choose query based on whether DEX filter is applied
  const query = selectedDex && selectedDex !== 'all' 
    ? GET_TRADING_BY_DEX_AND_TRADER 
    : GET_USER_TRADING_HISTORY;
    
  const variables = selectedDex && selectedDex !== 'all'
    ? { trader: address, dexName: selectedDex, limit }
    : { walletAddress: address, limit };

  const { data, loading, error, refetch } = useQuery<SwapsResponse>(query, {
    variables,
    skip: !isConnected || !address,
    pollInterval: 15000, // Refresh every 15 seconds
    errorPolicy: 'all'
  });

  return {
    swaps: data?.swapss?.items || [],
    loading,
    error,
    refetch,
    isConnected,
    address
  };
}