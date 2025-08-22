"use client";

import { Plus } from "lucide-react";
import { useCreatePoolLogic } from "../../../hooks/query/contracts/use-create-pool";
import { DexSelector } from "./DEXSelector";
import { EnhancedTokenSelector } from "../Shared/EnhancedTokenSelector";
import { TransactionStatus } from "./TransactionStatus";
import { SeparateActionButtons } from "./SeparateActionButtons";
import {
  PoolTransactionModal,
  type PoolTransactionStep,
} from "../../../../components/ui/PoolTransactionModal";
import { POOL_TOKENS } from "../../../hooks/query/contracts/use-pool";
import { useState, useEffect } from "react";

export function CreatePoolForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<PoolTransactionStep>(
    "approve-first-token"
  );

  const {
    selectedTokenA,
    selectedTokenB,
    selectedDex,
    amountA,
    amountB,
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
    handleApprove,
    handleApproveTokenA,
    handleApproveTokenB,
    handleCreatePool,
    isLoading,
    isSuccess,
    isError,
    error,
    txHash,
    isConnected,
    resetTransactionState,
    resetAllState,
  } = useCreatePoolLogic();

  // console.log('CreatePool render:', {
  //   openMenu,
  //   selectedTokenA,
  //   selectedTokenB,
  //   selectedDex,
  //   contractAddress: selectedDex ? `Will hit: ${selectedDex} contract` : 'No DEX selected'
  // });

  const handleModalApproveFirst = async () => {
    // console.log('🔄 Modal: Approving first token...');
    await handleApproveTokenA();
  };

  const handleModalApproveSecond = async () => {
    // console.log('🔄 Modal: Approving second token...');
    await handleApproveTokenB();
  };

  const handleModalCreatePool = async () => {
    // console.log('🔄 Modal: Creating pool...');
    await handleCreatePool();
  };

  useEffect(() => {
    // console.log('🔍 Create Pool Modal Step Management:', {
    //   isModalOpen,
    //   modalStep,
    //   approvedTokenA,
    //   approvedTokenB,
    //   approveTokenALoading,
    //   approveTokenBLoading,
    //   poolCreationInProgress,
    //   isSuccess,
    //   txHash: createPoolTxHash || txHash
    // });

    if (isModalOpen) {
      if (
        modalStep === "approve-first-token" &&
        approvedTokenA &&
        !approveTokenALoading
      ) {
        // console.log('✅ Token A approved, advancing to approve second token');
        setTimeout(() => {
          setModalStep("approve-second-token");
        }, 1000);
      } else if (
        modalStep === "approve-second-token" &&
        approvedTokenB &&
        !approveTokenBLoading
      ) {
        // console.log('✅ Token B approved, advancing to create pool');
        setTimeout(() => {
          setModalStep("create-pool");
        }, 1000);
      } else if (
        modalStep === "create-pool" &&
        isSuccess &&
        (createPoolTxHash || txHash)
      ) {
        // console.log('✅ Pool created successfully, advancing to success');
        setTimeout(() => {
          setModalStep("success");
        }, 1500);
      }
    }
  }, [
    isModalOpen,
    modalStep,
    approvedTokenA,
    approvedTokenB,
    approveTokenALoading,
    approveTokenBLoading,
    poolCreationInProgress,
    isSuccess,
    createPoolTxHash,
    txHash,
  ]);

  useEffect(() => {
    // console.log('🔍 Create Pool Success Detection Monitor:', {
    //   isSuccess,
    //   txHash,
    //   createPoolTxHash,
    //   poolCreationInProgress,
    //   isModalOpen,
    //   modalStep,
    //   approveTokenALoading,
    //   approveTokenBLoading
    // });

    if (isSuccess && (createPoolTxHash || txHash)) {
      const isCreatePoolSuccess =
        modalStep === "create-pool" || poolCreationInProgress;

      if (isCreatePoolSuccess) {
        // console.log('🎉 Create Pool Success Detected!');
        // console.log('   Transaction Hash:', createPoolTxHash || txHash);
        // console.log('   Current Modal State:', { isModalOpen, modalStep });

        if (isModalOpen) {
          if (modalStep === "create-pool") {
            // console.log('   ✅ Transitioning modal to success step...');
            const timer = setTimeout(() => {
              setModalStep("success");
              // console.log('   ✅ Modal step set to success with txHash:', createPoolTxHash || txHash);
            }, 1500);

            return () => clearTimeout(timer);
          } else {
            // console.log('   🔄 Modal is open but not in create-pool step, opening success modal...');
            setModalStep("success");
            setIsModalOpen(true);
          }
        } else {
          setModalStep("success");
          setIsModalOpen(true);
        }
      } else {
        // console.log('✅ Token Approval Success Detected (not triggering success modal)');
        // console.log('   Approval Transaction Hash:', txHash);
        // console.log('   Current Modal Step:', modalStep);
      }
    }
  }, [
    isSuccess,
    txHash,
    createPoolTxHash,
    poolCreationInProgress,
    isModalOpen,
    modalStep,
    approveTokenALoading,
    approveTokenBLoading,
  ]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalStep("approve-first-token");
    resetAllState();
  };

  const handleApproveWithModal = () => {
    setIsModalOpen(true);
    if (!approvedTokenA) {
      setModalStep("approve-first-token");
    } else if (!approvedTokenB) {
      setModalStep("approve-second-token");
    } else {
      setModalStep("create-pool");
    }
  };

  const handleCreatePoolWithModal = () => {
    setIsModalOpen(true);
    setModalStep("create-pool");
  };

  return (
    <div className="relative isolate overflow-visible bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Create New Pool</h3>
        {selectedDex && (
          <div className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
            Contract: {selectedDex}
          </div>
        )}
      </div>

      <DexSelector
        selectedDex={selectedDex}
        isOpen={openMenu === "dex"}
        onToggle={() => {
          toggleMenu("dex");
        }}
        onSelect={(dex) => {
          handleDexSelection(dex);
        }}
      />

      <EnhancedTokenSelector
        label="First Token"
        selectedToken={selectedTokenA}
        otherToken={selectedTokenB}
        amount={amountA}
        isOpen={openMenu === "tokenA"}
        onToggle={() => {
          toggleMenu("tokenA");
        }}
        onSelect={(token) => {
          handleTokenASelection(token);
        }}
        onAmountChange={setAmountA}
      />

      <div className="flex justify-center mb-6">
        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
          <Plus className="w-5 h-5 text-white" />
        </div>
      </div>

      <EnhancedTokenSelector
        label="Second Token"
        selectedToken={selectedTokenB}
        otherToken={selectedTokenA}
        amount={amountB}
        isOpen={openMenu === "tokenB"}
        onToggle={() => {
          toggleMenu("tokenB");
        }}
        onSelect={(token) => {
          handleTokenBSelection(token);
        }}
        onAmountChange={setAmountB}
      />

      <TransactionStatus
        isSuccess={isSuccess}
        isError={isError}
        error={error}
        txHash={txHash ?? null}
        poolId={poolId}
      />

      <SeparateActionButtons
        onApprove={handleApproveWithModal}
        approvedTokenA={approvedTokenA}
        approvedTokenB={approvedTokenB}
        approvalInProgress={approvalInProgress}
        approveTokenALoading={approveTokenALoading}
        approveTokenBLoading={approveTokenBLoading}
        onCreatePool={handleCreatePoolWithModal}
        poolCreationInProgress={poolCreationInProgress}
        onAddLiquidity={() => {}}
        isConnected={isConnected}
        canProceed={canProceed}
        selectedDex={selectedDex}
        selectedTokenA={selectedTokenA}
        selectedTokenB={selectedTokenB}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        txHash={txHash || null}
        poolCreatedSuccessfully={poolCreatedSuccessfully}
        createPoolTxHash={createPoolTxHash}
      />

      <PoolTransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        step={modalStep}
        mode="create-pool"
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
        txHash={createPoolTxHash || txHash || undefined}
        onApproveFirstToken={handleModalApproveFirst}
        onApproveSecondToken={handleModalApproveSecond}
        onCreatePool={handleModalCreatePool}
        isLoading={
          approveTokenALoading ||
          approveTokenBLoading ||
          poolCreationInProgress ||
          isLoading
        }
        error={error?.message}
      />
    </div>
  );
}
