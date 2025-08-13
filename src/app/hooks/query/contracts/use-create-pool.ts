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
  console.log('Available POOL_TOKENS:', Object.keys(POOL_TOKENS));
  console.log('Available DEX_AGGREGATORS:', Object.keys(DEX_AGGREGATORS));

  // ---------- State ----------
  const [selectedTokenA, setSelectedTokenA] = useState<TokenSymbol | null>(null);
  const [selectedTokenB, setSelectedTokenB] = useState<TokenSymbol | null>(null);
  const [selectedDex, setSelectedDex] = useState<DexName>("Uniswap");
  
  // Initialize selectedDex from localStorage on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedDex") as DexName | null;
      if (saved === '1inch' as any) {
        localStorage.setItem("selectedDex", "OneInch");
        setSelectedDex("OneInch");
        return;
      }
      if (saved && saved in DEX_AGGREGATORS) {
        setSelectedDex(saved);
      }
    }
  }, []);
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [step, setStep] = useState<"approve" | "create" | "addLiquidity">("approve");
  const [approvedTokenA, setApprovedTokenA] = useState(false);
  const [approvedTokenB, setApprovedTokenB] = useState(false);
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
    txHash,
    reset
  } = usePool();

  // ---------- Derived ----------
  const canProceed =
    !!selectedTokenA &&
    !!selectedTokenB &&
    selectedTokenA !== selectedTokenB &&
    !!amountA &&
    !!amountB &&
    !!selectedDex &&
    isConnected;

  // ✅ Fixed: Separate approval success tracking from pool creation success
  const [approvalInProgress, setApprovalInProgress] = useState(false);
  const [poolCreationInProgress, setPoolCreationInProgress] = useState(false);
  const [poolCreatedSuccessfully, setPoolCreatedSuccessfully] = useState(false);

  // ---------- Auto-advance step logic with better debugging ----------
  useEffect(() => {
    console.log('🔍 Checking step advancement...', {
      step,
      approvedTokenA,
      approvedTokenB,
      isSuccess,
      isLoading,
      approvalInProgress,
      poolCreationInProgress
    });

    // Step 1: Approve → Create (when both tokens approved)
    if (step === "approve" && approvedTokenA && approvedTokenB && !approvalInProgress) {
      console.log('✅ Both tokens approved, advancing to create step');
      setStep("create");
    } 
    // Step 2: Create → AddLiquidity (when pool created successfully)
    else if (step === "create" && isSuccess && !isLoading && poolCreationInProgress) {
      console.log('✅ Pool created successfully, advancing to addLiquidity step');
      setStep("addLiquidity");
      setPoolCreationInProgress(false);
    }
  }, [step, approvedTokenA, approvedTokenB, isSuccess, isLoading, approvalInProgress, poolCreationInProgress]);

  // Monitor transaction completion for pool creation
  useEffect(() => {
    if (poolCreationInProgress && isSuccess && !isLoading) {
      console.log('✅ Pool creation transaction confirmed!');
      setPoolCreationInProgress(false);
      setPoolCreatedSuccessfully(true);
      // Don't automatically advance to addLiquidity - let user see success state
    }
  }, [poolCreationInProgress, isSuccess, isLoading]);

  // Reset states when tokens or DEX change
  useEffect(() => {
    console.log('🔄 Tokens or DEX changed, resetting approval status');
    setApprovedTokenA(false);
    setApprovedTokenB(false);
    setStep("approve");
    setApprovalInProgress(false);
    setPoolCreationInProgress(false);
    setPoolCreatedSuccessfully(false);
    reset(); // Reset wagmi state
  }, [selectedTokenA, selectedTokenB, selectedDex]); // Remove reset from dependencies

  // ---------- Utils ---------- 
  const computePoolId = useCallback(
    (tA: TokenSymbol, tB: TokenSymbol): `0x${string}` => {
      try {
        const aAddr = POOL_TOKENS[tA].address.toLowerCase();
        const bAddr = POOL_TOKENS[tB].address.toLowerCase();
        const [token0, token1] = aAddr < bAddr ? [aAddr, bAddr] : [bAddr, aAddr];
        
        const poolId = keccak256(
          encodePacked(
            ["address", "address"],
            [token0 as `0x${string}`, token1 as `0x${string}`]
          )
        );
        
        console.log('Computed poolId:', poolId, 'for tokens:', tA, tB);
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
      const newPoolId = computePoolId(selectedTokenA, selectedTokenB);
      setPoolId(newPoolId);
    } else {
      setPoolId(null);
    }
  }, [selectedTokenA, selectedTokenB, computePoolId]);

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
    console.log('📊 State changed:', {
      selectedTokenA,
      selectedTokenB,
      selectedDex,
      openMenu,
      poolId,
      step,
      approvedTokenA,
      approvedTokenB,
      isLoading,
      isSuccess,
      isError
    });
  }, [selectedTokenA, selectedTokenB, selectedDex, openMenu, poolId, step, approvedTokenA, approvedTokenB, isLoading, isSuccess, isError]);

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
    console.log('handleDexSelection called:', dexKey);
    console.log('DEX_AGGREGATORS has key?', dexKey in DEX_AGGREGATORS);
    console.log('Will hit contract address:', DEX_AGGREGATORS[dexKey]?.address);
    
    if (!(dexKey in DEX_AGGREGATORS)) {
      console.error('Invalid DEX key:', dexKey);
      return;
    }
    
    setSelectedDex(dexKey);
    localStorage.setItem("selectedDex", dexKey);
    setOpenMenu(null);
    console.log('DEX selection completed:', dexKey, 'Contract Address:', DEX_AGGREGATORS[dexKey].address);
  }, []);

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

  // ✅ Fixed: Better approval handling with sequential approval
  const handleApprove = async () => {
    if (!canProceed || !selectedTokenA || !selectedTokenB || !selectedDex) {
      console.error('❌ Cannot proceed with approval - missing data');
      return;
    }
    
    console.log('🚀 Starting approval process...', {
      selectedTokenA,
      selectedTokenB,
      selectedDex,
      contractAddress: DEX_AGGREGATORS[selectedDex].address,
      amountA,
      amountB
    });

    // Reset state before starting
    reset();
    setApprovalInProgress(true);

    try {
      // Approve Token A
      console.log('📝 Approving Token A:', selectedTokenA, 'for DEX:', selectedDex);
      await approveToken(selectedTokenA, amountA, selectedDex);
      
      // Wait for approval to be confirmed
      console.log('⏳ Waiting for Token A approval confirmation...');
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApprovedTokenA(true);
      console.log('✅ Token A approved successfully');

      // Reset for next approval
      reset();
      
      // Approve Token B
      console.log('📝 Approving Token B:', selectedTokenB, 'for DEX:', selectedDex);
      await approveToken(selectedTokenB, amountB, selectedDex);
      
      // Wait for approval to be confirmed
      console.log('⏳ Waiting for Token B approval confirmation...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApprovedTokenB(true);
      console.log('✅ Token B approved successfully');

      console.log('🎉 All approvals completed for DEX:', selectedDex);
      
    } catch (e) {
      console.error('❌ Approve failed for DEX:', selectedDex, e);
      setApprovedTokenA(false);
      setApprovedTokenB(false);
    } finally {
      setApprovalInProgress(false);
    }
  };

  // ✅ Enhanced: createPool with better error handling and tracking
  const handleCreatePool = async () => {
    if (!selectedTokenA || !selectedTokenB || !selectedDex) {
      console.error('❌ Cannot create pool - missing required data');
      return;
    }
    
    console.log('🚀 Starting pool creation...', {
      selectedTokenA,
      selectedTokenB,
      selectedDex,
      tokenAAddress: POOL_TOKENS[selectedTokenA].address,
      tokenBAddress: POOL_TOKENS[selectedTokenB].address,
      contractAddress: DEX_AGGREGATORS[selectedDex].address
    });

    // Reset any previous transaction state first
    reset();
    setPoolCreationInProgress(true);

    try {
      console.log('📞 Calling createPool function...');
      
      // ✅ This should trigger the createPool function in use-pool.ts
      await createPool(selectedTokenA, selectedTokenB, selectedDex);
      
      console.log('✅ createPool call completed - waiting for transaction confirmation...');
      
    } catch (e) {
      console.error('❌ Create pool failed for DEX:', selectedDex, e);
      setPoolCreationInProgress(false);
    }
  };

  const handleAddLiquidity = async () => {
    if (!selectedTokenA || !selectedTokenB || !poolId || !selectedDex) {
      console.error('❌ Cannot add liquidity - missing required data');
      return;
    }
    
    console.log('🚀 Starting add liquidity...', {
      selectedDex,
      contractAddress: DEX_AGGREGATORS[selectedDex].address,
      poolId,
      amountA,
      amountB
    });

    try {
      await addLiquidity(
        poolId,
        amountA,
        amountB,
        selectedTokenA,
        selectedTokenB,
        selectedDex
      );
      console.log('✅ Add liquidity completed successfully for DEX:', selectedDex);
    } catch (e) {
      console.error('❌ Add liquidity failed for DEX:', selectedDex, e);
    }
  };

  const stepAction = useCallback(() => {
    console.log('🎯 Step action called, current step:', step, 'selectedDex:', selectedDex);
    
    switch (step) {
      case "approve":
        console.log('📝 Executing approve step...');
        return handleApprove();
      case "create":
        console.log('🏗️  Executing create pool step...');
        return handleCreatePool();
      case "addLiquidity":
        console.log('💰 Executing add liquidity step...');
        return handleAddLiquidity();
      default:
        console.error('❌ Unknown step:', step);
    }
  }, [step, selectedDex, handleApprove, handleCreatePool, handleAddLiquidity]);

  const stepLabel = (() => {
    const dexName = selectedDex ? DEX_AGGREGATORS[selectedDex].name : 'DEX';
    
    switch (step) {
      case "approve":
        if (approvedTokenA && approvedTokenB) {
          return `✓ Tokens Approved for ${dexName}`;
        } else if (approvedTokenA || approvedTokenB) {
          return `Approve ${approvedTokenA ? 'Second' : 'First'} Token for ${dexName}`;
        }
        return `Approve Tokens for ${dexName}`;
      case "create":
        return `Create Pool on ${dexName}`;
      case "addLiquidity":
        return `Add Liquidity to ${dexName}`;
      default:
        return "Unknown Step";
    }
  })();

  // ✅ Enhanced state summary with more debugging info
  console.log('📋 Current state summary:', {
    selectedDex,
    contractAddress: selectedDex ? DEX_AGGREGATORS[selectedDex].address : 'none',
    step,
    approvedTokenA,
    approvedTokenB,
    approvalInProgress,
    poolCreationInProgress,
    canProceed,
    isLoading,
    isSuccess,
    isError,
    stepLabel,
    tokenAddresses: {
      tokenA: selectedTokenA ? POOL_TOKENS[selectedTokenA].address : 'none',
      tokenB: selectedTokenB ? POOL_TOKENS[selectedTokenB].address : 'none'
    }
  });

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
    
    // Approval status
    approvedTokenA,
    approvedTokenB,
    approvalInProgress,
    poolCreationInProgress,
    poolCreatedSuccessfully,
    
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
    handleApprove,
    handleCreatePool,
    
    // Pool state
    isLoading,
    isSuccess,
    isError,
    error,
    txHash,
    isConnected
  };
}