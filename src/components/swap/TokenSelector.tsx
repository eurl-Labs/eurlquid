"use client";

import { useState, Fragment, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react";
import Image from "next/image";
import { getTokenInfo } from "@/lib/token-mapping";
import { useTokenBalance } from "@/app/hooks/query/contracts/use-token-balance";
import { useAccount } from "wagmi";

// Available tokens for swap
const SWAP_TOKENS = [
  { symbol: "ETH", name: "Ethereum", address: "0x0e07bce15e5Ae4729eE24b6294Aef7bcB6c2a260", logo: "/images/logoCoin/ethLogo.png" },
  { symbol: "USDC", name: "USD Coin", address: "0x534dE6164d9314b44c8682Be8E41306A8a8cE2Ae", logo: "/images/logoCoin/usdcLogo.png" },
  { symbol: "USDT", name: "Tether USD", address: "0xEc3a35b973e9cb9e735123a6e4Ba1b3D237A9F7F", logo: "/images/logoCoin/usdtLogo.png" },
  { symbol: "WBTC", name: "Wrapped Bitcoin", address: "0xBBc467639fbEeDF5ec1eDFfC7Ed22b4666Cdd4bA", logo: "/images/logoCoin/wbtcLogo.png" },
  { symbol: "WSONIC", name: "Wrapped Sonic", address: "0x6e943f6BFb751512C68d7fB32dB4C3A51011656a", logo: "/images/logoCoin/sonicLogo.png" },
  { symbol: "PEPE", name: "Pepe", address: "0x6EB23CA35D4F467d0d2c326B1E23C8BFDF0688B4", logo: "/images/logoCoin/pepeLogo.png" },
  { symbol: "PENGU", name: "Pengu", address: "0x894a84F584D4b84697854Ba0a895Eb122e8791A9", logo: "/images/logoCoin/penguLogo.png" },
  { symbol: "DPENGU", name: "Dark Pengu", address: "0x7DE89E03157F4866Ff5A4F04d3297e88C54bbdb8", logo: "/images/logoCoin/darkPenguLogo.png" },
  { symbol: "GOONER", name: "Gooner", address: "0x92EeEd76021665B8D926069ecd9b5986c6c779fb", logo: "/images/logoCoin/goonerLogo.png" },
  { symbol: "ABSTER", name: "Abster", address: "0xa989FAf5595228A42C701590515152c2aE0eaC39", logo: "/images/logoCoin/absterLogo.jpg" },
  { symbol: "POLLY", name: "Polly", address: "0xFD9bd8cfc9f6326A1496f240E83ff6717f960E20", logo: "/images/logoCoin/pollyLogo.jpg" },
];

interface TokenSelectorProps {
  selectedToken: string;
  onTokenSelect: (token: string) => void;
  otherToken?: string; // Token selected in the other field (to disable it)
  label: string; // "From" or "To"
}

export function TokenSelector({ selectedToken, onTokenSelect, otherToken, label }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { address } = useAccount();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  // Ensure we're mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key to close modal and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Prevent background scroll when modal is open
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
      
      // Auto-focus search input when modal opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    } else {
      // Restore scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const selectedTokenData = SWAP_TOKENS.find(token => token.symbol === selectedToken);

  // Filter tokens based on search query
  const filteredTokens = SWAP_TOKENS.filter(token =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTokenSelect = (token: typeof SWAP_TOKENS[0]) => {
    onTokenSelect(token.symbol);
    setIsOpen(false);
    setSearchQuery("");
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    } else {
      return num.toFixed(4);
    }
  };

  return (
    <>
      {/* Token Selector Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center space-x-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg px-3 py-2 transition-all duration-200"
      >
        {selectedTokenData && (
          <div className="w-5 h-5 rounded-full overflow-hidden">
            <Image
              src={selectedTokenData.logo}
              alt={selectedTokenData.symbol}
              width={20}
              height={20}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <span className="text-sm text-white font-medium">
          {selectedToken}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3 h-3 text-white/60" />
        </motion.div>
      </motion.button>

      {/* Portal Modal - Rendered at document body level */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop - Covers entire viewport */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998]"
                style={{ 
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9998
                }}
              />

              {/* Modal Content - Perfectly centered on entire page */}
              <div 
                className="fixed inset-0 flex items-center justify-center p-4 z-[9999]"
                style={{ 
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem'
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 50 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.22, 1, 0.36, 1],
                    type: "spring",
                    damping: 25,
                    stiffness: 300
                  }}
                  className="w-full max-w-lg h-[90vh] max-h-[700px] bg-black/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  }}
                >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <Image
                      src="/images/logoCoin/sonicLogo.png"
                      alt="Sonic Network"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Select Token</h3>
                    <p className="text-sm text-white/60">Choose token for {label.toLowerCase()}</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Search */}
              <div className="p-6 border-b border-white/10">
                <div className="relative">
                  <Search className="w-5 h-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search tokens..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                  />
                </div>
              </div>

              {/* Token List - Improved scrolling */}
              <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
                {filteredTokens.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/60">No tokens found</p>
                    <p className="text-white/40 text-sm mt-1">Try searching with a different term</p>
                  </div>
                ) : (
                  <motion.div 
                    className="space-y-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {filteredTokens.map((token, index) => {
                      const isSelected = token.symbol === selectedToken;
                      const isDisabled = token.symbol === otherToken;
                      
                      return (
                        <motion.div
                          key={token.symbol}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                          <TokenListItem
                            token={token}
                            isSelected={isSelected}
                            isDisabled={isDisabled}
                            onSelect={() => !isDisabled && handleTokenSelect(token)}
                          />
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center justify-between text-white/60 text-sm">
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/images/logoCoin/sonicLogo.png"
                      alt="Sonic"
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                    <span>Powered by Sonic Network</span>
                  </div>
                  <span className="text-xs">
                    {filteredTokens.length} of {SWAP_TOKENS.length} tokens
                  </span>
                </div>
              </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

// Separate component for token list item to optimize re-renders
function TokenListItem({ 
  token, 
  isSelected, 
  isDisabled, 
  onSelect
}: {
  token: typeof SWAP_TOKENS[0];
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}) {
  // Convert display symbol to pool symbol for balance lookup
  const SWAP_TO_POOL_TOKEN: Record<string, string> = {
    "ETH": "WETH",
    "USDC": "USDC", 
    "USDT": "USDT",
    "WBTC": "WBTC",
    "WSONIC": "WSONIC",
    "PEPE": "PEPE",
    "PENGU": "PENGU",
    "DPENGU": "DARKPENGU",
    "GOONER": "GOONER",
    "ABSTER": "ABSTER",
    "POLLY": "POLLY",
  };
  
  const poolTokenSymbol = SWAP_TO_POOL_TOKEN[token.symbol];
  const { formattedBalance, isLoading } = useTokenBalance(poolTokenSymbol as any);

  return (
    <motion.button
      onClick={onSelect}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.01, backgroundColor: "rgba(255,255,255,0.15)" } : {}}
      whileTap={!isDisabled ? { scale: 0.99 } : {}}
      className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
        isSelected
          ? 'bg-blue-500/20 ring-2 ring-blue-400/60 shadow-lg shadow-blue-500/20'
          : isDisabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-white/10 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
              <Image
                src={token.logo}
                alt={token.symbol}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/logoCoin/ethLogo.png";
                }}
              />
            </div>
            {/* Network badge */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-black/20 overflow-hidden">
              <Image
                src="/images/logoCoin/sonicLogo.png"
                alt="Sonic"
                width={16}
                height={16}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-white">{token.symbol}</span>
              {isSelected && (
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
              )}
            </div>
            <p className="text-sm text-white/70">{token.name}</p>
            <p className="text-xs text-white/50">
              Sonic • {token.address.slice(0, 6)}...{token.address.slice(-4)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-white">
            {isLoading ? "Loading..." : formattedBalance ? formatBalance(formattedBalance) : "0.0000"}
          </p>
          <p className="text-xs text-white/60">{token.symbol}</p>
        </div>
      </div>
    </motion.button>
  );

  function formatBalance(balance: string) {
    const num = parseFloat(balance);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    } else {
      return num.toFixed(4);
    }
  }
}