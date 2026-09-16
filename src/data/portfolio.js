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

export function addPortfolioCopy(traderId, amountEth) {
  const ethPrice = 3400;
  const depositValueUsd = parseFloat(amountEth) * ethPrice;
  const vaultId = `v_${Date.now()}`;
  
  const newCopy = {
    vaultId,
    traderId,
    depositAmount: `${parseFloat(amountEth).toFixed(2)} ETH`,
    depositValueUsd,
    currentValueUsd: depositValueUsd,
    pnlPercent: 0.0,
    sharesOwned: parseFloat(amountEth) * 100,
    performanceFeeAccrued: 0.0
  };
  
  portfolio.activeCopies.push(newCopy);
  portfolio.totalValue += depositValueUsd;
}

export function withdrawPortfolioCopy(vaultId, sharesToBurn) {
  const index = portfolio.activeCopies.findIndex(c => c.vaultId === vaultId);
  if (index === -1) return 0;
  const copy = portfolio.activeCopies[index];
  const burn = Math.min(copy.sharesOwned, parseFloat(sharesToBurn) || copy.sharesOwned);
  const ratio = burn / copy.sharesOwned;
  const grossUsd = copy.currentValueUsd * ratio;
  const feeUsd = copy.performanceFeeAccrued * ratio;
  portfolio.totalValue = Math.max(0, portfolio.totalValue - grossUsd);
  if (burn >= copy.sharesOwned - 0.001) {
    portfolio.activeCopies.splice(index, 1);
  } else {
    copy.sharesOwned -= burn;
    copy.currentValueUsd -= grossUsd;
    copy.performanceFeeAccrued -= feeUsd;
  }
  return Math.max(0, grossUsd - feeUsd) / 3400;
}

export function depositPortfolioCopy(vaultId, amountEth) {
  const copy = portfolio.activeCopies.find(c => c.vaultId === vaultId);
  if (!copy) return false;
  const eth = parseFloat(amountEth);
  if (isNaN(eth) || eth <= 0) return false;
  const addedUsd = eth * 3400;
  const currentEth = parseFloat(copy.depositAmount) || 0;
  copy.depositAmount = `${(currentEth + eth).toFixed(2)} ETH`;
  copy.depositValueUsd += addedUsd;
  copy.currentValueUsd += addedUsd;
  copy.sharesOwned += eth * 100;
  copy.pnlPercent = parseFloat(((copy.currentValueUsd - copy.depositValueUsd) / copy.depositValueUsd * 100).toFixed(1));
  portfolio.totalValue += addedUsd;
  return true;
}
