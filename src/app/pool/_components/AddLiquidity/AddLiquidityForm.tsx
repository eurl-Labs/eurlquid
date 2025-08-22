"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, ArrowLeft, Settings, Droplets } from "lucide-react";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import {
  POOL_TOKENS,
  type TokenSymbol,
  DEX_AGGREGATORS,
  type DexName,
  usePool,
} from "../../../hooks/query/contracts/use-pool";
import { TokenSelector } from "./TokenSelectorLiquidity";
import { motion } from "framer-motion";
import { DexSelector } from "../CreatePool/DEXSelector";
import { keccak256, encodePacked } from "viem";
import {
  PoolTransactionModal,
  type PoolTransactionStep,
} from "../../../../components/ui/PoolTransactionModal";

interface AddLiquidityFormProps {
  existingPool?: {
    id: string;
    token0: string;
    token1: string;
    fee: number;
    tvl: string;
    volume24h: string;
    apr: string;
    userLiquidity: string;
    isActive: boolean;
  };
  onBack?: () => void;
}

export function AddLiquidityForm({
  existingPool,
  onBack,
}: AddLiquidityFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<PoolTransactionStep>(
    "approve-first-token"
  );

  const [selectedTokenA, setSelectedTokenA] = useState<TokenSymbol | null>(
    (existingPool?.token0 as TokenSymbol) || null
  );
  const [selectedTokenB, setSelectedTokenB] = useState<TokenSymbol | null>(
    (existingPool?.token1 as TokenSymbol) || null
  );
  const [selectedDex, setSelectedDex] = useState<DexName>("Uniswap");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [deadline, setDeadline] = useState("20");
  const [showSettings, setShowSettings] = useState(false);
  const [openTokenSelect, setOpenTokenSelect] = useState<"A" | "B" | null>(
    null
  );
  const [openDexSelect, setOpenDexSelect] = useState(false);
  const [approvedTokenA, setApprovedTokenA] = useState(false);
  const [approvedTokenB, setApprovedTokenB] = useState(false);

  const { isConnected } = useAccount();
  const {
    addLiquidity,
    approveToken,
    getPoolId,
    createPool,
    isLoading,
    isSuccess,
    isError,
    error,
    txHash,
    reset,
  } = usePool();
  const [approveTokenALoading, setApproveTokenALoading] = useState(false);
  const [approveTokenBLoading, setApproveTokenBLoading] = useState(false);
  const [addLiquidityLoading, setAddLiquidityLoading] = useState(false);
  const [addLiquiditySuccess, setAddLiquiditySuccess] = useState(false);
  const [addLiquidityTxHash, setAddLiquidityTxHash] = useState<string | null>(
    null
  );
  const poolRatios = {
    "WBTC/USDT": { reserveA: "5.25", reserveB: "245678.50" },
    "WETH/USDC": { reserveA: "150.25", reserveB: "485623.75" },
    "PEPE/USDT": { reserveA: "1250000", reserveB: "15623.45" },
    "WSONIC/PENGU": { reserveA: "85000", reserveB: "125000" },
    "WETH/WSONIC": { reserveA: "125.5", reserveB: "85420.25" },
    "WSONIC/PEPE": { reserveA: "65000", reserveB: "890000" },
  };

  const currentPoolRatio = existingPool
    ? poolRatios[
        `${existingPool.token0}/${existingPool.token1}` as keyof typeof poolRatios
      ]
    : null;

  const handleAmountAChange = (value: string) => {
    setAmountA(value);
    if (value && currentPoolRatio) {
      const ratio =
        parseFloat(currentPoolRatio.reserveB) /
        parseFloat(currentPoolRatio.reserveA);
      const estimatedB = (parseFloat(value) * ratio).toFixed(6);
      setAmountB(estimatedB);
    }
  };

  const handleAmountBChange = (value: string) => {
    setAmountB(value);
    if (value && currentPoolRatio) {
      const ratio =
        parseFloat(currentPoolRatio.reserveA) /
        parseFloat(currentPoolRatio.reserveB);
      const estimatedA = (parseFloat(value) * ratio).toFixed(6);
      setAmountA(estimatedA);
    }
  };

  // const computePoolId = (
  //   tokenA: TokenSymbol,
  //   tokenB: TokenSymbol
  // ): `0x${string}` => {
  //   try {
  //     const aAddr = POOL_TOKENS[tokenA].address.toLowerCase();
  //     const bAddr = POOL_TOKENS[tokenB].address.toLowerCase();
  //     const [token0, token1] = aAddr < bAddr ? [aAddr, bAddr] : [bAddr, aAddr];

  //     const poolId = keccak256(
  //       encodePacked(
  //         ["address", "address"],
  //         [token0 as `0x${string}`, token1 as `0x${string}`]
  //       )
  //     );

  //     return poolId;
  //   } catch (error) {
  //     console.error("Error computing poolId:", error);
  //     return "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`;
  //   }
  // };

  const handleApproveTokenA = async () => {
    if (!selectedTokenA || !amountA || !selectedDex) {
      console.error("Missing data for token A approval");
      return;
    }

    try {
      setApproveTokenALoading(true);
      console.log(
        "Approving Token A:",
        selectedTokenA,
        "Amount:",
        amountA,
        "DEX:",
        selectedDex
      );

      await approveToken(selectedTokenA, amountA, selectedDex);
      setApprovedTokenA(true);
      setTimeout(() => {
        reset();
        console.log("🔄 Hook state reset after Token A approval");
      }, 500);
      if (isModalOpen) {
        setTimeout(() => {
          setModalStep("approve-second-token");
        }, 1000);
      }
    } catch (err) {
      console.error("Token A approval failed:", err);
    } finally {
      setApproveTokenALoading(false);
    }
  };

  const handleApproveTokenB = async () => {
    if (!selectedTokenB || !amountB || !selectedDex) {
      console.error("Missing data for token B approval");
      return;
    }

    try {
      setApproveTokenBLoading(true);
      console.log(
        "Approving Token B:",
        selectedTokenB,
        "Amount:",
        amountB,
        "DEX:",
        selectedDex
      );

      await approveToken(selectedTokenB, amountB, selectedDex);
      setApprovedTokenB(true);
      setTimeout(() => {
        reset();
        console.log("🔄 Hook state reset after Token B approval");
      }, 500);

      if (isModalOpen) {
        setTimeout(() => {
          setModalStep("add-liquidity");
        }, 1000);
      }
    } catch (err) {
      console.error("Token B approval failed:", err);
    } finally {
      setApproveTokenBLoading(false);
    }
  };

  const handleModalApproveFirst = () => {
    handleApproveTokenA();
  };

  const handleModalApproveSecond = () => {
    handleApproveTokenB();
  };

  const handleModalAddLiquidity = async () => {
    try {
      await handleAddLiquidity();
    } catch (err) {
      console.error("Modal add liquidity failed:", err);
    }
  };

  const handleModalClose = () => {
    console.log("🚪 Modal closing...");
    setIsModalOpen(false);
    setModalStep("approve-first-token");

    setAddLiquiditySuccess(false);
    setAddLiquidityTxHash(null);
    setAddLiquidityLoading(false);
    if (isError || isSuccess) {
      reset();
    }
  };

  const handleApproveWithModal = () => {
    setIsModalOpen(true);
    if (!approvedTokenA) {
      setModalStep("approve-first-token");
    } else if (!approvedTokenB) {
      setModalStep("approve-second-token");
    }
  };

  // const handleAddLiquidityWithModal = () => {
  //   setIsModalOpen(true);
  //   setModalStep("add-liquidity");
  // };

  const validateTransaction = async () => {
    try {
      if (existingPool?.id) {
        return existingPool.id;
      }
      const contractPoolId = await getPoolId(
        selectedTokenA!,
        selectedTokenB!,
        selectedDex
      );

      if (!contractPoolId) {
        const shouldCreate = window.confirm(
          `Pool for ${selectedTokenA}/${selectedTokenB} does not exist. Do you want to create it first?`
        );

        if (shouldCreate) {
          await createPool(selectedTokenA!, selectedTokenB!, selectedDex);
          const newPoolId = await getPoolId(
            selectedTokenA!,
            selectedTokenB!,
            selectedDex
          );
          if (!newPoolId) {
            throw new Error("Failed to get pool ID after creating pool");
          }
          return newPoolId;
        } else {
          throw new Error("Pool creation cancelled by user");
        }
      }

      if (!contractPoolId.startsWith("0x") || contractPoolId.length !== 66) {
        throw new Error(`Invalid pool ID format: ${contractPoolId}`);
      }

      return contractPoolId;
    } catch (error) {
      console.error("❌ Validation failed:", error);
      throw error;
    }
  };

  const handleAddLiquidity = async () => {
    if (
      !selectedTokenA ||
      !selectedTokenB ||
      !amountA ||
      !amountB ||
      !selectedDex
    ) {
      console.error("Missing required data for add liquidity");
      return;
    }

    if (!approvedTokenA || !approvedTokenB) {
      console.error("Tokens must be approved before adding liquidity");
      return;
    }

    try {
      setAddLiquidityLoading(true);
      setAddLiquiditySuccess(false);
      setAddLiquidityTxHash(null);

      const validatedPoolId = await validateTransaction();
      const tokenAInfo = POOL_TOKENS[selectedTokenA];
      const tokenBInfo = POOL_TOKENS[selectedTokenB];
      const dexInfo = DEX_AGGREGATORS[selectedDex];

      await addLiquidity(
        validatedPoolId,
        amountA,
        amountB,
        selectedTokenA,
        selectedTokenB,
        selectedDex
      );
    } catch (err) {
      console.error("❌ Add liquidity failed:", err);
      console.error("Error details:", {
        message: (err as any)?.message,
        code: (err as any)?.code,
        data: (err as any)?.data,
        cause: (err as any)?.cause,
      });
      setAddLiquiditySuccess(false);
      setAddLiquidityLoading(false);
    }
  };

  useEffect(() => {
    if (!existingPool) {
      setApprovedTokenA(false);
      setApprovedTokenB(false);
      setAddLiquiditySuccess(false);
      setAddLiquidityTxHash(null);
    }
  }, [selectedTokenA, selectedTokenB, selectedDex, existingPool]);

  useEffect(() => {
    // console.log("🔍 Success Detection Monitor:", {
    //   isSuccess,
    //   txHash,
    //   addLiquidityLoading,
    //   isModalOpen,
    //   modalStep,
    //   currentTxHash: addLiquidityTxHash,
    //   approveTokenALoading,
    //   approveTokenBLoading,
    // });

    if (isSuccess && txHash) {
      const isAddLiquiditySuccess =
        modalStep === "add-liquidity" || addLiquidityLoading;

      if (isAddLiquiditySuccess) {
        // console.log("🎉 Add Liquidity Success Detected!");
        // console.log("   Transaction Hash:", txHash);
        // console.log("   Current Modal State:", { isModalOpen, modalStep });
        // console.log("   Detection Criteria:", {
        //   modalStep,
        //   addLiquidityLoading,
        // });

        setAddLiquiditySuccess(true);
        setAddLiquidityTxHash(txHash);
        setAddLiquidityLoading(false);

        if (isModalOpen) {
          if (modalStep === "add-liquidity") {
            const timer = setTimeout(() => {
              setModalStep("success");
            }, 1500);

            return () => clearTimeout(timer);
          } else {
            setModalStep("success");
            setIsModalOpen(true);
          }
        } else {
          setModalStep("success");
          setIsModalOpen(true);
        }
      } else {
        // console.log(
        //   "✅ Token Approval Success Detected (not triggering success modal)"
        // );
        // console.log("   Approval Transaction Hash:", txHash);
        // console.log("   Current Modal Step:", modalStep);
        // console.log("   Token A Loading:", approveTokenALoading);
        // console.log("   Token B Loading:", approveTokenBLoading);
      }
    }
  }, [
    isSuccess,
    txHash,
    addLiquidityLoading,
    isModalOpen,
    modalStep,
    approveTokenALoading,
    approveTokenBLoading,
  ]);

  useEffect(() => {
    if (isSuccess && txHash && !addLiquidityLoading && !addLiquiditySuccess) {
      if (isModalOpen && modalStep === "add-liquidity") {
        setAddLiquiditySuccess(true);
        setAddLiquidityTxHash(txHash);
        setTimeout(() => {
          setModalStep("success");
        }, 1000);
      }
    }
  }, [
    isSuccess,
    txHash,
    addLiquidityLoading,
    addLiquiditySuccess,
    isModalOpen,
    modalStep,
  ]);

  useEffect(() => {
    let fallbackTimer: NodeJS.Timeout;

    if (isModalOpen && modalStep === "add-liquidity" && isSuccess && txHash) {
      fallbackTimer = setTimeout(() => {
        if (!addLiquiditySuccess && modalStep === "add-liquidity") {
          setAddLiquiditySuccess(true);
          setAddLiquidityTxHash(txHash);
          setAddLiquidityLoading(false);
          setModalStep("success");
        }
      }, 3000);
    }

    return () => {
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
      }
    };
  }, [isModalOpen, modalStep, isSuccess, txHash, addLiquiditySuccess]);

  useEffect(() => {
    if (addLiquidityTxHash) {
      // console.log("🔍 addLiquidityTxHash updated:", addLiquidityTxHash);
      // console.log("   Modal Step:", modalStep);
      // console.log("   Modal Open:", isModalOpen);
    }
  }, [addLiquidityTxHash, modalStep, isModalOpen]);

  useEffect(() => {
    if (isError && addLiquidityLoading) {
      setAddLiquidityLoading(false);
    }
  }, [isError, addLiquidityLoading]);

  useEffect(() => {
    if (!isModalOpen && (addLiquiditySuccess || isError)) {
      const timer = setTimeout(() => {
        setAddLiquiditySuccess(false);
        setAddLiquidityTxHash(null);
        setAddLiquidityLoading(false);
        reset();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isModalOpen, addLiquiditySuccess, isError, reset]);

  const canProceed =
    selectedTokenA && selectedTokenB && amountA && amountB && isConnected;
  const canAddLiquidity =
    canProceed && (existingPool || (approvedTokenA && approvedTokenB));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <div className="flex items-center space-x-3">
            <Droplets className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">
              {existingPool
                ? `Add to ${existingPool.token0}/${existingPool.token1}`
                : "Add Liquidity"}
            </h2>
          </div>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 space-y-4"
        >
          <h3 className="text-white font-medium flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Transaction Settings</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Slippage Tolerance
              </label>
              <div className="flex space-x-2">
                {["0.1", "0.5", "1.0"].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSlippage(value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      slippage === value
                        ? "bg-white text-black"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">
                Deadline (minutes)
              </label>
              <input
                type="number"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="20"
              />
            </div>
          </div>
        </motion.div>
      )}

      {existingPool && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                  <Image
                    src={
                      POOL_TOKENS[
                        existingPool.token0 as keyof typeof POOL_TOKENS
                      ]?.logo || "/images/logoCoin/ethereum.png"
                    }
                    alt={existingPool.token0}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 absolute -bottom-1 -right-2 bg-black">
                  <Image
                    src={
                      POOL_TOKENS[
                        existingPool.token1 as keyof typeof POOL_TOKENS
                      ]?.logo || "/images/logoCoin/ethereum.png"
                    }
                    alt={existingPool.token1}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium text-lg">
                    {existingPool.token0}/{existingPool.token1}
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded text-white/80">
                    {existingPool.fee}%
                  </span>
                </div>
                <div className="text-white/60 text-sm">
                  Pool ID:{" "}
                  {`${existingPool.id.slice(0, 8)}...${existingPool.id.slice(
                    -6
                  )}`}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-white/60 mb-1">TVL</div>
              <div className="text-white font-medium">{existingPool.tvl}</div>
            </div>
            <div className="text-center">
              <div className="text-white/60 mb-1">24h Volume</div>
              <div className="text-white font-medium">
                {existingPool.volume24h}
              </div>
            </div>
            <div className="text-center">
              <div className="text-white/60 mb-1">APR</div>
              <div className="text-green-400 font-medium">
                {existingPool.apr}
              </div>
            </div>
            <div className="text-center">
              <div className="text-white/60 mb-1">My Position</div>
              <div className="text-white font-medium">
                {existingPool.userLiquidity}
              </div>
            </div>
          </div>
        </div>
      )}

      {!existingPool && (
        <div className="mb-6">
          <DexSelector
            selectedDex={selectedDex}
            isOpen={openDexSelect}
            onToggle={() => setOpenDexSelect(!openDexSelect)}
            onSelect={(dex) => {
              setSelectedDex(dex);
              setOpenDexSelect(false);
            }}
          />
        </div>
      )}

      <div className="space-y-4">
        <TokenSelector
          label="First Token"
          selectedToken={selectedTokenA}
          otherToken={selectedTokenB}
          amount={amountA}
          isOpen={openTokenSelect === "A"}
          onToggle={() =>
            setOpenTokenSelect(openTokenSelect === "A" ? null : "A")
          }
          onSelect={setSelectedTokenA}
          onAmountChange={handleAmountAChange}
          zIndex="z-20"
          disabled={!!existingPool}
        />

        <div className="flex justify-center">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
            <Plus className="w-5 h-5 text-white" />
          </div>
        </div>

        <TokenSelector
          label="Second Token"
          selectedToken={selectedTokenB}
          otherToken={selectedTokenA}
          amount={amountB}
          isOpen={openTokenSelect === "B"}
          onToggle={() =>
            setOpenTokenSelect(openTokenSelect === "B" ? null : "B")
          }
          onSelect={setSelectedTokenB}
          onAmountChange={handleAmountBChange}
          zIndex="z-10"
          disabled={!!existingPool}
        />
      </div>

      {!existingPool && (
        <div className="space-y-3 mt-6">
          <h3 className="text-white font-medium text-sm mb-3">
            Token Approvals
          </h3>

          {/* Token A Approval */}
          <button
            onClick={handleApproveWithModal}
            disabled={
              !selectedTokenA ||
              !amountA ||
              (approvedTokenA && approvedTokenB) ||
              approveTokenALoading ||
              approveTokenBLoading ||
              !isConnected
            }
            className="w-full
            bg-gradient-to-b from-neutral-900 to-black
            text-white
            font-semibold
            py-4 px-6
            rounded-xl
            border border-white/10
            shadow-[0_4px_12px_rgba(0,0,0,0.4)]
            hover:bg-gradient-to-b hover:from-white/10 hover:to-white/20
            hover:text-white
            hover:border-white/20
            hover:shadow-[0_6px_16px_rgba(0,0,0,0.6)]
            transition-all duration-200
            disabled:from-white/10 disabled:to-white/10
            disabled:text-white/40
            disabled:shadow-none
            cursor-pointer disabled:cursor-not-allowedcursor-pointer disabled:cursor-not-allowed"
          >
            {approvedTokenA && approvedTokenB
              ? "✓ Tokens Approved"
              : approveTokenALoading || approveTokenBLoading
              ? "Approving..."
              : !selectedTokenA
              ? "Select Token A"
              : !amountA
              ? "Enter Amount A"
              : !isConnected
              ? "Connect Wallet"
              : "Approve Tokens"}
          </button>
        </div>
      )}

      {isError && error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-4 truncate">
          <strong className="font-bold truncate">Error:</strong> {error.message}
        </div>
      )}

      {/* <button
        onClick={
          existingPool ? handleAddLiquidity : handleAddLiquidityWithModal
        }
        disabled={
          (!canAddLiquidity && !isError && !addLiquiditySuccess) || 
          addLiquidityLoading ||
          isLoading // Also check hook loading state
        }
        className="w-full bg-white hover:bg-gray-200 disabled:bg-white/20 text-black disabled:text-white/60 font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed cursor-pointer mt-6"
      >
        <div className="flex items-center justify-center space-x-2">
          {(addLiquidityLoading || isLoading) && (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          )}
          <Droplets className="w-5 h-5" />
          <span>
            {addLiquidityLoading || isLoading
              ? "Adding Liquidity..."
              : !isConnected
              ? "Connect Wallet First"
              : !canProceed
              ? "Enter Token Amounts"
              : !existingPool && (!approvedTokenA || !approvedTokenB)
              ? "Approve Tokens First"
              : addLiquiditySuccess
              ? "✅ Liquidity Added Successfully"
              : isError
              ? "Retry Add Liquidity"
              : existingPool
              ? `Add Liquidity to ${selectedDex}`
              : `Add Liquidity on ${selectedDex}`}
          </span>
        </div>
      </button> */}

      <PoolTransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        step={modalStep}
        mode="add-liquidity"
        tokenA={
          selectedTokenA
            ? {
                symbol: selectedTokenA,
                logo:
                  POOL_TOKENS[selectedTokenA]?.logo ||
                  "/images/logoCoin/ethLogo.png",
                name: POOL_TOKENS[selectedTokenA]?.name || selectedTokenA,
              }
            : undefined
        }
        tokenB={
          selectedTokenB
            ? {
                symbol: selectedTokenB,
                logo:
                  POOL_TOKENS[selectedTokenB]?.logo ||
                  "/images/logoCoin/ethLogo.png",
                name: POOL_TOKENS[selectedTokenB]?.name || selectedTokenB,
              }
            : undefined
        }
        txHash={addLiquidityTxHash || undefined}
        onApproveFirstToken={handleModalApproveFirst}
        onApproveSecondToken={handleModalApproveSecond}
        onAddLiquidity={handleModalAddLiquidity}
        isLoading={
          approveTokenALoading ||
          approveTokenBLoading ||
          addLiquidityLoading ||
          isLoading
        }
        error={error?.message}
      />
    </motion.div>
  );
}
