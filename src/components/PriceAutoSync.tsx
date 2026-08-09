"use client";

import { useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const TWO_MINUTES_MS = 2 * 60 * 1000;

export function PriceAutoSync() {
  const assets = useQuery(api.assets.getAssets);
  const updatePrices = useMutation(api.assets.updateAssetPrices);
  const upsertPriceHistory = useMutation(api.assets.upsertAssetPriceHistory);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (!assets || assets.length === 0) return;

    const syncPrices = async () => {
      if (isSyncingRef.current) return;

      const now = Date.now();
      const staleAssets = assets.filter(
        (a: any) => !a.updatedAt || now - a.updatedAt > TWO_MINUTES_MS
      );

      if (staleAssets.length === 0) return;

      isSyncingRef.current = true;
      try {
        const payload = {
          assets: staleAssets.map((a: any) => ({
            assetId: a._id,
            ticker: a.ticker,
            isin: a.isin,
          })),
        };

        // 1. Sync current market prices
        const res = await fetch("/api/assets/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.updates && data.updates.length > 0) {
            await updatePrices({ updates: data.updates });
          }
        }

        // 2. Sync historical monthly closing prices from Yahoo Finance
        const historyRes = await fetch("/api/assets/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (historyRes.ok) {
          const historyData = await historyRes.json();
          if (historyData.histories && historyData.histories.length > 0) {
            for (const item of historyData.histories) {
              await upsertPriceHistory({
                assetId: item.assetId,
                history: item.history,
              });
            }
          }
        }
      } catch (err) {
        console.error("Auto price & history sync failed:", err);
      } finally {
        isSyncingRef.current = false;
      }
    };

    // Initial check on mount or when assets change
    syncPrices();

    // Interval every 2 minutes
    const interval = setInterval(syncPrices, TWO_MINUTES_MS);
    return () => clearInterval(interval);
  }, [assets, updatePrices, upsertPriceHistory]);

  return null;
}
