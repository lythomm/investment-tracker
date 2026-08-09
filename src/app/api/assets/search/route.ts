import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  try {
    const searchUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
      query.trim()
    )}&quotesCount=8&newsCount=0`;

    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await res.json();
    const quotes = data.quotes || [];

    const results = await Promise.all(
      quotes
        .filter((q: any) => q.symbol && (q.shortname || q.longname))
        .map(async (q: any) => {
          const ticker = q.symbol;
          const name = q.longname || q.shortname || ticker;
          const isEtf =
            q.quoteType === "ETF" ||
            (q.typeDisp && q.typeDisp.toUpperCase().includes("ETF")) ||
            name.toUpperCase().includes("ETF");
          const type: "ETF" | "Action" = isEtf ? "ETF" : "Action";

          let currentPrice = 0;
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
              currentPrice =
                chartData?.chart?.result?.[0]?.meta?.regularMarketPrice || 0;
            }
          } catch {
            currentPrice = 0;
          }

          return {
            ticker,
            name,
            type,
            exchDisp: q.exchDisp || "",
            currentPrice,
          };
        })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error fetching from Yahoo Finance:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
