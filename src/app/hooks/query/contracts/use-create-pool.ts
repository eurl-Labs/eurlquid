import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { keccak256, encodePacked } from "viem";
import {
  usePool,
  POOL_TOKENS,
  DEX_AGGREGATORS,
  type TokenSymbol,
  type DexName,
} from "./use-pool";

export function useCreatePoolLogic() {
  const [selectedTokenA, setSelectedTokenA] = useState<TokenSymbol | null>(
    null
  );
  const [selectedTokenB, setSelectedTokenB] = useState<TokenSymbol | null>(
    null
  );
  const [selectedDex, setSelectedDex] = useState<DexName>("Uniswap");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedDex") as DexName | null;
      if (saved === ("1inch" as any)) {
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
  const [step, setStep] = useState<"approve" | "create" | "addLiquidity">(
    "approve"
  );
  const [approvedTokenA, setApprovedTokenA] = useState(false);
  const [approvedTokenB, setApprovedTokenB] = useState(false);
  const [openMenu, setOpenMenu] = useState<null | "dex" | "tokenA" | "tokenB">(
    null
  );
  const [poolId, setPoolId] = useState<`0x${string}` | null>(null);
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
    reset,
  } = usePool();
  const canProceed =
    !!selectedTokenA &&
    !!selectedTokenB &&
    selectedTokenA !== selectedTokenB &&
    !!amountA &&
    !!amountB &&
    !!selectedDex &&
    isConnected;
  const [approvalInProgress, setApprovalInProgress] = useState(false);
  const [approveTokenALoading, setApproveTokenALoading] = useState(false);
  const [approveTokenBLoading, setApproveTokenBLoading] = useState(false);
  const [poolCreationInProgress, setPoolCreationInProgress] = useState(false);
  const [poolCreatedSuccessfully, setPoolCreatedSuccessfully] = useState(false);
  const [createPoolTxHash, setCreatePoolTxHash] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔍 Checking step advancement...", {
      step,
      approvedTokenA,
      approvedTokenB,
      isSuccess,
      isLoading,
      approvalInProgress,
      poolCreationInProgress,
    });

    if (
      step === "approve" &&
      approvedTokenA &&
      approvedTokenB &&
      !approvalInProgress
    ) {
      // console.log("✅ Both tokens approved, advancing to create step");
      setStep("create");
    } else if (
      step === "create" &&
      isSuccess &&
      !isLoading &&
      poolCreationInProgress
    ) {
      // console.log(
      //   "✅ Pool created successfully, advancing to addLiquidity step"
      // );
      setStep("addLiquidity");
      setPoolCreationInProgress(false);
    }
  }, [
    step,
    approvedTokenA,
    approvedTokenB,
    isSuccess,
    isLoading,
    approvalInProgress,
    poolCreationInProgress,
  ]);

  useEffect(() => {
    console.log("🔍 Create Pool Success Detection Monitor:", {
      isSuccess,
      txHash,
      poolCreationInProgress,
      approveTokenALoading,
      approveTokenBLoading,
    });

    if (isSuccess && txHash && poolCreationInProgress) {
      // console.log("🎉 Create Pool Success Detected!");
      // console.log("   Transaction Hash:", txHash);

      setPoolCreationInProgress(false);
      setPoolCreatedSuccessfully(true);
      setCreatePoolTxHash(txHash);
      setTimeout(() => {
        setPoolCreatedSuccessfully(false);
      }, 5000);
    } else if (poolCreationInProgress && isError && !isLoading) {
      // console.log("❌ Pool creation transaction failed!");
      setPoolCreationInProgress(false);
      setPoolCreatedSuccessfully(false);
      setCreatePoolTxHash(null);
    }

    if (isSuccess && txHash && (approveTokenALoading || approveTokenBLoading)) {
      console.log(
        "✅ Token Approval Success Detected (not triggering pool creation success)"
      );
      // console.log("   Approval Transaction Hash:", txHash);
      // console.log("   Token A Loading:", approveTokenALoading);
      // console.log("   Token B Loading:", approveTokenBLoading);
    }
  }, [
    poolCreationInProgress,
    isSuccess,
    isLoading,
    isError,
    txHash,
    approveTokenALoading,
    approveTokenBLoading,
  ]);

  useEffect(() => {
    // console.log("🔄 Tokens or DEX changed, resetting approval status");
    setApprovedTokenA(false);
    setApprovedTokenB(false);
    setStep("approve");
    setApprovalInProgress(false);
    setPoolCreationInProgress(false);
    setPoolCreatedSuccessfully(false);
    reset();
  }, [selectedTokenA, selectedTokenB, selectedDex]);

  const computePoolId = useCallback(
    (tA: TokenSymbol, tB: TokenSymbol): `0x${string}` => {
      try {
        const aAddr = POOL_TOKENS[tA].address.toLowerCase();
        const bAddr = POOL_TOKENS[tB].address.toLowerCase();
        const [token0, token1] =
          aAddr < bAddr ? [aAddr, bAddr] : [bAddr, aAddr];

        const poolId = keccak256(
          encodePacked(
            ["address", "address"],
            [token0 as `0x${string}`, token1 as `0x${string}`]
          )
        );

        // console.log("Computed poolId:", poolId, "for tokens:", tA, tB);
        return poolId;
      } catch (error) {
        console.error("Error computing poolId:", error);
        return "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`;
      }
    },
    []
  );

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
        console.log("ESC pressed - closing menu");
        setOpenMenu(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    console.log("📊 State changed:", {
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
      isError,
    });
  }, [
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
    isError,
  ]);

  const toggleMenu = useCallback(
    (m: "dex" | "tokenA" | "tokenB") => {
      // console.log("toggleMenu called:", m, "current openMenu:", openMenu);
      setOpenMenu((prev) => {
        const newValue = prev === m ? null : m;
        // console.log("openMenu changing from", prev, "to", newValue);
        return newValue;
      });
    },
    [openMenu]
  );

  const handleDexSelection = useCallback((dexKey: DexName) => {
    // console.log("handleDexSelection called:", dexKey);
    // console.log("DEX_AGGREGATORS has key?", dexKey in DEX_AGGREGATORS);
    // console.log("Will hit contract address:", DEX_AGGREGATORS[dexKey]?.address);

    if (!(dexKey in DEX_AGGREGATORS)) {
      console.error("Invalid DEX key:", dexKey);
      return;
    }

    setSelectedDex(dexKey);
    localStorage.setItem("selectedDex", dexKey);
    setOpenMenu(null);
    // console.log(
    //   "DEX selection completed:",
    //   dexKey,
    //   "Contract Address:",
    //   DEX_AGGREGATORS[dexKey].address
    // );
  }, []);

  const handleTokenASelection = useCallback(
    (symbol: TokenSymbol) => {
      // console.log("handleTokenASelection called:", symbol);
      // console.log("POOL_TOKENS has key?", symbol in POOL_TOKENS);

      if (!(symbol in POOL_TOKENS)) {
        console.error("Invalid token symbol:", symbol);
        return;
      }

      setSelectedTokenA(symbol);
      if (selectedTokenB === symbol) {
        // console.log(
        //   "Auto-clearing selectedTokenB because it matches selectedTokenA"
        // );
        setSelectedTokenB(null);
      }
      setOpenMenu(null);
      // console.log("Token A selection completed:", symbol);
    },
    [selectedTokenB]
  );

  const handleTokenBSelection = useCallback(
    (symbol: TokenSymbol) => {
      // console.log("handleTokenBSelection called:", symbol);
      // console.log("POOL_TOKENS has key?", symbol in POOL_TOKENS);

      if (!(symbol in POOL_TOKENS)) {
        console.error("Invalid token symbol:", symbol);
        return;
      }

      setSelectedTokenB(symbol);
      if (selectedTokenA === symbol) {
        // console.log(
        //   "Auto-clearing selectedTokenA because it matches selectedTokenB"
        // );
        setSelectedTokenA(null);
      }
      setOpenMenu(null);
      // console.log("Token B selection completed:", symbol);
    },
    [selectedTokenA]
  );

  const handleApproveTokenA = async () => {
    if (!selectedTokenA || !amountA || !selectedDex) {
      console.error("❌ Cannot approve Token A - missing data");
      return;
    }
    setApproveTokenALoading(true);

    try {
      await approveToken(selectedTokenA, amountA, selectedDex);
      setApprovedTokenA(true);
      setTimeout(() => {
        reset();
      }, 500);
    } catch (e) {
      console.error("❌ Token A approval failed:", e);
    } finally {
      setApproveTokenALoading(false);
    }
  };

  const handleApproveTokenB = async () => {
    if (!selectedTokenB || !amountB || !selectedDex) {
      console.error("❌ Cannot approve Token B - missing data");
      return;
    }
    setApproveTokenBLoading(true);

    try {
      await approveToken(selectedTokenB, amountB, selectedDex);
      setApprovedTokenB(true);
      setTimeout(() => {
        reset();
      }, 500);
    } catch (e) {
      console.error("❌ Token B approval failed:", e);
    } finally {
      setApproveTokenBLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!canProceed || !selectedTokenA || !selectedTokenB || !selectedDex) {
      console.error("❌ Cannot proceed with approval - missing data");
      return;
    }

    reset();
    setApprovalInProgress(true);

    try {
      await approveToken(selectedTokenA, amountA, selectedDex);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setApprovedTokenA(true);
      reset();
      await approveToken(selectedTokenB, amountB, selectedDex);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setApprovedTokenB(true);
    } catch (e) {
      console.error("❌ Approve failed for DEX:", selectedDex, e);
      setApprovedTokenA(false);
      setApprovedTokenB(false);
    } finally {
      setApprovalInProgress(false);
    }
  };

  const handleCreatePool = async () => {
    if (!selectedTokenA || !selectedTokenB || !selectedDex) {
      console.error("❌ Cannot create pool - missing required data");
      return;
    }

    reset();
    setPoolCreationInProgress(true);

    try {
      await createPool(selectedTokenA, selectedTokenB, selectedDex);
    } catch (e) {
      console.error("❌ Create pool failed for DEX:", selectedDex, e);
      setPoolCreationInProgress(false);
      setPoolCreatedSuccessfully(false);
    }
  };

  const handleAddLiquidity = async () => {
    if (!selectedTokenA || !selectedTokenB || !poolId || !selectedDex) {
      console.error("❌ Cannot add liquidity - missing required data");
      return;
    }

    try {
      await addLiquidity(
        poolId,
        amountA,
        amountB,
        selectedTokenA,
        selectedTokenB,
        selectedDex
      );
    } catch (e) {
      console.error("❌ Add liquidity failed for DEX:", selectedDex, e);
    }
  };

  const stepAction = useCallback(() => {
    switch (step) {
      case "approve":
        // console.log("📝 Executing approve step...");
        return handleApprove();
      case "create":
        // console.log("🏗️  Executing create pool step...");
        return handleCreatePool();
      case "addLiquidity":
        // console.log("💰 Executing add liquidity step...");
        return handleAddLiquidity();
      default:
        console.error("❌ Unknown step:", step);
    }
  }, [step, selectedDex, handleApprove, handleCreatePool, handleAddLiquidity]);

  const stepLabel = (() => {
    const dexName = selectedDex ? DEX_AGGREGATORS[selectedDex].name : "DEX";

    switch (step) {
      case "approve":
        if (approvedTokenA && approvedTokenB) {
          return `✓ Tokens Approved for ${dexName}`;
        } else if (approvedTokenA || approvedTokenB) {
          return `Approve ${
            approvedTokenA ? "Second" : "First"
          } Token for ${dexName}`;
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

  // console.log("📋 Current state summary:", {
  //   selectedDex,
  //   contractAddress: selectedDex
  //     ? DEX_AGGREGATORS[selectedDex].address
  //     : "none",
  //   step,
  //   approvedTokenA,
  //   approvedTokenB,
  //   approvalInProgress,
  //   poolCreationInProgress,
  //   canProceed,
  //   isLoading,
  //   isSuccess,
  //   isError,
  //   stepLabel,
  //   tokenAddresses: {
  //     tokenA: selectedTokenA ? POOL_TOKENS[selectedTokenA].address : "none",
  //     tokenB: selectedTokenB ? POOL_TOKENS[selectedTokenB].address : "none",
  //   },
  // });

  return {
    selectedTokenA,
    selectedTokenB,
    selectedDex,
    amountA,
    amountB,
    step,
    openMenu,
    poolId,
    approvedTokenA,
    approvedTokenB,
    approvalInProgress,
    approveTokenALoading,
    approveTokenBLoading,
    poolCreationInProgress,
    poolCreatedSuccessfully,
    createPoolTxHash,
    canProceed,
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
    handleApproveTokenA,
    handleApproveTokenB,
    handleCreatePool,
    resetTransactionState: () => {
      setPoolCreationInProgress(false);
      setPoolCreatedSuccessfully(false);
      setApprovalInProgress(false);
      setApproveTokenALoading(false);
      setApproveTokenBLoading(false);
      setCreatePoolTxHash(null);
      reset();
    },
    resetAllState: () => {
      setApprovedTokenA(false);
      setApprovedTokenB(false);
      setPoolCreationInProgress(false);
      setPoolCreatedSuccessfully(false);
      setApprovalInProgress(false);
      setApproveTokenALoading(false);
      setApproveTokenBLoading(false);
      setCreatePoolTxHash(null);
      setStep("approve");
      reset();
    },
    isLoading,
    isSuccess,
    isError,
    error,
    txHash,
    isConnected,
  };
}
