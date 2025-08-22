"use client";

import { motion } from "framer-motion";
import {
  Droplets,
  ExternalLink,
  Plus,
  Loader2,
  AlertCircle,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { useUserLiquidityPools } from "@/hooks/useUserLiquidityPools";
import { getTokenInfo, getDexInfo } from "@/lib/token-mapping";
import { Pool } from "@/types/history";

export function UserLiquidityPositions() {
  const { pools, loading, error, refetch, refreshKey, isConnected } =
    useUserLiquidityPools();

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
      logo: dexInfo?.logo || "/images/logo/uniLogo.svg.png",
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

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <div className="text-center py-12">
          <Wallet className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white mb-2">
            Connect Your Wallet
          </h4>
          <p className="text-white/60">
            Connect your wallet to view your liquidity positions
          </p>
        </div>
      </motion.div>
    );
  }

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
          <h3 className="text-xl font-bold text-white">Your Created Pools</h3>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-white/60">
            {pools.length} pool{pools.length !== 1 ? "s" : ""}
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

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-red-400 font-medium">
                Error loading liquidity positions
              </p>
              <p className="text-red-400/80 text-sm">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-white/40 mx-auto mb-4" />
          <p className="text-white/60">Loading your positions...</p>
        </div>
      )}

      {!loading && !error && pools.length === 0 && (
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
      )}

      {!loading && !error && pools.length > 0 && (
        <motion.div
          key={refreshKey}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-3"
        >
          {pools.map((pool: Pool, index) => {
            const tokenA = getTokenDisplay(pool.token_a);
            const tokenB = getTokenDisplay(pool.token_b);
            const dex = getDexDisplay(pool.dex_name);

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
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                        <Image
                          src={tokenA.logo}
                          alt={tokenA.symbol}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
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
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                          Active
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-white/50">
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
                    <div className="flex items-center justify-end space-x-2 mb-2">
                      <span className="text-xs text-white/60">Block</span>
                      <span className="font-medium text-white text-sm">
                        #{pool.block_number}
                      </span>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      <motion.button
                        onClick={() => openTransaction(pool.transaction_hash)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-1 text-sm cursor-pointer text-white/60 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
                      >
                        <span>View in explorer</span>
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
