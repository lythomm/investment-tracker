import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function fetchHistoryForSymbol(
  symbol: string
): Promise<Array<{ yearMonth: string; closingPrice: number }> | null> {
  try {
    const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      symbol
    )}?interval=1mo&range=5y`;

    const res = await fetch(chartUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (res.ok) {
      const data = await res.json();
      const result = data?.chart?.result?.[0];
      const timestamps: number[] = result?.timestamp || [];
      const closes: (number | null)[] = result?.indicators?.quote?.[0]?.close || [];

      const assetHistory: Array<{ yearMonth: string; closingPrice: number }> = [];

      for (let i = 0; i < timestamps.length; i++) {
        const ts = timestamps[i];
        const price = closes[i];
        if (typeof ts === "number" && typeof price === "number" && price > 0) {
          const d = new Date(ts * 1000);
          const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          assetHistory.push({
            yearMonth,
            closingPrice: Math.round(price * 100) / 100,
          });
        }
      }

      if (assetHistory.length > 0) {
        return assetHistory;
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
      return NextResponse.json({ histories: [] });
    }

    const histories: Array<{
      assetId: string;
      history: Array<{ yearMonth: string; closingPrice: number }>;
    }> = [];

    await Promise.all(
      assets.map(async (asset) => {
        let history = await fetchHistoryForSymbol(asset.ticker);

        // Fallback: If history not found by ticker and ISIN is available, search by ISIN
        if ((!history || history.length === 0) && asset.isin && asset.isin.trim().length >= 6) {
          const fallbackSymbol = await searchSymbolByIsin(asset.isin);
          if (fallbackSymbol) {
            history = await fetchHistoryForSymbol(fallbackSymbol);
          }
        }

        if (history && history.length > 0) {
          histories.push({
            assetId: asset.assetId,
            history,
          });
        }
      })
    );

    return NextResponse.json({ histories });
  } catch (error) {
    console.error("Error fetching historical prices:", error);
    return NextResponse.json({ histories: [] }, { status: 500 });
  }
}
