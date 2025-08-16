"use client";

import { useState, useEffect } from "react";
import { ArrowDownUp, Brain, HelpCircle } from "lucide-react";
import { SwapHelpModal } from "./SwapHelpModal";
import { TokenSelector } from "./TokenSelector";
import { useTokenBalance, type TokenSymbol } from "@/app/hooks/query/contracts/use-token-balance";
import { useAnalysisStore } from "@/store/userprompt-store";
import { useSwapPrice } from "@/hooks/useSwapPrice";

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

// Token mapping for display (swap format -> pool format)
const SWAP_TO_POOL_TOKEN: Record<string, string> = {
  "ETH": "WETH", // Display as ETH but use WETH internally
  "USDC": "USDC",
  "USDT": "USDT", 
  "WBTC": "WBTC",
  "WSONIC": "WSONIC",
  "PEPE": "PEPE",
  "PENGU": "PENGU",
  "DPENGU": "DARKPENGU", // Pool uses DARKPENGU
  "GOONER": "GOONER",
  "ABSTER": "ABSTER",
  "POLLY": "POLLY",
};

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
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // Get real-time price calculation from Pyth
  const { 
    toAmount: calculatedToAmount, 
    fromPriceUSD, 
    toPriceUSD, 
    isLoading: priceLoading, 
    error: priceError,
    fromValueUSD,
    toValueUSD 
  } = useSwapPrice(fromToken, toToken, fromAmount);

  // Use calculated amount from price feed instead of static value
  const toAmount = calculatedToAmount;

  // Get token balances (convert display symbols to pool symbols)
  const fromPoolToken = SWAP_TO_POOL_TOKEN[fromToken] as TokenSymbol;
  const toPoolToken = SWAP_TO_POOL_TOKEN[toToken] as TokenSymbol;
  
  const { formattedBalance: fromTokenBalance } = useTokenBalance(fromPoolToken);
  const { formattedBalance: toTokenBalance } = useTokenBalance(toPoolToken);

  // Integration with analysis store
  const { setInput, runAnalysis, analysis, loading, error } = useAnalysisStore();
  const parsed = analysis?.parsed;

  // Helper functions
  const formatDisplayBalance = (balance: string | undefined) => {
    if (!balance) return "0.0000";
    const num = parseFloat(balance);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    } else {
      return num.toFixed(4);
    }
  };

  const handleMaxClick = () => {
    if (fromTokenBalance) {
      setFromAmount(fromTokenBalance);
    }
  };

  // Update store when tokens or amount change
  useEffect(() => {
    setInput(fromToken, toToken, fromAmount || '0');
    if (fromAmount && Number(fromAmount) > 0) {
      runAnalysis();
    }
  }, [fromToken, toToken, fromAmount, setInput, runAnalysis]);

  const handleSwapTokens = () => {
    // Only swap tokens, let the price calculation handle the amounts
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount || "0");
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Smart Swap</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-white/60">Slippage: 0.5%</span>
          <button
            onClick={() => setHelpModalOpen(true)}
            className="cursor-pointer p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="How to swap"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* From Token */}
      <div className="space-y-4">
        <div className="relative">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">From</span>
              <TokenSelector
                selectedToken={fromToken}
                onTokenSelect={setFromToken}
                otherToken={toToken}
                label="From"
              />
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
              <span className="text-sm text-white/60">
                {priceLoading ? "Loading..." : 
                 fromValueUSD ? `≈ $${fromValueUSD.toFixed(2)}` : 
                 priceError ? "Price unavailable" : "≈ $0.00"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white/60">
                  Balance: {formatDisplayBalance(fromTokenBalance)} {fromToken}
                </span>
                {fromTokenBalance && parseFloat(fromTokenBalance) > 0 && (
                  <button
                    onClick={handleMaxClick}
                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors"
                  >
                    MAX
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center relative">
          <button
            onClick={handleSwapTokens}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-all duration-200 hover:scale-110 group"
          >
            <ArrowDownUp className="w-6 h-6 text-white group-hover:rotate-180 transition-transform duration-300" />
          </button>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* To Token */}
        <div className="relative">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">To</span>
              <TokenSelector
                selectedToken={toToken}
                onTokenSelect={setToToken}
                otherToken={fromToken}
                label="To"
              />
            </div>
            <input
              type="text"
              value={toAmount}
              readOnly
              className="w-full bg-transparent text-2xl font-semibold text-white outline-none"
            />
            <div className="mt-2">
              <span className="text-sm text-white/60">
                {priceLoading ? "Calculating..." : 
                 toValueUSD ? `≈ $${toValueUSD.toFixed(2)}` : 
                 priceError ? "Price unavailable" : "≈ $0.00"}
              </span>
            </div>
            <div className="flex justify-end">
              <span className="text-sm text-white/60">
                Balance: {formatDisplayBalance(toTokenBalance)} {toToken}
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
            {parsed?.prediction?.confidence != null ? (
              <span className="text-xs text-white/60">
                {(parsed.prediction.confidence * 100).toFixed(0)}% Confidence
              </span>
            ) : (
              <span className="text-xs text-white/60">85% Confidence</span>
            )}
          </div>
          
          {loading && (
            <div className="space-y-1 text-sm">
              <div className="text-white/70">Analyzing live liquidity and routes…</div>
              <div className="text-white/60">Fetching data from DeFiLlama and TheGraph</div>
            </div>
          )}

          {error && (
            <div className="space-y-1 text-sm">
              <div className="text-red-300">Analysis temporarily unavailable</div>
              <div className="text-white/60">Using fallback recommendations</div>
              <div className="text-white">Execute via Curve for best rate</div>
            </div>
          )}

          {!loading && !error && parsed && (
            <div className="space-y-1 text-sm">
              <div className="text-white/90">{parsed.advice || 'Execute via Curve for best rate'}</div>
              <div className="text-white/60">
                MEV risk: {parsed.riskAlerts?.length > 0 ? 'Medium' : 'Low'} • Expected slippage: {parsed.expectedSlippage || '0.12%'}
              </div>
              <div className="text-white">
                Potential savings: {parsed.expectedSavingsUSD ? `$${parsed.expectedSavingsUSD}` : '+$0.16'} vs market
              </div>
            </div>
          )}

          {!loading && !error && !parsed && (
            <div className="space-y-1 text-sm">
              <div className="text-white/90">Execute via Curve for best rate</div>
              <div className="text-white/60">
                MEV risk: Low • Expected slippage: 0.12%
              </div>
              <div className="text-white">
                Potential savings: +$0.16 vs market
              </div>
            </div>
          )}
        </div>

        {/* Swap Button */}
        <button className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
          Execute Smart Swap
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
