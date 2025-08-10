import { NextRequest, NextResponse } from 'next/server';
import { httpClients } from '@/lib/alchemy';

const chainNameToId: Record<string, number> = {
  ethereum: 1,
  arbitrum: 42161,
  base: 8453,
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chain = (searchParams.get('chain') || 'ethereum').toLowerCase();
    const chainId = chainNameToId[chain];
    if (!chainId) return NextResponse.json({ error: 'unsupported chain' }, { status: 400 });

    const client = (httpClients as any)[chainId];
    if (!client) return NextResponse.json({ error: 'rpc client not configured' }, { status: 500 });

    const blockNumber = await client.getBlockNumber();
    return NextResponse.json({ chain, chainId, blockNumber: Number(blockNumber) });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}
