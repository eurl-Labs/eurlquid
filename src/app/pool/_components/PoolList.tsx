"use client";

import { UserLiquidityPositions } from "./UserLiquidityPositions";
import { PopularPools } from "./PopularPools";

interface PoolListProps {
  activeTab: "create" | "existing";
}

export function PoolList({ activeTab }: PoolListProps) {
  if (activeTab === "existing") {
    return <UserLiquidityPositions />;
  }

  if (activeTab === "create") {
    return <PopularPools />;
  }

  return null;
}
