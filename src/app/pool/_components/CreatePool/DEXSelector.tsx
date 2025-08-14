import Image from "next/image";
import { DEX_AGGREGATORS, type DexName } from "../../../hooks/query/contracts/use-pool";

interface DexSelectorProps {
  selectedDex: DexName;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (dex: DexName) => void;
}

export function DexSelector({ selectedDex, onSelect }: DexSelectorProps) {
  const handleDexSelection = (dexKey: string) => {
    console.log('DEX selector - tab clicked:', dexKey);
    onSelect(dexKey as DexName);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm text-white/70 font-medium mb-3">
        Select DEX Aggregator
      </label>
      
      {/* Horizontal Tab Layout */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(DEX_AGGREGATORS).map(([key, dex]) => (
          <button
            key={key}
            type="button"
            onClick={() => handleDexSelection(key)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              selectedDex === key
                ? "border-green-400 bg-green-400/10 ring-2 ring-green-400/20"
                : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 flex-shrink-0">
                <Image
                  src={dex.logo}
                  alt={dex.name}
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = "/images/logo/default.png";
                  }}
                />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="text-white font-medium text-sm truncate">
                  {dex.name}
                </div>
                <div className="text-white/60 text-xs truncate">
                  {dex.address.slice(0, 8)}...{dex.address.slice(-4)}
                </div>
              </div>
              {selectedDex === key && (
                <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}