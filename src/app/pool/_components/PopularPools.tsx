"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Droplets,
  ExternalLink,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { usePopularPools, DEX_OPTIONS } from "@/hooks/usePopularPools";
import { getTokenInfo, getDexInfo } from "@/lib/token-mapping";
import { Pool } from "@/types/history";

export function PopularPools() {
  const [selectedDex, setSelectedDex] = useState("Uniswap");
  const { pools, loading, error, refetch, refreshKey } =
    usePopularPools(selectedDex);

  const getTokenDisplay = (tokenAddress: string) => {
    const tokenInfo = getTokenInfo(tokenAddress);

    if (tokenInfo) {
      return {
        symbol: tokenInfo.symbol,
        logo: tokenInfo.logo,
      };
    }

    return {
      symbol: `${tokenAddress.slice(0, 6)}...${tokenAddress.slice(-4)}`,
      logo: "/images/logoCoin/usdcLogo.png",
    };
  };

  const getDexDisplay = (dexName: string) => {
    const dexInfo = getDexInfo(dexName);
    return {
      name: dexInfo?.name || dexName,
      logo: dexInfo?.logo || "/images/logo/defaultDex.png",
    };
  };

  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const openTransaction = (txHash: string) => {
    window.open(`https://testnet.sonicscan.org/tx/${txHash}`, "_blank");
  };

  const calculateAPR = (pool: Pool) => {
    const reserveA = parseFloat(pool.reserve_a);
    const reserveB = parseFloat(pool.reserve_b);
    return (Math.random() * 50 + 5).toFixed(1);
  };

  const calculateTVL = (pool: Pool) => {
    const reserveA = parseFloat(pool.reserve_a);
    const reserveB = parseFloat(pool.reserve_b);
    const totalValue = ((reserveA + reserveB) / 1e18) * 100;
    if (totalValue > 1000000) {
      return `$${(totalValue / 1000000).toFixed(1)}M`;
    } else if (totalValue > 1000) {
      return `$${(totalValue / 1000).toFixed(1)}K`;
    } else {
      return `$${totalValue.toFixed(0)}`;
    }
  };

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
          <h3 className="text-xl font-bold text-white">Popular Pools</h3>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-white/60">
            {pools.length} pool{pools.length !== 1 ? "s" : ""} on {selectedDex}
          </span>
          <motion.button
            onClick={() => refetch()}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-lg text-sm transition-colors"
          >
            <motion.div
              animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={
                loading
                  ? { duration: 1, repeat: Infinity, ease: "linear" }
                  : { duration: 0.3 }
              }
            >
              {loading ? (
                <Loader2 className="w-4 h-4" />
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
            </motion.div>
            <span>Refresh</span>
          </motion.button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm text-white/60">Filter by DEX:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DEX_OPTIONS.map((dex) => {
            const dexInfo = getDexDisplay(dex);
            return (
              <motion.button
                key={dex}
                onClick={() => setSelectedDex(dex)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedDex === dex
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                <Image
                  src={dexInfo.logo}
                  alt={dex}
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
                <span className="font-medium">
                  {dex === "OneInch" ? "1Inch" : dex}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-red-400 font-medium">
                Error loading popular pools
              </p>
              <p className="text-red-400/80 text-sm">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-white/40 mx-auto mb-4" />
          <p className="text-white/60">Loading popular pools...</p>
        </div>
      )}

      {!loading && !error && pools.length === 0 && (
        <div className="text-center py-12">
          <Droplets className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white mb-2">
            No pools found
          </h4>
          <p className="text-white/60">
            No pools available for {selectedDex} at the moment.
          </p>
        </div>
      )}

      {!loading && !error && pools.length > 0 && (
        <motion.div
          key={`${selectedDex}-${refreshKey}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-3"
        >
          {pools.map((pool: Pool, index) => {
            const tokenA = getTokenDisplay(pool.token_a);
            const tokenB = getTokenDisplay(pool.token_b);
            const dex = getDexDisplay(pool.dex_name);
            const apr = calculateAPR(pool);
            const tvl = calculateTVL(pool);

            return (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {/* Token A Logo */}
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                        <Image
                          src={tokenA.logo}
                          alt={tokenA.symbol}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Token B Logo - Overlapping */}
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 absolute -bottom-1 -right-2 bg-black">
                        <Image
                          src={tokenB.logo}
                          alt={tokenB.symbol}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">
                          {tokenA.symbol}/{tokenB.symbol}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Image
                            src={dex.logo}
                            alt={dex.name}
                            width={16}
                            height={16}
                            className="w-4 h-4"
                          />
                          <span className="text-xs bg-white/20 px-2 py-1 rounded text-white/80">
                            {dex.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-white/60">
                          TVL: {tvl}
                        </span>
                        <span className="text-xs text-white/60">
                          Created: {formatDate(pool.created_at)}
                        </span>
                      </div>
                      <div className="text-xs text-white/50 mt-1">
                        Pool ID:{" "}
                        {`${pool.id.slice(0, 8)}...${pool.id.slice(-6)}`}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-2 mb-1">
                      <span className="text-xs text-white/60">APR</span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span className="font-bold text-green-400 text-sm">
                          {apr}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs px-3 py-1 bg-white/20 text-white hover:bg-white hover:text-black rounded-lg transition-colors"
                      >
                        Add Liquidity
                      </motion.button>
                      <motion.button
                        onClick={() => openTransaction(pool.transaction_hash)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1 text-white/60 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
