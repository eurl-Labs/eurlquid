interface SeparateActionButtonsProps {
  // Approval props
  onApprove: () => void;
  approvedTokenA: boolean;
  approvedTokenB: boolean;
  approvalInProgress: boolean;
  
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
  isError: boolean; // Add isError prop
  txHash: string | null;
  poolCreatedSuccessfully: boolean;
}

export function SeparateActionButtons({
  onApprove,
  approvedTokenA,
  approvedTokenB,
  approvalInProgress,
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
  isError, // Add isError parameter
  txHash,
  poolCreatedSuccessfully
}: SeparateActionButtonsProps) {
  const bothTokensApproved = approvedTokenA && approvedTokenB;
  
  const getApprovalButtonText = () => {
    if (approvalInProgress) return "Approving Tokens...";
    if (!isConnected) return "Connect Wallet First";
    if (!canProceed) return "Select Tokens & Enter Amounts";
    
    if (bothTokensApproved) {
      return `✓ Tokens Approved for ${selectedDex}`;
    } else if (approvedTokenA || approvedTokenB) {
      return `Approve ${approvedTokenA ? 'Second' : 'First'} Token for ${selectedDex}`;
    }
    return `Approve Tokens for ${selectedDex}`;
  };

  const getCreatePoolButtonText = () => {
    if (poolCreationInProgress && !isError) return "Creating Pool...";
    if (isError) return `Create Pool on ${selectedDex}`; // Reset button text on error
    if (poolCreatedSuccessfully) return `✓ Pool Created on ${selectedDex}`;
    if (!bothTokensApproved) return "Approve Tokens First";
    return `Create Pool on ${selectedDex}`;
  };

  return (
    <div className="space-y-3">
      {/* Approval Button */}
      <button
        type="button"
        onClick={onApprove}
        disabled={!canProceed || approvalInProgress || bothTokensApproved || !isConnected}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-white/20 text-white disabled:text-white/60 font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
      >
        {getApprovalButtonText()}
      </button>

      {/* Create Pool Button */}
      <button
        type="button"
        onClick={onCreatePool}
        disabled={!bothTokensApproved || (poolCreationInProgress && !isError) || !isConnected}
        className={`w-full font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed ${
          poolCreatedSuccessfully 
            ? "bg-green-600 text-white" 
            : isError
            ? "bg-red-600 hover:bg-red-700 text-white" // Red color when error
            : "bg-green-600 hover:bg-green-700 disabled:bg-white/20 text-white disabled:text-white/60"
        }`}
      >
        {getCreatePoolButtonText()}
      </button>

      {/* Success notification with transaction hash */}
      {poolCreatedSuccessfully && txHash && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl">
          <div className="flex items-center">
            <div className="flex-1">
              <strong className="font-bold">Pool Created Successfully!</strong>
              <div className="text-sm mt-1">
                Transaction: 
                <a 
                  href={`https://testnet.sonicscan.org//tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-green-600 hover:text-green-800 underline"
                >
                  {txHash.slice(0, 6)}...{txHash.slice(-4)}
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