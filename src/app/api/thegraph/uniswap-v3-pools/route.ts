import { NextRequest, NextResponse } from 'next/server';
import { queries, theGraphQuery } from '@/lib/thegraph';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
  const chain = searchParams.get('chain') || 'ethereum';
    const first = Number(searchParams.get('first') || 5);

    const query = queries.uniswapV3.pools(first);

  // Currently we only have Uniswap V3 subgraph ID for Ethereum mainnet
  // If other chains are requested, we still use the Ethereum Uniswap V3 subgraph
  let subgraph: any = 'uniswapV3Ethereum';

    const data = await theGraphQuery(subgraph, query, { first });
    return NextResponse.json({ chain, first, data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}
