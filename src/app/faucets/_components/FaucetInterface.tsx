"use client";

import { useState } from "react";
import { SwapNavbar } from "@/components/swap/SwapNavbar";
import { FaucetCard } from "./FaucetCard";
import { FaucetList } from "./FaucetList";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Shield, Clock, Zap } from "lucide-react";

export function FaucetInterface() {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [claimHistory, setClaimHistory] = useState<string[]>([]);

  const handleClaim = (tokenSymbol: string) => {
    setClaimHistory([...claimHistory, tokenSymbol]);
  };

  return (
    <div className="min-h-screen">
      <SwapNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Faucet Panel */}
          <div className="lg:col-span-1">
            <FaucetCard
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              onClaim={handleClaim}
              claimHistory={claimHistory}
            />

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