"use client";

import { Plus } from "lucide-react";
import { useCreatePoolLogic } from "../../hooks/query/contracts/use-create-pool";
import { Overlay } from "./Overlay";
import { DexSelector } from "./DEXSelector";
import { TokenSelector } from "./TokenSelector";
import { TransactionStatus } from "./TransactionStatus";
import { ActionButton } from "./ActionButton";

export function CreatePoolForm() {
  const {
    selectedTokenA,
    selectedTokenB,
    selectedDex,
    amountA,
    amountB,
    openMenu,
    poolId,
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
    isLoading,
    isSuccess,
    isError,
    error,
    txHash,
    isConnected
  } = useCreatePoolLogic();

  return (
    <div className="relative isolate overflow-visible bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
      <Overlay isOpen={!!openMenu} onClose={() => setOpenMenu(null)} />

      <h3 className="text-xl font-bold text-white mb-6">Create New Pool</h3>

      <DexSelector
        selectedDex={selectedDex}
        isOpen={false}
        onToggle={() => {}}
        onSelect={handleDexSelection}
      />

      <TokenSelector
        label="First Token"
        selectedToken={selectedTokenA}
        otherToken={selectedTokenB}
        amount={amountA}
        isOpen={false}
        onToggle={() => {}}
        onSelect={handleTokenASelection}
        onAmountChange={setAmountA}
        zIndex="z-20"
      />

      <div className="flex justify-center mb-6">
        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
          <Plus className="w-5 h-5 text-white" />
        </div>
      </div>

      <TokenSelector
        label="Second Token"
        selectedToken={selectedTokenB}
        otherToken={selectedTokenA}
        amount={amountB}
        isOpen={false}
        onToggle={() => {}}
        onSelect={handleTokenBSelection}
        onAmountChange={setAmountB}
        zIndex="z-10"
      />

      <TransactionStatus
        isSuccess={isSuccess}
        isError={isError}
        error={error}
        txHash={txHash ?? null}
        poolId={poolId}
      />

      <ActionButton
        onClick={stepAction}
        disabled={!canProceed || isLoading}
        isLoading={isLoading}
        isConnected={isConnected}
        canProceed={canProceed}
        stepLabel={stepLabel}
      />
    </div>
  );
}