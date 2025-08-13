import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { POOL_TOKENS, type TokenSymbol } from "../../../hooks/query/contracts/use-pool";

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
  zIndex
}: TokenSelectorProps) {
  console.log('TokenSelector render:', { 
    label, 
    selectedToken, 
    otherToken, 
    isOpen, 
    availableTokens: Object.keys(POOL_TOKENS) 
  });

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
              console.log('Token toggle button clicked for:', label);
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
                <span className="text-white font-medium">
                  {selectedToken}
                </span>
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

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-[1200] shadow-2xl">
              <div className="rounded-xl border border-white/20 backdrop-blur-md bg-white/20 p-2 max-h-64 overflow-auto">
                {Object.entries(POOL_TOKENS).map(([symbol, token]) => {
                  const disabled = otherToken === symbol;
                  console.log('Rendering token option:', symbol, { disabled, selected: selectedToken === symbol });
                  
                  return (
                    <button
                      key={symbol}
                      type="button"
                      disabled={disabled}
                      onClick={(e) => {
                        if (disabled) return;
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Token option clicked:', symbol, token.name);
                        onSelect(symbol as TokenSymbol);
                      }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors cursor-pointer ${
                        disabled
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-white/25"
                      } ${
                        selectedToken === symbol ? "bg-white/25 ring-2 ring-indigo-400/40" : ""
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={token.logo}
                          alt={symbol}
                          width={24}
                          height={24}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            console.error('Token logo failed:', token.logo);
                            e.currentTarget.src = "/images/logo/default.png";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-white font-medium block truncate">
                          {symbol}
                        </span>
                        <span className="text-[10px] text-white/60 block truncate">
                          {token.name}
                        </span>
                      </div>
                      {selectedToken === symbol && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                          <span className="text-xs text-indigo-400 font-medium">Selected</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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