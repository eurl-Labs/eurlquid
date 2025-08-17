import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const first = Number(searchParams.get('first') || 5);

    // Mock Curve pools data for now since we don't have access to Curve subgraph
    // In production, this would query the actual Curve subgraph
    const mockCurvePools = [
      {
        id: '0x1',
        name: 'stETH/ETH',
        totalValueLockedUSD: '150000000',
        totalVolume24hUSD: '5000000',
        fees24hUSD: '15000',
        token0: { symbol: 'stETH' },
        token1: { symbol: 'ETH' }
      },
      {
        id: '0x2', 
        name: 'USDC/USDT',
        totalValueLockedUSD: '200000000',
        totalVolume24hUSD: '8000000', 
        fees24hUSD: '8000',
        token0: { symbol: 'USDC' },
        token1: { symbol: 'USDT' }
      }
    ];

    return NextResponse.json({ 
      data: { pools: mockCurvePools.slice(0, first) },
      first,
      source: 'mock_curve_data'
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}
