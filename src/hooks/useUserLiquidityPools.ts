"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import { GET_POOL_BY_WALLET_ADDRESS } from "@/lib/queries";
import { PoolsResponse } from "@/types/history";

export function useUserLiquidityPools() {
  const { address, isConnected } = useAccount();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, loading, error, refetch } = useQuery<PoolsResponse>(
    GET_POOL_BY_WALLET_ADDRESS,
    {
      variables: { creatorAddress: address },
      skip: !isConnected || !address,
      pollInterval: 30000,
      errorPolicy: "all",
    }
  );

  const customRefetch = async () => {
    setRefreshKey((prev) => prev + 1);
    return await refetch();
  };

  return {
    pools: data?.poolss?.items || [],
    loading,
    error,
    refetch: customRefetch,
    refreshKey,
    isConnected,
    address,
  };
}
