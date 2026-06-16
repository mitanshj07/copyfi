// Mock trader profiles
export const traders = [
  {
    id: "t1",
    name: "0xWhale",
    ens: "whale.eth",
    avatar: "https://api.dicebear.com/8.x/shapes/svg?seed=whale",
    bio: "Momentum trading and newly launched DeFi protocols. High risk, high reward.",
    strategy: "Momentum",
    riskScore: 8, // 1-10
    winRate: 64.5,
    totalTrades: 342,
    avgDuration: "3 days",
    maxDrawdown: "-24.1%",
    followers: 12450,
    tvl: "4,250.50 ETH",
    roi30d: 42.8,
    roi90d: 115.4,
    sparklineData: [20, 25, 22, 30, 28, 35, 45, 40, 50, 48, 55, 60],
    recentTrades: [
      { pair: "ETH/USDC", type: "LONG", entry: "$3,450", exit: "$3,620", pnl: "+4.9%" },
      { pair: "LINK/ETH", type: "SHORT", entry: "0.0052", exit: "0.0048", pnl: "+7.6%" }
    ]
  },
  {
    id: "t2",
    name: "YieldFarmer",
    ens: "farmer.eth",
    avatar: "https://api.dicebear.com/8.x/shapes/svg?seed=farmer",
    bio: "Conservative yield generation using Curve, Aave, and stablecoin LPs.",
    strategy: "DeFi Yield",
    riskScore: 3,
    winRate: 92.1,
    totalTrades: 120,
    avgDuration: "45 days",
    maxDrawdown: "-4.2%",
    followers: 8320,
    tvl: "12,100.00 ETH",
    roi30d: 4.1,
    roi90d: 12.8,
    sparklineData: [10, 11, 11, 12, 12, 13, 14, 14, 15, 15, 16, 17],
    recentTrades: [
      { pair: "USDC/USDT", type: "LP", entry: "-", exit: "-", pnl: "+0.5%" },
      { pair: "stETH/ETH", type: "LP", entry: "-", exit: "-", pnl: "+0.8%" }
    ]
  },
  {
    id: "t3",
    name: "NFT_Degen",
    ens: "sweep.eth",
    avatar: "https://api.dicebear.com/8.x/shapes/svg?seed=sweep",
    bio: "NFT flipping, presale mints, and fractionalized assets.",
    strategy: "NFT",
    riskScore: 9,
    winRate: 48.0,
    totalTrades: 890,
    avgDuration: "1 day",
    maxDrawdown: "-45.0%",
    followers: 4100,
    tvl: "850.25 ETH",
    roi30d: 15.2,
    roi90d: 85.0,
    sparklineData: [50, 40, 60, 30, 80, 50, 90, 70, 110, 80, 130, 100],
    recentTrades: [
      { pair: "PUDGY/ETH", type: "BUY", entry: "12.5 ETH", exit: "14.2 ETH", pnl: "+13.6%" },
      { pair: "MILADY/ETH", type: "SELL", entry: "3.2 ETH", exit: "2.8 ETH", pnl: "-12.5%" }
    ]
  },
  {
    id: "t4",
    name: "ArbBot",
    ens: "arbitrage.eth",
    avatar: "https://api.dicebear.com/8.x/shapes/svg?seed=arb",
    bio: "Automated statistical arbitrage across DEXes. Low risk.",
    strategy: "Arbitrage",
    riskScore: 2,
    winRate: 98.5,
    totalTrades: 5400,
    avgDuration: "1 min",
    maxDrawdown: "-1.5%",
    followers: 25000,
    tvl: "18,400.00 ETH",
    roi30d: 2.8,
    roi90d: 8.5,
    sparklineData: [5, 5.2, 5.5, 5.8, 6.0, 6.3, 6.6, 6.9, 7.2, 7.5, 7.8, 8.1],
    recentTrades: [
      { pair: "UNI/ETH", type: "ARB", entry: "-", exit: "-", pnl: "+0.1%" },
      { pair: "AAVE/ETH", type: "ARB", entry: "-", exit: "-", pnl: "+0.05%" }
    ]
  }
];

export function getTrader(id) {
  return traders.find(t => t.id === id);
}

export function getTopTraders() {
  return [...traders].sort((a, b) => b.roi90d - a.roi90d);
}
