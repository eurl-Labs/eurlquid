import { NextRequest, NextResponse } from 'next/server';
import { getDexByName } from '@/lib/defillama';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chain = searchParams.get('chain') || 'ethereum';

    // 1inch data from DeFiLlama only (no subgraph available)
    const data = await getDexByName(['1inch']);
    
    return NextResponse.json({ 
      chain, 
      data: data['1inch'], 
      source: 'defillama',
      note: '1inch does not have public subgraph, using DeFiLlama data only'
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}
