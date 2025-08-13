import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { keccak256, encodePacked } from "viem";
import {
  usePool,
  POOL_TOKENS,
  DEX_AGGREGATORS,
  type TokenSymbol,
  type DexName
} from "./use-pool";

export function useCreatePoolLogic() {
  console.log('useCreatePoolLogic initialized');
  console.log('Available DEX_AGGREGATORS:', Object.keys(DEX_AGGREGATORS));
  console.log('Available POOL_TOKENS:', Object.keys(POOL_TOKENS));

  // ---------- State ----------
  const [selectedTokenA, setSelectedTokenA] = useState<TokenSymbol | null>(null);
  const [selectedTokenB, setSelectedTokenB] = useState<TokenSymbol | null>(null);
  const [selectedDex, setSelectedDex] = useState<DexName>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedDex") as DexName | null;
      console.log('Saved DEX from localStorage:', saved);
      console.log('Available DEX keys:', Object.keys(DEX_AGGREGATORS));
      
      // Handle old '1inch' key that was renamed to 'OneInch'
      if (saved === '1inch' as any) {
        console.log('Converting old 1inch key to OneInch');
        localStorage.setItem("selectedDex", "OneInch");
        return "OneInch";
      }
      
      if (saved && saved in DEX_AGGREGATORS) {
        console.log('Using saved DEX:', saved);
        return saved;
      }
    }
    console.log('Using default DEX: Uniswap');
    return "Uniswap";
  });
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [step, setStep] = useState<"approve" | "create" | "addLiquidity">("approve");
  const [openMenu, setOpenMenu] = useState<null | "dex" | "tokenA" | "tokenB">(null);
  const [poolId, setPoolId] = useState<`0x${string}` | null>(null);

  // ---------- Hooks ----------
  const { isConnected } = useAccount();
  const {
    createPool,
    addLiquidity,
    approveToken,
    isLoading,
    isSuccess,
    isError,
    error,
    txHash
  } = usePool();

  // ---------- Derived ----------
  const canProceed =
    !!selectedTokenA &&
    !!selectedTokenB &&
    selectedTokenA !== selectedTokenB &&
    !!amountA &&
    !!amountB &&
    isConnected;

  // ---------- Utils ----------
  const computePoolId = useCallback(
    (tA: TokenSymbol, tB: TokenSymbol, dex: DexName): `0x${string}` => {
      try {
        const aAddr = POOL_TOKENS[tA].address.toLowerCase();
        const bAddr = POOL_TOKENS[tB].address.toLowerCase();
        const dAddr = DEX_AGGREGATORS[dex].address.toLowerCase();
        const [token0, token1] = aAddr < bAddr ? [aAddr, bAddr] : [bAddr, aAddr];
        
        const poolId = keccak256(
          encodePacked(
            ["address", "address", "address"],
            [token0 as `0x${string}`, token1 as `0x${string}`, dAddr as `0x${string}`]
          )
        );
        
        console.log('Computed poolId:', poolId);
        return poolId;
      } catch (error) {
        console.error('Error computing poolId:', error);
        return "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`;
      }
    },
    []
  );

  // ---------- Effects ----------
  useEffect(() => {
    if (selectedTokenA && selectedTokenB) {
      const newPoolId = computePoolId(selectedTokenA, selectedTokenB, selectedDex);
      setPoolId(newPoolId);
    } else {
      setPoolId(null);
    }
  }, [selectedTokenA, selectedTokenB, selectedDex, computePoolId]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        console.log('ESC pressed - closing menu');
        setOpenMenu(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Log state changes
  useEffect(() => {
    console.log('State changed:', {
      selectedTokenA,
      selectedTokenB,
      selectedDex,
      openMenu,
      poolId
    });
  }, [selectedTokenA, selectedTokenB, selectedDex, openMenu, poolId]);

  // Dedicated useEffect for selectedDex changes
  useEffect(() => {
    console.log('selectedDex changed to:', selectedDex);
    console.log('DEX info:', selectedDex ? DEX_AGGREGATORS[selectedDex] : null);
  }, [selectedDex]);

  // ---------- Handlers ----------
  const toggleMenu = useCallback((m: "dex" | "tokenA" | "tokenB") => {
    console.log('toggleMenu called:', m, 'current openMenu:', openMenu);
    setOpenMenu(prev => {
      const newValue = prev === m ? null : m;
      console.log('openMenu changing from', prev, 'to', newValue);
      return newValue;
    });
  }, [openMenu]);

  const handleDexSelection = useCallback((dexKey: DexName) => {
    console.log('Hook - handleDexSelection called:', dexKey);
    console.log('Hook - DEX_AGGREGATORS has key?', dexKey in DEX_AGGREGATORS);
    console.log('Hook - Current selectedDex before change:', selectedDex);
    
    if (!(dexKey in DEX_AGGREGATORS)) {
      console.error('Hook - Invalid DEX key:', dexKey);
      return;
    }

    console.log('Hook - Setting selectedDex to:', dexKey);
    setSelectedDex(dexKey);
    localStorage.setItem("selectedDex", dexKey);
    setOpenMenu(null);
    console.log('Hook - DEX selection completed:', dexKey);
  }, [selectedDex]);

  const handleTokenASelection = useCallback((symbol: TokenSymbol) => {
    console.log('handleTokenASelection called:', symbol);
    console.log('POOL_TOKENS has key?', symbol in POOL_TOKENS);
    
    if (!(symbol in POOL_TOKENS)) {
      console.error('Invalid token symbol:', symbol);
      return;
    }

    setSelectedTokenA(symbol);
    if (selectedTokenB === symbol) {
      console.log('Auto-clearing selectedTokenB because it matches selectedTokenA');
      setSelectedTokenB(null);
    }
    setOpenMenu(null);
    console.log('Token A selection completed:', symbol);
  }, [selectedTokenB]);

  const handleTokenBSelection = useCallback((symbol: TokenSymbol) => {
    console.log('handleTokenBSelection called:', symbol);
    console.log('POOL_TOKENS has key?', symbol in POOL_TOKENS);
    
    if (!(symbol in POOL_TOKENS)) {
      console.error('Invalid token symbol:', symbol);
      return;
    }

    setSelectedTokenB(symbol);
    if (selectedTokenA === symbol) {
      console.log('Auto-clearing selectedTokenA because it matches selectedTokenB');
      setSelectedTokenA(null);
    }
    setOpenMenu(null);
    console.log('Token B selection completed:', symbol);
  }, [selectedTokenA]);

  const handleApprove = async () => {
    if (!canProceed || !selectedTokenA || !selectedTokenB) return;
    console.log('Starting approval process...');
    try {
      await approveToken(selectedTokenA, amountA, selectedDex);
      await approveToken(selectedTokenB, amountB, selectedDex);
      setStep("create");
      console.log('Approval completed, step set to create');
    } catch (e) {
      console.error("Approve failed", e);
    }
  };

  const handleCreatePool = async () => {
    if (!selectedTokenA || !selectedTokenB || !poolId) return;
    console.log('Starting pool creation...');
    try {
      await createPool(selectedTokenA, selectedTokenB, selectedDex);
      setStep("addLiquidity");
      console.log('Pool creation completed, step set to addLiquidity');
    } catch (e) {
      console.error("Create pool failed", e);
    }
  };

  const handleAddLiquidity = async () => {
    if (!selectedTokenA || !selectedTokenB || !poolId) return;
    console.log('Starting add liquidity...');
    try {
      await addLiquidity(
        poolId,
        amountA,
        amountB,
        selectedTokenA,
        selectedTokenB,
        selectedDex
      );
      console.log('Add liquidity completed');
    } catch (e) {
      console.error("Add liquidity failed", e);
    }
  };

  const stepAction =
    step === "approve"
      ? handleApprove
      : step === "create"
      ? handleCreatePool
      : handleAddLiquidity;

  const stepLabel =
    step === "approve"
      ? "Approve Tokens"
      : step === "create"
      ? "Create Pool"
      : "Add Liquidity";

  return {
    // State
    selectedTokenA,
    selectedTokenB,
    selectedDex,
    amountA,
    amountB,
    step,
    openMenu,
    poolId,
    
    // Derived
    canProceed,
    
    // Handlers
    toggleMenu,
    handleDexSelection,
    handleTokenASelection,
    handleTokenBSelection,
    setAmountA,
    setAmountB,
    setOpenMenu,
    stepAction,
    stepLabel,
    
    // Pool state
    isLoading,
    isSuccess,
    isError,
    error,
    txHash,
    isConnected
  };
}