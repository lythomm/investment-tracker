/* eslint-disable */
/**
 * Generated API definitions.
 */
import type { FunctionReference } from "convex/server";

export declare const api: {
  accounts: {
    createAccount: FunctionReference<"mutation">;
    getAccounts: FunctionReference<"query">;
  };
  assets: {
    getAssets: FunctionReference<"query">;
    getOrCreateAsset: FunctionReference<"mutation">;
  };
  transactions: {
    addTransaction: FunctionReference<"mutation">;
    addBatchTransactions: FunctionReference<"mutation">;
    getTransactions: FunctionReference<"query">;
    deleteTransaction: FunctionReference<"mutation">;
  };
  portfolio: {
    getPortfolioSummary: FunctionReference<"query">;
  };
  snapshots: {
    getMonthlySnapshots: FunctionReference<"query">;
    updateSnapshotForMonth: FunctionReference<"mutation">;
  };
};
export declare const internal: any;
