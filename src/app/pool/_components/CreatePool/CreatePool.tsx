"use client";

import { Plus } from "lucide-react";
import { useCreatePoolLogic } from "../../../hooks/query/contracts/use-create-pool";
import { DexSelector } from "./DEXSelector";
import { EnhancedTokenSelector } from "../Shared/EnhancedTokenSelector";
import { TransactionStatus } from "./TransactionStatus";
import { SeparateActionButtons } from "./SeparateActionButtons";
import { PoolTransactionModal, type PoolTransactionStep } from "../../../../components/ui/PoolTransactionModal";
import { POOL_TOKENS } from "../../../hooks/query/contracts/use-pool";
import { useState, useEffect } from "react";

export function CreatePoolForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<PoolTransactionStep>("approve-first-token");
  
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
    poolCreatedSuccessfully,
    canProceed,
    toggleMenu,
    handleDexSelection,
    handleTokenASelection,
    handleTokenBSelection,
    setAmountA,
    setAmountB,
    setOpenMenu,
    handleApprove,
    handleCreatePool,
    approvalInProgress,
    poolCreationInProgress,
    isLoading,
    isSuccess,
    isError,
    error,
    txHash,
    isConnected,
    resetTransactionState,
    resetAllState
  } = useCreatePoolLogic();

  console.log('CreatePool render:', { 
    openMenu, 
    selectedTokenA, 
    selectedTokenB, 
    selectedDex,
    contractAddress: selectedDex ? `Will hit: ${selectedDex} contract` : 'No DEX selected'
  });

  // Modal step management
  const handleModalApproveFirst = async () => {
    console.log('Approving first token...');
    await handleApprove(); // This will approve first token
  };

  const handleModalApproveSecond = async () => {
    console.log('Approving second token...');
    await handleApprove(); // This will approve second token
  };

  const handleModalCreatePool = async () => {
    console.log('Creating pool...');
    await handleCreatePool();
  };

  // Auto-advance logic based on approval states
  useEffect(() => {
    if (isModalOpen) {
      if (modalStep === "approve-first-token" && approvedTokenA && !approvedTokenB) {
        console.log('Auto-advancing to approve second token');
        setTimeout(() => setModalStep("approve-second-token"), 1000);
      } else if (modalStep === "approve-second-token" && approvedTokenA && approvedTokenB) {
        console.log('Auto-advancing to create pool');
        setTimeout(() => setModalStep("create-pool"), 1000);
        // Auto-execute create pool after both tokens approved
        setTimeout(() => {
          console.log('Auto-executing create pool...');
          handleCreatePool();
        }, 1500);
      } else if (modalStep === "create-pool" && isSuccess && txHash) {
        console.log('Auto-advancing to success');
        setTimeout(() => setModalStep("success"), 1000);
      } else if (modalStep === "create-pool" && isError) {
        console.log('Error occurred during pool creation');
        // Don't auto-advance, let user see error and try again
      }
    }
  }, [isModalOpen, modalStep, approvedTokenA, approvedTokenB, isSuccess, isError, txHash]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalStep("approve-first-token");
    // Reset semua state agar user mulai dari approve token lagi
    resetAllState();
  };

  // Override the original approve and create pool functions to show modal
  const handleApproveWithModal = () => {
    setIsModalOpen(true);
    if (!approvedTokenA && !approvedTokenB) {
      setModalStep("approve-first-token");
    } else if (approvedTokenA && !approvedTokenB) {
      setModalStep("approve-second-token");
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
        isOpen={openMenu === 'dex'}
        onToggle={() => {
          console.log('DEX toggle called, current openMenu:', openMenu);
          toggleMenu('dex');
        }}
        onSelect={(dex) => {
          console.log('DEX selected:', dex, 'Will hit contract address:', dex);
          handleDexSelection(dex);
        }}
      />

      <EnhancedTokenSelector
        label="First Token"
        selectedToken={selectedTokenA}
        otherToken={selectedTokenB}
        amount={amountA}
        isOpen={openMenu === 'tokenA'}
        onToggle={() => {
          console.log('TokenA toggle called, current openMenu:', openMenu);
          toggleMenu('tokenA');
        }}
        onSelect={(token) => {
          console.log('TokenA selected:', token);
          handleTokenASelection(token);
        }}
        onAmountChange={setAmountA}
        zIndex="z-30"
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
        isOpen={openMenu === 'tokenB'}
        onToggle={() => {
          console.log('TokenB toggle called, current openMenu:', openMenu);
          toggleMenu('tokenB');
        }}
        onSelect={(token) => {
          console.log('TokenB selected:', token);
          handleTokenBSelection(token);
        }}
        onAmountChange={setAmountB}
        zIndex="z-20"
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
        onCreatePool={handleCreatePoolWithModal}
        poolCreationInProgress={poolCreationInProgress}
        onAddLiquidity={() => {}} // Add later if needed
        isConnected={isConnected}
        canProceed={canProceed}
        selectedDex={selectedDex}
        selectedTokenA={selectedTokenA}
        selectedTokenB={selectedTokenB}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError} // Pass isError prop
        txHash={txHash || null}
        poolCreatedSuccessfully={poolCreatedSuccessfully}
      />

      {/* Transaction Modal */}
      <PoolTransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        step={modalStep}
        mode="create-pool" // Specify create-pool mode
        tokenA={selectedTokenA ? {
          symbol: selectedTokenA,
          logo: POOL_TOKENS[selectedTokenA]?.logo || "/images/logoCoin/ethLogo.png",
          name: POOL_TOKENS[selectedTokenA]?.name || selectedTokenA
        } : undefined}
        tokenB={selectedTokenB ? {
          symbol: selectedTokenB,
          logo: POOL_TOKENS[selectedTokenB]?.logo || "/images/logoCoin/ethLogo.png",
          name: POOL_TOKENS[selectedTokenB]?.name || selectedTokenB
        } : undefined}
        txHash={txHash || undefined}
        onApproveFirstToken={handleModalApproveFirst}
        onApproveSecondToken={handleModalApproveSecond}
        onCreatePool={handleModalCreatePool}
        isLoading={isLoading}
        error={error?.message}
      />
    </div>
  );
}