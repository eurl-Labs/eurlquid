import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const first = Number(searchParams.get("first") || 5);
    const fromToken = searchParams.get("fromToken");
    const toToken = searchParams.get("toToken");

    const mockCurvePools = [
      {
        id: "0x1",
        name: "stETH/ETH",
        totalValueLockedUSD: "150000000",
        totalVolume24hUSD: "5000000",
        fees24hUSD: "15000",
        token0: { symbol: "stETH" },
        token1: { symbol: "ETH" },
      },
      {
        id: "0x2",
        name: "USDC/USDT",
        totalValueLockedUSD: "200000000",
        totalVolume24hUSD: "8000000",
        fees24hUSD: "8000",
        token0: { symbol: "USDC" },
        token1: { symbol: "USDT" },
      },
      {
        id: "0x3",
        name: "WBTC/ETH",
        totalValueLockedUSD: "100000000",
        totalVolume24hUSD: "2000000",
        fees24hUSD: "6000",
        token0: { symbol: "WBTC" },
        token1: { symbol: "ETH" },
      },
      {
        id: "0x4",
        name: "PEPE/WETH",
        totalValueLockedUSD: "5000000",
        totalVolume24hUSD: "1000000",
        fees24hUSD: "3000",
        token0: { symbol: "PEPE" },
        token1: { symbol: "WETH" },
      },
    ];

    let filteredPools = mockCurvePools;

    if (fromToken && toToken) {
      const tokenSymbols = [fromToken.toUpperCase(), toToken.toUpperCase()];
      filteredPools = mockCurvePools.filter(
        (pool) =>
          tokenSymbols.includes(pool.token0.symbol.toUpperCase()) &&
          tokenSymbols.includes(pool.token1.symbol.toUpperCase())
      );
    }

    return NextResponse.json({
      data: { pools: filteredPools.slice(0, first) },
      first,
      source: "mock_curve_data",
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "unknown error" },
      { status: 500 }
    );
  }
}
