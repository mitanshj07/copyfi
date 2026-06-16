import { getTopTraders } from '../data/traders.js';
import { createSparkline } from '../components/charts.js';
import { showCopyModal } from '../components/modals.js';

export function renderExplore(container) {
  const traders = getTopTraders();

  container.innerHTML = `
    <div class="topbar">
      <h1 class="page-title">Explore Traders</h1>
    </div>

    <!-- Search & Filter -->
    <div class="search-filter-bar">
      <div style="flex: 1; display: flex; align-items: center; gap: 8px;">
        <span style="color: var(--color-text-muted);">🔍</span>
        <input type="text" class="search-input" placeholder="Search by name, address, or ENS...">
      </div>
      <div style="width: 1px; background: rgba(255,255,255,0.1); margin: 0 8px;"></div>
      <select class="filter-select">
        <option value="all">All Strategies</option>
        <option value="defi">DeFi Yield</option>
        <option value="momentum">Momentum</option>
        <option value="nft">NFT</option>
        <option value="arbitrage">Arbitrage</option>
      </select>
      <select class="filter-select">
        <option value="roi">Sort by: ROI (90d)</option>
        <option value="tvl">Sort by: TVL</option>
        <option value="followers">Sort by: Followers</option>
        <option value="risk">Sort by: Lowest Risk</option>
      </select>
    </div>

    <!-- Trader Grid -->
    <div class="grid-3" id="trader-grid">
      ${traders.map(t => `
        <div class="glass-card trader-card">
          <div class="trader-header">
            <div class="trader-info">
              <img src="${t.avatar}" class="avatar" />
              <div>
                <div class="trader-name">${t.name}</div>
                <div class="trader-ens">${t.ens}</div>
              </div>
            </div>
            <div class="badge ${t.roi30d >= 0 ? 'success' : 'danger'}">
              ${t.roi30d >= 0 ? '+' : ''}${t.roi30d}% (30d)
            </div>
          </div>
          
          <div style="height: 60px; margin-top: 8px;">
            <canvas id="sparkline-${t.id}"></canvas>
          </div>
          
          <div class="trader-stats-grid">
            <div class="mini-stat">
              <span class="mini-stat-label">Strategy</span>
              <span class="mini-stat-value">${t.strategy}</span>
            </div>
            <div class="mini-stat">
              <span class="mini-stat-label">Risk (1-10)</span>
              <span class="mini-stat-value ${t.riskScore > 7 ? 'value-negative' : t.riskScore > 4 ? 'value-warning' : 'value-positive'}">${t.riskScore}</span>
            </div>
            <div class="mini-stat">
              <span class="mini-stat-label">Win Rate</span>
              <span class="mini-stat-value">${t.winRate}%</span>
            </div>
            <div class="mini-stat">
              <span class="mini-stat-label">Followers</span>
              <span class="mini-stat-value">${t.followers.toLocaleString()}</span>
            </div>
          </div>
          
          <div style="display: flex; gap: 12px; margin-top: auto;">
            <a href="#/trader/${t.id}" class="btn btn-secondary" style="flex: 1;">View Profile</a>
            <button class="btn btn-primary btn-copy" data-id="${t.id}" style="flex: 1;">Copy</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Draw sparklines and attach events
  setTimeout(() => {
    traders.forEach(t => {
      const ctx = document.getElementById(`sparkline-${t.id}`);
      if (ctx) {
        // determine color based on overall trend
        const color = t.sparklineData[t.sparklineData.length-1] >= t.sparklineData[0] ? '#14b8a6' : '#ef4444';
        createSparkline(ctx, t.sparklineData, color);
      }
    });

    // Attach copy button listeners
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const trader = traders.find(t => t.id === id);
        showCopyModal(trader);
      });
    });
  }, 0);
}
