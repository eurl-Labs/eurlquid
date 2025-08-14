"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, ExternalLink, Clock, Loader2 } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";

export type PoolTransactionStep =
  | "approve-first-token"
  | "approve-second-token"
  | "create-pool"
  | "add-liquidity"
  | "success";

export interface PoolTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: PoolTransactionStep;
  mode?: "create-pool" | "add-liquidity"; // New prop to differentiate modes
  tokenA?: {
    symbol: string;
    logo: string;
    name: string;
  };
  tokenB?: {
    symbol: string;
    logo: string;
    name: string;
  };
  txHash?: string;
  onApproveFirstToken?: () => void;
  onApproveSecondToken?: () => void;
  onCreatePool?: () => void;
  onAddLiquidity?: () => void;
  isLoading?: boolean;
  error?: string;
}

const STEP_CONFIG = {
  "approve-first-token": {
    title: "Approve First Token",
    subtitle: "Please approve your first token to continue",
    buttonText: "Approve Token",
    progressStep: 1,
  },
  "approve-second-token": {
    title: "Approve Second Token",
    subtitle: "Please approve your second token to continue",
    buttonText: "Approve Token",
    progressStep: 2,
  },
  "create-pool": {
    title: "Create Pool",
    subtitle: "Create a new liquidity pool for these tokens",
    buttonText: "Create Pool",
    progressStep: 3,
  },
  "add-liquidity": {
    title: "Add Liquidity",
    subtitle: "Add liquidity to the pool",
    buttonText: "Add Liquidity",
    progressStep: 4,
  },
  success: {
    title: "Transaction Successful!",
    subtitle: "Your transaction has been completed successfully",
    buttonText: "Close",
    progressStep: 5,
  },
};

// Different progress configurations based on mode
const getProgressConfig = (mode: "create-pool" | "add-liquidity") => {
  if (mode === "create-pool") {
    return {
      totalSteps: 4, // Token A, Token B, Pool, Done
      labels: ["Token A", "Token B", "Pool", "Done"],
      stepMapping: {
        "approve-first-token": 1,
        "approve-second-token": 2,
        "create-pool": 3,
        success: 4,
      },
    };
  } else {
    return {
      totalSteps: 4, // Token A, Token B, Liquidity, Done
      labels: ["Token A", "Token B", "Liquidity", "Done"],
      stepMapping: {
        "approve-first-token": 1,
        "approve-second-token": 2,
        "add-liquidity": 3,
        success: 4,
      },
    };
  }
};

