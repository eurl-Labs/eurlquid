"use client";

import { useState } from "react";
import { ArrowDownUp, ChevronDown, Brain } from "lucide-react";

interface SwapCardProps {
  fromAmount: string;
  setFromAmount: (amount: string) => void;
  fromToken: string;
  setFromToken: (token: string) => void;
  toToken: string;
  setToToken: (token: string) => void;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
}

export function SwapCard({
  fromAmount,
  setFromAmount,
  fromToken,
  setFromToken,
  toToken,
  setToToken,
  onInputFocus,
  onInputBlur,
}: SwapCardProps) {
  const [toAmount, setToAmount] = useState("0.354987");

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount || "0");
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Smart Swap</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-white/60">Slippage: 0.5%</span>
        </div>
      </div>

      {/* From Token */}
      <div className="space-y-4">
        <div className="relative">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">From</span>
              <button className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 rounded-lg px-2 py-1 transition-colors">
                <span className="text-sm text-white font-medium">
                  {fromToken}
                </span>
                <ChevronDown className="w-3 h-3 text-white/60" />
              </button>
            </div>

            <input
              type="text"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              placeholder="0.0"
              className="w-full bg-transparent text-2xl font-semibold text-white outline-none placeholder-white/30"
            />
            <div className="mt-2">
              <span className="text-sm text-white/60">≈ $3,549.87</span>
            </div>
            <div className="flex justify-end">
              <span className="text-sm text-white/60">Balance: 2.5 ETH</span>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwapTokens}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition-colors"
          >
            <ArrowDownUp className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* To Token */}
        <div className="relative">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">To</span>
              <button className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 rounded-lg px-2 py-1 transition-colors">
                <span className="text-sm text-white font-medium">
                  {toToken}
                </span>
                <ChevronDown className="w-3 h-3 text-white/60" />
              </button>
            </div>
            <input
              type="text"
              value={toAmount}
              readOnly
              className="w-full bg-transparent text-2xl font-semibold text-white outline-none"
            />
            <div className="mt-2">
              <span className="text-sm text-white/60">≈ $354.99</span>
            </div>
            <div className="flex justify-end">
              <span className="text-sm text-white/60">
                Balance: 15,420 USDC
              </span>
            </div>
          </div>
        </div>

        {/* Smart Analysis */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Smart Analysis</span>
            </div>
            <span className="text-xs text-white/60">85% Confidence</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="text-white/90">Execute via Curve for best rate</div>
            <div className="text-white/60">
              MEV risk: Low • Expected slippage: 0.12%
            </div>
            <div className="text-white">
              Potential savings: +$0.16 vs market
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <button className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
          Execute Smart Swap
        </button>
      </div>
    </div>
  );
}
