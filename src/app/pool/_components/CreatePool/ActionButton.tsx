interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  isConnected: boolean;
  canProceed: boolean;
  stepLabel: string;
}

export function ActionButton({
  onClick,
  disabled,
  isLoading,
  isConnected,
  canProceed,
  stepLabel,
}: ActionButtonProps) {
  const getButtonText = () => {
    if (isLoading) return "Processing...";
    if (!isConnected) return "Connect Wallet First";
    if (!canProceed) return "Select Tokens & Enter Amounts";
    return stepLabel;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-white hover:bg-gray-200 disabled:bg-white/20 text-black disabled:text-white/60 font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
    >
      {getButtonText()}
    </button>
  );
}
