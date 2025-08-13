"use client";

import { motion } from "framer-motion";
import { Droplets, Clock, CheckCircle, ExternalLink, AlertCircle } from "lucide-react";
import Image from "next/image";
import { FAUCET_TOKENS, type TokenSymbol, useFaucet } from "../../hooks/query/contracts/use-faucet-tokens";
import { useAccount } from "wagmi";

interface FaucetListProps {
  onSelectToken: (token: TokenSymbol) => void;
  selectedToken: TokenSymbol | null;
  claimHistory: TokenSymbol[];
  onClaim: (tokenSymbol: TokenSymbol) => void;
}

export function FaucetList({ 
  onSelectToken, 
  selectedToken, 
  claimHistory, 
  onClaim 
}: FaucetListProps) {
  const { isConnected } = useAccount();
  const { claimToken, isLoading } = useFaucet();

  const handleQuickClaim = async (tokenSymbol: TokenSymbol) => {
    if (!isConnected || claimHistory.includes(tokenSymbol)) return;
    
    try {
      await claimToken(tokenSymbol);
      onClaim(tokenSymbol);
    } catch (err) {
      console.error('Quick claim failed:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Droplets className="w-6 h-6 text-white" />
          <h3 className="text-xl font-bold text-white">Available Faucets</h3>
        </div>
        <span className="text-sm text-white/60">
          {Object.keys(FAUCET_TOKENS).length} tokens available
        </span>
      </div>

      <div className="space-y-3">
        {Object.entries(FAUCET_TOKENS).map(([symbol, token], index) => {
          const isClaimed = claimHistory.includes(symbol as TokenSymbol);
          const isSelected = selectedToken === symbol;
          
          return (
            <motion.div
              key={symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/5 border rounded-xl p-4 transition-all duration-200 cursor-pointer group ${
                isSelected 
                  ? "border-white/30 bg-white/10" 
                  : "border-white/10 hover:bg-white/10"
              }`}
              onClick={() => onSelectToken(symbol as TokenSymbol)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Token Logo */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 bg-black/20">
                      <Image
                        src={token.logo}
                        alt={token.symbol}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isClaimed && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Token Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold text-white text-lg">
                        {token.symbol}
                      </span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded text-white/80">
                        ERC20
                      </span>
                    </div>
                    <div className="text-sm text-white/80 mb-1">
                      {token.name}
                    </div>
                    <div className="text-xs text-white/60">
                      Contract: {`${token.address.slice(0, 6)}...${token.address.slice(-4)}`}
                    </div>
                  </div>
                </div>

                {/* Action Section */}
                <div className="text-right space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="font-bold text-white">
                        {token.amount}
                      </div>
                      <div className="text-xs text-white/60">
                        {token.symbol}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs">
                    <Clock className="w-3 h-3 text-white/60" />
                    <span className="text-white/60">Instant</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isClaimed ? (
                      <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                        Claimed ✓
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickClaim(symbol as TokenSymbol);
                        }}
                        disabled={!isConnected || isLoading}
                        className="cursor-pointer text-xs px-3 py-1 rounded-full bg-white/20 text-white hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Claiming..." : "Quick Claim"}
                      </button>
                    )}
                    <button className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://testnet.sonicscan.org/address/${token.address}`, '_blank');
                      }}
                    >
                      <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
        <h4 className="font-medium text-white mb-2">How to claim tokens:</h4>
        <ol className="text-sm text-white/80 space-y-1 list-decimal list-inside">
          <li>Connect your wallet using the button in the navbar</li>
          <li>Select a token from the list above or use the dropdown</li>
          <li>Click "Claim" to receive 100,000 testnet tokens</li>
          <li>Each token can be claimed once per wallet address</li>
          <li>Tokens will be sent directly to your connected wallet</li>
        </ol>
      </div>
    </motion.div>
  );
}