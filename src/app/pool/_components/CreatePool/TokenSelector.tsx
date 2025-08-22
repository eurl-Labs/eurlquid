import Image from "next/image";
import { ChevronDown, Search, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  POOL_TOKENS,
  type TokenSymbol,
} from "../../../hooks/query/contracts/use-pool";

interface TokenSelectorProps {
  label: string;
  selectedToken: TokenSymbol | null;
  otherToken: TokenSymbol | null;
  amount: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (token: TokenSymbol) => void;
  onAmountChange: (amount: string) => void;
  zIndex: string;
}

export function TokenSelector({
  label,
  selectedToken,
  otherToken,
  amount,
  isOpen,
  onToggle,
  onSelect,
  onAmountChange,
  zIndex,
}: TokenSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // console.log('TokenSelector render:', {
  //   label,
  //   selectedToken,
  //   otherToken,
  //   isOpen,
  //   availableTokens: Object.keys(POOL_TOKENS)
  // });

  const filteredTokens = Object.entries(POOL_TOKENS).filter(
    ([symbol, token]) => {
      const matchesSearch =
        symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }
  );

  const handleTokenSelection = (tokenSymbol: TokenSymbol) => {
    onSelect(tokenSymbol);
    setSearchQuery("");
    onToggle();
  };

  return (
    <div className={`relative ${zIndex} mb-6`}>
      <label className="block text-sm text-white/60 font-medium mb-2">
        {label}
      </label>
      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Token toggle button clicked for:", label);
              onToggle();
            }}
            className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-colors cursor-pointer"
          >
            {selectedToken ? (
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <Image
                    src={POOL_TOKENS[selectedToken].logo}
                    alt={selectedToken}
                    width={24}
                    height={24}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="text-white font-medium">{selectedToken}</span>
              </div>
            ) : (
              <span className="text-white/60">Select token</span>
            )}
            <ChevronDown
              className={`w-5 h-5 text-white/60 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md mx-4 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="rounded-2xl border border-white/20 backdrop-blur-xl bg-black/90 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            Select Token
                          </h3>
                          <p className="text-xs text-white/60">
                            Choose a token for your pool
                          </p>
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

                    <div className="max-h-80 overflow-auto">
                      {filteredTokens.length === 0 ? (
                        <div className="p-6 text-center">
                          <div className="text-white/40 mb-2">
                            No tokens found
                          </div>
                          <div className="text-sm text-white/30">
                            Try adjusting your search
                          </div>
                        </div>
                      ) : (
                        <div className="p-2 space-y-1">
                          {filteredTokens.map(([symbol, token]) => {
                            const disabled = otherToken === symbol;
                            // console.log("Rendering token option:", symbol, {
                            //   disabled,
                            //   selected: selectedToken === symbol,
                            // });

                            return (
                              <button
                                key={symbol}
                                type="button"
                                disabled={disabled}
                                onClick={(e) => {
                                  if (disabled) return;
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // console.log(
                                  //   "Token option clicked:",
                                  //   symbol,
                                  //   token.name
                                  // );
                                  handleTokenSelection(symbol as TokenSymbol);
                                }}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left cursor-pointer ${
                                  disabled
                                    ? "opacity-40 cursor-not-allowed"
                                    : "hover:bg-white/10"
                                } ${
                                  selectedToken === symbol
                                    ? "bg-white/20 ring-2 ring-blue-400/40"
                                    : ""
                                }`}
                              >
                                <div className="flex items-center space-x-3 flex-1">
                                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30 flex-shrink-0">
                                    <Image
                                      src={token.logo}
                                      alt={symbol}
                                      width={40}
                                      height={40}
                                      className="object-cover w-full h-full"
                                      onError={(e) => {
                                        console.error(
                                          "Token logo failed:",
                                          token.logo
                                        );
                                        e.currentTarget.src =
                                          "/images/logoCoin/ethLogo.png";
                                      }}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-white font-medium text-base">
                                        {symbol}
                                      </span>
                                    </div>
                                    <div className="text-sm text-white/60 mt-0.5">
                                      {token.name}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {selectedToken === symbol && (
                                    <div className="flex items-center justify-end">
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
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1">
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.0"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/30 text-right outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
