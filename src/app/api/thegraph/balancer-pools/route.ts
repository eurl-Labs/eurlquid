import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const first = Number(searchParams.get("first") || 5);
    const fromToken = searchParams.get("fromToken");
    const toToken = searchParams.get("toToken");

    const mockBalancerPools = [
      {
        id: "0x5c6ee304399dbdb9c8ef030ab642b10820db8f56",
        name: "WETH/WBTC",
        totalValueLockedUSD: "120000000",
        totalVolume24hUSD: "25000000",
        fees24hUSD: "75000",
        token0: { symbol: "WETH" },
        token1: { symbol: "WBTC" },
      },
      {
        id: "0x32296969ef14eb0c6d29669c550d4a0449130230",
        name: "WETH/USDC",
        totalValueLockedUSD: "90000000",
        totalVolume24hUSD: "40000000",
        fees24hUSD: "40000",
        token0: { symbol: "WETH" },
        token1: { symbol: "USDC" },
      },
    ];

    let filteredPools = mockBalancerPools;

    if (fromToken && toToken) {
      const tokenSymbols = [fromToken.toUpperCase(), toToken.toUpperCase()];
      filteredPools = mockBalancerPools.filter(
        (pool) =>
          tokenSymbols.includes(pool.token0.symbol.toUpperCase()) &&
          tokenSymbols.includes(pool.token1.symbol.toUpperCase())
      );
    }

    return NextResponse.json({
      data: { pools: filteredPools.slice(0, first) },
      first,
      source: "mock_balancer_data",
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "unknown error" },
      { status: 500 }
    );
  }
}
