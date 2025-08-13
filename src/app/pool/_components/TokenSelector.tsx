import Image from "next/image";
import { POOL_TOKENS, type TokenSymbol } from "../../hooks/query/contracts/use-pool";

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
  onSelect,
  onAmountChange
}: TokenSelectorProps) {
  
  const handleTokenSelection = (tokenSymbol: string) => {
    if (otherToken === tokenSymbol) {
      console.log('Token disabled - same as other token:', tokenSymbol);
      return;
    }
    console.log('Token selector - tab clicked:', tokenSymbol);
    onSelect(tokenSymbol as TokenSymbol);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm text-white/70 font-medium mb-3">
        {label}
      </label>
      
      <div className="space-y-4">
        {/* Token Selection Grid */}
        <div>
          <div className="text-xs text-white/50 mb-2">Choose Token:</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(POOL_TOKENS).map(([key, token]) => {
              const disabled = otherToken === key;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && handleTokenSelection(key)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                    disabled
                      ? "border-white/10 bg-white/5 opacity-50 cursor-not-allowed"
                      : selectedToken === key
                        ? "border-indigo-400 bg-indigo-400/10 ring-2 ring-indigo-400/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 flex-shrink-0">
                      <Image
                        src={token.logo}
                        alt={token.name}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = "/images/logo/default.png";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm truncate">
                        {key}
                      </div>
                      <div className="text-white/60 text-xs truncate">
                        {token.name}
                      </div>
                    </div>
                    {selectedToken === key && !disabled && (
                      <div className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <div className="text-xs text-white/50 mb-2">Amount:</div>
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.0"
            disabled={!selectedToken}
            className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/30 text-right text-lg outline-none focus:border-white/30 focus:bg-white/10 transition-colors ${
              !selectedToken ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>
      </div>
    </div>
  );
}