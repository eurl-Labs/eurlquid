import { NextRequest, NextResponse } from 'next/server';
import { queries, theGraphQuery } from '@/lib/thegraph';
import { getMainnetAddress } from '@/lib/token-mainnet';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const first = Number(searchParams.get('first') || 5);
    const fromToken = searchParams.get('fromToken');
    const toToken = searchParams.get('toToken');

    if (!fromToken || !toToken) {
      return NextResponse.json({ error: 'fromToken and toToken are required' }, { status: 400 });
    }

    const fromTokenAddress = getMainnetAddress(fromToken);
    const toTokenAddress = getMainnetAddress(toToken);

    if (!fromTokenAddress || !toTokenAddress) {
      return NextResponse.json({ error: 'Unsupported token' }, { status: 400 });
    }

    const query = queries.uniswapV3.poolsByTokens(fromTokenAddress, toTokenAddress, first);
    const data = await theGraphQuery('uniswapV3Ethereum', query, { first });

    return NextResponse.json({ 
      data,
      first,
      source: 'thegraph_uniswap_v3'
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}
