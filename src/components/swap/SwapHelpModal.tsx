"use client";

import { useState } from "react";
import {
  X,
  ArrowRight,
  Wallet,
  ArrowUpDown,
  CheckCircle,
  Shield,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SwapHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SwapHelpModal({ isOpen, onClose }: SwapHelpModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "1. Connect Your Wallet",
      icon: <Wallet className="w-6 h-6 text-white" />,
      description: "First, connect your wallet to start swapping",
      details: [
        "Click the 'Connect Wallet' button in the top right",
        "Choose your preferred wallet (MetaMask, WalletConnect, etc.)",
        "Make sure you're connected to Sonic Mainnet",
        "Your wallet address will appear once connected",
      ],
    },
    {
      title: "2. Select Your Tokens",
      icon: <ArrowUpDown className="w-6 h-6 text-white" />,
      description: "Choose which tokens you want to swap",
      details: [
        "Click 'Select Token' in the 'From' section",
        "Choose the token you want to trade",
        "Click 'Select Token' in the 'To' section",
        "Choose the token you want to receive",
      ],
    },
    {
      title: "3. Enter Amount",
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      description: "Specify how much you want to swap",
      details: [
        "Enter the amount in the 'From' input field",
        "The 'To' amount will automatically calculate",
        "Check your wallet balance to ensure you have enough",
        "Review the exchange rate and fees",
      ],
    },
    {
      title: "4. Review & Swap",
      icon: <Zap className="w-6 h-6 text-white" />,
      description: "Confirm your transaction and complete the swap",
      details: [
        "Review all transaction details carefully",
        "Check the route and estimated gas fees",
        "Click 'Swap' to initiate the transaction",
        "Confirm the transaction in your wallet",
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-black border border-white/20 rounded-xl max-w-2xl w-full my-8 mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-black border-b border-white/20 p-4 sm:p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                How to Swap?
              </h2>
              <button
                onClick={onClose}
                className="cursor-pointer p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <p className="text-gray-300 mt-2 text-sm sm:text-base">
              Follow these simple steps to start swapping tokens
            </p>
          </div>

          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-h-[50vh] overflow-y-auto">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    currentStep === index
                      ? "bg-white/10 border-white/30"
                      : "bg-white/5 border-white/20 hover:border-white/40 hover:bg-white/10"
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-2 bg-white/10 rounded-lg">
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
                        {step.title}
                      </h3>
                      <p className="text-gray-300 mb-3 text-sm sm:text-base">
                        {step.description}
                      </p>

                      <AnimatePresence>
                        {currentStep === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2"
                          >
                            {step.details.map((detail, detailIndex) => (
                              <motion.div
                                key={detailIndex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: detailIndex * 0.05 }}
                                className="flex items-start space-x-2"
                              >
                                <ArrowRight className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                                <span className="text-gray-300 text-sm leading-relaxed">
                                  {detail}
                                </span>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center pt-4 border-t border-white/20">
              <button
                onClick={onClose}
                className="cursor-pointer w-full sm:w-auto px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Got it, let's swap!
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
