import { AlertCircle, CheckCircle, ExternalLink } from "lucide-react";

interface TransactionStatusProps {
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  txHash: string | null;
  poolId: `0x${string}` | null;
}

export function TransactionStatus({
  isSuccess,
  isError,
  error,
  txHash,
  poolId
}: TransactionStatusProps) {
  if (!isSuccess && !isError && !txHash && !poolId) return null;

  return (
    <div
      className={`mb-6 bg-white/5 border rounded-xl p-4 ${
        isError
          ? "border-red-500/30"
          : isSuccess
          ? "border-green-500/30"
          : "border-white/10"
      }`}
    >
      <div className="flex items-center space-x-2 mb-2">
        {isError ? (
          <AlertCircle className="w-5 h-5 text-red-400" />
        ) : isSuccess ? (
          <CheckCircle className="w-5 h-5 text-green-400" />
        ) : (
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        )}
        <span
          className={`text-sm font-medium ${
            isError
              ? "text-red-400"
              : isSuccess
              ? "text-green-400"
              : "text-white"
          }`}
        >
          {isError
            ? "Transaction Failed"
            : isSuccess
            ? "Transaction Successful"
            : "Status"}
        </span>
      </div>
      
      {poolId && (
        <div className="text-xs text-white/70 mb-1">
          Pool ID: {poolId.slice(0, 10)}...{poolId.slice(-8)}
        </div>
      )}
      
      {error && (
        <div className="text-xs text-red-400">{error.message}</div>
      )}
      
      {txHash && (
        <div className="flex items-center space-x-2 text-xs text-white/60">
          <span>Tx:</span>
          <code className="text-white/80">
            {txHash.slice(0, 6)}...{txHash.slice(-4)}
          </code>
          <button
            type="button"
            onClick={() =>
              window.open(`https://testnet.sonicscan.org/tx/${txHash}`, "_blank")
            }
            className="p-1 hover:text-white text-white/60"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}