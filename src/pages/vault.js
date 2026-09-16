import { getPortfolioCopies, withdrawPortfolioCopy, depositPortfolioCopy } from '../data/portfolio.js';
import { createAreaChart } from '../components/charts.js';
import { walletState, addWalletBalance, deductWalletBalance } from '../wallet.js';
import { showToast } from '../components/toast.js';

export function renderVault(container, vaultId) {
  const copies = getPortfolioCopies();
  const copy = copies.find(c => c.vaultId === vaultId);
  
  if (!copy) {
    container.innerHTML = `<h1>Vault not found</h1>`;
    return;
  }

  const t = copy.trader;

  container.innerHTML = `
    <div style="margin-bottom: 24px;">
      <a href="#/portfolio" style="display: inline-flex; align-items: center; gap: 8px; color: var(--color-text-secondary);">
        <span>←</span> Back to Portfolio
      </a>
    </div>

    <div class="vault-header">
      <div style="display: inline-flex; align-items: center; gap: 12px; margin-bottom: 16px; background: var(--color-bg-surface); padding: 8px 16px; border-radius: var(--radius-full); border: var(--border-subtle);">
        <img src="${t.avatar}" class="avatar sm" />
        <span style="font-weight: 600;">${t.name}'s Vault</span>
      </div>
      <div style="color: var(--color-text-secondary); margin-bottom: 8px;">Your Position Value</div>
      <div class="vault-tvl">$${copy.currentValueUsd.toLocaleString()}</div>
      <div class="${copy.pnlPercent >= 0 ? 'value-positive' : 'value-negative'}" style="font-weight: 600;">
        ${copy.pnlPercent >= 0 ? '+' : ''}${copy.pnlPercent}% PnL
      </div>
    </div>

    <div class="grid-3" style="margin-bottom: 40px;">
      <div class="glass-card stat-card">
        <span class="stat-label">Initial Deposit</span>
        <span class="stat-value" style="font-size: 1.5rem;">${copy.depositAmount}</span>
      </div>
      <div class="glass-card stat-card">
        <span class="stat-label">Shares Owned</span>
        <span class="stat-value" style="font-size: 1.5rem;">${copy.sharesOwned.toFixed(2)}</span>
      </div>
      <div class="glass-card stat-card" style="border-color: var(--color-primary);">
        <span class="stat-label">Pending Performance Fee (20%)</span>
        <span class="stat-value" style="font-size: 1.5rem;">$${copy.performanceFeeAccrued.toFixed(2)}</span>
      </div>
    </div>

    <div class="vault-actions-grid" style="margin-bottom: 40px;">
      <div class="glass-card">
        <h3 style="margin-bottom: 24px;">Deposit More</h3>
        <div class="input-group">
          <label>Amount (ETH)</label>
          <div style="display: flex; gap: 8px;">
            <input type="number" id="deposit-amount" class="input-field" style="flex: 1;" placeholder="0.0" step="0.1" min="0.1">
            <button id="deposit-max-btn" class="btn btn-secondary">Max</button>
          </div>
          <div style="font-size: 0.75rem; color: var(--color-text-muted); text-align: right;">Balance: ${walletState.balance} ETH</div>
        </div>
        <button id="deposit-confirm-btn" class="btn btn-primary" style="width: 100%; margin-top: 16px;">Deposit</button>
      </div>

      <div class="glass-card">
        <h3 style="margin-bottom: 24px;">Withdraw</h3>
        <div class="input-group">
          <label>Shares to Burn</label>
          <div style="display: flex; gap: 8px;">
            <input type="number" id="burn-amount" class="input-field" style="flex: 1;" placeholder="0.0">
            <button id="burn-max-btn" class="btn btn-secondary">Max</button>
          </div>
        </div>
        <button id="burn-confirm-btn" class="btn btn-secondary" style="width: 100%; margin-top: 16px; border-color: var(--color-danger); color: var(--color-danger);">
          Withdraw Assets
        </button>
        <div style="font-size: 0.75rem; color: var(--color-text-muted); text-align: center; margin-top: 12px;">
          * Performance fee will be automatically deducted on withdrawal
        </div>
      </div>
    </div>

    <div class="glass-card">
      <h3 style="margin-bottom: 24px;">Share Price History</h3>
      <div class="chart-container" style="height: 300px;">
        <canvas id="vaultChart"></canvas>
      </div>
    </div>
  `;

  setTimeout(() => {
    const ctx = document.getElementById('vaultChart');
    if (ctx) {
      // Simulate share price going up
      const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Today'];
      const data = [1.0, 1.05, 1.02, 1.10, 1.12, 1.15];
      createAreaChart(ctx, labels, data);
    }

    document.getElementById('deposit-max-btn')?.addEventListener('click', () => {
      document.getElementById('deposit-amount').value = walletState.balance;
    });

    document.getElementById('deposit-confirm-btn')?.addEventListener('click', () => {
      if (!walletState.isConnected) return showToast('Please connect wallet first', 'error');
      const val = parseFloat(document.getElementById('deposit-amount').value);
      if (isNaN(val) || val <= 0) return showToast('Enter a valid deposit amount', 'error');
      if (val > parseFloat(walletState.balance)) return showToast(`Insufficient balance (${walletState.balance} ETH)`, 'error');
      depositPortfolioCopy(vaultId, val);
      deductWalletBalance(val);
      showToast(`Successfully deposited ${val.toFixed(2)} ETH!`, 'success');
    });

    document.getElementById('burn-max-btn')?.addEventListener('click', () => {
      document.getElementById('burn-amount').value = copy.sharesOwned.toFixed(2);
    });

    document.getElementById('burn-confirm-btn')?.addEventListener('click', () => {
      if (!walletState.isConnected) return showToast('Please connect wallet first', 'error');
      const val = parseFloat(document.getElementById('burn-amount').value);
      if (isNaN(val) || val <= 0 || val > copy.sharesOwned) return showToast('Enter valid shares to burn', 'error');
      if (val >= copy.sharesOwned - 0.001) window.location.hash = '#/portfolio';
      const eth = withdrawPortfolioCopy(vaultId, val);
      addWalletBalance(eth);
      showToast(`Successfully withdrew ${eth.toFixed(2)} ETH!`, 'success');
    });
  }, 0);
}
