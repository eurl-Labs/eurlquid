"use client";

import { useState, useMemo } from "react";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useAnalysisStore } from "@/store/userprompt-store";
import { useSwapContract } from "@/hooks/useSwapContract";
import { findAvailablePool } from "@/config/pools";
import { TOKEN_ADDRESSES } from "@/contracts/tokens";
import { useToast } from "@/components/ui/Toast";

interface RoutesListProps {
  fromAmount: string;
  fromToken: string;
  toToken: string;
}

interface DexRoute {
  id: string;
  name: string;
  logo: string;
  rate: string;
  usdValue: string;
  status: "recommended" | "wait" | "avoid" | "executing";
  slippage: string;
  time: string;
  confidence: number;
  savings?: string;
  warning?: string;
  liquidity: "high" | "medium" | "low";
  mevRisk: "low" | "medium" | "high";
  details: string[];
}

// function isTokenPairAvailable(fromToken: string, toToken: string): boolean {
//   try {
//     const fromTokenAddress = TOKEN_ADDRESSES[fromToken.toUpperCase() as keyof typeof TOKEN_ADDRESSES]
//     const toTokenAddress = TOKEN_ADDRESSES[toToken.toUpperCase() as keyof typeof TOKEN_ADDRESSES]

//     if (!fromTokenAddress || !toTokenAddress) return false

//     return !!findAvailablePool(fromTokenAddress, toTokenAddress)
//   } catch {
//     return false
//   }
// }

// function getAvailablePool(fromToken: string, toToken: string) {
//   try {
//     const fromTokenAddress = TOKEN_ADDRESSES[fromToken.toUpperCase() as keyof typeof TOKEN_ADDRESSES]
//     const toTokenAddress = TOKEN_ADDRESSES[toToken.toUpperCase() as keyof typeof TOKEN_ADDRESSES]

//     if (!fromTokenAddress || !toTokenAddress) return null

//     return findAvailablePool(fromTokenAddress, toTokenAddress)
//   } catch {
//     return null
//   }
// }

export function useSmartSwapExecution(
  fromAmount: string,
  fromToken: string,
  toToken: string
) {
  const [swapType, setSwapType] = useState<"smart" | "manual" | null>(null);
  const [executingRoute, setExecutingRoute] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<
    "idle" | "checking" | "approving" | "approved" | "swapping"
  >("idle");
  const [swapResult, setSwapResult] = useState<{
    hash: string;
    expectedOutput: string;
    pool: string;
  } | null>(null);
  const { analysis } = useAnalysisStore();
  const { smartSwap, isSwapping, swapError, isApproving } = useSwapContract();
  const { showToast } = useToast();

  const handleSmartSwap = async () => {
    try {
      setSwapType("smart");
      setApprovalStatus("checking");

      if (!analysis?.parsed?.optimalRoute) {
        showToast({
          type: "warning",
          title: "AI Analysis Required",
          message:
            "No AI recommendations available. Please wait for analysis to complete.",
          duration: 5000,
        });
        return;
      }

      const optimalRoute = analysis.parsed.optimalRoute;
      const totalRoutes = optimalRoute.length;

      if (totalRoutes === 0) {
        showToast({
          type: "warning",
          title: "No Routes Found",
          message: "No optimal routes found in AI analysis.",
          duration: 5000,
        });
        return;
      }

      showToast({
        type: "info",
        title: "Smart Swap Starting",
        message:
          "AI-optimized routing initiated. Please approve token spending.",
        duration: 3000,
      });
      setApprovalStatus("approving");

      const result = await smartSwap({
        tokenInSymbol: fromToken,
        tokenOutSymbol: toToken,
        amountIn: fromAmount,
        dexName: "uniswap",
      });

      if (result) {
        setSwapResult(result);
        setApprovalStatus("approved");
        showToast({
          type: "success",
          title: "🎯 Smart Swap Successful!",
          message: `AI-optimized routing executed successfully. Received ${result.expectedOutput} ${toToken} via ${result.pool} pool.`,
          txHash: result.hash,
          duration: 8000,
          action: {
            label: "View Details",
            onClick: () => {
              window.open(
                `https://sonicscan.org/tx/${result.hash}`,
                "_blank"
              );
            },
          },
        });
      }
    } catch (err: any) {
      console.error("Smart swap execution error:", err);
      setApprovalStatus("idle");
      showToast({
        type: "error",
        title: "Smart Swap Failed",
        message:
          err.message ||
          "An unexpected error occurred during smart swap execution.",
        duration: 6000,
      });
    } finally {
      setExecutingRoute(null);
      setSwapType(null);
      setTimeout(() => setApprovalStatus("idle"), 3000);
    }
  };

  return {
    handleSmartSwap,
    isSmartSwapping: swapType === "smart" && executingRoute !== null,
    isSwapping,
    isSuccess: !!swapResult,
    swapError,
    hash: swapResult?.hash,
    approvalStatus,
    isApproving,
    canExecuteSmartSwap:
      analysis?.parsed?.optimalRoute && analysis.parsed.optimalRoute.length > 0,
  };
}

