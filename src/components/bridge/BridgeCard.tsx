"use client";

import { useState } from "react";
import { ArrowDownUp, ChevronDown, HelpCircle, Network, Zap } from "lucide-react";
import { SwapHelpModal } from "./BridgeHelpModal";

interface BridgeCardProps {
  fromAmount: string;
  setFromAmount: (amount: string) => void;
  fromToken: string;
  setFromToken: (token: string) => void;
  toToken: string;
  setToToken: (token: string) => void;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
}

const networks = {
  ETH: { name: "Ethereum", color: "bg-blue-600", symbol: "ETH" },
  BSC: { name: "BNB Chain", color: "bg-yellow-600", symbol: "BNB" },
  MATIC: { name: "Polygon", color: "bg-purple-600", symbol: "MATIC" },
  AVAX: { name: "Avalanche", color: "bg-red-600", symbol: "AVAX" },
  ARB: { name: "Arbitrum", color: "bg-blue-500", symbol: "ETH" },
  SONIC: { name: "Sonic Testnet", color: "bg-green-600", symbol: "S" },
};

export function BridgeCard({
  fromAmount,
  setFromAmount,
  fromToken,
  setFromToken,
  toToken,
  setToToken,
  onInputFocus,
  onInputBlur,
}: BridgeCardProps) {
  const [toAmount, setToAmount] = useState("0.354987");
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [showFromNetworks, setShowFromNetworks] = useState(false);
  const [showToNetworks, setShowToNetworks] = useState(false);

  const handleBridgeTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount || "0");
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white">Cross-Chain Bridge</h2>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-white/60">Fee: 0.1%</span>
          <button
            onClick={() => setHelpModalOpen(true)}
            className="cursor-pointer p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="How to bridge"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Source Network */}
      <div className="space-y-4">
        <div className="relative">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white/60 font-medium">From Network</span>
              <div className="relative">
                <button 
                  onClick={() => setShowFromNetworks(!showFromNetworks)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-colors border border-white/10"
                >
                  <div className={`w-3 h-3 rounded-full ${networks[fromToken as keyof typeof networks]?.color || 'bg-gray-600'}`}></div>
                  <span className="text-sm text-white font-medium">
                    {networks[fromToken as keyof typeof networks]?.name || fromToken}
                  </span>
                  <ChevronDown className="w-4 h-4 text-white/60" />
                </button>
                {showFromNetworks && (
                  <div className="absolute top-full mt-2 right-0 bg-black/90 backdrop-blur-lg border border-white/10 rounded-xl p-2 min-w-[180px] z-50">
                    {Object.entries(networks).map(([key, network]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setFromToken(key);
                          setShowFromNetworks(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left"
                      >
                        <div className={`w-3 h-3 rounded-full ${network.color}`}></div>
                        <span className="text-white text-sm">{network.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                placeholder="0.0"
                className="w-full bg-transparent text-3xl font-bold text-white outline-none placeholder-white/30 pr-16"
              />
              <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white/60 text-lg font-medium">
                {networks[fromToken as keyof typeof networks]?.symbol || fromToken}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-white/60">≈ ${(parseFloat(fromAmount) * 3549.87 || 0).toLocaleString()}</span>
              <button className="text-sm text-white transition-colors">
                Max: 2.5 {networks[fromToken as keyof typeof networks]?.symbol || fromToken}
              </button>
            </div>
          </div>
        </div>

        {/* Bridge Button */}
        <div className="flex justify-center relative">
          <button
            onClick={handleBridgeTokens}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-all duration-200 hover:scale-110 group"
          >
            <ArrowDownUp className="w-6 h-6 text-white group-hover:rotate-180 transition-transform duration-300" />
          </button>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Destination Network */}
        <div className="relative">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white/60 font-medium">To Network</span>
              <div className="relative">
                <button 
                  onClick={() => setShowToNetworks(!showToNetworks)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-colors border border-white/10"
                >
                  <div className={`w-3 h-3 rounded-full ${networks[toToken as keyof typeof networks]?.color || 'bg-gray-600'}`}></div>
                  <span className="text-sm text-white font-medium">
                    {networks[toToken as keyof typeof networks]?.name || toToken}
                  </span>
                  <ChevronDown className="w-4 h-4 text-white/60" />
                </button>
                {showToNetworks && (
                  <div className="absolute top-full mt-2 right-0 bg-black/90 backdrop-blur-lg border border-white/10 rounded-xl p-2 min-w-[180px] z-50">
                    {Object.entries(networks).filter(([key]) => key !== fromToken).map(([key, network]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setToToken(key);
                          setShowToNetworks(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left"
                      >
                        <div className={`w-3 h-3 rounded-full ${network.color}`}></div>
                        <span className="text-white text-sm">{network.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                value={toAmount}
                readOnly
                className="w-full bg-transparent text-3xl font-bold text-white outline-none pr-16"
              />
              <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white/60 text-lg font-medium">
                {networks[toToken as keyof typeof networks]?.symbol || toToken}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-white/60">≈ ${(parseFloat(toAmount) * 354.99 || 0).toLocaleString()}</span>
              <span className="text-sm text-white/60">
                Balance: 15,420 {networks[toToken as keyof typeof networks]?.symbol || toToken}
              </span>
            </div>
          </div>
        </div>

        {/* Bridge Analysis */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-white">Smart Bridge Route</span>
            </div>
            <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">~2-15 min</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-white/90">Best route via LayerZero</span>
              <span className="text-green-400">✓ Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Security Level</span>
              <span className="text-white">High</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Bridge Fee</span>
              <span className="text-white">0.1%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Gas Savings</span>
              <span className="text-green-400">+$0.24 saved</span>
            </div>
          </div>
        </div>

        {/* Bridge Button */}
        <button className="w-full bg-white text-black font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
          <div className="flex items-center justify-center space-x-2">
            <Network className="w-5 h-5" />
            <span>Execute Bridge Transfer</span>
          </div>
        </button>
      </div>
      {/* Help Modal */}
      <SwapHelpModal 
        isOpen={helpModalOpen} 
        onClose={() => setHelpModalOpen(false)} 
      />
    </div>
  );
}
