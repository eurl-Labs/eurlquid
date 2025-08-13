"use client";

import { motion } from "framer-motion";
import { Droplets, TrendingUp, ExternalLink, Plus } from "lucide-react";
import Image from "next/image";
import { EXISTING_POOLS, POOL_TOKENS } from "../../hooks/query/contracts/use-pool";

interface PoolListProps {
  activeTab: "create" | "existing";
}

// Mock popular pools data with existing pool IDs
const popularPools = [
  {
    id: EXISTING_POOLS["WBTC/USDT"],
    token0: "WBTC",
    token1: "USDT",
    fee: 0.3,
    tvl: "$123.4M",
    volume24h: "$23.1M",
    apr: "8.2%",
    userLiquidity: "$2,450",
    isActive: true,
  },
  {
    id: EXISTING_POOLS["WETH/USDC"],
    token0: "WETH",
    token1: "USDC",
    fee: 0.3,
    tvl: "$45.2M",
    volume24h: "$12.8M",
    apr: "24.5%",
    userLiquidity: "$0",
    isActive: false,
  },
  {
    id: EXISTING_POOLS["PEPE/USDT"],
    token0: "PEPE",
    token1: "USDT",
    fee: 0.3,
    tvl: "$23.4M",
    volume24h: "$5.8M",
    apr: "32.8%",
    userLiquidity: "$0",
    isActive: false,
  },
  {
    id: EXISTING_POOLS["WSONIC/PENGU"],
    token0: "WSONIC",
    token1: "PENGU",
    fee: 0.3,
    tvl: "$8.7M",
    volume24h: "$2.1M",
    apr: "45.2%",
    userLiquidity: "$1,250",
    isActive: true,
  },
  {
    id: EXISTING_POOLS["WETH/WSONIC"],
    token0: "WETH",
    token1: "WSONIC",
    fee: 0.3,
    tvl: "$78.9M",
    volume24h: "$8.5M",
    apr: "18.7%",
    userLiquidity: "$0",
    isActive: false,
  },
  {
    id: EXISTING_POOLS["WSONIC/PEPE"],
    token0: "WSONIC",
    token1: "PEPE",
    fee: 0.3,
    tvl: "$12.3M",
    volume24h: "$3.2M",
    apr: "28.4%",
    userLiquidity: "$0",
    isActive: false,
  },
];

// Function to get token logo path
const getTokenLogo = (symbol: string) => {
  const token = POOL_TOKENS[symbol as keyof typeof POOL_TOKENS];
  return token ? token.logo : "/images/logoCoin/ethereum.png";
};

export function PoolList({ activeTab }: PoolListProps) {
  const filteredPools = activeTab === "existing"
    ? popularPools.filter((pool) => pool.userLiquidity !== "$0")
    : popularPools;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Droplets className="w-6 h-6 text-white" />
          <h3 className="text-xl font-bold text-white">
            {activeTab === "create"
              ? "Popular Pools"
              : "Your Liquidity Positions"}
          </h3>
        </div>
        <span className="text-sm text-white/60">
          {filteredPools.length} pool{filteredPools.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filteredPools.length === 0 ? (
        <div className="text-center py-12">
          <Droplets className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white mb-2">
            No positions yet
          </h4>
          <p className="text-white/60 mb-4">
            Create your first liquidity position to start earning fees
          </p>
          <button className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Create Position</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPools.map((pool, index) => (
            <motion.div
              key={pool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {/* Token 0 Logo */}
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                      <Image
                        src={getTokenLogo(pool.token0)}
                        alt={pool.token0}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Token 1 Logo - Overlapping */}
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 absolute -bottom-1 -right-2 bg-black">
                      <Image
                        src={getTokenLogo(pool.token1)}
                        alt={pool.token1}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">
                        {pool.token0}/{pool.token1}
                      </span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded text-white/80">
                        {pool.fee}%
                      </span>
                      {pool.userLiquidity !== "$0" && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-white/60">
                        TVL: {pool.tvl}
                      </span>
                      <span className="text-xs text-white/60">
                        24h Vol: {pool.volume24h}
                      </span>
                    </div>
                    <div className="text-xs text-white/50 mt-1">
                      Pool ID: {`${pool.id.slice(0, 8)}...${pool.id.slice(-6)}`}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end space-x-2 mb-1">
                    <span className="text-xs text-white/60">APR</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="font-bold text-green-400 text-sm">
                        {pool.apr}
                      </span>
                    </div>
                  </div>
                  {pool.userLiquidity !== "$0" && (
                    <div className="text-sm text-white/80 font-medium mb-1">
                      {pool.userLiquidity}
                    </div>
                  )}
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-xs px-3 py-1 bg-white/20 text-white hover:bg-white hover:text-black rounded-lg transition-colors">
                      Add Liquidity
                    </button>
                    <button className="p-1 text-white/60 hover:text-white transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}