export function RoutesList({
  fromAmount,
  fromToken,
  toToken,
}: RoutesListProps) {
  const [selectedRoute, setSelectedRoute] = useState<string>("curve");
  const [executingRoute, setExecutingRoute] = useState<string | null>(null);
  const [swapType, setSwapType] = useState<"smart" | "manual" | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<
    "idle" | "checking" | "approving" | "approved" | "swapping"
  >("idle");
  const [swapResult, setSwapResult] = useState<{
    hash: string;
    expectedOutput: string;
    pool: string;
  } | null>(null);
  const { analysis, data, loading, error } = useAnalysisStore();
  const { executeSwap, smartSwap, isSwapping, swapError, isApproving } =
    useSwapContract();
  const { showToast } = useToast();

  const handleManualSwap = async (route: DexRoute) => {
    try {
      setExecutingRoute(route.id);
      setSwapType("manual");
      setApprovalStatus("checking");
      const rate = parseFloat(route.rate);
      const slippagePercent = parseFloat(route.slippage.replace("%", ""));
      const minAmountOut = ((rate * (100 - slippagePercent)) / 100).toString();

      setApprovalStatus("approving");
      showToast({
        type: "info",
        title: `${route.name} Swap Starting`,
        message: "Please approve token spending in your wallet to proceed.",
        duration: 3000,
      });

      const result = await executeSwap({
        tokenInSymbol: fromToken,
        tokenOutSymbol: toToken,
        amountIn: fromAmount,
        dexName: route.id,
      });

      if (result) {
        setSwapResult(result);
        setApprovalStatus("approved");
        showToast({
          type: "success",
          title: `🔥 ${route.name} Swap Successful!`,
          message: `Manual execution completed. Received ${result.expectedOutput} ${toToken} via ${result.pool} pool.`,
          txHash: result.hash,
          duration: 8000,
          action: {
            label: "View on Explorer",
            onClick: () =>
              window.open(
                `https://sonicscan.org/tx/${result.hash}`,
                "_blank"
              ),
          },
        });
      }
    } catch (err: any) {
      console.error("Manual swap execution error:", err);
      setApprovalStatus("idle");
      showToast({
        type: "error",
        title: `${route.name} Swap Failed`,
        message:
          err.message || "An unexpected error occurred during swap execution.",
        duration: 6000,
      });
    } finally {
      setExecutingRoute(null);
      setSwapType(null);
      setTimeout(() => setApprovalStatus("idle"), 3000);
    }
  };

  const routes: DexRoute[] = useMemo(() => {
    const aiParsed = analysis?.parsed;
    if (!aiParsed || !aiParsed.dexAnalysis) return [];

    const dexMeta: Record<string, { name: string; logo: string }> = {
      uniswap: { name: "Uniswap V3", logo: "/images/logo/uniLogo.svg.png" },
      curve: { name: "Curve", logo: "/images/logo/curveLogo.png" },
      balancer: { name: "Balancer", logo: "/images/logo/balancerLogo.png" },
      oneinch: { name: "1inch", logo: "/images/logo/1inchLogo.png" },
      uniswapv3: { name: "Uniswap V3", logo: "/images/logo/uniLogo.svg.png" },
    };

    const optimalRoute = aiParsed.optimalRoute || [];

    const mappedRoutes = Object.entries(aiParsed.dexAnalysis).map(
      ([dexKey, dexDataRaw]) => {
        const dexData = dexDataRaw as any;
        const routeInfo = optimalRoute.find((r: any) =>
          r.dex?.toLowerCase().includes(dexKey.toLowerCase())
        );

        let status: DexRoute["status"] = "wait";
        if (routeInfo?.status?.includes("execute_now")) status = "recommended";
        else if (routeInfo?.status?.includes("wait")) status = "wait";
        else status = "avoid";

        let liquidity: DexRoute["liquidity"] = "medium";
        if (dexData.liquidity === "high") liquidity = "high";
        else if (dexData.liquidity === "low") liquidity = "low";
        else if (dexData.liquidity === "aggregated") liquidity = "high";

        let mevRisk: DexRoute["mevRisk"] = "medium";
        if (dexData.mevRisk === "low") mevRisk = "low";
        else if (dexData.mevRisk === "high") mevRisk = "high";

        const details = [
          dexData.reasoning,
          `TVL: ${dexData.tvl}`,
          `Fees: ${dexData.fees}`,
          `${((routeInfo?.allocation ?? dexData.allocation ?? 0) * 100).toFixed(
            1
          )}% allocation recommended`,
        ].filter(Boolean);

        return {
          id: dexKey,
          name: dexMeta[dexKey.toLowerCase()]?.name || dexKey,
          logo: dexKey.toLowerCase().includes("uniswap")
            ? "/images/logo/uniLogo.svg.png"
            : dexMeta[dexKey.toLowerCase()]?.logo ||
              "/images/logo/1inchLogo.png",
          rate: dexData.rate || "0.000000",
          usdValue: dexData.usdValue || "$0.00",
          status,
          slippage: dexData.slippage || "0.00%",
          time: dexData.timeToOptimal || "N/A",
          confidence: Math.round((dexData.confidence ?? 0) * 100),
          savings: undefined,
          warning:
            status === "wait"
              ? `Better timing in ${dexData.timeToOptimal}`
              : undefined,
          liquidity,
          mevRisk,
          details,
        };
      }
    );

    const liquidityValue = { high: 3, medium: 2, low: 1 };

    return mappedRoutes.sort((a, b) => {
      const rateDiff = parseFloat(b.rate) - parseFloat(a.rate);
      if (rateDiff !== 0) return rateDiff;

      const slippageA = parseFloat(String(a.slippage).replace("%", ""));
      const slippageB = parseFloat(String(b.slippage).replace("%", ""));
      const slippageDiff = slippageA - slippageB;
      if (slippageDiff !== 0) return slippageDiff;

      const liquidityA = liquidityValue[a.liquidity];
      const liquidityB = liquidityValue[b.liquidity];
      return liquidityB - liquidityA;
    });
  }, [analysis]);

  const summaryStats = useMemo(() => {
    if (!analysis?.parsed) {
      return {
        bestSavings: "$0.00",
        minSlippage: "0.00%",
        aiConfidence: "0%",
        riskAlerts: 0,
      };
    }

    const aiData = analysis.parsed;
    const bestRoute = routes.find((r) => r.status === "recommended");

    return {
      bestSavings: aiData.expectedSavingsUSD
        ? `$${aiData.expectedSavingsUSD}`
        : bestRoute?.savings || "$0.00",
      minSlippage:
        aiData.expectedSlippage ||
        routes.reduce(
          (min, r) =>
            parseFloat(r.slippage) < parseFloat(min) ? r.slippage : min,
          "99.99%"
        ),
      aiConfidence: `${Math.round(
        (aiData.prediction?.confidence || 0) * 100
      )}%`,
      riskAlerts: aiData.riskAlerts?.length || 0,
    };
  }, [analysis, routes]);

  const getStatusIcon = (status: DexRoute["status"]) => {
    switch (status) {
      case "recommended":
        return <CheckCircle className="w-5 h-5 text-white" />;
      case "wait":
        return <Clock className="w-5 h-5 text-white" />;
      case "avoid":
        return <AlertTriangle className="w-5 h-5 text-white" />;
      case "executing":
        return <Zap className="w-5 h-5 text-white" />;
    }
  };

  const getStatusColor = (status: DexRoute["status"]) => {
    switch (status) {
      case "recommended":
        return "border-white/10 bg-white/5";
      case "wait":
        return "border-white/10 bg-white/5";
      case "avoid":
        return "border-white/10 bg-white/5";
      case "executing":
        return "border-white/10 bg-white/5";
    }
  };

  const getLiquidityColor = (liquidity: DexRoute["liquidity"]) => {
    switch (liquidity) {
      case "high":
        return "text-white";
      case "medium":
        return "text-white/80";
      case "low":
        return "text-white/60";
    }
  };

  const getMevRiskColor = (risk: DexRoute["mevRisk"]) => {
    switch (risk) {
      case "low":
        return "text-white";
      case "medium":
        return "text-white/80";
      case "high":
        return "text-white/60";
    }
  };

  return (
    <div className="space-y-6">
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">
              Smart Route Analysis
            </h3>
            <p className="text-sm text-white/60 mt-1">
              AI-powered optimization vs Manual DEX selection
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-white/60">
            <span>Analyzing {routes.length} DEX aggregators</span>
            <div className="flex items-center space-x-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  loading
                    ? "bg-yellow-400 animate-pulse"
                    : error
                    ? "bg-red-400"
                    : "bg-green-400"
                }`}
              ></div>
              <span>
                {loading ? "Analyzing..." : error ? "Error" : "Live data"}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-white">
              {loading ? "..." : summaryStats.bestSavings}
            </div>
            <div className="text-sm text-white/60">Best Savings</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-white">
              {loading ? "..." : summaryStats.minSlippage}
            </div>
            <div className="text-sm text-white/60">Min Slippage</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-white">
              {loading ? "..." : summaryStats.aiConfidence}
            </div>
            <div className="text-sm text-white/60">AI Confidence</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-2xl font-bold text-white">
              {loading ? "..." : summaryStats.riskAlerts}
            </div>
            <div className="text-sm text-white/60">Risk Alerts</div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">
                Analysis Error: {error}
              </span>
            </div>
          </div>
        )}

        {analysis?.parsed?.riskAlerts &&
          analysis.parsed.riskAlerts.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold text-white/80">
                Risk Alerts:
              </h4>
              {analysis.parsed.riskAlerts.map((alert: string, idx: number) => (
                <div
                  key={idx}
                  className="p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-3 h-3 text-orange-400" />
                    <span className="text-orange-400 text-xs">{alert}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        {analysis?.parsed?.advice && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">
                AI Recommendation:
              </span>
            </div>
            <p className="text-white/80 text-sm mt-1">
              {analysis.parsed.advice}
            </p>
          </div>
        )}

        {(isApproving || approvalStatus !== "idle") && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">
                Token Approval Required
              </span>
            </div>
            <p className="text-white/80 text-xs mt-1">
              {approvalStatus === "checking" && "Checking token allowance..."}
              {approvalStatus === "approving" &&
                "Please confirm token approval in your wallet. This allows the DEX to spend your tokens."}
              {approvalStatus === "approved" &&
                "Token approved! Executing swap..."}
              {isSwapping && "Swap transaction in progress..."}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {routes.map((route, index) => (
          <div
            key={route.id}
            className={`backdrop-blur-lg bg-white/5 border-2 rounded-xl p-6 transition-all duration-200 hover:bg-white/10 cursor-pointer ${
              selectedRoute === route.id
                ? "border-white/10"
                : getStatusColor(route.status)
            }`}
            onClick={() => setSelectedRoute(route.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div>
                  <Image
                    src={route.logo}
                    alt={`${route.name} logo`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-white text-lg">
                      {route.name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(route.status)}
                      {index === 0 && (
                        <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full border border-white/10">
                          Best Rate
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-white/60">
                    <span>
                      Liquidity:{" "}
                      <span className={getLiquidityColor(route.liquidity)}>
                        {route.liquidity}
                      </span>
                    </span>
                    <span>
                      MEV Risk:{" "}
                      <span className={getMevRiskColor(route.mevRisk)}>
                        {route.mevRisk}
                      </span>
                    </span>
                    <span>Time: {route.time}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {route.rate} {toToken}
                </div>
                <div className="text-white/60">{route.usdValue}</div>
                <div className="flex items-center justify-end space-x-2 mt-1">
                  {route.savings && (
                    <span className="text-white text-sm font-medium">
                      {route.savings}
                    </span>
                  )}
                  <span className="text-white/60 text-sm">
                    Slippage: {route.slippage}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {route.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 text-sm text-white/80"
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-white/60">AI Confidence:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${route.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-white font-medium">
                      {route.confidence}%
                    </span>
                  </div>
                </div>

                {route.status === "recommended" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleManualSwap(route);
                    }}
                    disabled={
                      executingRoute === route.id || isSwapping || isApproving
                    }
                    className="cursor-pointer px-4 py-2 bg-white hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-black text-sm font-semibold rounded-lg transition-all duration-200"
                  >
                    {executingRoute === route.id &&
                      approvalStatus === "checking" &&
                      "🔍 Checking..."}
                    {/* {executingRoute === route.id && approvalStatus === 'approving' && '📝 Approving Token...'} */}
                    {executingRoute === route.id &&
                      (approvalStatus === "approved" || isSwapping) &&
                      "Swapping..."}
                    {executingRoute !== route.id && "Execute Now"}
                  </button>
                )}

                {route.status === "wait" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast({
                        type: "info",
                        title: "Alert Set",
                        message: `We'll notify you when ${route.name} has better conditions for swapping.`,
                        duration: 4000,
                        action: {
                          label: "Manage Alerts",
                          onClick: () => {
                            showToast({
                              type: "info",
                              title: "Feature Coming Soon",
                              message:
                                "Alert management will be available in the next update.",
                              duration: 3000,
                            });
                          },
                        },
                      });
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-all duration-200 border border-white/10"
                  >
                    Set Alert
                  </button>
                )}

                {route.status === "avoid" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast({
                        type: "warning",
                        title: "Force Execute Warning",
                        message: `${route.name} is not recommended by AI due to poor conditions. Are you sure you want to proceed?`,
                        duration: 6000,
                        action: {
                          label: "Execute Anyway",
                          onClick: () => handleManualSwap(route),
                        },
                      });
                    }}
                    disabled={executingRoute === route.id || isSwapping}
                    className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 disabled:bg-gray-400 disabled:cursor-not-allowed text-orange-300 text-sm font-semibold rounded-lg transition-all duration-200 border border-orange-500/30"
                  >
                    {executingRoute === route.id
                      ? "Executing..."
                      : "Force Execute"}
                  </button>
                )}

                {route.status === "executing" && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-white text-sm">Executing...</span>
                  </div>
                )}
              </div>
            </div>

            {route.warning && (
              <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">
                    {route.warning}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {swapError && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Swap Error</span>
          </div>
          <p className="text-red-300 text-sm mt-1">{swapError}</p>
        </div>
      )}

      {swapResult && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-medium">
              {swapType === "manual"
                ? `Manual Swap on ${
                    routes.find((r) => r.id === executingRoute)?.name || "DEX"
                  } Successful!`
                : "Smart Swap Successful!"}
            </span>
          </div>
          <p className="text-green-300 text-sm mt-1">
            Transaction hash:{" "}
            <span className="font-mono">{swapResult.hash}</span>
          </p>
          {swapType === "smart" && (
            <p className="text-green-300 text-xs mt-1">
              🧠 AI-optimized routing executed successfully
            </p>
          )}
          {swapType === "manual" && (
            <p className="text-green-300 text-xs mt-1">
              🔥 Manual execution on selected DEX completed
            </p>
          )}
        </div>
      )}
    </div>
  );
}
