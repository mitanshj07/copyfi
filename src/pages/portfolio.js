import { portfolio, getPortfolioCopies } from '../data/portfolio.js';
import { createAreaChart } from '../components/charts.js';
import { showToast } from '../components/toast.js';

export function renderPortfolio(container) {
  const copies = getPortfolioCopies();

  container.innerHTML = `
    <div class="topbar">
      <h1 class="page-title">My Portfolio</h1>
    </div>

    <!-- Portfolio Summary -->
    <div class="glass-card" style="margin-bottom: 40px; background: linear-gradient(135deg, rgba(64, 150, 255, 0.1), transparent);">
      <div style="display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <div style="color: var(--color-text-secondary); margin-bottom: 8px;">Total Balance</div>
          <div style="font-size: 3rem; font-weight: 700; font-family: var(--font-heading); line-height: 1;">
            $${portfolio.totalValue.toLocaleString()}
          </div>
        </div>
        <div style="text-align: right;">
          <div style="color: var(--color-text-secondary); margin-bottom: 8px;">All Time Profit</div>
          <div class="value-positive" style="font-size: 1.5rem; font-weight: 600;">
            +$${portfolio.totalPnl.toLocaleString()} (${portfolio.totalPnlPercent}%)
          </div>
        </div>
      </div>
    </div>

    <h2 style="margin-bottom: 24px; font-size: 1.5rem;">Active Vaults</h2>

    <div class="grid-2">
      ${copies.length === 0 ? `
        <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 48px;">
          <div style="font-size: 3rem; margin-bottom: 16px;">👻</div>
          <h3 style="margin-bottom: 8px;">No active copies</h3>
          <p style="color: var(--color-text-secondary); margin-bottom: 24px;">Start copying top traders to build your portfolio.</p>
          <a href="#/explore" class="btn btn-primary">Explore Traders</a>
        </div>
      ` : copies.map(c => `
        <div class="glass-card" style="display: flex; flex-direction: column; gap: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="display: flex; gap: 16px; align-items: center;">
              <img src="${c.trader.avatar}" class="avatar" />
              <div>
                <div style="font-weight: 700; font-size: 1.125rem;">${c.trader.name}</div>
                <div style="color: var(--color-text-secondary); font-size: 0.875rem;">${c.trader.strategy}</div>
              </div>
            </div>
            <a href="#/vault/${c.vaultId}" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.875rem;">Manage</a>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: var(--color-bg-surface); padding: 16px; border-radius: var(--radius-sm);">
            <div>
              <div style="color: var(--color-text-secondary); font-size: 0.75rem; margin-bottom: 4px;">Current Value</div>
              <div style="font-weight: 700; font-size: 1.25rem;">$${c.currentValueUsd.toLocaleString()}</div>
            </div>
            <div>
              <div style="color: var(--color-text-secondary); font-size: 0.75rem; margin-bottom: 4px;">PnL</div>
              <div class="${c.pnlPercent >= 0 ? 'value-positive' : 'value-negative'}" style="font-weight: 700; font-size: 1.25rem;">
                ${c.pnlPercent >= 0 ? '+' : ''}${c.pnlPercent}%
              </div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--color-text-secondary); border-top: var(--border-subtle); padding-top: 16px;">
            <span>Initial Deposit: ${c.depositAmount}</span>
            <span>Fee Accrued: $${c.performanceFeeAccrued.toFixed(2)}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
