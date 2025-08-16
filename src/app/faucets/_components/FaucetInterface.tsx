"use client";

import { useState, useEffect, useCallback } from "react";
import { SwapNavbar } from "@/components/swap/SwapNavbar";
import { FaucetCard } from "./FaucetCard";
import { FaucetList } from "./FaucetList";
import { motion } from "framer-motion";
import { Droplets, Shield, Clock, Zap, AlertCircle } from "lucide-react";
import { type TokenSymbol } from "../../hooks/query/contracts/use-faucet-tokens";
import { useAccount } from "wagmi";

// New interface for claim history with timestamps
interface ClaimRecord {
  token: TokenSymbol;
  timestamp: number;
}

export function FaucetInterface() {
  const [selectedToken, setSelectedToken] = useState<TokenSymbol | null>(null);
  const [claimHistory, setClaimHistory] = useState<ClaimRecord[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const { address } = useAccount();

  // 24 hours in milliseconds
  const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000;

  // Helper functions (using currentTime for real-time updates)
  const isTokenOnCooldown = (tokenSymbol: TokenSymbol): boolean => {
    const claimRecord = claimHistory.find(record => record.token === tokenSymbol);
    if (!claimRecord) return false;
    
    const timeSinceClaim = currentTime - claimRecord.timestamp;
    return timeSinceClaim < COOLDOWN_PERIOD;
  };

  const getTimeUntilAvailable = (tokenSymbol: TokenSymbol): number => {
    const claimRecord = claimHistory.find(record => record.token === tokenSymbol);
    if (!claimRecord) return 0;
    
    const timeSinceClaim = currentTime - claimRecord.timestamp;
    const timeRemaining = COOLDOWN_PERIOD - timeSinceClaim;
    return Math.max(0, timeRemaining);
  };

  const cleanExpiredClaims = (claims: ClaimRecord[]): ClaimRecord[] => {
    const now = Date.now();
    return claims.filter(claim => (now - claim.timestamp) < COOLDOWN_PERIOD);
  };

  // Load claim history from localStorage
  useEffect(() => {
    if (address) {
      const storageKey = `faucet-claims-${address}`;
      const savedHistory = localStorage.getItem(storageKey);
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          
          // Handle migration from old format (array of strings) to new format (array of objects)
          if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
            if (typeof parsedHistory[0] === 'string') {
              // Old format - convert to new format but expire them (since we don't have timestamps)
              console.log('Migrating old claim history format...');
              const migratedHistory: ClaimRecord[] = [];
              setClaimHistory(migratedHistory);
              localStorage.setItem(storageKey, JSON.stringify(migratedHistory));
            } else {
              // New format - clean expired claims and update
              const cleanedHistory = cleanExpiredClaims(parsedHistory);
              setClaimHistory(cleanedHistory);
              if (cleanedHistory.length !== parsedHistory.length) {
                localStorage.setItem(storageKey, JSON.stringify(cleanedHistory));
              }
            }
          }
        } catch (error) {
          console.error('Error parsing claim history:', error);
          setClaimHistory([]);
        }
      }
    }
  }, [address]);

  // Save claim history to localStorage - memoized to prevent infinite re-renders
  const handleClaim = useCallback((tokenSymbol: TokenSymbol) => {
    if (!address || isTokenOnCooldown(tokenSymbol)) return;

    const newClaimRecord: ClaimRecord = {
      token: tokenSymbol,
      timestamp: Date.now()
    };

    // Remove any existing claim for this token and add new one
    const filteredHistory = claimHistory.filter(record => record.token !== tokenSymbol);
    const newHistory = [...filteredHistory, newClaimRecord];
    setClaimHistory(newHistory);

    const storageKey = `faucet-claims-${address}`;
    localStorage.setItem(storageKey, JSON.stringify(newHistory));
  }, [address, claimHistory, isTokenOnCooldown]);

  // Auto-refresh timer for real-time countdown updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

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
              isTokenOnCooldown={isTokenOnCooldown}
              getTimeUntilAvailable={getTimeUntilAvailable}
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
              isTokenOnCooldown={isTokenOnCooldown}
              getTimeUntilAvailable={getTimeUntilAvailable}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
