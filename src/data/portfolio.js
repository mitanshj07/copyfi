import { getTrader } from './traders.js';

// Mock Portfolio state
export const portfolio = {
  totalValue: 12500.50, // USD
  totalPnl: 1450.20,
  totalPnlPercent: 13.1,
  
  // Historical chart data
  historyLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  historyData: [10000, 10500, 10200, 11500, 12000, 12500.50],
  
  // Active copy-trading vaults
  activeCopies: [
    {
      vaultId: "v1",
      traderId: "t1",
      depositAmount: "2.5 ETH",
      depositValueUsd: 8500,
      currentValueUsd: 9800,
      pnlPercent: 15.3,
      sharesOwned: 250.45,
      performanceFeeAccrued: 260.00, // 20% of (9800 - 8500)
    },
    {
      vaultId: "v2",
      traderId: "t2",
      depositAmount: "0.8 ETH",
      depositValueUsd: 2720,
      currentValueUsd: 2700.50,
      pnlPercent: -0.7,
      sharesOwned: 80.12,
      performanceFeeAccrued: 0, // No profit = no fee
    }
  ]
};

export function getPortfolioCopies() {
  return portfolio.activeCopies.map(copy => ({
    ...copy,
    trader: getTrader(copy.traderId)
  }));
}
