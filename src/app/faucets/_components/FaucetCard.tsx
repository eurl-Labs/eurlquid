"use client";

import { useState } from "react";
import { 
  ChevronDown, 
  Droplets, 
  HelpCircle, 
  Settings,
  Wallet,
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import { useAccount } from "wagmi";

interface FaucetCardProps {
  selectedToken: string | null;
  setSelectedToken: (token: string | null) => void;
  onClaim: (tokenSymbol: string) => void;
  claimHistory: string[];
}

const faucetTokens = {
  ETH: { 
    name: "Ethereum", 
    symbol: "ETH", 
    amount: "0.1", 
    logo: "/images/logoCoin/ethLogo.png",
    cooldown: "24h",
    network: "Sonic Blaze Testnet"
  },
  USDC: { 
    name: "USD Coin", 
    symbol: "USDC", 
    amount: "1000", 
    logo: "/images/logoCoin/usdcLogo.png",
    cooldown: "12h",
    network: "Sonic Blaze Testnet"
  },
  POLLY: { 
    name: "Polly", 
    symbol: "POLLY", 
    amount: "1000000", 
    logo: "/images/logoCoin/pollyLogo.jpg",
    cooldown: "6h",
    network: "Sonic Blaze Testnet"
  },
  USDT: { 
    name: "Tether", 
    symbol: "USDT", 
    amount: "1000", 
    logo: "/images/logoCoin/usdtLogo.png",
    cooldown: "12h",
    network: "Sonic Blaze Testnet"
  },
  WBTC: { 
    name: "Wrapped Bitcoin", 
    symbol: "WBTC", 
    amount: "0.01", 
    logo: "/images/logoCoin/wbtcLogo.png",
    cooldown: "24h",
    network: "Sonic Blaze Testnet"
  },
  PENGU: { 
    name: "Pudgy Penguins", 
    symbol: "PENGU", 
    amount: "10000", 
    logo: "/images/logoCoin/penguLogo.png",
    cooldown: "6h",
    network: "Sonic Blaze Testnet"
  },
  PEPE: { 
    name: "Pepe", 
    symbol: "PEPE", 
    amount: "1000000", 
    logo: "/images/logoCoin/pepeLogo.png",
    cooldown: "6h",
    network: "Sonic Blaze Testnet"
  },
};

export function FaucetCard({
  selectedToken,
  setSelectedToken,
  onClaim,
  claimHistory,
}: FaucetCardProps) {
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { address, isConnected } = useAccount();

  const selectedTokenData = selectedToken ? faucetTokens[selectedToken as keyof typeof faucetTokens] : null;
  const canClaim = selectedToken && isConnected && address && !claimHistory.includes(selectedToken);

  const handleClaim = async () => {
    if (!selectedToken || !canClaim) return;
    
    setIsLoading(true);
    // Simulate claim process
    await new Promise(resolve => setTimeout(resolve, 2000));
    onClaim(selectedToken);
    setIsLoading(false);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold text-white">Testnet Faucet</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Connected Wallet Display */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <label className="block text-sm text-white/60 font-medium mb-3">
            Connected Wallet
          </label>
          {isConnected && address ? (
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <div className="font-medium text-white">{formatAddress(address)}</div>
                  <div className="text-xs text-green-400">Connected</div>
                </div>
              </div>
              <button className="p-2 text-white/60 hover:text-white transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-white/5 border border-red-500/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <div className="font-medium text-white">No Wallet Connected</div>
                  <div className="text-xs text-red-400">Please connect your wallet</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Token Selection */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <label className="block text-sm text-white/60 font-medium mb-3">
            Select Token
          </label>
          <button
            onClick={() => setShowTokenSelect(!showTokenSelect)}
            className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
          >
            {selectedTokenData ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={selectedTokenData.logo}
                    alt={selectedTokenData.symbol}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <div className="font-medium text-white">{selectedTokenData.symbol}</div>
                  <div className="text-xs text-white/60">{selectedTokenData.name}</div>
                </div>
              </div>
            ) : (
              <span className="text-white/60">Choose a token</span>
            )}
            <ChevronDown className="w-5 h-5 text-white/60" />
          </button>

          {/* Token Dropdown */}
          {showTokenSelect && (
            <div className="mt-2 space-y-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-2 max-h-60 overflow-y-auto">
              {Object.entries(faucetTokens).map(([symbol, token]) => (
                <button
                  key={symbol}
                  onClick={() => {
                    setSelectedToken(symbol);
                    setShowTokenSelect(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={token.logo}
                      alt={token.symbol}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">{token.symbol}</div>
                    <div className="text-xs text-white/60">{token.amount} {token.symbol}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Claim Information */}
        {selectedTokenData && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Droplets className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-white">Claim Details</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Amount:</span>
                <span className="text-white font-medium">
                  {selectedTokenData.amount} {selectedTokenData.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Network:</span>
                <span className="text-white">{selectedTokenData.network}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Cooldown:</span>
                <span className="text-white">{selectedTokenData.cooldown}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Status:</span>
                <span className={`font-medium ${
                  selectedToken && claimHistory.includes(selectedToken) 
                    ? "text-red-400" 
                    : "text-green-400"
                }`}>
                  {selectedToken && claimHistory.includes(selectedToken) ? "Claimed" : "Available"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Claim Button */}
        <button
          onClick={handleClaim}
          disabled={!canClaim || isLoading}
          className="w-full bg-white hover:bg-gray-200 disabled:bg-white/20 text-black disabled:text-white/60 font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <div className="flex items-center justify-center space-x-2">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                <span>Claiming...</span>
              </>
            ) : (
              <>
                <Droplets className="w-5 h-5" />
                <span>
                  {!isConnected 
                    ? "Connect Wallet First"
                    : !selectedToken 
                    ? "Select Token" 
                    : selectedToken && claimHistory.includes(selectedToken)
                    ? "Already Claimed"
                    : `Claim ${selectedTokenData?.amount} ${selectedToken}`
                  }
                </span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}