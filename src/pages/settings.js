import { walletState } from '../wallet.js';
import { showToast } from '../components/toast.js';

export function renderSettings(container) {
  container.innerHTML = `
    <div class="topbar">
      <h1 class="page-title">Settings & Subscription</h1>
    </div>

    <div class="grid-2" style="margin-bottom: 40px;">
      <div class="glass-card">
        <h3 style="margin-bottom: 24px;">Wallet & Smart Account</h3>
        ${walletState.isConnected ? `
          <div style="margin-bottom: 16px;">
            <div style="color: var(--color-text-secondary); font-size: 0.875rem; margin-bottom: 4px;">Connected Address</div>
            <div style="font-family: monospace; font-size: 1.125rem; background: var(--color-bg-surface); padding: 12px; border-radius: var(--radius-sm); border: var(--border-subtle);">
              ${walletState.address}
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: rgba(20, 184, 166, 0.1); border: 1px solid rgba(20, 184, 166, 0.3); border-radius: var(--radius-sm);">
            <div>
              <div style="font-weight: 600; color: var(--color-success); margin-bottom: 4px;">Smart Account Active</div>
              <div style="font-size: 0.875rem; color: var(--color-text-secondary);">EIP-7702 Upgrade Enabled</div>
            </div>
            <span style="font-size: 2rem;">🛡️</span>
          </div>
        ` : `
          <div style="text-align: center; padding: 32px; background: var(--color-bg-surface); border-radius: var(--radius-sm);">
            <p style="color: var(--color-text-secondary); margin-bottom: 16px;">Connect your wallet to manage settings.</p>
            <button class="btn btn-primary" onclick="document.getElementById('btn-connect')?.click()">Connect Wallet</button>
          </div>
        `}
      </div>

      <div class="glass-card">
        <h3 style="margin-bottom: 24px;">Global Risk Limits</h3>
        <div class="input-group">
          <label>Maximum Copy Amount (ETH)</label>
          <input type="number" class="input-field" value="5.0">
        </div>
        <div class="input-group">
          <label>Global Stop-Loss (%)</label>
          <input type="number" class="input-field" value="-25">
          <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 4px;">
            If a vault drops below this threshold, your position will be automatically liquidated.
          </div>
        </div>
        <button class="btn btn-secondary" style="margin-top: 8px;">Save Limits</button>
      </div>
    </div>

    <h2 style="margin-bottom: 16px; text-align: center;">Subscription Tiers</h2>
    <p style="text-align: center; color: var(--color-text-secondary); max-width: 600px; margin: 0 auto 40px;">
      Upgrade to Pro or Elite to reduce your performance fees and access exclusive smart-money traders.
    </p>

    <div class="subscription-cards">
      <!-- Free Tier -->
      <div class="glass-card tier-card">
        <h3>Free</h3>
        <div class="tier-price">$0<span>/mo</span></div>
        <ul class="tier-features">
          <li>2 Active Copies</li>
          <li>20% Performance Fee</li>
          <li>Standard Traders</li>
          <li>Standard UI</li>
        </ul>
        <button class="btn btn-secondary" style="margin-top: auto;" disabled>Current Plan</button>
      </div>

      <!-- Pro Tier -->
      <div class="glass-card tier-card pro">
        <h3 style="color: var(--color-primary);">Pro</h3>
        <div class="tier-price">$29<span>/mo</span></div>
        <ul class="tier-features">
          <li>10 Active Copies</li>
          <li><strong>15% Performance Fee</strong></li>
          <li>Verified Traders</li>
          <li>Real-time Alerts</li>
        </ul>
        <button class="btn btn-primary btn-upgrade" style="margin-top: auto;" data-tier="Pro">Upgrade via NFT</button>
      </div>

      <!-- Elite Tier -->
      <div class="glass-card tier-card">
        <h3 style="color: oklch(0.65 0.2 300);">Elite</h3>
        <div class="tier-price">$99<span>/mo</span></div>
        <ul class="tier-features">
          <li>Unlimited Copies</li>
          <li><strong>10% Performance Fee</strong></li>
          <li>Exclusive Institutional Traders</li>
          <li>API Access</li>
        </ul>
        <button class="btn btn-secondary btn-upgrade" style="margin-top: auto;" data-tier="Elite">Upgrade via NFT</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    document.querySelectorAll('.btn-upgrade').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!walletState.isConnected) {
          showToast('Connect wallet to upgrade', 'error');
          return;
        }
        const tier = e.target.getAttribute('data-tier');
        e.target.innerHTML = 'Minting NFT...';
        e.target.disabled = true;
        
        setTimeout(() => {
          showToast(`Successfully upgraded to ${tier} tier!`, 'success');
          e.target.innerHTML = 'Current Plan';
        }, 1500);
      });
    });
  }, 0);
}
