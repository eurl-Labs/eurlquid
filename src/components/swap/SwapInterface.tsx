"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SwapNavbar } from "./SwapNavbar";
import { SwapCard } from "./SwapCard";
import { RoutesList } from "./RoutesList";
import { Zap, TrendingUp, Shield, Search } from "lucide-react";
import Image from "next/image";

export function SwapInterface() {
  const [fromAmount, setFromAmount] = useState("");
  const [fromToken, setFromToken] = useState("WBTC");
  const [toToken, setToToken] = useState("USDT");
  const [isInputActive, setIsInputActive] = useState(false);

  const shouldShowRoutes = fromAmount.trim() !== "";
  const shouldShowSearching = isInputActive && !shouldShowRoutes;
  const shouldShowWelcome = !isInputActive && !shouldShowRoutes;

  const handleAmountChange = (amount: string) => {
    setFromAmount(amount);
    if (amount.trim() === "") {
      setIsInputActive(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SwapNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <SwapCard
              fromAmount={fromAmount}
              setFromAmount={handleAmountChange}
              fromToken={fromToken}
              setFromToken={setFromToken}
              toToken={toToken}
              setToToken={setToToken}
              onInputFocus={() => setIsInputActive(true)}
            />

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-white" />
                  <span className="text-white/90 text-sm">
                    Real-time Intelligence
                  </span>
                </div>
                <span className="text-white text-sm font-medium">Active</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-white/90 text-sm">MEV Protection</span>
                </div>
                <span className="text-white text-sm font-medium">Enabled</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <span className="text-white/90 text-sm">AI Predictions</span>
                </div>
                <span className="text-white text-sm font-medium">Running</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {shouldShowRoutes ? (
                <motion.div
                  key="routes-list"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  <RoutesList
                    fromAmount={fromAmount}
                    fromToken={fromToken}
                    toToken={toToken}
                  />
                </motion.div>
              ) : shouldShowSearching ? (
                <motion.div
                  key="searching"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8"
                >
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.6, 1, 0.6],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 0,
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.6, 1, 0.6],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.6, 1, 0.6],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 0.4,
                          }}
                        />
                      </div>
                      <span className="text-white font-medium text-lg">
                        Searching for aggregators
                      </span>
                    </div>

                    <div className="text-center space-y-2">
                      <p className="text-white/60">
                        Enter an amount to discover the best routes
                      </p>
                      <div className="flex items-center justify-center space-x-4 text-sm text-white/40">
                        <span>• Real-time pricing</span>
                        <span>• MEV protection</span>
                        <span>• AI optimization</span>
                      </div>
                    </div>

                    <div className="w-full max-w-md">
                      <motion.div
                        className="h-1 bg-white/10 rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-white/20 to-white/60 rounded-full"
                          animate={{
                            x: ["-100%", "100%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ) : shouldShowWelcome ? (
                <motion.div
                  key="start-swap"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8"
                >
                  <div className="flex flex-col items-center justify-center space-y-8 min-h-[400px]">
                    <div className="text-center space-y-4">
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="mb-4 flex justify-center"
                      >
                        <Search className="w-16 h-16 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white">
                        Start Your Smart Swap
                      </h3>
                      <p className="text-white/60 text-lg max-w-md">
                        Click on the input field and enter an amount to discover
                        the best DEX routes
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Image
                              src="/images/logo/uniLogo.svg.png"
                              alt="Uniswap logo"
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          </div>
                          <span className="text-white text-sm font-medium">
                            Uniswap
                          </span>
                          <span className="text-white/60 text-xs">
                            High Liquidity
                          </span>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Image
                              src="/images/logo/curveLogo.png"
                              alt="Curve logo"
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          </div>
                          <span className="text-white text-sm font-medium">
                            Curve
                          </span>
                          <span className="text-white/60 text-xs">
                            Medium Liquidity
                          </span>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Image
                              src="/images/logo/1inchLogo.png"
                              alt="1inch logo"
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          </div>
                          <span className="text-white text-sm font-medium">
                            1inch
                          </span>
                          <span className="text-white/60 text-xs">
                            Aggregated
                          </span>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Image
                              src="/images/logo/balancerLogo.png"
                              alt="Balancer logo"
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          </div>
                          <span className="text-white text-sm font-medium">
                            Balancer
                          </span>
                          <span className="text-white/60 text-xs">
                            High Liquidity
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    <span>
                      Choose your preferred DEX with deep liquidity pools.
                    </span>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
