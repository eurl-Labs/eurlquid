'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_POOL_BY_DEX_AGGREGATOR } from '@/lib/queries';
import { PoolsResponse } from '@/types/history';

export const DEX_OPTIONS = ['Uniswap', 'Balancer', 'Curve', 'OneInch'];

export function usePopularPools(selectedDex: string = 'Uniswap') {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, loading, error, refetch } = useQuery<PoolsResponse>(GET_POOL_BY_DEX_AGGREGATOR, {
    variables: { 
      dexName: selectedDex, 
      limit: 6 
    },
    pollInterval: 30000,
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });

  const customRefetch = async () => {
    setRefreshKey(prev => prev + 1);
    return await refetch();
  };

  return {
    pools: data?.poolss?.items || [],
    loading,
    error,
    refetch: customRefetch,
    refreshKey,
    selectedDex
  };
}