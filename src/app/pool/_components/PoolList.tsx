"use client";

import { UserLiquidityPositions } from "./UserLiquidityPositions";
import { PopularPools } from "./PopularPools";

interface PoolListProps {
  activeTab: "create" | "existing";
}

export function PoolList({ activeTab }: PoolListProps) {
  // If showing user positions, use the GraphQL component
  if (activeTab === "existing") {
    return <UserLiquidityPositions />;
  }

  // If showing popular pools, use the GraphQL component
  if (activeTab === "create") {
    return <PopularPools />;
  }

  // Fallback (should not reach here)
  return null;
}