import { getTrader } from '../data/traders.js';
import { createAreaChart } from '../components/charts.js';
import { showCopyModal } from '../components/modals.js';

export function renderTrader(container, id) {
  const t = getTrader(id);
  
  if (!t) {
    container.innerHTML = `<h1>Trader not found</h1>`;
    return;
  }

  container.innerHTML = `
    <div style="margin-bottom: 24px;">
      <a href="#/explore" style="display: inline-flex; align-items: center; gap: 8px; color: var(--color-text-secondary);">
        <span>←</span> Back to Explore
      </a>
    </div>

    <div class="profile-header">
      <img src="${t.avatar}" class="avatar lg" />
      <div class="profile-details" style="flex: 1;">
        <h1>${t.name}</h1>
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <span class="badge" style="background: var(--color-bg-elevated);">${t.ens}</span>
          <span class="badge" style="background: var(--color-bg-elevated);">${t.strategy} Strategy</span>
        </div>
        <p class="profile-bio">${t.bio}</p>
      </div>
      <div class="profile-actions glass-card">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--color-text-secondary);">Vault TVL</span>
          <span style="font-weight: 700;">${t.tvl}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
          <span style="color: var(--color-text-secondary);">Followers</span>
          <span style="font-weight: 700;">${t.followers.toLocaleString()}</span>
        </div>
        <button id="profile-copy-btn" class="btn btn-primary" style="width: 100%; font-size: 1.1rem; padding: 12px;">
          Copy Trader
        </button>
      </div>
    </div>

    <div class="grid-4" style="margin-bottom: 40px;">
      <div class="glass-card stat-card">
        <span class="stat-label">90d ROI</span>
        <span class="stat-value ${t.roi90d >= 0 ? 'value-positive' : 'value-negative'}">${t.roi90d >= 0 ? '+' : ''}${t.roi90d}%</span>
      </div>
      <div class="glass-card stat-card">
        <span class="stat-label">Win Rate</span>
        <span class="stat-value">${t.winRate}%</span>
      </div>
      <div class="glass-card stat-card">
        <span class="stat-label">Max Drawdown</span>
        <span class="stat-value value-negative">${t.maxDrawdown}</span>
      </div>
      <div class="glass-card stat-card">
        <span class="stat-label">Total Trades</span>
        <span class="stat-value">${t.totalTrades}</span>
      </div>
    </div>

    <div class="glass-card" style="margin-bottom: 40px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h3 style="margin: 0; font-size: 1.25rem;">Performance History</h3>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary" style="padding: 4px 12px; font-size: 0.75rem;">1M</button>
          <button class="btn btn-primary" style="padding: 4px 12px; font-size: 0.75rem;">3M</button>
          <button class="btn btn-secondary" style="padding: 4px 12px; font-size: 0.75rem;">All</button>
        </div>
      </div>
      <div class="chart-container" style="height: 400px;">
        <canvas id="traderPnlChart"></canvas>
      </div>
    </div>

    <div class="glass-card" style="padding: 0; overflow: hidden;">
      <div style="padding: 24px; border-bottom: var(--border-subtle);">
        <h3 style="margin: 0; font-size: 1.125rem;">Recent Trades</h3>
      </div>
      <div style="overflow-x: auto;">
        <table class="data-table" style="margin: 0; border-spacing: 0;">
          <thead>
            <tr>
              <th style="padding-left: 24px;">Pair / Asset</th>
              <th>Type</th>
              <th>Entry</th>
              <th>Exit</th>
              <th style="padding-right: 24px; text-align: right;">PnL</th>
            </tr>
          </thead>
          <tbody>
            ${t.recentTrades.map(trade => `
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding-left: 24px; font-weight: 500;">${trade.pair}</td>
                <td><span class="badge" style="background: var(--color-bg-elevated);">${trade.type}</span></td>
                <td>${trade.entry}</td>
                <td>${trade.exit}</td>
                <td style="padding-right: 24px; text-align: right;" class="${trade.pnl.startsWith('+') ? 'value-positive' : 'value-negative'}">
                  ${trade.pnl}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setTimeout(() => {
    const ctx = document.getElementById('traderPnlChart');
    if (ctx) {
      const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      createAreaChart(ctx, labels, t.sparklineData);
    }

    document.getElementById('profile-copy-btn').addEventListener('click', () => {
      showCopyModal(t);
    });
  }, 0);
}