export function PoolTransactionModal({
  isOpen,
  onClose,
  step,
  mode = "create-pool", // Default to create-pool mode
  tokenA,
  tokenB,
  txHash,
  onApproveFirstToken,
  onApproveSecondToken,
  onCreatePool,
  onAddLiquidity,
  isLoading = false,
  error,
}: PoolTransactionModalProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);

  const config = STEP_CONFIG[step];
  const progressConfig = getProgressConfig(mode);
  const currentProgressStep = progressConfig.stepMapping[step] || 1;

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔍 Debug: Monitor txHash prop changes
  useEffect(() => {
    console.log("🔍 PoolTransactionModal - Props Debug:", {
      step,
      txHash,
      isOpen,
      mode,
    });
  }, [step, txHash, isOpen, mode]);

  // Reset completedSteps when modal opens fresh
  useEffect(() => {
    if (isOpen) {
      // Reset completed steps when modal opens
      setCompletedSteps(new Set());
    }
  }, [isOpen]);

  // Update completed steps when step changes
  useEffect(() => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);

      // Mark previous steps as completed
      for (let i = 1; i < currentProgressStep; i++) {
        newSet.add(i);
      }

      // Mark success step as completed
      if (step === "success") {
        newSet.add(currentProgressStep);
      }

      return newSet;
    });
  }, [step, currentProgressStep]);

  const handleAction = () => {
    // If there's an error, allow closing the modal
    if (error) {
      onClose();
      return;
    }

    switch (step) {
      case "approve-first-token":
        onApproveFirstToken?.();
        break;
      case "approve-second-token":
        onApproveSecondToken?.();
        break;
      case "create-pool":
        onCreatePool?.();
        break;
      case "add-liquidity":
        onAddLiquidity?.();
        break;
      case "success":
        onClose();
        break;
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: 0,
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ ease: "easeOut", duration: 0.25 }}
            className="relative w-full max-w-md z-10"
            style={{
              position: "relative",
              margin: "0 auto",
              maxWidth: "28rem",
              width: "100%",
            }}
          >
            <div
              className="rounded-xl shadow-2xl overflow-hidden"
              style={{
                background: "#0B1220",
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Header */}
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className="font-semibold text-white"
                      style={{ fontSize: "18px", lineHeight: "1.2" }}
                    >
                      {config.title}
                    </h3>
                    <p
                      className="text-[#B0B7C3] mt-1"
                      style={{ fontSize: "13px", lineHeight: "1.4" }}
                    >
                      {config.subtitle}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-white/70" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-5 py-4 bg-[#101828]">
                <div className="flex items-center justify-between mb-3">
                  {Array.from(
                    { length: progressConfig.totalSteps },
                    (_, index) => {
                      const stepNum = index + 1;
                      const isCompleted = completedSteps.has(stepNum);
                      const isCurrent = stepNum === currentProgressStep;

                      return (
                        <div key={stepNum} className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                              isCompleted
                                ? "bg-[#00FF85] border-[#00FF85]"
                                : isCurrent
                                ? "border-[#00FF85] bg-[#0B1220]"
                                : "border-[#2D3748] bg-[#2D3748]"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-[#0B1220]" />
                            ) : (
                              <span
                                className={`text-xs font-medium ${
                                  isCurrent ? "text-[#00FF85]" : "text-white/40"
                                }`}
                              >
                                {stepNum}
                              </span>
                            )}
                          </div>
                          {stepNum < progressConfig.totalSteps && (
                            <div
                              className={`w-8 h-1 mx-2 rounded-full transition-all duration-300 ${
                                completedSteps.has(stepNum)
                                  ? "bg-[#00FF85]"
                                  : "bg-[#2D3748]"
                              }`}
                            />
                          )}
                        </div>
                      );
                    }
                  )}
                </div>

                {/* Step Labels */}
                <div className="flex justify-between text-xs text-[#B0B7C3]">
                  {progressConfig.labels.map((label, index) => (
                    <span key={index}>{label}</span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Tokens Display (if not success step) */}
                {step !== "success" && tokenA && tokenB && (
                  <div className="mb-6">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 mx-auto mb-2">
                          <Image
                            src={tokenA.logo}
                            alt={tokenA.symbol}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-medium text-white">
                          {tokenA.symbol}
                        </p>
                      </div>

                      <div className="text-2xl text-white/40">+</div>

                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 mx-auto mb-2">
                          <Image
                            src={tokenB.logo}
                            alt={tokenB.symbol}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-medium text-white">
                          {tokenB.symbol}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Content */}
                {step === "success" && (
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#4ADE80]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-[#4ADE80]" />
                    </div>

                    <p className="text-lg font-semibold text-white mb-2">
                      {mode === "add-liquidity"
                        ? "Liquidity Added Successfully!"
                        : "Pool Created Successfully!"}
                    </p>

                    <p className="text-sm text-[#B0B7C3] mb-4">
                      {mode === "add-liquidity"
                        ? "Your tokens have been added to the liquidity pool"
                        : "Your new pool has been created and is ready for trading"}
                    </p>

                    {txHash && (
                      <div className="mt-4">
                        <p className="text-sm text-[#B0B7C3] mb-2">
                          Transaction Hash:
                        </p>
                        <div
                          className="p-3 rounded-lg border border-white/10"
                          style={{ background: "#0F172A" }}
                        >
                          <div className="flex items-center justify-between cursor-pointer">
                            <code className="text-xs text-[#9FFF85] font-mono">
                              {txHash.slice(0, 12)}...{txHash.slice(-8)}
                            </code>
                            <a
                              href={`https://testnet.sonicscan.org/tx/${txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:bg-white/5 rounded transition-colors"
                              title="View transaction on Sonic Explorer"
                            >
                              <ExternalLink className="w-4 h-4 text-[#9FFF85]" />
                            </a>
                          </div>
                        </div>
                        <p className="text-xs text-[#B0B7C3] mt-2">
                          Click the link icon to view your transaction on Sonic
                          Explorer
                        </p>
                      </div>
                    )}

                    {!txHash && (
                      <div className="mt-4">
                        <p className="text-sm text-[#B0B7C3]">
                          Transaction confirmed successfully!
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Current Step Info */}
                {step !== "success" && !error && (
                  <div className="mb-6">
                    <div className="flex items-center space-x-3">
                      {step === "approve-first-token" && tokenA && (
                        <>
                          <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                            <Image
                              src={tokenA.logo}
                              alt={tokenA.symbol}
                              width={24}
                              height={24}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-[#B0B7C3]">
                            Click Approve to approve {tokenA.symbol} token...
                          </span>
                        </>
                      )}

                      {step === "approve-second-token" && tokenB && (
                        <>
                          <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                            <Image
                              src={tokenB.logo}
                              alt={tokenB.symbol}
                              width={24}
                              height={24}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-[#B0B7C3]">
                            Click Approve to approve {tokenB.symbol} token...
                          </span>
                        </>
                      )}

                      {(step === "create-pool" || step === "add-liquidity") && (
                        <>
                          <Clock className="w-5 h-5 text-[#00FF85]" />
                          <span className="text-sm text-[#B0B7C3]">
                            {step === "create-pool"
                              ? "Click the button to create a pool"
                              : "Click the button to add liquidity"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Error State Info */}
                {error && (
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="text-lg font-medium text-red-400">
                        Transaction Failed
                      </span>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-sm text-red-400 break-words leading-relaxed">
                        {(() => {
                          // Clean up the error message
                          let cleanError = error;

                          // Remove "Contract Call:" part and everything after it
                          if (cleanError.includes("Contract Call:")) {
                            cleanError = cleanError
                              .split("Contract Call:")[0]
                              .trim();
                          }

                          // Remove "Raw Call Arguments:" part and everything after it
                          if (cleanError.includes("Raw Call Arguments:")) {
                            cleanError = cleanError
                              .split("Raw Call Arguments:")[0]
                              .trim();
                          }

                          // Remove "Request Arguments:" part and keep only the first part
                          if (cleanError.includes("Request Arguments:")) {
                            const parts =
                              cleanError.split("Request Arguments:");
                            cleanError = parts[0].trim();

                            // If the first part is too short, add a bit from the second part
                            if (cleanError.length < 50 && parts[1]) {
                              const secondPart = parts[1].trim();
                              const fromTo = secondPart.match(
                                /from: (\w+) to: (\w+)/
                              );
                              if (fromTo) {
                                cleanError += ` (${fromTo[1].slice(
                                  0,
                                  6
                                )}...${fromTo[1].slice(
                                  -4
                                )} to ${fromTo[2].slice(
                                  0,
                                  6
                                )}...${fromTo[2].slice(-4)})`;
                              }
                            }
                          }

                          // Remove version info
                          cleanError = cleanError
                            .replace(/Version: viem@[\d.]+/g, "")
                            .trim();

                          // Remove docs links
                          cleanError = cleanError
                            .replace(/Docs: https:\/\/[^\s]+/g, "")
                            .trim();

                          // If still too long, truncate at 150 characters and add ellipsis
                          if (cleanError.length > 150) {
                            cleanError =
                              cleanError.substring(0, 150).trim() + "...";
                          }

                          // If empty after cleaning, show generic message
                          if (!cleanError || cleanError.length < 10) {
                            cleanError =
                              "User rejected the transaction request.";
                          }

                          return cleanError;
                        })()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={handleAction}
                  disabled={isLoading && !error && step !== "success"}
                  className={`cursor-pointer w-full py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    error
                      ? "bg-red-600 hover:bg-red-700"
                      : step === "success"
                      ? "bg-[#4ADE80] hover:bg-[#3BCC6D]"
                      : "bg-[#1E293B]"
                  }`}
                  style={{
                    color: "#FFFFFF",
                  }}
                >
                  {isLoading && !error && step !== "success" && (
                    <Loader2 className="w-4 h-4 animate-spin " />
                  )}
                  <span
                    className={
                      error || step === "success" ? "font-bold" : "font-medium"
                    }
                  >
                    {error ? "Close" : config.buttonText}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Use portal to render modal at root level to ensure proper centering
  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
