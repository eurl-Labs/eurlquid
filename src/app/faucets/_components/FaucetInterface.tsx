"use client";

import { useState, useEffect } from "react";
import { SwapNavbar } from "@/components/swap/SwapNavbar";
import { FaucetCard } from "./FaucetCard";
import { FaucetList } from "./FaucetList";
import { motion } from "framer-motion";
import { Droplets, Shield, Clock, Zap, AlertCircle } from "lucide-react";
import { type TokenSymbol } from "../../hooks/query/contracts/use-faucet-tokens";
import { useAccount } from "wagmi";

export function FaucetInterface() {
  const [selectedToken, setSelectedToken] = useState<TokenSymbol | null>(null);
  const [claimHistory, setClaimHistory] = useState<TokenSymbol[]>([]);
  const { address } = useAccount();

  // Load claim history from localStorage
  useEffect(() => {
    if (address) {
      const storageKey = `faucet-claims-${address}`;
      const savedHistory = localStorage.getItem(storageKey);
      if (savedHistory) {
        setClaimHistory(JSON.parse(savedHistory));
      }
    }
  }, [address]);

  // Save claim history to localStorage
  const handleClaim = (tokenSymbol: TokenSymbol) => {
    if (!address) return;

    const newHistory = [...claimHistory, tokenSymbol];
    setClaimHistory(newHistory);

    const storageKey = `faucet-claims-${address}`;
    localStorage.setItem(storageKey, JSON.stringify(newHistory));
  };

  return (
    <div className="min-h-screen">
      <SwapNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Network Notice */}
        <div className="mb-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-white" />
            <div>
              <h4 className=" text-white font-bold">Sonic Testnet Faucets</h4>
              <p className="text-sm text-gray-400 font-medium">
                These are testnet tokens for development and testing purposes
                only. Each wallet can claim 100,000 tokens per token type.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Faucet Panel */}
          <div className="lg:col-span-1">
            <FaucetCard
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              onClaim={handleClaim}
              claimHistory={claimHistory}
            />

            {/* Faucet Features */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-white/90 text-sm">Testnet Safe</span>
                </div>
                <span className="text-white text-sm font-medium">✓</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-white" />
                  <span className="text-white/90 text-sm">
                    Instant Delivery
                  </span>
                </div>
                <span className="text-white text-sm font-medium">~30s</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-white" />
                  <span className="text-white/90 text-sm">One-time Claim</span>
                </div>
                <span className="text-white text-sm font-medium">
                  Per Wallet
                </span>
              </div>
            </div>
          </div>

          {/* Faucet List Panel */}
          <div className="lg:col-span-2">
            <FaucetList
              onSelectToken={setSelectedToken}
              selectedToken={selectedToken}
              claimHistory={claimHistory}
              onClaim={handleClaim}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
