'use client';

import { useQuery } from '@apollo/client';
import { useAccount } from 'wagmi';
import { GET_POOL_BY_WALLET_ADDRESS } from '@/lib/queries';
import { PoolsResponse } from '@/types/history';

export function useUserLiquidityPools() {
  const { address, isConnected } = useAccount();

  const { data, loading, error, refetch } = useQuery<PoolsResponse>(GET_POOL_BY_WALLET_ADDRESS, {
    variables: { creatorAddress: address },
    skip: !isConnected || !address,
    pollInterval: 30000, // Refresh every 30 seconds
    errorPolicy: 'all'
  });

  return {
    pools: data?.poolss?.items || [],
    loading,
    error,
    refetch,
    isConnected,
    address
  };
}