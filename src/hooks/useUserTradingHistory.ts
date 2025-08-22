"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import {
  GET_USER_TRADING_HISTORY,
  GET_TRADING_BY_DEX_AND_TRADER,
} from "@/lib/queries";
import { SwapsResponse } from "@/types/history";

export function useUserTradingHistory(
  selectedDex?: string,
  limit: number = 50
) {
  const { address, isConnected } = useAccount();
  const [refreshKey, setRefreshKey] = useState(0);

  const query =
    selectedDex && selectedDex !== "all"
      ? GET_TRADING_BY_DEX_AND_TRADER
      : GET_USER_TRADING_HISTORY;

  const variables =
    selectedDex && selectedDex !== "all"
      ? { trader: address, dexName: selectedDex, limit }
      : { walletAddress: address, limit };

  const { data, loading, error, refetch } = useQuery<SwapsResponse>(query, {
    variables,
    skip: !isConnected || !address,
    pollInterval: 15000,
    errorPolicy: "all",
  });

  const customRefetch = async () => {
    setRefreshKey((prev) => prev + 1);
    return await refetch();
  };

  return {
    swaps: data?.swapss?.items || [],
    loading,
    error,
    refetch: customRefetch,
    refreshKey,
    isConnected,
    address,
  };
}
