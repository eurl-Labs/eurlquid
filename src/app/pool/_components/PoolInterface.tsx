"use client";

import { useState } from "react";
import { SwapNavbar } from "@/components/swap/SwapNavbar";
import { PoolCard } from "./PoolCard";
import { PoolList } from "./PoolList";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, TrendingUp, Shield, Clock, Plus } from "lucide-react";

export function PoolInterface() {
  const [token0Amount, setToken0Amount] = useState("");
  const [token1Amount, setToken1Amount] = useState("");
  const [token0, setToken0] = useState("ETH");
  const [token1, setToken1] = useState("USDC");
  const [isInputActive, setIsInputActive] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "existing">("create");

  return (
    <div className="min-h-screen">
      <SwapNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Pool Panel */}
          <div className="lg:col-span-1">
            {/* Tab Navigation */}
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-2 mb-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("create")}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    activeTab === "create"
                      ? "bg-white text-black"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Pool</span>
                </button>
                <button
                  onClick={() => setActiveTab("existing")}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    activeTab === "existing"
                      ? "bg-white text-black"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <Droplets className="w-4 h-4" />
                  <span>Add Liquidity</span>
                </button>
              </div>
            </div>

            <PoolCard
              token0Amount={token0Amount}
              setToken0Amount={setToken0Amount}
              token1Amount={token1Amount}
              setToken1Amount={setToken1Amount}
              token0={token0}
              setToken0={setToken0}
              token1={token1}
              setToken1={setToken1}
              onInputFocus={() => setIsInputActive(true)}
              onInputBlur={() => setIsInputActive(false)}
              isCreateMode={activeTab === "create"}
            />
          </div>

          {/* Pool List Panel */}
          <div className="lg:col-span-2">
            <AnimatePresence>
              {isInputActive && (token0Amount || token1Amount) ? (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Droplets className="w-8 h-8 text-white" />
                        <span className="text-xl font-bold text-white">
                          Pool Preview
                        </span>
                      </div>
                      <p className="text-white/60">
                        Your position will be worth approximately{" "}
                        <span className="text-white font-medium">
                          $
                          {(
                            (parseFloat(token0Amount) || 0) * 2000 +
                            (parseFloat(token1Amount) || 0)
                          ).toFixed(2)}
                        </span>
                      </p>
                      <div className="bg-white/5 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white/60">Share of Pool:</span>
                          <span className="text-white">~0.01%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Est. APR:</span>
                          <span className="text-green-400">24.5%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <PoolList activeTab={activeTab} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
