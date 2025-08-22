"use client";

import { useState } from "react";
import {
  ChevronDown,
  Plus,
  HelpCircle,
  Droplets,
  Settings,
  Info,
} from "lucide-react";

interface PoolCardProps {
  token0Amount: string;
  setToken0Amount: (amount: string) => void;
  token1Amount: string;
  setToken1Amount: (amount: string) => void;
  token0: string;
  setToken0: (token: string) => void;
  token1: string;
  setToken1: (token: string) => void;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  isCreateMode: boolean;
}

const tokens = {
  ETH: { name: "Ethereum", symbol: "ETH", price: 2000, balance: "2.5" },
  USDC: { name: "USD Coin", symbol: "USDC", price: 1, balance: "5000" },
  USDT: { name: "Tether", symbol: "USDT", price: 1, balance: "3000" },
  DAI: { name: "Dai", symbol: "DAI", price: 1, balance: "1500" },
  WBTC: {
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    price: 35000,
    balance: "0.1",
  },
};

export function PoolCard({
  token0Amount,
  setToken0Amount,
  token1Amount,
  setToken1Amount,
  token0,
  token1,
  onInputFocus,
  onInputBlur,
  isCreateMode,
}: PoolCardProps) {
  const [feeRate, setFeeRate] = useState("0.3");
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const token0Data = tokens[token0 as keyof typeof tokens];
  const token1Data = tokens[token1 as keyof typeof tokens];

  const calculatePoolShare = () => {
    if (!token0Amount || !token1Amount) return "0";
    return "0.01";
  };

  const calculateAPR = () => {
    return "24.5";
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold text-white">
            {isCreateMode ? "Create Liquidity Pool" : "Add Liquidity"}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setHelpModalOpen(true)}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="How to provide liquidity"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white/60 font-medium">
              First Token
            </span>
            <button className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1 transition-colors">
              <span className="text-sm text-white font-medium">{token0}</span>
              <ChevronDown className="w-3 h-3 text-white/60" />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={token0Amount}
              onChange={(e) => setToken0Amount(e.target.value)}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              placeholder="0.0"
              className="w-full bg-transparent text-3xl font-bold text-white outline-none placeholder-white/30 pr-16"
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-white/60">
              ≈ $
              {((parseFloat(token0Amount) || 0) * token0Data?.price).toFixed(2)}
            </span>
            <button className="text-sm text-white/60 hover:text-white transition-colors">
              Max: {token0Data?.balance}
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="p-2 bg-white/10 rounded-lg border border-white/10">
            <Plus className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white/60 font-medium">
              Second Token
            </span>
            <button className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1 transition-colors">
              <span className="text-sm text-white font-medium">{token1}</span>
              <ChevronDown className="w-3 h-3 text-white/60" />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={token1Amount}
              onChange={(e) => setToken1Amount(e.target.value)}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              placeholder="0.0"
              className="w-full bg-transparent text-3xl font-bold text-white outline-none placeholder-white/30 pr-16"
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-white/60">
              ≈ $
              {((parseFloat(token1Amount) || 0) * token1Data?.price).toFixed(2)}
            </span>
            <button className="text-sm text-white/60 hover:text-white transition-colors">
              Max: {token1Data?.balance}
            </button>
          </div>
        </div>

        {(token0Amount || token1Amount) && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Droplets className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-white">
                Pool Information
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Your Pool Share:</span>
                <span className="text-white">{calculatePoolShare()}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Estimated APR:</span>
                <span className="text-green-400">{calculateAPR()}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Fee Tier:</span>
                <span className="text-white">{feeRate}%</span>
              </div>
            </div>
          </div>
        )}

        <button className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
          <div className="flex items-center justify-center space-x-2">
            <Droplets className="w-5 h-5" />
            <span>{isCreateMode ? "Create Pool" : "Add Liquidity"}</span>
          </div>
        </button>
      </div>
    </div>
  );
}
