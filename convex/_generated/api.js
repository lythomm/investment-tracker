/* eslint-disable */
export const api = {
  accounts: {
    createAccount: "accounts:createAccount",
    getAccounts: "accounts:getAccounts",
  },
  assets: {
    getAssets: "assets:getAssets",
    getOrCreateAsset: "assets:getOrCreateAsset",
  },
  transactions: {
    addTransaction: "transactions:addTransaction",
    addBatchTransactions: "transactions:addBatchTransactions",
    getTransactions: "transactions:getTransactions",
    deleteTransaction: "transactions:deleteTransaction",
  },
  portfolio: {
    getPortfolioSummary: "portfolio:getPortfolioSummary",
  },
  snapshots: {
    getMonthlySnapshots: "snapshots:getMonthlySnapshots",
    updateSnapshotForMonth: "snapshots:updateSnapshotForMonth",
  },
};
export const internal = {};
