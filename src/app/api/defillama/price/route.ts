import { NextRequest, NextResponse } from "next/server";
import { defillamaKey, getPrices } from "@/lib/defillama";

// GET /api/defillama/price?chain=ethereum&address=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chain = (searchParams.get("chain") || "ethereum") as
      | "ethereum"
      | "arbitrum"
      | "base";
    const address = searchParams.get("address");
    if (!address)
      return NextResponse.json(
        { error: "address is required" },
        { status: 400 }
      );

    const key = defillamaKey(chain, address);
    const data = await getPrices([key]);
    const price = data.coins[key];

    return NextResponse.json({ key, price, source: "defillama" });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "unknown error" },
      { status: 500 }
    );
  }
}
