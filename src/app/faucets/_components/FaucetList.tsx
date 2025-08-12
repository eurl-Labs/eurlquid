"use client";

import { motion } from "framer-motion";
import { Droplets, Clock, CheckCircle, ExternalLink } from "lucide-react";
import Image from "next/image";

interface FaucetListProps {
  onSelectToken: (token: string) => void;
  selectedToken: string | null;
  claimHistory: string[];
  onClaim: (tokenSymbol: string) => void;
}

const faucetTokens = [
  {
    symbol: "PENGU",
    name: "Pudgy Penguins",
    amount: "10000",
    logo: "/images/logoCoin/penguLogo.png",
    network: "Sonic Blaze Testnet",
    cooldown: "6h",
    description: "Popular meme token for testing",
    contractAddress: "0x...",
  },
  {
    symbol: "PEPE",
    name: "Pepe",
    amount: "1000000",
    logo: "/images/logoCoin/pepeLogo.png",
    network: "Sonic Blaze Testnet",
    cooldown: "6h",
    description: "Meme token with high supply",
    contractAddress: "0x...",
  },
  {
    symbol: "POLLY",
    name: "Polly",
    amount: "1000000",
    logo: "/images/logoCoin/pollyLogo.jpg",
    network: "Sonic Blaze Testnet",
    cooldown: "6h",
    description: "PENGU Wife",
    contractAddress: "0x...",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    amount: "0.1",
    logo: "/images/logoCoin/ethLogo.png",
    network: "Sonic Blaze Testnet",
    cooldown: "24h",
    description: "Native ETH for gas fees and testing",
    contractAddress: "0x...",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    amount: "1000",
    logo: "/images/logoCoin/usdcLogo.png",
    network: "Sonic Blaze Testnet",
    cooldown: "12h",
    description: "Stablecoin for DeFi testing",
    contractAddress: "0x...",
  },
  {
    symbol: "USDT",
    name: "Tether",
    amount: "1000",
    logo: "/images/logoCoin/usdtLogo.png",
    network: "Sonic Blaze Testnet",
    cooldown: "12h",
    description: "Popular stablecoin for testing",
    contractAddress: "0x...",
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    amount: "0.01",
    logo: "/images/logoCoin/wbtcLogo.png",
    network: "Sonic Blaze Testnet",
    cooldown: "24h",
    description: "Bitcoin representation on Ethereum",
    contractAddress: "0x...",
  },
];

export function FaucetList({
  onSelectToken,
  selectedToken,
  claimHistory,
  onClaim,
}: FaucetListProps) {
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
          {faucetTokens.length} tokens available
        </span>
      </div>

      <div className="space-y-3">
        {faucetTokens.map((token, index) => {
          const isClaimed = claimHistory.includes(token.symbol);
          const isSelected = selectedToken === token.symbol;

          return (
            <motion.div
              key={token.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/5 border rounded-xl p-4 transition-all duration-200 cursor-pointer group ${
                isSelected
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 hover:bg-white/10"
              }`}
              onClick={() => onSelectToken(token.symbol)}
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
                        {token.network}
                      </span>
                    </div>
                    <div className="text-sm text-white/80 mb-1">
                      {token.name}
                    </div>
                    <div className="text-xs text-white/60">
                      {token.description}
                    </div>
                  </div>
                </div>

                {/* Action Section */}
                <div className="text-right space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="font-bold text-white">{token.amount}</div>
                      <div className="text-xs text-white/60">
                        {token.symbol}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <Clock className="w-3 h-3 text-white/60" />
                    <span className="text-white/60">{token.cooldown}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isClaimed
                          ? "bg-red-500/20 text-red-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {isClaimed ? "Claimed" : "Available"}
                    </span>
                    <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
        <h4 className="font-medium text-white mb-2">How to use faucets:</h4>
        <ol className="text-sm text-white/80 space-y-1 list-decimal list-inside">
          <li>Select a token from the list above</li>
          <li>Enter your wallet address</li>
          <li>Click claim to receive testnet tokens</li>
          <li>Wait for the cooldown period before claiming again</li>
        </ol>
      </div>
    </motion.div>
  );
}
