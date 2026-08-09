import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const assets: Array<{ assetId: string; ticker: string }> = body.assets || [];

    if (!assets || assets.length === 0) {
      return NextResponse.json({ updates: [] });
    }

    const tickers = assets.map((a) => a.ticker);
    const uniqueTickers = Array.from(new Set(tickers));

    const priceMap = new Map<string, number>();

    // 1. Try batch quote request
    try {
      const quoteUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(
        uniqueTickers.join(",")
      )}`;

      const res = await fetch(quoteUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (res.ok) {
        const data = await res.json();
        const results = data?.quoteResponse?.result || [];
        for (const item of results) {
          if (item.symbol && typeof item.regularMarketPrice === "number") {
            priceMap.set(item.symbol.toUpperCase(), item.regularMarketPrice);
          }
        }
      }
    } catch (e) {
      console.warn("Yahoo batch quote failed, falling back to individual charts", e);
    }

    // 2. For any tickers missing from batch quote, fallback to chart endpoint
    await Promise.all(
      uniqueTickers.map(async (ticker) => {
        if (!priceMap.has(ticker.toUpperCase())) {
          try {
            const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
              ticker
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
                priceMap.set(ticker.toUpperCase(), price);
              }
            }
          } catch {
            // ignore fallback error
          }
        }
      })
    );

    const updates = assets
      .map((a) => {
        const price = priceMap.get(a.ticker.toUpperCase());
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
