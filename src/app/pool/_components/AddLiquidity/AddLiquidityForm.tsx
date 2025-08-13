"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Plus, 
  ArrowLeft, 
  Info, 
  AlertTriangle, 
  Settings,
  Droplets
} from "lucide-react";
import { useAccount } from "wagmi";
import { POOL_TOKENS, type TokenSymbol, DEX_AGGREGATORS, type DexName, usePool } from "../../../hooks/query/contracts/use-pool";
import { TokenSelector } from "./TokenSelectorLiquidity";
import { motion } from "framer-motion";
import { DexSelector } from "../CreatePool/DEXSelector";
import { keccak256, encodePacked } from "viem";

interface AddLiquidityFormProps {
  existingPool?: {
    id: string;
    token0: string;
    token1: string;
    fee: number;
    tvl: string;
    volume24h: string;
    apr: string;
    userLiquidity: string;
    isActive: boolean;
  };
  onBack?: () => void;
}

export function AddLiquidityForm({ existingPool, onBack }: AddLiquidityFormProps) {
  const [selectedTokenA, setSelectedTokenA] = useState<TokenSymbol | null>(
    existingPool?.token0 as TokenSymbol || null
  );
  const [selectedTokenB, setSelectedTokenB] = useState<TokenSymbol | null>(
    existingPool?.token1 as TokenSymbol || null
  );
  const [selectedDex, setSelectedDex] = useState<DexName>("Uniswap");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [deadline, setDeadline] = useState("20");
  const [showSettings, setShowSettings] = useState(false);
  const [openTokenSelect, setOpenTokenSelect] = useState<"A" | "B" | null>(null);
  const [openDexSelect, setOpenDexSelect] = useState(false);
  
  // Approval states
  const [approvedTokenA, setApprovedTokenA] = useState(false);
  const [approvedTokenB, setApprovedTokenB] = useState(false);
  const [approvalInProgress, setApprovalInProgress] = useState(false);

  const { isConnected } = useAccount();
  const { addLiquidity, approveToken, isLoading, isSuccess, isError, error, txHash, reset } = usePool();

  // Mock pool ratios for calculation
  const poolRatios = {
    "WBTC/USDT": { reserveA: "5.25", reserveB: "245678.50" },
    "WETH/USDC": { reserveA: "150.25", reserveB: "485623.75" },
    "PEPE/USDT": { reserveA: "1250000", reserveB: "15623.45" },
    "WSONIC/PENGU": { reserveA: "85000", reserveB: "125000" },
    "WETH/WSONIC": { reserveA: "125.5", reserveB: "85420.25" },
    "WSONIC/PEPE": { reserveA: "65000", reserveB: "890000" },
  };

  const currentPoolRatio = existingPool 
    ? poolRatios[`${existingPool.token0}/${existingPool.token1}` as keyof typeof poolRatios]
    : null;

  // Auto calculate amounts based on pool ratio
  const handleAmountAChange = (value: string) => {
    setAmountA(value);
    if (value && currentPoolRatio) {
      const ratio = parseFloat(currentPoolRatio.reserveB) / parseFloat(currentPoolRatio.reserveA);
      const estimatedB = (parseFloat(value) * ratio).toFixed(6);
      setAmountB(estimatedB);
    }
  };

  const handleAmountBChange = (value: string) => {
    setAmountB(value);
    if (value && currentPoolRatio) {
      const ratio = parseFloat(currentPoolRatio.reserveA) / parseFloat(currentPoolRatio.reserveB);
      const estimatedA = (parseFloat(value) * ratio).toFixed(6);
      setAmountA(estimatedA);
    }
  };

  // Calculate pool ID
  const computePoolId = (tokenA: TokenSymbol, tokenB: TokenSymbol): `0x${string}` => {
    try {
      const aAddr = POOL_TOKENS[tokenA].address.toLowerCase();
      const bAddr = POOL_TOKENS[tokenB].address.toLowerCase();
      const [token0, token1] = aAddr < bAddr ? [aAddr, bAddr] : [bAddr, aAddr];
      
      const poolId = keccak256(
        encodePacked(
          ["address", "address"],
          [token0 as `0x${string}`, token1 as `0x${string}`]
        )
      );
      
      return poolId;
    } catch (error) {
      console.error('Error computing poolId:', error);
      return "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`;
    }
  };

  // Token approval handlers
  const handleApproveTokenA = async () => {
    if (!selectedTokenA || !amountA || !selectedDex) {
      console.error('Missing data for token A approval');
      return;
    }

    try {
      setApprovalInProgress(true);
      console.log('Approving Token A:', selectedTokenA, 'Amount:', amountA, 'DEX:', selectedDex);
      
      await approveToken(selectedTokenA, amountA, selectedDex);
      setApprovedTokenA(true);
      console.log('Token A approved successfully');
    } catch (err) {
      console.error('Token A approval failed:', err);
    } finally {
      setApprovalInProgress(false);
    }
  };

  const handleApproveTokenB = async () => {
    if (!selectedTokenB || !amountB || !selectedDex) {
      console.error('Missing data for token B approval');
      return;
    }

    try {
      setApprovalInProgress(true);
      console.log('Approving Token B:', selectedTokenB, 'Amount:', amountB, 'DEX:', selectedDex);
      
      await approveToken(selectedTokenB, amountB, selectedDex);
      setApprovedTokenB(true);
      console.log('Token B approved successfully');
    } catch (err) {
      console.error('Token B approval failed:', err);
    } finally {
      setApprovalInProgress(false);
    }
  };

  const handleAddLiquidity = async () => {
    if (!selectedTokenA || !selectedTokenB || !amountA || !amountB || !selectedDex) {
      console.error('Missing required data for add liquidity');
      return;
    }

    if (!approvedTokenA || !approvedTokenB) {
      console.error('Tokens must be approved before adding liquidity');
      return;
    }

    try {
      const poolId = existingPool?.id || computePoolId(selectedTokenA, selectedTokenB);
      
      console.log('Adding liquidity:', {
        poolId,
        amountA,
        amountB,
        selectedTokenA,
        selectedTokenB,
        selectedDex,
        dexAddress: DEX_AGGREGATORS[selectedDex].address
      });

      await addLiquidity(
        poolId,
        amountA,
        amountB,
        selectedTokenA,
        selectedTokenB,
        selectedDex
      );
    } catch (err) {
      console.error('Add liquidity failed:', err);
    }
  };

  // Reset approval states when tokens or DEX change
  useEffect(() => {
    if (!existingPool) {
      setApprovedTokenA(false);
      setApprovedTokenB(false);
      setApprovalInProgress(false);
      reset();
    }
  }, [selectedTokenA, selectedTokenB, selectedDex, existingPool]); // Remove reset from dependencies

  const canProceed = selectedTokenA && selectedTokenB && amountA && amountB && isConnected;
  const canAddLiquidity = canProceed && (existingPool || (approvedTokenA && approvedTokenB));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <div className="flex items-center space-x-3">
            <Droplets className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">
              {existingPool ? `Add to ${existingPool.token0}/${existingPool.token1}` : "Add Liquidity"}
            </h2>
          </div>
        </div>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 space-y-4"
        >
          <h3 className="text-white font-medium flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Transaction Settings</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Slippage Tolerance</label>
              <div className="flex space-x-2">
                {["0.1", "0.5", "1.0"].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSlippage(value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      slippage === value
                        ? "bg-white text-black"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-white/70 mb-2">Deadline (minutes)</label>
              <input
                type="number"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="20"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Existing Pool Info */}
      {existingPool && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                  <Image
                    src={POOL_TOKENS[existingPool.token0 as keyof typeof POOL_TOKENS]?.logo || "/images/logoCoin/ethereum.png"}
                    alt={existingPool.token0}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 absolute -bottom-1 -right-2 bg-black">
                  <Image
                    src={POOL_TOKENS[existingPool.token1 as keyof typeof POOL_TOKENS]?.logo || "/images/logoCoin/ethereum.png"}
                    alt={existingPool.token1}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium text-lg">
                    {existingPool.token0}/{existingPool.token1}
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded text-white/80">
                    {existingPool.fee}%
                  </span>
                </div>
                <div className="text-white/60 text-sm">
                  Pool ID: {`${existingPool.id.slice(0, 8)}...${existingPool.id.slice(-6)}`}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-white/60 mb-1">TVL</div>
              <div className="text-white font-medium">{existingPool.tvl}</div>
            </div>
            <div className="text-center">
              <div className="text-white/60 mb-1">24h Volume</div>
              <div className="text-white font-medium">{existingPool.volume24h}</div>
            </div>
            <div className="text-center">
              <div className="text-white/60 mb-1">APR</div>
              <div className="text-green-400 font-medium">{existingPool.apr}</div>
            </div>
            <div className="text-center">
              <div className="text-white/60 mb-1">My Position</div>
              <div className="text-white font-medium">{existingPool.userLiquidity}</div>
            </div>
          </div>
        </div>
      )}

      {/* DEX Selector */}
      {!existingPool && (
        <div className="mb-6">
          <DexSelector
            selectedDex={selectedDex}
            isOpen={openDexSelect}
            onToggle={() => setOpenDexSelect(!openDexSelect)}
            onSelect={(dex) => {
              setSelectedDex(dex);
              setOpenDexSelect(false);
            }}
          />
        </div>
      )}

      {/* Token Inputs */}
      <div className="space-y-4">
        <TokenSelector
          label="First Token"
          selectedToken={selectedTokenA}
          otherToken={selectedTokenB}
          amount={amountA}
          isOpen={openTokenSelect === "A"}
          onToggle={() => setOpenTokenSelect(openTokenSelect === "A" ? null : "A")}
          onSelect={setSelectedTokenA}
          onAmountChange={handleAmountAChange}
          zIndex="z-20"
          disabled={!!existingPool}
        />

        <div className="flex justify-center">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
            <Plus className="w-5 h-5 text-white" />
          </div>
        </div>

        <TokenSelector
          label="Second Token"
          selectedToken={selectedTokenB}
          otherToken={selectedTokenA}
          amount={amountB}
          isOpen={openTokenSelect === "B"}
          onToggle={() => setOpenTokenSelect(openTokenSelect === "B" ? null : "B")}
          onSelect={setSelectedTokenB}
          onAmountChange={handleAmountBChange}
          zIndex="z-10"
          disabled={!!existingPool}
        />
      </div>

      {/* Rest of the component remains the same... */}
      
      {/* Token Approval Buttons */}
      {!existingPool && (
        <div className="space-y-3 mt-6">
          <h3 className="text-white font-medium text-sm mb-3">Token Approvals</h3>
          
          {/* Token A Approval */}
          <button
            onClick={handleApproveTokenA}
            disabled={!selectedTokenA || !amountA || approvedTokenA || approvalInProgress || !isConnected}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-white/20 text-white disabled:text-white/60 font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
          >
            {approvedTokenA ? `✓ ${selectedTokenA} Approved` : 
             approvalInProgress ? "Approving..." :
             !selectedTokenA ? "Select Token A" :
             !amountA ? "Enter Amount A" :
             !isConnected ? "Connect Wallet" :
             `Approve ${selectedTokenA}`}
          </button>

          {/* Token B Approval */}
          <button
            onClick={handleApproveTokenB}
            disabled={!selectedTokenB || !amountB || approvedTokenB || approvalInProgress || !isConnected}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-white/20 text-white disabled:text-white/60 font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
          >
            {approvedTokenB ? `✓ ${selectedTokenB} Approved` : 
             approvalInProgress ? "Approving..." :
             !selectedTokenB ? "Select Token B" :
             !amountB ? "Enter Amount B" :
             !isConnected ? "Connect Wallet" :
             `Approve ${selectedTokenB}`}
          </button>
        </div>
      )}

      {/* Transaction Status */}
      {isSuccess && txHash && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6">
          <div className="flex items-center">
            <div className="flex-1">
              <strong className="font-bold">Liquidity Added Successfully!</strong>
              <div className="text-sm mt-1">
                Transaction: 
                <a 
                  href={`https://testnet.sonicscan.org/tx/${txHash}`}
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

      {isError && error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
          <strong className="font-bold">Error:</strong> {error.message}
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleAddLiquidity}
        disabled={!canAddLiquidity || isLoading}
        className="w-full bg-white hover:bg-gray-200 disabled:bg-white/20 text-black disabled:text-white/60 font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed mt-6"
      >
        <div className="flex items-center justify-center space-x-2">
          <Droplets className="w-5 h-5" />
          <span>
            {isLoading ? "Adding Liquidity..." :
             !isConnected ? "Connect Wallet First" :
             !canProceed ? "Enter Token Amounts" :
             !existingPool && (!approvedTokenA || !approvedTokenB) ? "Approve Tokens First" :
             existingPool ? `Add Liquidity to ${selectedDex}` : `Add Liquidity on ${selectedDex}`}
          </span>
        </div>
      </button>
    </motion.div>
  );
}