interface SeparateActionButtonsProps {
  // Enhanced approval props
  onApprove: () => void;
  approvedTokenA: boolean;
  approvedTokenB: boolean;
  approvalInProgress: boolean;
  approveTokenALoading: boolean;
  approveTokenBLoading: boolean;

  // Create pool props
  onCreatePool: () => void;
  poolCreationInProgress: boolean;

  // Add liquidity props
  onAddLiquidity: () => void;

  // General props
  isConnected: boolean;
  canProceed: boolean;
  selectedDex: string | null;
  selectedTokenA: string | null;
  selectedTokenB: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  txHash: string | null;
  poolCreatedSuccessfully: boolean;
  createPoolTxHash: string | null;
}

export function SeparateActionButtons({
  onApprove,
  approvedTokenA,
  approvedTokenB,
  approvalInProgress,
  approveTokenALoading,
  approveTokenBLoading,
  onCreatePool,
  poolCreationInProgress,
  onAddLiquidity,
  isConnected,
  canProceed,
  selectedDex,
  selectedTokenA,
  selectedTokenB,
  isLoading,
  isSuccess,
  isError,
  txHash,
  poolCreatedSuccessfully,
  createPoolTxHash,
}: SeparateActionButtonsProps) {
  const bothTokensApproved = approvedTokenA && approvedTokenB;
  const anyApprovalLoading =
    approveTokenALoading || approveTokenBLoading || approvalInProgress;

  const getApprovalButtonText = () => {
    if (anyApprovalLoading) return "Approving Tokens...";
    if (!isConnected) return "Connect Wallet First";
    if (!canProceed) return "Select Tokens & Enter Amounts";

    if (bothTokensApproved) {
      return `✓ Tokens Approved for ${selectedDex}`;
    } else if (approvedTokenA || approvedTokenB) {
      return `Approve ${
        approvedTokenA ? "Second" : "First"
      } Token for ${selectedDex}`;
    }
    return `Approve Tokens for ${selectedDex}`;
  };

  const getCreatePoolButtonText = () => {
    if (poolCreationInProgress || isLoading) return "Creating Pool...";
    if (isError) return `Create Pool on ${selectedDex}`; // Reset button text on error
    if (poolCreatedSuccessfully) return `✓ Pool Created on ${selectedDex}`;
    if (!bothTokensApproved) return "Approve Tokens First";
    return `Create Pool on ${selectedDex}`;
  };

  return (
    <div className="space-y-3">
      {/* Enhanced Approval Button with Loading Spinner */}
      <button
        type="button"
        onClick={onApprove}
        disabled={
          !canProceed ||
          anyApprovalLoading ||
          bothTokensApproved ||
          !isConnected
        }
        className="
  w-full
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
  cursor-pointer disabled:cursor-not-allowed
"
      >
        <div className="flex items-center justify-center space-x-2">
          {anyApprovalLoading && (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          )}
          <span>{getApprovalButtonText()}</span>
        </div>
      </button>

      {/* Enhanced Create Pool Button with Loading Spinner */}
      {/* <button
        type="button"
        onClick={onCreatePool}
        disabled={!bothTokensApproved || (poolCreationInProgress || isLoading) || !isConnected}
        className={`w-full font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none cursor-pointer disabled:cursor-not-allowed ${
          poolCreatedSuccessfully 
            ? "bg-green-600 text-white" 
            : isError
            ? "bg-red-600 hover:bg-red-700 text-white" // Red color when error
            : "bg-green-600 hover:bg-green-700 disabled:bg-white/20 text-white disabled:text-white/60"
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          {(poolCreationInProgress || isLoading) && (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          )}
          <span>{getCreatePoolButtonText()}</span>
        </div>
      </button> */}

      {/* Enhanced Success notification with proper transaction hash */}
      {poolCreatedSuccessfully && (createPoolTxHash || txHash) && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl">
          <div className="flex items-center">
            <div className="flex-1">
              <strong className="font-bold">Pool Created Successfully!</strong>
              <div className="text-sm mt-1">
                Transaction:
                <a
                  href={`https://testnet.sonicscan.org/tx/${
                    createPoolTxHash || txHash
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-green-600 hover:text-green-800 underline"
                >
                  {(createPoolTxHash || txHash)?.slice(0, 6)}...
                  {(createPoolTxHash || txHash)?.slice(-4)}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Liquidity Button - Only show after pool is created */}
      {/* You can add this later if needed */}
    </div>
  );
}
