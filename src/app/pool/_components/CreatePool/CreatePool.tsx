"use client";

import { Plus } from "lucide-react";
import { useCreatePoolLogic } from "../../../hooks/query/contracts/use-create-pool";
import { DexSelector } from "./DEXSelector";
import { EnhancedTokenSelector } from "../Shared/EnhancedTokenSelector";
import { TransactionStatus } from "./TransactionStatus";
import { SeparateActionButtons } from "./SeparateActionButtons";

export function CreatePoolForm() {
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
    isConnected
  } = useCreatePoolLogic();

  console.log('CreatePool render:', { 
    openMenu, 
    selectedTokenA, 
    selectedTokenB, 
    selectedDex,
    contractAddress: selectedDex ? `Will hit: ${selectedDex} contract` : 'No DEX selected'
  });

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
        onApprove={handleApprove}
        approvedTokenA={approvedTokenA}
        approvedTokenB={approvedTokenB}
        approvalInProgress={approvalInProgress}
        onCreatePool={handleCreatePool}
        poolCreationInProgress={poolCreationInProgress}
        onAddLiquidity={() => {}} // Add later if needed
        isConnected={isConnected}
        canProceed={canProceed}
        selectedDex={selectedDex}
        selectedTokenA={selectedTokenA}
        selectedTokenB={selectedTokenB}
        isLoading={isLoading}
        isSuccess={isSuccess}
        txHash={txHash || null}
        poolCreatedSuccessfully={poolCreatedSuccessfully}
      />
    </div>
  );
}