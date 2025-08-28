"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Droplets,
  HelpCircle,
  Settings,
  Wallet,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { useAccount } from "wagmi";
import {
  useFaucet,
  FAUCET_TOKENS,
  type TokenSymbol,
} from "../../hooks/query/contracts/use-faucet-tokens";
import Link from "next/link";

interface ClaimRecord {
  token: TokenSymbol;
  timestamp: number;
}

interface FaucetCardProps {
  selectedToken: TokenSymbol | null;
  setSelectedToken: (token: TokenSymbol | null) => void;
  onClaim: (tokenSymbol: TokenSymbol) => void;
  claimHistory: ClaimRecord[];
  isTokenOnCooldown: (tokenSymbol: TokenSymbol) => boolean;
  getTimeUntilAvailable: (tokenSymbol: TokenSymbol) => number;
}

export function FaucetCard({
  selectedToken,
  setSelectedToken,
  onClaim,
  claimHistory,
  isTokenOnCooldown,
  getTimeUntilAvailable,
}: FaucetCardProps) {
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const claimInitiatedRef = useRef<TokenSymbol | null>(null);

  const { address, isConnected } = useAccount();
  const { claimToken, isLoading, isSuccess, isError, error, txHash, reset } =
    useFaucet();

  const selectedTokenData = selectedToken ? FAUCET_TOKENS[selectedToken] : null;
  const canClaim =
    selectedToken &&
    isConnected &&
    address &&
    !isTokenOnCooldown(selectedToken);

  const isButtonDisabled =
    !canClaim || (isLoading && claimInitiatedRef.current === selectedToken);

  const handleClaim = async () => {
    if (!selectedToken || !canClaim) return;

    try {
      claimInitiatedRef.current = selectedToken;
      await claimToken(selectedToken);
    } catch (err) {
      console.error("Claim failed:", err);
      claimInitiatedRef.current = null;
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTimeRemaining = (milliseconds: number): string => {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  useEffect(() => {
    if (
      isSuccess &&
      txHash &&
      claimInitiatedRef.current &&
      !isTokenOnCooldown(claimInitiatedRef.current)
    ) {
      onClaim(claimInitiatedRef.current);
      claimInitiatedRef.current = null;
    }
  }, [isSuccess, txHash, onClaim, isTokenOnCooldown]);

  const handleTokenSelect = (token: TokenSymbol) => {
    setSelectedToken(token);
    setShowTokenSelect(false);
    claimInitiatedRef.current = null;
    reset();
  };

  useEffect(() => {
    if (
      isSuccess &&
      selectedToken &&
      !isTokenOnCooldown(selectedToken) &&
      !claimInitiatedRef.current &&
      !txHash
    ) {
      reset();
    }
  }, [selectedToken, isSuccess, isTokenOnCooldown, reset, txHash]);

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold text-white">Testnet Faucet</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <label className="block text-sm text-white/60 font-medium mb-3">
            Connected Wallet
          </label>
          {isConnected && address ? (
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <div className="font-medium text-white">
                    {formatAddress(address)}
                  </div>
                  <div className="text-xs text-green-400">Connected</div>
                </div>
              </div>
              <Link
                href={`https://sonicscan.org/address/${address}`}
                target="_blank"
              >
                <ExternalLink className="w-4 h-4 cursor-pointer" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-white/5 border border-red-500/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <div className="font-medium text-white">
                    No Wallet Connected
                  </div>
                  <div className="text-xs text-red-400">
                    Please connect your wallet
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 ">
          <label className="block text-sm text-white/60 font-medium mb-3">
            Select Token
          </label>
          <button
            onClick={() => setShowTokenSelect(!showTokenSelect)}
            className="cursor-pointer w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
          >
            {selectedTokenData ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={selectedTokenData.logo}
                    alt={selectedTokenData.symbol}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <div className="font-medium text-white cursor-pointer">
                    {selectedTokenData.symbol}
                  </div>
                  <div className="text-xs text-white/60">
                    {selectedTokenData.name}
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-white/60">Choose a token</span>
            )}
            <ChevronDown className="w-5 h-5 text-white/60" />
          </button>

          {showTokenSelect && (
            <div className="mt-2 space-y-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-2 max-h-60 overflow-y-auto">
              {Object.entries(FAUCET_TOKENS).map(([symbol, token]) => (
                <button
                  key={symbol}
                  onClick={() => handleTokenSelect(symbol as TokenSymbol)}
                  className="cursor-pointer w-full flex items-center space-x-3 p-3 hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={token.logo}
                      alt={token.symbol}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">
                      {token.symbol}
                    </div>
                    <div className="text-xs text-white/60">
                      {token.amount} {token.symbol}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {(isSuccess || isError || txHash) && (
          <div
            className={`bg-white/5 border rounded-xl p-4 ${
              isError
                ? "border-red-500/20"
                : isSuccess
                ? "border-green-500/20"
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
                  ? "Claim Successful!"
                  : "Processing..."}
              </span>
            </div>
            {error && (
              <p className="text-xs text-red-400 mb-2">{error.message}</p>
            )}
            {txHash && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-white/60">Tx Hash:</span>
                <code className="text-xs text-white/80 font-mono">
                  {formatAddress(txHash)}
                </code>
                <button
                  onClick={() =>
                    window.open(
                      `https://sonicscan.org/tx/${txHash}`,
                      "_blank"
                    )
                  }
                  className="p-1 text-white/60 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3 h-3 cursor-pointer" />
                </button>
              </div>
            )}
          </div>
        )}

        {selectedTokenData && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Droplets className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-white">
                Claim Details
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Amount:</span>
                <span className="text-white font-medium">
                  {selectedTokenData.amount} {selectedTokenData.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Contract:</span>
                <code className="text-white/80 text-xs font-mono">
                  {formatAddress(selectedTokenData.address)}
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Status:</span>
                <div className="text-right">
                  {selectedToken && isTokenOnCooldown(selectedToken) ? (
                    <div>
                      <div className="text-red-400 font-medium">Cooldown</div>
                      <div className="text-xs text-white/60">
                        Available in{" "}
                        {formatTimeRemaining(
                          getTimeUntilAvailable(selectedToken)
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-green-400 font-medium">
                      Available
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleClaim}
          disabled={isButtonDisabled}
          className="w-full bg-white hover:bg-gray-200 disabled:bg-white/20 text-black disabled:text-white/60 font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <div className="flex items-center justify-center space-x-2 cursor-pointer">
            {isLoading && claimInitiatedRef.current === selectedToken ? (
              <>
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                <span>Claiming...</span>
              </>
            ) : (
              <>
                <span className="flex items-center space-x-2">
                  {!isConnected ? (
                    "Connect Wallet First"
                  ) : !selectedToken ? (
                    "Select Token"
                  ) : selectedToken && isTokenOnCooldown(selectedToken) ? (
                    `Available in ${formatTimeRemaining(
                      getTimeUntilAvailable(selectedToken)
                    )}`
                  ) : (
                    <span className="flex items-center space-x-2">
                      <span>
                        Claim {selectedTokenData?.amount} {selectedToken}
                      </span>
                      {selectedTokenData && (
                        <div className="w-5 h-5 rounded-full overflow-hidden border border-black/20">
                          <Image
                            src={selectedTokenData.logo}
                            alt={selectedTokenData.symbol}
                            width={20}
                            height={20}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </span>
                  )}
                </span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
