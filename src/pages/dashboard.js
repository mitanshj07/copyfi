import { portfolio, getPortfolioCopies } from '../data/portfolio.js';
import { marketData } from '../data/market.js';
import { createAreaChart, createDoughnutChart } from '../components/charts.js';

export function renderDashboard(container) {
  const copies = getPortfolioCopies();
  
  container.innerHTML = `
    <div class="topbar">
      <h1 class="page-title">Dashboard</h1>
      <div class="topbar-actions">
        <div class="badge success">Live Simulated Data</div>
      </div>
    </div>

    <!-- Top Stats -->
    <div class="dashboard-stats grid-4">
      <div class="glass-card stat-card">
        <span class="stat-label">Total Portfolio Value</span>
        <span class="stat-value">$${portfolio.totalValue.toLocaleString()}</span>
        <span class="value-positive text-sm" style="font-size: 0.875rem;">+${portfolio.totalPnlPercent}% All Time</span>
      </div>
      <div class="glass-card stat-card">
        <span class="stat-label">Total Profit</span>
        <span class="stat-value value-positive">+$${portfolio.totalPnl.toLocaleString()}</span>
      </div>
      <div class="glass-card stat-card">
        <span class="stat-label">Active Copies</span>
        <span class="stat-value">${copies.length}</span>
      </div>
      <div class="glass-card stat-card">
        <span class="stat-label">Platform TVL</span>
        <span class="stat-value">$145M+</span>
      </div>
    </div>

    <!-- Charts -->
    <div class="dashboard-charts">
      <div class="glass-card">
        <h3 style="margin-bottom: 16px; font-size: 1.125rem;">Performance History</h3>
        <div class="chart-container">
          <canvas id="mainPnlChart"></canvas>
        </div>
      </div>
      
      <div class="glass-card">
        <h3 style="margin-bottom: 16px; font-size: 1.125rem;">Allocation</h3>
        <div class="chart-container">
          <canvas id="allocationChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Active Positions Table -->
    <div class="glass-card" style="padding: 0; overflow: hidden;">
      <div style="padding: 24px; border-bottom: var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; font-size: 1.125rem;">Active Positions</h3>
        <a href="#/portfolio" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.875rem;">View All</a>
      </div>
      
      <div style="overflow-x: auto;">
        <table class="data-table" style="margin: 0; border-spacing: 0;">
          <thead>
            <tr>
              <th style="padding-left: 24px;">Trader</th>
              <th>Strategy</th>
              <th>Deposit</th>
              <th>Current Value</th>
              <th>PnL</th>
              <th style="padding-right: 24px; text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${copies.map(copy => `
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding-left: 24px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${copy.trader.avatar}" class="avatar sm" />
                    <span style="font-weight: 500;">${copy.trader.name}</span>
                  </div>
                </td>
                <td><span class="badge" style="background: var(--color-bg-elevated);">${copy.trader.strategy}</span></td>
                <td>${copy.depositAmount}</td>
                <td>$${copy.currentValueUsd.toLocaleString()}</td>
                <td class="${copy.pnlPercent >= 0 ? 'value-positive' : 'value-negative'}">
                  ${copy.pnlPercent >= 0 ? '+' : ''}${copy.pnlPercent}%
                </td>
                <td style="padding-right: 24px; text-align: right;">
                  <a href="#/vault/${copy.vaultId}" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.75rem;">Manage</a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Initialize charts after DOM update
  setTimeout(() => {
    const pnlCtx = document.getElementById('mainPnlChart');
    if (pnlCtx) {
      createAreaChart(pnlCtx, portfolio.historyLabels, portfolio.historyData);
    }

    const allocCtx = document.getElementById('allocationChart');
    if (allocCtx) {
      const labels = copies.map(c => c.trader.name);
      const data = copies.map(c => c.currentValueUsd);
      // Generate some nice colors from our palette
      const colors = ['#4096ff', '#8b5cf6', '#14b8a6', '#f59e0b'];
      createDoughnutChart(allocCtx, data, labels, colors.slice(0, data.length));
    }
  }, 0);
}
