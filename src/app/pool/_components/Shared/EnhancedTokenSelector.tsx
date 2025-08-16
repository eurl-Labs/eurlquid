import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Search, X } from "lucide-react";
import { POOL_TOKENS, type TokenSymbol } from "../../../hooks/query/contracts/use-pool";
import { useTokenBalance } from "../../../hooks/query/contracts/use-token-balance";
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedTokenSelectorProps {
  label: string;
  selectedToken: TokenSymbol | null;
  otherToken: TokenSymbol | null;
  amount: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (token: TokenSymbol) => void;
  onAmountChange: (amount: string) => void;
  disabled?: boolean;
}

export function EnhancedTokenSelector({
  label,
  selectedToken,
  otherToken,
  amount,
  isOpen,
  onToggle,
  onSelect,
  onAmountChange,
  disabled = false
}: EnhancedTokenSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get real balance for selected token
  const { formattedBalance, isLoading: balanceLoading } = useTokenBalance(selectedToken);

  // Component for getting real token balance in the list
  const TokenBalanceDisplay = ({ tokenSymbol }: { tokenSymbol: string }) => {
    const { formattedBalance, isLoading } = useTokenBalance(tokenSymbol as TokenSymbol);
    
    if (isLoading) return <span className="text-white/40 text-xs">Loading...</span>;
    
    const num = parseFloat(formattedBalance);
    let displayBalance = "0.00";
    
    if (num === 0) {
      displayBalance = "0.00";
    } else if (num > 1000000) {
      displayBalance = (num / 1000000).toFixed(2) + "M";
    } else if (num > 1000) {
      displayBalance = (num / 1000).toFixed(2) + "K";
    } else if (num < 0.01) {
      displayBalance = num.toExponential(2);
    } else {
      displayBalance = num.toFixed(4);
    }
    
    return (
      <div className="text-right">
        <div className="text-white font-medium text-sm">
          {displayBalance}
        </div>
        <div className="text-xs text-white/60">Balance</div>
      </div>
    );
  };

  // Filter tokens based on search using real POOL_TOKENS data
  const filteredTokens = Object.entries(POOL_TOKENS).filter(([symbol, token]) => {
    const matchesSearch = symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         token.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const handleTokenSelection = (tokenSymbol: TokenSymbol) => {
    onSelect(tokenSymbol);
    setSearchQuery("");
    // Don't call onToggle() here since the parent already handles closing via setOpenMenu(null)
  };

  const formatTokenName = (name: string) => {
    // Handle long token names
    if (name.length > 20) {
      return name.substring(0, 20) + "...";
    }
    return name;
  };

  return (
    <div className="relative mb-6">
      <label className="block text-sm text-white/70 font-medium mb-3">
        {label}
      </label>
      
      <div className="flex space-x-3">
        {/* Token Selection */}
        <div className="flex-1 relative">
          <button
            type="button"
            disabled={disabled}
            onClick={(e) => {
              if (disabled) return;
              e.preventDefault();
              e.stopPropagation();
              onToggle();
            }}
            className={`w-full flex items-center justify-between p-4 border rounded-xl transition-colors ${
              disabled 
                ? "bg-white/5 border-white/10 cursor-not-allowed opacity-60"
                : "bg-white/10 hover:bg-white/15 border-white/20 cursor-pointer"
            }`}
          >
            {selectedToken ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 flex-shrink-0">
                  <Image
                    src={POOL_TOKENS[selectedToken]?.logo || "/images/logoCoin/ethLogo.png"}
                    alt={selectedToken}
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.currentTarget.src = "/images/logoCoin/ethLogo.png";
                    }}
                  />
                </div>
                <div className="text-left">
                  <span className="text-white font-medium block">
                    {selectedToken}
                  </span>
                  {/* <span className="text-white/60 text-xs block">
                    {formatTokenName(POOL_TOKENS[selectedToken]?.name || "")}
                  </span> */}
                </div>
              </div>
            ) : (
              <span className="text-white/60">Select token</span>
            )}
            {!disabled && (
              <ChevronDown
                className={`w-5 h-5 text-white/70 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            )}
            {disabled && (
              <span className="text-xs text-white/40 bg-white/10 px-2 py-1 rounded">
                Fixed
              </span>
            )}
          </button>

          {/* Enhanced Token Dropdown - Centered Modal */}
          <AnimatePresence>
            {isOpen && !disabled && (
              <>
                {/* Modal Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9997]"
                  onClick={onToggle}
                />
                
                {/* Modal Content */}
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90vw] max-w-[420px] max-h-[80vh]"
                >
                  <div className="rounded-2xl border border-white/20 backdrop-blur-xl bg-black/95 overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                          <Image
                            src="/images/logoCoin/sonicLogo.png"
                            alt="Sonic Network"
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/images/logoCoin/ethLogo.png";
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Select Token</h3>
                          <p className="text-xs text-white/60">Sonic Network</p>
                        </div>
                      </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggle();
                      }}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5 text-white/70" />
                    </button>
                  </div>

                  {/* Search */}
                  <div className="p-4 border-b border-white/10">
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tokens..."
                        className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/40 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Token List */}
                  <div className="max-h-80 overflow-auto">
                    {filteredTokens.length === 0 ? (
                      <div className="p-6 text-center">
                        <div className="text-white/40 mb-2">No tokens found</div>
                        <div className="text-sm text-white/30">Try adjusting your search</div>
                      </div>
                    ) : (
                      <div className="p-2 space-y-1">
                        {filteredTokens.map(([symbol, token]) => {
                          const isDisabled = otherToken === symbol;
                          
                          return (
                            <button
                              key={symbol}
                              disabled={isDisabled}
                              onClick={(e) => {
                                if (isDisabled) return;
                                e.preventDefault();
                                e.stopPropagation();
                                handleTokenSelection(symbol as TokenSymbol);
                              }}
                              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${
                                isDisabled
                                  ? "opacity-40 cursor-not-allowed"
                                  : "hover:bg-white/10 cursor-pointer"
                              } ${
                                selectedToken === symbol ? "bg-white/20 ring-2 ring-blue-400/40" : ""
                              }`}
                            >
                              <div className="flex items-center space-x-3 flex-1">
                                <div className="relative">
                                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30 flex-shrink-0">
                                    <Image
                                      src={token.logo}
                                      alt={symbol}
                                      width={40}
                                      height={40}
                                      className="object-cover w-full h-full"
                                      onError={(e) => {
                                        e.currentTarget.src = "/images/logoCoin/ethLogo.png";
                                      }}
                                    />
                                  </div>
                                  {/* Sonic Network Badge */}
                                  <div className="w-4 h-4 rounded-full overflow-hidden border border-white/30 absolute -bottom-1 -right-1 bg-gray-900">
                                    <Image
                                      src="/images/logoCoin/sonicLogo.png"
                                      alt="Sonic"
                                      width={16}
                                      height={16}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = "/images/logoCoin/ethLogo.png";
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-white font-medium text-base">{symbol}</span>
                                    <span className="text-sm text-white/60">{formatTokenName(token.name)}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 mt-0.5">
                                    <span className="text-xs text-white/50">Sonic Network</span>
                                    <span className="text-xs text-white/40">
                                      {token.address.slice(0, 6)}...{token.address.slice(-4)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <TokenBalanceDisplay tokenSymbol={symbol} />
                                {selectedToken === symbol && (
                                  <div className="flex items-center justify-end mt-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Footer Info */}
                  <div className="p-4 border-t border-white/10 bg-white/5">
                    <div className="flex items-center justify-center space-x-2 text-xs text-white/60">
                      <div className="w-4 h-4 rounded-full overflow-hidden">
                        <Image
                          src="/images/logoCoin/sonicLogo.png"
                          alt="Sonic"
                          width={16}
                          height={16}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>Powered by Sonic Network</span>
                    </div>
                  </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Amount Input */}
        <div className="flex-1">
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.0"
            className="w-full h-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/30 text-right outline-none focus:border-white/30 transition-colors [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
          />
        </div>
      </div>

      {/* Balance Display */}
      {selectedToken && (
        <div className="flex justify-between items-center mt-2 px-1">
          <span className="text-xs text-white/60">
            Available Balance:
          </span>
          <div className="flex items-center space-x-2">
            {balanceLoading ? (
              <span className="text-xs text-white/40">Loading...</span>
            ) : (
              <span className="text-xs text-white font-medium">
                {parseFloat(formattedBalance) > 0 ? parseFloat(formattedBalance).toFixed(4) : "0.00"} {selectedToken}
              </span>
            )}
            <button
              onClick={() => {
                if (parseFloat(formattedBalance) > 0) {
                  onAmountChange(formattedBalance);
                }
              }}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              MAX
            </button>
          </div>
        </div>
      )}
    </div>
  );
}