import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function normalizeTicker(ticker: string): string {
  const clean = ticker.trim().toUpperCase();
  if (clean === "PUUST.PA") return "PUST.PA";
  return clean;
}

async function fetchPriceForSymbol(symbol: string): Promise<number | null> {
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
        return Math.round(price * 100) / 100;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

async function searchSymbolByIsin(isin: string): Promise<string | null> {
  try {
    const searchUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
      isin.trim().toUpperCase()
    )}`;
    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (res.ok) {
      const data = await res.json();
      const quotes = data?.quotes || [];
      if (quotes.length > 0 && quotes[0].symbol) {
        return quotes[0].symbol;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const assets: Array<{ assetId: string; ticker: string; isin?: string }> = body.assets || [];

    if (!assets || assets.length === 0) {
      return NextResponse.json({ updates: [] });
    }

    const priceMap = new Map<string, number>();

    await Promise.all(
      assets.map(async (asset) => {
        const symbol = normalizeTicker(asset.ticker);
        let price = await fetchPriceForSymbol(symbol);

        // Fallback: If price not found by ticker and ISIN is available, search by ISIN
        if (!price && asset.isin && asset.isin.trim().length >= 6) {
          const fallbackSymbol = await searchSymbolByIsin(asset.isin);
          if (fallbackSymbol) {
            price = await fetchPriceForSymbol(fallbackSymbol);
          }
        }

        if (price && price > 0) {
          priceMap.set(asset.assetId, price);
        }
      })
    );

    const updates = assets
      .map((a) => {
        const price = priceMap.get(a.assetId);
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
