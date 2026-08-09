import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function normalizeTicker(ticker: string): string {
  const clean = ticker.trim().toUpperCase();
  if (clean === "PUUST.PA") return "PUST.PA";
  return clean;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const assets: Array<{ assetId: string; ticker: string }> = body.assets || [];

    if (!assets || assets.length === 0) {
      return NextResponse.json({ updates: [] });
    }

    const priceMap = new Map<string, number>();

    await Promise.all(
      assets.map(async (asset) => {
        const symbol = normalizeTicker(asset.ticker);
        try {
          const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
            symbol
          )}?interval=1d&range=1d`;

          const chartRes = await fetch(chartUrl, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
          });

          if (chartRes.ok) {
            const chartData = await chartRes.json();
            const price = chartData?.chart?.result?.[0]?.meta?.regularMarketPrice;
            if (typeof price === "number" && price > 0) {
              priceMap.set(asset.ticker.toUpperCase(), Math.round(price * 100) / 100);
              priceMap.set(symbol, Math.round(price * 100) / 100);
            }
          }
        } catch (e) {
          console.warn(`Failed to fetch live price for ${symbol}`, e);
        }
      })
    );

    const updates = assets
      .map((a) => {
        const price = priceMap.get(a.ticker.toUpperCase()) || priceMap.get(normalizeTicker(a.ticker));
        if (price && price > 0) {
          return {
            assetId: a.assetId,
            currentPrice: price,
          };
        }
        return null;
      })
      .filter((u): u is { assetId: string; currentPrice: number } => u !== null);

    return NextResponse.json({ updates });
  } catch (error) {
    console.error("Error refreshing asset prices:", error);
    return NextResponse.json({ updates: [] }, { status: 500 });
  }
}
